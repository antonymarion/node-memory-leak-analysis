const protobuf = require('protobufjs');

const testedServiceProtoPath = './proto/tested/testedservice.proto';
const serviceProto = protobuf.loadSync(testedServiceProtoPath);
const grpcStatusEnum = serviceProto.lookupEnum('Status').values;

function convertToGrpcData(data) {
    return {
        acc: convertToGrpcAcc(data.acc),
        acc2: convertToGrpcAcc2(data.acc2),
        acc3: convertToGrpcAcc3(data.acc3),
        acc4: convertToGrpcAcc4(data.acc4),
    };
}

function convertToGrpcAcc(acc) {
    if (!acc) {
        return null;
    }

    return {
        id: convertToGrpcString(acc.id),
        id2: convertToGrpcString(acc.id2),
        id3: convertToGrpcString(acc.id3),
        status: convertToGrpcAccountStatus(acc.status),
        strs: convertToGrpcSubscriptions(acc.strs),
        properties: acc.properties,
        number: convertToGrpcNumber(acc.number),
        id4: convertToGrpcString(acc.id4),
    };
}

function convertToGrpcAcc2(acc2) {
    if (!acc2) {
        return null;
    }

    return {
        id: convertToGrpcString(acc2.id),
        parameter1: convertToGrpcString(acc2.parameter1),
        text: convertToGrpcString(acc2.text),
        top: convertToGrpcBoolean(acc2.top),
    };
}

function convertToGrpcAcc3(acc3) {
    if (!acc3) {
        return null;
    }

    return {
        id: convertToGrpcString(acc3.id),
        acc2Id: convertToGrpcString(acc3.acc2Id),
        top: convertToGrpcBoolean(acc3.top),
        text: convertToGrpcString(acc3.text),
        acc3Properties: acc3.acc3Properties,
    };
}

function convertToGrpcAcc4(acc4) {
    if (!acc4) {
        return null;
    }

    return {
        id: convertToGrpcString(acc4.id),
        text: convertToGrpcString(acc4.text),
        id2: convertToGrpcString(acc4.id2),
        isSet: convertToGrpcBoolean(acc4.isSet),
        acc4: convertToGrpcString(acc4.acc4),
        languageCode: convertToGrpcString(acc4.language),
        id3: convertToGrpcString(acc4.id3),
        acc4Properties: acc4.acc4Properties,
        acc4GroupId: convertToGrpcString(acc4.acc4GroupId),
        iAcc4Id: convertToGrpcString(acc4.iAcc4Id),
    };
}

// Private functions

function convertToGrpcAccountStatus(status) {
    const parsedStatus = getObjectFromJson(status);
    const grpcAccountStatus = grpcStatusEnum[parsedStatus];
    if (grpcAccountStatus === undefined) {
        throw Error(`Unknown account status: ${parsedStatus}`);
    }
    return grpcAccountStatus;
}

function convertToGrpcSubscriptions(subscriptions) {
    if (!subscriptions || subscriptions.length === 0) {
        return [];
    }

    const parsedSubscriptions = getObjectFromJson(subscriptions);
    const grpcSubscriptions = [];
    parsedSubscriptions.forEach((subscription) => {
        grpcSubscriptions.push(convertToGrpcString(subscription));
    });
    return grpcSubscriptions;
}

function convertToGrpcString(currentString) {
    if (!currentString) {
        return '';
    }
    return currentString;
}

function getObjectFromJson(object) {
    let parsedObject = object;
    try {
        parsedObject = JSON.parse(object);
    } catch (err) {
        // ignore
    }
    return parsedObject;
}

function convertToGrpcBoolean(object) {
    return !!object;
}

function convertToGrpcNumber(value) {
    if (value === undefined || value === null) {
        return 1;
    }
    return value;
}

module.exports = {
    convertToGrpcData: convertToGrpcData,
};
