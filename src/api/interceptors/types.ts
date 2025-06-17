import { AxiosRequestConfig } from 'axios'

export interface RequestConfigWithIsRefreshTokenInfo extends AxiosRequestConfig {
    isTokensRefreshed?: boolean
}

// Custom error class to identify authentication failures that should be handled globally
export class AuthenticationFailureError extends Error {
  public isAuthFailure = true as const
  
  constructor(message: string = 'Authentication failed') {
    super(message)
    this.name = 'AuthenticationFailureError'
  }
}
