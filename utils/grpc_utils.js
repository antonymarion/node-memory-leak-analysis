'use strict';

const GrpcServiceImplementationDecorator = require('./grpc_service_implementation_decorator');

class GrpcUtils {
    constructor(serviceName, loggingUtils) {
        this.serviceName = serviceName;
        this.loggingUtils = loggingUtils;
    }

    decorateServiceImplementation(serviceImplementation) {
        const decorator = new GrpcServiceImplementationDecorator(this.loggingUtils, this.serviceName, serviceImplementation);
        return decorator.decoratedServiceImplementation;
    }
}

module.exports = GrpcUtils;










