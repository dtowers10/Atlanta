	
	module.exports = function(Router, Database)
	{
		UserController = require('../Controllers/user')(Database)

		Router.get('/account/logout', UserController.logout)
		Router.post('/account/signup', UserController.signup)
		Router.post('/account/submit', UserController.auth)
	}