
# ION CLI

### Installation

1. Clone the ION repository: `git checkout master`
2. Install the project globally: `git install -g`
3. Use one of the supported commands below (currently limited to Create).

### Commands

#### Create Operation
```
ion operation create
```
This will genearate a create operation payload you can paste in a POST body to a running ION node. You should leave your IPFS service running locally until the network has fully propagated your operation.
