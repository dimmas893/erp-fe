# Product Management System

## Overview

The Product Management system is a comprehensive module within the Warehouse Management System (WMS) that allows users to manage products with detailed specifications, tracking requirements, and storage information. This system supports various product types including consumables, equipment, medicines, and cosmetics.

## Features

### 1. List View (`/wms/products`)
- **Data Table**: Displays all products with pagination
- **Dynamic Filtering**: Advanced filtering by SKU, name, brand, category, product type, and more
- **Quick Search**: Search across SKU, name, brand, and description fields
- **Sorting**: Sort by any column (name, SKU, created date, etc.)
- **Status Indicators**: Visual status chips for various product attributes
- **Category Display**: Shows category information with color-coded chips
- **Product Type Display**: Visual indicators for different product types
- **Storage Requirements**: Color-coded storage requirement indicators
- **Tracking Information**: Serialized, batch tracked, and prescription requirements

### 2. Create Form (`/wms/products/create`)
- **Comprehensive Form**: All product fields with validation
- **Category Selection**: Dropdown to select product category
- **Product Type Selection**: Choose from CONSUMABLE, EQUIPMENT, MEDICINE, COSMETIC
- **Stock Management**: Min/max stock levels and reorder points
- **Storage Requirements**: Room temp, cold, frozen, dry options
- **Physical Dimensions**: Length, width, height in centimeters
- **Weight Information**: Weight in grams
- **Tracking Options**: Serialized, batch tracked, prescription required toggles
- **Unit of Measure**: Various unit options (BOTTLE, JAR, TUBE, UNIT, etc.)
- **Real-time Validation**: Instant feedback on form errors

### 3. Detail View (`/wms/products/[id]`)
- **Comprehensive Information**: Displays all product details
- **Basic Information**: Name, SKU, brand, category, status
- **Stock Information**: Min/max stock levels and reorder points
- **Storage Information**: Storage requirements and shelf life
- **Physical Information**: Weight and dimensions
- **Tracking Information**: Serialized, batch tracked, prescription requirements
- **Product Specifications**: Calculated volume and density
- **Timestamps**: Creation and update dates

## API Integration

### Endpoints Used

1. **GET `/wms/product-categories`** - Fetch categories for dropdowns
2. **POST `/wms/products/paginated`** - Get paginated list with filters
3. **POST `/wms/products`** - Create new product
4. **GET `/wms/products/:id`** - Get specific product details

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
      "value": "Vitamin"
    }
  ]
}
```

#### Create Product Request
```json
{
  "sku": "SKU-COSMETIC-001",
  "name": "Facial Cleanser",
  "category_id": "123e4567-e89b-12d3-a456-426614174000",
  "brand": "Brand XYZ",
  "description": "A gentle facial cleanser for all skin types",
  "product_type": "CONSUMABLE",
  "unit_of_measure": "PCS",
  "min_stock_level": 5,
  "max_stock_level": 100,
  "reorder_point": 10,
  "shelf_life_days": 365,
  "storage_requirement": "ROOM_TEMP",
  "weight_grams": 250.5,
  "dimensions_cm": {
    "length": 10,
    "width": 5,
    "height": 2
  },
  "is_serialized": false,
  "is_batch_tracked": false,
  "is_prescription_required": false,
  "is_active": true
}
```

## Data Structure

### Product Object
```typescript
interface Product {
  id: string
  sku: string
  name: string
  category_id: string
  brand: string
  description: string
  product_type: 'CONSUMABLE' | 'NON_CONSUMABLE'
  unit_of_measure: string
  min_stock_level: number
  max_stock_level: number
  reorder_point: number
  shelf_life_days: number
  storage_requirement: 'ROOM_TEMP' | 'REFRIGERATED' | 'FROZEN'
  weight_grams: number
  dimensions_cm: {
    length: number
    width: number
    height: number
  }
  is_serialized: boolean
  is_batch_tracked: boolean
  is_prescription_required: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  category?: {
    id: string
    code: string
    name: string
    is_active: boolean
  }
}
```

### Product Types
- **CONSUMABLE**: Products that are consumed/used up
- **NON_CONSUMABLE**: Products that are not consumed/used up

### Storage Requirements
- **ROOM_TEMP**: Room temperature storage
- **REFRIGERATED**: Refrigerated storage
- **FROZEN**: Frozen storage

### Units of Measure
- **BOTTLE**: Bottled products
- **JAR**: Jarred products
- **TUBE**: Tubed products
- **UNIT**: Individual units
- **VIAL**: Vial products
- **SYRINGE**: Syringe products
- **PCS**: Pieces

## UI Components

### 1. Dynamic Filter Component
- **Fields**: sku, name, brand, description, category_id, product_type, unit_of_measure, storage_requirement, is_serialized, is_batch_tracked, is_prescription_required, is_active, created_at
- **Operators**: like, equal, date
- **Quick Search**: sku, name, brand, description

### 2. Data Table Features
- **Pagination**: Server-side pagination with configurable page sizes
- **Sorting**: Multi-column sorting
- **Loading States**: Skeleton loaders during data fetching
- **Empty States**: User-friendly empty state with reset options

### 3. Form Components
- **Validation**: Real-time form validation
- **Category Dropdown**: Product category selection
- **Product Type Selection**: Radio buttons for product types
- **Storage Requirements**: Dropdown for storage options
- **Physical Dimensions**: Number inputs for length, width, height
- **Tracking Toggles**: Switches for serialized, batch tracked, prescription required

## Navigation

### Menu Structure
```
WMS
├── Branches
├── Regional Warehouses
├── Product Categories
└── Products
```

### Routes
- `/wms/products` - List view
- `/wms/products/create` - Create form
- `/wms/products/:id` - Detail view

## Error Handling

### 1. API Error Handling
- **Network Errors**: Proper error messages for connection issues
- **Validation Errors**: Field-specific error messages
- **Server Errors**: Generic error messages with retry options

### 2. User Feedback
- **Success Messages**: Confirmation for successful operations
- **Error Messages**: Clear error descriptions
- **Loading States**: Visual feedback during operations

## Product Specifications

### Physical Calculations
- **Volume**: Calculated from dimensions (length × width × height)
- **Density**: Weight divided by volume (g/cm³)

### Stock Management
- **Min Stock Level**: Minimum stock before reorder
- **Max Stock Level**: Maximum stock capacity
- **Reorder Point**: Stock level that triggers reorder

### Tracking Features
- **Serialized**: Products with unique serial numbers
- **Batch Tracked**: Products tracked by batch/lot numbers
- **Prescription Required**: Products requiring prescription

## Color Coding System

### Category Colors
- **MEDICINE**: Primary (blue)
- **EQUIPMENT**: Success (green)
- **COSMETIC**: Warning (orange)
- **DISPOSABLE**: Info (cyan)
- **SUPPLEMENT**: Purple
- **SKINCARE**: Pink

### Product Type Colors
- **CONSUMABLE**: Primary (blue)
- **NON_CONSUMABLE**: Success (green)

### Storage Requirement Colors
- **ROOM_TEMP**: Success (green)
- **REFRIGERATED**: Info (cyan)
- **FROZEN**: Primary (blue)

### Tracking Status Colors
- **Serialized**: Success (green)
- **Non-Serialized**: Warning (orange)
- **Batch Tracked**: Success (green)
- **Non-Batch**: Warning (orange)
- **Prescription Required**: Error (red)
- **OTC**: Success (green)

## Usage Examples

### Creating a New Product
1. Navigate to Products
2. Click "Tambah Produk"
3. Fill in the form:
   - SKU: "SKU-COSMETIC-001"
   - Name: "Facial Cleanser"
   - Category: "Skincare Products"
   - Brand: "Brand XYZ"
   - Product Type: "CONSUMABLE"
   - Unit: "PCS"
   - Min Stock: 5
   - Max Stock: 100
   - Reorder Point: 10
   - Storage: "ROOM_TEMP"
   - Weight: 250.5 grams
   - Dimensions: 10 × 5 × 2 cm
   - Description: "A gentle facial cleanser for all skin types"
4. Click "Simpan Produk"

### Filtering Products
1. Use the dynamic filter to search by:
   - SKU: "SKU"
   - Name: "Vitamin"
   - Brand: "Dermacare"
   - Category: "Skincare Products"
   - Product Type: "CONSUMABLE"
   - Storage: "ROOM_TEMP"
2. Apply filters to see filtered results
3. Use quick search for instant results

### Viewing Product Details
1. Click on any product name in the list
2. View comprehensive information including:
   - Basic details
   - Stock information
   - Storage requirements
   - Physical specifications
   - Tracking information
   - Calculated specifications

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
1. **Bulk Operations**: Select multiple products for bulk actions
2. **Product Import/Export**: CSV/Excel import/export functionality
3. **Product Images**: Image upload and management
4. **Product Analytics**: Usage statistics and reports
5. **Product Templates**: Predefined product templates
6. **Advanced Filtering**: More complex filter combinations
7. **Product Search**: Global search across all products
8. **Product History**: Audit trail for product changes
9. **Barcode/QR Code**: Barcode generation and scanning
10. **Inventory Integration**: Real-time stock level integration

### Technical Improvements
1. **Caching**: Implement client-side caching for better performance
2. **Offline Support**: Basic offline functionality
3. **Real-time Updates**: WebSocket integration for live updates
4. **Advanced Validation**: More sophisticated form validation
5. **Performance Optimization**: Virtual scrolling for large datasets
6. **Image Optimization**: Image compression and lazy loading
7. **Search Optimization**: Full-text search capabilities

## Conclusion

The Product Management system provides a robust foundation for managing products with comprehensive specifications, tracking requirements, and storage information. With its detailed features, intuitive interface, and flexible architecture, it supports efficient product management within the WMS ecosystem. 
 