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
    slug: 'image-tools',
    toolId: 'photo-compress',
    name: 'Free Image Tools',
    title: 'Free Image Tools — Compress, Convert, Resize and Crop',
    description: 'Compress, convert, resize, crop, and clean your own images locally. Free browser tools with no upload, account, or paid plan.',
    answer: 'EditLocal provides local image compression, JPG/PNG/WebP conversion, exact resizing, social aspect crops, and authorized visible-overlay cleanup. Images are decoded and exported on the current device.',
    keywords: ['free image tools', 'compress image no upload', 'convert JPG PNG WebP', 'resize image locally'],
    features: ['JPG, PNG, and WebP conversion', 'Lanczos image resizing', 'Social crop presets', 'Adjustable quality', 'Authorized overlay cleanup'],
    steps: ['Choose the image operation.', 'Load an image from your device.', 'Set format, dimensions, ratio, or cleanup region.', 'Export and download the result.'],
    limitations: 'Lossy formats such as JPG and WebP may discard detail at lower quality. PNG preserves transparency but can be larger for photographic images.',
    faq: [
      { question: 'Which format should I use?', answer: 'Use JPG for ordinary photos, PNG for lossless graphics or transparency, and WebP for efficient modern web images.' },
      { question: 'Can I resize an image to exact pixels?', answer: 'Yes. Enter the required width and height in the Resize Image tool.' },
      { question: 'Are images uploaded for conversion?', answer: 'No. The image bytes remain on the current device.' },
    ],
  },
];

export function findSeoTool(slug: string) {
  return seoTools.find((tool) => tool.slug === slug);
}
