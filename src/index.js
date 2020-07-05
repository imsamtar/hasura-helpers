const Query = require("./Query");
const Client = require("./Client");

function query(operation, table, schema) {
    return new Query(operation, table, schema);
}

function client(endpoint, headers) {
    return new Client(endpoint, headers);
}

module.exports = {
    Client,
    Query,
    client,
    query,
}
