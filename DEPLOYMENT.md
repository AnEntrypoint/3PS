# Deployment Guide

This project supports deployment to GitHub Pages in two configurations:

## 1. Custom Domain (thirdplanet.studio)

### Automatic Deployment
- Pushes to `main` branch automatically deploy to custom domain
- Uses the CNAME file for domain configuration
- No base path needed

### Manual Deployment
1. Go to Actions tab in GitHub
2. Click "Deploy to GitHub Pages"
3. Select "custom_domain" (default)
4. Click "Run workflow"

## 2. GitHub Pages Subdirectory (anentrypoint.github.io/3PS)

### Manual Deployment Only
1. Go to Actions tab in GitHub
2. Click "Deploy to GitHub Pages" 
3. Select "github_pages" from dropdown
4. Click "Run workflow"

This mode:
- Removes the CNAME file to prevent domain conflicts
- Sets base path to `/3PS` for proper asset loading
- Works with standard GitHub Pages URLs

## Configuration

### Custom Domain Setup
1. Domain: `thirdplanet.studio`
2. CNAME file: `static/CNAME` 
3. Base path: None (root)

### GitHub Pages Setup  
1. URL: `https://anentrypoint.github.io/3PS`
2. CNAME file: Removed during build
3. Base path: `/3PS`

## How It Works

The build process automatically detects the deployment type:

- **Custom Domain**: Standard build with no base path
- **GitHub Pages**: Build with `GITHUB_PAGES=true` environment variable, which sets the base path to `/3PS`

All image URLs and internal links are automatically adjusted based on the deployment type using SvelteKit's `$app/paths` base path handling.

## Testing Locally

### Test Custom Domain Mode
```bash
npm run dev
```

### Test GitHub Pages Mode
```bash
GITHUB_PAGES=true npm run build
npm run preview
```

## Requirements

- Node.js 20+
- All static assets in `/static/` directory
- JSON data files in `/data/` directory
- Images in `/static/storage/` directory structure