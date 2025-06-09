#!/bin/bash

# Script to cleanup HTML files from root directory after successfully restructuring
# Created on: $(date)

echo "This script will remove the original HTML files from the root directory."
echo "Please make sure you've tested the new HTML files in the html directory before running this script."
read -p "Are you sure you want to continue? (y/n): " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    echo "Removing HTML files from root directory..."
    
    # Navigate to project directory
    cd "/Users/anoop/FY BTECH/Sem-2/Elysiar/Elysiar"
    
    # Remove HTML files
    rm -f booking.html dashboard.html history.html index.html login.html \
          payments.html profile.html settings.html signup.html
    
    echo "HTML files have been removed from the root directory."
    echo "The project now uses the HTML files in the html directory."
else
    echo "Operation cancelled. No files were removed."
fi
