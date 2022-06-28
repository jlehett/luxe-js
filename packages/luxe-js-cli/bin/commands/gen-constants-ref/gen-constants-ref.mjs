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
        name: 'constantRefName',
        message: 'Name of Constants Ref (PascalCase):',
        validate(value) {
            const pass = value.match(/^([A-Z])\w*$/);

            if (pass) {
                return true;
            } else {
                return 'Please enter a valid constants ref name.';
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
        // We need to extract the values we need from the input
        const data = {
            constantRefName: answers.constantRefName,
            constantRefExportName: answers.constantRefName.split(/(?=[A-Z])/).join('_').toUpperCase(),
            constantRefFileName: answers.constantRefName.split(/(?=[A-Z])/).join('-').toLowerCase(),
        };

        // If the constant ref file already exists, bail early with a log that the process did
        // not continue
        if (fs.existsSync(`src/utils/constants/${data.constantRefFileName}.js`)) {
            console.log('This constants ref already exists at this location. Please delete the constants ref if you would like to regenerate it.\n\n\n');
            return;
        }

        // Append the new export to the barrel file
        addExportToBarrelFile(
            data.constantRefExportName,
            'default',
            `src/utils/constants`,
            `./${data.constantRefFileName}`,
        );

        // Write the template out for the constants ref
        const commandTemplatesFilePath = 'node_modules/luxe-js-cli/bin/commands/gen-constants-ref/templates';
        createFileBasedOnTemplate(
            `${commandTemplatesFilePath}/constants-ref.hbs`,
            data,
            `src/utils/constants/${data.constantRefFileName}.js`
        );

        // Log the success
        console.log(
            `New constants ref created at 'src/utils/constants/${data.constantRefFileName}.js\n\n\n`,
        );
    });

//#endregion