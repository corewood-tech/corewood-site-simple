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
    ELEVENTY_BASE_URL="https://$domain" NODE_ENV=production npm run build:production
    
    # Move the built files to the target directory
    cp -r _site/* "$output_dir/"
    
    # Update sitemap and robots.txt for this domain
    if [ -f "$output_dir/sitemap.xml" ]; then
        sed -i.bak "s|<loc>/|<loc>https://$domain/|g" "$output_dir/sitemap.xml"
        rm "$output_dir/sitemap.xml.bak" 2>/dev/null || true
    fi
    
    if [ -f "$output_dir/robots.txt" ]; then
        echo "Sitemap: https://$domain/sitemap.xml" >> "$output_dir/robots.txt"
    fi
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
