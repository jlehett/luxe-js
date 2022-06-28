import fs from 'fs';
import inquirer from 'inquirer';
import {
    displayLogo,
    createFileBasedOnTemplate,
} from '../../private-utils/index.mjs';

//#region Inquirer Questions

const initialQuestions = [
    {
        type: 'list',
        name: 'viewType',
        message: 'Type of View:',
        choices: [
            'Page',
            'Index Page',
            'Wrapper',
        ],
    },
    {
        type: 'input',
        name: 'viewName',
        message: 'Name of View',
        validate(value) {
            const pass = value.match(/^([A-Z])\w*$/);

            if (pass) {
                return true;
            } else {
                return 'Please enter a valid view name.';
            }
        }
    },
    {
        type: 'input',
        name: 'viewCategories',
        message: 'Categories (comma-separated list, from top-down):',
        validate(value) {
            const categories = value.split(',');
            
            for (const category of categories) {
                const catStringToTest = category.trim();
                if (!catStringToTest.match(/^([a-z])([a-z-])*$/)) {
                    return 'Please enter a valid comma-separated list of view categories.';
                }
            }
            return true;
        }
    },
];

//#endregion

//#region Main Logic

displayLogo();

let allAnswers = {};
const addAnswers = (answers) => allAnswers = {...allAnswers, ...answers};

inquirer.prompt(initialQuestions)
    .then(addAnswers)
    .then(() => {
        // We need to extract out the categories of the view
        const categories = allAnswers.viewCategories.split(',').map((category) => category.trim());
        
        // We need to extract out the name of the view's file
        let viewFileName;
        switch (allAnswers.viewType) {
            case 'Page':
                viewFileName = allAnswers.viewName.split(/(?=[A-Z])/).join('-').toLowerCase();
                break;
            case 'Index Page':
                viewFileName = 'index';
                break;
            case 'Wrapper':
                viewFileName = 'wrapper';
                break;
            default:
                throw new Error('Invalid view type.');
        }

        // We need to construct the route to the view's directory
        let fileToTestForExistence;
        let specificViewDirectory = 'src/views/';
        for (const category of categories) {
            specificViewDirectory += `${category}/`;
        }
        if (allAnswers.viewType === 'Page') {
            specificViewDirectory += `${viewFileName}`;
            fileToTestForExistence = specificViewDirectory;
        } else {
            fileToTestForExistence = `${specificViewDirectory}/${viewFileName}.jsx`;
        }

        // If the view category already exists, bail early with a log that the process
        // did not continue
        if (fs.existsSync(fileToTestForExistence)) {
            console.log('This view already exists at this location. Please delete the view if you would like to regenerate it.\n\n\n');
            return;
        }

        // Write out the templates for the view
        const commandTemplatesFilePath = 'node_modules/luxe-js-cli/bin/commands/gen-view/templates';
        let templateToUse;
        switch (allAnswers.viewType) {
            case 'Page':
                templateToUse = 'page.hbs';
                break;
            case 'Index Page':
                templateToUse = 'index-page.hbs';
                break;
            case 'Wrapper':
                templateToUse = 'wrapper.hbs';
                break;
            default:
                throw new Error('Invalid view type.');
        }
        createFileBasedOnTemplate(
            `${commandTemplatesFilePath}/${templateToUse}`,
            {
                ...allAnswers,
                viewFileName,
            },
            `${specificViewDirectory}/${viewFileName}.jsx`
        );
        createFileBasedOnTemplate(
            `${commandTemplatesFilePath}/styles.hbs`,
            {},
            `${specificViewDirectory}/${viewFileName}.module.scss`
        );
    });

//#endregion