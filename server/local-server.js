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

// Endpoint to get all job data
// Define a function to read job applications from file
function getJobApplications(searchTerm = '') {
  try {
    const filePath = path.join(process.cwd(), "data", "jobApplications.json");
    const data = fs.readFileSync(filePath, "utf8");
    const applications = JSON.parse(data);

    // If a search term is provided, filter applications by that term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return applications.filter(application =>
        application.jobTitle.toLowerCase().includes(lowerCaseSearchTerm) ||
        application.company.toLowerCase().includes(lowerCaseSearchTerm)
        // More filters could be added if necessary - Job Title and Compnay should work for now.
      );
    }

    return applications;
  } catch (err) {
    console.error("Error reading job applications:", err);
    throw err; // Rethrow the error to handle it in the endpoint
  }
}

// Define a GET endpoint to retrieve all job applications. Accepts search term to search for a specific job listing
app.get("/job-applications", (req, res) => {
  try {
    // Get the search term from query parameters if it exists
    const searchTerm = req.query.search || '';
    const applications = getJobApplications(searchTerm);
    res.json(applications);
  } catch (error) {
    res.status(500).send("Error retrieving job applications");
  }
});


// Endpoint to update an existing job application
app.put("/update-application/:id", (req, res) => {
  const updatedApplication = req.body;
  const applicationId = req.params.id;  // Extract ID from the request URL
  const filePath = path.join(process.cwd(), "data", "jobApplications.json");

  // Read the existing data from the file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file", err);
      return res.status(500).send("Error reading applications");
    }

    // Parse the data to JSON
    let applications;
    try {
      applications = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing JSON", parseErr);
      return res.status(500).send("Error parsing applications data");
    }

    // Find the index of the application to update
    const index = applications.findIndex(app => app.id === applicationId);
    if (index === -1) {
      return res.status(404).send("Application not found");
    }

    // Update the application at the found index
    applications[index] = { ...applications[index], ...updatedApplication };

    // Save the updated applications back to the file
    fs.writeFile(filePath, JSON.stringify(applications, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Error writing file", writeErr);
        return res.status(500).send("Error updating application");
      }
      res.send(applications[index]);  // Return the updated application
    });
  });
});


// Endpoint to get all job data
// Define a function to read job applications from file
function getContacts() {
  try {
    const filePath = path.join(process.cwd(), "data", "contacts.json");
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading job contacts:", err);
    throw err; // Rethrow the error to handle it in the endpoint
  }
}
// GET contacts
app.get("/contacts", (req, res) => {
  try {
    const contacts = getContacts();
    res.json(contacts); // Send the job applications data as JSON
  } catch (error) {
    res.status(500).send("Error retrieving job applications");
  }
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

// Endpoint to update an existing contact
app.put("/contacts/:id", (req, res) => {
  // Check for correct content type (optional but recommended)
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).send('Incorrect content type');
  }

  const updatedContact = req.body;
  const contactId = req.params.id; // Extract ID from the request URL
  const filePath = path.join(process.cwd(), "data", "contacts.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    // Existing error handling...
    
    let contacts;
    try {
      contacts = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing JSON", parseErr);
      return res.status(500).send("Error parsing contacts data");
    }

    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index === -1) {
      return res.status(404).send("Contact not found");
    }

    // Update and validate contact
    contacts[index] = { ...contacts[index], ...updatedContact };
    // Add validation here if needed

    fs.writeFile(filePath, JSON.stringify(contacts, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Error writing file", writeErr);
        return res.status(500).send("Error updating contact");
      }
      res.status(200).send(contacts[index]); // Explicitly send 200 status
    });
  });
});

// Job List Details
// Define a function to read job site data from file
function getJobSites() {
  try {
    const filePath = path.join(process.cwd(), "data", "job-sites.json");
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading job contacts:", err);
    throw err; // Rethrow the error to handle it in the endpoint
  }
}

// GET site from job site list
app.get("/job-site-list", (req, res) => {
  try {
    const contacts = getJobSites();
    res.json(contacts); 
  } catch (error) {
    res.status(500).send("Error retrieving job sites");
  }
});

// Appends site information to the job-site.json file.
app.post("/save-job-site", (req, res) => {
  const newSite = req.body;
  const filePath = path.join(process.cwd(), "data", "job-sites.json");

  // Read the existing data from the file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file", err);
      return res.status(500).send("Error reading existing job sites");
    }

    // Parse the data to JSON, append the new site, then convert back to string
    let sites = [];
    try {
      sites = JSON.parse(data);
      if (!Array.isArray(sites)) {
        sites = []; // Reset to an empty array if parsed data is not an array
      }
    } catch (parseErr) {
      console.error("Error parsing JSON, starting with a new array", parseErr);
      sites = []; // Reset to an empty array if there's a parsing error
    }

    sites.push(newSite);

    // Save the updated applications back to the file
    fs.writeFile(
      filePath,
      JSON.stringify(sites, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing file", writeErr);
          return res.status(500).send("Error saving site");
        }
        res.send("Site saved successfully");
      }
    );
  });
});

// Endpoint to update an existing job site  
app.put("/job-site-list/:id", (req, res) => {
  // Check for correct content type (optional but recommended)
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).send('Incorrect content type');
  }

  const updatedSite = req.body;
  const siteId = req.params.id; // Extract ID from the request URL
  const filePath = path.join(process.cwd(), "data", "job-sites.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    // Existing error handling...
    
    let sites;
    try {
      sites = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing JSON", parseErr);
      return res.status(500).send("Error parsing sites data");
    }

    const index = sites.findIndex(site => site.id === siteId);
    if (index === -1) {
      return res.status(404).send("Contact not found");
    }

    // Update and validate contact
    sites[index] = { ...sites[index], ...updatedSite };
    // Add validation here if needed

    fs.writeFile(filePath, JSON.stringify(sites, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Error writing file", writeErr);
        return res.status(500).send("Error updating site");
      }
      res.status(200).send(sites[index]); // Explicitly send 200 status
    });
  });
});

// Journal Functionality
// GET Journal Entries
function getJournalEntries() {
  try {
    const filePath = path.join(process.cwd(), "data", "journalEntries.json");
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading job contacts:", err);
    throw err; // Rethrow the error to handle it in the endpoint
  }
}

// GET site from journal site list
app.get("/journal-entries", (req, res) => {
  try {
    const contacts = getJournalEntries();
    res.json(contacts); 
  } catch (error) {
    res.status(500).send("Error retrieving journal entries");
  }
});

// POST new journal entry
// Appends site information to the job-site.json file.
app.post("/journal-entries", (req, res) => {
  const newEntry = req.body;
  const filePath = path.join(process.cwd(), "data", "journalEntries.json");

  // Read the existing data from the file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file", err);
      return res.status(500).send("Error reading existing journal entries");
    }

    // Parse the data to JSON, append the new entry, then convert back to string
    let entries = [];
    try {
      entries = JSON.parse(data);
      if (!Array.isArray(entries)) {
        entries = []; // Reset to an empty array if parsed data is not an array
      }
    } catch (parseErr) {
      console.error("Error parsing JSON, starting with a new array", parseErr);
      entries = []; // Reset to an empty array if there's a parsing error
    }

    entries.push(newEntry);

    // Save the updated applications back to the file
    fs.writeFile(
      filePath,
      JSON.stringify(entries, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing file", writeErr);
          return res.status(500).send("Error saving entry");
        }
        res.send("Entry saved successfully");
      }
    );
  });
});

// endpoint to edit an existing journal entry
// Endpoint to update an existing job site  
app.put("/journal-entries/:id", (req, res) => {
  // Check for correct content type (optional but recommended)
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).send('Incorrect content type');
  }

  const updatedEntry = req.body;
  const entryId = req.params.id; // Extract ID from the request URL
  const filePath = path.join(process.cwd(), "data", "journalEntries.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    // Existing error handling...
    
    let entries;
    try {
      entries = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing JSON", parseErr);
      return res.status(500).send("Error parsing entry data");
    }

    const index = entries.findIndex(entry => entry.id === entryId);
    if (index === -1) {
      return res.status(404).send("Entry not found");
    }

    // Update and validate entry
    entries[index] = { ...entries[index], ...updatedEntry };
    // Add validation here if needed

    fs.writeFile(filePath, JSON.stringify(entries, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Error writing file", writeErr);
        return res.status(500).send("Error updating entry");
      }
      res.status(200).send(entries[index]); // Explicitly send 200 status
    });
  });
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
