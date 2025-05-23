import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react'
import { useSelector } from 'react-redux'

import { CopyOutlined, DiffFilled, DiffOutlined } from '@ant-design/icons'
import {
  AutoComplete, Button, Checkbox, Form, Input, Modal, Rate, Select, DatePicker,
} from 'antd'
import cn from 'classnames'
import type { Dayjs } from 'dayjs'
import { identity, sortBy } from 'ramda'

import type { Media, MediaChangeable } from 'src/api/models/media'
import { warningMessage } from 'src/app/common/notifications'
import { dayjsWithoutTimezone } from 'src/app/common/utils/date'
import { deleteConfirmation } from 'src/assets/config/moduleConfig'
import { DATE_TIME_FORMAT_WITH_MS, DEFAULT_TIME_STAMP } from 'src/constants/dateConstants'
import { getFolderReducerKeywordsList, getFolderReducerPathsArrOptionsSelector } from 'src/redux/reducers/foldersSlice/selectors'
import { getMainPageReducerIsDeleteProcessing, getMainPageReducerIsGalleryLoading } from 'src/redux/reducers/mainPageSlice/selectors'
import { removeSelectedFilesFromMainPage } from 'src/redux/reducers/mainPageSlice/thunks'
import { getSessionReducerIsCurrentPage } from 'src/redux/reducers/sessionSlice/selectors'
import { removeSelectedFilesFromUploadState } from 'src/redux/reducers/uploadSlice/thunks'
import {
  getSameKeywords,
  getCurrentFilesArr,
  getCurrentSelectedList,
} from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'
import type { Checkboxes } from 'src/redux/types'

import {
  useClearSelectedList,
  useFinishEdit,
  useSelectAll,
} from '../../common/hooks'
import {
  copyToClipboard,
  getFilePathWithoutName,
  getLastItem,
  getNameParts,
  isVideoByExt,
} from '../../common/utils'
import DescriptionAutoComplete from '../DescriptionAutoComplete/DescriptionAutoComplete'
import { UIKitBtn } from '../UIKit'

import { mediaFields } from './EditMenuConfig'
import { TimeDifferenceModal } from './components'

import styles from './EditMenu.module.scss'

const CLIPBOARD_TEXT_SPLITTER = ', '

interface Props {
  isEditMany?: boolean
}

export interface InitialFormData extends Checkboxes, Omit<MediaChangeable, 'originalName' | 'filePath' | 'originalDate' | 'exif'> {
  originalName: string
  filePath: string
  originalDate: Dayjs | null
}

const initialFormData: InitialFormData = {
  rating: 0,
  originalName: '-',
  originalDate: null,
  filePath: '',
  keywords: [],
  description: '',
  timeStamp: DEFAULT_TIME_STAMP,
  isName: false,
  isOriginalDate: false,
  isFilePath: false,
  isKeywords: false,
  isDescription: false,
  isRating: false,
  isTimeStamp: false,
}

export const EditMenu = ({ isEditMany }: Props) => {
  const dispatch = useAppDispatch()
  const { selectAll } = useSelectAll()
  const { clearSelectedList } = useClearSelectedList()
  const sameKeywords = useSelector(getSameKeywords)
  const allKeywords = useSelector(getFolderReducerKeywordsList)
  const [form] = Form.useForm<InitialFormData>()
  const [modal, contextHolder] = Modal.useModal()
  const filesArr = useSelector(getCurrentFilesArr)
  const selectedList = useSelector(getCurrentSelectedList)
  const pathsListOptions = useSelector(getFolderReducerPathsArrOptionsSelector)
  const isDeleting = useSelector(getMainPageReducerIsDeleteProcessing)
  const isGalleryLoading = useSelector(getMainPageReducerIsGalleryLoading)
  const { isMainPage } = useSelector(getSessionReducerIsCurrentPage)
  const [isSelectAllBtn, setIsSelectAllBtn] = useState(true)

  const {
    originalName, originalDate, rating, description, timeStamp,
  } = useMemo<
  Media | InitialFormData
  >(() => (!selectedList.length ? initialFormData : filesArr[getLastItem(selectedList)]), [filesArr, selectedList])

  const disabledInputs = useMemo(() => !selectedList.length, [selectedList])
  const { shortName, ext, extWithoutDot } = useMemo(() => getNameParts(originalName), [originalName])
  const keywordsOptions = useMemo(() => allKeywords.map(keyword => ({ value: keyword, label: keyword })), [allKeywords])
  const { onFinish } = useFinishEdit({
    ext,
    filesArr,
    modal,
    originalName,
    sameKeywords,
    selectedList,
  })
  const isVideoFile = useMemo(() => isVideoByExt(extWithoutDot || ''), [extWithoutDot])

  const lastSelectedElemFilePath = useMemo(() => {
    const filePath = filesArr[getLastItem(selectedList)]?.filePath || ''
    return getFilePathWithoutName(filePath)
  }, [filesArr, selectedList])

  useEffect(() => {
    const currentFilePath = form.getFieldValue('filePath') as string
    const isFilePathChanged = lastSelectedElemFilePath !== currentFilePath
    isFilePathChanged && form.setFieldsValue({ filePath: lastSelectedElemFilePath })
  }, [form, lastSelectedElemFilePath])

  useEffect(() => {
    !selectedList.length && setIsSelectAllBtn(true)
    selectedList.length === filesArr.length && setIsSelectAllBtn(false)
  }, [selectedList.length, filesArr.length])

  useEffect(() => {
    form.setFieldsValue({
      rating,
      description,
      originalName: shortName,
      originalDate: originalDate
        ? dayjsWithoutTimezone(originalDate)
        : null,
      timeStamp: isVideoFile ? timeStamp || DEFAULT_TIME_STAMP : undefined,
      keywords: sortBy(identity, sameKeywords || []),
      isName: false,
      isOriginalDate: false,
      isKeywords: false,
      isFilePath: false,
      isTimeStamp: false,
    })
  }, [form, shortName, originalDate, sameKeywords, rating, description, timeStamp, isVideoFile])

  const handleFinish = (values: InitialFormData) => {
    form.setFieldsValue({
      isRating: false,
      isName: false,
      isOriginalDate: false,
      isKeywords: false,
      isFilePath: false,
      isTimeStamp: false,
      isDescription: false,
    })
    onFinish(values)
  }

  const handleSelectAll = useCallback(() => {
    isSelectAllBtn && selectAll()
    !isSelectAllBtn && clearSelectedList()
    setIsSelectAllBtn(!isSelectAllBtn)
  }, [clearSelectedList, isSelectAllBtn, selectAll])

  const showTimeStamp = isMainPage && isVideoFile && !isEditMany

  const refreshTimeStamp = () => form.setFieldsValue({ timeStamp: DEFAULT_TIME_STAMP })

  const handleDelete = () => {
    const onOk = () => {
      isMainPage
        ? dispatch(removeSelectedFilesFromMainPage())
        : dispatch(removeSelectedFilesFromUploadState())
    }
    modal.confirm(deleteConfirmation({ onOk, type: 'file' }))
  }

  const handleCopyKeywords = () => {
    const keywords = form.getFieldValue('keywords') as Array<string>
    if (!keywords.length) return
    copyToClipboard(keywords.join(CLIPBOARD_TEXT_SPLITTER))
  }

  const handlePastKeywords = async () => {
    const text = await navigator.clipboard.readText()
    const splittedText = text.split(CLIPBOARD_TEXT_SPLITTER)
    if (!splittedText.length) {
      warningMessage(new Error(), 'Clipboard is empty')
    }
    const originalKeywords = form.getFieldValue('keywords') as Array<string>
    const uniqueKeywords = Array.from(new Set([...originalKeywords, ...splittedText]))
    form.setFieldsValue({ keywords: uniqueKeywords })
  }

  const handleReplaceKeywords = async () => {
    const text = await navigator.clipboard.readText()
    const splittedText = text.split(CLIPBOARD_TEXT_SPLITTER)
    if (!splittedText.length) {
      warningMessage(new Error(), 'Clipboard is empty')
    }
    form.setFieldsValue({ keywords: splittedText })
  }

  return (
    <div>
      <Form form={form} onFinish={handleFinish} disabled={disabledInputs}>
        <div className="d-flex">
          <Form.Item
            className={styles.checkbox}
            name={mediaFields.rating.checkboxName}
            valuePropName="checked"
          >
            <Checkbox>{mediaFields.rating.label}</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name={mediaFields.rating.name}>
            <Rate />
          </Form.Item>
        </div>

        <div className="d-flex">
          <Form.Item
            className={styles.checkbox}
            name={mediaFields.originalName.checkboxName}
            valuePropName="checked"
          >
            <Checkbox>{mediaFields.originalName.label}</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name={mediaFields.originalName.name}>
            <Input placeholder={mediaFields.originalName.placeholder} allowClear />
          </Form.Item>
          <span className={cn({ [styles.extension]: ext }, 'd-block')}>{ext}</span>
        </div>

        <div className="d-flex">
          <Form.Item
            className={styles.checkbox}
            name={mediaFields.originalDate.checkboxName}
            valuePropName="checked"
          >
            <Checkbox>{mediaFields.originalDate.label}</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name={mediaFields.originalDate.name}>
            <DatePicker
              className="w-100"
              format={DATE_TIME_FORMAT_WITH_MS}
              placeholder={mediaFields.originalDate.placeholder}
              showTime
            />
          </Form.Item>
          <TimeDifferenceModal />
        </div>

        {isMainPage && (
          <div className="d-flex">
            <Form.Item
              className={styles.checkbox}
              name={mediaFields.filePath.checkboxName}
              valuePropName="checked"
            >
              <Checkbox>{mediaFields.filePath.label}</Checkbox>
            </Form.Item>
            <Form.Item className={styles.inputField} name={mediaFields.filePath.name}>
              <AutoComplete
                filterOption={(inputValue, option) => option?.value.toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1}
                options={pathsListOptions}
                placeholder={mediaFields.filePath.placeholder}
              />
            </Form.Item>
          </div>
        )}

        <div className="d-flex">
          <div className={styles.keywords}>
            <Form.Item
              className={styles.checkbox}
              name={mediaFields.keywords.checkboxName}
              valuePropName="checked"
            >
              <Checkbox>{mediaFields.keywords.label}</Checkbox>
            </Form.Item>
            <UIKitBtn
              className="margin-left-20"
              icon={<CopyOutlined />}
              onClick={handleCopyKeywords}
              size="small"
              tooltip="Copy keywords"
              type="primary"
            />
            <UIKitBtn
              className="margin-left-10"
              icon={<DiffOutlined />}
              onClick={handlePastKeywords}
              size="small"
              tooltip="Add copied keywords"
              type="primary"
            />
            <UIKitBtn
              className="margin-left-10"
              icon={<DiffFilled />}
              onClick={handleReplaceKeywords}
              size="small"
              tooltip="Paste and replace keywords"
              type="primary"
            />
          </div>
          <Form.Item className={styles.inputField} name={mediaFields.keywords.name}>
            <Select
              mode="tags"
              options={keywordsOptions}
              placeholder={mediaFields.keywords.placeholder}
            />
          </Form.Item>
        </div>

        <div className="d-flex">
          <Form.Item
            className={styles.checkbox}
            name={mediaFields.description.checkboxName}
            valuePropName="checked"
          >
            <Checkbox>{mediaFields.description.label}</Checkbox>
          </Form.Item>
          <Form.Item className={styles.inputField} name={mediaFields.description.name}>
            <DescriptionAutoComplete
              placeholder={mediaFields.description.placeholder}
              className={styles.inputField}
              textAreaClassName={styles.textArea}
              showCount
            />
          </Form.Item>
        </div>

        {showTimeStamp
          && (
            <div className="d-flex">
              <Form.Item
                className={styles.checkbox}
                name={mediaFields.timeStamp.checkboxName}
                valuePropName="checked"
              >
                <Checkbox>{mediaFields.timeStamp.label}</Checkbox>
              </Form.Item>
              <Form.Item className={styles.inputField} name={mediaFields.timeStamp.name}>
                <Input placeholder={mediaFields.timeStamp.placeholder} />
              </Form.Item>
              <Button className="margin-left-10" onClick={refreshTimeStamp}>
                refresh
              </Button>
            </div>
          )}

        <div className={cn(styles.buttonsWrapper, 'd-flex')}>
          <Form.Item className={styles.button}>
            <Button
              className="w-100"
              htmlType="submit"
              loading={isGalleryLoading}
              type="primary"
            >
                Edit
            </Button>
          </Form.Item>
          {isEditMany && (
            <Form.Item className={styles.button}>
              <Button
                className="w-100"
                onClick={handleSelectAll}
                type="primary"
                loading={isGalleryLoading}
                disabled={false}
              >
                {isSelectAllBtn ? 'Select all' : 'Unselect all'}
              </Button>
            </Form.Item>
          )}
        </div>

        <Form.Item className={styles.deleteButton}>
          <Button
            className="w-100"
            type="primary"
            loading={isDeleting}
            onClick={handleDelete}
            danger
          >
            Delete
          </Button>
        </Form.Item>
      </Form>
      {contextHolder}
    </div>
  )
}
