#!/bin/bash

# Make sure to give it execute permission by running "chmod +x start.sh" before executing the script.
# chmod +x start.sh
# chmod +x stop.sh

# Define color variables
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
PURPLE="\033[0;35m"
CYAN="\033[0;36m"
NC="\033[0m" # No Color

# Function to apply color to a message
log() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

log $CYAN "Starting the update and Docker service management process..."

# Function to check for updates in a git repository
check_for_updates() {
    local project_path=$1
    local branch_name=$2

    if [ -d "$project_path" ]; then
        log $PURPLE "Checking for updates in the repository at '$project_path' on branch '$branch_name'..."
        cd "$project_path" || return
        git fetch
        local updates=$(git rev-list HEAD...origin/"$branch_name" --count)
        if [ "$updates" -gt 0 ]; then
            log $GREEN "New updates found ($updates commit(s)). Pulling the latest changes..."
            git pull origin "$branch_name"
            cd - || return
            return 0
        else
            log $GREEN "No updates found. The repository is up-to-date."
            cd - || return
            return 1
        fi
    else
        log $RED "The project path '$project_path' does not exist."
        return 1
    fi
}

# Define paths to the project directories and their corresponding branches
PROJECT1_PATH="./IDB_Front_2.0"
PROJECT1_BRANCH="main"

PROJECT2_PATH="./ImageDataBaseBackend" # Make sure this path is correct
PROJECT2_BRANCH="master"

# Assume no updates are available initially
updates_available=false

# Check each project for updates
if check_for_updates "$PROJECT1_PATH" "$PROJECT1_BRANCH"; then
    updates_available=true
fi
if check_for_updates "$PROJECT2_PATH" "$PROJECT2_BRANCH"; then
    updates_available=true
fi

# If updates are available, rebuild and start Docker services
if [ "$updates_available" = true ]; then
    log $PURPLE "Rebuilding images..."
    docker-compose down --rmi all
    docker-compose build --no-cache
    log $GREEN "Rebuilding process complete."
fi

# Start or restart the Docker services
log $PURPLE "Starting or restarting the Docker services..."
docker-compose up -d
log $GREEN "Docker services are now running."

log $CYAN "Update and Docker service management process completed."