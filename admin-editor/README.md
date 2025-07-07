# Third Planet Studio - Admin Editor

A comprehensive content management system for the Third Planet Studio website. This tool allows administrators to manage all website data and media files locally, then commit and push changes to trigger automatic deployment.

## Features

- **📝 Data Management**: Full CRUD operations for all collections (Team, Musicians, Artists, Partners, Metaverse)
- **🖼️ File Management**: Upload, preview, and delete images with automatic optimization
- **🎨 Intuitive Interface**: Modern web-based UI with drag-and-drop file uploads
- **💾 Local Storage**: All changes are made directly to local JSON files and storage directories
- **🔄 Git Integration**: Ready for commit/push workflow to trigger CI/CD

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Cloned Third Planet Studio repository

### Installation & Setup

1. **Navigate to the admin editor directory:**
   ```bash
   cd admin-editor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the editor:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   ```
   http://localhost:3001
   ```

## How to Use

### Managing Content

1. **Select Collection**: Click on tabs to switch between Team, Musicians, Artists, Partners, or Metaverse
2. **View Records**: See all existing records in a card-based layout
3. **Create New**: Click "Add New" to create a new record
4. **Edit Existing**: Click "Edit" on any record card
5. **Delete Records**: Click "Delete" (with confirmation)

### Managing Files

1. **Open File Manager**: Click "Files" button on any record
2. **Upload Images**: 
   - Click the upload area or drag files directly
   - Supports JPG, PNG, GIF, WebP (max 10MB each)
   - Images are automatically optimized
3. **Delete Images**: Click the × button on any image thumbnail

### Committing Changes

After making your changes:

1. **Review Changes:**
   ```bash
   git status
   git diff
   ```

2. **Commit Changes:**
   ```bash
   git add .
   git commit -m "Update content via admin editor"
   ```

3. **Push to Deploy:**
   ```bash
   git push origin main
   ```

The GitHub Actions workflow will automatically deploy your changes!

## File Structure

```
admin-editor/
├── server.js          # Express server with API endpoints
├── package.json       # Node.js dependencies
├── public/
│   ├── index.html     # Main admin interface
│   └── app.js         # Vue.js frontend application
└── README.md          # This file
```

## API Endpoints

- `GET /api/collections` - Get all collections
- `GET /api/collections/:collection` - Get specific collection
- `POST /api/collections/:collection` - Create new record
- `PUT /api/collections/:collection/:id` - Update record
- `DELETE /api/collections/:collection/:id` - Delete record
- `POST /api/collections/:collection/:id/upload` - Upload files
- `DELETE /api/collections/:collection/:id/files/:filename` - Delete file
- `GET /api/files/:collectionId/:recordId/:filename` - Serve uploaded files

## Collection Schemas

### Team
- **Fields**: name, nickname, bio, role
- **Storage**: `/static/storage/pbc_3824009647/`

### Musicians
- **Fields**: name, genre, bio, site, route
- **Storage**: `/static/storage/5rod2tewrl0ov3d/`

### Artists
- **Fields**: title, desc, bio, site, route
- **Storage**: `/static/storage/3jnleendml5ld46/`

### Partners
- **Fields**: name, site
- **Storage**: `/static/storage/cx8afblkixaub05/`

### Metaverse
- **Fields**: title, desc, url
- **Storage**: `/static/storage/0ct1vfvg71ebu9r/`

## Technical Details

### File Processing
- Images are automatically resized to max 2000x2000px
- JPEG quality set to 85% for optimal size/quality balance
- Files are named with random suffixes to prevent conflicts
- Thumbnails are not generated (handled by the main site)

### Data Format
- All records include: `id`, `created`, `updated`, `collectionName`
- Image references are stored as JSON arrays in the `pic` field
- Generated IDs are 15-character PocketBase-compatible strings

### Security Notes
- **Local Only**: This editor is designed for local development use
- **No Authentication**: Do not expose this to the public internet
- **File Validation**: Only image files are allowed for upload
- **Size Limits**: 10MB maximum file size per image

## Troubleshooting

### Port Already in Use
If port 3001 is busy, edit `server.js` and change the PORT variable.

### Permission Errors
Make sure you have write permissions to the project directory.

### File Upload Issues
- Check file size (max 10MB)
- Ensure file is a valid image format
- Check available disk space

### Git Integration
Make sure you're in the correct git repository and have push permissions.

## Development Mode

For development with auto-restart on changes:

```bash
npm run dev
```

This uses Node.js `--watch` flag to automatically restart the server when files change.

## Advanced Usage

### Bulk Operations
For bulk data operations, you can directly edit the JSON files in `/data/` directory, but be careful with the format and IDs.

### Custom Fields
To add new fields to collections, update both `server.js` (COLLECTIONS config) and `app.js` (collectionConfigs).

### Image Optimization
The Sharp library handles image optimization. You can adjust quality and resize settings in the upload handler in `server.js`.

---

**Happy Content Managing! 🚀**