const config = {
  app: {
    port: typeof process.env.ENFTVERSE_PORT === 'undefined' ? 3000 : Number(process.env.ENFTVERSE_PORT),
    envName: typeof process.env.NODE_ENV === 'undefined' ? 'prod' : process.env.NODE_ENV,
    name: 'eNFTverse backend prod',
  },
  ipfs: {
    nodeURL: 'http://159.89.212.246:5001',
    publicGatewayURLPrefix: 'https://gateway.ipfs.io/ipfs',
    internalGatewayURLPrefix: 'http://159.89.212.246:8080/ipfs',
  }
};

module.exports = config;
