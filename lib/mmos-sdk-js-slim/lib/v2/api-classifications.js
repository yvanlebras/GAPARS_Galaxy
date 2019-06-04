/*jslint node: true*/
/*globals Promise*/

/**
@class api.v2.classifications
@static
**/

'use strict';

module.exports = function (api) {

	return {
		/**
		* Calls MMOS API 'Create new classification'
		*
		* @method create
		* @param {Object} body
		* @return {Promise}
		* @example
			api.classifications.create({
				taskId: 10053293,
				playerCode: 'player2244',
				playergroupCode: 'group1122',
				result: [121, 222],
				remark: true,
				circumstances: {
					t: 1300
				}
			});
		*/
		create: function (body) {
			body.game = api.game;
			return api.call({
				method: api.METHOD.POST,
				path: 'classifications'
			}, body, 201);
		}
	};

};

