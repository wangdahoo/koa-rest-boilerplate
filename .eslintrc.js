module.exports = {
    root: true,

    env: {
        browser: true,
        es6: true,
        node: true
    },

    extends: [
        // 'eslint:recommended',
        'standard', // js标准规则
        // https://standardjs.com/rules-zhcn.html#javascript-standard-style
        'plugin:@typescript-eslint/eslint-recommended'
    ],

    globals: {
        // 全局变量
    },

    parser: '@typescript-eslint/parser',

    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        },

        // typescript-eslint specific options
        warnOnUnsupportedTypeScriptVersion: true
    },

    plugins: ['@typescript-eslint'],

    overrides: [
        {
            files: ['**/*.ts?(x)'],
            rules: {
                // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
                'default-case': 'off',
                // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
                'no-dupe-class-members': 'off',
                // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
                'no-undef': 'off',

                // Add TypeScript specific rules (and turn off ESLint equivalents)
                '@typescript-eslint/consistent-type-assertions': 'warn',
                'no-array-constructor': 'off',
                '@typescript-eslint/no-array-constructor': 'warn',
                '@typescript-eslint/no-namespace': 'error',
                'no-use-before-define': 'off',
                '@typescript-eslint/no-use-before-define': [
                    'warn',
                    {
                        functions: false,
                        classes: false,
                        variables: false,
                        typedefs: false
                    }
                ],
                'no-unused-vars': 'off',
                '@typescript-eslint/no-unused-vars': [
                    'warn',
                    {
                        args: 'none',
                        ignoreRestSiblings: true
                    }
                ],
                'no-useless-escape': 'off',
                'no-useless-constructor': 'off',
                '@typescript-eslint/no-useless-constructor': 'warn'
            }
        }
    ],

    rules: {
        // override rules
        'no-console': 0, // 允许 console
        indent: ['error', 4], // 缩进宽度 4 个空格
        'comma-dangle': 'off', // 允许行末逗号
        'no-constant-condition': 'off', // 允许常量作为表达式条件
        'no-delete-var': 'off', // 允许使用 delete
        'no-extend-native': 'off', // 允许扩展原生对象
        'no-floating-decimal': 'off', //  允许省去小数点前的0
        'no-multi-str': 'off', // 允许多行字符串
        semi: 0, // 不使用分号
        // 最大长度 120
        'max-len': [
            'warn',
            {
                code: 120,
                ignoreComments: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreUrls: true
            }
        ],
        // 最大行数 500
        'max-lines': [
            'warn',
            {
                max: 500,
                skipBlankLines: true,
                skipComments: true
            }
        ],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        camelcase: 'off',
        'prefer-promise-reject-errors': 'off',
        'node/no-deprecated-api': 'off',
        'no-case-declarations': 'off',
        quotes: [1, 'single'] // 使用单引号
    }
}
