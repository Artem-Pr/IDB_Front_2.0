import { QueryResponse } from './index'

interface TestType {
  progress: number
  pid: number
}

export interface MatchingNumberOfFilesTest extends TestType {
  foldersInConfig: number
  excessiveFolders__Config_DB: string[]
  excessiveFolders__Config_Disk: string[]
  foldersInDBFiles: number
  excessiveFolders__DB_Config: string[]
  excessiveFolders__DB_Disk: string[]
  foldersInDirectory: number
  excessiveFolders__Disk_Config: string[]
  excessiveFolders__Disk_DB: string[]
  filesInDB: number
  excessiveFiles__DB_Disk: string[]
  filesInDirectory: number
  excessiveFiles__Disk_DB: string[]
}

export interface MatchingVideoFilesTest extends QueryResponse, TestType {
  videoOnDisk: number
  excessiveVideo__Disk_DB: string[]
  excessiveVideo__Disk_DiskThumbnails: string[]
  videoInDB: number
  excessiveVideo__DB_Disk: string[]
  excessiveVideo__DB_DBThumbnails: string[]
  videoThumbnailsOnDisk: number
  excessiveVideo__DiskThumbnails_Disk: string[]
  excessiveVideo__DiskThumbnails_DBThumbnails: string[]
  videoThumbnailsInDB: number
  excessiveVideo__DBThumbnails_DiskThumbnails: string[]
  excessiveVideo__DBThumbnails_DB: string[]
}
