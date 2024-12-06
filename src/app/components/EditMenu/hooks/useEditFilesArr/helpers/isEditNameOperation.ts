import type { BlobUpdateNamePayload } from 'src/redux/types'

export const isEditNameOperation = (blobNameData: BlobUpdateNamePayload | false): blobNameData is BlobUpdateNamePayload => (
  blobNameData !== false && blobNameData.oldName !== blobNameData.newName
)
