# The Path - Campaign Reference Webapp

A simple web application for viewing locations and adversaries from "The Path" Daggerheart campaign.

## How to Use

### Option 1: Simple HTTP Server (Recommended)

The webapp needs to be served over HTTP (not just opened as a file) for the JavaScript to work properly.

**Using Python 3:**
```bash
cd path-webapp
python -m http.server 8000
```

Then open your browser to: `http://localhost:8000`

**Using Python 2:**
```bash
cd path-webapp
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
cd path-webapp
npx http-server -p 8000
```

**Using PHP:**
```bash
cd path-webapp
php -S localhost:8000
```

### Option 2: Browser Extensions

Install a local web server extension for your browser:
- Chrome/Edge: "Web Server for Chrome" or "Live Server"
- Firefox: "Live Server" extension

### Option 3: VS Code

If you use VS Code, install the "Live Server" extension, right-click on `index.html`, and select "Open with Live Server".

## What's Included

- **Front Page**: Organized navigation hub with links to all campaign content
- **Session Plans**: Session 1 and Session 2 with route overviews and encounters
- **Village in the Mist**: Central hub with 5 location cards
- **All Locations Browser**: Complete list of 14 Path locations
- **Surface Locations**: 9 individual location cards with full details
- **Underground Locations**: 5 subterranean environment cards
- **Adversary Stat Blocks**: Complete stats for Mist creatures
- **Quick Reference**: Core mechanics and location modifiers

## Adding More Content

The webapp **automatically discovers** location YAML files from the campaign directory. To add new locations:

1. Create a new `.yaml` file in the appropriate folder:
   - `the-path-campaign/locations/path-locations/surface-locations/` for surface locations
   - `the-path-campaign/locations/path-locations/underground-locations/` for underground locations
   - `the-path-campaign/locations/village-in-the-mist/` for village location cards

2. Follow the existing YAML format (see `location-template.yaml`)

3. Refresh the webapp - new locations appear automatically!

**Note:** The webapp uses HTTP fetch to scan directories and load YAML files. You must serve the webapp via HTTP (not open as a file) for auto-discovery to work.

## File Structure

```
path-webapp/
├── index.html          # Front page with organized navigation
├── session1.html       # Session 1 - Initial Path Configuration
├── session2.html       # Session 2 - Grid-Based Path
├── village.html        # Village in the Mist hub
├── locations.html      # All locations browser
├── location.html       # Individual location detail view
├── adversary.html      # Adversary stat block view
├── css/
│   └── styles.css      # All styling
├── js/
│   ├── app.js          # Main page logic
│   ├── location.js     # Individual location detail loader (YAML)
│   ├── locations.js    # All locations browser with auto-discovery (YAML)
│   └── adversary.js    # Adversary loader
└── data/
    ├── paths.json      # Example Path configurations
    └── sessions.json   # Session data
```

## Troubleshooting

**Links don't work when opening index.html directly:**
- This is a browser security feature (CORS)
- Solution: Use one of the HTTP server methods above

**Blank pages or missing styles:**
- Make sure you're viewing the page through an HTTP server
- Check browser console (F12) for errors

**Locations not appearing:**
- Ensure you're serving via HTTP server (required for YAML auto-discovery)
- Check that YAML files are in the correct folders (surface-locations, underground-locations, village-in-the-mist)
- Verify YAML syntax is valid
- Check browser console (F12) for loading errors
- **Clear browser cache**: Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac) to hard refresh

**Location updates not showing:**
- Hard refresh to clear cache: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or open browser DevTools (F12) → Network tab → check "Disable cache"
