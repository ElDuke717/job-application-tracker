import json

# Load the JSON data from a file
with open('jobApplications.json', 'r') as file:
    job_applications = json.load(file)

# Add the new fields to each job application entry
for job_application in job_applications:
    job_application['emailScreen'] = ''
    job_application['phoneScreen'] = ''
    job_application['interview'] = ''

# Write the updated data back to the file
with open('jobApplications.json', 'w') as file:
    json.dump(job_applications, file, indent=2)
