	
	TCPServer = require('http')

	module.exports = WebServer = function(Express, properties)
	{
		Envport = process.env.PORT || properties.Connections.port 
		TCPServer.createServer(Express).listen(Envport)

		console.log('[DEBUG] Atlanta server process running on port: ' + Envport)
	}