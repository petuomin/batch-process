
var http = require('http');
var Q = require('q');

var app = {};
app.config = require('./config');

app.auth = require('./m_auth/dummy');
app.db = require('./db');
app.db.init(app)
	.then(initApp, console.log)
	.then(startApp)
	.fail(errorHandler);
	
	
function errorHandler(error) {
	console.log(error.message);
}


function initApp() {
	app.api = require('./api/api')(app);
	app.runner = require('./runner');
}

function startApp() {
	http.createServer(app.api).listen(app.api.get('port'), function(){
		  console.log("Express server listening on port " + app.api.get('port'));
	});
}
