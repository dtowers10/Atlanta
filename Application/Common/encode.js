	
	Crypto = require('crypto')

	module.exports = EncodeTool = {

		md5: function(string){
			return Crypto.createHash('md5').update(string).digest('hex');
		},

		sha1: function(string){
			return Crypto.createHash('sha1').update(string).digest('hex');
		},

		hashPassword: function(username, password){
			return EncodeTool.sha1(EncodeTool.md5(EncodeTool.sha1(EncodeTool.md5(password + username.toLowerCase()))))
		}
	}
