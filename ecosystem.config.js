module.exports = {
    apps : [{
        name: 'nft-service',
        script: './index.js',
        env_staging:{
            NODE_ENV: "prod",
        },
        env_prod: {
            NODE_ENV: "prod",
        }
    }],

    deploy : {
        staging : {
            host: '165.227.245.56',
            user: 'root',
            ref  : 'origin/main',
            repo : 'git@github.com:narcis2007/NFTWebGenerator.git',
            path : '/root/repositories',
            'post-deploy' : 'npm install && pm2 startOrRestart ecosystem.config.js --env staging && npm run job migrate',
        }
    }
};
