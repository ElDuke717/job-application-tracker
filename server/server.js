import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const app = express();

// Apply middleware
app.use(cors());
app.use(bodyParser.json());

// Create a new PostgreSQL client
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432, // Change if you use a different port
});

// Verify database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to database');
  release();
});

// Define a POST endpoint to save job applications
app.post('/applications', async (req, res) => {
  try {
    const {
      company,
      dateSubmitted,
      jobTitle,
      location,
      applicationStatus,
      applicationType,
      resume,
      coverLetter,
      jobPostingURL,
      internalContactName,
      internalContactTitle,
      internalContactEmail,
      doubleDown,
      notesComments,
    } = req.body;

    const result = await pool.query(
      'INSERT INTO job_applications(company, date_submitted, job_title, location, application_status, application_type, resume, cover_letter, job_posting_url, internal_contact_name, internal_contact_title, internal_contact_email, double_down, notes_comments) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
      [company, dateSubmitted, jobTitle, location, applicationStatus, applicationType, resume, coverLetter, jobPostingURL, internalContactName, internalContactTitle, internalContactEmail, doubleDown, notesComments]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
