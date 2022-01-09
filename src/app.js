const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const routes = require('./routes');
const { mongooseInstance } = require('./models');
const errorHandler = require('./common/errorHandler');

const app = new Koa();

app.context.mongooseInstance = mongooseInstance;

app.use(bodyParser({
    enableTypes: ['json', 'form'],
    onerror: (err) => { // ignore json parse error
        debug('body parse error', err);
    },
}));
app.use(errorHandler);
app.use(routes);


app.listen(8080 , () => { //todo: from config
    console.log(`Listening to ${8008 }`);
});
