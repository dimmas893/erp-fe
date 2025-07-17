# Regional Inventory Management

## Overview

The Regional Inventory Management system allows users to manage inventory items across different regional warehouses. This system provides comprehensive tracking of stock levels, reserved stock, and financial information for products stored in regional warehouses.

## Features

### 1. Inventory List View (`/wms/regional-inventory`)
- **Data Table**: Displays all regional inventory items with pagination
- **Dynamic Filtering**: Filter by product SKU, name, regional warehouse, stock levels, costs, and dates
- **Quick Search**: Search across product SKU, name, and regional warehouse ID
- **Sorting**: Sort by any column (except computed columns)
- **Stock Information**: Shows current stock, reserved stock, and available stock
- **Financial Data**: Displays average cost and calculated stock values
- **Navigation**: Click on any row to view detailed information

### 2. Create New Inventory (`/wms/regional-inventory/create`)
- **Form Validation**: Comprehensive client-side validation
- **Regional Warehouse Selection**: Dropdown with all available regional warehouses
- **Product Selection**: Dropdown with all available products (SKU - Name format)
- **Stock Management**: Input fields for current stock and stock levels
- **Error Handling**: Displays validation errors from backend

### 3. Inventory Detail View (`/wms/regional-inventory/[id]`)
- **Product Information**: SKU, name, and status
- **Stock Details**: Current and available stock
- **Stock Levels**: Minimum and maximum levels
- **Timestamps**: Creation and update dates
- **Navigation**: Links to create new inventory or return to list

## API Integration

### List Inventory Items
```javascript
// POST /wms/regional-inventory/paginated
{
  "page": 1,
  "per_page": 10,
  "sort_by": "created_at",
  "sort_order": "desc",
  "filters": [
    {
      "field": "product.sku",
      "operator": "like",
      "value": "SKN"
    }
  ]
}
```

**Response Structure:**
```json
{
  "response_code": 200,
  "response_message": "Success",
  "data": [
    {
      "id": "7cd12448-dbb8-4da1-a8a2-f1d7917c2ad2",
      "product_id": "bc615c6b-be05-4c17-bc2a-020870945834",
      "regional_warehouse_id": "7895dceb-04ec-44b8-be6b-29b3692a11f0",
      "current_stock": 100,
      "reserved_stock": 15,
      "min_stock_level": 20,
      "max_stock_level": 200,
      "reorder_point": 40,
      "avg_cost": "50000.0000",
      "last_stock_take": "2025-07-12 09:19:42",
      "created_at": "2025-06-22 09:19:42",
      "updated_at": "2025-07-17 09:19:42",
      "product": {
        "id": "bc615c6b-be05-4c17-bc2a-020870945834",
        "sku": "SKN-001",
        "name": "Vitamin C Serum Premium",
        "is_active": true
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 2,
    "per_page": 10,
    "total": 16,
    "from": 1,
    "to": 10
  }
}
```

### Create Inventory Item
```javascript
// POST /wms/regional-inventory
{
  "regional_warehouse_id": "123e4567-e89b-12d3-a456-426614174001",
  "product_id": "123e4567-e89b-12d3-a456-426614174002",
  "current_stock": 100,
  "min_stock_level": 10,
  "max_stock_level": 200
}
```

### Get Inventory Item Detail
```javascript
// GET /wms/regional-inventory/{id}
```

## Data Structure

### Inventory Item
```typescript
interface RegionalInventoryItem {
  id: string
  product_id: string
  regional_warehouse_id: string
  current_stock: number
  min_stock_level?: number
  max_stock_level?: number
  created_at: string
  updated_at: string
  product?: {
    id: string
    sku: string
    name: string
    is_active: boolean
  }
  regional_warehouse?: {
    id: string
    name: string
    code: string
    region: string
    address: string
    central_warehouse_id: string
    created_at: string
    updated_at: string
  }
}
```

## Filtering Options

### Available Fields
- `product.sku`: Product SKU (text search)
- `product.name`: Product name (text search)
- `regional_warehouse.name`: Regional warehouse name (text search)
- `regional_warehouse.code`: Regional warehouse code (text search)
- `regional_warehouse.region`: Regional warehouse region (text search)
- `regional_warehouse_id`: Regional warehouse ID (text search)
- `current_stock`: Current stock level (number range)
- `min_stock_level`: Minimum stock level (number range)
- `max_stock_level`: Maximum stock level (number range)
- `created_at`: Creation date (date range)

### Quick Search Fields
- `product.sku`
- `product.name`
- `regional_warehouse.name`
- `regional_warehouse.code`
- `regional_warehouse.region`

## Navigation

### Menu Structure
```
WMS
├── Branches
├── Regional Warehouses
├── Product Categories
├── Products
└── Regional Inventory
```

### Routes
- **List**: `/wms/regional-inventory` → `wms-regional-inventory`
- **Create**: `/wms/regional-inventory/create` → `wms-regional-inventory-create`
- **Detail**: `/wms/regional-inventory/:id` → `wms-regional-inventory-id`

## UI Components

### Index Page Features
- **Dynamic Filter**: Advanced filtering with multiple criteria
- **Data Table**: Server-side pagination with sorting
- **Stock Indicators**: Color-coded stock levels
- **Financial Display**: Currency formatting for costs
- **Loading States**: Skeleton loaders during data fetch
- **Error Handling**: User-friendly error messages

### Create Page Features
- **Form Validation**: Real-time validation with error messages
- **Dropdown Integration**: Fetches data from products and regional warehouses APIs
- **Stock Validation**: Ensures reserved stock doesn't exceed current stock
- **Optional Fields**: Flexible form with required and optional fields
- **Success Feedback**: Confirmation messages and navigation

### Detail Page Features
- **Card Layout**: Organized information in separate cards
- **Stock Calculations**: Automatic calculation of available stock
- **Financial Summary**: Total stock value calculation
- **Status Indicators**: Visual status chips for product status
- **Timestamp Display**: Formatted date/time information

## Error Handling

### API Errors
- **Network Errors**: Displayed with user-friendly messages
- **Validation Errors**: Field-specific error messages
- **Server Errors**: Generic error messages with retry options

### Form Validation
- **Required Fields**: Clear indication of required fields
- **Data Type Validation**: Number fields with range validation
- **Business Logic**: Stock level validation rules
- **Real-time Feedback**: Immediate validation feedback

## Performance Considerations

### Data Loading
- **Lazy Loading**: Components load data only when needed
- **Caching**: Dropdown data cached to reduce API calls
- **Pagination**: Server-side pagination for large datasets
- **Loading States**: Visual feedback during data operations

### User Experience
- **Responsive Design**: Works on all screen sizes
- **Keyboard Navigation**: Full keyboard accessibility
- **Loading Indicators**: Clear loading states
- **Error Recovery**: Easy error recovery options

## Security

### Data Protection
- **Input Validation**: Client and server-side validation
- **XSS Prevention**: Proper data sanitization
- **CSRF Protection**: Built-in CSRF protection
- **Authentication**: Required authentication for all operations

## Future Enhancements

### Planned Features
- **Bulk Operations**: Import/export inventory data
- **Stock Alerts**: Low stock notifications
- **Inventory History**: Track stock changes over time
- **Advanced Analytics**: Stock turnover and forecasting
- **Mobile Support**: Mobile-optimized interface

### Integration Opportunities
- **Barcode Scanning**: QR code integration
- **Real-time Updates**: WebSocket for live updates
- **Reporting**: Advanced inventory reports
- **Audit Trail**: Complete change history 
