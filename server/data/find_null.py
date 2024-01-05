import json

def find_null_application_type(file_path):
    try:
        # Open and load the JSON file
        with open('jobApplications.json', 'r') as file:
            data = json.load(file)

        # List to store entries with null applicationType
        entries_with_null_type = []

        # Iterate over the data to find entries with null applicationType
        for entry in data:
            if entry.get('applicationType') is None:
                entries_with_null_type.append(entry)

        # Print or return the entries found
        return entries_with_null_type

    except Exception as e:
        print(f"An error occurred: {e}")
        return []

# Usage
# Replace '/path/to/your/file.json' with the actual file path
null_type_entries = find_null_application_type('null-applicationType.json')
print(json.dumps(null_type_entries, indent=4))
