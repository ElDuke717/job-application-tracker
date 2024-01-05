import json

def update_application_status(file_path):
    try:
        # Open and load the JSON file
        with open('jobApplications.json', 'r') as file:
            data = json.load(file)

        # Update 'applicationStatus' to 'Update' where it is None or an empty string
        for obj in data:
            if 'applicationType' in obj and (obj['applicationType'] is None or obj['applicationType'] == ""):
                obj['applicationType'] = "Update"

        # Write the updated data back to the file
        with open(file_path, 'w') as file:
            json.dump(data, file, indent=4)

        print("Update completed successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")

# Usage
# Replace '/path/to/your/file.json' with the actual file path
update_application_status('update-jobApplications.json')
