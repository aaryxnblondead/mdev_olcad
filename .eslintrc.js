module.exports = {
  extends: ['universe/native', 'universe/shared/typescript-analysis'],
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    'react/react-in-jsx-scope': 'off'
  }
};
