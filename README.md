# Sacrament Bread Reminder

This script:
- pulls data from [this API Spreadsheets file](https://www.apispreadsheets.com/files/aYWNP5qJD6BhWtFE) 
- finds the next person to bring bread
- sends a reminder message to that person and two other leaders
- Runs every Wednesday, Saturday, and Sunday at 8:00 AM CST

## The .env file is required. Ask for it before running. 


## To update:
 - save changes
 - run `npm run zip`
 - load compressed zip file into aws lambda function console page manually (not fancy)
