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
        name: 'componentName',
        message: 'Name of Component:',
        validate(value) {
            const pass = value.match(/^([A-Z])\w*$/);

            if (pass) {
                return true;
            } else {
                return 'Please enter a valid component name.';
            }
        },
    },
    {
        type: 'input',
        name: 'componentCategory',
        message: 'Category of Component:',
        validate(value) {
            const pass = value.match(/^([a-z])([a-z-])*$/);

            if (pass) {
                return true;
            } else {
                return 'Please enter a valid component category.';
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
        // We need to extract the values we need from the input
        const data = {
            componentName: answers.componentName,
            componentFileName: answers.componentName.split(/(?=[A-Z])/).join('-').toLowerCase(),
            componentCategory: answers.componentCategory
                .replace('-', ' '),
            componentCategoryFilePath: answers.componentCategory,
        };

        // If the component directory already exists, bail early with a log that the process did
        // not continue
        if (fs.existsSync(`src/components/${data.componentCategoryFilePath}/${data.componentFileName}`)) {
            console.log('This component already exists at this location. Please delete the component if you would like to regenerate it.\n\n\n');
            return;
        }

        // Append the new export to the barrel file
        addExportToBarrelFile(
            data.componentName,
            'default',
            `src/components/${data.componentCategoryFilePath}`,
            `./${data.componentFileName}/${data.componentFileName}`,
        );

        // Write the templates out for the component
        const commandTemplatesFilePath = 'node_modules/luxe-js-cli/bin/commands/gen-reusable-comp/templates';
        createFileBasedOnTemplate(
            `${commandTemplatesFilePath}/component.hbs`,
            data,
            `src/components/${data.componentCategoryFilePath}/${data.componentFileName}/${data.componentFileName}.jsx`,
        );

        createFileBasedOnTemplate(
            `${commandTemplatesFilePath}/stories.hbs`,
            data,
            `src/components/${data.componentCategoryFilePath}/${data.componentFileName}/${data.componentFileName}.stories.js`,
        );

        createFileBasedOnTemplate(
            `${commandTemplatesFilePath}/styles.hbs`,
            data,
            `src/components/${data.componentCategoryFilePath}/${data.componentFileName}/${data.componentFileName}.module.scss`,
        );

        // Log the success
        console.log(
            `New reusable component created at 'src/components/${data.componentCategoryFilePath}/${data.componentFileName}'\n\n\n`,
        );
    });

//#endregion