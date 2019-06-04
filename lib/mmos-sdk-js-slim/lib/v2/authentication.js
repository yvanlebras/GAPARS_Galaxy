/*jslint node: true*/
/*globals Promise*/

/**
@class api.v1.authentication
@static
**/

'use strict';

const crypto = require('crypto');


function prepareHeaders(apiKey, method, path, request) {

	var CONTENT_SEPARATOR = '|';

	var SIGNING_ALGORITHM = 'MMOS1-HMAC-SHA256';

	var nonce = Math.floor((Math.random() * new Date().getTime()) + 1);
	var signingKey;
	var signature;
	var timestamp = new Date().getTime();
	var contentParts = [];
	var body = request.data || {};
	var content;

	contentParts.push(SIGNING_ALGORITHM);
	contentParts.push(apiKey.key);
	contentParts.push(timestamp);
	contentParts.push(nonce);
	contentParts.push(method);
	contentParts.push(path);

	contentParts.push(JSON.stringify(body));

	content = contentParts.join(CONTENT_SEPARATOR);

	signingKey = crypto.createHmac('sha256', String(timestamp)).update(apiKey.secret).digest('hex');
	signature = crypto.createHmac('sha256', signingKey).update(content).digest('hex');


	return {
		'Content-Type': 'application/json',
		'X-MMOS-Algorithm': SIGNING_ALGORITHM,
		'X-MMOS-Credential': apiKey.key,
		'X-MMOS-Timestamp': timestamp,
		'X-MMOS-Nonce': nonce,
		'X-MMOS-Signature': signature
	};

}

module.exports.prepareHeaders = prepareHeaders;

