module.exports = {
  root: true,
  extends: ['@metamask/eslint-config'],
  overrides: [
    {
      files: ['*.js'],
      env: {
        commonjs: true,
      },
    },
    {
      files: ['*.ts'],
      extends: ['@metamask/eslint-config-typescript'],
    },
    {
      files: ['*.d.ts'],
      rules: {
        'import/unambiguous': 'off',
      },
    },
  ],
  ignorePatterns: ['!.eslintrc.js', 'dist/'],
};
