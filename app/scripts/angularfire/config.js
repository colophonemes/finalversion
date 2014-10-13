angular.module('firebase.config', [])
  .constant('FBURL', 'https://finalversion.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password','facebook','google','twitter'])

  .constant('loginRedirectPath', '/login');