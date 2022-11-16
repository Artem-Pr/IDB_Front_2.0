export const localStorageAPI = {
  set fullSizePreview(fullSizePreview: boolean) {
    localStorage.setItem('fullSizePreview', String(Number(fullSizePreview)))
  },
  get fullSizePreview() {
    return Boolean(Number(localStorage.getItem('fullSizePreview')))
  },

  set maxImagePreviewLimit(maxLimit: number) {
    localStorage.setItem('maxImagePreviewLimit', String(maxLimit))
  },
  get maxImagePreviewLimit() {
    return Number(localStorage.getItem('maxImagePreviewLimit'))
  },

  set minImagePreviewLimit(minLimit: number) {
    localStorage.setItem('minImagePreviewLimit', String(minLimit))
  },
  get minImagePreviewLimit() {
    return Number(localStorage.getItem('minImagePreviewLimit'))
  },
}
