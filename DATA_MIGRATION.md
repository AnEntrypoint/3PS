# Data Migration: PocketBase to Static JSON

This project has been migrated from using PocketBase as a backend to importing static JSON files directly into the build.

## What Changed

### Before
- Data was fetched from PocketBase at runtime
- Images were served via PocketBase file URLs
- Required network requests for data loading

### After
- Data is imported from JSON files at build time
- Images are served as static assets from the `/static/storage` directory
- No runtime network requests needed for core data
- All assets are bundled with the application

## File Structure

### Data Files (imported at build time)
- `/data/team.json` - Team member information
- `/data/musician.json` - Musician profiles and details
- `/data/artist.json` - Artist profiles and galleries
- `/data/partner.json` - Partner information and logos
- `/data/Metaverse.json` - Metaverse platform links

### Static Assets
- `/static/storage/{collection_id}/{record_id}/{filename}` - All images and media files served locally

### Code Changes
- **New**: `/src/lib/data.ts` - Static data import and processing
- **Modified**: `/src/lib/db.ts` - Now redirects to data.ts
- **Backup**: `/src/lib/db.ts.backup` - Original PocketBase implementation

## Image URL Mapping

The migration maps PocketBase image references to static file paths:

```
PocketBase: pb.files.getURL(item, "filename.jpg")
Static:     /storage/{collection_id}/{record_id}/filename.jpg
```

Collection ID mappings:
- `metaverse` → `0ct1vfvg71ebu9r`
- `artist` → `3jnleendml5ld46`
- `musician` → `5rod2tewrl0ov3d`
- `partner` → `cx8afblkixaub05`
- `team` → `pbc_3824009647`

## Data Format

All data maintains the same structure as PocketBase exports:
- `pic` fields contain arrays of filenames (JSON strings in source files)
- Images are processed into full URLs during import
- All original metadata (id, created, updated, etc.) is preserved

## Benefits

1. **Performance**: No runtime database queries
2. **Deployment**: Self-contained static site
3. **Reliability**: No external dependencies
4. **CI/CD**: Data updates trigger automatic rebuilds
5. **Caching**: Better browser and CDN caching

## Updating Data

To update the site data:
1. Update the corresponding JSON file in `/data/`
2. Add any new images to `/static/storage/{collection_id}/{record_id}/`
3. Commit changes to trigger CI/CD rebuild

## Component Compatibility

All existing components continue to work without modification. The data structure and API remain identical.

## Deployment

The site supports two deployment modes:

### Custom Domain (thirdplanet.studio)
- Automatic deployment on push to main
- Full URL paths without base path
- CNAME file included

### GitHub Pages (anentrypoint.github.io/3PS)  
- Manual deployment via GitHub Actions
- Base path `/3PS` for proper asset loading
- CNAME file removed to prevent conflicts

See `DEPLOYMENT.md` for detailed instructions.

## Rollback

To rollback to PocketBase:
1. Restore `/src/lib/db.ts` from `/src/lib/db.ts.backup`
2. Remove `/src/lib/data.ts`
3. Update `svelte.config.js` to use `@sveltejs/adapter-node`
4. Ensure PocketBase server is running and accessible