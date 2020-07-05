const fetch = require("node-fetch");

class Client {
    constructor(endpoint, headers, options = {}) {
        this.endpoint = endpoint;
        this.headers = { ...headers, 'content-type': 'application/json' };
        this.role(options.role);
        this.token(options.token);
        this.secret(options.secret);
    }
    role(role) {
        if (role)
            this.headers['x-hasura-role'] = role;
        return this;
    }
    token(token) {
        if (token)
            this.headers['authorization'] = token.replace(/^(bearer\s*.)?/i, 'Bearer ');
        return this;
    }
    secret(secret) {
        if (secret) {
            this.headers['x-hasura-role'] = 'admin';
            this.headers['x-hasura-admin-secret'] = secret;
        }
        return this;
    }
    async query(query, headers, variables = {}) {
        headers = { ...this.headers, ...headers };
        try {
            let result = await fetch(this.endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    query,
                    variables
                })
            });
            result = await result.json();
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Client;
