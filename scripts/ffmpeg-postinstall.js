/*
 Postinstall check for ffmpeg
 - Resolves ffmpeg path from env, ffmpeg-static, or @ffmpeg-installer/ffmpeg
 - Prints a friendly message so users know ffmpeg is available
 This runs automatically after `npm install`.
*/

const path = require('path');

function resolveFfmpegPath() {
  // 1) Respect env override
  if (process.env.FFMPEG_PATH && process.env.FFMPEG_PATH.trim()) {
    return { path: process.env.FFMPEG_PATH, source: 'FFMPEG_PATH (env)' };
  }
  // 2) Try ffmpeg-static
  try {
    const staticPath = require('ffmpeg-static');
    if (staticPath) return { path: staticPath, source: 'ffmpeg-static' };
  } catch (_) {}
  // 3) Try @ffmpeg-installer/ffmpeg (optional)
  try {
    const installer = require('@ffmpeg-installer/ffmpeg');
    if (installer && installer.path) {
      return { path: installer.path, source: '@ffmpeg-installer/ffmpeg' };
    }
  } catch (_) {}
  return { path: null, source: null };
}

(function run() {
  const { path: ffpath, source } = resolveFfmpegPath();
  if (ffpath) {
    console.log(`[postinstall] FFmpeg resolved from ${source}: ${ffpath}`);
  } else {
    console.warn('[postinstall] FFmpeg not found. The bot will attempt to continue, but audio may fail.');
    console.warn('Set FFMPEG_PATH in .env or install one of: ffmpeg-static, @ffmpeg-installer/ffmpeg');
  }
})();
