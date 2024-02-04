import type { ReactNode } from 'react'

import type { DeleteConfirmationType } from '../../redux/types'

export interface Confirmation {
  onOk: () => void
  onCancel?: () => void
}

export const deleteMessageConst: Record<DeleteConfirmationType, string> = {
  file: 'Are you sure you want to delete selected files?',
  directory: 'Are you sure you want to delete this Directory?',
  keyword: 'Are you sure you want to delete this keyword from keywords list?',
}

export const duplicateConfig = {
  title: 'Duplicate names',
  content: 'Please enter another name',
}

export const emptyCheckboxesConfig = {
  title: 'Nothing to edit',
  content: 'Please check one of the checkboxes',
}

export const longProcessConfirmation = ({ onOk, onCancel, fileSize }: Confirmation & { fileSize: string }) => ({
  title: 'The procedure can take a long time',
  content: `Files for editing have a total size of ${fileSize}, 
    the procedure may take a long time. Are you sure you want to start?`,
  okText: 'Yes',
  cancelText: 'No',
  onOk,
  onCancel,
})

export const deleteConfirmation = ({ onOk, onCancel, type }: Confirmation & { type: DeleteConfirmationType }) => ({
  title: 'Delete confirmation',
  content: deleteMessageConst[type],
  okText: 'Yes',
  cancelText: 'No',
  onOk,
  onCancel,
})

export const checkFolderConfirmation = ({ onOk, onCancel, content }: Confirmation & { content: ReactNode }) => ({
  title: 'This folder contains files or subdirectories:',
  content,
  okText: 'Yes',
  cancelText: 'No',
  onOk,
  onCancel,
})
