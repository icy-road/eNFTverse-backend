module.exports = {
    apps : [{
        name: 'eNFTverse-backend',
        script: './index.js',
        env_staging:{
            NODE_ENV: "prod",
        },
        env_prod: {
            NODE_ENV: "prod",
        }
        // instances : 1,
        // exec_mode : 'cluster'
        // interpreter : 'node@16.13.1'
    }],

    deploy : {
        staging : {
            host: '161.35.72.246',
            user: 'root',
            ref  : 'origin/main',
            repo : 'git@github.com:icy-road/eNFTverse-backend.git',
            path : '/root/repositories/eNFTverse-backend',
            'post-deploy' : 'npm install && pm2 startOrRestart ecosystem.config.js --env staging',
        }
    }
};
