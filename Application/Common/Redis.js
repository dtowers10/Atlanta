	
	url = require('url')
	querystring = require('querystring');

	module.exports.createClient = module.exports.connect = function(redis_url) {
  		
  		var password, database;
  		
  		parsed_url  = url.parse(redis_url || process.env.REDIS_URL || 'redis://localhost:6379');
  		parsed_auth = (parsed_url.auth || '').split(':');

  		options = querystring.parse(parsed_url.query);

  		redis = require('redis').createClient(parsed_url.port, parsed_url.hostname, options);

  		if(password = parsed_auth[1])
  		{
    		redis.auth(password, function(err) {
      			if (err) throw err;
    		})
  		}

  		return redis;
	}
