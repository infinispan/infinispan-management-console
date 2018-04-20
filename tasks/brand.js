module.exports = (gulp, config) => () => {

  const git = require('git-promise');

  function validURL(str) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if(!regex .test(str)) {
      return false;
    } else {
      return true;
    }
  }

  function validBranch(str) {
    return "${branding.branch}" !== str;
  }

  if (validURL(config.cmdParams.repo) && validBranch(config.cmdParams.branch)) {
    return git('remote add assets ' + config.cmdParams.repo).then(function () {
      return git('pull assets ' + config.cmdParams.branch + ' --squash --allow-unrelated-histories');
    });
  }

};
