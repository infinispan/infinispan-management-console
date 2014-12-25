module.exports = {
  defaultLogin: function () {
    browser.get('http://localhost:3000/index.html#/login');
    element(by.model('credentials.username')).sendKeys('admin');
    element(by.model('credentials.password')).sendKeys('!qazxsw2');
    element(by.id('login-submit-button')).click();
    browser.sleep(500);
  }
};