#!/bin/bash

links=("https://www.dropbox.com/s/fbib3fd4u7tcect/data.json?dl=0"
"https://gist.githubusercontent.com/ygurin/083c083a0ad668d97dc26132a2c119d5/raw/50ef61310174faff83635d7bd3a58f94e6e331ec/json")

# Display the available sources
echo "Available sources:"
for i in ${!links[@]}; do
    if [[ -n "${links[$i]}" ]]; then
        echo "Source $i: ${links[$i]}"
    else
        echo "Source $i: (Not available)"
    fi
done

# Prompt user to choose a source
read -p 'Choose a source (enter the number): ' uservar

# Validate user input
if [[ ! $uservar =~ ^[0-9]+$ ]] || (( uservar < 0 || uservar >= ${#links[@]} )); then
    echo "Invalid selection. Please enter a valid source number."
    exit 1
fi

# Validate the URL
if [[ -z "${links[$uservar]}" ]]; then
    echo "The selected source is not available."
    exit 1
fi

# Create the target directory if it doesn't exist
mkdir -p src

# Attempt to download the file
echo "Downloading from: ${links[$uservar]}"
wget -O src/data.json "${links[$uservar]}"

# Check if the download was successful
if [[ $? -eq 0 ]]; then
    echo "Download completed successfully. File saved to src/data.json."
else
    echo "Download failed. Please check the source URL and your internet connection."
fi

