

exports.save = function(req, res, callback) {
	

	  var db = req.db;
	  var gs = db.gridStore('test.txt', 'w')
	  
	  var coll = db.get('items');
	  /*
	  coll.insert({"pippo":1},function(err){
		  callback;
	  });*/

	
	
	
}