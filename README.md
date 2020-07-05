# Hasura Helpers

helper functions hasura


## Installation

```
npm i --save hasura-helpers
```

## Usage

```javascript
const { client, query } = require("hasura-helpers");

const myClient = client("{hasura_endpoint}/v1/graphql");

const myQuery = query("select", "user", "experimental")
    .where({ user_id: 5 })
    .get(['user_id', 'username', 'email']);

// At this point myQuery will store following string
//
// query selectUser {
//      experimental_user(where: { user_id: 5 }) {
//          user_id
//          username
//          email
//      }
// }

async function selectUsers() {
    return await myClient.role("user")
        .token("{jwt}")
        .query(myQuery);
}
```