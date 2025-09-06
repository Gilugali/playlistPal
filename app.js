import readline from "readline";
import ytdlp from "yt-dlp-exec";
import fs from "fs";
import path from "path";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
// Directories for downloads fill in your desired paths here
const BASE_DIR_PLAYLISTS = "";
const BASE_DIR = "";

if (!fs.existsSync(BASE_DIR)) {
  fs.mkdirSync(BASE_DIR, { recursive: true });
}
if (!fs.existsSync(BASE_DIR_PLAYLISTS)) {
  fs.mkdirSync(BASE_DIR_PLAYLISTS, { recursive: true });
}

function sanitizeFilename(name) {
  return name.replace(/[<>:"/\\|?*]+/g, "").trim();
}

console.log("🎬 PlaylistPal - Made by Gilugali ❤️");

rl.question("Paste playlist or video link: ", async (url) => {
  if (!url) {
    console.log("No URL provided");
    rl.close();

    return;
  }

  try {
    const info = await ytdlp(url, { dumpSingleJson: true, flatPlaylist: true });

    if (!info.entries || info.entries.length === 1) {
      const title = sanitizeFilename(info.title || "video");
      const filePath = path.join(BASE_DIR, `${title}.mp4`);
      console.log("Downloading single video:", title);

      await ytdlp(url, {
        output: filePath,
        format: "mp4",
        mergeOutputFormat: "mp4",
        progress: true,
      });

      console.log("Downloaded to:", filePath);
    } else {
      console.log(`Downloading playlist with ${info.entries.length} videos...`);

      for (const entry of info.entries) {
        const title = sanitizeFilename(entry.title || "video");
        x;
        const filePath = path.join(BASE_DIR_PLAYLISTS, `${title}.mp4`);
        console.log("Downloading:", title);

        await ytdlp(entry.url, {
          output: filePath,
          format: "mp4",
          mergeOutputFormat: "mp4",
        });
      }

      console.log("Playlist download complete!");
    }
  } catch (err) {
    console.error("Download failed:", err);
  }

  rl.close();
});
