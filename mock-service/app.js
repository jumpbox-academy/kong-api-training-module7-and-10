const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

app.get("/v1/hello", (req, res) => {
  res.json({
    version: "v1",
    message: "Hello from Backend V1",
    request_id: req.headers["x-kong-request-id"] || "n/a"
  });
});

app.get("/v2/hello", (req, res) => {
  res.json({
    version: "v2",
    message: "Hello from Backend V2",
    request_id: req.headers["x-kong-request-id"] || "n/a"
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Hello API running on port ${port}`);
});
