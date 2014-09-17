	
	module.exports = Housekeeping = function(Router, Database)
	{
		AdminController = require('../Controllers/admin')(Database)
		Middleware = require('../Middlewares/admin')(Database)

		Router.get('/admin/housekeeping', AdminController.adminLogin)
		Router.get('/admin/housekeeping/home', Middleware.adminAuth, AdminController.home)
	}