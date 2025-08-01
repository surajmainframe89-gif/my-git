const express = require("express");
const axios = require("axios");
let users = require("./MOCK_DATA.json");
const app = express();
const fs = require("fs");
const PORT = 3000;


app.use(express.json());

//2. Endpoint to receive processed result from Databricks simulation
//   only when callback request is made
app.post("/callback", (req, res) => {
  const result = req.body;

  // Write the result to MOCK_DATA_out.json
  fs.writeFile("./MOCK_DATA_out.json", JSON.stringify(result, null, 2), (err, data) => {

    console.log("✅ Received processed data from Databricks and saved to MOCK_DATA_out.json");
    res.sendStatus(200);
  })

});

//1. Starts from here
app.listen(PORT, () => {
    console.log(`📡 Node.js server listening at http://localhost:${PORT}`);
  
    // Reads using fs.readFile with callback
    fs.readFile("./MOCK_DATA.json", "utf8", (err, data) => {
      if (err) {
        console.error("❌ Failed to read MOCK_DATA.json:", err);
        return;
      }
  
      try {
        const parsedData = JSON.parse(data); // Parse the JSON data
  
        // Send data to Databricks simulation
        axios.post("http://localhost:5000/process", {
          data: parsedData,
          callbackUrl: `http://localhost:${PORT}/callback`
        })
        .then(() => {
          console.log("📨 Sent data to simulated Databricks");
        })
        .catch((err) => {
          console.error("❌ Failed to send data:", err.message);
        });
      } catch (parseError) {
        console.error("❌ Failed to parse JSON:", parseError);
      }
    });
  });