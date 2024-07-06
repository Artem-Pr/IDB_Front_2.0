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
    env_build: resolveApp('../.env'),
    html: resolveApp('public/index.html'),
    nodeModules: resolveApp('node_modules'),
    public: resolveApp('public'),
    resolveModules: [resolveApp('src'), 'node_modules'],
    src: resolveApp('src'),
};

const env = dotenv.config({path: paths.env}).parsed;
const env_build = dotenv.config({path: paths.env_build}).parsed || env;
const getBaseUrl = (port, host) => `${PROTOCOLS.HTTP}://${host}:${port}/`;

const HOST_APP_PORT = env.HOST_APP_PORT;
const HOST_APP_PORT_BUILD = env_build.HOST_APP_PORT
const LOCAL_BACKEND_WEB_SOCKET_PORT = env.LOCAL_BACKEND_WEB_SOCKET_PORT;
const LOCAL_BACKEND_WEB_SOCKET_PORT_BUILD = env_build.LOCAL_BACKEND_WEB_SOCKET_PORT;
const LOCAL_BACKEND_PORT = env.LOCAL_BACKEND_PORT;
const LOCAL_BACKEND_PORT_BUILD = env_build.LOCAL_BACKEND_PORT;
const backendPath = `${PROTOCOLS.HTTP}://${DEFAULT_HOST}:${LOCAL_BACKEND_PORT}`
const backendPathBuild = `${PROTOCOLS.HTTP}://${DEFAULT_HOST}:${LOCAL_BACKEND_PORT_BUILD}`
const backendWebSocketPath = `${PROTOCOLS.WS}://${DEFAULT_HOST}:${LOCAL_BACKEND_WEB_SOCKET_PORT}`
const backendWebSocketPathBuild = `${PROTOCOLS.WS}://${DEFAULT_HOST}:${LOCAL_BACKEND_WEB_SOCKET_PORT_BUILD}`

const configBase = {
    HOST_APP: {
        PORT: HOST_APP_PORT,
        HOST: DEFAULT_HOST,
    },
    HOST_APP_BUILD: {
        PORT: HOST_APP_PORT_BUILD,
        HOST: DEFAULT_HOST,
    },
};

const config = Object.keys(configBase).reduce((prevMF, nextMFName) => {
    const nextApp = configBase[nextMFName];
    return {
        ...prevMF,
        [nextMFName]: {
            ...nextApp,
            URL: getBaseUrl(nextApp.PORT, nextApp.HOST)
        }
    };
}, {});

const envKeys = {
    [MODES.DEV]: {
        ['process.env.BACKEND_URL']: JSON.stringify(backendPath),
        ['process.env.BACKEND_WEB_SOCKET_URL']: JSON.stringify(backendWebSocketPath),
    },
    [MODES.PROD]: {
        ['process.env.BACKEND_URL']: JSON.stringify(backendPathBuild),
        ['process.env.BACKEND_WEB_SOCKET_URL']: JSON.stringify(backendWebSocketPathBuild),
    }
}

const envPorts = {
    [MODES.DEV]: env,
    [MODES.PROD]: env_build
}

module.exports = {
    MODES,
    config,
    envKeys,
    envPorts,
    paths,
};