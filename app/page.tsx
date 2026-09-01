'use client';
/* oxlint-disable next/no-img-element, jsx-a11y/media-has-caption */

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Aperture,
  ArrowDownToLine,
  ArrowRight,
  AudioLines,
  BadgeCheck,
  Check,
  CircleX,
  Crop,
  Download,
  FileImage,
  Film,
  Gauge,
  Layers3,
  LockKeyhole,
  Maximize2,
  Menu,
  Music2,
  Pause,
  Play,
  RefreshCw,
  ScanSearch,
  Scissors,
  ShieldCheck,
  Sparkles,
  Upload,
  WandSparkles,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress, ProgressLabel } from '@/components/ui/progress';
import { analyzeVideoFocus } from '@/lib/focus-analysis';
import type { ProcessResult, ToolId } from '@/lib/media-engine';

type ToolDefinition = {
  id: ToolId;
  label: string;
  description: string;
  icon: typeof Film;
  category: 'Video' | 'Photo';
  pro?: boolean;
  multiple?: boolean;
};

const tools: ToolDefinition[] = [
  { id: 'reframe', label: 'Smart reframe', description: 'Motion-aware aspect conversion with a smooth camera path.', icon: ScanSearch, category: 'Video', pro: true },
  { id: 'compress', label: 'Compress', description: 'Make videos smaller while keeping them visually clean.', icon: Aperture, category: 'Video' },
  { id: 'convert', label: 'Convert', description: 'Convert locally between MP4 and WebM.', icon: RefreshCw, category: 'Video' },
  { id: 'trim', label: 'Trim & cut', description: 'Keep only the exact section you need.', icon: Scissors, category: 'Video' },
  { id: 'crop', label: 'Crop & resize', description: 'Resize for social, presentations or custom screens.', icon: Crop, category: 'Video' },
  { id: 'merge', label: 'Merge videos', description: 'Join compatible clips without uploading them.', icon: Layers3, category: 'Video', multiple: true },
  { id: 'speed', label: 'Change speed', description: 'Speed up or slow down video and audio together.', icon: Gauge, category: 'Video' },
  { id: 'audio', label: 'Extract audio', description: 'Save clean MP3 audio from a video.', icon: Music2, category: 'Video' },
  { id: 'gif', label: 'Video to GIF', description: 'Create a smooth looping GIF for sharing.', icon: Play, category: 'Video' },
  { id: 'watermark', label: 'Watermark cleanup', description: 'Remove an authorized visible overlay with local reconstruction.', icon: WandSparkles, category: 'Video', pro: true },
  { id: 'photo-compress', label: 'Compress image', description: 'Reduce image size with a high-quality local encoder.', icon: Aperture, category: 'Photo' },
  { id: 'photo-convert', label: 'Convert image', description: 'Convert JPG, PNG or WebP without an upload.', icon: FileImage, category: 'Photo' },
  { id: 'photo-resize', label: 'Resize image', description: 'Resize precisely with high-quality Lanczos scaling.', icon: Maximize2, category: 'Photo' },
  { id: 'photo-crop', label: 'Crop image', description: 'Create portrait, landscape, square or social crops.', icon: Crop, category: 'Photo' },
  { id: 'photo-watermark', label: 'Photo cleanup', description: 'Clean an authorized watermark or unwanted overlay.', icon: WandSparkles, category: 'Photo', pro: true },
];

const ratios = ['9:16', '16:9', '1:1', '4:5'];
const qualityLabels = { Fast: 'Fast', Pro: 'High', Studio: 'Maximum' } as const;
const cornerPresets = [
  { label: 'Top left', value: { x: 0.03, y: 0.03, width: 0.2, height: 0.1 } },
  { label: 'Top right', value: { x: 0.77, y: 0.03, width: 0.2, height: 0.1 } },
  { label: 'Bottom left', value: { x: 0.03, y: 0.87, width: 0.2, height: 0.1 } },
  { label: 'Bottom right', value: { x: 0.77, y: 0.87, width: 0.2, height: 0.1 } },
];

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(bytes > 100 * 1024 * 1024 ? 0 : 1)} MB`;
};

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeTool, setActiveTool] = useState<ToolId>('reframe');
  const [files, setFiles] = useState<File[]>([]);
  const [sourceUrl, setSourceUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [ratio, setRatio] = useState('9:16');
  const [framing, setFraming] = useState('Smart reframe');
  const [quality, setQuality] = useState<'Fast' | 'Pro' | 'Studio'>('Pro');
  const [format, setFormat] = useState('MP4');
  const [duration, setDuration] = useState(0);
  const [sourceWidth, setSourceWidth] = useState(1920);
  const [sourceHeight, setSourceHeight] = useState(1080);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [resizeWidth, setResizeWidth] = useState(1920);
  const [resizeHeight, setResizeHeight] = useState(1080);
  const [focusX, setFocusX] = useState(0.5);
  const [focusY, setFocusY] = useState(0.5);
  const [cleanupRect, setCleanupRect] = useState(cornerPresets[3].value);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);

  const tool = useMemo(() => tools.find((item) => item.id === activeTool) ?? tools[0], [activeTool]);
  const isPhoto = tool.category === 'Photo';
  const isCleanup = activeTool === 'watermark' || activeTool === 'photo-watermark';
  const showRatio = activeTool === 'reframe' || activeTool === 'crop' || activeTool === 'photo-crop';
  const showTargetFrame = showRatio;
  const busy = status === 'analyzing' || status === 'processing';

  useEffect(() => {
    const requestedTool = new URLSearchParams(window.location.search).get('tool') as ToolId | null;
    const matchedTool = tools.find((item) => item.id === requestedTool);
    if (matchedTool) queueMicrotask(() => {
      setActiveTool(matchedTool.id);
      setFormat(matchedTool.category === 'Photo' ? 'JPG' : 'MP4');
    });
  }, []);

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [sourceUrl, resultUrl]);

  const chooseTool = (id: ToolId) => {
    const next = tools.find((item) => item.id === id)!;
    const categoryChanged = next.category !== tool.category;
    setActiveTool(id);
    setStatus('idle');
    setStatusText('');
    setResult(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl('');
    if (categoryChanged) {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      setSourceUrl('');
      setFiles([]);
    }
    setFormat(next.category === 'Photo' ? 'JPG' : 'MP4');
    setMobileToolsOpen(false);
  };

  const onFiles = (selected: File[]) => {
    if (!selected.length) return;
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    const accepted = tool.multiple ? selected : [selected[0]];
    setFiles(accepted);
    setSourceUrl(URL.createObjectURL(accepted[0]));
    setResultUrl('');
    setResult(null);
    setStatus('idle');
    setStatusText(accepted[0].size > 750 * 1024 * 1024 ? 'Large file: keep this tab open and close other memory-heavy apps.' : '');
  };

  const runProcess = async () => {
    if (!files.length) {
      inputRef.current?.click();
      return;
    }
    if (isCleanup && !rightsConfirmed) {
      setStatus('error');
      setStatusText('Confirm that you own or are authorized to edit this media.');
      return;
    }

    setResult(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl('');
    setProgress(0);

    try {
      let focusPath;
      if (activeTool === 'reframe' && framing === 'Smart reframe') {
        setStatus('analyzing');
        setStatusText('Finding motion, detail and the smoothest camera path…');
        const analysis = await analyzeVideoFocus(files[0], setProgress);
        focusPath = analysis.points;
        setSourceWidth(analysis.width || sourceWidth);
        setSourceHeight(analysis.height || sourceHeight);
        setDuration(analysis.duration || duration);
        const average = analysis.points.reduce((sum, point) => sum + point.x, 0) / Math.max(1, analysis.points.length);
        setFocusX(average);
      }

      setStatus('processing');
      setProgress(0);
      setStatusText('Loading the private engine and rendering locally…');
      const { processMedia } = await import('@/lib/media-engine');
      const processed = await processMedia(
        files,
        {
          tool: activeTool,
          ratio,
          framing,
          quality,
          format,
          trimStart,
          trimEnd: trimEnd || duration,
          speed,
          mute: false,
          resizeWidth,
          resizeHeight,
          cleanupRect,
          sourceWidth,
          sourceHeight,
          focusX,
          focusY,
          focusPath,
        },
        setProgress,
      );
      const url = URL.createObjectURL(processed.blob);
      setResult(processed);
      setResultUrl(url);
      setStatus('done');
      setProgress(1);
      setStatusText('Finished locally. The original file was not changed.');
    } catch (error) {
      setStatus('error');
      setStatusText(error instanceof Error ? error.message : 'The local process could not be completed.');
    }
  };

  const cancel = async () => {
    const { cancelMediaProcess } = await import('@/lib/media-engine');
    cancelMediaProcess();
    setStatus('idle');
    setProgress(0);
    setStatusText('Processing cancelled. Your original file is untouched.');
  };

  const downloadResult = () => {
    if (!result || !resultUrl) return;
    const anchor = document.createElement('a');
    anchor.href = resultUrl;
    anchor.download = result.fileName;
    anchor.click();
  };

  const actionLabel = activeTool === 'reframe' ? 'Analyze & reframe' : activeTool.includes('watermark') ? 'Clean selected area' : `Run ${tool.label.toLowerCase()}`;
  const previewIsImage = result ? result.mimeType.startsWith('image/') : isPhoto;
  const previewUrl = resultUrl || sourceUrl;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 flex h-16 items-center border-b border-border/80 bg-background/95 px-3 backdrop-blur-xl sm:px-6 lg:px-8">
        <button
          className="mr-2 grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground hover:bg-muted lg:hidden"
          aria-label={mobileToolsOpen ? 'Close all tools menu' : 'Open all tools menu'}
          aria-controls="mobile-tools-menu"
          aria-expanded={mobileToolsOpen}
          onClick={() => setMobileToolsOpen((open) => !open)}
        >
          <Menu className="size-5" />
        </button>
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-[11px] bg-primary text-primary-foreground"><Film className="size-4" /></span>
          <span className="text-[17px] font-bold tracking-[-0.035em]">EditLocal</span>
        </Link>
        <nav className="ml-10 hidden items-center gap-1 text-sm text-muted-foreground md:flex" aria-label="Primary navigation">
          <Link href="/tools" className="rounded-lg bg-muted px-3 py-1.5 font-medium text-foreground">Tools</Link>
          <button className="rounded-lg px-3 py-1.5 hover:bg-muted hover:text-foreground">Queue</button>
          <Link href="/privacy" className="rounded-lg px-3 py-1.5 hover:bg-muted hover:text-foreground">Privacy</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary" className="hidden h-7 px-2.5 text-violet-700 md:flex"><Sparkles /> Free forever</Badge>
          <Badge variant="outline" className="hidden h-7 border-emerald-200 bg-emerald-50 px-2.5 text-emerald-700 sm:flex"><ShieldCheck /> Files stay here</Badge>
          <Button variant="ghost" size="icon" aria-label="Local privacy"><LockKeyhole /></Button>
        </div>
      </header>

      {mobileToolsOpen && (
        <div id="mobile-tools-menu" className="fixed inset-x-0 top-16 z-40 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-background p-4 shadow-2xl lg:hidden">
          <nav className="mb-5 grid grid-cols-3 gap-2" aria-label="Mobile navigation">
            <Link href="/tools" className="grid min-h-11 place-items-center rounded-xl bg-muted px-3 text-sm font-semibold">All tools</Link>
            <Link href="/about" className="grid min-h-11 place-items-center rounded-xl bg-muted px-3 text-sm font-semibold">About</Link>
            <Link href="/privacy" className="grid min-h-11 place-items-center rounded-xl bg-muted px-3 text-sm font-semibold">Privacy</Link>
          </nav>
          {(['Video', 'Photo'] as const).map((category) => (
            <section key={category} className="mb-5 last:mb-0">
              <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{category} tools</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {tools.filter((item) => item.category === category).map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => chooseTool(id)} className={`flex min-h-12 items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold ${activeTool === id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'}`}>
                    <Icon className="size-4 shrink-0" /><span>{label}</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="border-b border-border bg-card px-4 py-2 lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" aria-label="Quick tool selector">
          {tools.map((item) => (
            <button key={item.id} onClick={() => chooseTool(item.id)} className={`min-h-9 shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${activeTool === item.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{item.label}</button>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1540px] grid-cols-1 lg:grid-cols-[244px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100vh-64px)] border-r border-border/80 px-4 py-6 lg:block">
          {(['Video', 'Photo'] as const).map((category) => (
            <div key={category} className={category === 'Photo' ? 'mt-8' : ''}>
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{category} tools</p>
              <div className="space-y-1">
                {tools.filter((item) => item.category === category).map(({ id, label, icon: Icon, pro }) => (
                  <button key={id} onClick={() => chooseTool(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${activeTool === id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                    <Icon className="size-[17px]" /><span>{label}</span>
                    {pro && <span className={`ml-auto rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${activeTool === id ? 'bg-white/15 text-white' : 'bg-violet-100 text-violet-700'}`}>Included</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-10 rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
            <div className="mb-3 grid size-8 place-items-center rounded-xl bg-white text-violet-700 shadow-sm"><Sparkles className="size-4" /></div>
            <p className="text-sm font-semibold tracking-tight">Everything unlocked.</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">No plans, subscriptions, credits, accounts or export limits.</p>
          </div>
        </aside>

        <section className="min-w-0 px-3 py-6 sm:px-7 sm:py-7 lg:px-10 lg:py-9">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">{tool.category} tools <span className="text-border">/</span> {tool.label}</div>
              <h1 className="text-3xl font-bold tracking-[-0.045em] sm:text-[38px]">{tool.label}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[15px]">{tool.description}</p>
            </div>
            <Badge variant="secondary" className="h-7 gap-1.5 px-2.5"><BadgeCheck className="text-emerald-600" /> Local engine</Badge>
          </div>

          <div className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_80px_-52px_rgba(28,25,55,.32)] sm:rounded-[22px] xl:grid-cols-[minmax(0,1.35fr)_400px]">
            <div
              className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-[#121119] p-3 sm:min-h-[540px] sm:p-7 xl:min-h-[640px]"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                onFiles(Array.from(event.dataTransfer.files));
              }}
            >
              <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_50%_10%,#8675ff_0,transparent_38%)]" />
              <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2 sm:left-5 sm:top-5">
                <Badge className="border-white/10 bg-white/10 text-white backdrop-blur">{resultUrl ? 'Result' : 'Preview'}</Badge>
                {files[0] && <Badge className="border-white/10 bg-white/10 text-white/70 backdrop-blur">{sourceWidth} × {sourceHeight}</Badge>}
              </div>

              <div className={`relative flex max-h-[540px] max-w-[92%] items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-black shadow-2xl ${showTargetFrame ? ratio === '16:9' ? 'aspect-video w-[92%]' : ratio === '1:1' ? 'aspect-square h-[74%]' : ratio === '4:5' ? 'aspect-[4/5] h-[82%]' : 'aspect-[9/16] h-[86%]' : 'aspect-video w-[92%]'}`}>
                {previewUrl ? (
                  previewIsImage ? (
                    <img src={previewUrl} alt="Selected local media preview" className={`h-full w-full ${showTargetFrame && framing !== 'Fit entire video' ? 'object-cover' : 'object-contain'}`} onLoad={(event) => {
                      const image = event.currentTarget;
                      if (!resultUrl) {
                        setSourceWidth(image.naturalWidth);
                        setSourceHeight(image.naturalHeight);
                        setResizeWidth(image.naturalWidth);
                        setResizeHeight(image.naturalHeight);
                      }
                    }} />
                  ) : (
                    <video src={previewUrl} controls className={`h-full w-full ${showTargetFrame && framing !== 'Fit entire video' ? 'object-cover' : 'object-contain'}`} onLoadedMetadata={(event) => {
                      const video = event.currentTarget;
                      if (!resultUrl) {
                        setDuration(video.duration || 0);
                        setTrimEnd(video.duration || 0);
                        setSourceWidth(video.videoWidth || 1920);
                        setSourceHeight(video.videoHeight || 1080);
                        setResizeWidth(video.videoWidth || 1920);
                        setResizeHeight(video.videoHeight || 1080);
                      }
                    }} />
                  )
                ) : (
                  <button aria-label={`Choose ${tool.multiple ? 'video clips' : isPhoto ? 'an image' : 'a video'}`} className="group grid h-full min-h-[320px] w-full place-items-center bg-[linear-gradient(145deg,#282337,#131219)] p-5 text-center text-white" onClick={() => inputRef.current?.click()}>
                    <span>
                      <span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/10 transition group-hover:scale-105 group-hover:bg-white/15"><Upload className="size-5" /></span>
                      <span className="block text-sm font-semibold">Drop {tool.multiple ? 'your clips' : isPhoto ? 'an image' : 'a video'} here</span>
                      <span className="mt-1.5 block text-xs text-white/50">or click to browse</span>
                    </span>
                  </button>
                )}

                {showTargetFrame && previewUrl && <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-35">{Array.from({ length: 9 }).map((_, index) => <span key={index} className="border-[.5px] border-white/40" />)}</div>}
                {activeTool === 'reframe' && previewUrl && framing === 'Smart reframe' && !resultUrl && <span className="pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-violet-500 shadow-lg" style={{ left: `${focusX * 100}%`, top: `${focusY * 100}%` }} />}
                {isCleanup && previewUrl && !resultUrl && <div className="pointer-events-none absolute border-2 border-dashed border-rose-400 bg-rose-400/15 shadow-[0_0_0_9999px_rgba(0,0,0,.08)]" style={{ left: `${cleanupRect.x * 100}%`, top: `${cleanupRect.y * 100}%`, width: `${cleanupRect.width * 100}%`, height: `${cleanupRect.height * 100}%` }} />}
              </div>

              <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[11px] text-white/55 sm:bottom-5 sm:left-5 sm:right-5 sm:text-xs">
                <span className="max-w-full truncate sm:max-w-[70%]">{files.length ? `${files.length > 1 ? `${files.length} files` : files[0].name} · ${formatSize(files.reduce((sum, file) => sum + file.size, 0))}` : 'Your file never leaves this device'}</span>
                <span className="hidden items-center gap-1.5 sm:flex"><Maximize2 className="size-3.5" /> Fit preview</span>
              </div>
              <input ref={inputRef} type="file" multiple={tool.multiple} accept={isPhoto ? 'image/*' : 'video/*'} aria-label={`Choose ${tool.multiple ? 'video clips' : isPhoto ? 'an image' : 'a video'}`} className="sr-only" onChange={(event) => onFiles(Array.from(event.target.files ?? []))} />
            </div>

            <div className="flex flex-col border-t border-border xl:border-l xl:border-t-0">
              <div className="flex-1 space-y-6 p-4 sm:p-7 xl:max-h-[700px] xl:overflow-y-auto">
                {showRatio && <fieldset>
                  <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Target ratio</legend>
                  <div className="grid grid-cols-4 gap-2">
                    {ratios.map((value) => <button key={value} onClick={() => setRatio(value)} className={`rounded-xl border px-2 py-2.5 text-sm font-semibold transition ${ratio === value ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-foreground/30'}`}>{value}</button>)}
                  </div>
                </fieldset>}

                {activeTool === 'reframe' && <fieldset>
                  <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Framing method</legend>
                  <div className="space-y-2">
                    {['Smart reframe', 'Background fill', 'Fit entire video'].map((value) => (
                      <button key={value} onClick={() => setFraming(value)} className={`flex min-h-14 w-full items-center rounded-xl border p-3 text-left transition ${framing === value ? 'border-violet-300 bg-violet-50' : 'border-border hover:bg-muted/60'}`}>
                        <span className={`mr-3 grid size-8 place-items-center rounded-lg ${framing === value ? 'bg-violet-600 text-white' : 'bg-muted text-muted-foreground'}`}>{value === 'Smart reframe' ? <ScanSearch className="size-4" /> : value === 'Background fill' ? <Sparkles className="size-4" /> : <Maximize2 className="size-4" />}</span>
                        <span className="min-w-0"><span className="block text-sm font-semibold">{value}</span><span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">{value === 'Smart reframe' ? 'Tracks motion and visual detail' : value === 'Background fill' ? 'Keep every source pixel' : 'Letterbox with no crop'}</span></span>
                        {framing === value && <Check className="ml-auto size-4 text-violet-700" />}
                      </button>
                    ))}
                  </div>
                  {framing === 'Smart reframe' && <div className="mt-4 grid grid-cols-2 gap-4">
                    <label className="text-xs font-medium">Horizontal focus<input aria-label="Horizontal focus" type="range" min="0.1" max="0.9" step="0.01" value={focusX} onChange={(event) => setFocusX(Number(event.target.value))} className="mt-2 w-full accent-violet-600" /></label>
                    <label className="text-xs font-medium">Vertical focus<input aria-label="Vertical focus" type="range" min="0.1" max="0.9" step="0.01" value={focusY} onChange={(event) => setFocusY(Number(event.target.value))} className="mt-2 w-full accent-violet-600" /></label>
                  </div>}
                </fieldset>}

                {(activeTool === 'convert' || activeTool === 'photo-convert') && <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Output format
                  <select value={format} onChange={(event) => setFormat(event.target.value)} className="mt-3 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-violet-300">
                    {(isPhoto ? ['JPG', 'PNG', 'WebP'] : ['MP4', 'WebM']).map((value) => <option key={value}>{value}</option>)}
                  </select>
                </label>}

                {activeTool === 'trim' && <fieldset>
                  <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Keep section</legend>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-xs text-muted-foreground">Start (seconds)<input type="number" min="0" max={trimEnd || duration} step="0.1" value={trimStart} onChange={(event) => setTrimStart(Number(event.target.value))} className="mt-1.5 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground" /></label>
                    <label className="text-xs text-muted-foreground">End (seconds)<input type="number" min={trimStart} max={duration || undefined} step="0.1" value={Number(trimEnd.toFixed(2))} onChange={(event) => setTrimEnd(Number(event.target.value))} className="mt-1.5 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground" /></label>
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">Duration: {duration ? `${duration.toFixed(1)} seconds` : 'load a video to detect'}</p>
                </fieldset>}

                {activeTool === 'speed' && <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Playback speed <span className="float-right text-sm text-foreground">{speed.toFixed(2)}×</span>
                  <input type="range" min="0.5" max="2" step="0.05" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} className="mt-4 w-full accent-violet-600" />
                  <span className="mt-1 flex justify-between text-[10px] font-normal normal-case tracking-normal text-muted-foreground"><span>0.5×</span><span>Normal</span><span>2×</span></span>
                </label>}

                {activeTool === 'photo-resize' && <fieldset>
                  <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Exact size</legend>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-xs text-muted-foreground">Width<input type="number" min="2" value={resizeWidth} onChange={(event) => setResizeWidth(Number(event.target.value))} className="mt-1.5 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground" /></label>
                    <label className="text-xs text-muted-foreground">Height<input type="number" min="2" value={resizeHeight} onChange={(event) => setResizeHeight(Number(event.target.value))} className="mt-1.5 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground" /></label>
                  </div>
                </fieldset>}

                {isCleanup && <fieldset>
                  <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Overlay area</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {cornerPresets.map((preset) => <button key={preset.label} onClick={() => setCleanupRect(preset.value)} className="rounded-xl border border-border px-3 py-2 text-xs font-medium hover:border-violet-300 hover:bg-violet-50">{preset.label}</button>)}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <label className="text-xs font-medium">Area width <span className="float-right text-muted-foreground">{Math.round(cleanupRect.width * 100)}%</span><input type="range" min="0.05" max="0.5" step="0.01" value={cleanupRect.width} onChange={(event) => setCleanupRect((value) => ({ ...value, width: Number(event.target.value), x: Math.min(value.x, 1 - Number(event.target.value)) }))} className="mt-2 w-full accent-rose-500" /></label>
                    <label className="text-xs font-medium">Area height <span className="float-right text-muted-foreground">{Math.round(cleanupRect.height * 100)}%</span><input type="range" min="0.03" max="0.35" step="0.01" value={cleanupRect.height} onChange={(event) => setCleanupRect((value) => ({ ...value, height: Number(event.target.value), y: Math.min(value.y, 1 - Number(event.target.value)) }))} className="mt-2 w-full accent-rose-500" /></label>
                  </div>
                  <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900"><input type="checkbox" checked={rightsConfirmed} onChange={(event) => setRightsConfirmed(event.target.checked)} className="mt-1 accent-amber-700" /><span>I own this media or have permission to remove its visible overlay. This tool does not remove DRM or provenance data.</span></label>
                </fieldset>}

                {activeTool === 'merge' && files.length > 0 && <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Clip order</p>
                  <div className="space-y-2">{files.map((file, index) => <div key={`${file.name}-${index}`} className="flex items-center gap-3 rounded-xl border border-border p-3 text-xs"><span className="grid size-6 place-items-center rounded-lg bg-muted font-semibold">{index + 1}</span><span className="min-w-0 flex-1 truncate font-medium">{file.name}</span><span className="text-muted-foreground">{formatSize(file.size)}</span></div>)}</div>
                </div>}

                {!['audio', 'gif', 'merge', 'trim', 'speed'].includes(activeTool) && <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Quality
                  <span className="mt-3 grid grid-cols-3 gap-2">
                    {(['Fast', 'Pro', 'Studio'] as const).map((value) => <button type="button" key={value} onClick={() => setQuality(value)} className={`rounded-xl border px-2 py-2.5 text-sm font-semibold ${quality === value ? 'border-violet-300 bg-violet-50 text-violet-800' : 'border-border bg-background'}`}>{qualityLabels[value]}</button>)}
                  </span>
                  <span className="mt-2 block text-[11px] font-normal normal-case tracking-normal text-muted-foreground">{quality === 'Fast' ? 'Smaller output and fastest render.' : quality === 'Studio' ? 'Highest detail; best on a powerful computer.' : 'Visually lossless default with balanced processing.'}</span>
                </label>}

                {activeTool === 'audio' && <div className="rounded-xl border border-border bg-muted/40 p-4"><AudioLines className="mb-3 size-5 text-violet-600" /><p className="text-sm font-semibold">High-quality MP3</p><p className="mt-1 text-xs leading-5 text-muted-foreground">The video track is discarded locally and the original audio is encoded at high quality.</p></div>}
                {activeTool === 'gif' && <div className="rounded-xl border border-border bg-muted/40 p-4"><Zap className="mb-3 size-5 text-violet-600" /><p className="text-sm font-semibold">Optimized looping GIF</p><p className="mt-1 text-xs leading-5 text-muted-foreground">12 fps, 640 px wide, with a generated color palette for a cleaner result.</p></div>}
              </div>

              <div className="border-t border-border bg-muted/30 p-4 sm:p-7">
                {busy && <div className="mb-4 rounded-xl border border-violet-100 bg-violet-50 p-3.5">
                  <Progress value={progress * 100} className="gap-2"><ProgressLabel>{status === 'analyzing' ? 'Analyzing locally' : 'Rendering locally'}</ProgressLabel><span className="ml-auto text-sm tabular-nums text-muted-foreground">{Math.round(progress * 100)}%</span></Progress>
                  <p className="mt-2 text-[11px] leading-5 text-violet-900/70">{statusText}</p>
                </div>}
                {status === 'error' && <div className="mb-4 flex gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs leading-5 text-rose-800"><CircleX className="mt-0.5 size-4 shrink-0" />{statusText}</div>}
                {status === 'done' && result && <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3"><span className="grid size-8 place-items-center rounded-full bg-emerald-600 text-white"><Check className="size-4" /></span><span className="min-w-0"><span className="block text-sm font-semibold text-emerald-950">Ready to download</span><span className="block truncate text-[11px] text-emerald-800">{result.fileName} · {formatSize(result.blob.size)}</span></span></div>}

                {busy ? <Button variant="outline" className="h-11 w-full rounded-xl" onClick={cancel}><Pause /> Cancel process</Button> : status === 'done' ? <div className="grid grid-cols-[1fr_auto] gap-2"><Button className="h-11 rounded-xl bg-emerald-600 text-[15px] hover:bg-emerald-700" onClick={downloadResult}><Download /> Download result</Button><Button variant="outline" size="icon-lg" onClick={() => { setStatus('idle'); setResult(null); if (resultUrl) URL.revokeObjectURL(resultUrl); setResultUrl(''); }} aria-label="Create another"><RefreshCw /></Button></div> : <Button className="h-11 w-full rounded-xl bg-violet-600 text-[15px] hover:bg-violet-700" onClick={runProcess}>{files.length ? actionLabel : `Choose ${tool.multiple ? 'clips' : isPhoto ? 'an image' : 'a video'}`} {files.length ? <ArrowRight /> : <ArrowDownToLine />}</Button>}
                <p className="mt-3 text-center text-[11px] text-muted-foreground">Free forever · no upload · no account · no limits</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
