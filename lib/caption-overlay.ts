'use client';

type CaptionStyle = {
  width: number;
  height: number;
  position: 'top' | 'center' | 'bottom';
  color: string;
  fontSize: number;
  boxOpacity: number;
};

function wrapLines(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const output: string[] = [];
  for (const paragraph of text.split(/\r?\n/)) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (!words.length) {
      output.push('');
      continue;
    }
    let line = words[0];
    for (const word of words.slice(1)) {
      const candidate = `${line} ${word}`;
      if (context.measureText(candidate).width <= maxWidth) line = candidate;
      else {
        output.push(line);
        line = word;
      }
    }
    output.push(line);
  }
  return output.slice(0, 5);
}

export async function renderCaptionOverlay(text: string, style: CaptionStyle, index: number) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(2, style.width);
  canvas.height = Math.max(2, style.height);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser could not prepare the caption overlay.');

  const fontSize = Math.max(22, Math.round(canvas.height * (style.fontSize / 100)));
  const horizontalPadding = Math.round(fontSize * 0.65);
  const verticalPadding = Math.round(fontSize * 0.38);
  const lineHeight = Math.round(fontSize * 1.18);
  context.font = `700 ${fontSize}px Arial, Helvetica, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  const lines = wrapLines(context, text, canvas.width * 0.82);
  const widest = Math.max(...lines.map((line) => context.measureText(line).width), fontSize * 2);
  const boxWidth = Math.min(canvas.width * 0.92, widest + horizontalPadding * 2);
  const boxHeight = lines.length * lineHeight + verticalPadding * 2;
  const centerY = style.position === 'top'
    ? canvas.height * 0.14
    : style.position === 'center'
      ? canvas.height * 0.5
      : canvas.height * 0.84;
  const left = (canvas.width - boxWidth) / 2;
  const top = Math.max(0, Math.min(canvas.height - boxHeight, centerY - boxHeight / 2));
  const radius = Math.min(fontSize * 0.32, boxHeight / 2);

  context.fillStyle = `rgba(0,0,0,${Math.max(0, Math.min(0.9, style.boxOpacity))})`;
  context.beginPath();
  context.roundRect(left, top, boxWidth, boxHeight, radius);
  context.fill();
  context.fillStyle = style.color;
  context.shadowColor = 'rgba(0,0,0,.7)';
  context.shadowBlur = Math.max(2, fontSize * 0.09);
  context.lineWidth = Math.max(1, fontSize * 0.035);
  context.strokeStyle = 'rgba(0,0,0,.65)';

  lines.forEach((line, lineIndex) => {
    const y = top + verticalPadding + lineHeight * (lineIndex + 0.5);
    context.strokeText(line, canvas.width / 2, y);
    context.fillText(line, canvas.width / 2, y);
  });

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('The caption overlay could not be created.');
  return new File([blob], `caption-${index + 1}.png`, { type: 'image/png' });
}
