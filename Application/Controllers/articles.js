
	module.exports = ArticleController = function(Database)
	{
		Properties = require('../../properties')
		EncodeTool = require('../Common/encode')
		Recaptcha = require('recaptcha').Recaptcha

		this.index = function(req, res)
		{
			Database.query('SELECT * FROM cms_news ORDER BY id DESC LIMIT 1', function(err, rows){

				return res.render('news.html', { name: Properties.Atlanta.name, user: req.session.user, csrf: req.csrfToken(), lastArticle: rows[0] })
			})
		}

		this.parseArticles = function(req, res)
		{
			res.set('Content-Type', 'application/json')

			if(req.param('limit')){
				limit = parseInt(req.param('limit'))
			}
			
			Database.query('SELECT * FROM cms_news ORDER BY id DESC LIMIT ' + (req.param('limit') ? limit : 5), function(err, rows){

				Articles = []

				for(List = 0; List < rows.length; List++){
					Articles.push(rows[List])
				}

				return res.send(JSON.stringify(Articles))
			})
		}

		this.parseWithID = function(req, res)
		{
			if(req.param('id') && !isNaN(req.param('id')))
			{
				Database.query('SELECT * FROM cms_news WHERE id = ' + Database.escape(parseInt(req.param('id'))) , function(err, rows){

					if(rows.length <= 0)
					{
						res.status(404)
						res.send('The article is no found')
					}

					else
					{
						Articles = rows[0]

						if(req.param('json'))
						{
							res.set('Content-Type', 'application/json')
							res.send(JSON.stringify(Articles))
						}

						else if(req.session.user){
							return res.render('news.html', { name: Properties.Atlanta.name, user: req.session.user, preferedArticle: Articles, csrf: req.csrfToken() })
						}
					}
				})
			}

			else
			{
				return res.redirect('/articles')
			}
		}


		this.addArticle = function(req, res)
		{

		}

		this.addCommentToArticle = function(req, res)
		{
			BodyForm = req.body
			res.set('Content-Type', 'application/json')

			if( typeof BodyForm.comment_body !== "undefined" && BodyForm.comment_body.length > 255){
				return res.send(JSON.stringify({success:false, error: " Debes enviar un mensaje con un limite de 255 caracteres "}))
			}

			else if(req.param('article') && !isNaN(req.param('article')) && BodyForm.comment_body.length >= 2)
			{
				reCaptcha = new Recaptcha(Properties.Google.recaptcha.public, Properties.Google.recaptcha.private, { remoteip: req.connection.remoteAddress, challenge: BodyForm.recaptcha_challenge_field, response: BodyForm.recaptcha_response_field })
				reCaptcha.verify(function(success, error){

					if(success)
					{
						Database.query('SELECT * FROM cms_news WHERE id = ' + Database.escape(req.param('article')), function(err, rows){
					
							if(rows.length <= 0){
								return res.send(JSON.stringify({success:false, error: "The article is not found "}))
							}

							else
							{
								CommentData = {

									articleid: req.param('article'),
									username: req.session.user.username,
									comment: EncodeTool.htmlEntities(BodyForm.comment_body),
									look: req.session.user.look
								}

								Database.query('INSERT INTO news_comment SET ?', CommentData, function(err, rows){

									if(!err){
										return res.send(JSON.stringify({success:true, message: "Tu mensaje ha sido enviado"}))
									}

									else
									{
										console.log(err)
										return res.send(JSON.stringify({success:false, error: "An error ocurred to insert the comment"}))
									}
								})
							}
						})
					}

					else
					{
						return res.send(JSON.stringify({success:false, error: "An error ocurred, please enter a valid code of recaptcha "+ error}))
					}
				})
			}

			else
			{
				return res.send(JSON.stringify({success: false, error: "Enter a valid number"}))
			}
		}

		this.parseComents = function(req, res)
		{
			res.set('Content-Type', 'application/json')

			if(req.param('article') && !isNaN(req.param('article')))
			{
				articleID = Database.escape(parseInt(req.param('article')))

				Database.query('SELECT * FROM news_comment WHERE articleid = '+ articleID +' ORDER BY id DESC ', function(err, rows){

					if(rows.length <= 0){
						return res.send(JSON.stringify({success: false, error: "The comments don't found"}))
					}

					Comments = []

					for(List = 0; List < rows.length; List++){
						Comments.push(rows[List])
					}

					return res.send(JSON.stringify(Comments))
				})
			}

			else
			{
				return res.send(JSON.stringify({success:false, error: "Please enter the articleID"}))
			}
		}

		return this
	}