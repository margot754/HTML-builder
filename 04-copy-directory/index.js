const fs = require('fs').promises;
const path = require('path');

const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

async function copyFolder() {
  try {
    // Remove the 'files-copy' folder and its contents
    await fs.rm(destPath, { recursive: true, force: true });

    // Create 'files-copy' folder
    await fs.mkdir(destPath, { recursive: true });
    console.log(`Created 'files-copy' folder.`);
  } catch (error) {
    console.error(`Error ensuring clean 'files-copy' folder: ${error.message}`);
    throw error;
  }
  const files = await readFiles();

  for (const file of files) {
    const srcFile = path.join(srcPath, file);
    const destFile = path.join(destPath, file);

    try {
      await fs.copyFile(srcFile, destFile);
      console.log(`Copied file: ${file}`);
    } catch (error) {
      console.error(`Error copying file ${file}: ${error.message}`);
    }
  }
}

async function readFiles() {
  try {
    return await fs.readdir(srcPath);
  } catch (error) {
    console.error(`Error reading directory: ${error.message}`);
  }
}

copyFolder();