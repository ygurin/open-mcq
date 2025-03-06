#!/bin/bash

# Source URL for the zip file
DOWNLOAD_URL="https://www.dropbox.com/scl/fi/d2i2x9kj6tss9x8tvltr9/open-mcq-data.zip?rlkey=edhaxy9gamrss60kauymen6nq&st=gtk17zyo&dl=0"

echo "This script will download and install Open MCQ data files"
echo ""

# Create temporary directory in the project
TEMP_DIR="temp"
mkdir -p "$TEMP_DIR"

# Download the zip file using curl
echo "Downloading data file..."
curl -L "$DOWNLOAD_URL" -o "$TEMP_DIR/open-mcq.zip"

# Check if download was successful
if [ $? -ne 0 ]; then
    echo "Error: Failed to download the file. Please check your internet connection and try again."
    exit 1
fi

# Unzip the file
echo "Extracting files..."
unzip -q "$TEMP_DIR/open-mcq.zip" -d "$TEMP_DIR"

# Create destination directories if they don't exist
mkdir -p public/images
mkdir -p src

# Move files to their destinations
echo "Moving files to their proper locations..."
# Move images directory
cp -r $TEMP_DIR/images/* public/images/
cp "$TEMP_DIR/data.json" src/

# Clean up
echo "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo "Installation completed successfully!"