import { notification } from 'antd'
import { HttpStatusCode } from 'axios'

// Constants
const NOTIFICATION_DURATION = {
  DEFAULT: 4.5,
  SHORT: 2,
  LONG: 6,
} as const

const MESSAGES = {
  AUTH_FAILED: 'Authentication Failed',
  AUTH_DESCRIPTION: 'Your session has expired. Please log in again.',
  SUCCESS: 'Success',
} as const

// Types
interface ErrorLike {
  message?: string
  status?: number
  response?: { status?: number }
  isAxiosError?: boolean
  isAuthFailure?: boolean
}

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface NotificationConfig {
  message: string
  description?: string
  duration?: number
  onClose?: () => void
}

// Authentication Error Handler
class AuthErrorHandler {
  private static instance: AuthErrorHandler
  private notificationShown = false

  static getInstance(): AuthErrorHandler {
    if (!AuthErrorHandler.instance) {
      AuthErrorHandler.instance = new AuthErrorHandler()
    }
    return AuthErrorHandler.instance
  }

  isAuthenticationError(error: ErrorLike): boolean {
    // Check if it's our custom AuthenticationFailureError
    if (error?.isAuthFailure === true) {
      return true
    }
    
    // Check if it's a direct 401 unauthorized error
    if (error?.status === HttpStatusCode.Unauthorized || error?.response?.status === HttpStatusCode.Unauthorized) {
      return true
    }
    
    // Check for AxiosError with 401 status
    if (error?.isAxiosError && error?.response?.status === HttpStatusCode.Unauthorized) {
      return true
    }
    
    return false
  }

  showAuthenticationError(): void {
    if (!this.notificationShown) {
      this.notificationShown = true
      this.showNotification('error', {
        message: MESSAGES.AUTH_FAILED,
        description: MESSAGES.AUTH_DESCRIPTION,
        duration: NOTIFICATION_DURATION.DEFAULT,
        onClose: () => this.resetFlag(),
      })
    }
  }

  resetFlag(): void {
    this.notificationShown = false
  }

  private showNotification(type: NotificationType, config: NotificationConfig): void {
    notification[type](config)
  }
}

// Notification Helper
class NotificationHelper {
  private authHandler = AuthErrorHandler.getInstance()

  private showNotification(type: NotificationType, config: NotificationConfig): void {
    notification[type](config)
  }

  private createConfig(message: string, description?: string, duration?: number): NotificationConfig {
    return {
      message,
      description,
      duration: duration ?? NOTIFICATION_DURATION.DEFAULT,
    }
  }

  showError(error: ErrorLike, message: string, duration?: number): void {
    // Handle authentication errors specially
    if (this.authHandler.isAuthenticationError(error)) {
      this.authHandler.showAuthenticationError()
      return
    }

    // Show regular error message for non-auth errors
    const config = this.createConfig(
      `Error: ${message}`,
      error?.message,
      duration
    )
    this.showNotification('error', config)
  }

  showWarning(error: ErrorLike, message: string, duration?: number): void {
    const config = this.createConfig(
      `Warning: ${message}`,
      error?.message,
      duration
    )
    this.showNotification('warning', config)
  }

  showSuccess(description: string, duration?: number): void {
    const config = this.createConfig(
      MESSAGES.SUCCESS,
      description,
      duration
    )
    this.showNotification('success', config)
  }

  showAuthenticationError(): void {
    this.authHandler.showAuthenticationError()
  }

  resetAuthErrorFlag(): void {
    this.authHandler.resetFlag()
  }
}

// Create singleton instance
const notificationHelper = new NotificationHelper()

// Public API - maintaining backward compatibility
export const errorMessage = (error: ErrorLike, message: string, duration?: number): void => {
  notificationHelper.showError(error, message, duration)
}

export const warningMessage = (error: ErrorLike, message: string, duration?: number): void => {
  notificationHelper.showWarning(error, message, duration)
}

export const successMessage = (description: string, duration?: number): void => {
  notificationHelper.showSuccess(description, duration)
}

export const authenticationErrorMessage = (): void => {
  notificationHelper.showAuthenticationError()
}

export const resetAuthErrorFlag = (): void => {
  notificationHelper.resetAuthErrorFlag()
}

// Export additional utilities for advanced usage
export { NOTIFICATION_DURATION, MESSAGES }
export type { ErrorLike, NotificationConfig }
