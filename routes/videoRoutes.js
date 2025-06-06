

// Name: Ronald Kiefer
// Date: May 27, 2025 Tuesday 12:10 PM
// Description: This file contains the configuration for the DigitalOcean Spaces client.



import express from 'express';
import multer from 'multer';
import { uploadOrUpdateVideo, listVideos, deleteVideo, downloadVideo } from '../docean.js';

const router = express.Router();
const upload = multer();


//upload route
router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file || file.mimetype !== 'video/mp4') {
    return res.status(400).json({ error: 'No mp4 file uploaded or invalid file object' });
  }
  try {
    const url = await uploadOrUpdateVideo(file);
    res.status(200).json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Stream video route (key at the end)
router.get('/videos/stream/:key', async (req, res) => {
  console.log("backend stream hit for key:", req.params.key);

  try {
    const key = req.params.key;
    const { stream, contentType, contentLength } = await downloadVideo(key);

    // CORS for this route
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Accept-Ranges', 'bytes');
    res.header('Content-Type', contentType);
    res.header('Content-Length', contentLength);

    stream.pipe(res);
  } catch (err) {
    res.status(404).json({ error: 'Video not found' });
  }
});





// get videos
router.get('/videos', async (req, res) => {

// Enable CORS for this route
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  


  try {
    const videos = await listVideos();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//delete
router.delete('/videos/:key', async (req, res) => {
  try {
    await deleteVideo(req.params.key);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Download route


router.get('/download/:key', async (req, res) => {
  console.log("backend stream hit for key2:", req.params.key);
  try {
    const key = req.params.key; // This will capture everything after /videos/download/
    const { stream, contentType, contentLength, fileName } = await downloadVideo(key);
    //const result = await downloadVideo(key);
   // console.log("downloadVideo result:", result); // <-- Add this line
   res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', contentLength);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    stream.pipe(res);  
  } catch (err) {
    res.status(404).json({ error: 'Video not found' });
  }
});




export default router;




