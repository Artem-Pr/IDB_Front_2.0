import type { Tags } from 'src/api/models/media'
import type { Defined, GPSCoordinates } from 'src/redux/types'

export const isGPSExist = <T extends (Pick<Tags, 'GPSLatitude' | 'GPSLongitude'> | Tags | undefined)>(
  GPS: T,
): GPS is Defined<T> => Boolean(GPS?.GPSLatitude && GPS?.GPSLongitude)

const getGPSCoordinates = (exif: Tags): GPSCoordinates | undefined => (isGPSExist(exif)
  ? {
    GPSLatitude: exif.GPSLatitude,
    GPSLongitude: exif.GPSLongitude,
  }
  : undefined)

export const openGPSLocation = (exif: Tags) => {
  const coordinates = getGPSCoordinates(exif)
  if (coordinates) {
    const { GPSLatitude, GPSLongitude } = coordinates
    window.open(`https://www.google.com/maps/search/${GPSLatitude}+${GPSLongitude}/@${GPSLatitude},${GPSLongitude},858m/data=!3m1!1e3!5m1!1e4?entry=ttu`, '_blank')
  }
}
