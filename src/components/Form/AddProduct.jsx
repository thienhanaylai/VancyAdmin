import React, { useState, useEffect } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Upload,
  Space,
  Rate,
  message,
  Image,
  Select,
} from "antd";

import config from "../../../config";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AddProductForm = ({ onSuccess, onCancel, initialData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (initialData) {
      const imageFileList = (initialData.images || []).map((url, index) => ({
        uid: `-${index + 1}`,
        name: `image-${index + 1}.png`,
        status: "done",
        url: url,
      }));

      form.setFieldsValue({
        ...initialData,
        images: imageFileList,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const onFinish = async (values) => {
    setLoading(true);
    message.open({ content: "Đang xử lý...", key: "submit" });

    try {
      const formData = new FormData();
      for (const key in values) {
        if (key === "images") continue;

        // Xử lý trường 'prices' là một mảng object
        if (key === "prices" && Array.isArray(values[key])) {
          values[key].forEach((priceItem, index) => {
            formData.append(`prices[${index}][weight]`, priceItem.weight);
            formData.append(`prices[${index}][price]`, priceItem.price);
          });
        } else {
          // Thêm các trường dữ liệu khác
          formData.append(key, values[key]);
        }
      }

      const fileList = values.images?.fileList || values.images || [];
      const newFilesToUpload = fileList.filter((file) => file.originFileObj);

      newFilesToUpload.forEach((fileInfo) => {
        formData.append("images", fileInfo.originFileObj);
      });

      let response;

      if (initialData) {
        const API_URL = `${config.API_URL}/product/${initialData._id}`;
        response = await fetch(API_URL, {
          method: "PUT",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Cập nhật sản phẩm thất bại");
        }

        message.success({
          content: "Cập nhật sản phẩm thành công!",
          key: "submit",
        });
      } else {
        const API_URL = `${config.API_URL}/product`;
        response = await fetch(API_URL, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Thêm sản phẩm thất bại");
        }

        message.success({
          content: "Thêm sản phẩm thành công!",
          key: "submit",
        });
      }

      const resultProduct = await response.json();

      if (onSuccess) {
        onSuccess(resultProduct);
      }
    } catch (error) {
      console.error("Thất bại:", error);
      message.error({
        content: error.message || "Đã có lỗi xảy ra!",
        key: "submit",
      });
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);
  const formatter = (value) => {
    const [start, end] = `${value}`.split(".") || [];
    const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${end ? `${v}.${end}` : `${v}`}`;
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ prices: [{}], rate: 0, discount: 0 }}
      >
        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[{ required: true }]}
        >
          <Input placeholder="Ví dụ: Bột Trà Xanh Matcha Ceremonial" />
        </Form.Item>

        <Form.Item
          name="images"
          label="Ảnh"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true }]}
        >
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            onPreview={handlePreview}
            maxCount={8}
            multiple={true}
            accept=".png,.jpg,.jpeg"
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item name="ingredient" label="Thành phần">
          <Input.TextArea
            rows={2}
            placeholder="Ví dụ: 100% Bột trà xanh matcha nguyên chất..."
            defaultValue={""}
          />
        </Form.Item>
        <Form.Item name="color" label="Màu sắc">
          <Input placeholder="Ví dụ: Xanh ngọc tự nhiên" defaultValue={""} />
        </Form.Item>
        <Form.Item name="smoothness" label="Độ mịn">
          <Input placeholder="Ví dụ: Cao" defaultValue={""} />
        </Form.Item>
        <Form.Item name="taste" label="Mùi vị">
          <Input
            placeholder="Ví dụ: Thơm đặc trưng mùi trà xanh..."
            defaultValue={""}
          />
        </Form.Item>

        <Form.List name="prices">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "weight"]}
                    rules={[{ required: true, message: "Missing weight" }]}
                  >
                    <Input placeholder="Cân nặng" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "price"]}
                    rules={[{ required: true, message: "Missing price" }]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={formatter}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                      placeholder="Giá tiền"
                    />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm mức giá
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item name="rate" label="Đánh giá sản phẩm">
          <Rate />
        </Form.Item>
        <Form.Item name="catalog" label="Danh mục">
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Chọn danh mục sản phẩm, combo, bán lẻ,..."
            defaultValue={""}
            options={[
              {
                label: "Sản phẩm",
                value: "product",
              },
              {
                label: "Combo",
                value: "combo",
              },
            ]}
          />
        </Form.Item>
        <Form.Item name="discount" label="Giảm giá (%)">
          <InputNumber min={0} max={100} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item>
          <Space align="end">
            <Button type="primary" htmlType="submit" loading={loading}>
              {initialData ? "Lưu thay đổi" : "Thêm sản phẩm"}
            </Button>
            <Button onClick={onCancel}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default AddProductForm;
