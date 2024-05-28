const fs = require('fs');
const path = require('path');

const scenariosFolder = '../scenarios'; // Path to the scenarios folder
const outputFileName = '../data/index.json'; // Output file name

const library = require('./carbon-footprint-modeling-tool.js');

let results = []; // Array to store the computed emission results

// Read all JSON files in the scenarios folder
fs.readdir(scenariosFolder, (err, files) => {
  if (err) {
    console.error('Error reading scenarios folder:', err);
    return;
  }

  // Iterate over each file
  files.forEach(file => {
    if (path.extname(file) === '.json') { // Check if the file is a JSON file
      const filePath = path.join(scenariosFolder, file);
      console.log(filePath)
      const fileContent = fs.readFileSync(filePath, 'utf8'); // Read the file content

      try {
        const scenarioData = JSON.parse(fileContent); // Parse the JSON data

        // Calculate total emissions for the scenario
        const totalEmissions = library.totalEmissions(scenarioData);

        // Create result object with scenario id, title, description, and emission values
        const result = {
          id: path.parse(file).name, // Scenario id (file name without extension)
          title: scenarioData.title, // Scenario title
          description: scenarioData.description, // Scenario description
          emissions: totalEmissions // Computed total emissions
        };

        results.push(result); // Add the result to the results array
      } catch (error) {
        console.error('Error parsing JSON file:', file, error);
      }
    }
  });

  // Write the results to the output file
  fs.writeFile(outputFileName, JSON.stringify(results, null, 2), 'utf8', err => {
    if (err) {
      console.error('Error writing output file:', err);
      return;
    }
    console.log('Emission results have been successfully written to', outputFileName);
  });
});