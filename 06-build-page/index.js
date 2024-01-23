const fs = require('fs').promises;
const path = require('path');

const outPath = path.join(__dirname, 'project-dist');
const indexFile = path.join(outPath, 'index.html');
const stylesPath = path.join(__dirname, 'styles');
const styleFile = path.join(outPath, 'style.css');
const assetsPath = path.join(__dirname, 'assets');
const assetsOutPath = path.join(outPath, 'assets');
const componentsPath = path.join(__dirname, 'components');

async function readTemplate() {
  try {
    const templatePath = path.join(__dirname, 'template.html');
    return await fs.readFile(templatePath, 'utf8');
  } catch (err) {
    throw new Error(`Error reading the template: ${err.message}`);
  }
}

async function replaceTemplateTags(templateContent, components) {
  for (const componentName in components) {
    // eslint-disable-next-line no-prototype-builtins
    if (components.hasOwnProperty(componentName)) {
      const placeholder = `{{${componentName}}}`;
      const componentContent = components[componentName];

      templateContent = templateContent
        .split(placeholder)
        .join(componentContent);
    }
  }

  return templateContent;
}

async function copyFolder(source, destination) {
  try {
    await fs.mkdir(destination, { recursive: true });

    const files = await fs.readdir(source);

    await Promise.all(
      files.map(async (file) => {
        const sourcePath = path.join(source, file);
        const destinationPath = path.join(destination, file);

        const stat = await fs.stat(sourcePath);

        if (stat.isDirectory()) {
          await copyFolder(sourcePath, destinationPath);
        } else {
          await fs.copyFile(sourcePath, destinationPath);
        }
      }),
    );

    console.log(`Files successfully copied from: ${source} to: ${destination}`);
  } catch (err) {
    throw new Error(`Error copying files: ${err.message}`);
  }
}

async function buildPage() {
  try {
    await fs.mkdir(outPath, { recursive: true }); 
    const templateContent = await readTemplate();
    const componentFiles = await fs.readdir(componentsPath);

    const components = {};
    await Promise.all(
      componentFiles.map(async (componentName) => {
        const componentPath = path.join(componentsPath, componentName);
        components[path.basename(componentName, '.html')] = await fs.readFile(
          componentPath,
          'utf8',
        );
        // console.log(components)
      }),
    );

    const pageContent = await replaceTemplateTags(templateContent, components);

    await fs.writeFile(indexFile, pageContent, 'utf8');
    console.log(`Page successfully built in: ${indexFile}`);

    await compileStyles();
    await copyFolder(assetsPath, assetsOutPath);
    console.log('Assets successfully copied.');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

async function compileStyles() {
  try {
   
    const stylesArray = [];
    const files = await fs.readdir(stylesPath);

    const cssFiles = files.filter((file) => file.endsWith('.css'));

    await Promise.all(
      cssFiles.map(async (cssFile) => {
        const filePath = path.join(stylesPath, cssFile);
        const fileContent = await fs.readFile(filePath, 'utf8');
        stylesArray.push(fileContent);
      }),
    );

    const bundleContent = stylesArray.join('\n');

    await fs.writeFile(styleFile, bundleContent, 'utf8');
    console.log(`Styles successfully compiled into: ${styleFile}`);
  } catch (err) {
    throw new Error(`Error compiling styles: ${err.message}`);
  }
}

buildPage();
