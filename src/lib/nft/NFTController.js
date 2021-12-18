const debug = require('debug')('NFTWebGenerator:nft:NFTController');
const { Joi } = require('../../../src/validator');
const Controller = require('../../common/Controller');
const superagent = require('superagent');
const AES = require('aes-cbc');
const createClient = require('ipfs-http-client');
const AppError = require('../../common/AppError');

class NFTController extends Controller {
  constructor(config) {
    super(debug);
    this.config = config;
    this.ipfsClient = createClient(config.ipfs.nodeURL);
    this.publicGatewayURLPrefix = config.ipfs.publicGatewayURLPrefix;
    this.internalGatewayURLPrefix = config.ipfs.internalGatewayURLPrefix;
  }

  async generateNFTMetadataHash({ image, author, description, external_url, tags, name, attributes }){
    const { path: ipfsFileHash } = await this.ipfsClient.add(image, {pin: true});
    const ipfsFilePath = `${this.publicGatewayURLPrefix}/${ipfsFileHash}`;
    const { path: ipfsMetadataHash } = await this.ipfsClient.add(JSON.stringify({
      image: ipfsFilePath,
      author, description, external_url, tags, name, attributes,
    }), { pin: true });

   return {
     publicMetadataUrl: `${this.publicGatewayURLPrefix}/${ipfsMetadataHash}`,
     internalMetadataUrl: `${this.internalGatewayURLPrefix}/${ipfsMetadataHash}`,
   }
  }
}

NFTController.validatorSchemas = {
  generateNFTMetadataHash: Joi.object()
    .keys({
      image: Joi.any().required(),
      external_url: Joi.string().optional(),
      author: Joi.string(),
      name: Joi.string(),
      description: Joi.string(),
      attributes: Joi.array().items(Joi.object()).optional(),
      tags: Joi.stringArray().items(Joi.string()).optional(),
    }),
};

module.exports = NFTController;
