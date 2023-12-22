import json
from fuzzywuzzy import process

# Define the valid application types
valid_application_types = [
    "LinkedIn Easy Apply",
    "Quick apply",
    "Traditional",
    "Codesmith style",
    "Workday application",
    "Other company system",
    "Other"
]

def correct_application_status(job_applications):
    for application in job_applications:
        # Check if applicationType is a string
        if isinstance(application["applicationType"], str):
            # Fuzzy match the applicationType with the valid types
            closest_match = process.extractOne(application["applicationType"], valid_application_types)
            if closest_match:
                # Update the applicationType with the closest match
                application["applicationType"] = closest_match[0]
        else:
            # Handle the case where applicationType is not a string
            print(f"Non-string applicationType found: {application['applicationType']}")

    return job_applications

# Load your data
with open('jobApplications.json', 'r') as file:
    data = json.load(file)

# Correct the application statuses
corrected_data = correct_application_status(data)

# Save the updated data
with open('corrected-job-applications.json', 'w') as file:
    json.dump(corrected_data, file, indent=4)
