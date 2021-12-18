const Router = require('koa-router');

const NFTRouter = require('./lib/nft/NFTRouter');

const router = Router();

router.use('/nfts', NFTRouter);

router.get('/ping', async (ctx, next) => {
  ctx.body = { status: 'up' };
  await next();
});

module.exports = router.routes();
