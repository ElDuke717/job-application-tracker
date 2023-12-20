// server.js or app.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import process from "process";

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the server/data directory
const dirname = path.dirname(new URL(import.meta.url).pathname);
app.use('/data', express.static(path.join(dirname, 'data')));

// will append the JSON file
app.post("/save-application", (req, res) => {
  const newApplication = req.body;
  const filePath = path.join(process.cwd(), "data", "jobApplications.json");

  // Read the existing data from the file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file", err);
      return res.status(500).send("Error reading existing applications");
    }

    // Parse the data to JSON, append the new application, then convert back to string
    let applications = [];
    try {
        applications = JSON.parse(data);
        if (!Array.isArray(applications)) {
            applications = []; // Reset to an empty array if parsed data is not an array
        }
    } catch (parseErr) {
        console.error('Error parsing JSON, starting with a new array', parseErr);
        applications = []; // Reset to an empty array if there's a parsing error
    }
    

    applications.push(newApplication);

    // Save the updated applications back to the file
    fs.writeFile(
      filePath,
      JSON.stringify(applications, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing file", writeErr);
          return res.status(500).send("Error saving application");
        }
        res.send("Application saved successfully");
      }
    );
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
