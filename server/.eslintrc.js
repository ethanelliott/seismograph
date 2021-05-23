module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json'
    },
    plugins: [
        "@typescript-eslint",
        "no-loops"
    ],
    extends: [
        'eslint:recommended',
        'airbnb-typescript',
    ],
    rules: {
        "no-console": "error",
        "import/prefer-default-export": "off",
        "class-methods-use-this": "off",
        "no-prototype-builtins": "off",
        "no-param-reassign": "off",
        "import/no-cycle": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        "max-len": "off",
        "no-loops/no-loops": "warn"
    }
};
