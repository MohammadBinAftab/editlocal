'use client';

export type ToolId =
  | 'reframe'
  | 'compress'
  | 'convert'
  | 'trim'
  | 'crop'
  | 'merge'
  | 'speed'
  | 'audio'
  | 'gif'
  | 'watermark'
  | 'photo-compress'
  | 'photo-convert'
  | 'photo-resize'
  | 'photo-crop'
  | 'photo-watermark';

export type FocusPoint = { time: number; x: number; y: number };

export type ProcessOptions = {
  tool: ToolId;
  ratio: string;
  framing: string;
  quality: 'Fast' | 'Pro' | 'Studio';
  format: string;
  trimStart: number;
  trimEnd: number;
  speed: number;
  mute: boolean;
  resizeWidth: number;
  resizeHeight: number;
  cleanupRect: { x: number; y: number; width: number; height: number };
  sourceWidth: number;
  sourceHeight: number;
  focusX: number;
  focusY: number;
  focusPath?: FocusPoint[];
};

export type ProcessResult = {
  blob: Blob;
  extension: string;
  mimeType: string;
  fileName: string;
};

let ffmpeg: import('@ffmpeg/ffmpeg').FFmpeg | null = null;
let progressListener: ((value: number) => void) | null = null;
let loaded = false;

const mimeFor = (extension: string) => {
  const map: Record<string, string> = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    mp3: 'audio/mpeg',
    gif: 'image/gif',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
  };
  return map[extension] ?? 'application/octet-stream';
};

export async function loadMediaEngine(onProgress?: (value: number) => void) {
  progressListener = onProgress ?? null;
  if (!ffmpeg) {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    ffmpeg = new FFmpeg();
    ffmpeg.on('progress', ({ progress }) => progressListener?.(Math.max(0, Math.min(1, progress))));
  }
  if (!loaded) {
    const root = window.location.origin;
    await ffmpeg.load({
      coreURL: `${root}/ffmpeg/ffmpeg-core.js`,
      wasmURL: `${root}/ffmpeg/ffmpeg-core.wasm`,
    });
    loaded = true;
  }
  return ffmpeg;
}

export function cancelMediaProcess() {
  ffmpeg?.terminate();
  ffmpeg = null;
  loaded = false;
}

function dimensionsFor(ratio: string, quality: ProcessOptions['quality']) {
  const scale = quality === 'Fast' ? 0.5 : quality === 'Studio' ? 4 / 3 : 1;
  const dimensions: Record<string, [number, number]> = {
    '9:16': [1080, 1920],
    '16:9': [1920, 1080],
    '1:1': [1080, 1080],
    '4:5': [1080, 1350],
  };
  const [width, height] = dimensions[ratio] ?? dimensions['9:16'];
  const even = (value: number) => Math.max(2, Math.round((value * scale) / 2) * 2);
  return [even(width), even(height)] as const;
}

function focusExpression(points: FocusPoint[] | undefined, axis: 'x' | 'y', fallback: number) {
  if (!points || points.length < 2) return fallback.toFixed(4);
  const sampled = points.filter((_, index) => index % Math.max(1, Math.floor(points.length / 10)) === 0).slice(0, 12);
  if (sampled[sampled.length - 1] !== points[points.length - 1]) sampled.push(points[points.length - 1]);
  let expression = sampled[sampled.length - 1][axis].toFixed(4);
  for (let index = sampled.length - 2; index >= 0; index -= 1) {
    const a = sampled[index];
    const b = sampled[index + 1];
    const duration = Math.max(0.001, b.time - a.time);
    const interpolation = `${a[axis].toFixed(4)}+(${(b[axis] - a[axis]).toFixed(4)})*(t-${a.time.toFixed(3)})/${duration.toFixed(3)}`;
    expression = `if(lt(t\,${b.time.toFixed(3)})\,${interpolation}\,${expression})`;
  }
  return expression;
}

function reframeFilter(options: ProcessOptions) {
  const [width, height] = dimensionsFor(options.ratio, options.quality);
  if (options.framing === 'Background fill') {
    return `split=2[bg][fg];[bg]scale=${width}:${height}:force_original_aspect_ratio=increase:flags=lanczos,crop=${width}:${height},boxblur=40:5[blur];[fg]scale=${width}:${height}:force_original_aspect_ratio=decrease:flags=lanczos[front];[blur][front]overlay=(W-w)/2:(H-h)/2,setsar=1`;
  }
  if (options.framing === 'Fit entire video') {
    return `scale=${width}:${height}:force_original_aspect_ratio=decrease:flags=lanczos,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=#121119,setsar=1`;
  }
  const xFocus = focusExpression(options.focusPath, 'x', options.focusX);
  const yFocus = focusExpression(options.focusPath, 'y', options.focusY);
  return `scale=${width}:${height}:force_original_aspect_ratio=increase:flags=lanczos,crop=${width}:${height}:x='max(0\,min(iw-ow\,iw*(${xFocus})-ow/2))':y='max(0\,min(ih-oh\,ih*(${yFocus})-oh/2))',setsar=1`;
}

function codecArgs(extension: string, quality: ProcessOptions['quality']) {
  if (extension === 'webm') {
    return ['-c:v', 'libvpx-vp9', '-crf', quality === 'Fast' ? '38' : quality === 'Studio' ? '20' : '28', '-b:v', '0', '-c:a', 'libopus'];
  }
  return ['-c:v', 'libx264', '-preset', quality === 'Studio' ? 'slow' : quality === 'Fast' ? 'ultrafast' : 'medium', '-crf', quality === 'Fast' ? '26' : quality === 'Studio' ? '15' : '18', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart'];
}

function safeExtension(file: File) {
  return file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
}

function outputName(input: File, suffix: string, extension: string) {
  const base = input.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'media';
  return `${base}-${suffix}.${extension}`;
}

export async function processMedia(
  files: File[],
  options: ProcessOptions,
  onProgress?: (value: number) => void,
): Promise<ProcessResult> {
  if (!files.length) throw new Error('Choose at least one file first.');
  const engine = await loadMediaEngine(onProgress);
  const { fetchFile } = await import('@ffmpeg/util');
  const written: string[] = [];
  let output = 'output.mp4';
  let extension = 'mp4';
  let suffix: string = options.tool;
  let args: string[] = [];

  try {
    for (let index = 0; index < files.length; index += 1) {
      const name = `input-${index}.${safeExtension(files[index])}`;
      await engine.writeFile(name, await fetchFile(files[index]));
      written.push(name);
    }

    const input = written[0];
    const imageTool = options.tool.startsWith('photo-');

    if (options.tool === 'merge') {
      const list = written.map((name) => `file '${name}'`).join('\n');
      await engine.writeFile('inputs.txt', new TextEncoder().encode(list));
      written.push('inputs.txt');
      args = ['-f', 'concat', '-safe', '0', '-i', 'inputs.txt', '-c', 'copy', output];
      suffix = 'merged';
    } else if (options.tool === 'audio') {
      extension = 'mp3';
      output = 'output.mp3';
      args = ['-i', input, '-vn', '-c:a', 'libmp3lame', '-q:a', '2', output];
      suffix = 'audio';
    } else if (options.tool === 'gif') {
      extension = 'gif';
      output = 'output.gif';
      args = ['-i', input, '-vf', 'fps=12,scale=640:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse', '-loop', '0', output];
      suffix = 'clip';
    } else if (imageTool) {
      extension = options.format === 'Original' ? (safeExtension(files[0]) === 'jpeg' ? 'jpg' : safeExtension(files[0])) : options.format.toLowerCase();
      if (!['png', 'jpg', 'jpeg', 'webp'].includes(extension)) extension = 'jpg';
      output = `output.${extension}`;
      const filters: string[] = [];
      if (options.tool === 'photo-resize') filters.push(`scale=${Math.max(2, options.resizeWidth)}:${Math.max(2, options.resizeHeight)}:flags=lanczos`);
      if (options.tool === 'photo-crop') filters.push(reframeFilter(options));
      if (options.tool === 'photo-watermark') {
        const x = Math.round(options.cleanupRect.x * options.sourceWidth);
        const y = Math.round(options.cleanupRect.y * options.sourceHeight);
        const w = Math.max(8, Math.round(options.cleanupRect.width * options.sourceWidth));
        const h = Math.max(8, Math.round(options.cleanupRect.height * options.sourceHeight));
        filters.push(`delogo=x=${x}:y=${y}:w=${w}:h=${h}:show=0`);
      }
      args = ['-i', input, ...(filters.length ? ['-vf', filters.join(',')] : []), ...(extension === 'jpg' || extension === 'jpeg' ? ['-q:v', options.quality === 'Fast' ? '7' : options.quality === 'Studio' ? '1' : '3'] : []), output];
      suffix = options.tool.replace('photo-', '');
    } else {
      extension = options.format === 'WebM' ? 'webm' : 'mp4';
      output = `output.${extension}`;
      const beforeInput: string[] = [];
      const afterInput: string[] = [];

      if (options.tool === 'trim') {
        afterInput.push('-ss', Math.max(0, options.trimStart).toFixed(3));
        if (options.trimEnd > options.trimStart) afterInput.push('-to', options.trimEnd.toFixed(3));
      }
      if (options.tool === 'reframe' || options.tool === 'crop') afterInput.push('-vf', reframeFilter(options));
      if (options.tool === 'compress') afterInput.push('-crf', options.quality === 'Fast' ? '30' : options.quality === 'Studio' ? '18' : '23');
      if (options.tool === 'speed') {
        afterInput.push('-filter_complex', `[0:v]setpts=${(1 / options.speed).toFixed(4)}*PTS[v];[0:a]atempo=${options.speed.toFixed(3)}[a]`, '-map', '[v]', '-map', '[a]');
      }
      if (options.tool === 'watermark') {
        const x = Math.round(options.cleanupRect.x * options.sourceWidth);
        const y = Math.round(options.cleanupRect.y * options.sourceHeight);
        const w = Math.max(8, Math.round(options.cleanupRect.width * options.sourceWidth));
        const h = Math.max(8, Math.round(options.cleanupRect.height * options.sourceHeight));
        afterInput.push('-vf', `delogo=x=${x}:y=${y}:w=${w}:h=${h}:show=0`);
      }
      if (options.mute) afterInput.push('-an');
      args = [...beforeInput, '-i', input, ...afterInput, ...codecArgs(extension, options.quality), output];
    }

    const exitCode = await engine.exec(args);
    if (exitCode !== 0) throw new Error('The local media engine could not complete this combination of settings.');
    const data = await engine.readFile(output);
    const bytes = data instanceof Uint8Array ? data : new TextEncoder().encode(data);
    const mimeType = mimeFor(extension);
    return {
      blob: new Blob([bytes.buffer as ArrayBuffer], { type: mimeType }),
      extension,
      mimeType,
      fileName: outputName(files[0], suffix, extension),
    };
  } finally {
    for (const name of [...written, output]) {
      try {
        await engine.deleteFile(name);
      } catch {
        // The engine may already have been cancelled or the file was never created.
      }
    }
  }
}
