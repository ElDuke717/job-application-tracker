// local-server.js (refactored to work with Sequelize models)

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cron from "node-cron";
import { v4 as uuidv4 } from "uuid";

// Import Sequelize and models
import sequelize from './database.js';
import JobApplication from './models/JobApplication.js';
import Contact from './models/Contact.js';
import JobSite from './models/JobSite.js';
import JournalEntry from './models/JournalEntry.js';
import { Op } from 'sequelize'; // Import Op for query operators

// Synchronize models
sequelize.sync({ alter: true }).then(() => {
  console.log('Database & tables created!');
});

const app = express();

app.use(cors());
app.use(bodyParser.json());


// Functionality to update applications that are older than two months

async function updateJobApplications() {
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  try {
    await JobApplication.update(
      { applicationStatus: "Older than two months" },
      {
        where: {
          dateSubmitted: { [Op.lt]: twoMonthsAgo },
          applicationStatus: { [Op.ne]: "Rejected" },
        },
      }
    );
    console.log("Job applications updated successfully");
  } catch (error) {
    console.error("Error updating job applications:", error);
  }
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

// Endpoint to save a new job application
app.post("/save-application", async (req, res) => {
  try {
    const newApplicationData = req.body;
    const newApplication = await JobApplication.create({
      id: uuidv4(),
      ...newApplicationData,
    });
    res.status(201).json(newApplication);
  } catch (error) {
    console.error("Error saving application:", error);
    res.status(500).send("Error saving application");
  }
});

// Endpoint to get all job applications (with optional search term)
app.get("/job-applications", async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    let applications;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      applications = await JobApplication.findAll({
        where: {
          [Op.or]: [
            sequelize.where(
              sequelize.fn('lower', sequelize.col('jobTitle')),
              { [Op.like]: `%${lowerCaseSearchTerm}%` }
            ),
            sequelize.where(
              sequelize.fn('lower', sequelize.col('company')),
              { [Op.like]: `%${lowerCaseSearchTerm}%` }
            ),
          ],
        },
      });
    } else {
      applications = await JobApplication.findAll();
    }

    res.json(applications);
  } catch (error) {
    console.error("Error retrieving job applications:", error);
    res.status(500).send("Error retrieving job applications");
  }
});

// Endpoint to update an existing job application
app.put("/update-application/:id", async (req, res) => {
  const updatedApplication = req.body;
  const applicationId = req.params.id;

  try {
    const [updatedRows] = await JobApplication.update(updatedApplication, {
      where: { id: applicationId },
    });

    if (updatedRows === 0) {
      return res.status(404).send("Application not found");
    }

    const updatedApp = await JobApplication.findByPk(applicationId);
    res.json(updatedApp);
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).send("Error updating application");
  }
});

// Endpoint to get all contacts
app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.json(contacts);
  } catch (error) {
    console.error("Error retrieving contacts:", error);
    res.status(500).send("Error retrieving contacts");
  }
});

// Endpoint to save a new contact
app.post("/save-contact", async (req, res) => {
  try {
    const newContactData = req.body;
    const newContact = await Contact.create({
      id: uuidv4(),
      ...newContactData,
    });
    res.status(201).json(newContact);
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).send("Error saving contact");
  }
});

// Endpoint to update an existing contact
app.put("/contacts/:id", async (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).send('Incorrect content type');
  }

  const updatedContact = req.body;
  const contactId = req.params.id;

  try {
    const [updatedRows] = await Contact.update(updatedContact, {
      where: { id: contactId },
    });

    if (updatedRows === 0) {
      return res.status(404).send("Contact not found");
    }

    const updatedCont = await Contact.findByPk(contactId);
    res.status(200).json(updatedCont);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).send("Error updating contact");
  }
});

// Endpoint to get all job sites
app.get("/job-site-list", async (req, res) => {
  try {
    const sites = await JobSite.findAll();
    res.json(sites);
  } catch (error) {
    console.error("Error retrieving job sites:", error);
    res.status(500).send("Error retrieving job sites");
  }
});

// Endpoint to save a new job site
app.post("/save-job-site", async (req, res) => {
  try {
    const newSiteData = req.body;
    const newSite = await JobSite.create({
      id: uuidv4(),
      ...newSiteData,
    });
    res.status(201).json(newSite);
  } catch (error) {
    console.error("Error saving site:", error);
    res.status(500).send("Error saving site");
  }
});

// Endpoint to update an existing job site
app.put("/job-site-list/:id", async (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).send('Incorrect content type');
  }

  const updatedSite = req.body;
  const siteId = req.params.id;

  try {
    const [updatedRows] = await JobSite.update(updatedSite, {
      where: { id: siteId },
    });

    if (updatedRows === 0) {
      return res.status(404).send("Site not found");
    }

    const updatedJobSite = await JobSite.findByPk(siteId);
    res.status(200).json(updatedJobSite);
  } catch (error) {
    console.error("Error updating site:", error);
    res.status(500).send("Error updating site");
  }
});

// Endpoint to get all journal entries
app.get("/journal-entries", async (req, res) => {
  try {
    const entries = await JournalEntry.findAll();
    res.json(entries);
  } catch (error) {
    console.error("Error retrieving journal entries:", error);
    res.status(500).send("Error retrieving journal entries");
  }
});

// Endpoint to save a new journal entry
app.post("/journal-entries", async (req, res) => {
  try {
    const newEntryData = req.body;
    const newEntry = await JournalEntry.create({
      id: uuidv4(),
      ...newEntryData,
    });
    res.status(201).json(newEntry);
  } catch (error) {
    console.error("Error saving journal entry:", error);
    res.status(500).send("Error saving journal entry");
  }
});

// Endpoint to update an existing journal entry
app.put("/journal-entries/:id", async (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).send('Incorrect content type');
  }

  const updatedEntry = req.body;
  const entryId = req.params.id;

  try {
    const [updatedRows] = await JournalEntry.update(updatedEntry, {
      where: { id: entryId },
    });

    if (updatedRows === 0) {
      return res.status(404).send("Entry not found");
    }

    const updatedJournalEntry = await JournalEntry.findByPk(entryId);
    res.status(200).json(updatedJournalEntry);
  } catch (error) {
    console.error("Error updating journal entry:", error);
    res.status(500).send("Error updating journal entry");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});