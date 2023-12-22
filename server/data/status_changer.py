import json
from typing import List

def update_application_status(data: List[dict], company: str, job_title: str, new_status: str):
    for entry in data:
        if entry["company"] == company and entry["jobTitle"] == job_title:
            entry["applicationStatus"] = new_status
    return data

# Replace 'path_to_your_file.json' with the path to your JSON file
with open('jobApplications.json', 'r') as file:
    job_applications = json.load(file)

# Define the criteria for the update
company_to_update = "Capitol One"
job_title_to_update = "Senior Software Engineer, Full Stack"
new_application_status = "Rejected"

# Update the data
updated_data = update_application_status(job_applications, company_to_update, job_title_to_update, new_application_status)

# Write the updated data back to the file
with open('jobApplications.json', 'w') as file:
    json.dump(updated_data, file, indent=4)
