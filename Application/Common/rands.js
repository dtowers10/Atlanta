	
	module.exports = Rand = {

		mt_rand: function(min, max) {

			var argc = arguments.length;

			if (argc === 0) {
				min = 0;
				max = 2147483647;
			} 		

			else {
				min = parseInt(min, 10);
				max = parseInt(max, 10);
			}

			return Math.floor(Math.random() * (max - min + 1)) + min;
		},

		giveRand: function(len){

			Data = ""
			Possible = "0123456789abcdef"
			i = 0

			while(i < len)
			{
				Data += Possible.substr(this.mt_rand(0, Possible.length - 1), 1)
				i++
			}

			return Data
		},

		ticket: function(){

			Rand = this.giveRand(8) + "-" + this.giveRand(4) + "-" + this.giveRand(4) + "-" + this.giveRand(4) + "-" + this.giveRand(12)
 			return Rand 
 		}
	}