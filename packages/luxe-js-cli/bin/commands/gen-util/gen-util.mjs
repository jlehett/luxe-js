#!/usr/bin/env node

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
        name: 'utilFileName',
        message: 'Name of Utility File (kebab-case):',
        validate(value) {
            const pass = value.match(/^([a-z])([a-z-])*$/);

            if (pass) {
                return true;
            } else {
                return 'Please enter a valid utility file name.';
            }
        }
    },
    {
        type: 'input',
        name: 'utilCategory',
        message: 'Category of Utility (kebab-case):',
        validate(value) {
            const pass = value.match(/^([a-z])([a-z-])*$/);

            if (pass) {
                return true;
            } else {
                return 'Please enter a valid utility category.';
            }
        },
    },
];

//#endregion

//#region Main Logic

displayLogo();

inquirer
    .prompt(questions)
    .then((answers) => {
        // If the utility directory already exists, bail early with a log that the process
        // did not continue
        if (fs.existsSync(`src/utils/${answers.utilCategory}/${answers.utilFileName}`)) {
            console.log('This utility already exists at this location. Please delete the util if you would like to regenerate it.\n\n\n');
            return;
        }

        // Append the new export to the barrel file
        addExportToBarrelFile(
            null,
            'all',
            `src/utils/${answers.utilCategory}`,
            `./${answers.utilFileName}/${answers.utilFileName}`,
        );

        // Write the new template out for the utility
        const commandTemplatesFilePath = 'node_modules/luxe-js-cli/bin/commands/gen-util/templates';
        createFileBasedOnTemplate(
            `${commandTemplatesFilePath}/util.hbs`,
            {},
            `src/utils/${answers.utilCategory}/${answers.utilFileName}/${answers.utilFileName}.js`,
        );

        // Log the success
        console.log(
            `New util created at 'src/utils/${answers.utilCategory}/${answers.utilFileName}'\n\n\n`,
        );
    });

//#endregion