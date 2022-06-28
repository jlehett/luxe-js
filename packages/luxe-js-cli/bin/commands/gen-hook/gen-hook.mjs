import fs from 'fs';
import inquirer from 'inquirer';
import {
    displayLogo,
    addExportToBarrelFile,
    createFileBasedOnTemplate,
} from '../../private-utils/index.mjs';

//#region Inquirer Questions

const questions = [
    {
        type: 'input',
        name: 'hookName',
        message: 'Name of Hook (camelCase):',
        validate(value) {
            const pass = value.match(/^([a-z])\w*$/);

            if (pass) {
                return true;
            } else {
                return 'Please enter a valid hook name.';
            }
        }
    },
    {
        type: 'input',
        name: 'hookCategory',
        message: 'Category of Hook (kebab-case):',
        validate(value) {
            const pass = value.match(/^([a-z])([a-z-])*$/);

            if (pass) {
                return true;
            } else {
                return 'Please enter a valid hook category.';
            }
        }
    },
];

//#endregion

//#region Main Logic

displayLogo();

inquirer
    .prompt(questions)
    .then((answers) => {
        // Get the hook's file name from its name
        const hookFileName = answers.hookName.split(/(?=[A-Z])/).join('-').toLowerCase();

        // If the hook directory already exists, bail early with a log that the process did
        // not continue
        if (fs.existsSync(`src/hooks/${answers.hookCategory}/${hookFileName}`)) {
            console.log('This hook already exists. Please delete the hook if you would like to regenerate it.\n\n\n');
            return;
        }

        // Append the new export to the barrel file
        addExportToBarrelFile(
            answers.hookName,
            'default',
            `src/hooks/${answers.hookCategory}`,
            `./${hookFileName}/${hookFileName}`
        );

        // Write the templates out for the component
        const commandTemplatesFilePath = 'node_modules/luxe-js-cli/bin/commands/gen-hook/templates';
        createFileBasedOnTemplate(
            `${commandTemplatesFilePath}/hook.hbs`,
            {},
            `src/hooks/${answers.hookCategory}/${hookFileName}/${hookFileName}.js`
        );

        // Log the success
        console.log(
            `New hook created at 'src/hooks/${answers.hookCategory}/${hookFileName}'\n\n\n`
        );
    });

//#endregion
