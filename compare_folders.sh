#!/bin/bash

# Make sure you got permission by running "chmod +x compare_folders.sh" before executing the script.
# to run script use this command ./compare_folders.sh

# Compare files in two folders

# Set paths to folders (absolute paths)
folder1="/Volumes/Lexar_SL500/MEGA_sync/IDBase/volumes"
folder2="/Volumes/Lexar_SL500/MEGA_sync/IDBase-test/volumes"

# Define color codes
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
PURPLE="\033[0;35m"
CYAN="\033[0;36m"
RESET="\033[0m"

# Function to get list of files and folders (relative paths)
list_content() {
    local folder=$1
    find "$folder" -type f -o -type d | sed "s|$folder/||" | sort
}

# Get lists of folder contents
list1=$(list_content "$folder1")
list2=$(list_content "$folder2")

# Find items present only in one of the folders
unique_in_folder1=$(comm -23 <(echo "$list1") <(echo "$list2"))
unique_in_folder2=$(comm -13 <(echo "$list1") <(echo "$list2"))

# Separate the results into folders and files
folders_in_folder1=()
files_in_folder1=()
while IFS= read -r item; do
    if [[ -d "$folder1/$item" ]]; then
        folders_in_folder1+=("$item")
    elif [[ -f "$folder1/$item" ]]; then
        files_in_folder1+=("$item")
    fi
done <<< "$unique_in_folder1"

folders_in_folder2=()
files_in_folder2=()
while IFS= read -r item; do
    if [[ -d "$folder2/$item" ]]; then
        folders_in_folder2+=("$item")
    elif [[ -f "$folder2/$item" ]]; then
        files_in_folder2+=("$item")
    fi
done <<< "$unique_in_folder2"

# Calculate totals for both folders
total_folders1=${#folders_in_folder1[@]}  # Total unique folders in folder1
total_files1=${#files_in_folder1[@]}      # Total unique files in folder1
total_folders2=${#folders_in_folder2[@]}  # Total unique folders in folder2
total_files2=${#files_in_folder2[@]}      # Total unique files in folder2

# Format and print rows of the table
print_table_rows() {
    local folder1_items=("$1[@]")
    local folder2_items=("$2[@]")
    local col1=("${!folder1_items}")
    local col2=("${!folder2_items}")
    local max_rows=$(( ${#col1[@]} > ${#col2[@]} ? ${#col1[@]} : ${#col2[@]} ))

    for ((i = 0; i < max_rows; i++)); do
        printf "${GREEN}|         ${GREEN}|${RESET} %-40s ${GREEN}|${RESET} %-40s ${GREEN}|${RESET}\n" "${col1[i]:-}" "${col2[i]:-}"
    done
}

# Output the table
echo -e "${GREEN}----------------------------------------------------------------------------------------${RESET}"

echo -e "${GREEN}|         | folder1                | folder2              |${RESET}"
echo -e "${GREEN}|         |${YELLOW} ${folder1} ${GREEN}|${YELLOW} ${folder2} ${GREEN}|${RESET}"
echo -e "${GREEN}----------------------------------------------------------------------------------------${RESET}"
echo -e "${GREEN}| total   |${RESET} Folders: $total_folders1, Files: $total_files1 ${GREEN}|${RESET} Folders: $total_folders2, Files: $total_files2 ${GREEN}|${RESET}"
echo -e "${GREEN}----------------------------------------------------------------------------------------${RESET}"
echo -e "${GREEN}| folders |${RESET}"
print_table_rows folders_in_folder1 folders_in_folder2
echo -e "${GREEN}----------------------------------------------------------------------------------------${RESET}"
echo -e "${GREEN}| files   |${RESET}"
print_table_rows files_in_folder1 files_in_folder2
echo -e "${GREEN}----------------------------------------------------------------------------------------${RESET}"