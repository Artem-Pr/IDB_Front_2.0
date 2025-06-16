import axios from 'axios'

export const HOST = Object.freeze({
  HTTP: process.env.BACKEND_URL || '0.0.0.0',
  WEB_SOCKET: process.env.BACKEND_WEB_SOCKET_URL || '0.0.0.0',
})

export const APIInstance = axios.create({
  baseURL: HOST.HTTP,
  headers: {
    'Content-Type': 'application/json',
  },
})
