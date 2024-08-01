const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dummyurl = process.env.Dummy_url;

const fetchData = async () => {
  try {
    const response = await axios.get('dummyurl');
    const dataPath = path.join(__dirname, 'data/dummyData.json');
    fs.writeFileSync(dataPath, JSON.stringify(response.data, null, 2));
    console.log('Data saved successfully.');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

fetchData();
