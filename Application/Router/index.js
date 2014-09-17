	
	module.exports = function(Express, Database)
	{
		Router = Express

		MainRoutes = require('./main')(Router, Database)
		UserRoutes = require('./user')(Router, Database)
		NewsRoutes = require('./articles')(Router, Database)
		AdminRoutes = require('./admin')(Router, Database)
	}