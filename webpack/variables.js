const path = require('path');
const fs = require('fs');
const dotenv = require("dotenv");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const MODES = {
    DEV: 'development',
    PROD: 'production'
};

const PROTOCOLS = {
    HTTP: 'http',
    HTTPS: 'https',
    WS: 'ws',
};

const DEFAULT_HOST = 'localhost';

const paths = {
    build: resolveApp('build'),
    entry: resolveApp('src/index.tsx'),
    env: resolveApp('.env'),
    html: resolveApp('public/index.html'),
    nodeModules: resolveApp('node_modules'),
    public: resolveApp('public'),
    resolveModules: [resolveApp('src'), 'node_modules'],
    src: resolveApp('src'),
};

const env = dotenv.config({path: paths.env}).parsed;
const getBaseUrl = (port, host) => `${PROTOCOLS.HTTP}://${host}:${port}/`;

const HOST_APP_PORT = env.HOST_APP_PORT;
const LOCAL_BACKEND_WEB_SOCKET_PORT = env.LOCAL_BACKEND_WEB_SOCKET_PORT;
const LOCAL_BACKEND_PORT = env.LOCAL_BACKEND_PORT;
const backendPath = `${PROTOCOLS.HTTP}://${DEFAULT_HOST}:${LOCAL_BACKEND_PORT}`
const backendWebSocketPath = `${PROTOCOLS.WS}://${DEFAULT_HOST}:${LOCAL_BACKEND_WEB_SOCKET_PORT}`

const MFConfigBase = {
    HOST_APP: {
        PORT: HOST_APP_PORT,
        HOST: DEFAULT_HOST,
    },
};

const config = Object.keys(MFConfigBase).reduce((prevMF, nextMFName) => {
    const nextMF = MFConfigBase[nextMFName];
    return {
        ...prevMF,
        [nextMFName]: {
            ...nextMF,
            URL: getBaseUrl(nextMF.PORT, nextMF.HOST)
        }
    };
}, {});

const envKeys = {
    ['process.env.BACKEND_URL']: JSON.stringify(backendPath),
    ['process.env.BACKEND_WEB_SOCKET_URL']: JSON.stringify(backendWebSocketPath),
}

module.exports = {
    config,
    MODES,
    envKeys,
    paths,
};