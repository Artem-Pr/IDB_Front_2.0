import { AxiosRequestConfig } from 'axios'

export interface RequestConfigWithIsRefreshTokenInfo extends AxiosRequestConfig {
    isTokensRefreshed?: boolean
}
