# 360learning-plugin-client-sdk
A SDK for the client part of plugin developed for 360Learning products

## Getting started

First, import sdk to your project : 
```
yarn add 360learning-plugin-client-sdk

## OR

npm install 360learning-plugin-client-sdk
```

Then create a sdk instance 
```typescript
import { createSDK } from “360learning-plugin-client-sdk”;

const sdk = createSDK();
```

The sdk instance takes care of authenticating against the public api and prepare request to the public api. It exposes two methods : `init` and `fetch`.


#### init

Call `init` to finalize the setup of the SDK.
```typescript
const sdk = createSDK();
await sdk.init();
```

#### fetch

Make sure `init` is called before the very first call to `fetch`.

`fetch` is used to request data from the user authorized route of the 360learning public API. See section "User Authorized API" in the [documentation](https://360learning.readme.io/reference/v2usersgetprofilecontroller_getprofile#/).

```typescript
const sdk = createSDK();
await sdk.init();

const user = await sdk.fetch("api/v2/uaa/users/me", { method: "GET" });
```
