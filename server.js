
	Properties = require('./properties')
	Express = require('express')
	Database = require('mysql')
	Path = require('path')

	Server = Express()
	TcpListenConnections = require('./bin/bootstrap')(Server, Properties)

	RenderEngine = require('swig')
	Cookies = require('cookie-parser')
	Debug = require('morgan')
	Sessions = require('express-session')
	Redis = require('connect-redis')(Sessions)
	DataParser = require('body-parser')
	CrossDomain = require('csurf')

	Server.engine('html', RenderEngine.renderFile)
	Server.set('view engine', 'html')
	Server.use(DataParser.json())
	Server.use(Debug('dev'))

	Server.use(DataParser.urlencoded({
		extended: true
	}))

	RedisClient = require('./Application/Common/Redis').connect("redis://db01:theboot@pub-redis-12407.us-east-1-3.4.ec2.garantiadata.com:12407")

	Server.use(Cookies())
	Server.use(Sessions({
		name: Properties.Cookie.ssid,
		secret: Properties.Cookie.secret,
		resave: true,
		store: new Redis({client: RedisClient}),
    	saveUninitialized: true
	}))

	//Server.use(CrossDomain())

	Server.use('/static/', Express.static(Path.join(__dirname, 'public')))
	Server.set('views', Path.join(__dirname, 'Application/Templates'))

	MySQL = Database.createConnection(Properties.Database)
	MySQL.connect()

	Router = require('./Application/Router')(Server, MySQL)

	console.log('[DEBUG] Atlanta started successful !')
