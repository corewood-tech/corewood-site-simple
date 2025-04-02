// Script to update sitemap.xml with the correct domain
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the base URL from environment variables
const baseUrl = process.env.VITE_BASE_URL || 'http://localhost:3000';

// Path to sitemap.xml in the build output
const sitemapPath = path.join(__dirname, '../dist/sitemap.xml');

// Read the sitemap.xml file
fs.readFile(sitemapPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading sitemap.xml:', err);
        return;
    }

    // Parse the XML
    const dom = new JSDOM(data, { contentType: 'text/xml' });
    const document = dom.window.document;

    // Update each URL in the sitemap
    const locations = document.querySelectorAll('url > loc');
    locations.forEach(loc => {
        const relativePath = loc.textContent.replace(/^\//, '');
        loc.textContent = `${baseUrl}/${relativePath}`;
    });

    // Update robots.txt sitemap reference
    const robotsPath = path.join(__dirname, '../dist/robots.txt');
    fs.readFile(robotsPath, 'utf8', (robotsErr, robotsData) => {
        if (robotsErr) {
            console.error('Error reading robots.txt:', robotsErr);
            return;
        }

        const updatedRobots = robotsData.replace(
            /Sitemap: .*/,
            `Sitemap: ${baseUrl}/sitemap.xml`
        );

        fs.writeFile(robotsPath, updatedRobots, 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing robots.txt:', writeErr);
            } else {
                console.log(`Updated robots.txt with sitemap URL: ${baseUrl}/sitemap.xml`);
            }
        });
    });

    // Write the updated sitemap back to the file
    fs.writeFile(sitemapPath, dom.serialize(), 'utf8', (writeErr) => {
        if (writeErr) {
            console.error('Error writing sitemap.xml:', writeErr);
        } else {
            console.log(`Updated sitemap.xml with base URL: ${baseUrl}`);
        }
    });
}); 
