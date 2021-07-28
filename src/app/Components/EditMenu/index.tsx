import React, { useEffect, useMemo, useState } from 'react'
import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { curry, identity, isEmpty, sortBy } from 'ramda'
import cn from 'classnames'

import styles from './index.module.scss'
import { ExtraDownloadingFields, UpdatedObject, UploadingObject } from '../../../redux/types'
import {
  dateFormat,
  getFilesWithUpdatedKeywords,
  getLastItem,
  getNameParts,
  getRenamedObjects,
  removeEmptyFields,
  removeIntersectingKeywords,
} from '../../common/utils'
import { useEditFilesArr } from '../../common/hooks'
import { updatePhotos } from '../../../redux/reducers/mainPageSlice-reducer'

const { Option } = Select

interface Props {
  filesArr: Array<UploadingObject & ExtraDownloadingFields>
  selectedList: number[]
  isExifLoading: boolean
  sameKeywords: string[]
  allKeywords: string[]
  isEditMany?: boolean
  selectAll?: () => void
  clearAll?: () => void
  isMainPage: boolean
}

type CheckboxType = 'isName' | 'isOriginalDate' | 'isKeywords'
type Checkboxes = Record<CheckboxType, boolean>

interface InitialFileObject extends Checkboxes {
  name: string
  originalDate: string
  keywords: string[]
}

const initialFileObject: InitialFileObject = {
  name: '-',
  originalDate: '',
  keywords: [],
  isName: false,
  isOriginalDate: false,
  isKeywords: false,
}

const duplicateConfig = {
  title: 'Duplicate names',
  content: 'Please enter another name',
}

const emptyCheckboxesConfig = {
  title: 'Nothing to edit',
  content: 'Please check one of the checkboxes',
}

const EditMenu = ({
  filesArr,
  selectedList,
  sameKeywords,
  isEditMany,
  selectAll,
  clearAll,
  isExifLoading,
  allKeywords,
  isMainPage,
}: Props) => {
  const [form] = Form.useForm()
  const [modal, contextHolder] = Modal.useModal()
  const dispatch = useDispatch()
  const [isSelectAllBtn, setIsSelectAllBtn] = useState(true)
  const editUploadingFiles = useEditFilesArr(selectedList, filesArr, sameKeywords, isMainPage)
  const { name, originalDate } = useMemo<UploadingObject | InitialFileObject>(
    () => (!selectedList.length ? initialFileObject : filesArr[getLastItem(selectedList)]),
    [filesArr, selectedList]
  )
  const disabledInputs = useMemo(() => !selectedList.length, [selectedList])
  const { shortName, ext } = useMemo(() => getNameParts(name), [name])

  useEffect(() => {
    !selectedList.length && setIsSelectAllBtn(true)
    selectedList.length === filesArr.length && setIsSelectAllBtn(false)
  }, [selectedList.length, filesArr.length])

  useEffect(() => {
    form.setFieldsValue({
      name: shortName,
      originalDate: originalDate === '-' ? '' : moment(originalDate, dateFormat),
      keywords: sortBy(identity, sameKeywords || []),
      isName: false,
      isOriginalDate: false,
      isKeywords: false,
    })
  }, [form, shortName, originalDate, sameKeywords])

  const fetchUpdatedFiles = (
    currentName: string,
    currentOriginalDate: string | null,
    keywords: string[],
    checkboxes: Checkboxes
  ) => {
    const selectedFiles = filesArr
      .filter((_, idx) => selectedList.includes(idx))
      .map(({ _id, keywords }) => ({
        _id,
        keywords,
        name: currentName,
      }))
    const newNamesArr: string[] = getRenamedObjects(selectedFiles).map(({ name }) => name)
    const selectedFilesWithoutSameKeywords = removeIntersectingKeywords(sameKeywords, selectedFiles)
    const newKeywordsArr: string[][] = getFilesWithUpdatedKeywords(selectedFilesWithoutSameKeywords, keywords).map(
      ({ keywords }) => keywords || []
    )

    const getUpdatedFields = (idx: number) => {
      const { isName, isOriginalDate, isKeywords } = checkboxes
      return {
        originalName: isName && !newNamesArr[idx].startsWith('-') ? newNamesArr[idx] : undefined,
        originalDate: (isOriginalDate && currentOriginalDate) || undefined,
        keywords: isKeywords ? newKeywordsArr[idx] : undefined,
      }
    }
    const updatedFiles: UpdatedObject[] = selectedFiles.map(({ _id }, i) => ({
      id: _id || '',
      updatedFields: getUpdatedFields(i),
    }))

    updatedFiles.length && dispatch(updatePhotos(updatedFiles))
  }

  const onFinish = ({ name, originalDate, keywords, isName, isOriginalDate, isKeywords }: any) => {
    const currentName = name ? name + ext : ''
    const currentOriginalDate = originalDate ? moment(originalDate).format(dateFormat) : null
    const isDuplicateName = curry((filesArr: UploadingObject[], currentName: string) => {
      const fileArrNames = filesArr.map(({ name }) => name)
      return fileArrNames.includes(currentName)
    })(filesArr)

    const updateValues = () => {
      const preparedValue = {
        name: isName ? currentName : undefined,
        originalDate: isOriginalDate ? currentOriginalDate : undefined,
        keywords: isKeywords ? keywords : sortBy(identity, sameKeywords || []),
      }

      const checkboxes: Checkboxes = { isName, isOriginalDate, isKeywords }

      isMainPage && fetchUpdatedFiles(currentName, currentOriginalDate, keywords, checkboxes)
      const editedFields = removeEmptyFields(preparedValue)
      !isEmpty(editedFields) && editUploadingFiles(editedFields)
    }

    const needModalIsDuplicate = !isEditMany && isName && isDuplicateName(name + ext)
    const isEmptyCheckboxes = !isName && !isOriginalDate && !isKeywords
    needModalIsDuplicate && modal.warning(duplicateConfig)
    isEmptyCheckboxes && modal.warning(emptyCheckboxesConfig)
    !needModalIsDuplicate && !isEmptyCheckboxes && updateValues()
  }

  const handleSelectAll = () => {
    isSelectAllBtn && selectAll && selectAll()
    !isSelectAllBtn && clearAll && clearAll()
    setIsSelectAllBtn(!isSelectAllBtn)
  }

  return (
    <div>
      <Form form={form} name="editForm" onFinish={onFinish}>
        <Row className={styles.item} gutter={10}>
          <Col span={8} offset={1} style={{ textAlign: 'left' }}>
            <Form.Item name="isName" valuePropName="checked">
              <Checkbox>Name:</Checkbox>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="name">
              <Input placeholder="Edit name" disabled={disabledInputs} allowClear />
            </Form.Item>
          </Col>
          <Col span={3}>
            <span className={cn(styles.extension, 'd-block')}>{ext}</span>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col span={8} offset={1} style={{ textAlign: 'left' }}>
            <Form.Item name="isOriginalDate" valuePropName="checked">
              <Checkbox>OriginalDate:</Checkbox>
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item name="originalDate">
              <DatePicker format={dateFormat} placeholder="Edit date" disabled={disabledInputs} className="w-100" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col span={8} offset={1} style={{ textAlign: 'left' }}>
            <Form.Item name="isKeywords" valuePropName="checked">
              <Checkbox>Keywords:</Checkbox>
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item name="keywords">
              <Select className={styles.keywords} mode="tags" placeholder="Edit keywords" disabled={disabledInputs}>
                {allKeywords &&
                  allKeywords.map(keyword => (
                    <Option key={keyword} value={keyword}>
                      {keyword}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col span={7} offset={9}>
            <Form.Item>
              <Button
                className="w-100"
                style={{ marginRight: 10 }}
                type="primary"
                htmlType="submit"
                disabled={disabledInputs}
              >
                Edit
              </Button>
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item>
              {isEditMany ? (
                <Button className="w-100" onClick={handleSelectAll} type="primary" loading={isExifLoading}>
                  {isSelectAllBtn ? 'Select all' : 'Unselect all'}
                </Button>
              ) : (
                ''
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {contextHolder}
    </div>
  )
}

export default EditMenu
