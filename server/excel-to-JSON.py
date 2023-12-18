import pandas as pd

# Load the Excel file
file_path = '/Users/nickhuemmer/projects/job-application-tracker/server/data/jobs_and_network_tracker.xlsx'
df = pd.read_excel(file_path)

# Drop rows where all elements are NaN
df = df.dropna(how='all')

# Function to split the internal contact into name and title
def split_internal_contact(contact):
    if pd.isna(contact) or contact in ['None', 'none', 'None yet']:
        return {"name": "", "title": ""}
    parts = contact.split(', ')
    name = parts[0] if len(parts) > 0 else ""
    title = parts[1] if len(parts) > 1 else ""
    return {"name": name, "title": title}

# Transform the data
transformed_data = df.apply(lambda row: {
    "dateSubmitted": row["Date Submitted"].strftime('%Y-%m-%d') if not pd.isna(row["Date Submitted"]) else "",
    "company": row["Company"] if not pd.isna(row["Company"]) else "",
    "jobTitle": row["Job Title"] if not pd.isna(row["Job Title"]) else "",
    "location": row["Location"] if not pd.isna(row["Location"]) else "",
    "applicationStatus": row["Application Status"] if not pd.isna(row["Application Status"]) else "",
    "applicationType": row["Application Type"] if not pd.isna(row["Application Type"]) else "",
    "resume": row["Resume"] if not pd.isna(row["Resume"]) else "",
    "coverLetter": row["Cover Letter"] if not pd.isna(row["Cover Letter"]) else "",
    "jobPostingURL": row["Job Posting URL"] if not pd.isna(row["Job Posting URL"]) else "",
    "internalContact": split_internal_contact(row["Internal Contact (Name, Title)"]),
    "internalContactEmail": row["Internal Contact Email)"] if not pd.isna(row["Internal Contact Email)"]) else "",
    "doubleDown": row["Double-down?"],
    "notesComments": row["Notes/Comments"] if not pd.isna(row["Notes/Comments"]) else ""
}, axis=1).tolist()

# Convert to JSON format
json_output = {"applications": transformed_data}
json_output
