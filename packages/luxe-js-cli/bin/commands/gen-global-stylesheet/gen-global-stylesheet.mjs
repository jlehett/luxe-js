//#region Imports

import fs from 'fs';
import inquirer from 'inquirer';
import {
    displayLogo,
    insertAtFirstRegexMatch,
} from '../../private-utils/index.mjs';

//#endregion

//#region Inquirer Questions

const questions = [
    {
        type: 'input',
        name: 'stylesheetName',
        message: 'Name of Stylesheet (kebab-case):',
        validate(value) {
            const pass = value.match(/^([a-z])([a-z-])*$/);

            if (pass) {
                return true;
            } else {
                return 'Please enter a valid global stylesheet name.';
            }
        },
    },
]

//#endregion

//#region Main Logic

displayLogo();

inquirer
    .prompt(questions)
    .then((answers) => {
        // If the stylesheet already exists, bail early with a log that the process
        // did not continue
        if (fs.existsSync(`src/stylesheets/${answers.stylesheetName}.scss`)) {
            console.log('This global stylesheet already exists. Please delete the stylesheet if you would like to regenerate it.\n\n\n');
            return;
        }

        // Create the new empty stylesheet file
        fs.writeFileSync(
            `src/stylesheets/${answers.stylesheetName}.scss`,
            ''
        );

        // Add the import of the stylesheet to the .storybook preview file
        insertAtFirstRegexMatch(
            '.storybook/preview.js',
            `import '@stylesheets/${answers.stylesheetName}.scss';`,
            /^ *$/,
        );

        // Add the import of the stylesheet to main.jsx
        insertAtFirstRegexMatch(
            'src/main.jsx',
            `import '@stylesheets/${answers.stylesheetName}.scss';`,
            /^ *$/,
        );

        // Log the success message
        console.log(`New global stylesheet created at src/stylesheets/${answers.stylesheetName}.scss\n\n\n`);
    });

//#endregion