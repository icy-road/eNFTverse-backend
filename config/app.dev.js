const config = {
  app: {
    port: 3000,
    envName: 'dev',
    name: 'eNFTverse backend Dev',
  },
  ipfs: {
    nodeURL: 'http://159.89.212.246:5001',
    publicGatewayURLPrefix: 'https://gateway.ipfs.io/ipfs',
    internalGatewayURLPrefix: 'http://159.89.212.246:8080/ipfs',
  }
};

module.exports = config;
