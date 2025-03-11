# node-abieos

Node.js native binding for [abieos](https://github.com/Wire-Network/abieos), with some improvements:

- Contracts can be directly updated on the map
- Added `abieos_delete_contract`

----
**Only supported OS is Linux**

- Typescript typings included
- Prebuilt binary included (Clang 18 required to build)

## Install

```shell script
npm i @wireio/node-abieos --save
```

## Usage

CommonJS

```js
const nodeAbieos = require('@wireio/node-abieos');
```

ES Modules

```typescript
import * as nodeAbieos from "@wireio/node-abieos";
```

Check the [/examples](https://github.com/wireio/node-abieos/tree/master/examples) folder for implementation examples

## Build

Make sure you have Clang installed on your system:
We recommend using Clang 18 to build the `abieos` C++ library.

```bash
wget https://apt.llvm.org/llvm.sh
chmod +x llvm.sh
sudo ./llvm.sh 18
```

### Clone and Build

```shell script
git clone https://github.com/wireio/node-abieos.git
cd node-abieos
npm install
npm run build:linux
npm run build:tsc
```
