export const siteName = 'EditLocal';
export const siteTagline = 'Free video and photo tools that never upload your files';

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

export type SeoTool = {
  slug: string;
  toolId: string;
  name: string;
  title: string;
  description: string;
  answer: string;
  keywords: string[];
  features: string[];
  steps: string[];
  limitations: string;
  faq: { question: string; answer: string }[];
};

export const seoTools: SeoTool[] = [
  {
    slug: 'video-aspect-ratio-converter',
    toolId: 'reframe',
    name: 'Video Aspect Ratio Converter',
    title: 'Free Video Aspect Ratio Converter — 16:9 to 9:16',
    description: 'Convert 16:9 video to 9:16, square, 4:5, or landscape locally. Smart motion-aware reframing, background fill, and no-upload processing.',
    answer: 'EditLocal converts video between 16:9, 9:16, 1:1, and 4:5 directly in your browser. Its smart mode samples motion and visual detail, calculates a smoothed focal path, and renders the chosen composition locally without uploading the source video.',
    keywords: ['video aspect ratio converter', '16:9 to 9:16 converter', 'landscape to portrait video', 'resize video for TikTok', 'convert video for Reels'],
    features: ['Motion-and-detail focal analysis', 'High-quality Lanczos scaling', 'Smart crop, blurred fill, and full-frame fit', '1080 × 1920 portrait export', 'Manual focal-point override'],
    steps: ['Choose a video from your device.', 'Select 9:16, 16:9, 1:1, or 4:5.', 'Choose smart reframe, background fill, or full-frame fit.', 'Review the local preview and export the finished file.'],
    limitations: 'A differently shaped frame cannot simultaneously preserve every source pixel and fill the destination without cropping, padding, deformation, or generated content. EditLocal shows these options explicitly so you control the trade-off.',
    faq: [
      { question: 'Can I convert 16:9 video to 9:16 without cropping?', answer: 'Yes. Choose Fit Entire Video to preserve the complete frame with padding, or Background Fill to keep the full source over a blurred full-screen background.' },
      { question: 'Does EditLocal upload my video?', answer: 'No. Analysis and export run inside your browser. Vercel Analytics may record the page visit after deployment, but it never receives the media file.' },
      { question: 'Which format is best for Shorts and Reels?', answer: 'A 9:16 frame at 1080 × 1920 is the common full-screen portrait format for YouTube Shorts, Instagram Reels, and TikTok.' },
    ],
  },
  {
    slug: 'compress-video',
    toolId: 'compress',
    name: 'Video Compressor',
    title: 'Compress Video Online Free — Private, No Upload',
    description: 'Compress MP4, MOV, and WebM videos locally with adjustable quality. No account, paid plan, watermark, or server upload.',
    answer: 'EditLocal reduces video file size locally using an FFmpeg WebAssembly encoder. Choose Fast, High, or Maximum quality, then download the compressed result without sending the original video to a server.',
    keywords: ['compress video online free', 'reduce video file size', 'compress MP4 no upload', 'private video compressor'],
    features: ['Adjustable quality presets', 'H.264 video and AAC audio output', 'Original file remains untouched', 'Local progress and cancellation', 'No artificial usage limit'],
    steps: ['Choose the video you want to reduce.', 'Select the quality and size balance.', 'Start local compression.', 'Compare the result size and download.'],
    limitations: 'Smaller files require fewer encoded bits, so very aggressive compression can soften texture or movement. High is the recommended balance; Maximum preserves more detail but produces a larger file.',
    faq: [
      { question: 'Is the video compressor really free?', answer: 'Yes. Every quality setting is unlocked, with no account, credits, trial, watermark, or paid export.' },
      { question: 'Where is my video compressed?', answer: 'The encoder runs in a browser worker on your device. The media is not transferred to EditLocal or Vercel.' },
      { question: 'Why does a long 4K video take time?', answer: 'Video encoding is computationally intensive. Browser speed depends on video length, resolution, codec, available memory, and the device processor.' },
    ],
  },
  {
    slug: 'convert-video',
    toolId: 'convert',
    name: 'Video Converter',
    title: 'Free Video Converter — MP4 and WebM, No Upload',
    description: 'Convert video to MP4 or WebM locally in your browser. Free, private, no signup, no watermark, and no remote file processing.',
    answer: 'EditLocal converts supported video files to MP4 or WebM entirely on your device. The local FFmpeg engine decodes the source and creates a broadly compatible result while preserving the original file.',
    keywords: ['free video converter', 'convert video to MP4', 'WebM to MP4', 'MOV to MP4 private'],
    features: ['MP4 and WebM export', 'H.264, VP9, AAC, and Opus encoding', 'Local WebAssembly processing', 'High-quality conversion presets', 'No file upload queue'],
    steps: ['Choose a supported video file.', 'Select MP4 or WebM.', 'Choose the desired quality.', 'Convert locally and download.'],
    limitations: 'Available input codecs depend on the bundled FFmpeg build. Unusually large or uncommon professional formats can exceed browser memory even though the file never uploads.',
    faq: [
      { question: 'Should I choose MP4 or WebM?', answer: 'Choose MP4 for the widest device and social-platform compatibility. Choose WebM when you prefer an open web-oriented container and VP9 video.' },
      { question: 'Can EditLocal convert MOV to MP4?', answer: 'Many MOV files are supported, depending on the audio and video codecs stored inside the MOV container.' },
      { question: 'Will conversion overwrite my original?', answer: 'No. EditLocal creates a separate downloadable file and does not modify the original.' },
    ],
  },
  {
    slug: 'trim-video',
    toolId: 'trim',
    name: 'Video Trimmer',
    title: 'Trim Video Online Free — Cut Video Privately',
    description: 'Trim a video by exact start and end times in your browser. No upload, account, watermark, paid plan, or remote processing.',
    answer: 'EditLocal trims video to exact start and end timestamps with a local media engine. Choose the section you want to keep, render it on your device, and download a separate trimmed file.',
    keywords: ['trim video online free', 'cut video no upload', 'MP4 trimmer', 'private video cutter'],
    features: ['Precise decimal-second controls', 'Detected source duration', 'Local H.264 export', 'Original media stays unchanged', 'Visible rendering progress'],
    steps: ['Choose a video.', 'Enter the start time.', 'Enter the end time.', 'Render and download the selected section.'],
    limitations: 'Frame-accurate re-encoding takes longer than cutting only at codec keyframes, but it avoids the unpredictable boundaries of simple stream copying.',
    faq: [
      { question: 'Can I trim MP4 without uploading it?', answer: 'Yes. EditLocal reads and trims the MP4 within your browser.' },
      { question: 'Can I use decimal timestamps?', answer: 'Yes. Start and end controls accept tenths of a second for more precise cuts.' },
      { question: 'Does trimming lower quality?', answer: 'EditLocal uses a high-quality export preset. Any required re-encoding can change compressed pixels slightly, while the source file remains untouched.' },
    ],
  },
  {
    slug: 'crop-video',
    toolId: 'crop',
    name: 'Video Cropper',
    title: 'Crop Video Online Free — 9:16, 1:1, 4:5, 16:9',
    description: 'Crop and resize video for TikTok, Reels, Shorts, posts, and landscape screens locally with no upload or watermark.',
    answer: 'EditLocal crops and resizes videos to standard social aspect ratios using high-quality scaling. The preview grid helps position the composition before the browser renders a new local file.',
    keywords: ['crop video online', 'crop video 9:16', 'crop video for Instagram', 'square video cropper'],
    features: ['9:16, 16:9, 1:1, and 4:5 presets', 'Composition grid overlay', 'High-quality scaling filter', 'Portrait and landscape exports', 'No remote storage'],
    steps: ['Load the source video.', 'Choose the destination aspect ratio.', 'Check the crop in the preview grid.', 'Render and download the new composition.'],
    limitations: 'Cropping removes content outside the selected frame. For preservation rather than crop, use Smart Reframe with Background Fill or Fit Entire Video.',
    faq: [
      { question: 'What ratio should I use for TikTok?', answer: 'Use 9:16 for a full-screen vertical TikTok video.' },
      { question: 'What ratio should I use for an Instagram feed post?', answer: 'Use 4:5 for a tall feed post or 1:1 for a square post.' },
      { question: 'Can I crop a video without creating an account?', answer: 'Yes. EditLocal requires no account and processes the crop locally.' },
    ],
  },
  {
    slug: 'merge-videos',
    toolId: 'merge',
    name: 'Video Merger',
    title: 'Merge Videos Online Free — Join Clips Locally',
    description: 'Join compatible video clips locally in your browser. Free, private, no upload, no account, and no watermarked output.',
    answer: 'EditLocal joins compatible clips in the order you select using local stream copying. Because matching streams do not need to be re-encoded, compatible clips can merge quickly without quality loss.',
    keywords: ['merge videos online free', 'join MP4 files', 'combine video clips no upload', 'private video merger'],
    features: ['Multiple-file selection', 'Visible clip order', 'Fast stream-copy merge', 'No recompression for compatible clips', 'Local result download'],
    steps: ['Choose two or more clips.', 'Review their order.', 'Start the local merge.', 'Download the combined video.'],
    limitations: 'Stream-copy merging requires compatible containers, codecs, dimensions, frame rates, and audio layouts. Convert mismatched clips to the same settings before merging.',
    faq: [
      { question: 'Does merging reduce video quality?', answer: 'Compatible clips are stream-copied, so their encoded video is not recompressed.' },
      { question: 'Why might two clips fail to merge?', answer: 'Their codecs, resolution, frame rate, audio format, or stream layout may differ. Convert them to matching MP4 settings first.' },
      { question: 'Are merged clips uploaded?', answer: 'No. The list and files stay in the current browser process.' },
    ],
  },
  {
    slug: 'extract-audio-from-video',
    toolId: 'audio',
    name: 'Audio Extractor',
    title: 'Extract Audio from Video — Free MP3 Converter',
    description: 'Extract high-quality MP3 audio from a local video in your browser. No upload, login, watermark, credits, or paid export.',
    answer: 'EditLocal removes the video track and creates a high-quality MP3 from the source audio entirely on your device. It is useful for interviews, voice notes, lectures, and audio editing workflows.',
    keywords: ['extract audio from video', 'video to MP3 free', 'MP4 to MP3 no upload', 'save audio from video'],
    features: ['High-quality MP3 output', 'Video track discarded locally', 'Works with supported video containers', 'No cloud conversion queue', 'Separate downloadable result'],
    steps: ['Choose a video containing audio.', 'Start Extract Audio.', 'Wait for local processing.', 'Download the MP3 file.'],
    limitations: 'The output quality cannot exceed the source audio. Videos without an audio stream cannot produce an MP3.',
    faq: [
      { question: 'Can I convert MP4 to MP3 for free?', answer: 'Yes. EditLocal has no credits, subscription, trial, or export fee.' },
      { question: 'Does the video get stored?', answer: 'No. The selected video remains local to your browser.' },
      { question: 'What happens to the picture?', answer: 'The video track is excluded. Only the decoded audio is encoded into the MP3 result.' },
    ],
  },
  {
    slug: 'change-video-speed',
    toolId: 'speed',
    name: 'Video Speed Changer',
    title: 'Change Video Speed Online Free — Speed Up or Slow Down',
    description: 'Speed up or slow down video and audio together locally. Change video speed from 0.5× to 2× with no upload, account, or watermark.',
    answer: 'EditLocal changes video playback speed from 0.5× to 2× and keeps the audio timing synchronized. The browser renders the adjusted video on your device, so the original file is never uploaded or overwritten.',
    keywords: ['change video speed online', 'speed up video free', 'slow down video', 'video speed changer no upload'],
    features: ['0.5× to 2× speed control', 'Synchronized video and audio timing', 'High-quality local rendering', 'Original file remains unchanged', 'No account or upload'],
    steps: ['Choose a video from your device.', 'Move the playback speed control.', 'Start the local speed conversion.', 'Preview and download the adjusted video.'],
    limitations: 'Changing speed requires re-encoding and can alter motion smoothness. Very slow playback repeats temporal information, while fast playback removes duration rather than creating new source frames.',
    faq: [
      { question: 'Can I speed up a video without uploading it?', answer: 'Yes. EditLocal changes the video and audio timing entirely in your browser.' },
      { question: 'Does the audio stay synchronized?', answer: 'Yes. Audio tempo is adjusted together with video timing within the supported 0.5× to 2× range.' },
      { question: 'Will my original video change?', answer: 'No. EditLocal creates a separate downloadable result.' },
    ],
  },
  {
    slug: 'video-to-gif',
    toolId: 'gif',
    name: 'Video to GIF Converter',
    title: 'Video to GIF Converter Free — Make GIF Locally',
    description: 'Turn a video into an optimized looping GIF locally. Palette-based conversion, no upload, no signup, and no watermark.',
    answer: 'EditLocal converts a video clip into a looping GIF at 12 frames per second and generates an optimized color palette for a cleaner result. All frames are processed locally in the browser.',
    keywords: ['video to GIF converter', 'MP4 to GIF free', 'make GIF no upload', 'looping GIF maker'],
    features: ['Generated optimized palette', 'Smooth 12 fps loop', '640-pixel sharing width', 'Infinite looping output', 'Local browser conversion'],
    steps: ['Choose a short video clip.', 'Start the GIF conversion.', 'Preview the locally generated animation.', 'Download the looping GIF.'],
    limitations: 'GIF supports a limited color palette and no audio. Long or high-resolution videos can create very large GIF files, so short clips work best.',
    faq: [
      { question: 'Does a GIF include sound?', answer: 'No. The GIF format does not contain audio.' },
      { question: 'Why is my GIF larger than the MP4?', answer: 'Modern video codecs compress motion more efficiently than GIF. Keep clips short for a manageable file size.' },
      { question: 'Is there an EditLocal watermark?', answer: 'No. EditLocal does not add branding to exported media.' },
    ],
  },
  {
    slug: 'remove-watermark-from-video',
    toolId: 'watermark',
    name: 'Authorized Overlay Cleanup',
    title: 'Remove a Watermark from Your Own Video — Local Cleanup',
    description: 'Clean a visible watermark or overlay from media you own or are authorized to edit. Local reconstruction with no upload.',
    answer: 'EditLocal can reconstruct a selected visible overlay area in media you own or have permission to modify. Choose the overlay corner and size, confirm authorization, and process the cleanup locally.',
    keywords: ['remove watermark from own video', 'video overlay cleanup', 'local video inpainting', 'remove logo authorized media'],
    features: ['Four corner presets', 'Adjustable cleanup width and height', 'Visible selection overlay', 'Local FFmpeg reconstruction', 'Authorization confirmation'],
    steps: ['Choose media you own or may legally modify.', 'Select the overlay location and size.', 'Confirm your authorization.', 'Review and download the reconstructed result.'],
    limitations: 'If an overlay permanently covers unique detail, exact original pixels do not exist in the file and must be approximated. Cleanup is not intended for DRM, provenance marks, or media you lack permission to edit.',
    faq: [
      { question: 'Can cleanup recover the exact hidden pixels?', answer: 'Only when surrounding or neighbouring visual information makes recovery possible. Otherwise the covered area is reconstructed and may not match the unknown original exactly.' },
      { question: 'Can I use this on any downloaded video?', answer: 'No. Use it only for media you own or are authorized to modify.' },
      { question: 'Does it remove DRM or authenticity data?', answer: 'No. The tool targets a visible selected overlay and does not remove DRM or provenance systems.' },
    ],
  },
  {
    slug: 'compress-image',
    toolId: 'photo-compress',
    name: 'Image Compressor',
    title: 'Compress Image Online Free — Reduce JPG, PNG and WebP',
    description: 'Compress JPG, PNG, and WebP images locally with adjustable quality. Reduce image size without an upload, account, paid plan, or watermark.',
    answer: 'EditLocal compresses JPG, PNG, and WebP images in your browser with three unlocked quality levels. It creates a separate smaller image on the current device and never sends the original to a conversion server.',
    keywords: ['compress image online free', 'reduce image file size', 'compress JPG no upload', 'private image compressor'],
    features: ['JPG, PNG, and WebP input', 'Three quality levels', 'Local browser encoding', 'Separate downloadable result', 'No file-size credits or paid tier'],
    steps: ['Choose an image from your device.', 'Select Fast, High, or Maximum quality.', 'Run local image compression.', 'Download the compressed image.'],
    limitations: 'Smaller lossy images trade some fine detail for reduced file size. Maximum preserves the most detail; Fast is intended for the smallest practical output.',
    faq: [
      { question: 'Can I compress an image without uploading it?', answer: 'Yes. The browser decodes and encodes the image locally.' },
      { question: 'Which quality should I choose?', answer: 'High is the balanced default. Use Maximum for detail or Fast when output size matters most.' },
      { question: 'Does EditLocal add a watermark?', answer: 'No. Exported images contain no EditLocal branding.' },
    ],
  },
  {
    slug: 'convert-image',
    toolId: 'photo-convert',
    name: 'Image Converter',
    title: 'Convert Image Online Free — JPG, PNG and WebP',
    description: 'Convert images between JPG, PNG, and WebP locally in your browser. Free private conversion with no upload, signup, or watermark.',
    answer: 'EditLocal converts supported images to JPG, PNG, or WebP directly on your device. Select the output format, choose quality, and download a new file without sending the source image to a server.',
    keywords: ['convert image online free', 'JPG to PNG', 'PNG to WebP', 'image converter no upload'],
    features: ['JPG, PNG, and WebP output', 'Adjustable output quality', 'Local canvas and image encoding', 'Original file remains untouched', 'No account or remote queue'],
    steps: ['Choose the source image.', 'Select JPG, PNG, or WebP.', 'Choose the quality level.', 'Convert locally and download.'],
    limitations: 'JPG does not support transparency. Converting a transparent PNG to JPG replaces transparent pixels with a solid background, while lossy formats can discard fine detail.',
    faq: [
      { question: 'Which format is best for photos?', answer: 'JPG is broadly compatible; WebP is often smaller for the web; PNG is useful for transparency and lossless graphics.' },
      { question: 'Can I convert PNG to WebP privately?', answer: 'Yes. The conversion runs locally and the image is not uploaded.' },
      { question: 'Is image conversion free?', answer: 'Yes. All output formats and quality levels are unlocked.' },
    ],
  },
  {
    slug: 'resize-image',
    toolId: 'photo-resize',
    name: 'Image Resizer',
    title: 'Resize Image Online Free — Set Exact Pixel Dimensions',
    description: 'Resize JPG, PNG, and WebP images to exact width and height locally. High-quality scaling with no upload, account, or paid limit.',
    answer: 'EditLocal resizes images to exact pixel dimensions using a high-quality local scaling path. Enter the required width and height, render on your device, and download a separate resized image.',
    keywords: ['resize image online free', 'resize image pixels', 'change image dimensions', 'image resizer no upload'],
    features: ['Exact width and height controls', 'High-quality Lanczos scaling', 'JPG, PNG, and WebP support', 'Local device processing', 'No dimension paywall'],
    steps: ['Choose an image.', 'Enter the required width in pixels.', 'Enter the required height in pixels.', 'Resize locally and download.'],
    limitations: 'Upscaling cannot restore detail that is absent from the source. Very large output dimensions also require more device memory and may take longer to encode.',
    faq: [
      { question: 'Can I resize an image to exact pixels?', answer: 'Yes. Enter an exact width and height in the Resize Image controls.' },
      { question: 'Will resizing improve a blurry image?', answer: 'No. Scaling can increase pixel dimensions but cannot recreate missing source detail.' },
      { question: 'Are resized images uploaded?', answer: 'No. The entire resize operation stays in the browser.' },
    ],
  },
  {
    slug: 'crop-image',
    toolId: 'photo-crop',
    name: 'Image Cropper',
    title: 'Crop Image Online Free — 9:16, 16:9, 1:1 and 4:5',
    description: 'Crop images for portrait, landscape, square, and social formats locally. Free 9:16, 16:9, 1:1, and 4:5 cropping with no upload.',
    answer: 'EditLocal crops images to 9:16, 16:9, 1:1, or 4:5 and shows the destination frame before export. Cropping and high-quality resizing happen locally on the current device.',
    keywords: ['crop image online free', 'crop image 9:16', 'square image cropper', 'crop photo no upload'],
    features: ['9:16, 16:9, 1:1, and 4:5 ratios', 'Visible composition preview', 'High-quality resized output', 'Local image processing', 'No branded export'],
    steps: ['Choose an image.', 'Select the destination ratio.', 'Review the crop in the preview.', 'Export and download the result.'],
    limitations: 'Cropping removes pixels outside the selected composition. Keep a copy of the original if you may need the full frame later.',
    faq: [
      { question: 'Which crop should I use for a profile image?', answer: 'Use 1:1 for a square profile image.' },
      { question: 'Which crop is best for a portrait post?', answer: 'Use 4:5 for a tall feed post or 9:16 for full-screen vertical content.' },
      { question: 'Does cropping happen locally?', answer: 'Yes. The image remains on your device.' },
    ],
  },
  {
    slug: 'remove-watermark-from-image',
    toolId: 'photo-watermark',
    name: 'Authorized Image Overlay Cleanup',
    title: 'Remove a Watermark from Your Own Image — Local Cleanup',
    description: 'Clean a visible watermark or overlay from an image you own or may edit. Local reconstruction with no upload, account, or remote processing.',
    answer: 'EditLocal reconstructs a selected visible overlay area in an image you own or are authorized to modify. Select the overlay corner and dimensions, confirm permission, and export the locally cleaned result.',
    keywords: ['remove watermark from own image', 'image overlay cleanup', 'photo inpainting local', 'remove logo authorized photo'],
    features: ['Four corner presets', 'Adjustable cleanup dimensions', 'Visible selection preview', 'Local reconstruction', 'Required authorization confirmation'],
    steps: ['Choose an image you may legally modify.', 'Select the overlay location and size.', 'Confirm your authorization.', 'Process locally and download the result.'],
    limitations: 'An overlay replaces original pixel information. When the hidden detail is not recoverable from surrounding pixels, the result is an approximation and may need professional manual retouching.',
    faq: [
      { question: 'Can cleanup recover the exact original image?', answer: 'Not always. If unique pixels were permanently covered, they must be approximated from surrounding content.' },
      { question: 'Can I clean any image found online?', answer: 'No. Use this only for images you own or have permission to modify.' },
      { question: 'Is my image uploaded?', answer: 'No. Selection, reconstruction, and export stay on the current device.' },
    ],
  },
];

export function findSeoTool(slug: string) {
  return seoTools.find((tool) => tool.slug === slug);
}
