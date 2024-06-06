import React, {
  memo, useCallback, useEffect, useState,
} from 'react'

import { DiffOutlined, FileDoneOutlined, RightOutlined } from '@ant-design/icons'
import {
  Button, DatePicker, Divider, Form, Tooltip,
} from 'antd'
import cn from 'classnames'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

import type { Media } from 'src/api/models/media'
import { DATE_TIME_FORMAT } from 'src/app/common/utils/date'
import { CopyToClipboard } from 'src/app/components/CopyToClipboard'
import { UIKitBtn } from 'src/app/components/UIKit'

import type { TimeDiff, TimeDiffConfig } from '../TDModalMapper/TDModalMapper'
import { TimeDifference } from '../TimeDifference'

import styles from './TDModalItem.module.scss'

export type DataType = 'original' | 'change'

interface Props {
  applyAllDatesTrigger: DataType | null
  changeDate: Media['changeDate']
  mediaFile: Media
  originalDate: string
  setOriginalDate: (originalDate: string | null, id: Media['id']) => void
  timeDiff: TimeDiff
}

export const TDModalItem = memo(
  ({
    applyAllDatesTrigger,
    changeDate,
    mediaFile,
    originalDate,
    setOriginalDate,
    timeDiff: { timeDiffConfig, copyTimeDiff, pasteTimeDiffTrigger },
  }: Props) => {
    const [currentDate, setCurrentDate] = useState<Dayjs | null>(null)
    const [dateType, setDataType] = useState<DataType | null>(null)

    useEffect(() => {
      const setDate = () => {
        const dayjsDate = dayjs(applyAllDatesTrigger === 'change' ? changeDate : originalDate)
        const formattedDate = dayjsDate.format(DATE_TIME_FORMAT)
        setOriginalDate(formattedDate, mediaFile.id)
        setCurrentDate(dayjsDate)
        setDataType(applyAllDatesTrigger)
      }

      applyAllDatesTrigger && setDate()
    }, [applyAllDatesTrigger, changeDate, originalDate, setOriginalDate, mediaFile.id])

    const setChangeDate = (newChangeDate: Media['changeDate']) => () => {
      const dayjsDate = dayjs(newChangeDate)
      const formattedDate = dayjsDate.format(DATE_TIME_FORMAT)
      setOriginalDate(formattedDate, mediaFile.id)
      setCurrentDate(dayjsDate)
      setDataType('change')
    }

    const setCurrentOriginalDate = (newOriginalDate: string) => () => {
      setOriginalDate(newOriginalDate, mediaFile.id)
      setCurrentDate(dayjs(newOriginalDate))
      setDataType('original')
    }

    const setDayjsDate = (dayjsDate: Dayjs | null) => {
      setOriginalDate(dayjsDate ? dayjsDate.format(DATE_TIME_FORMAT) : null, mediaFile.id)
      setCurrentDate(dayjsDate)
    }

    const getDefaultDate = useCallback(
      (curDateType?: DataType) => {
        const newDateType = curDateType || dateType
        const currentChangeDate = newDateType === 'change' && Boolean(changeDate) && dayjs(changeDate)
        const currentOriginalDate = newDateType === 'original' && Boolean(originalDate) && dayjs(originalDate)
        return currentChangeDate || currentOriginalDate
      },
      [changeDate, dateType, originalDate],
    )

    const handleDurationChange = useCallback(
      (durationMilliseconds: number) => {
        const setDuration = (defaultDate: Dayjs) => {
          const newCurrentDate = defaultDate.add(durationMilliseconds)
          setOriginalDate(newCurrentDate.format(DATE_TIME_FORMAT), mediaFile.id)
          setCurrentDate(newCurrentDate)
        }

        const defaultDate = getDefaultDate()
        defaultDate && setDuration(defaultDate)
      },
      [getDefaultDate, setOriginalDate, mediaFile.id],
    )

    const handleCopyTimeDiff = () => {
      const copy = (defaultDate: Dayjs, newCurrentDate: Dayjs) => {
        const timeDifference = newCurrentDate.diff(defaultDate)
        copyTimeDiff({
          dateType,
          timeDifference,
        })
      }

      const defaultDate = getDefaultDate()
      currentDate && defaultDate && copy(defaultDate, currentDate)
    }

    const handleSetTimeDiffConfig = useCallback(() => {
      const setTimeDiff = (defaultDate: Dayjs, newTimeDiffConfig: TimeDiffConfig) => {
        const newCurrentDate = defaultDate.add(newTimeDiffConfig.timeDifference)

        setDataType(newTimeDiffConfig.dateType)
        setOriginalDate(newCurrentDate.format(DATE_TIME_FORMAT), mediaFile.id)
        setCurrentDate(newCurrentDate)
      }

      const defaultDate = getDefaultDate(timeDiffConfig?.dateType || undefined)
      defaultDate && timeDiffConfig && setTimeDiff(defaultDate, timeDiffConfig)
    }, [getDefaultDate, setOriginalDate, mediaFile.id, timeDiffConfig])

    useEffect(() => {
      const setConfig = () => handleSetTimeDiffConfig()

      pasteTimeDiffTrigger && setConfig()
    }, [handleSetTimeDiffConfig, pasteTimeDiffTrigger])

    return (
      <>
        <Divider />
        <div className="d-flex align-items-center">
          <div className={cn(styles.imageContainer, 'd-flex flex-column align-items-center')}>
            <img className={styles.image} src={mediaFile.staticPreview} alt={mediaFile.originalName} />
            <span>{mediaFile.originalName}</span>
          </div>
          <div>
            <div className="d-flex gap-10 align-items-baseline">
              <Form.Item label="Change date" className="margin-bottom-10 form-label-nowrap">
                <DatePicker format={DATE_TIME_FORMAT} value={dayjs(changeDate)} showTime disabled />
              </Form.Item>
              <CopyToClipboard text={changeDate} />
              <UIKitBtn
                className="margin-left-20"
                icon={<RightOutlined />}
                isSuccess={dateType === 'change'}
                onClick={setChangeDate(changeDate)}
                type="primary"
              />
            </div>
            <div className="d-flex gap-10 align-items-baseline">
              <Form.Item className="margin-bottom-0 form-label-nowrap" label="Original date">
                <DatePicker format={DATE_TIME_FORMAT} value={dayjs(originalDate)} showTime disabled />
              </Form.Item>
              <CopyToClipboard text={originalDate} />
              <UIKitBtn
                className="margin-left-20"
                icon={<RightOutlined />}
                isSuccess={dateType === 'original'}
                onClick={setCurrentOriginalDate(originalDate)}
                type="primary"
              />
            </div>
          </div>
          <div className="margin-left-20">
            <div className="d-flex gap-10">
              <Form.Item
                className={cn(styles.label, 'margin-bottom-10 form-label-nowrap')}
                label="Result original date"
              >
                <DatePicker format={DATE_TIME_FORMAT} value={currentDate} onChange={setDayjsDate} showTime />
              </Form.Item>
              <CopyToClipboard
                text={dayjs(currentDate)
                  .format(DATE_TIME_FORMAT)}
                disabled={!currentDate}
              />
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
                  dateTime1={dayjs(changeDate)
                    .format(DATE_TIME_FORMAT)}
                  dateTime2={currentDate
                    ? dayjs(currentDate)
                      .format(DATE_TIME_FORMAT)
                    : null}
                  disabled={!currentDate || dateType !== 'change'}
                  onChange={durationMilliseconds => handleDurationChange(durationMilliseconds)}
                />
              </Form.Item>
            </div>
            <div className="d-flex gap-10">
              <Form.Item className="margin-bottom-0" label="Original time difference">
                <TimeDifference
                  dateTime1={originalDate}
                  dateTime2={currentDate
                    ? dayjs(currentDate)
                      .format(DATE_TIME_FORMAT)
                    : null}
                  disabled={!currentDate || dateType !== 'original'}
                  onChange={durationMilliseconds => handleDurationChange(durationMilliseconds)}
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </>
    )
  },
)
