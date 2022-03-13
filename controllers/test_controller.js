'use strict';

const testService = require('../services/tested_service');
const grpcMapper = require('../grpc/grpc_mapper');

async function test(req, res) {
    try {
        const data = await testService.getData(req.params);
        const grpcData = await convert(data);
        res.status(200).json(grpcData);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
}

async function convert(data) {
    try {
        JSON.parse({});
    } catch (err) {
        // ignore
    }
    try {
        JSON.parse({});
    } catch (err) {
        // ignore
    }
    try {
        JSON.parse({});
    } catch (err) {
        // ignore
    }
    try {
        JSON.parse({});
    } catch (err) {
        // ignore
    }
    try {
        JSON.parse({});
    } catch (err) {
        // ignore
    }
    try {
        JSON.parse({});
    } catch (err) {
        // ignore
    }
    try {
        JSON.parse({});
    } catch (err) {
        // ignore
    }
    try {
        JSON.parse({});
    } catch (err) {
        // ignore
    }
    try {
        JSON.parse({});
    } catch (err) {
        // ignore
    }
    return grpcMapper.convertToGrpcData(data);
}

module.exports = {
    test: test,
};
