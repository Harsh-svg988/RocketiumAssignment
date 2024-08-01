const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Endpoint to get dummy data
router.get('/data', (req, res) => {
  const dataPath = path.join(__dirname, '../data/dummyData.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data');
    }

    let jsonData = JSON.parse(data);

    // Filtering
    if (req.query.filterKey && req.query.filterValue) {
      jsonData = jsonData.filter(item => item[req.query.filterKey] == req.query.filterValue);
    }

    // Sorting
    if (req.query.sortKey) {
        const sortKey = req.query.sortKey;
  
        // Check if sortKey is present in any of the objects
        if (jsonData.length > 0 && jsonData[0].hasOwnProperty(sortKey)) {
          jsonData = jsonData.sort((a, b) => {
            const valueA = a[sortKey];
            const valueB = b[sortKey];
  
            if (valueA > valueB) {
              return 1;
            } else if (valueA < valueB) {
              return -1;
            } else {
              return 0;
            }
          });
        } else {
          return res.status(400).send(`Invalid sort key: ${sortKey}`);
        }
      }
  
      res.json(jsonData);
  });
});

module.exports = router;
