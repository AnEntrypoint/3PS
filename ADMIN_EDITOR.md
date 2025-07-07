# Admin Editor - Complete Guide

The Third Planet Studio Admin Editor is a fully-featured content management system that allows administrators to manage all website content and media files locally, then deploy changes via Git.

## 🚀 Quick Start

### For Administrators

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AnEntrypoint/3PS.git
   cd 3PS
   ```

2. **Start the admin editor:**
   ```bash
   npm run admin
   ```

3. **Open in browser:**
   ```
   http://localhost:3001
   ```

4. **Make your changes, then commit and push:**
   ```bash
   git add .
   git commit -m "Update content via admin editor"
   git push origin main
   ```

## 🎯 Features

### Content Management
- ✅ **Team Members**: Manage founder profiles, bios, and photos
- ✅ **Musicians**: Add/edit musician profiles with galleries and links
- ✅ **Artists**: Manage artist showcases with portfolios
- ✅ **Partners**: Update partner logos and information
- ✅ **Metaverse**: Manage virtual world platform links

### File Management
- ✅ **Drag & Drop**: Easy file uploads with drag-and-drop interface
- ✅ **Image Optimization**: Automatic resizing and compression
- ✅ **Gallery Management**: Upload multiple images per record
- ✅ **File Deletion**: Remove unwanted images with one click
- ✅ **Preview**: See images before they go live

### Technical Features
- ✅ **Local File System**: Direct manipulation of JSON and storage files
- ✅ **Git Ready**: Changes are immediately ready for commit/push
- ✅ **Auto-Generated IDs**: PocketBase-compatible record IDs
- ✅ **Data Validation**: Ensures data integrity
- ✅ **Error Handling**: User-friendly error messages

## 📁 How It Works

### Data Flow
```
Admin Editor → Local JSON Files → Git Commit → GitHub Actions → Deployed Site
```

### File Structure Impact
```
📁 Project Root
├── 📁 data/                    ← JSON files (modified by editor)
│   ├── team.json
│   ├── musician.json
│   ├── artist.json
│   ├── partner.json
│   └── Metaverse.json
├── 📁 static/storage/          ← Media files (managed by editor)
│   ├── 📁 pbc_3824009647/     ← Team photos
│   ├── 📁 5rod2tewrl0ov3d/    ← Musician galleries
│   ├── 📁 3jnleendml5ld46/    ← Artist portfolios
│   ├── 📁 cx8afblkixaub05/    ← Partner logos
│   └── 📁 0ct1vfvg71ebu9r/    ← Metaverse images
└── 📁 admin-editor/            ← Editor application
    ├── server.js
    ├── package.json
    └── 📁 public/
        ├── index.html
        └── app.js
```

## 🎨 User Interface Guide

### Main Dashboard
- **Collection Tabs**: Switch between Team, Musicians, Artists, Partners, Metaverse
- **Record Count**: See how many items are in each collection
- **Search & Filter**: Quick navigation through records

### Record Management
- **Card View**: Visual cards showing record preview with images
- **Quick Actions**: Edit, Manage Files, Delete buttons on each card
- **Batch Operations**: Select multiple records for bulk actions

### Content Editor
- **Form Fields**: Dynamic forms based on collection type
- **Rich Text**: HTML support for bio fields
- **URL Validation**: Automatic validation for website links
- **Required Fields**: Visual indicators for mandatory fields

### File Manager
- **Drag & Drop Zone**: Drop files directly onto the upload area
- **Progress Indicators**: See upload progress for large files
- **Gallery View**: Thumbnail grid of all images for a record
- **Quick Delete**: Remove images with confirmation dialog

## 📋 Collection Schemas

### Team Members
```json
{
  "id": "generated_id",
  "name": "Planet Binx",
  "nickname": "\"BAND MOM\"",
  "role": "FOUNDER",
  "bio": "<p>Biography with HTML support</p>",
  "pic": "[\"filename1.jpg\", \"filename2.jpg\"]",
  "created": "2025-02-19T14:40:07.978Z",
  "updated": "2025-02-20T09:20:09.337Z",
  "collectionName": "team"
}
```

### Musicians
```json
{
  "id": "generated_id",
  "name": "Artist Name",
  "genre": "World Music",
  "site": "https://artistsite.com",
  "route": "/roster/music/artistname",
  "bio": "<p>Artist biography</p>",
  "pic": "[\"gallery1.jpg\", \"gallery2.jpg\"]",
  "created": "2025-01-01T00:00:00.000Z",
  "updated": "2025-01-01T00:00:00.000Z",
  "collectionName": "musician"
}
```

### Artists
```json
{
  "id": "generated_id",
  "title": "Artist Name",
  "desc": "Short description",
  "site": "https://portfolio.com",
  "route": "/roster/art/artistname",
  "bio": "<p>Artist background</p>",
  "pic": "[\"artwork1.jpg\", \"artwork2.jpg\"]",
  "created": "2025-01-01T00:00:00.000Z",
  "updated": "2025-01-01T00:00:00.000Z",
  "collectionName": "artist"
}
```

### Partners
```json
{
  "id": "generated_id",
  "name": "Partner Name",
  "site": "https://partner.com",
  "pic": "[\"logo.png\"]",
  "created": "2025-01-01T00:00:00.000Z",
  "updated": "2025-01-01T00:00:00.000Z",
  "collectionName": "partner"
}
```

### Metaverse
```json
{
  "id": "generated_id",
  "title": "Platform Name",
  "desc": "Platform description",
  "url": "https://platform.com/space",
  "pic": "screenshot.png",
  "created": "2025-01-01T00:00:00.000Z",
  "updated": "2025-01-01T00:00:00.000Z",
  "collectionName": "Metaverse"
}
```

## 🔧 Advanced Usage

### Bulk Import
For large datasets, you can directly edit JSON files:

1. **Backup first:**
   ```bash
   cp data/musician.json data/musician.json.backup
   ```

2. **Edit the JSON file** with your preferred editor

3. **Validate format** by loading the editor and checking for errors

4. **Commit changes** as usual

### Custom Routes
When adding new musicians/artists, the `route` field determines the URL:
- Format: `/roster/music/artistname` or `/roster/art/artistname`
- Use lowercase, no spaces, hyphens for special characters
- Must be unique within the collection

### Image Guidelines
- **Recommended sizes**: 1200x1200px minimum for profile images
- **Formats**: JPG (photos), PNG (logos with transparency)
- **File sizes**: Keep under 2MB for faster loading
- **Naming**: Use descriptive names, editor will add unique suffixes

## 🚨 Troubleshooting

### Common Issues

**"Port 3001 already in use"**
```bash
# Check what's using the port
lsof -i :3001

# Kill the process or change port in server.js
```

**"Permission denied writing files"**
```bash
# Check file permissions
ls -la data/
ls -la static/storage/

# Fix permissions if needed
chmod 755 data/ static/storage/
```

**"Cannot upload files"**
- Check file size (max 10MB)
- Ensure file is a valid image format
- Check available disk space
- Try refreshing the browser

**"Git push rejected"**
```bash
# Make sure you're on the right branch
git branch

# Pull latest changes first
git pull origin main

# Then try pushing again
git push origin main
```

### Data Recovery

If you accidentally delete something:

1. **Check git history:**
   ```bash
   git log --oneline
   git show HEAD~1:data/collection.json
   ```

2. **Restore from git:**
   ```bash
   git checkout HEAD~1 -- data/collection.json
   ```

3. **Or restore from backup:**
   ```bash
   cp data/collection.json.backup data/collection.json
   ```

## 🔒 Security Notes

### ⚠️ Important Security Warnings

- **LOCAL USE ONLY**: Never expose this editor to the internet
- **NO AUTHENTICATION**: Anyone with access can modify content
- **DIRECT FILE ACCESS**: The editor has full read/write access to your files
- **GIT CREDENTIALS**: Make sure your git credentials are secure

### Best Practices

1. **Use on local machines only**
2. **Keep regular backups** (git handles this automatically)
3. **Review changes** before pushing to production
4. **Limit access** to trusted administrators only
5. **Monitor deployments** after making changes

## 🎯 Workflow Best Practices

### For Content Updates

1. **Start editor**: `npm run admin`
2. **Make changes** through the web interface
3. **Preview locally** if needed: `npm run dev`
4. **Review changes**: `git diff`
5. **Commit**: `git add . && git commit -m "Update content"`
6. **Deploy**: `git push origin main`
7. **Verify**: Check live site after deployment

### For Large Changes

1. **Create a branch**: `git checkout -b content-update`
2. **Make changes** through editor
3. **Test thoroughly**
4. **Create PR**: Push branch and create pull request
5. **Review & merge** after approval

### Emergency Rollback

If something goes wrong after deployment:

```bash
# Revert the last commit
git revert HEAD

# Push the revert
git push origin main
```

## 📞 Support

### Getting Help

1. **Check this documentation** first
2. **Review error messages** carefully
3. **Check git status** for file conflicts
4. **Look at browser console** for JavaScript errors
5. **Restart the editor**: Stop server and run `npm run admin` again

### Common Solutions

- **Clear browser cache** if interface looks broken
- **Check file permissions** if uploads fail
- **Verify Node.js version** (need 18+)
- **Update dependencies**: `cd admin-editor && npm update`

---

**Happy content managing! 🌍✨**

*For technical issues or feature requests, please check with the development team.*