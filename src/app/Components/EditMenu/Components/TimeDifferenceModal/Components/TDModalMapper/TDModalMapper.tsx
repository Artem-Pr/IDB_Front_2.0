import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Divider, Spin } from 'antd'
import { useSelector } from 'react-redux'

import { FileDoneOutlined } from '@ant-design/icons'

import { TDModalItem } from '../TDModalItem'
import {
  useCurrentPage,
  useSelectedDateList,
  useSelectedFilesList,
  useUpdateFields,
} from '../../../../../../common/hooks/hooks'
import { upload } from '../../../../../../../redux/selectors'
import type { DataType } from '../TDModalItem/TDModalItem'
import { successMessage } from '../../../../../../common/notifications'
import type { OriginalDates } from '../../hooks/useUpdateOriginalDate'

const NUMBER_OF_SELECTED_FILES_TO_SHOW_LOADER = 50

export interface TimeDiffConfig {
  timeDifference: number
  dateType: DataType | null
}

export interface TimeDiff {
  timeDiffConfig: TimeDiffConfig | null
  copyTimeDiff: (timeDiffConfig: TimeDiffConfig) => void
  pasteTimeDiffTrigger: boolean
}

interface Props {
  setOriginalDatesObj: React.Dispatch<React.SetStateAction<OriginalDates>>
}

export const TDModalMapper = memo(({ setOriginalDatesObj }: Props) => {
  const { isExifLoading } = useSelector(upload)

  const { isUploadingPage } = useCurrentPage()
  const { selectedDates } = useSelectedDateList()
  const { selectedFiles } = useSelectedFilesList()
  const { updateUploadingFiles } = useUpdateFields(selectedFiles)

  const [loading, setLoading] = useState(false)
  const [applyAllDatesTrigger, setApplyAllDatesTrigger] = useState<DataType | null>(null)
  const [timeDiffConfig, setTimeDiffConfig] = useState<TimeDiffConfig | null>(null)
  const [pasteTimeDiffTrigger, setPasteTimeDiffTrigger] = useState(false)

  const loaderDelay = selectedDates.length > NUMBER_OF_SELECTED_FILES_TO_SHOW_LOADER ? 100 : 0

  const setTimeDiffWithLoading = useCallback(
    (timeDiffConfig: TimeDiffConfig | null) => {
      setLoading(true)
      setTimeout(() => {
        setTimeDiffConfig(timeDiffConfig)
        successMessage('Copied successfully')
        setLoading(false)
      }, loaderDelay)
    },
    [loaderDelay]
  )

  const timeDiff = useMemo(
    (): TimeDiff => ({
      timeDiffConfig,
      copyTimeDiff: setTimeDiffWithLoading,
      pasteTimeDiffTrigger,
    }),
    [pasteTimeDiffTrigger, setTimeDiffWithLoading, timeDiffConfig]
  )

  useEffect(() => {
    selectedDates.length && isUploadingPage && updateUploadingFiles('_', true)
  }, [isUploadingPage, selectedDates.length, updateUploadingFiles])

  const setOriginalDate = useCallback(
    (originalDate: string | null, tempPath: string) => {
      setOriginalDatesObj(prevObj => ({ ...prevObj, [tempPath]: originalDate }))
    },
    [setOriginalDatesObj]
  )

  const setApplyAllDatesTriggerWithLoading = (dataType: DataType | null) => () => {
    setLoading(true)
    setTimeout(() => {
      setApplyAllDatesTrigger(dataType)
      setTimeout(() => {
        successMessage('Dates applied successfully')
        setLoading(false)
      }, loaderDelay)
    }, loaderDelay)
  }

  const handlePasteTimeDiffToWholeList = () => {
    setLoading(true)
    setTimeout(() => {
      setPasteTimeDiffTrigger(true)
      setTimeout(() => {
        successMessage('Durations applied successfully')
        setPasteTimeDiffTrigger(false)
        setLoading(false)
      }, loaderDelay)
    }, loaderDelay)
  }

  return (
    <Spin spinning={loading || isExifLoading}>
      <div className="d-flex gap-10">
        <Button type="primary" onClick={setApplyAllDatesTriggerWithLoading('change')}>
          Apply all change dates
        </Button>
        <Button type="primary" onClick={setApplyAllDatesTriggerWithLoading('original')}>
          Apply all original dates
        </Button>
        <Button
          icon={<FileDoneOutlined />}
          onClick={handlePasteTimeDiffToWholeList}
          disabled={!Boolean(timeDiffConfig)}
        >
          Paste time difference to whole list
        </Button>
      </div>

      {selectedDates.map(({ changeDate, originalDate }, idx) => (
        <TDModalItem
          key={idx}
          name={selectedFiles[idx].name}
          preview={selectedFiles[idx].preview}
          changeDate={changeDate}
          originalDate={originalDate}
          tempPath={selectedFiles[idx].tempPath}
          applyAllDatesTrigger={applyAllDatesTrigger}
          timeDiff={timeDiff}
          setOriginalDate={setOriginalDate}
        />
      ))}
      <Divider />
    </Spin>
  )
})
