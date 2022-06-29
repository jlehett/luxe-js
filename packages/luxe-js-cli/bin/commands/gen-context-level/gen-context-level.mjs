#!/usr/bin/env node

import fs from 'fs';
import inquirer from 'inquirer';
import {
    displayLogo,
    createFileBasedOnTemplate,
} from '../../private-utils/index.mjs';

//#region Inquirer Questions

const questions = [
    {
        type: 'input',
        name: 'contextLevelName',
        message: 'Name of Context Level (kebab-case):',
        validate(value) {
            const pass = value.match(/^([a-z])([a-z-])*$/);

            if (pass) {
                return true;
            } else {
                return 'Please enter a valid context level name.';
            }
        }
    }
];

//#endregion

//#region Main Logic

displayLogo();

inquirer
    .prompt(questions)
    .then((answers) => {
        // If the context level already exists, bail early with a log that the process
        // did not continue
        if (fs.existsSync(`src/contexts/${answers.contextLevelName}.js`)) {
            console.log('This context level already exists. Please delete the context level if you would like to regenerate it.\n\n\n');
            return;
        }

        // Write the template out for the context level
        const commandTemplatesFilePath = 'node_modules/luxe-js-cli/bin/commands/gen-context-level/templates';
        createFileBasedOnTemplate(
            `${commandTemplatesFilePath}/context-level.hbs`,
            {},
            `src/contexts/${answers.contextLevelName}.js`,
        );

        // Log the success
        console.log(
            `New context level created at 'src/contexts/${answers.contextLevelName}.js'\n\n\n`,
        );
    });

//#endregion