import React, { useEffect, useMemo, useState } from 'react'
import { Form, Input, Button, DatePicker, Space, Modal, Select } from 'antd'
import moment from 'moment'
import { curry, identity, isEmpty, sortBy } from 'ramda'

import styles from './index.module.scss'
import { UploadingObject } from '../../../redux/types'
import { dateFormat, getLastItem, getNameParts, removeEmptyFields } from '../../common/utils'
import { useEditFilesArr } from '../../common/hooks'

const { Option } = Select

interface Props {
  filesArr: UploadingObject[]
  selectedList: number[]
  loading: boolean
  sameKeywords: string[]
  allKeywords: string[]
  isEditMany?: boolean
  selectAll?: () => void
  clearAll?: () => void
}

interface InitialFileObject {
  name: string
  originalDate: string
  keywords: string[]
}

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
}

const initialFileObject: InitialFileObject = {
  name: '-',
  originalDate: '',
  keywords: [],
}

const config = {
  title: 'Duplicate names',
  content: 'Please enter another name',
}

const EditMenu = ({
  filesArr,
  selectedList,
  sameKeywords,
  isEditMany,
  selectAll,
  clearAll,
  loading,
  allKeywords,
}: Props) => {
  const [form] = Form.useForm()
  const [modal, contextHolder] = Modal.useModal()
  const [isSelectAllBtn, setIsSelectAllBtn] = useState(true)
  const editUploadingFiles = useEditFilesArr(selectedList, filesArr, sameKeywords)
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
    })
  }, [form, shortName, originalDate, sameKeywords])

  const onFinish = ({ name, originalDate, keywords }: any) => {
    const isDuplicateName = curry((filesArr: UploadingObject[], currentName: string) => {
      const fileArrNames = filesArr.map(({ name }) => name)
      return fileArrNames.includes(currentName)
    })(filesArr)

    const updateValues = () => {
      const preparedValue = {
        name: name ? name + ext : '',
        originalDate: originalDate ? moment(originalDate).format(dateFormat) : null,
        keywords,
      }
      const editedFields = removeEmptyFields(preparedValue)
      !isEmpty(editedFields) && editUploadingFiles(editedFields)
    }

    const needModalIsDuplicate = !isEditMany && isDuplicateName(name + ext)

    needModalIsDuplicate ? modal.warning(config) : updateValues()
  }

  const handleSelectAll = () => {
    isSelectAllBtn && selectAll && selectAll()
    !isSelectAllBtn && clearAll && clearAll()
    setIsSelectAllBtn(!isSelectAllBtn)
  }

  return (
    <div>
      <Form {...layout} form={form} name="editForm" onFinish={onFinish}>
        <Form.Item className={styles.item} label="Name" name="name">
          <Space className={styles.space}>
            <Form.Item name="name" noStyle>
              <Input placeholder="Edit name" disabled={disabledInputs} allowClear />
            </Form.Item>
            <span className={styles.extension}>{ext}</span>
          </Space>
        </Form.Item>
        <Form.Item className={styles.item} label="OriginalDate" name="originalDate">
          <DatePicker
            format={dateFormat}
            className={styles.itemWidth}
            placeholder="Edit date"
            disabled={disabledInputs}
          />
        </Form.Item>
        <Form.Item className={styles.item} label="Keywords" name="keywords">
          <Select className={styles.keywords} mode="tags" placeholder="Edit keywords" disabled={disabledInputs}>
            {allKeywords &&
              allKeywords.map(keyword => (
                <Option key={keyword} value={keyword}>
                  {keyword}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item className={styles.item} {...tailLayout}>
          <Space>
            <Form.Item>
              <Button style={{ marginRight: 10 }} type="primary" htmlType="submit" disabled={disabledInputs}>
                Edit
              </Button>
              {isEditMany ? (
                <Button onClick={handleSelectAll} type="primary" loading={loading}>
                  {isSelectAllBtn ? 'Select all' : 'Unselect all'}
                </Button>
              ) : (
                ''
              )}
            </Form.Item>
          </Space>
        </Form.Item>
      </Form>
      {contextHolder}
    </div>
  )
}

export default EditMenu
