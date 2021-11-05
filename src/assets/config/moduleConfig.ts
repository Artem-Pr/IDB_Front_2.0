import { CheckFolderConfirmation, DeleteConfirmation, DeleteConfirmationType } from '../../redux/types'

export const deleteMessageConst: Record<DeleteConfirmationType, string> = {
  file: 'Are you sure you want to delete this file?',
  directory: 'Are you sure you want to delete this Directory?',
}

export const duplicateConfig = {
  title: 'Duplicate names',
  content: 'Please enter another name',
}

export const emptyCheckboxesConfig = {
  title: 'Nothing to edit',
  content: 'Please check one of the checkboxes',
}

export const deleteConfirmation = ({ onOk, onCancel, type }: DeleteConfirmation) => ({
  title: 'Delete confirmation',
  content: deleteMessageConst[type],
  okText: 'Yes',
  cancelText: 'No',
  onOk,
  onCancel,
})

export const checkFolderConfirmation = ({ onOk, onCancel, content }: CheckFolderConfirmation) => ({
  title: 'This folder contains files or subdirectories:',
  content,
  okText: 'Yes',
  cancelText: 'No',
  onOk,
  onCancel,
})
