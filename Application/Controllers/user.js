
	module.exports = UserController = function(Database){

		// User Controller handle all request of username
		// Example: /signin, /signup

		UserModel = require('../Models/user')(Database)

		this.auth = function(req, res)
		{
			BodyForm = req.body

			// Calling UserModel instance for connect to Database
			UserModel.Authentication(BodyForm.username, BodyForm.password, req.ip, function(err, info){
				
				if(err)
				{
					req.session.login_error = err
					res.redirect('/')
					return false
				}

				else
				{
					req.session.userAuth = true
					req.session.user = info.object

					return res.redirect('/me')
				}
			})
		}

		this.signup = function(req, res)
		{
			BodyForm = req.body

			UserModel.Signup(BodyForm.username, BodyForm.email, BodyForm.password, BodyForm.password_repeat, BodyForm.recaptcha_challenge_field, BodyForm.recaptcha_response_field, req.connection.remoteAddress, function(err, info){

				if(err)
				{
					req.session.register_error = err
					res.redirect('/#register')
					return false
				}

				else
				{
					req.session.userAuth = true
					req.session.user = info.object

					return res.redirect('/me')
				}
			})
		}

		this.logout = function(req, res)
		{
			req.session.userAuth = null
			req.session.user = null

			return res.redirect('/')
		}

		return this
	}