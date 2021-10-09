export const duplicateConfig = {
  title: 'Duplicate names',
  content: 'Please enter another name',
}

export const emptyCheckboxesConfig = {
  title: 'Nothing to edit',
  content: 'Please check one of the checkboxes',
}

export const deleteConfirmation = (onOk: () => void, onCancel: () => void) => ({
  title: 'Delete confirmation',
  content: 'Are you sure you want to delete this file?',
  okText: 'Yes',
  cancelText: 'No',
  onOk,
  onCancel,
})
