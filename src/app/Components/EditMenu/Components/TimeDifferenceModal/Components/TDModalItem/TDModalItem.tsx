import { Button, DatePicker, Divider, Form, Tooltip } from 'antd'
import React, { memo, useCallback, useEffect, useState } from 'react'
import cn from 'classnames'

import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

import { DiffOutlined, FileDoneOutlined, RightOutlined } from '@ant-design/icons'

import styles from './TDModalItem.module.scss'
import { dateTimeFormat } from '../../../../../../common/utils/date'
import { CopyToClipboard } from '../../../../../CopyToClipboard'
import { TimeDifference } from '../TimeDifference'
import type { TimeDiff, TimeDiffConfig } from '../TDModalMapper/TDModalMapper'
import { UIKitBtn } from '../../../../../UIKit'

export type DataType = 'original' | 'change'

interface Props {
  changeDate: number
  originalDate: string
  name: string
  preview: string
  tempPath: string
  applyAllDatesTrigger: DataType | null
  timeDiff: TimeDiff
  setOriginalDate: (originalDate: string | null, tempPath: string) => void
}

export const TDModalItem = memo(
  ({
    preview,
    name,
    changeDate,
    originalDate,
    tempPath,
    applyAllDatesTrigger,
    timeDiff: { timeDiffConfig, copyTimeDiff, pasteTimeDiffTrigger },
    setOriginalDate,
  }: Props) => {
    const [currentDate, setCurrentDate] = useState<Dayjs | null>(null)
    const [dateType, setDataType] = useState<DataType | null>(null)

    useEffect(() => {
      const setDate = () => {
        const dayjsDate = dayjs(applyAllDatesTrigger === 'change' ? changeDate : originalDate)
        const formattedDate = dayjsDate.format(dateTimeFormat)
        setOriginalDate(formattedDate, tempPath)
        setCurrentDate(dayjsDate)
        setDataType(applyAllDatesTrigger)
      }

      applyAllDatesTrigger && setDate()
    }, [applyAllDatesTrigger, changeDate, originalDate, setOriginalDate, tempPath])

    const setChangeDate = (changeDate: number) => () => {
      const dayjsDate = dayjs(changeDate)
      const formattedDate = dayjsDate.format(dateTimeFormat)
      setOriginalDate(formattedDate, tempPath)
      setCurrentDate(dayjsDate)
      setDataType('change')
    }

    const setCurrentOriginalDate = (originalDate: string) => () => {
      setOriginalDate(originalDate, tempPath)
      setCurrentDate(dayjs(originalDate))
      setDataType('original')
    }

    const setDayjsDate = (dayjsDate: Dayjs | null) => {
      setOriginalDate(dayjsDate ? dayjsDate.format(dateTimeFormat) : null, tempPath)
      setCurrentDate(dayjsDate)
    }

    const getDefaultDate = useCallback(
      (curDateType?: DataType) => {
        const newDateType = curDateType || dateType
        const currentChangeDate = newDateType === 'change' && Boolean(changeDate) && dayjs(changeDate)
        const currentOriginalDate = newDateType === 'original' && Boolean(originalDate) && dayjs(originalDate)
        return currentChangeDate || currentOriginalDate
      },
      [changeDate, dateType, originalDate]
    )

    const handleDurationChange = useCallback(
      (durationMilliseconds: number) => {
        const setDuration = (defaultDate: Dayjs) => {
          const newCurrentDate = defaultDate.add(durationMilliseconds)
          setOriginalDate(newCurrentDate.format(dateTimeFormat), tempPath)
          setCurrentDate(newCurrentDate)
        }

        const defaultDate = getDefaultDate()
        defaultDate && setDuration(defaultDate)
      },
      [getDefaultDate, setOriginalDate, tempPath]
    )

    const handleCopyTimeDiff = () => {
      const copy = (defaultDate: Dayjs, currentDate: Dayjs) => {
        const timeDifference = currentDate.diff(defaultDate)
        copyTimeDiff({
          dateType,
          timeDifference,
        })
      }

      const defaultDate = getDefaultDate()
      currentDate && defaultDate && copy(defaultDate, currentDate)
    }

    const handleSetTimeDiffConfig = useCallback(() => {
      const setTimeDiff = (defaultDate: Dayjs, timeDiffConfig: TimeDiffConfig) => {
        const newCurrentDate = defaultDate.add(timeDiffConfig.timeDifference)

        setDataType(timeDiffConfig.dateType)
        setOriginalDate(newCurrentDate.format(dateTimeFormat), tempPath)
        setCurrentDate(newCurrentDate)
      }

      const defaultDate = getDefaultDate(timeDiffConfig?.dateType || undefined)
      defaultDate && timeDiffConfig && setTimeDiff(defaultDate, timeDiffConfig)
    }, [getDefaultDate, setOriginalDate, tempPath, timeDiffConfig])

    useEffect(() => {
      const setConfig = () => handleSetTimeDiffConfig()

      pasteTimeDiffTrigger && setConfig()
    }, [handleSetTimeDiffConfig, pasteTimeDiffTrigger])

    return (
      <>
        <Divider />
        <div className="d-flex align-items-center">
          <div className={cn(styles.imageContainer, 'd-flex flex-column align-items-center')}>
            <img className={styles.image} src={preview} alt={name} />
            <span>{name}</span>
          </div>
          <div>
            <div className="d-flex gap-10 align-items-baseline">
              <Form.Item label="Change date" className="margin-bottom-10 form-label-nowrap">
                <DatePicker format={dateTimeFormat} value={dayjs(changeDate)} showTime disabled />
              </Form.Item>
              <CopyToClipboard text={changeDate} />
              <UIKitBtn
                className="margin-left-20"
                isSuccess={dateType === 'change'}
                type="primary"
                icon={<RightOutlined />}
                onClick={setChangeDate(changeDate)}
              />
            </div>
            <div className="d-flex gap-10 align-items-baseline">
              <Form.Item className="margin-bottom-0 form-label-nowrap" label="Original date">
                <DatePicker format={dateTimeFormat} value={dayjs(originalDate)} showTime disabled />
              </Form.Item>
              <CopyToClipboard text={originalDate} />
              <UIKitBtn
                className="margin-left-20"
                isSuccess={dateType === 'original'}
                type="primary"
                icon={<RightOutlined />}
                onClick={setCurrentOriginalDate(originalDate)}
              />
            </div>
          </div>
          <div className="margin-left-20">
            <div className="d-flex gap-10">
              <Form.Item
                className={cn(styles.label, 'margin-bottom-10 form-label-nowrap')}
                label="Result original date"
              >
                <DatePicker format={dateTimeFormat} value={currentDate} onChange={setDayjsDate} showTime />
              </Form.Item>
              <CopyToClipboard text={dayjs(currentDate).format(dateTimeFormat)} disabled={!currentDate} />
              <Tooltip title="Copy time difference">
                <Button icon={<DiffOutlined />} disabled={!currentDate} onClick={handleCopyTimeDiff} />
              </Tooltip>
              <Tooltip title="Paste time difference">
                <Button icon={<FileDoneOutlined />} onClick={handleSetTimeDiffConfig} disabled={!timeDiffConfig} />
              </Tooltip>
            </div>

            <div className="d-flex gap-10">
              <Form.Item className="margin-bottom-10" label="Change time difference">
                <TimeDifference
                  dateTime1={dayjs(changeDate).format(dateTimeFormat)}
                  dateTime2={currentDate ? dayjs(currentDate).format(dateTimeFormat) : null}
                  disabled={!currentDate || dateType !== 'change'}
                  onChange={durationMilliseconds => handleDurationChange(durationMilliseconds)}
                />
              </Form.Item>
            </div>
            <div className="d-flex gap-10">
              <Form.Item className="margin-bottom-0" label="Original time difference">
                <TimeDifference
                  dateTime1={originalDate}
                  dateTime2={currentDate ? dayjs(currentDate).format(dateTimeFormat) : null}
                  disabled={!currentDate || dateType !== 'original'}
                  onChange={durationMilliseconds => handleDurationChange(durationMilliseconds)}
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </>
    )
  }
)
