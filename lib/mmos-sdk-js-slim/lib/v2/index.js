/*jslint node: true*/
/*globals Promise*/

/**
@class api
@static
**/

'use strict';

module.exports = function (api) {
	api.classifications = require('./api-classifications')(api);
	api.players = require('./api-players')(api);
};

