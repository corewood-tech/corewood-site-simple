#!/bin/bash

# Exit on error
set -e

# Configuration
DOMAINS=(
    "info:corewood.info"
    "cloud:corewood.cloud"
    "tech:corewood.tech"
    "io:corewood.io"
)

# Function to build for a specific domain
build_for_domain() {
    local domain=$1
    local output_dir=$2
    
    echo "Building for domain: $domain"
    
    # Create output directory if it doesn't exist
    mkdir -p "$output_dir"
    
    # Build with the specific base URL
    cd src/updated_website
    VITE_BASE_URL="https://$domain" npm run build
    
    # Move the built files to the target directory
    cp -r dist/* "../../$output_dir/"
    cd ../..
}

# Main build process
echo "Starting build process..."

# Clean dist directory
rm -rf dist/*

# Build for each domain
for domain_config in "${DOMAINS[@]}"; do
    IFS=':' read -r dir domain <<< "$domain_config"
    output_dir="dist/$dir"
    build_for_domain "$domain" "$output_dir"
done

echo "Build complete! Files are in the dist directory." 
