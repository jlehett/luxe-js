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
        name: 'serviceName',
        message: 'Name of Service (PascalCase):',
        validate(value) {
            const pass = value.match(/^([A-Z])\w*$/);

            if (pass) {
                return true;
            } else {
                return 'Please enter a valid service name.';
            }
        },
    },
    {
        type: 'input',
        name: 'serviceCategory',
        message: 'Category of Service (kebab-case):',
        validate(value) {
            const pass = value.match(/^([a-z])([a-z-])*$/);

            if (pass) {
                return true;
            } else {
                return 'Please enter a valid service category.';
            }
        }
    },
    {
        type: 'confirm',
        name: 'isSingleton',
        message: 'Is this a singleton service?',
    },
];

//#endregion

//#region Main Logic

displayLogo();

inquirer
    .prompt(questions)
    .then((answers) => {
        // We need to extract the values we need from the input
        const data = {
            serviceName: answers.serviceName,
            serviceFileName: answers.serviceName.split(/(?=[A-Z])/).join('-').toLowerCase(),
            serviceCategory: answers.serviceCategory,
            isSingleton: answers.isSingleton,
        };

        // If the service directory already exists, bail early with a log that the process
        // did not continue
        if (fs.existsSync(`src/services/${data.serviceCategory}/${data.serviceFileName}`)) {
            console.log('This service already exists at this location. Please delete the service if you would like to regenerate it.\n\n\n');
            return;
        }

        // Append the new export to the barrel file
        addExportToBarrelFile(
            data.serviceName,
            'default',
            `src/services/${data.serviceCategory}`,
            `./${data.serviceFileName}/${data.serviceFileName}`,
        );

        // Write the template out for the service
        const commandTemplatesFilePath = 'node_modules/luxe-js-cli/bin/commands/gen-service/templates';
        createFileBasedOnTemplate(
            `${commandTemplatesFilePath}/${data.isSingleton ? 'singleton-service.hbs' : 'service.hbs'}`,
            data,
            `src/services/${data.serviceCategory}/${data.serviceFileName}/${data.serviceFileName}.js`,
        );

        // Log the success
        console.log(
            `New ${data.isSingleton ? 'singleton ' : ''}service created at 'src/services/${data.serviceCategory}/${data.serviceFileName}'\n\n\n`,
        );
    });

//#endregion