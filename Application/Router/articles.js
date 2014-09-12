
	module.exports = ArticleRouter = function(Router, Database)
	{
		ArticlesController = require('../Controllers/articles')(Database)

		Router.get('/articles', ArticlesController.index)
		Router.get('/articles/get', ArticlesController.parseArticles)
		Router.get('/articles/:id', ArticlesController.parseWithID)
		Router.post('/articles/admin/add', ArticlesController.addArticle)
	}