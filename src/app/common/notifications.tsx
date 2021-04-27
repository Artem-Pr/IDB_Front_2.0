import { notification } from 'antd'

export const errorMessage = (error: Error, message: string) => {
  notification.error({
    message: message,
    description: error.message,
  })
}
