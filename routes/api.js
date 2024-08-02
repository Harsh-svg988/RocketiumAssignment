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
    // if (req.query.filterKey && req.query.filterValue) {
    //   jsonData = jsonData.filter(item => item[req.query.filterKey] == req.query.filterValue);
    // }
    if (req.query.filterKey && req.query.filterValue) {
      const filterKey = req.query.filterKey;
      const filterValue = req.query.filterValue;

      // Check if filterKey exists in at least one item in jsonData
      const isValidFilterKey = jsonData.some(item => item.hasOwnProperty(filterKey));

      if (isValidFilterKey) {
        // Check if filterValue is valid (not undefined or null)
        if (filterValue !== undefined && filterValue !== null) {
          jsonData = jsonData.filter(item => item[filterKey] == filterValue);
        } else {
          return res.status(400).send({ error: 'Invalid filterValue provided' });
        }
      } else {
        return res.status(400).send({ error: 'Invalid filterKey provided' });
      }
    } else if (req.query.filterKey || req.query.filterValue) {
      return res.status(400).send({ error: 'Both filterKey and filterValue are required' });
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
