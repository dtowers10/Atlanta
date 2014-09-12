	
	Properties = require('../../properties')

	MainController = function(Database)
	{
		this.index = function(req, res)
		{
			if(req.session.login_error || req.session.register_error)
			{
				ErrorRender = req.session.login_error || req.session.register_error

				req.session.login_error = null
				req.session.register_error = null

				return res.render('index.html', {name: Properties.Atlanta.name, error: ErrorRender})
			}

			else
			{
				return res.render('index.html', {name: Properties.Atlanta.name})
			}
		}

		this.me = function(req, res)
		{
			return res.render('me.html', { name: Properties.Atlanta.name, user: req.session.user, userCount: 'Muchos usuarios conectados'})
		}

		return this
	}

	module.exports = MainController