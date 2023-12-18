// server.js or app.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import process from 'process';


const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/save-application', (req, res) => {
    const data = req.body;
    const filePath = path.join(process.cwd(), 'data', 'jobApplications.json');

    // Save data to a file using fs
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing file', err);
            res.status(500).send('Error saving application');
        } else {
            res.send('Application saved successfully');
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
