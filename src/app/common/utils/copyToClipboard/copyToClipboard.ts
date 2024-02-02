import { errorMessage, successMessage } from '../../notifications'

export const copyToClipboardFallback = async (data: string) => {
  const copyToClipboardOldApproach = () => {
    const input = document.createElement('textarea')
    input.value = data

    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    input.remove()
  }

  navigator.clipboard ? await navigator.clipboard.writeText(data) : copyToClipboardOldApproach()
}

export const copyToClipboard = async (data: string) => {
  const copy = async () => {
    await copyToClipboardFallback(data)
      .then(() => {
        successMessage('copied successfully')
      })
      .catch(error => errorMessage(new Error(error), 'copying failed'))
  }

  data ? copy() : errorMessage(new Error('failed'), 'copying failed')
}
