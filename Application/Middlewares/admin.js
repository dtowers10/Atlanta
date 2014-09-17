	
	module.exports = MainMiddlewares = function(Database)
	{
		this.adminAuth = function(req, res, next)
		{
			if(req.session.adminRequest && req.session.userOffset)
				next()
			else
				res.status(403)
		}

		this.adminAuthOff = function(req, res, next)
		{
			if(!req.session.adminRequest && !req.session.userOffset)
				next()
			else
				res.status(403)
		}

		return this
	}