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
            host: '157.230.26.1',
            user: 'root',
            ref  : 'origin/main',
            repo : 'git@github.com:icy-road/eNFTverse-backend.git',
            path : '/root/repositories',
            'post-deploy' : 'npm install && pm2 startOrRestart ecosystem.config.js --env staging',
        }
    }
};
