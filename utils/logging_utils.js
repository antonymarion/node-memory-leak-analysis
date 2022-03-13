'use strict';

const winston = require('winston');
const defaultLogLevel = process.env.DEFAULT_LOG_LEVEL || 'debug';

class LoggingUtils {
    constructor() {
        this.logger = winston.createLogger({
            level: 'debug',
            transports: [
                new winston.transports.Console({
                    timestamp: function() {
                        return new Date().toISOString();
                    },
                    handleExceptions: true,
                    level: defaultLogLevel,
                    stderrLevels: ['error'],
                    json: true,
                    stringify: (obj) => JSON.stringify(obj),
                }),
            ],
            exitOnError: false,
        });
    }

    getLogProperties() {
        return {
            '@timestamp': new Date().toISOString(),
            app_version: process.env.npm_package_version,
            app_name: process.env.npm_package_name,
        };
    }

    debug(message) {
        this.logger.debug(message, this.getLogProperties());
    }

    info(message) {
        this.logger.info(message, this.getLogProperties());
    }

    warn(message) {
        this.logger.warn(message, this.getLogProperties());
    }

    error(message) {
        this.logger.error(message, this.getLogProperties());
    }
}

module.exports = LoggingUtils;
