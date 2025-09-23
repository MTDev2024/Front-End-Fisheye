/* eslint-env node */

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    quotes: ['error', 'single'], // utiliser quotes simples
    semi: ['error', 'always'], // point-virgule obligatoire
    'no-trailing-spaces': 'error', // pas d'espaces en fin de ligne
    'no-console': 'warn', // console autorisée mais warning
    'prefer-const': 'error', // toujours utiliser const si possible
    'prefer-destructuring': [
      'error',
      {
        object: true,
        array: true,
      },
    ], // encourager la déstructuration
    'no-param-reassign': 'error', // pas de modification des params de fonction
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }], // ++ et -- interdits sauf en for aprèsthought
    // Cela permet de garder le code lisible et d'éviter les effets de bord dans les expressions complexes.

    'comma-dangle': ['error', 'always-multiline'], // virgule finale pour objets/tableaux multi-lignes
    // "indent": ["error", 2], // commentée car Prettier gère l'indentation
    'prettier/prettier': ['error', { tabWidth: 2, useTabs: false }], // règles Prettier
    'linebreak-style': ['error', 'unix'], // LF uniquement
    'default-case': 'error', // les switch doivent avoir un default
    'import/prefer-default-export': 'off', // autorise exports nommés même uniques
    'import/extensions': 'off',
  },
};
