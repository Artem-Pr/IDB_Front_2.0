#!/bin/bash

# Initialize counters for processed files and errors
processed_files=0
error_count=0

# Iterate through all files with the extension .mov or .MOV in the current directory
for file in *.mov *.MOV; do
    # Check if the current file exists
    if [ -e "$file" ]; then
        # Extract the filename without extension
        filename="${file%.*}"
        
        # Apply the exiftool command and output the result
        result=$(exiftool -TagsFromFile "$filename.MOV" -extractEmbedded "$filename.mp4")

        echo
        echo "Start process: exiftool -TagsFromFile $filename.MOV -extractEmbedded $filename.mp4"

        # Check for the presence of the substring "1 image files updated" in the result
        if [[ "$result" != *"1 image files updated"* ]]; then
            echo "Error $filename.mp4: $result"
            ((error_count++))
        else
            # Print result
            echo "Result $filename.mp4: $result"
            # Increase the counter for processed files
            ((processed_files++))
        fi
    fi
done

echo
# Output the total number of processed files and errors
echo "Total processed files: $processed_files"
echo "Total errors: $error_count"
