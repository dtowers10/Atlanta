	
	Recaptcha = require('recaptcha').Recaptcha
	Properties = require('../../properties.json')
	EncodeTool = require('../Common/encode')
	Rand = require('../Common/rands')

	module.exports = UserModel = function(Database)
	{
		this.Authentication = function(username, password, ip, callback)
		{
			usernameF = Database.escape(username)

			EncodePassword = EncodeTool.hashPassword(password, username)

			if(username.length < 1 || password.length < 1)
			{
				callback('Por favor, introduce tu usuario y contraseña para poder continuar', null)
				return false
			}

			else
			{
				this.banExist(usernameF, ip, function(result, data){
					
					if(result)
					{
						callback('Lo sentimos, tu usuario ' + username + ' ha sido baneado', null)
						return false
					}

					else
					{
						Database.query('SELECT * FROM users WHERE username = ' + usernameF + ' AND password = "' + EncodePassword + '" ' , function(err, rows){

							if(err) throw err;

							if(rows.length < 1)
							{
								callback('Tu contraseña y usuario no coinciden, escribela de nuevo', null)
								return false
							}

							else
							{
								callback(null, { object: rows[0] })
								return true
							}
						})
					}
				})
			}
		}

		this.Signup = function(username, email, password, password_repeat, recaptcha_challenge, recaptcha_response, ip, callback)
		{
			if(username.length <= 1 || email.length <= 1 || password.length <= 1){
				return callback('Por favor, rellena todos los campos para continuar', null)
			}

			else
			{
				this.userNameValidation(username, function(bool){
					
					if(!bool){
						return callback('Lo sentimos, el nombre de usuario no es valido o está siendo utilizado', null)
					}

					else
					{
						this.emailCharsValidate(email, function(bool){
							
							if(bool){
								return callback('El e-mail no es valido o está siendo utilizado', null)
							}

							else
							{
								if(password !== password_repeat){
									return callback('Ha ocurrido un error. Las contraseñas introducidas no son iguales', null)
								}

								else
								{
									reCaptcha = new Recaptcha(Properties.Google.recaptcha.public, Properties.Google.recaptcha.private, { remoteip: ip, challenge: recaptcha_challenge, response: recaptcha_response }) 
									
									reCaptcha.verify(function(success, err){
										
										if(!success){
											return callback('El código de seguridad no es valido, intentalo de nuevo.', null)
										}

										else
										{
											EncodePassword = EncodeTool.hashPassword(password, username)

											this.RegisterFormFinish({ user: username, email: email, password: EncodePassword, ip: ip }, function(Boolean, data){

												if(Boolean){
													return callback(null, data)
												}

												else{
													return callback('Ha ocurrido un error al registrarte :( ', null)
												}
											})
										}
									})
								}
							}
						})
					}
				})	
			}
		}

		this.emailCharsValidate = function(email, callback)
		{
			atpos = email.indexOf("@")
			dotpos = email.lastIndexOf(".")

			if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length){
				return callback(true)
			}

			else{

				Database.query('SELECT * FROM users WHERE mail = ' + Database.escape(email), function(err, rows){

					if(rows.length >= 1)
					{
						return callback(true)
					}

					else
					{
						return callback(false)
					}

				})
			}
		}

		this.userNameValidation = function(username, callback)
		{
			UsernameAllowChars = /^[a-zA-Z0-9_-]{3,15}$/
			FilterUsername = username.toString()

			if(!username.match(UsernameAllowChars)){
				return callback(false)
			}

			else
			{
				if(username.length >= 15){
					return callback(false)
				}

				else
				{
					Database.query('SELECT * FROM users WHERE username = ' + Database.escape(FilterUsername), function(err, rows, fiels){
						
						if(rows.length >= 1)
						{
							return callback(false)
						}

						else
						{
							return callback(true)
						}
					})
				}
			}
		}

		this.RegisterFormFinish = function(form, callback)
		{
			FinishForm = {
				username: form.user,
				password: form.password,
				mail: form.email,
				auth_ticket: Rand.ticket(),
				account_created: new Date(),
				last_online: new Date(),
				ip_reg: form.ip,
				ip_last: form.ip,
				front: "http://haddoz.pw",
				rank: 1,
				look: "hr-115-42.hd-190-1.ch-215-62.lg-285-91.sh-290-62",
				motto: "Soy nuevo en Haddoz!"
			}

			Database.query('INSERT INTO users SET ?', FinishForm, function(err, rows){

				if(!err){
					return callback(true, { object: FinishForm })
				}

				else
				{	console.log(err)
					return callback(false, null)
				}
			})
		}

		this.banExist = function(username, ip, callback)
		{
			Database.query('SELECT * FROM bans WHERE bantype="user" AND value = ' + username + ' OR bantype="ip" AND value = "' + ip + '" ', function(err, rows){

				if(rows > 0)
					return callback(true, null)
				else
					return callback(false, rows[0])
			})
		}

		return this
	}