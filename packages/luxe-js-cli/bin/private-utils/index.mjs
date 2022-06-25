import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import insertLine from 'insert-line';

/**
 * Display the CLI's logo
 */
export function displayLogo() {
    console.log(
`

 _                       _____ _      _____ 
| |                     / ____| |    |_   _|
| |    _   ___  _____  | |    | |      | |   
| |   | | | \\ \\/ / _ \\ | |    | |      | |   
| |___| |_| |>  <  __/ | |____| |____ _| |_  
|______\\__,_/_/\\_\\___|  \\_____|______|_____|

~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-


`
    );
}

/**
 * Add a new export to a given barrel file.
 */
export function addExportToBarrelFile(exportName, exportType, barrelFilePath, relativeFilePath) {
    // Track a flag indicating whether the barrel file already exists
    const barrelFileAlreadyExists = fs.existsSync(barrelFilePath);

    // Create the barrel file if it doesn't exist yet
    if (!barrelFileAlreadyExists) {
        fs.mkdirSync(barrelFilePath, { recursive: true });
    }

    // Construct the new line to add to the barrel file
    let newLine;
    switch (exportType) {
        case 'all':
            newLine = `export * from '${relativeFilePath}';`;
            break;
        case 'default':
            newLine = `export { default as ${exportName} } from '${relativeFilePath}';`;
            break;
        default:
            throw new Error(`Unsupported exportType: ${exportType}`);
    }

    // Add the export to the barrel
    fs.appendFileSync(
        `${barrelFilePath}/index.js`,
        `${barrelFileAlreadyExists ? '\n' : ''}${newLine}`
    );
}

/**
 * Creates a new file based on a given template, compiled with the given template data.
 */
export function createFileBasedOnTemplate(templateFilePath, templateData, writeFilePath) {
    // Obtain and compile the template
    const templateFileContent = fs.readFileSync(templateFilePath, 'utf-8');
    const template = handlebars.compile(templateFileContent);

    // Create the templated data
    const templatedData = template(templateData);

    // Write to the new file
    if (!fs.existsSync(path.dirname(writeFilePath))) {
        fs.mkdirSync(path.dirname(writeFilePath, { recursive: true }));
    }
    fs.writeFileSync(
        `${writeFilePath}`,
        templatedData,
    );
}

/**
 * Inserts the given content at the first instance of some comparison content, plus
 * the given line offset. Returns true if the update is written successfully, false otherwise.
 */
export function insertAtFirstRegexMatch(file, toInsert, regex, lineOffset=0) {
    let originalData = fs.readFileSync('src/main.jsx').toString().split('\n');
    let lineNum = 0;
    for (let line of originalData) {
        if (line.match(regex)) {
            insertLine(file)
                .contentSync(toInsert)
                .at(lineNum + lineOffset);
            return true;
        } else {
            lineNum++;
        }
    }
    return false;
}
