
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var api = express();
var app;

api.configure(function(){
  api.set('port', process.env.PORT || 3000);
  api.use(express.favicon());
  api.use(express.logger('dev'));
  api.use(express.bodyParser());
  api.use(express.methodOverride());
  api.use(express.cookieParser());
  api.use(api.router);
});

api.configure('development', function(){
  api.use(express.errorHandler());
});

api.get('/jobs', getJobList);
api.post('/jobs', createJob);
api.get('/jobs/:id', getJob);
api.get('/jobs/:id/items', getItemList);


function sendOkResponse(req, res) {
	return function(data) {
		res.send(data);
	}
}

function getJobList(req, res) {
	app.db.getJobList()
		.then(sendOkResponse(req,res));
}

function getJob(req, res) {
	app.db.getJob(req.params.id)
		.then(sendOkResponse(req,res));
}

function createJob(req, res) {
	app.db.createJobItems(req.body)
		.then(sendOkResponse(req,res));
}

function getItemList(req, res) {
	app.db.getItemList(req.params.id)
		.then(sendOkResponse(req,res));
}


module.exports = function(application) {
	app=application;
	return api;
}



