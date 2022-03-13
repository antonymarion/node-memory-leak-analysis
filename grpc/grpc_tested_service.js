'use strict';

const testedService = require('../services/tested_service');
const grpcMapper = require('./grpc_mapper');
const log = require('../common/common_utils').loggingUtils;
const grpcUtils = require('../common/common_utils').grpcUtils;

const testedServiceProtoPath = './proto/tested/testedservice.proto';

const protobuf = require('protobufjs');
const serviceProto = protobuf.loadSync(testedServiceProtoPath);
const grpcResponseStateEnum = serviceProto.lookupEnum('ResponseState').values;

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(testedServiceProtoPath,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
const grpcTestedServiceDefinition = grpc.loadPackageDefinition(packageDefinition).service;

async function getData(call, callback) {
    const data = await testedService.getData(call.request);
    const grpcData = grpcMapper.convertToGrpcData(data);
    callback(null, {
        state: grpcResponseStateEnum.OK,
        data: grpcData,
    });
}

async function getDataHandleError(call, callback, err) {
    callback(null, {
        state: grpcResponseStateEnum.ERROR,
        data: null,
    });
}

const serviceImplementation = {
    GetData: getData,
    GetDataHandleError: getDataHandleError,
};

const decoratedServiceImplementation = grpcUtils.decorateServiceImplementation(serviceImplementation);

function start() {
    const server = new grpc.Server();
    server.addService(grpcTestedServiceDefinition.TestedService.service, decoratedServiceImplementation);
    server.bind('0.0.0.0:6968', grpc.ServerCredentials.createInsecure());
    server.start();
    log.info('GRPC Service started on port 6968');
}

module.exports.start = start;

Object.assign(module.exports, decoratedServiceImplementation);
