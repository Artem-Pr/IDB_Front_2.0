import { errorMessage } from 'src/app/common/notifications'

import { APIInstance } from '../api-instance'
import { AuthTokens } from '../types/response-types'

import { RequestUrl } from './api-requests-url-list'

export const login = async (username: string, password: string) => {
  const params = new URLSearchParams({ username, password })

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }

  try {
    const { data } = await APIInstance.post<AuthTokens>(RequestUrl.LOGIN, params, config)

    return data
  } catch (error) {
    console.error(new Error((error as Error)?.message))
    errorMessage(new Error((error as Error)?.message), 'Login Error')
    return undefined
  }
}
