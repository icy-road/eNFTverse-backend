const models = require('../../models');
const { crypto, web3: web3Config } = require('../../../config');
const AES = require('aes-cbc');
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider(web3Config.http));

module.exports = {
  async up() {
    const primaryHotWallet = await models.hotWallet.getPrimaryHotWallet();
    if(!primaryHotWallet){
      var ethereumAccount = web3.eth.accounts.create();
      await models.hotWallet.create({
        address: ethereumAccount.address,
        privateKey: AES.encrypt(ethereumAccount.privateKey, crypto.keyBase64, crypto.ivBase64),
        type: 'primary',
      })
    }
  },

  async down() {
    // just ignore the field
  },
};
