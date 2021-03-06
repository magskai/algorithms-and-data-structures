module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: './tsconfig.json',
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-console': 0,
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [2, { 'functions': false }],
    'react/jsx-filename-extension': 'off',
  },
};
