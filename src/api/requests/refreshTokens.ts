import { APIInstance } from '../api-instance'
import type { AuthTokens } from '../types/response-types'

import { RequestUrl } from './api-requests-url-list'

export const refreshTokens = async (refreshToken: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  }

  try {
    const { data } = await APIInstance.get<AuthTokens>(RequestUrl.REFRESH_TOKENS, config)

    return data
  } catch (error) {
    console.error(new Error((error as Error)?.message))
    return undefined
  }
}
