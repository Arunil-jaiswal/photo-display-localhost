const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || process.argv[2] || 3000;
const IMAGE_FOLDERS = ['folder1', 'folder2', 'folder3', 'folder4'];
const PUBLIC_DIR = path.join(__dirname, 'public');

const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

function getImages(folderName) {
  const folderPath = path.join(__dirname, folderName);
  try {
    const files = fs.readdirSync(folderPath, { withFileTypes: true });
    return files
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => validExtensions.includes(path.extname(name).toLowerCase()))
      .sort();
  } catch (error) {
    console.error(`Error reading ${folderName}:`, error.message);
    return [];
  }
}

app.use(express.static(PUBLIC_DIR));
app.use('/images', express.static(__dirname));

app.get('/api/images/:folderId', (req, res) => {
  const id = parseInt(req.params.folderId, 10);
  if (Number.isNaN(id) || id < 1 || id > IMAGE_FOLDERS.length) {
    return res.status(400).json({ error: 'Invalid folder id. Use 1 to 4.' });
  }

  const folderName = IMAGE_FOLDERS[id - 1];
  const images = getImages(folderName).map((fileName) => ({
    name: fileName,
    url: `/images/${folderName}/${encodeURIComponent(fileName)}`
  }));

  res.json({ folder: folderName, images });
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', folders: IMAGE_FOLDERS });
});

app.listen(PORT, () => {
  console.log('===============================================');
  console.log('  Sparky Herofy Photobooth server is running');
  console.log(`  Open: http://localhost:${PORT}`);
  console.log('  Folders:', IMAGE_FOLDERS.join(', '));
  console.log('  Add images to folder1..folder4 while the server is running.');
  console.log('===============================================');
});
