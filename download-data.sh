#!/bin/bash

# Define data sources in arrays
# Format: "Name|URL|ZipName"
declare -a DATA_SOURCES=(
    "Driver Theory Test (2019)|https://www.dropbox.com/scl/fi/d2i2x9kj6tss9x8tvltr9/open-mcq-data.zip?rlkey=edhaxy9gamrss60kauymen6nq&st=gtk17zyo&dl=0|open-mcq"
    "Wildlife|https://www.dropbox.com/scl/fi/69agh49q7hamoylgd828a/wildlife-data.zip?rlkey=6b8kboedgf9x3tjeejijdotdb&st=db9zfpdk&dl=0|wildlife-data"
    # Add more data sources here in the same format
)

# Create temporary directory in the project
TEMP_DIR="temp"
mkdir -p "$TEMP_DIR"

# Function to clean existing data files
clean_existing_data() {
    echo "Cleaning existing data files..."
    # Remove data.json if it exists
    if [ -f "src/data.json" ]; then
        rm -f "src/data.json"
        echo "- Removed existing data.json"
    fi
    
    # Remove images folder content but keep the folder
    if [ -d "public/images" ]; then
        rm -rf public/images/*
        echo "- Removed existing images"
    fi
}

# Function to download and install a dataset
download_and_install() {
    local url=$1
    local name=$2
    
    echo "Downloading $name data file..."
    curl -L "$url" -o "$TEMP_DIR/$name.zip"
    
    # Check if download was successful
    if [ $? -ne 0 ]; then
        echo "Error: Failed to download the $name file. Please check your internet connection and try again."
        return 1
    fi
    
    echo "Extracting $name files..."
    unzip -q "$TEMP_DIR/$name.zip" -d "$TEMP_DIR"
    
    # Create destination directories if they don't exist
    mkdir -p public/images
    mkdir -p src
    
    echo "Moving $name files to their proper locations..."
    # Move images directory if it exists
    if [ -d "$TEMP_DIR/images" ]; then
        cp -r $TEMP_DIR/images/* public/images/
    fi
    
    # Copy data.json if it exists
    if [ -f "$TEMP_DIR/data.json" ]; then
        cp "$TEMP_DIR/data.json" src/
    fi
    
    return 0
}

# Main menu function
show_menu() {
    echo "=========================================="
    echo "         Open MCQ Data Installer          "
    echo "=========================================="
    echo "Please select a dataset to download:"
    echo ""
    
    # Display menu options dynamically based on available data sources
    for i in "${!DATA_SOURCES[@]}"; do
        # Extract the name part (first segment before |)
        name=$(echo "${DATA_SOURCES[$i]}" | cut -d'|' -f1)
        echo "$((i+1))) $name Questions"
    done
    
    # Add exit option
    exit_option=$((${#DATA_SOURCES[@]}+1))
    
    echo "$exit_option) Exit"
    echo ""
    echo "Note: Installing a new dataset will remove any existing data"
    echo ""
    
    read -p "Enter your choice [1-$exit_option]: " choice
    
    # Check if the choice is within valid range
    if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "$exit_option" ]; then
        if [ "$choice" -eq "$exit_option" ]; then
            echo "Exiting..."
            exit 0
        else
            # Calculate the actual index in the array (0-based)
            index=$((choice-1))
            
            # Extract data from the array
            name=$(echo "${DATA_SOURCES[$index]}" | cut -d'|' -f1)
            url=$(echo "${DATA_SOURCES[$index]}" | cut -d'|' -f2)
            zip_name=$(echo "${DATA_SOURCES[$index]}" | cut -d'|' -f3)
            
            echo "You selected $name Questions"
            # Clean existing data before downloading
            clean_existing_data
            download_and_install "$url" "$zip_name"
        fi
    else
        echo "Invalid choice. Please try again."
        show_menu
    fi
}

# Welcome message
echo "Welcome to the Open MCQ Data Installer"
echo "This script will download and install question datasets for Open MCQ"
echo "WARNING: This will replace any existing data files and images"
echo ""

# Show the menu
show_menu

# Clean up
echo "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo "Installation completed successfully!"