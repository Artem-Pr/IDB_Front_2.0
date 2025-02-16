import React, {
  memo, useCallback, useMemo, useState,
} from 'react'
import { useSelector } from 'react-redux'

import { FileDoneOutlined } from '@ant-design/icons'
import { Button, Divider, Spin } from 'antd'

import type { Media } from 'src/api/models/media'
import { successMessage } from 'src/app/common/notifications'
import { selectedDateList, selectedFilesList } from 'src/redux/selectors'

import type { OriginalDates } from '../../hooks/useUpdateOriginalDate'
import { TDModalItem } from '../TDModalItem'
import type { DataType } from '../TDModalItem/TDModalItem'

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
  const selectedDates = useSelector(selectedDateList)
  const selectedFiles = useSelector(selectedFilesList)

  const [loading, setLoading] = useState(false)
  const [applyAllDatesTrigger, setApplyAllDatesTrigger] = useState<DataType | null>(null)
  const [timeDiffConfig, setTimeDiffConfig] = useState<TimeDiffConfig | null>(null)
  const [pasteTimeDiffTrigger, setPasteTimeDiffTrigger] = useState(false)

  const loaderDelay = selectedDates.length > NUMBER_OF_SELECTED_FILES_TO_SHOW_LOADER ? 100 : 0

  const setTimeDiffWithLoading = useCallback(
    (newTimeDiffConfig: TimeDiffConfig | null) => {
      setLoading(true)
      setTimeout(() => {
        setTimeDiffConfig(newTimeDiffConfig)
        successMessage('Copied successfully')
        setLoading(false)
      }, loaderDelay)
    },
    [loaderDelay],
  )

  const timeDiff = useMemo(
    (): TimeDiff => ({
      timeDiffConfig,
      copyTimeDiff: setTimeDiffWithLoading,
      pasteTimeDiffTrigger,
    }),
    [pasteTimeDiffTrigger, setTimeDiffWithLoading, timeDiffConfig],
  )

  const setOriginalDate = useCallback(
    (originalDate: string | null, id: Media['id']) => {
      setOriginalDatesObj(prevObj => ({ ...prevObj, [id]: originalDate }))
    },
    [setOriginalDatesObj],
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
    <Spin spinning={loading}>
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
          disabled={!timeDiffConfig}
        >
          Paste time difference to whole list
        </Button>
      </div>

      {selectedDates.map(({ changeDate, originalDate }, idx) => (
        <TDModalItem
          applyAllDatesTrigger={applyAllDatesTrigger}
          changeDate={changeDate}
          key={selectedFiles[idx].id}
          mediaFile={selectedFiles[idx]}
          originalDate={originalDate}
          setOriginalDate={setOriginalDate}
          timeDiff={timeDiff}
        />
      ))}
      <Divider />
    </Spin>
  )
})
