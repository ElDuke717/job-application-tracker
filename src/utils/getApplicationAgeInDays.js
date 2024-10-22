// Function that takes in a date and returns the number of days between that date and today
export default function getApplicationAgeInDays(dateSubmitted) {
    const submittedDate = new Date(dateSubmitted);
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - submittedDate.getTime();
    return Math.floor(differenceInTime / (1000 * 3600 * 24));
}
