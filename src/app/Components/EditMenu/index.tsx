import React from 'react'
import { Form, Input, Button, DatePicker } from 'antd'

import styles from './index.module.scss'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 15,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
}

const EditMenu = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values)
  }

  return (
    <Form {...layout} name="basic" onFinish={onFinish}>
      <Form.Item className={styles.item} label="Name" name="name">
        <Input />
      </Form.Item>
      <Form.Item className={styles.item} label="OriginalDate" name="originalDate">
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item className={styles.item} {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default EditMenu
