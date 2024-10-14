const fs = require('fs');

// Read the JSON file
const jsonData = fs.readFileSync('./data/food.json', 'utf-8');
const data = JSON.parse(jsonData);

// Function to remove accents from a string
function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Convert the array into a key-value map
const keyValueMap = {};
data.forEach(entry => {
    const keyType = entry.type ? removeAccents(entry.type.toLowerCase().replace(/\s/g, '-').replace(/[\[\]\(\)\,\\\>\<]/g, '')) : '';
    const keyName = entry.name ? removeAccents(entry.name.toLowerCase().replace(/\s/g, '-').replace(/[\[\]\(\)\,\\\>\<]/g, '').replace(/\//g, '-')) : '';
    const keyDescription = entry.description ? removeAccents(entry.description.toLowerCase().replace(/\s/g, '-').replace(/[\[\]\(\)\,\\\>\<]/g, '')) : '';
    const key = [keyType, keyName, keyDescription].filter(Boolean).join('-');
    keyValueMap[key] = entry;
});


// Write the result to sources2.json
fs.writeFileSync('./data/food2.json', JSON.stringify(keyValueMap, null, 2));
