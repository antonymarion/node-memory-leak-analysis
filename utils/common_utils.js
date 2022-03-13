'use strict';

const LoggingUtils = require('./logging_utils');
const GrpcUtils = require('./grpc_utils');
const TimeUtils = require('./time_utils');

module.exports = class CommonUtils {
    constructor(serviceName) {
        this.loggingUtils = new LoggingUtils();
        this.grpcUtils = new GrpcUtils(serviceName, this.loggingUtils);
        this.timeUtils = TimeUtils;
    }
};
