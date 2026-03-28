# Product ROX - Product Management System

A React application for browsing and managing products built with React 19, TypeScript, Redux Toolkit, RTK Query, Ant Design, Tailwind CSS, and Styled Components.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## 📚 Features

### Product Listing Page (`/`)
- Browse products in a table with search and filtering
- Search by product name (real-time)
- Filter by category dropdown
- Pagination with page size options (5, 10, 20, 50)
- Stock badges and rating display
- Click "View →" to see product details

### Product Details Page (`/products/:id`)
- Full product information display
- Image gallery with thumbnail navigation
- Previous/Next image buttons
- Price, rating, stock, and description
- Edit button opens a drawer with edit form

### Edit Product Form
- Form fields: Title, Description, Price, Rating, Stock, Category
- Real-time validation:
  - Title: 3-100 characters
  - Description: 10-500 characters
  - Price: $0.01 - $999,999
  - Rating: 0-5 (0.1 increments)
  - Stock: Non-negative integers
  - Category: Required selection
- Save/Cancel buttons
- Success notification on submit

## 🏗️ Project Structure

```
src/
├── pages/
│   ├── ProductList.tsx        # Product listing with search & filter
│   └── ProductDetails.tsx     # Product details with image gallery
├── components/
│   ├── LoadingSpinner.tsx     # Loading state component
│   ├── ErrorState.tsx         # Error handling component
│   └── EditProductForm.tsx    # Product edit form
├── store/
│   ├── index.ts               # Redux store setup
│   └── api.ts                 # RTK Query endpoints
├── styles/
│   └── index.css              # Global styles & Tailwind
├── App.tsx                    # Main router
└── main.tsx                   # Entry point
```

## 🛠️ Tech Stack

- **React 19.2.4** - UI framework
- **TypeScript 5.9.3** - Type safety
- **Redux Toolkit 2.11.2** - State management
- **RTK Query** - Data fetching with caching
- **React Router 7.13.2** - Client-side routing
- **Ant Design 6.3.4** - UI components
- **Tailwind CSS 3.4.19** - Utility-first CSS
- **Styled Components** - CSS-in-JS
- **Vite 8.0.1** - Build tool

## 📊 API Endpoints

All data from: `https://dummyjson.com`

- `GET /products` - List products (paginated)
- `GET /products/search?q=keyword` - Search products
- `GET /products/categories` - Get all categories
- `GET /products/{id}` - Get product details

## 🎨 Styling Approach

**Tailwind CSS** for layout and responsive design:
```tsx
<div className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
```

**Styled Components** for design tokens and animations:
```tsx
const PageTitle = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: ${tokens.textPrimary};
`;
```

## ✅ Requirements Status

### Task 1 - Product Management ✓
- ✅ Product List with Ant Design Table
- ✅ API integration with `/products` and `/products/search`
- ✅ Pagination with customizable page sizes
- ✅ Category filtering dropdown
- ✅ All columns displayed (Title, Price, Rating, Stock, Category)
- ✅ View button for product navigation

### Task 2 - Product Details & Form ✓
- ✅ Dynamic routing with `/products/:id`
- ✅ Full product information and image gallery
- ✅ Edit button with drawer form
- ✅ Form validation with error messages
- ✅ Loading and error state handling
- ✅ Frontend-only implementation

### Engineering ✓
- ✅ Clean, scalable architecture
- ✅ 100% TypeScript typing
- ✅ Reusable components
- ✅ Proper API abstraction with RTK Query
- ✅ Comprehensive error handling


## 📱 Responsive Design

- **Mobile** (< 640px): Single column layout
- **Tablet** (640px - 1024px): Optimized 2-column
- **Desktop** (> 1024px): Full 2-column layout

---

**Built with React 19, TypeScript, and modern web technologies**
```
