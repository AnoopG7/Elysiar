#!/bin/bash

# Navigate to project directory
cd "/Users/anoop/FY BTECH/Sem-2/Elysiar/Elysiar"

# Update image paths in HTML files that are already in the html directory
echo "Updating image paths in HTML files..."
find html -name "*.html" -exec sed -i '' 's|src="images/|src="../images/|g' {} \;

echo "Path updates completed successfully!"
echo "All HTML files in the html directory now have correct paths to resources."
