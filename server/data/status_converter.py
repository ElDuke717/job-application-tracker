# Convert all entries older than two months applicationStatus to "Older than two months" 

import json
from datetime import datetime, timedelta

# Load your JSON data
with open('jobApplications.json', 'r') as file:
    data = json.load(file)

# Current date for comparison
current_date = datetime.now()

# Iterate through each application
for entry in data:
    # Convert 'dateSubmitted' to datetime object
    date_submitted = datetime.strptime(entry["dateSubmitted"], "%Y-%m-%d")

    # Check if the application is older than two months
    if (current_date - date_submitted).days > 60 and entry["applicationStatus"] != "Rejected":
        entry["applicationStatus"] = "Older than two months"

# Save the updated data back to the file
with open('jobApplications.json', 'w') as file:
    json.dump(data, file, indent=4)
