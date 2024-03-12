#!/bin/bash

links=("https://www.dropbox.com/s/fbib3fd4u7tcect/data.json?dl=0" 
        "")

echo "Available sources..."

for i in ${!links[@]}; do
  echo "Source $i: ${links[$i]}"
done

read -p 'Choose a source: ' uservar

wget -O src/data.json ${links[uservar]}

