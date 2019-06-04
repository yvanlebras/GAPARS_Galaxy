/*jslint node: true*/
/*globals Promise*/

/**
@class api
@static
**/

'use strict';

var _ = require('lodash');

var config;
var authentication;
var api = {};

//var CONSTS = require('./consts');
var METHOD = {
	GET: 'GET',
	POST: 'POST',
	DELETE: 'DELETE'
};


function call(endpoint, body, expectedStatusCodes) {
	var protocol = require(config.protocol || 'http');
	var options;

	var method = endpoint.method || METHOD.GET;
	var path = '/' + endpoint.path;

	options = {
		host: config.host,
		port: config.port,
		path: path,
		method: method,
		data: body
	};
	options.headers = authentication.prepareHeaders(config.apiKey, method, path, options);
	options.headers['Content-Type'] = 'application/json';

	if (expectedStatusCodes && !_.isArray(expectedStatusCodes)) {
		expectedStatusCodes = [expectedStatusCodes];
	}
	
	return new Promise(function (resolve, reject) {
		var req = protocol.request(options, function (res) {
			res.setEncoding('utf-8');

			var responseString = '';

			res.on('data', function (data) {
				responseString += data;
			});

			res.on('end', function () {
				if (!expectedStatusCodes || (_.indexOf(expectedStatusCodes, res.statusCode) !== -1)) {
					resolve({
						statusCode: res.statusCode,
						body: JSON.parse(responseString)
					});
				} else {
					reject({
						statusCode: res.statusCode,
						body: JSON.parse(responseString)
					});
				}
			});

			res.on('error', function (err) {
				reject(err);
			});

		}).on('error', function (err) {
			reject(err);
		});

		if (options.method === METHOD.POST) {
			req.write(JSON.stringify(body));
		}

		req.end();
	});

}

/**
* Initializes MMOS API sdk class
*
* @method
* @constructor
* @param {Object} options
* @example
	var api = require('mmos-sdk')({
		apiKey: {
			key: 'KEY',
			secret: '12345'
		},
		protocol: 'https',
		host: 'api.mmos.blue',
		port: '8080',

		version: 'v1',
		game: 10
	});
*/
module.exports = function (options) {
	config = {
		apiKey: options.apiKey,
		protocol: options.protocol,
		host: options.host,
		port: options.port,

		version: options.version || 'v1',
		game: options.game
	};

	authentication = require('./' + config.version + '/authentication');

	api.METHOD = METHOD;
	api.game = config.game;
	api.call = call;
	api.info = function (body) {
		return call({
			path: ''
		}, body);
	}; 
	require('./' + config.version)(api);

	return api;
};
