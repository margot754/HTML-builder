const fs = require('fs');
const path = require('path');
const { stdout } = process;

const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, (error, files) => {
  if (error) {
    console.error(`Error reading directory: ${error.message}`);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(secretFolderPath, file);

    fs.stat(filePath, (statErr, stats) => {
      if (statErr) {
        console.error(`Error getting file stats for ${file}: ${statErr.message}`);
        return;
      }

      if (stats.isFile()) {
        const fileSizeKB = (stats.size / 1024).toFixed(2);
        const fileExt = path.parse(filePath).ext.slice(1);
        const fileName = path.parse(filePath).name;
        stdout.write(`${fileName} - ${fileExt} - ${fileSizeKB}kb\n`);
      }
    });
  });
});

