let AWS = require('aws-sdk');
let connectionManager = require('./ConnectionManager');
let SL_AWS = require('slappforge-sdk-aws');
const rds = new SL_AWS.RDS(connectionManager);

exports.handler = async (event) => {
	let inserts = [event.email, event.password];

	// You can pass the existing connection to this function.
	// A new connection will be created if it's not present as the third param 
	// You must always end the DB connection after it's used
	try {
		let results = await new Promise((resolve, reject) => {
			rds.query({
				instanceIdentifier: 'authDatabase',
				query: 'SELECT * FROM users WHERE Email = ? AND Password = ?',
				inserts: inserts
			}, (error, results, connection) => {
				connection.end();
				if (error) {
					reject(error);
				} else {
					resolve(results.length);
				}
			});
		});
		let successfullyLoggedIn = (results.length > 0);
		console.log("Successfully logged:", successfullyLoggedIn);
		return successfullyLoggedIn;

	} catch (err) {
		console.log("Error occurred while logging in with email:", email, err);
		return false;
	}
};