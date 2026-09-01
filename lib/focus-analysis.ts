'use client';

import type { FocusPoint } from './media-engine';

export type VideoAnalysis = {
  duration: number;
  width: number;
  height: number;
  points: FocusPoint[];
};

const waitFor = (target: EventTarget, event: string) =>
  new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error(`Timed out waiting for ${event}.`)), 15000);
    target.addEventListener(
      event,
      () => {
        window.clearTimeout(timeout);
        resolve();
      },
      { once: true },
    );
  });

export async function analyzeVideoFocus(file: File, onProgress?: (value: number) => void): Promise<VideoAnalysis> {
  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.preload = 'auto';
  video.muted = true;
  video.playsInline = true;
  video.src = url;

  try {
    if (video.readyState < 1) await waitFor(video, 'loadedmetadata');
    if (video.readyState < 2) await waitFor(video, 'loadeddata');
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const sampleCount = Math.max(8, Math.min(48, Math.ceil(duration * 1.5)));
    const canvas = document.createElement('canvas');
    canvas.width = 96;
    canvas.height = 54;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('This browser cannot create the analysis surface.');

    let previous: Uint8ClampedArray | null = null;
    let smoothX = 0.5;
    let smoothY = 0.5;
    const points: FocusPoint[] = [];

    for (let index = 0; index < sampleCount; index += 1) {
      const time = sampleCount === 1 ? 0 : (duration * index) / (sampleCount - 1);
      if (Math.abs(video.currentTime - time) > 0.025) {
        video.currentTime = Math.min(Math.max(0, time), Math.max(0, duration - 0.02));
        await waitFor(video, 'seeked');
      }
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let total = 0;
      let weightedX = 0;
      let weightedY = 0;

      for (let y = 1; y < canvas.height - 1; y += 2) {
        for (let x = 1; x < canvas.width - 1; x += 2) {
          const pixel = (y * canvas.width + x) * 4;
          const left = pixel - 4;
          const above = pixel - canvas.width * 4;
          const luma = frame[pixel] * 0.299 + frame[pixel + 1] * 0.587 + frame[pixel + 2] * 0.114;
          const leftLuma = frame[left] * 0.299 + frame[left + 1] * 0.587 + frame[left + 2] * 0.114;
          const aboveLuma = frame[above] * 0.299 + frame[above + 1] * 0.587 + frame[above + 2] * 0.114;
          const detail = Math.abs(luma - leftLuma) + Math.abs(luma - aboveLuma);
          const motion = previous
            ? (Math.abs(frame[pixel] - previous[pixel]) + Math.abs(frame[pixel + 1] - previous[pixel + 1]) + Math.abs(frame[pixel + 2] - previous[pixel + 2])) / 3
            : 0;
          const centerBias = 0.7 + 0.3 * (1 - Math.min(1, Math.hypot(x / canvas.width - 0.5, y / canvas.height - 0.5) * 1.5));
          const weight = (detail + motion * 1.8) * centerBias;
          total += weight;
          weightedX += x * weight;
          weightedY += y * weight;
        }
      }

      const measuredX = total > 1 ? weightedX / total / canvas.width : 0.5;
      const measuredY = total > 1 ? weightedY / total / canvas.height : 0.5;
      const smoothing = index === 0 ? 1 : 0.24;
      smoothX += (Math.max(0.12, Math.min(0.88, measuredX)) - smoothX) * smoothing;
      smoothY += (Math.max(0.12, Math.min(0.88, measuredY)) - smoothY) * smoothing;
      points.push({ time, x: smoothX, y: smoothY });
      previous = new Uint8ClampedArray(frame);
      onProgress?.((index + 1) / sampleCount);
    }

    return { duration, width: video.videoWidth, height: video.videoHeight, points };
  } finally {
    video.removeAttribute('src');
    video.load();
    URL.revokeObjectURL(url);
  }
}
