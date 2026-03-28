import { useState, useMemo } from 'react';
import { Table, Select, Input, Button, Spin, Empty, Alert, Tag } from 'antd';
import { SearchOutlined, AppstoreOutlined, ReloadOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery, useGetCategoriesQuery } from '../store/api';
import type { TableProps } from 'antd';
import type { Product } from '../store/api';

// ─── Animations ──────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Design Tokens ───────────────────────────────────────────────────────────
const tokens = {
  bg: '#F8F9FC',
  surface: '#FFFFFF',
  border: '#E8EBF2',
  borderHover: '#C5CBE0',
  accent: '#4F6EF7',
  accentLight: '#EEF1FF',
  accentHover: '#3B57E0',
  textPrimary: '#0F1733',
  textSecondary: '#5A6380',
  textMuted: '#9BA3BC',
  success: '#18A96B',
  successBg: '#EDFAF4',
  warning: '#F59E0B',
  warningBg: '#FFF8EC',
  danger: '#EF4444',
  dangerBg: '#FFF0F0',
  shadow: '0 1px 3px rgba(15,23,51,0.06), 0 4px 12px rgba(15,23,51,0.04)',
  shadowHover: '0 4px 16px rgba(15,23,51,0.10)',
  radius: '12px',
  radiusSm: '8px',
};

// ─── Layout ───────────────────────────────────────────────────────────────────
const PageShell = styled.div`
  min-height: 100vh;
  background: ${tokens.bg};
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  animation: ${fadeUp} 0.4s ease both;
`;

const IconBadge = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${tokens.radiusSm};
  background: ${tokens.accentLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.accent};
  font-size: 20px;
  flex-shrink: 0;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: ${tokens.textPrimary};
  letter-spacing: -0.4px;
`;

const PageSubtitle = styled.p`
  margin: 2px 0 0;
  font-size: 13px;
  color: ${tokens.textMuted};
`;

// ─── Alert ────────────────────────────────────────────────────────────────────
const AlertWrap = styled.div`
  animation: ${fadeUp} 0.4s ease 0.05s both;
`;

// ─── Filter Card ─────────────────────────────────────────────────────────────
const FilterCard = styled.div`
  background: ${tokens.surface};
  border: 1px solid ${tokens.border};
  border-radius: ${tokens.radius};
  box-shadow: ${tokens.shadow};
  animation: ${fadeUp} 0.4s ease 0.08s both;
`;

const FilterInner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
`;

const FilterDivider = styled.div`
  width: 1px;
  height: 32px;
  background: ${tokens.border};
`;

const FilterLabelText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${tokens.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.6px;
  white-space: nowrap;
`;

// ─── Table Card ───────────────────────────────────────────────────────────────
const TableCard = styled.div`
  background: ${tokens.surface};
  border: 1px solid ${tokens.border};
  border-radius: ${tokens.radius};
  box-shadow: ${tokens.shadow};
  overflow: hidden;
  animation: ${fadeUp} 0.4s ease 0.12s both;

  /* Ant Table overrides */
  .ant-table-thead > tr > th {
    background: #F4F6FB !important;
    color: ${tokens.textMuted} !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    border-bottom: 1px solid ${tokens.border} !important;
    padding: 14px 16px !important;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #F2F4FA !important;
    padding: 14px 16px !important;
    color: ${tokens.textPrimary};
    font-size: 14px;
  }

  .ant-table-tbody > tr:hover > td {
    background: #F8F9FD !important;
  }

  .ant-table-tbody > tr:last-child > td {
    border-bottom: none !important;
  }

  .ant-pagination {
    padding: 16px 20px !important;
    margin: 0 !important;
    border-top: 1px solid ${tokens.border};
    background: #FAFBFD;
  }

  .ant-pagination-item-active {
    background: ${tokens.accent} !important;
    border-color: ${tokens.accent} !important;
    border-radius: 6px !important;
  }

  .ant-pagination-item-active a {
    color: white !important;
  }

  .ant-pagination-item {
    border-radius: 6px !important;
  }

  .ant-spin-dot-item {
    background-color: ${tokens.accent} !important;
  }

  .row-even > td { background: #FFFFFF !important; }
  .row-odd  > td { background: #F8F9FD !important; }
`;

// ─── Product Image ────────────────────────────────────────────────────────────
const ProductImage = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${tokens.radiusSm};
  background: ${tokens.bg};
  border: 1px solid ${tokens.border};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.2s ease;
  }

  &:hover img {
    transform: scale(1.08);
  }
`;

// ─── Cell Primitives ─────────────────────────────────────────────────────────
const ProductName = styled.span`
  font-weight: 600;
  color: ${tokens.textPrimary};
  font-size: 14px;
`;

const PriceText = styled.span`
  font-weight: 700;
  color: ${tokens.textPrimary};
  font-size: 14px;
  font-variant-numeric: tabular-nums;
`;

const RatingBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${tokens.warningBg};
  color: ${tokens.warning};
  font-size: 12px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 20px;
`;

const StockBadge = styled.span<{ $available: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  background: ${({ $available }) => ($available ? tokens.successBg : tokens.dangerBg)};
  color: ${({ $available }) => ($available ? tokens.success : tokens.danger)};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
`;

const ViewButton = styled(Button)`
  && {
    background: ${tokens.accent};
    border-color: ${tokens.accent};
    color: white;
    border-radius: ${tokens.radiusSm};
    font-size: 12px;
    font-weight: 600;
    height: 32px;
    padding: 0 14px;
    transition: all 0.15s ease;

    &:hover {
      background: ${tokens.accentHover} !important;
      border-color: ${tokens.accentHover} !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(79, 110, 247, 0.3);
    }
  }
`;

const StyledSearchInput = styled(Input)`
  && {
    border-radius: ${tokens.radiusSm};
    border-color: ${tokens.border};
    height: 38px;
    font-size: 14px;

    &:hover, &:focus {
      border-color: ${tokens.accent};
      box-shadow: 0 0 0 2px ${tokens.accentLight};
    }
  }
`;

const StyledSelect = styled(Select)`
  && .ant-select-selector {
    border-radius: ${tokens.radiusSm} !important;
    border-color: ${tokens.border} !important;
    height: 38px !important;
    align-items: center;
    font-size: 14px;

    &:hover {
      border-color: ${tokens.accent} !important;
    }
  }

  &&.ant-select-focused .ant-select-selector {
    border-color: ${tokens.accent} !important;
    box-shadow: 0 0 0 2px ${tokens.accentLight} !important;
  }
` as typeof Select;

const EmptyWrap = styled.div`
  padding: 64px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .ant-empty-description {
    color: ${tokens.textMuted};
    font-size: 14px;
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────
interface FilterParams {
  searchQuery: string;
  selectedCategory: string | null;
  pageSize: number;
  currentPage: number;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProductList() {
  const navigate = useNavigate();
  const [filterParams, setFilterParams] = useState<FilterParams>({
    searchQuery: '',
    selectedCategory: null,
    pageSize: 10,
    currentPage: 1,
  });

  const {
    data: allProductsData,
    isLoading: allProductsLoading,
    error: allProductsError,
  } = useGetProductsQuery({ limit: 1000, skip: 0 });

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();

  const filteredProducts = useMemo(() => {
    if (!allProductsData?.products) return [];

    const normalizedQuery = filterParams.searchQuery.trim().toLowerCase();

    return allProductsData.products.filter((product) => {
      const matchesCategory =
        !filterParams.selectedCategory || product.category === filterParams.selectedCategory;

      const matchesSearch =
        !normalizedQuery || product.title.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [allProductsData, filterParams.searchQuery, filterParams.selectedCategory]);

  const handleTableChange: TableProps<Product>['onChange'] = (pagination) => {
    setFilterParams((prev) => ({
      ...prev,
      currentPage:
        pagination.pageSize && pagination.pageSize !== prev.pageSize
          ? 1
          : pagination.current || 1,
      pageSize: pagination.pageSize || prev.pageSize,
    }));
  };

  const handleSearch = (value: string) => {
    setFilterParams((prev) => ({ ...prev, searchQuery: value, currentPage: 1 }));
  };

  const handleCategoryChange = (value: string | undefined) => {
    setFilterParams((prev) => ({
      ...prev,
      selectedCategory: value || null,
      currentPage: 1,
    }));
  };

  const columns: TableProps<Product>['columns'] = [
    {
      title: 'Product',
      key: 'product',
      render: (_: unknown, record: Product) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ProductImage>
            <img
              src={record.thumbnail}
              alt={record.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="56" height="56"%3E%3Crect fill="%23eee" width="56" height="56"/%3E%3C/svg%3E';
              }}
            />
          </ProductImage>
          <ProductName>{record.title}</ProductName>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <PriceText>${price.toFixed(2)}</PriceText>,
      width: 110,
      align: 'right' as const,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <RatingBadge>⭐ {rating.toFixed(1)}</RatingBadge>
      ),
      width: 100,
      align: 'center' as const,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <StockBadge $available={stock > 0}>
          {stock > 0 ? `${stock} in stock` : 'Out of stock'}
        </StockBadge>
      ),
      width: 140,
      align: 'center' as const,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag
          style={{
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            padding: '2px 10px',
            border: `1px solid ${tokens.border}`,
            background: tokens.accentLight,
            color: tokens.accent,
            textTransform: 'capitalize',
          }}
        >
          {category}
        </Tag>
      ),
      width: 140,
    },
    {
      title: '',
      key: 'action',
      render: (_: unknown, record: Product) => (
        <ViewButton
          type="primary"
          size="small"
          onClick={() => navigate(`/products/${record.id}`)}
        >
          View →
        </ViewButton>
      ),
      width: 100,
      align: 'center' as const,
    },
  ];

  const isLoading = allProductsLoading || categoriesLoading;
  const hasError = allProductsError || categoriesError;

  return (
    <PageShell className="px-10 py-8 md:px-5 md:py-5">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-7">
        <PageHeader>
          <IconBadge>
            <AppstoreOutlined />
          </IconBadge>
          <div>
            <PageTitle>Products</PageTitle>
            <PageSubtitle>
              {allProductsData?.total
                ? `${filteredProducts.length} of ${allProductsData.total} items`
                : 'Browse your product catalogue'}
            </PageSubtitle>
          </div>
        </PageHeader>
      </div>

      {/* Error */}
      {hasError && (
        <div className="max-w-6xl mx-auto mb-5">
          <AlertWrap>
            <Alert
              message="Failed to load data"
              description="Could not fetch products or categories. Please try again."
              type="error"
              showIcon
              closable
              icon={<ReloadOutlined />}
              style={{ borderRadius: tokens.radiusSm }}
            />
          </AlertWrap>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-6xl mx-auto mb-5">
        <FilterCard className="px-6 py-5">
          <FilterInner className="flex-wrap sm:flex-nowrap">
            <StyledSearchInput
              placeholder="Search products by title…"
              prefix={<SearchOutlined style={{ color: tokens.textMuted }} />}
              value={filterParams.searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              className="w-full sm:w-80"
            />

            <FilterDivider className="hidden sm:block" />

            <FilterLabelText>Category</FilterLabelText>

            <StyledSelect
              placeholder="All Categories"
              allowClear
              value={filterParams.selectedCategory}
              onChange={handleCategoryChange}
              loading={categoriesLoading}
              style={{ width: 220 }}
              options={
                categoriesData?.map((cat) => ({
                  label: cat.name,
                  value: cat.slug,
                })) || []
              }
            />
          </FilterInner>
        </FilterCard>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto">
        <TableCard>
          <Spin spinning={isLoading} tip="Loading products…">
            {filteredProducts.length === 0 && !isLoading ? (
              <EmptyWrap>
                <Empty
                  description={
                    filterParams.searchQuery || filterParams.selectedCategory
                      ? 'No products match your filters'
                      : 'No products available'
                  }
                />
              </EmptyWrap>
            ) : (
              <Table<Product>
                columns={columns}
                dataSource={filteredProducts}
                rowKey="id"
                rowClassName={(_, index) => (index % 2 === 0 ? 'row-even' : 'row-odd')}
                pagination={{
                  current: filterParams.currentPage,
                  pageSize: filterParams.pageSize,
                  total: filteredProducts.length,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  pageSizeOptions: ['5', '10', '20', '50'],
                  showTotal: (total) => `${total} products`,
                  className: 'px-4',
                }}
                onChange={handleTableChange}
              />
            )}
          </Spin>
        </TableCard>
      </div>
    </PageShell>
  );
}