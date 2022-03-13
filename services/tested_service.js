'use strict';

const timeUtils = require('../common/common_utils').timeUtils;

async function getData(request) {
    await timeUtils.sleep(Math.random() * (60 - 15) + 15); // simulate some redis / database operations
    return {
        acc: {
            id: request.parameter1,
            id2: '0000',
            id3: 'jdhfkjdsg',
            status: 'ACTIVE',
            strs: [
                '1',
                '2',
                '3',
            ],
            id4: 'e51fe0c6-199e-40ce-bfff-16f46462f708',
            creationDate: 1588144610,
            schemaVersion: '4',
            properties: [
                {
                    'key': 'key1',
                    'value': '1234',
                },
                {
                    'key': 'key2',
                    'value': 'bla',
                },
            ],
        },
        acc2: {
            text: 'some random text',
            parameter1: request.parameter1,
            id: 'ea15e4df786e766a05094857f7b45b8e',
            schemaVersion: '2',
            top: true,
        },
        acc3: {
            text: 'some random text for test',
            id: '6a9bc695571cb963687a9c85aba6d783',
            schemaVersion: '2',
            acc2Id: 'ea15e4df786e766a05094857f7b45b8e',
            top: true,
            acc3Properties: [
                {
                    'key': 'key1',
                    'value': '1234',
                },
                {
                    'key': 'key2',
                    'value': 'bla',
                },
            ],
        },
        acc4: {
            acc4: request.parameter1,
            iAcc4Id: request.parameter2,
            schemaVersion: '4',
            acc4GroupId: 'XYZDKL',
            isSet: true,
            text: 'some random text',
            id2: 'frf5r4e645f34-8435er6+g45',
            id3: 'kvQ8mPkWd',
            language: 'ENG',
            id: 'eiwrjmimji' + request.parameter2,
            creationDate: 1588144610,
        },
    };
}

module.exports = {
    getData: getData,
};
