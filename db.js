
var Sequelize = require('sequelize');
var Q = require('q');

var sequelize, Job, Item;
function init(app) {
	var deferred = Q.defer();
	var config = app.config;
	sequelize  = new Sequelize(config.db.name, config.db.user, config.db.pass, config.db.options);

	Job = sequelize.define('Job', {
		id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
		user: Sequelize.STRING,
		action: Sequelize.STRING,
		status: Sequelize.STRING, //enum perhaps
		run_on_id: Sequelize.INTEGER, //what timesetting to run on
		credentials: Sequelize.TEXT, //encrypted credentials for jobs
		created_ts: Sequelize.DATE
	});
	Item = sequelize.define('Item', {
		id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
		job_id: {type: Sequelize.INTEGER},
		data: Sequelize.TEXT, //job data.
		status: Sequelize.STRING, //enum perhaps: waiting, done, error, cancel
		status_msg: Sequelize.TEXT,
		modified_ts: Sequelize.DATE
	});
	
	sequelize
		.sync({force: true})
		.complete(function(err) {
			if (err) {
				throw err;
			} else {
				deferred.resolve();
			}
			
		});
		
	return deferred.promise;
}

function errorHandler(error) {
	throw error;
}

function createJobItems(jobItemsObject) {
	var items = jobItemsObject.items;
	delete(jobItemsObject.items);
	
	return createJob(jobItemsObject)
		.then(bulkCreateItems(items));
	
}

function bulkCreateItems(itemsArray) {
	console.log(args);
	var deferred = Q.defer();
	Item.bulkCreate(itemsArray)
		.success(deferred.resolve)
		.error(errorHandler);
		
	return deferred.promise;
	
}
function createJob(jobObject) {
	var deferred = Q.defer();

	Job.create(jobObject)
		.success(deferred.resolve)
		.error(errorHandler);


	return deferred.promise;
}


function getJobList() {
	var deferred = Q.defer();
	Job.findAll()
		.success(deferred.resolve)
		.error(errorHandler);
	
	return deferred.promise;
}

function getItemList(jobId) {
	var deferred = Q.defer();
	
	var query = {
		where: {
			job_id: jobId
		}
	};
	Item.findAll(query)
		.success(deferred.resolve)
		.error(errorHandler);
	
	return deferred.promise;
}

function getJob(jobId) {
	var deferred = Q.defer();
	
	var query = {
		where: {
			id: jobId
		}
	};
	
	Job.find(query)
		.success(deferred.resolve)
		.error(errorHandler);
			
	return deferred.promise;
}
function updateJob(jobId, jobObject) {}
function deleteJob(jobId) {}

function getJobItem() {}
function updateJobItem() {}


module.exports = {
		init: init,
		sequelize: sequelize,
		createJobItems: createJobItems,
		createJob: createJob,
		getJob: getJob,
		updateJob: updateJob,
		deleteJob: deleteJob,
		getJobList: getJobList,
		getItemList: getItemList,
		updateJobItem: updateJobItem
	
}
