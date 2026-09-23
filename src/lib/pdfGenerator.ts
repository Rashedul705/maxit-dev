import { exec } from "child_process";

/**
 * Triggers the PDF regeneration script in the background.
 * Uses a small delay to allow the file system / DB to settle before reading.
 */
export function triggerPDFRegeneration() {
  console.log("Triggering background PDF regeneration...");
  
  // Adding a short 2-second delay ensures that any local file writes (like team.json)
  // are completely finished and accessible before the browser tries to render them.
  setTimeout(() => {
    exec("npm run generate-pdf", (error, stdout, stderr) => {
      if (error) {
        console.error("Error regenerating PDF in background:", error);
        return;
      }
      if (stderr) {
        console.error("PDF Regeneration stderr:", stderr);
      }
      console.log("PDF Regeneration stdout:", stdout);
    });
  }, 2000);
}
