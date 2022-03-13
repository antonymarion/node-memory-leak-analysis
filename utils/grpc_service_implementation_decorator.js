'use strict';

const grpc = require('grpc');

class GrpcServiceImplementationDecorator {

    constructor(loggingUtils, serviceName, serviceImplementation) {
        this.loggingUtils = loggingUtils;
        this.setMaxProcessingCount();
        this.setMaxQueueSize();
        this.serviceName = serviceName;
        this.createDecoratedServiceImplementation(serviceImplementation);
        this.queue = [];
        this.processingCount = 0;
    }

    static calculateDurationInMilliseconds(start) {
        const duration = process.hrtime(start);
        return ((duration[0] * 1e9) + duration[1]) / 1e6;
    }

    static upperCaseFirstCharacter(string) {
        if (string.length > 0) {
            return string[0].toUpperCase() + string.slice(1);
        }
        return string;
    }

    setMaxProcessingCount() {
        this.maxProcessingCount = parseInt(process.env.MAX_PROCESSING_COUNT) || 100;
        if (!this.maxProcessingCount) {
            throw new Error(`Invalid maxProcessingCount: ${this.maxProcessingCount}`);
        }
    }

    setMaxQueueSize() {
        this.maxQueueSize = parseInt(process.env.MAX_QUEUE_SIZE) || 200;
        if (!this.maxQueueSize) {
            throw new Error(`Invalid maxQueueSize: ${this.maxQueueSize}`);
        }
    }

    createDecoratedServiceImplementation(serviceImplementation) {
        this.decoratedServiceImplementation = {};
        Object.keys(serviceImplementation).forEach(methodName => {
            if (serviceImplementation[methodName] instanceof Function) {
                if (!methodName.endsWith('HandleError')) {
                    const originalMethod = serviceImplementation[methodName];
                    const errorHandlerMethod = serviceImplementation[methodName + 'HandleError'];
                    this.decoratedServiceImplementation[methodName] = (call, callback) => {
                        this.runDecoratedServiceMethod(methodName, call, callback, originalMethod, errorHandlerMethod);
                    };
                }
            } else {
                this.decoratedServiceImplementation[methodName] = serviceImplementation[methodName];
            }
        });
    }

    runDecoratedServiceMethod(methodName, call, callback, originalMethod, errorHandlerMethod) {
        if (this.queue.length < this.maxQueueSize) {
            this.queue.push({
                serviceName: this.serviceName,
                queueStartTime: process.hrtime(),
                methodName: methodName,
                call: call,
                callback: callback,
                originalMethod: originalMethod,
                errorHandlerMethod: errorHandlerMethod,
            });
            this.processQueue();
        } else {
            const message = `max queue size reached (${this.maxQueueSize})`;
            this.loggingUtils.warn(message);
            callback({message: message});
        }
    }

    processQueue() {
        while (this.processingCount < this.maxProcessingCount && this.queue.length > 0) {
            const queueItem = this.queue.shift();
            this.processQueueItem(queueItem); // Promise is ignored, because we want to do it in parallel
        }
    }

    async processQueueItem(queueItem) {
        await this.traceGrpcServerRequestDuration({
            methodName: queueItem.methodName,
            method: async () => {
                this.processingCount++;
                queueItem.queueTime = Math.round(GrpcServiceImplementationDecorator.calculateDurationInMilliseconds(queueItem.queueStartTime));
                await this.traceGrpcServerRequest(async () => {
                    if (queueItem.call.cancelled) {
                        this.loggingUtils.warn(`Call '${this.serviceName}.${queueItem.methodName}' was cancelled before getting a chance to process it`);
                        queueItem.callback({
                            code: grpc.status.CANCELLED,
                            message: `Server detected call was cancelled`,
                        });
                    } else {
                        try {
                            await queueItem.originalMethod(queueItem.call, queueItem.callback);
                        } catch (error) {
                            this.loggingUtils.warn(`Error in GRPC server call ${this.serviceName}.${queueItem.methodName}: ${error.message}`);
                            await queueItem.errorHandlerMethod(queueItem.call, queueItem.callback, error);
                        }
                    }
                    queueItem.totalTime = Math.round(GrpcServiceImplementationDecorator.calculateDurationInMilliseconds(queueItem.queueStartTime));
                    queueItem.processTime = queueItem.totalTime - queueItem.queueTime;
                    this.loggingUtils.debug(`GRPC server call ${this.serviceName}.${queueItem.methodName} took ${queueItem.totalTime} ms (queue-time = ${queueItem.queueTime} ms, process-time = ${queueItem.processTime} ms, processing-count = ${this.processingCount}, queue-size = ${this.queue.length})`);
                    this.processingCount--;
                });
            },
        });
        this.processQueue();
    }

    async traceGrpcServerRequest(func) {
        await func(); // not implemented rest of source code
    }

    async traceGrpcServerRequestDuration(arg) {
        const context = this.createContext(arg);
        return await context.method();
    }

    createContext(arg) {
        const context = {};
        if (arg instanceof Function) {
            context.serviceName = this.serviceName;
            context.methodName = GrpcServiceImplementationDecorator.upperCaseFirstCharacter(arg.name);
            context.method = arg;
        } else {
            Object.assign(context, arg);
            context.serviceName = arg.serviceName || this.serviceName;
            context.methodName = GrpcServiceImplementationDecorator.upperCaseFirstCharacter(arg.methodName || arg.method.name);
        }
        context.start = process.hrtime();
        return context;
    }
}

module.exports = GrpcServiceImplementationDecorator;
