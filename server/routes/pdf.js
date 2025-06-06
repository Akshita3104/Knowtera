const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    fs.unlinkSync(filePath);

    res.json({ text: data.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to parse PDF' });
  }
});

module.exports = router;
