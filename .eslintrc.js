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
  ],
  ignorePatterns: ['!.eslintrc.js', 'dist/'],
};
