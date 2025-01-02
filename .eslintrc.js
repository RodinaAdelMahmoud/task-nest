module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier', 'filename-rules'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'warn',
    'filename-rules/match': [
      'error',
      /(^([a-z][a-z\d]*)(-[a-z\d]+)*\.(schema|class|helper|interface|dto|service|config|controller|module|aggregation|enum|type|relation|node|model|pipe|provider|default|constant|middleware|guard|loader|filter|decorator|interceptor|strategy|pipeline|util|listener)\.ts$)|(^index\.ts$)|(^main\.ts$)|(spec\.ts$)/,
    ],
  },
};
