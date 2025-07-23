# Product Category Management System

## Overview

The Product Category Management system is a comprehensive module within the Warehouse Management System (WMS) that allows users to manage product categories in a hierarchical structure. This system supports both parent categories and sub-categories, enabling flexible organization of products.

## Features

### 1. List View (`/wms/product-categories`)
- **Data Table**: Displays all product categories with pagination
- **Dynamic Filtering**: Advanced filtering by name, code, description, parent category, and status
- **Quick Search**: Search across name, code, and description fields
- **Sorting**: Sort by any column (name, code, created date, etc.)
- **Status Indicators**: Visual status chips for active/inactive categories
- **Parent Category Display**: Shows parent category information with color-coded chips
- **Navigation**: Direct links to detail pages and create form

### 2. Create Form (`/wms/product-categories/create`)
- **Form Validation**: Comprehensive validation for all required fields
- **Parent Category Selection**: Dropdown to select parent category (optional)
- **Status Toggle**: Switch to activate/deactivate category
- **Code Auto-formatting**: Automatically converts code to uppercase
- **Real-time Validation**: Instant feedback on form errors
- **Success/Error Handling**: Proper notification system

### 3. Detail View (`/wms/product-categories/[id]`)
- **Comprehensive Information**: Displays all category details
- **Hierarchy Information**: Shows parent-child relationships
- **Status Visualization**: Clear status indicators
- **Timestamps**: Creation and update dates
- **Category Type Classification**: Distinguishes between parent and sub-categories
- **Code Descriptions**: Detailed descriptions for category codes

## API Integration

### Endpoints Used

1. **GET `/wms/product-categories`** - Fetch all categories for dropdowns
2. **POST `/wms/product-categories/paginated`** - Get paginated list with filters
3. **POST `/wms/product-categories`** - Create new category
4. **GET `/wms/product-categories/:id`** - Get specific category details

### Request/Response Examples

#### Paginated List Request
```json
{
  "page": 1,
  "per_page": 10,
  "sort_by": "created_at",
  "sort_order": "desc",
  "filters": [
    {
      "field": "name",
      "operator": "like",
      "value": "Medicine"
    }
  ]
}
```

#### Create Category Request
```json
{
  "name": "Injectable Medicines",
  "code": "INJECTABLE",
  "description": "Obat-obatan injeksi untuk treatment",
  "parent_id": "617e4a3e-9f66-4a4b-8998-87d094e250db",
  "is_active": true
}
```

## Data Structure

### Product Category Object
```typescript
interface ProductCategory {
  id: string
  code: string
  name: string
  description: string
  parent_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  parent?: {
    id: string
    code: string
    name: string
    is_active: boolean
  }
}
```

### Category Types
- **Parent Categories**: Categories without `parent_id` (top-level)
- **Sub Categories**: Categories with `parent_id` (child categories)

## UI Components

### 1. Dynamic Filter Component
- **Fields**: name, code, description, parent_id, is_active, created_at
- **Operators**: like, equal, date
- **Quick Search**: name, code, description

### 2. Data Table Features
- **Pagination**: Server-side pagination with configurable page sizes
- **Sorting**: Multi-column sorting
- **Loading States**: Skeleton loaders during data fetching
- **Empty States**: User-friendly empty state with reset options

### 3. Form Components
- **Validation**: Real-time form validation
- **Auto-complete**: Parent category dropdown with search
- **Status Toggle**: Switch component for active/inactive status

## Navigation

### Menu Structure
```
WMS
├── Branches
├── Regional Warehouses
└── Product Categories
```

### Routes
- `/wms/product-categories` - List view
- `/wms/product-categories/create` - Create form
- `/wms/product-categories/:id` - Detail view

## Error Handling

### 1. API Error Handling
- **Network Errors**: Proper error messages for connection issues
- **Validation Errors**: Field-specific error messages
- **Server Errors**: Generic error messages with retry options

### 2. User Feedback
- **Success Messages**: Confirmation for successful operations
- **Error Messages**: Clear error descriptions
- **Loading States**: Visual feedback during operations

## Category Code System

### Predefined Categories
- **MEDICINE**: Obat-obatan dan suplemen medis
- **EQUIPMENT**: Peralatan medis dan alat treatment
- **COSMETIC**: Produk kosmetik dan perawatan
- **DISPOSABLE**: Perlengkapan sekali pakai
- **SUPPLEMENT**: Suplemen dan vitamin
- **INJECTABLE**: Obat-obatan injeksi
- **LASER_EQP**: Peralatan laser
- **BEAUTY_TOOLS**: Alat-alat kecantikan
- **MAKEUP**: Produk makeup
- **SUNCARE**: Produk perlindungan matahari
- **BODYCARE**: Produk perawatan tubuh
- **HAIRCARE**: Produk perawatan rambut

### Color Coding
- **MEDICINE**: Primary (blue)
- **EQUIPMENT**: Success (green)
- **COSMETIC**: Warning (orange)
- **DISPOSABLE**: Info (cyan)
- **SUPPLEMENT**: Purple

## Usage Examples

### Creating a New Category
1. Navigate to Product Categories
2. Click "Tambah Kategori Produk"
3. Fill in the form:
   - Name: "Injectable Medicines"
   - Code: "INJECTABLE"
   - Description: "Obat-obatan injeksi untuk treatment"
   - Parent: "Medicines & Supplements"
   - Status: Active
4. Click "Simpan Kategori Produk"

### Filtering Categories
1. Use the dynamic filter to search by:
   - Name: "Medicine"
   - Code: "MED"
   - Status: Active
   - Parent Category: "Medicines & Supplements"
2. Apply filters to see filtered results
3. Use quick search for instant results

### Viewing Category Details
1. Click on any category name in the list
2. View comprehensive information including:
   - Basic details
   - Hierarchy information
   - Timestamps
   - Status information

## Technical Implementation

### 1. State Management
- **Reactive Data**: Vue 3 Composition API with refs
- **Form State**: Reactive form validation
- **Loading States**: Proper loading indicators

### 2. API Integration
- **Error Handling**: Comprehensive error handling
- **Request/Response**: Proper data transformation
- **Caching**: Efficient data fetching

### 3. UI/UX
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized rendering and data handling

## Future Enhancements

### Potential Features
1. **Bulk Operations**: Select multiple categories for bulk actions
2. **Category Import/Export**: CSV/Excel import/export functionality
3. **Category Hierarchy Visualization**: Tree view of categories
4. **Category Analytics**: Usage statistics and reports
5. **Category Templates**: Predefined category templates
6. **Advanced Filtering**: More complex filter combinations
7. **Category Search**: Global search across all categories
8. **Category History**: Audit trail for category changes

### Technical Improvements
1. **Caching**: Implement client-side caching for better performance
2. **Offline Support**: Basic offline functionality
3. **Real-time Updates**: WebSocket integration for live updates
4. **Advanced Validation**: More sophisticated form validation
5. **Performance Optimization**: Virtual scrolling for large datasets

## Conclusion

The Product Category Management system provides a robust foundation for organizing products in a hierarchical structure. With its comprehensive features, intuitive interface, and flexible architecture, it supports efficient product categorization and management within the WMS ecosystem. 
