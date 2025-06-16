import { APIInstance } from '../api-instance'
import type { AuthTokens } from '../types/response-types'

import { RequestUrl } from './api-requests-url-list'

export const logout = async ({ refreshToken, accessToken }: AuthTokens) => {
  const params = new URLSearchParams({ refreshToken })

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${accessToken}`,
    },
  }

  try {
    await APIInstance.post(RequestUrl.LOGOUT, params, config)
  } catch (error) {
    console.error(new Error((error as Error)?.message))
    return undefined
  }
}
