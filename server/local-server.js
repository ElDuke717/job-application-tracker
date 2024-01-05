// local-server.js, not adapted to work with a database
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import process from "process";
import cron from "node-cron";

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the server/data directory
const dirname = path.dirname(new URL(import.meta.url).pathname);
app.use("/data", express.static(path.join(dirname, "data")));

// Functionality to update applications that are older than two months
// Read job applications from file
function readJobApplications() {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// Write job applications to file
function writeJobApplications(applications) {
  fs.writeFileSync(filePath, JSON.stringify(applications, null, 2));
}

// Update job applications status
function updateJobApplications() {
  const applications = readJobApplications();
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  const updatedApplications = applications.map((app) => {
    if (
      new Date(app.dateSubmitted) < twoMonthsAgo &&
      app.applicationStatus !== "Rejected"
    ) {
      return { ...app, applicationStatus: "Older than two months" };
    }
    return app;
  });

  writeJobApplications(updatedApplications);
}

// Schedule the update job to run once a day
cron.schedule(
  "0 0 * * *",
  () => {
    console.log("Running a job at 00:00 at America/New_York timezone");
    updateJobApplications();
  },
  {
    scheduled: true,
    timezone: "America/New_York",
  }
);


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
      console.error("Error parsing JSON, starting with a new array", parseErr);
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



// Appends contact information to the contacts.json file.
app.post("/save-contact", (req, res) => {
  const newContact = req.body;
  const filePath = path.join(process.cwd(), "data", "contacts.json");

  // Read the existing data from the file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file", err);
      return res.status(500).send("Error reading existing applications");
    }

    // Parse the data to JSON, append the new application, then convert back to string
    let contacts = [];
    try {
      contacts = JSON.parse(data);
      if (!Array.isArray(contacts)) {
        contacts = []; // Reset to an empty array if parsed data is not an array
      }
    } catch (parseErr) {
      console.error("Error parsing JSON, starting with a new array", parseErr);
      contacts = []; // Reset to an empty array if there's a parsing error
    }

    contacts.push(newContact);

    // Save the updated applications back to the file
    fs.writeFile(
      filePath,
      JSON.stringify(contacts, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing file", writeErr);
          return res.status(500).send("Error saving contact");
        }
        res.send("Contact saved successfully");
      }
    );
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
