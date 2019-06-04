'use strict';

async function main() {
    console.log('Calling MMOS API...');

    const api = require('./lib/mmos-sdk-js-slim')({
        protocol: 'https', host: 'api.depo.mmos.blue', port: 443,
        version: 'v2', game: 'yvan-le-bras-mnhn-fr',
        apiKey: {
            key: process.env['MMOS_API_KEY'],
            secret: process.env['MMOS_API_SECRET']
        }
    })

    try {

        // TODO: Get player code from command line
        const playerCode = 'YVAN001';
        const projectCode = 'spipoll-fly';
        const response = await api.players.createTask({
            code: playerCode
        }, {
            'projects': [ projectCode ],
            'player': { 'accountCode': playerCode }
        })
        console.log(response);
        console.log(response.body.task.assets);

    } catch(err) {
        console.error(err);
    }
}

main();