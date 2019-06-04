/*jslint node: true*/
/*globals Promise*/

/**
@class api.v2.players
@static
**/

'use strict';

module.exports = function (api) {

	return {

		get: function (options) {
			if (options.project) {
				return api.call({
					path: `games/${api.game}/players/${options.code}?project=${options.project}&historyItemCount=${options.historyItemCount}`,
				}, {}, [200, 404]);
			} else {
				return api.call({
					path: `games/${api.game}/players/${options.code}`
				}, {}, [200, 404]);
			}
		},

		/**
		* Calls MMOS API 'Create new task for player'
		*
		* @method createTask
			@param {Object} options
		* @param {Object} body
		* @return {Promise}
		* @example
			api.players.createTask({
				code: 'user_code' }, {
				project: 1
			});
		*/
		createTask: function (options, body) {
			return api.call({
				method: api.METHOD.POST,
				path: `games/${api.game}/players/${options.code}/tasks`
			}, body, 201);
		},

		leaderboard: function (options) {
			return api.call({
				path: `games/${api.game}/players/leaderboard?top=${options.top}`
			}, {}, 200);
		}

	};

};


