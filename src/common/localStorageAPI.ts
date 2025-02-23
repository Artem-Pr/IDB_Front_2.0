import { MainMenuKeys } from 'src/common/constants'
import { defaultGallerySortingList as defaultGallerySortingListMainPage } from 'src/redux/reducers/mainPageSlice/helpers'
import { initialState as mainPageInitialState } from 'src/redux/reducers/mainPageSlice/mainPageState'
import { SearchMenu } from 'src/redux/reducers/mainPageSlice/types'
import { initialState as settingsInitialState } from 'src/redux/reducers/settingsSlice'
import { defaultGallerySortingList as defaultGallerySortingListUploadPage } from 'src/redux/reducers/uploadSlice/helpers'
import { GalleryPagination, GallerySortingItem } from 'src/redux/types'

const safetyJSONParse = <T>(str: string | null) => {
  try {
    return str ? (JSON.parse(str) as T) : null
  } catch (e) {
    return null
  }
}

export const localStorageAPI = {
  // isDynamicFolders
  set isDynamicFolders(isDynamicFolders: boolean) {
    localStorage.setItem('isDynamicFolders', String(Number(isDynamicFolders)))
  },
  get isDynamicFolders() {
    return Boolean(Number(localStorage.getItem('isDynamicFolders')))
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

  // gallerySortingListMainPage
  set gallerySortingListMainPage(gallerySortingList: GallerySortingItem[]) {
    localStorage.setItem('gallerySortingListMainPage', JSON.stringify(gallerySortingList))
  },
  get gallerySortingListMainPage() {
    const gallerySortingListJSON = localStorage.getItem('gallerySortingListMainPage')
    return safetyJSONParse(gallerySortingListJSON) || defaultGallerySortingListMainPage
  },

  // gallerySortingListUploadPage
  set gallerySortingListUploadPage(gallerySortingList: GallerySortingItem[]) {
    localStorage.setItem('gallerySortingListUploadPage', JSON.stringify(gallerySortingList))
  },
  get gallerySortingListUploadPage() {
    const gallerySortingListJSON = localStorage.getItem('gallerySortingListUploadPage')
    return safetyJSONParse(gallerySortingListJSON) || defaultGallerySortingListUploadPage
  },

  // randomSort
  set randomSort(randomSort: boolean) {
    localStorage.setItem('randomSort', JSON.stringify(randomSort))
  },
  get randomSort() {
    const randomSortJSON = localStorage.getItem('randomSort')
    return randomSortJSON ? JSON.parse(randomSortJSON) : false
  },

  // groupedByDateMainPage
  set groupedByDateMainPage(groupedByDate: boolean) {
    localStorage.setItem('groupedByDateMainPage', JSON.stringify(groupedByDate))
  },
  get groupedByDateMainPage() {
    const groupedByDateJSON = localStorage.getItem('groupedByDateMainPage')
    return safetyJSONParse(groupedByDateJSON) || false
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

  // isVideoPreviewMuted
  set isVideoPreviewMuted(isVideoPreviewMuted: boolean) {
    localStorage.setItem('isVideoPreviewMuted', String(Number(isVideoPreviewMuted)))
  },
  get isVideoPreviewMuted() {
    return Boolean(Number(localStorage.getItem('isVideoPreviewMuted')))
  },

  // isDuplicatesChecking
  set isDuplicatesChecking(isDuplicatesChecking: boolean) {
    localStorage.setItem('isDuplicatesChecking', String(Number(isDuplicatesChecking)))
  },
  get isDuplicatesChecking() {
    return Boolean(Number(localStorage.getItem('isDuplicatesChecking')))
  },
}
