exports.handler = (event, context, callback) => {
    var search = require('./InLearnSearch');
    search(event.queryStringParameters.q, callback, context);
};
