let AWS = require('aws-sdk');
let connectionManager = require('./ConnectionManager');
let SL_AWS = require('slappforge-sdk-aws');
const rds = new SL_AWS.RDS(connectionManager);

exports.handler = async (event) => {
	let inserts = [event.email, event.password, event.lastName, event.firstName, event.address];

	// You can pass the existing connection to this function.
	// A new connection will be created if it's not present as the third param 
	// You must always end the DB connection after it's used
	try {
		let results = await new Promise((resolve, reject) => {
			rds.query({
				instanceIdentifier: 'authDatabase',
				query: 'INSERT INTO users (Email, Password, LastName, FirstName, Address) VALUES (?, ?, ?, ?, ?);',
				inserts: inserts
			}, (error, results, connection) => {
				connection.end();
				if (error) {
					reject(error);
				} else {
					resolve(results);
				}
			});
		});
		console.log(results);
		return "Successfully added a new user with email";

	} catch (err) {
		console.log(err);
		throw err;
	}
};
