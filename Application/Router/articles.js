
	module.exports = ArticleRouter = function(Router, Database)
	{
		ArticlesController = require('../Controllers/articles')(Database)
		MiddlewareSession = require('../Middlewares/main')

		Router.get('/articles', MiddlewareSession.authRequired, ArticlesController.index)
		Router.get('/articles/get', ArticlesController.parseArticles)
		Router.get('/articles/:id', ArticlesController.parseWithID)
		Router.post('/articles/admin/add', MiddlewareSession.authRequired, ArticlesController.addArticle)

		Router.get('/articles/comments/:article', MiddlewareSession.authRequired, ArticlesController.parseComents)
		Router.post('/article/comments/add/:article', MiddlewareSession.authRequired, ArticlesController.addCommentToArticle)
	}