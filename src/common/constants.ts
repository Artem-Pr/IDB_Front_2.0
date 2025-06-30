export enum MainMenuKeys {
  SORT = 'sort',
  FILTER = 'filter',
  FOLDERS = 'folders',
  PROPERTIES = 'properties',
  EDIT = 'edit',
  EDIT_BULK = 'edit-bulk',
  KEYWORDS = 'keywords',
  PREVIEW = 'preview',
  BUTTONS_MENU = 'buttons-menu',
  DUPLICATES = 'duplicates',
}

export enum Sort {
  ASC = 1,
  DESC = -1,
}

export enum MimeTypes {
  png = 'image/png',
  jpeg = 'image/jpeg',
  webp = 'image/webp',
  heic = 'image/heic',
  dng = 'image/x-adobe-dng',
  gif = 'image/gif',
  avi = 'video/x-msvideo',
  avi_old = 'video/avi',
  flv = 'video/x-flv',
  mkv = 'video/x-matroska',
  mov = 'video/quicktime',
  mp4 = 'video/mp4',
  mpeg = 'video/mpeg',
  ogg = 'video/ogg',
  webm = 'video/webm',
  wmv = 'video/x-ms-wmv',
}

export enum ExifValueType {
  STRING = 'string',
  NUMBER = 'number',
  STRING_ARRAY = 'string_array',
  LONG_STRING = 'long_string',
  NOT_SUPPORTED = 'not_supported',
}
