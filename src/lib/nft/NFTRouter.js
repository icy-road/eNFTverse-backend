const Router = require('koa-router');
const asyncBusboy = require('async-busboy');
const { middleware: validate } = require('../../validator');
const NFTController = require('./NFTController');
const config = require('../../../config');

const nftController = new NFTController(config);
const router = Router();


router.post(
    '/generateNFTMetadataHash',
    validate({
        formData: NFTController.validatorSchemas.generateNFTMetadataHash,
    }),
    async (ctx, next) => {
        console.log(ctx.request.formData)
        ctx.body = await nftController.generateNFTMetadataHash(ctx.request.formData);
        await next();
    },
);

module.exports = router.routes();
