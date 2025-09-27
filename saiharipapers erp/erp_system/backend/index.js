const express = require('express');
const xlsx = require('xlsx');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const excelFiles = {
  'SAI HARI COVAI 2022 - 2023': 'SAI HARI COVAI 2022 - 2023.xlsx',
  'SHP AUG 25 ATTN': 'SHP AUG 25 ATTN.xlsx',
  'SHP MAY 25 ATTN': 'SHP MAY 25 ATTN.xlsx',
};

app.get('/api/excel/:filename', (req, res) => {
  const { filename } = req.params;
  const excelFilePath = path.join(__dirname, '..', excelFiles[filename]);

  if (!excelFiles[filename]) {
    return res.status(404).json({ error: 'File not found' });
  }

  try {
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    res.json(data);
  } catch (error) {
    console.error('Error reading Excel file:', error);
    res.status(500).json({ error: 'Failed to read Excel file' });
  }
});

app.listen(port, () => {
  console.log(`Backend API listening at http://localhost:${port}`);
});