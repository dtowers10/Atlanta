	
	// Configuration properties

	Properties = require('../../properties') 

	// The main controller for the Website,
	// Example: /, /me, /staff. Etc. 

	MainController = function(Database)
	{
		this.index = function(req, res)
		{
			// LogIN validation
			
			if(req.session.login_error || req.session.register_error)
			{
				ErrorRender = req.session.login_error || req.session.register_error

				req.session.login_error = null
				req.session.register_error = null

				return res.render('index.html', {name: Properties.Atlanta.name, error: ErrorRender, csrf: req.csrfToken()})
			}

			else
			{
				return res.render('index.html', {name: Properties.Atlanta.name, csrf: req.csrfToken()})
			}
		}

		this.me = function(req, res)
		{
			return res.render('me.html', { name: Properties.Atlanta.name, user: req.session.user, userCount: 'Muchos usuarios conectados'})
		}

		this.team = function(req, res)
		{
			Database.query('SELECT username, motto, look, rank, last_online, front FROM users WHERE rank = "4" || rank = "5" || rank = "6" || rank = "7" || rank = "9" ', function(err, rows){
				
				if(rows.length < 1)
				{
					return res.render('staff.html', { name:Properties.Atlanta.name, user:req.session.user, userCount: "Muchos usuarios conectados", error: 'Aún no hay ningun staff O:'})
				}

				else{

					Owner = []
					Tecs = []
					Admins = []
					Diversity = []
					Mods = []

					for(List = 0; List < rows.length; List++){
			
						switch(rows[List]['rank'])
						{
							case 4:
								Mods.push(rows[List])
							break;

							case 5:
								Diversity.push(rows[List])
							break;

							case 6:
								Admins.push(rows[List])
							break;

							case 7:
								Tecs.push(rows[List])
							break;

							case 9:
								Owner.push(rows[List])
							break;
						}
					}

					return res.render('staff.html', { name:Properties.Atlanta.name, user:req.session.user, owners: Owner, tecs: Tecs, admins: Admins, concurs: Diversity, mods: Mods})
				}
			})
		}

		return this
	}

	module.exports = MainController