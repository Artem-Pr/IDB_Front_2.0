import { QueryResponse } from './index'

export interface TestType extends QueryResponse {
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
  progress: number
  pid: number
}
