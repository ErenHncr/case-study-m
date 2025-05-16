import React from "react"
import { Button, Flex, Form, Input, InputNumber, Select } from "antd"
import { UndoOutlined } from "@ant-design/icons"

import { formValidateMessages } from "../../lib/antd"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  getProductsCategories,
  selectProductsCategories,
  type Product,
} from "./productsSlice"

type TProductFormProps = {
  disabled?: boolean
  isLoading: boolean
  initialValues?: Partial<Product>
  submitText?: string
  showUndoBtn?: boolean
  onSubmit: (values: Omit<Product, "id">) => void
}

function ProductForm({
  disabled = false,
  isLoading,
  initialValues = {},
  submitText,
  showUndoBtn = false,
  onSubmit,
}: TProductFormProps) {
  const dispatch = useAppDispatch()
  const productsCategories = useAppSelector(selectProductsCategories)
  const [form] = Form.useForm()

  const productsCategoryOptions = React.useMemo(() => {
    if (Array.isArray(productsCategories.data)) {
      return productsCategories.data.map(category => ({
        value: category,
        label: category,
      }))
    }
    return []
  }, [productsCategories.data])

  React.useEffect(() => {
    if (!productsCategories.isLoading && !productsCategories.isSuccess) {
      void dispatch(getProductsCategories())
    }
    // eslint-disable-next-line
  }, [])

  return (
    <Form
      form={form}
      layout="vertical"
      validateMessages={formValidateMessages}
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.Item
        name={["name"]}
        label="Ürün İsmi"
        rules={[{ required: true }, { min: 3, max: 60 }]}
      >
        <Input
          disabled={disabled || isLoading}
          placeholder="Ürün ismi giriniz"
        />
      </Form.Item>
      <Form.Item
        name={["price"]}
        label="Fiyat (₺)"
        rules={[{ required: true }, { type: "number", min: 1, max: 200000 }]}
      >
        <InputNumber
          disabled={disabled || isLoading}
          placeholder="Fiyat giriniz"
          min={1}
          max={200000}
          style={{ width: "100%" }}
        />
      </Form.Item>
      <Form.Item
        name={["category"]}
        label="Kategori"
        rules={[{ required: true }]}
      >
        <Select
          disabled={disabled || isLoading}
          showSearch
          allowClear
          placeholder="Kategori seçiniz"
          options={productsCategoryOptions}
          notFoundContent="Kategori bulunamadı"
        />
      </Form.Item>
      <Form.Item
        name={["description"]}
        label="Açıklama"
        rules={[{ required: true }, { min: 3, max: 60 }]}
      >
        <Input.TextArea
          disabled={disabled || isLoading}
          placeholder="Açıklama giriniz"
          autoSize={{ minRows: 2, maxRows: 4 }}
        />
      </Form.Item>
      <Flex vertical gap={12} wrap="wrap" style={{ marginTop: 8 }}>
        {showUndoBtn && (
          <Button
            disabled={disabled || isLoading}
            icon={<UndoOutlined />}
            style={{ width: "100%" }}
            onClick={() => {
              form.resetFields()
            }}
            type="default"
          >
            Geri Al
          </Button>
        )}
        <Button
          disabled={disabled}
          loading={isLoading}
          type="primary"
          htmlType="submit"
          style={{ width: "100%" }}
        >
          {submitText ?? "Kaydet"}
        </Button>
      </Flex>
    </Form>
  )
}

export default ProductForm
