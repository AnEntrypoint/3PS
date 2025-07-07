import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Collection configurations
const COLLECTIONS = {
  team: { id: 'pbc_3824009647', fields: ['name', 'nickname', 'bio', 'role'] },
  musician: { id: '5rod2tewrl0ov3d', fields: ['name', 'genre', 'bio', 'site', 'route'] },
  artist: { id: '3jnleendml5ld46', fields: ['title', 'desc', 'bio', 'site', 'route'] },
  partner: { id: 'cx8afblkixaub05', fields: ['name', 'site'] },
  metaverse: { id: '0ct1vfvg71ebu9r', fields: ['title', 'desc', 'url'] }
};

// Utility functions
class DataManager {
  static async readCollection(collection) {
    try {
      const filePath = join(rootDir, 'data', `${collection}.json`);
      if (collection === 'metaverse') {
        const data = await fs.readFile(join(rootDir, 'data', 'Metaverse.json'), 'utf8');
        return JSON.parse(data);
      }
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${collection}:`, error);
      return [];
    }
  }

  static async writeCollection(collection, data) {
    try {
      const fileName = collection === 'metaverse' ? 'Metaverse.json' : `${collection}.json`;
      const filePath = join(rootDir, 'data', fileName);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error(`Error writing ${collection}:`, error);
      return false;
    }
  }

  static generateId() {
    // Generate a PocketBase-style ID (15 characters)
    return uuidv4().replace(/-/g, '').substring(0, 15);
  }

  static async createStorageDir(collectionName, recordId) {
    const collectionId = COLLECTIONS[collectionName]?.id || collectionName;
    const storagePath = join(rootDir, 'static', 'storage', collectionId, recordId);
    
    if (!existsSync(storagePath)) {
      await fs.mkdir(storagePath, { recursive: true });
    }
    
    return storagePath;
  }
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Routes

// Get all collections
app.get('/api/collections', async (req, res) => {
  try {
    const collections = {};
    for (const [name, config] of Object.entries(COLLECTIONS)) {
      collections[name] = {
        data: await DataManager.readCollection(name),
        config
      };
    }
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific collection
app.get('/api/collections/:collection', async (req, res) => {
  try {
    const { collection } = req.params;
    if (!COLLECTIONS[collection]) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const data = await DataManager.readCollection(collection);
    res.json({
      data,
      config: COLLECTIONS[collection]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new record
app.post('/api/collections/:collection', async (req, res) => {
  try {
    const { collection } = req.params;
    const recordData = req.body;

    if (!COLLECTIONS[collection]) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const data = await DataManager.readCollection(collection);
    
    // Create new record with metadata
    const newRecord = {
      id: DataManager.generateId(),
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      collectionName: collection,
      pic: [],
      ...recordData
    };

    data.push(newRecord);
    
    // Create storage directory
    await DataManager.createStorageDir(collection, newRecord.id);
    
    const success = await DataManager.writeCollection(collection, data);
    if (success) {
      res.json(newRecord);
    } else {
      res.status(500).json({ error: 'Failed to save record' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update record
app.put('/api/collections/:collection/:id', async (req, res) => {
  try {
    const { collection, id } = req.params;
    const updateData = req.body;

    if (!COLLECTIONS[collection]) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const data = await DataManager.readCollection(collection);
    const recordIndex = data.findIndex(item => item.id === id);

    if (recordIndex === -1) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Update record
    data[recordIndex] = {
      ...data[recordIndex],
      ...updateData,
      updated: new Date().toISOString()
    };

    const success = await DataManager.writeCollection(collection, data);
    if (success) {
      res.json(data[recordIndex]);
    } else {
      res.status(500).json({ error: 'Failed to update record' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete record
app.delete('/api/collections/:collection/:id', async (req, res) => {
  try {
    const { collection, id } = req.params;

    if (!COLLECTIONS[collection]) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const data = await DataManager.readCollection(collection);
    const recordIndex = data.findIndex(item => item.id === id);

    if (recordIndex === -1) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Remove record
    const deletedRecord = data.splice(recordIndex, 1)[0];

    // Delete storage directory
    const collectionId = COLLECTIONS[collection].id;
    const storagePath = join(rootDir, 'static', 'storage', collectionId, id);
    try {
      await fs.rm(storagePath, { recursive: true, force: true });
    } catch (error) {
      console.warn('Could not delete storage directory:', error.message);
    }

    const success = await DataManager.writeCollection(collection, data);
    if (success) {
      res.json({ message: 'Record deleted successfully', record: deletedRecord });
    } else {
      res.status(500).json({ error: 'Failed to delete record' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload files for a record
app.post('/api/collections/:collection/:id/upload', upload.array('files'), async (req, res) => {
  try {
    const { collection, id } = req.params;
    
    if (!COLLECTIONS[collection]) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const data = await DataManager.readCollection(collection);
    const record = data.find(item => item.id === id);

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Create storage directory
    const storagePath = await DataManager.createStorageDir(collection, id);
    const uploadedFiles = [];

    // Process each uploaded file
    for (const file of req.files) {
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 12);
      const extension = file.originalname.split('.').pop().toLowerCase();
      const filename = `${file.originalname.split('.')[0]}_${randomSuffix}.${extension}`;
      const filePath = join(storagePath, filename);

      // Optimize image with sharp
      if (['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
        await sharp(file.buffer)
          .resize(2000, 2000, { 
            fit: 'inside', 
            withoutEnlargement: true 
          })
          .jpeg({ quality: 85 })
          .toFile(filePath);
      } else {
        await fs.writeFile(filePath, file.buffer);
      }

      uploadedFiles.push(filename);
    }

    // Update record with new file references
    const currentPics = Array.isArray(record.pic) ? record.pic : 
                       (typeof record.pic === 'string' ? JSON.parse(record.pic || '[]') : []);
    
    const newPics = [...currentPics, ...uploadedFiles];
    record.pic = JSON.stringify(newPics);
    record.updated = new Date().toISOString();

    const success = await DataManager.writeCollection(collection, data);
    if (success) {
      res.json({ 
        message: 'Files uploaded successfully', 
        files: uploadedFiles,
        record 
      });
    } else {
      res.status(500).json({ error: 'Failed to update record with file references' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file from record
app.delete('/api/collections/:collection/:id/files/:filename', async (req, res) => {
  try {
    const { collection, id, filename } = req.params;

    if (!COLLECTIONS[collection]) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const data = await DataManager.readCollection(collection);
    const record = data.find(item => item.id === id);

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Remove file from filesystem
    const collectionId = COLLECTIONS[collection].id;
    const filePath = join(rootDir, 'static', 'storage', collectionId, id, filename);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn('Could not delete file:', error.message);
    }

    // Remove file reference from record
    const currentPics = Array.isArray(record.pic) ? record.pic : 
                       (typeof record.pic === 'string' ? JSON.parse(record.pic || '[]') : []);
    
    const updatedPics = currentPics.filter(pic => pic !== filename);
    record.pic = JSON.stringify(updatedPics);
    record.updated = new Date().toISOString();

    const success = await DataManager.writeCollection(collection, data);
    if (success) {
      res.json({ message: 'File deleted successfully', record });
    } else {
      res.status(500).json({ error: 'Failed to update record' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve uploaded files
app.get('/api/files/:collectionId/:recordId/:filename', (req, res) => {
  const { collectionId, recordId, filename } = req.params;
  const filePath = join(rootDir, 'static', 'storage', collectionId, recordId, filename);
  
  if (existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Admin Editor running at http://localhost:${PORT}`);
  console.log(`📁 Managing data in: ${rootDir}`);
});