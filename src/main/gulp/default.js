module.exports = () => () => require('run-sequence')('check', 'compile');
