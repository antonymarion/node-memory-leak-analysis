const CommonUtils = require('../utils/common_utils');
const commonUtils = new CommonUtils('TESTED_SERVICE');

module.exports = {
    loggingUtils: commonUtils.loggingUtils,
    grpcUtils: commonUtils.grpcUtils,
    timeUtils: commonUtils.timeUtils,
};
