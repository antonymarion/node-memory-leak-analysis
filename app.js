'use strict';

const express = require('express');
const log = require('./common/common_utils').loggingUtils;
const toobusy = require('toobusy-js');
const ObjectsToCsv = require('objects-to-csv');
const app = express();
const grpcService = require('./grpc/grpc_tested_service');
const testRoute = require('./route/test_route');
const bodyParser = require('body-parser');

process.on('uncaughtException', (err) => {
    log.error(`UncaughtException: ${err.message}`);
    process.exit(-2);
});

process.on('unhandledRejection', (err) => {
    log.error(`UnhandledRejection: ${err.message}`);
    process.exit(-3);
});

toobusy.onLag(function(currentLag) {
    log.warn(`Event loop lag detected, latency=${currentLag} ms.`);
});

async function main() {

    let time = 0;
    setInterval(async () => {
        const csv = new ObjectsToCsv([{time: time = time + 1, rss: process.memoryUsage().rss / (1024 * 1024), heapTotal: process.memoryUsage().heapTotal / (1024 * 1024), heapUsed: process.memoryUsage().heapUsed / (1024 * 1024)}]);
        await csv.toDisk('./memory_usage.csv', {append: true});
    }, 60000);

    grpcService.start();

    app.use(bodyParser.json());
    app.disable('x-powered-by');

    app.use('/v1/test', testRoute);

    app.listen(8210, () => log.info('Service started on port 8210'));
}

main();

module.exports = app;
