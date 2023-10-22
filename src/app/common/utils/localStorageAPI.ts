import { GalleryPagination, GallerySortingItem, MainMenuKeys } from '../../../redux/types'
import { SearchMenu } from '../../../redux/reducers/mainPageSlice/types'
import { initialState as mainPageInitialState } from '../../../redux/reducers/mainPageSlice/mainPageState'
import { initialState as settingsInitialState } from '../../../redux/reducers/settingsSlice-reducer'
import { defaultGallerySortingList } from '../../../redux/reducers/mainPageSlice/helpers'

export const localStorageAPI = {
  // savePreview
  set savePreview(savePreview: boolean) {
    localStorage.setItem('savePreview', String(Number(savePreview)))
  },
  get savePreview() {
    return Boolean(Number(localStorage.getItem('savePreview')))
  },

  // fullSizePreview
  set fullSizePreview(fullSizePreview: boolean) {
    localStorage.setItem('fullSizePreview', String(Number(fullSizePreview)))
  },
  get fullSizePreview() {
    return Boolean(Number(localStorage.getItem('fullSizePreview')))
  },

  // maxImagePreviewLimit
  set maxImagePreviewLimit(maxLimit: number) {
    localStorage.setItem('maxImagePreviewLimit', String(maxLimit))
  },
  get maxImagePreviewLimit() {
    const maxImagePreviewLimit = localStorage.getItem('maxImagePreviewLimit')
    return maxImagePreviewLimit ? Number(maxImagePreviewLimit) : settingsInitialState.imagePreviewSlideLimits.max
  },

  // minImagePreviewLimit
  set minImagePreviewLimit(minLimit: number) {
    localStorage.setItem('minImagePreviewLimit', String(minLimit))
  },
  get minImagePreviewLimit() {
    const minImagePreviewLimit = localStorage.getItem('minImagePreviewLimit')
    return minImagePreviewLimit ? Number(minImagePreviewLimit) : settingsInitialState.imagePreviewSlideLimits.min
  },

  // DOpenMenus
  set DOpenMenus(openMenusList: MainMenuKeys[]) {
    localStorage.setItem('DOpenMenus', JSON.stringify(openMenusList))
  },
  get DOpenMenus() {
    return JSON.parse(localStorage.getItem('DOpenMenus') || '[]')
  },

  // searchMenu
  set searchMenu(searchMenu: SearchMenu) {
    localStorage.setItem('searchMenu', JSON.stringify(searchMenu))
  },
  get searchMenu() {
    const searchMenuJSON = localStorage.getItem('searchMenu')
    return searchMenuJSON ? JSON.parse(searchMenuJSON) : mainPageInitialState.searchMenu
  },

  // galleryPagination
  set galleryPagination(galleryPagination: Partial<GalleryPagination>) {
    localStorage.setItem('galleryPagination', JSON.stringify(galleryPagination))
  },
  get galleryPagination() {
    const galleryPaginationJSON = localStorage.getItem('galleryPagination')
    return galleryPaginationJSON ? JSON.parse(galleryPaginationJSON) : mainPageInitialState.galleryPagination
  },

  // gallerySortingList
  set gallerySortingList(gallerySortingList: GallerySortingItem[]) {
    localStorage.setItem('gallerySortingList', JSON.stringify(gallerySortingList))
  },
  get gallerySortingList() {
    const gallerySortingListJSON = localStorage.getItem('gallerySortingList')
    return gallerySortingListJSON ? JSON.parse(gallerySortingListJSON) : defaultGallerySortingList
  },

  // randomSort
  set randomSort(randomSort: boolean) {
    localStorage.setItem('randomSort', JSON.stringify(randomSort))
  },
  get randomSort() {
    const randomSortJSON = localStorage.getItem('randomSort')
    return randomSortJSON ? JSON.parse(randomSortJSON) : false
  },

  // groupedByDate
  set groupedByDate(groupedByDate: boolean) {
    localStorage.setItem('groupedByDate', JSON.stringify(groupedByDate))
  },
  get groupedByDate() {
    const groupedByDateJSON = localStorage.getItem('groupedByDate')
    return groupedByDateJSON ? JSON.parse(groupedByDateJSON) : false
  },

  // currentFolderPath
  set currentFolderPath(currentFolderPath: string) {
    localStorage.setItem('currentFolderPath', currentFolderPath)
  },
  get currentFolderPath() {
    return localStorage.getItem('currentFolderPath') || ''
  },

  // currentFolderKey
  set currentFolderKey(currentFolderKey: string) {
    localStorage.setItem('currentFolderKey', currentFolderKey)
  },
  get currentFolderKey() {
    return localStorage.getItem('currentFolderKey') || ''
  },

  // folder expandedKeys
  set expandedKeys(expandedKeys: React.Key[]) {
    localStorage.setItem('expandedKeys', JSON.stringify(expandedKeys))
  },
  get expandedKeys() {
    const expandedKeysJSON = localStorage.getItem('expandedKeys')
    return expandedKeysJSON ? JSON.parse(expandedKeysJSON) : []
  },
}
