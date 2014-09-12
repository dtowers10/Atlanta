
	module.exports = MainRoutes = function(Router, Database)
	{
		MainController = require('../Controllers/main')(Database)
		Middleware = require('../Middlewares/main')
		
		Router.get('/', Middleware.offAuth, MainController.index)
		Router.get('/me', Middleware.authRequired, MainController.me)
	} 