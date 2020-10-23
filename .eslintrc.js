module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
  },
  extends: [
    '@metamask/eslint-config',
    '@metamask/eslint-config/config/nodejs',
  ],
  rules: {
    // TODO: Re-enable this post-TS migration
    'import/no-unresolved': 'off',
  },
  overrides: [{
    files: [
      '.eslintrc.js',
    ],
    parserOptions: {
      sourceType: 'script',
    },
  }],
}
