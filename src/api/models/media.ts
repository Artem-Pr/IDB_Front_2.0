import type { Tags } from 'exiftool-vendored'
import { v4 as uuidV4 } from 'uuid'

import { DEFAULT_TIME_STAMP } from 'src/app/common/utils/date/dateFormats'
import { MimeTypes } from 'src/redux/types/MimeTypes'

import type { DuplicateFile } from '../types'

type WithNullOnly<T> = Exclude<T, undefined> | null
type ExifDescription = WithNullOnly<
Tags['Description' | 'ImageDescription' | 'UserComment' | 'Caption-Abstract']
>
type ExifMegapixels = WithNullOnly<Tags['Megapixels']>
type ExifImageSize = WithNullOnly<Tags['ImageSize']>
type ExifKeywords = Exclude<Tags['Keywords' | 'Subject'], string | undefined>
type ExifRating = WithNullOnly<Tags['Rating']>

enum SupportedImageExtensions {
  jpg = 'jpg',
  jpeg = 'jpeg',
  png = 'png',
  heic = 'heic',
  gif = 'gif',
}

enum SupportedVideoExtensions {
  mp4 = 'mp4',
  mov = 'mov',
  avi = 'avi',
  wmv = 'wmv',
}

// enum PreviewPostfix {
//   preview = '-preview',
//   fullSize = '-fullSize',
// }

type NormalizedSupportedImageExt =
  | SupportedImageExtensions
  | Uppercase<SupportedImageExtensions>

type NormalizedSupportedVideoExt =
  | SupportedVideoExtensions
  | Uppercase<SupportedVideoExtensions>

export type SupportedExt = NormalizedSupportedImageExt | NormalizedSupportedVideoExt
type FileNameWithImageExt = `${string}.${NormalizedSupportedImageExt}`
type FileNameWithVideoExt = `${string}.${NormalizedSupportedVideoExt}`
export type FileNameWithExt = FileNameWithImageExt | FileNameWithVideoExt

// type PreviewName =
//   `${string}${PreviewPostfix.preview}.${SupportedImageExtensions.jpg}`
// type FullSizeName =
//   `${string}${PreviewPostfix.fullSize}.${SupportedImageExtensions.jpg}`

type DBFilePath = `/${FileNameWithExt}`
// type DBPreviewPath = `/${PreviewName}`
// type DBFullSizePath = `/${FullSizeName}`

export interface Media extends Omit<MediaInstance, 'properties'> {}
export class MediaInstance {
  id: string // "665213e9d0b7bc53210da723"
  changeDate: string | null // "2024-01-06T14:52:34.000Z" (in the upload it should be null)
  description: ExifDescription
  filePath: DBFilePath | null // "/images/665213e9d0b7bc53210da723.jpg"
  imageSize: ExifImageSize // "4032x3024"
  keywords: ExifKeywords // ["01Cnt-Испания", "02Cty-Барселона"]
  megapixels: ExifMegapixels // 12.2
  mimetype: MimeTypes // "image/jpeg"
  originalDate: string // "2024-01-06T14:52:34.000Z"
  originalName: FileNameWithExt // "2024-01-06 14.52.34.jpg"
  rating: ExifRating // 3
  size: number // 3016092
  staticPath: string // "http://localhost:3000/volumes/d7f3094b-5635-48c8-9688-4da526e6753f.jpg"
  staticPreview: string // "http://localhost:3000/temp/d7f3094b-5635-48c8-9688-4da526e6753f-preview.jpg"
  timeStamp: string // "00:00:00.000"
  duplicates: DuplicateFile[]

  constructor(props: Partial<Media> & Pick<Media, 'mimetype' | 'originalName'>) {
    this.id = props.id || uuidV4()
    this.changeDate = props.changeDate || null
    this.description = props.description || ''
    this.filePath = props.filePath || null
    this.imageSize = props.imageSize || null
    this.keywords = props.keywords || []
    this.megapixels = props.megapixels || null
    this.mimetype = props.mimetype
    this.originalDate = props.originalDate || '-'
    this.originalName = props.originalName
    this.rating = props.rating || null
    this.size = props.size || 0
    this.staticPath = props.staticPath || ''
    this.staticPreview = props.staticPreview || ''
    this.timeStamp = props.timeStamp || DEFAULT_TIME_STAMP
    this.duplicates = props.duplicates || []
  }

  get properties(): Media {
    return {
      id: this.id,
      changeDate: this.changeDate,
      description: this.description,
      filePath: this.filePath,
      imageSize: this.imageSize,
      keywords: this.keywords,
      megapixels: this.megapixels,
      mimetype: this.mimetype,
      originalDate: this.originalDate,
      originalName: this.originalName,
      rating: this.rating,
      size: this.size,
      staticPath: this.staticPath,
      staticPreview: this.staticPreview,
      timeStamp: this.timeStamp,
      duplicates: this.duplicates,
    }
  }
}

export interface MediaChangeable extends Omit<
Media, 'id' | 'duplicates' | 'staticPath' | 'staticPreview' | 'changeDate' | 'imageSize' | 'megapixels' | 'mimetype' | 'size'
> {}
