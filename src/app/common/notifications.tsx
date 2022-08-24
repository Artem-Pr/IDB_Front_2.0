import { notification } from 'antd'

export const errorMessage = (error: Error, message: string, duration?: number) => {
  notification.error({
    message,
    description: error.message,
    duration: duration || 4.5,
  })
}

export const successMessage = (description: string) => {
  notification.success({
    message: 'Success',
    description,
  })
}
