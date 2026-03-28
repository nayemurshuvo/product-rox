import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Divider, Tag, Rate, Drawer, message } from 'antd';
import { ArrowLeftOutlined, LeftOutlined, RightOutlined, EditOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useGetProductByIdQuery, useGetCategoriesQuery, type Product } from '../store/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EditProductForm from '../components/EditProductForm';

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const Header = styled.div``;

const Content = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

  @media (max-width: 1024px) {
    padding: 24px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ImagesSection = styled.div``;

const ImageGallery = styled.div``;

const ImageDisplay = styled.div`
  width: 100%;
  height: 500px;
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
`;

const ImageNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const NavButton = styled.button`
  background: #f0f0f0;
  border: 1px solid #e8e8e8;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e8e8e8;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ImageCounter = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #666;
`;

const ImageThumbnails = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;

  img {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
    opacity: 0.7;
    transition: all 0.3s ease;

    &:hover {
      opacity: 1;
    }

    &.active {
      opacity: 1;
      border: 2px solid #1890ff;
    }
  }
`;

const NoImageContainer = styled.div`
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 16px;
  border: 1px solid #e8e8e8;
`;

const InfoSection = styled.div``;

const ProductTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const HeaderActions = styled.div``;

const RatingSection = styled.div``;

const RatingLabel = styled.span`
  color: #666;
  font-weight: 500;
`;

const RatingDisplay = styled.div``;

const RatingValue = styled.span`
  color: #666;
`;

const PriceSection = styled.div``;

const PriceLabel = styled.span`
  color: #666;
  font-weight: 500;
`;

const PriceValue = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #1890ff;
`;

const StockSection = styled.div``;

const StockLabel = styled.span`
  color: #666;
  font-weight: 500;
`;

const StockValue = styled.span`
  font-size: 16px;
  color: #1a1a1a;
`;

const DescriptionSection = styled.div``;

const DescriptionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
`;

const DescriptionText = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const MetaSection = styled.div``;

const MetaItem = styled.div``;

const MetaLabel = styled.span`
  color: #666;
  font-weight: 500;
`;

const ActionButtons = styled.div``;

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductByIdQuery(Number(id), {
    skip: !id,
  });

  const {
    data: categoriesData,
  } = useGetCategoriesQuery();

  const categories = categoriesData || [];

  if (isLoading) {
    return <LoadingSpinner message="Loading product details..." fullScreen={true} />;
  }

  if (error || !product) {
    return (
      <ErrorState
        title="Product Not Found"
        message="The product you're looking for doesn't exist or failed to load."
        onRetry={() => refetch()}
        showRetry={true}
        fullScreen={true}
      />
    );
  }

  // console.log('Product data:', product);
  // console.log('Product images:', product.images);
  // console.log('Product thumbnail:', product.thumbnail);

  const hasImages = product.images && Array.isArray(product.images) && product.images.length > 0;
  const imagesList = hasImages ? product.images : [product.thumbnail];
  const displayImages = imagesList.filter((img): img is string => Boolean(img));

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const handleEditProduct = (values: Partial<Product>) => {
    console.log('Form submitted with values:', values);
    message.success('Product updated successfully (frontend only)');
    setIsEditDrawerOpen(false);
  };

  const stockStatus = product.stock > 0 ? 'In Stock' : 'Out of Stock';
  const stockColor = product.stock > 0 ? 'green' : 'red';

  return (
    <Container className="min-h-screen bg-gray-50 px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <Header className="max-w-6xl mx-auto mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          style={{ fontSize: '16px', height: '40px', padding: '0 12px' }}
        >
          Back to Products
        </Button>
      </Header>

      <Content className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Images */}
        <ImagesSection className="flex justify-center items-start">
          {displayImages.length > 0 ? (
            <ImageGallery className="w-full max-w-[500px] flex flex-col gap-4">
              <ImageDisplay className="flex justify-center items-center h-[500px] bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={displayImages[currentImageIndex]}
                  alt={`${product.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="500"%3E%3Crect fill="%23ddd" width="500" height="500"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%23999"%3EImage Not Available%3C/text%3E%3C/svg%3E';
                  }}
                />
              </ImageDisplay>
              {displayImages.length > 1 && (
                <ImageNav className="flex justify-between items-center gap-4">
                  <NavButton className="p-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow" onClick={handlePrevImage}>
                    <LeftOutlined />
                  </NavButton>
                  <ImageCounter className="text-sm font-medium text-gray-700">
                    {currentImageIndex + 1} / {displayImages.length}
                  </ImageCounter>
                  <NavButton className="p-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow" onClick={handleNextImage}>
                    <RightOutlined />
                  </NavButton>
                </ImageNav>
              )}
              {displayImages.length > 1 && (
                <ImageThumbnails className="flex gap-2 overflow-x-auto pb-2">
                  {displayImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className={`flex-shrink-0 w-20 h-20 object-cover rounded transition-all ${
                        idx === currentImageIndex 
                          ? 'ring-2 ring-blue-500 ring-offset-2 opacity-100' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setCurrentImageIndex(idx)}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3C/svg%3E';
                      }}
                    />
                  ))}
                </ImageThumbnails>
              )}
            </ImageGallery>
          ) : (
            <NoImageContainer className="w-full max-w-[500px] h-[500px]">
              No Image Available
            </NoImageContainer>
          )}
        </ImagesSection>

        {/* Right side - Product Info */}
        <InfoSection className="space-y-4">
          <div>
            <ProductTitle className="text-3xl font-bold text-gray-900">{product.title}</ProductTitle>
            <HeaderActions className="flex items-center gap-3 mt-3">
              <Tag color={stockColor} className="text-sm">
                {stockStatus}
              </Tag>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setIsEditDrawerOpen(true)}
              >
                Edit
              </Button>
            </HeaderActions>
          </div>

          <Divider className="my-4" />

          {/* Rating */}
          <RatingSection className="flex items-center gap-3">
            <RatingLabel className="text-gray-700 font-medium">Rating:</RatingLabel>
            <RatingDisplay className="flex items-center gap-2">
              <Rate
                disabled
                value={product.rating}
                allowHalf
              />
              <RatingValue className="text-gray-700">{product.rating.toFixed(1)}/5</RatingValue>
            </RatingDisplay>
          </RatingSection>

          <Divider className="my-4" />

          {/* Price */}
          <PriceSection className="flex items-center gap-3">
            <PriceLabel className="text-gray-700 font-medium">Price:</PriceLabel>
            <PriceValue className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</PriceValue>
          </PriceSection>

          <Divider className="my-4" />

          {/* Stock Info */}
          <StockSection className="flex items-center gap-3">
            <StockLabel className="text-gray-700 font-medium">Available Stock:</StockLabel>
            <StockValue className="text-lg text-gray-900">{product.stock} units</StockValue>
          </StockSection>

          <Divider className="my-4" />

          {/* Description */}
          <DescriptionSection className="mb-4">
            <DescriptionTitle className="text-lg font-bold text-gray-900 mb-3">Description</DescriptionTitle>
            <DescriptionText className="text-gray-700 leading-relaxed">{product.description}</DescriptionText>
          </DescriptionSection>

          <Divider className="my-4" />

          {/* Product Details */}
          <MetaSection className="space-y-3 mb-6">
            <MetaItem className="flex items-center gap-3">
              <MetaLabel className="text-gray-700 font-medium">Category:</MetaLabel>
              <Tag
              style={{textTransform: 'capitalize'}}
              color="blue">
                {product.category}
              </Tag>
            </MetaItem>
            {product.discountPercentage && (
              <MetaItem className="flex items-center gap-3">
                <MetaLabel className="text-gray-700 font-medium">Discount:</MetaLabel>
                <Tag color="orange">
                  {product.discountPercentage}% off
                </Tag>
              </MetaItem>
            )}
          </MetaSection>

          <Divider className="my-4" />

          {/* Action Buttons */}
          <ActionButtons className="flex gap-3 mt-8">
            <Button
              type="primary"
              size="large"
              disabled={product.stock === 0}
              className="flex-1"
            >
              Add to Cart
            </Button>
            <Button size="large" className="flex-1">
              Add to Wishlist
            </Button>
          </ActionButtons>
        </InfoSection>
      </Content>

      {/* Edit Product Drawer */}
      <Drawer
        title="Edit Product"
        placement="right"
        onClose={() => setIsEditDrawerOpen(false)}
        open={isEditDrawerOpen}
        width={500}
      >
        <EditProductForm
          product={product}
          categories={categories}
          onSubmit={handleEditProduct}
          onCancel={() => setIsEditDrawerOpen(false)}
        />
      </Drawer>
    </Container>
  );
}
