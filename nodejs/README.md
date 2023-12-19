## @arklow/client

### Installation

```bash
npm install @arklow/client
```

### Usage

Arklow's JS client is a wrapper around the [Arklow](https://arklow.io) API. It provides a interface for interacting with the API, with safe error handling and chainable methods.

> Initialization
```js
// ESNext
import { Client } from '@arklow/client';

//CommonJs
const { Client } = require('@arklow/client');

const Arklow = new Client({
    api_key: "..."
    team_id: "..."
})
```

> Create an Entity
```js
...
const Entity = await Arklow.Entity().Create(referenceId: string)
...
```

> Get an Entity
```js
...
const Entity = await Arklow.Entity(entityId: string).Get()
...
```

> Delete an Entity
```js
...
await Arklow.Entity(entityId: string).Delete()
...
```

> Get an Entity's Entitlement
```js
...
const EntityEntitlement = await Arklow.Entity(entityId: string).Entitlement(entitlementId: string).Get()
...
```

> Check if an Entity has an Entitlement
```js
...
const { data, error } = await Arklow.Entity(entityId: string).Entitlement(entitlementId: string).Has(entitlements: string | string[])

if (data.entity_entitlement.valid) {
    // Entity has all entitlements checked
} else {
    // Entity does not have entitlement
    let Reason = data.entity_entitlement.reason
}

...
```


> Set/Add an Entitlement to an Entity
```js
...
// Set
await Arklow.Entity(entityId: string).Entitlement(entitlementId: string).Set('can_access_chat')

// Add
await Arklow.Entity(entityId: string).Entitlement(entitlementId: string).Add('can_access_chat')
...
```

> Remove an Entitlement from an Entity
```js
...
await Arklow.Entity(entityId: string).Entitlement(entitlementId: string).Remove('can_access_chat')
...
```

