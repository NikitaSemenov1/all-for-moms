module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    plugins: ['@typescript-eslint', 'prettier', 'check-file', 'i18next', 'simple-import-sort'],
    rules: {
        'prettier/prettier': 'error',
        'check-file/filename-naming-convention': [
            'error',
            { '**/*.{js,ts,tsx,scss}': 'KEBAB_CASE' },
            { ignoreMiddleExtensions: true },
        ],
        'i18next/no-literal-string': 0,
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
    },
    overrides: [
        // override "simple-import-sort" config
        {
            files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
            rules: {
                'simple-import-sort/imports': [
                    'error',
                    {
                        groups: [
                            // Packages `react` related packages come first.
                            ['^react', '^@?\\w'],
                            // Internal packages.
                            ['^(@|components)(/.*|$)'],
                            // Side effect imports.
                            ['^\\u0000'],
                            // Parent imports. Put `..` last.
                            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                            // Other relative imports. Put same-folder imports and `.` last.
                            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                            // Style imports.
                            ['^.+\\.?(css)$'],
                        ],
                    },
                ],
            },
        },
    ],
}
