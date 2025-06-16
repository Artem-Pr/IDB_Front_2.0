import { errorMessage } from "src/app/common/notifications"

import { APIInstance } from "../api-instance"

import { RequestUrl } from "./api-requests-url-list"

export const getPermissions = async () => {
  try {
    const response = await APIInstance.get<string[]>(RequestUrl.GET_PERMISSIONS)
    return response.data
  } catch (error) {
    console.error(error)
    errorMessage(new Error((error as Error)?.message), 'Get permissions Error')
    return undefined
  }
}
