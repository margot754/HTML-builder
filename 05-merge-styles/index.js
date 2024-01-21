const fs = require('fs').promises;
const path = require('path');

async function mergeStyles() {
    const stylesPath = path.join(__dirname, 'styles');
    const outputPath = path.join(__dirname, 'project-dist');
    const outputFile = path.join(outputPath, 'bundle.css');

    try {
    
        const files = await fs.readdir(stylesPath);
        const cssFiles = files.filter(file => file.endsWith('.css'));

        const stylesArray = [];

        await Promise.all(cssFiles.map(async cssFile => {
            const filePath = path.join(stylesPath, cssFile);
            const fileContent = await fs.readFile(filePath, 'utf8');
            console.log(`Read info from ${cssFile}`);
            stylesArray.push(fileContent);
        }));

        const bundleContent = stylesArray.join('\n');

        await fs.writeFile(outputFile, bundleContent, 'utf8');
        console.log(`Styles have been merged at: ${outputFile}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

mergeStyles();
