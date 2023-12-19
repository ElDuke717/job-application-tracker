# Convert all the dates in this JSON file from the mm/dd/yyyy format to yyyy-mm-dd format

import json

with open('previous-applications.json', 'r') as file:
    data = json.load(file)


from datetime import datetime

for entry in data:
    try:
        formatted_date = datetime.strptime(entry["dateSubmitted"], "%m/%d/%Y").strftime("%Y-%m-%d")
        entry["dateSubmitted"] = formatted_date
    except ValueError:
        # If the date is already in the correct format or if there's an error
        continue


with open('previous-applications.json', 'w') as file:
    json.dump(data, file, indent=4)
