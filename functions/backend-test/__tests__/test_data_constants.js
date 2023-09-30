export const DISTRIBUTE_FUNCTION_CATEGORY = "distribute";
export const OTHER_FUNCTION_CATEGORY = "other";
export const FUNCTION_DESC_INDEX = 0;

export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDf--XeJ2-pkwKkjGO1RLxzjwzJZUy_e0s",
    authDomain: "planimation-staging-181bc.firebaseapp.com",
    projectId: "planimation-staging-181bc",
    storageBucket: "planimation-staging-181bc.appspot.com",
    messagingSenderId: "914707935474",
    appId: "1:914707935474:web:ba4d0f22fa93687482206b",
    measurementId: "G-XYNE4FJ1CF",
    databaseURL: "http://localhost:8080"
};


export const TEST_FUNCTIONS_VALID = [
    {
        desc:{
            functionName: 'align_middle',
            briefDescription: 'This function aligns `obj1` to the middle of `obj2`.',
            category: 'other',
            example: '(equal (?obj1 x) (function align_middle (objects ?obj1 ?obj2)))',
            youtubeEmbeddingLink: 'https://www.youtube.com/embed/ziTAKykPj40?si=95t4ekKNAFpaOsAn',
            videoCode: '(:predicate boarded\n     :parameters (?person lift)\n     :custom lift\n     :effect(\n         (equal (?person y) (lift y))\n         (equal (?person x) (function align_middle (objects ?person lift)))\n     )\n)',
            videoExplanation: 'The function is used in the elevator domain when a passenger boards the lift. The passenger stands in the middle of the lift.'
        },
        properties:[]
    },

    {
        desc:{
            functionName: 'distributey',
            briefDescription: 'This function distributes objects along a vertical plane.',
            category: 'distribute',
            example: '(assign (?obj y) (function distributey (objects ?obj)))',
            youtubeEmbeddingLink: 'https://www.youtube.com/embed/XY5dVhz6cO4?si=zk0K9a7xo04tS5R3',
            videoCode: '(:predicate city\n :parameters (?city)\n :effect(\n (assign (?city y) (function distributey (objects ?city) (settings (initial 1))\n )\n)',
            videoExplanation: 'The function is used in the logistics domain when initiating positions of the cities. The 6 cities are distributed vertically.'
        },
        properties:[
            {
                defaultValue: 0,
                explanation: "governs the space between objects.",
                parameterName: "spacebtw"
            }
        ]
    }
];


/**
 * Get functions stored in a list of a specified category
 * @param functions: list of functions to retrieve functions from
 * @param category: category of functions to be retrieved
 * @param descOnly: if true, return description of the function only, discard property definitions
 * @returns list of functions retrieved
 */
export function getCategoryFunc(functions, category, descOnly = false) {
    const categoryFuncs = functions
                .filter(func => func.desc.category === category);
    if (descOnly) {
        return categoryFuncs.map(func => func.desc);
    }
    return categoryFuncs;
}

/**
 * Get all functions stored in a list
 * @param functions: list of functions to retrieve functions from
 * @param descOnly: if true, return description of the function only, discard property definitions
 * @returns list of functions retrieved
 */
export function getAllFunc(functions, descOnly = false) {
    if (descOnly) {
        return functions.map(func => func.desc);
    }
    return functions;
}


export const TEST_VISUAL_PROPERTY = [
    {
        desc:{
            name: 'x',
            type: 'compulsory',
            description: 'horizontal position of the object on screen'
        }, 
        dataTypes:[
            {dataType:'Integer'},
            {dataType:'NULL'}
        ]
    }
];