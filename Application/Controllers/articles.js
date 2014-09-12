
	module.exports = ArticleController = function(Database)
	{
		Properties = require('../../properties')

		this.index = function(req, res){
			return res.render('news.html', {name: Properties.Atlanta.name, user: req.session.user})
		}

		this.parseArticles = function(req, res)
		{
			res.set('Content-Type', 'application/json')

			if(req.param('limit')){
				limit = parseInt(req.param('limit'))
			}
			
			Database.query('SELECT * FROM system_news ORDER BY id DESC LIMIT ' + (req.param('limit') ? limit : 5), function(err, rows){

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
				Database.query('SELECT * FROM system_news WHERE id = ' + parseInt(req.param('id')) , function(err, rows){

					if(rows.length <= 0)
					{
						res.status(404)
						res.send('The article is no found')
					}

					else
					{
						Articles = []

						for(List = 0; List < rows.length; List++){
							Articles.push(rows[List])
						}

						if(req.param('json'))
						{
							res.set('Content-Type', 'application/json')
							res.send(JSON.stringify(Articles))
						}

						else{
							return res.send('lolo' + Articles)
							//return res.render('news.html', { preferedArticle: Articles })
						}
					}
				})
			}

			else
			{
				res.send('Enter a number valid')
			}
		}

		this.addArticle = function(req, res)
		{
			BodyForm = req.body

			if(req.session.user.rank > 5)
			{
				console.log('test test'+ BodyForm)
				res.set('Content-Type', 'application/json')

				if(typeof BodyForm.title === undefined|| typeof BodyForm.body === undefined || typeof BodyForm.imgurl === undefined)
				{
					return res.send({success:false, code: 'Request params is null'})
				}

				else
				{
					PostBody = {

						title: BodyForm.title,
						body: BodyForm.body,
						imageurl: BodyForm.imgurl

					}

					Database.query('INSERT INTO system_news SET ?', PostBody, function(err, rows){

						if(!err){
							return res.send({success:true, code: 'Article ' + title + ' added success!'})
						}
					})
				}
			}

			else
			{
				res.status(403)
				return res.send('No tienes los permisos suficientes para acceder aqui')
			}
		}

		return this
	}