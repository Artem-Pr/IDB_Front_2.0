import { notification } from 'antd'

export const errorMessage = (error: Error, message: string, duration?: number) => {
  notification.error({
    message: message,
    description: error.message,
    duration: duration === undefined ? 4.5 : duration,
  })
}

export const successMessage = (description: string) => {
  notification.success({
    message: 'Success',
    description,
  })
}
