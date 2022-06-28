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
    }
];

const pageQuestions = [
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
    }
];

const globalQuestions = [
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
    {
        type: 'input',
        name: 'routing',
        message: 'URL Route:',
        validate(value) {
            return true;
        }
    }
];

//#endregion

//#region Main Logic

displayLogo();

let allAnswers = {};
const addAnswers = (answers) => allAnswers = {...allAnswers, ...answers};

inquirer.prompt(initialQuestions)
    .then(addAnswers)
    .then(() => {
        if (allAnswers.viewType === 'Page') {
            return inquirer.prompt(pageQuestions);
        } else {
            return {};
        }
    })
    .then(addAnswers)
    .then(() => inquirer.prompt(globalQuestions))
    .then(addAnswers)
    .then(() => {
        // We need to extract out the categories of the view
        const categories = allAnswers.viewCategories.split(',').map((category) => category.trim());
        
        // We need to extract out the name of the view's file
        const viewFileName = allAnswers.viewName.split(/(?=[A-Z])/).join('-').toLowerCase();

        // We need to construct the route to the view's directory
        let specificViewDirectory = 'src/views/';
        for (const category of categories) {
            specificViewDirectory += `${category}/`;
        }
        specificViewDirectory += `${viewFileName}`;

        // If the view category already exists, bail early with a log that the process
        // did not continue
        const
        if (fs.existsSync(`src/views/`))
    });

//#endregion