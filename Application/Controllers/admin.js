
	module.exports = AdminController = function(Database)
	{

		// No yet finished
		
		this.adminLogin = function(req, res)
		{
			if(req.session.user)
			{
				if(req.session.user.rank >= 4)
				{
					Database.query('SELECT id, username, rank, look, gender FROM users WHERE username = ' + Database.escape(req.session.user.username), function(err, rows){

						if(rows.length > 0){

							req.session.adminRequest = true
							req.session.userOffset = rows[0]

							res.redirect('/admin/housekeeping/home')
						}

						else
						{
							res.redirect('/me')
						}
					})
				}
			}

			else
			{
				res.status(403)
				res.send('403 Forbidden')
			}
		}

		this.home = function(req, res)
		{
			res.render('admin/home.html')
		}

		return this
	}