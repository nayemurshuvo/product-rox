import { Form, Input, InputNumber, Select, Button } from 'antd';
import styled from 'styled-components';
import type { Product, Category } from '../store/api';

const FormButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  button {
    width: 100%;
  }
`;

interface EditProductFormProps {
  product: Product;
  categories: Category[];
  isLoading?: boolean;
  onSubmit: (values: Partial<Product>) => void;
  onCancel?: () => void;
}

export default function EditProductForm({
  product,
  categories,
  isLoading = false,
  onSubmit,
  onCancel,
}: EditProductFormProps) {
  const [form] = Form.useForm();

  interface FormValues {
    title: string;
    description: string;
    price: number;
    rating: number;
    stock: number;
    category: string;
  }

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      title: values.title,
      description: values.description,
      price: values.price,
      rating: values.rating,
      stock: values.stock,
      category: values.category,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        title: product.title,
        description: product.description,
        price: product.price,
        rating: product.rating,
        stock: product.stock,
        category: product.category,
      }}
      onFinish={handleSubmit}
    >
      {/* Product Title */}
      <Form.Item
        label="Product Title"
        name="title"
        rules={[
          { required: true, message: 'Product title is required' },
          {
            min: 3,
            message: 'Title must be at least 3 characters',
          },
          {
            max: 100,
            message: 'Title must not exceed 100 characters',
          },
        ]}
      >
        <Input placeholder="Enter product title" size="large" />
      </Form.Item>

      {/* Description */}
      <Form.Item
        label="Description"
        name="description"
        rules={[
          { required: true, message: 'Description is required' },
          {
            min: 10,
            message: 'Description must be at least 10 characters',
          },
          {
            max: 500,
            message: 'Description must not exceed 500 characters',
          },
        ]}
      >
        <Input.TextArea
          placeholder="Enter product description"
          rows={4}
          maxLength={500}
          showCount
        />
      </Form.Item>

      {/* Price */}
      <Form.Item
        label="Price ($)"
        name="price"
        rules={[
          { required: true, message: 'Price is required' },
          {
            type: 'number',
            min: 0.01,
            message: 'Price must be greater than 0',
          },
          {
            type: 'number',
            max: 999999,
            message: 'Price must not exceed 999,999',
          },
        ]}
      >
        <InputNumber
          placeholder="0.00"
          precision={2}
          step={0.01}
          min={0}
          style={{ width: '100%' }}
          size="large"
        />
      </Form.Item>

      {/* Rating */}
      <Form.Item
        label="Rating (1-5)"
        name="rating"
        rules={[
          { required: true, message: 'Rating is required' },
          {
            type: 'number',
            min: 0,
            max: 5,
            message: 'Rating must be between 0 and 5',
          },
        ]}
      >
        <InputNumber
          placeholder="0"
          precision={1}
          step={0.1}
          min={0}
          max={5}
          style={{ width: '100%' }}
          size="large"
        />
      </Form.Item>

      {/* Stock */}
      <Form.Item
        label="Stock (units)"
        name="stock"
        rules={[
          { required: true, message: 'Stock is required' },
          {
            type: 'number',
            min: 0,
            message: 'Stock cannot be negative',
          },
          {
            type: 'integer',
            message: 'Stock must be a whole number',
          },
        ]}
      >
        <InputNumber
          placeholder="0"
          precision={0}
          step={1}
          min={0}
          style={{ width: '100%' }}
          size="large"
        />
      </Form.Item>

      {/* Category */}
      <Form.Item
        label="Category"
        name="category"
        rules={[
          { required: true, message: 'Category is required' },
        ]}
      >
        <Select
          placeholder="Select a category"
          options={categories.map((cat) => ({
            label: cat.name,
            value: cat.slug,
          }))}
          size="large"
        />
      </Form.Item>

      {/* Form Actions */}
      <Form.Item>
        <FormButtonGroup className="flex flex-col gap-2">
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            size="large"
            className="w-full"
          >
            Save Changes
          </Button>
          {onCancel && (
            <Button
              size="large"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full"
            >
              Cancel
            </Button>
          )}
        </FormButtonGroup>
      </Form.Item>
    </Form>
  );
}
