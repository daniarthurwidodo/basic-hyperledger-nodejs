## Running HyperLedger

# Requirements
- Go
- Node js : version : 16.20.1 // lts/gallium
- jq 
- docker

install official docker
install docker-composer  version 2.20.*
https://docs.docker.com/compose/install/linux/#install-the-plugin-manually


Check your ~/.docker/config.json and replace "credsStore" by "credStore"

{
  "stackOrchestrator" : "swarm",
  "experimental" : "disabled",
  "credStore" : "desktop"
}



# start network
./network.sh up createChannel -ca -s couchdb 
./network.sh up 
./network.sh up createChannel -ca

# destroy network
./network.sh down

# deploy Chaincode / smartContract
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-typescript/ -ccl typescript

./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript 

./network.sh deployCC -ccn basic -ccp ../chaincode-javascript/ -ccl javascript

# sample typescript
link : https://hyperledger-fabric.readthedocs.io/en/release-2.5/write_first_app.html

asset-transfer-basic/application-gateway-typescript
asset-transfer-basic/application-gateway-javascript
