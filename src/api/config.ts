export const HOST = Object.freeze({
  HTTP: process.env.BACKEND_URL || '0.0.0.0',
  WEB_SOCKET: process.env.BACKEND_WEB_SOCKET_URL || '0.0.0.0',
})
