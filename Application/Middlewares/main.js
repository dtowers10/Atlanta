	
	MainMiddlewares = function()
	{
		this.authRequired = function(req, res, next)
		{
			if(req.session.userAuth && req.session.user)
				next()
			else
				res.redirect('/')
		}

		this.offAuth = function(req, res, next)
		{
			if(!req.session.userAuth && !req.session.user)
				return next()
			else
				return res.redirect('/me')
		}

		return this
	}

	module.exports = new MainMiddlewares()