# Central Inventory Management

## Overview

The Central Inventory Management system allows users to manage inventory items in central warehouses. This system provides comprehensive tracking of stock levels, reserved stock, and financial information for products stored in central warehouses.

## Features

### 1. Inventory List View (`/wms/central-inventory`)
- **Data Table**: Displays all central inventory items with pagination
- **Dynamic Filtering**: Filter by product SKU, name, central warehouse, stock levels, and dates
- **Quick Search**: Search across product SKU, name, and central warehouse details
- **Sorting**: Sort by any column (except computed columns)
- **Stock Information**: Shows current stock, reserved stock, and available stock
- **Financial Data**: Displays average cost and calculated stock values
- **Navigation**: Click on any row to view detailed information

### 2. Create New Inventory (`/wms/central-inventory/create`)
- **Form Validation**: Comprehensive client-side validation
- **Central Warehouse Selection**: Dropdown with all available central warehouses
- **Product Selection**: Dropdown with all available products (SKU - Name format)
- **Stock Management**: Input fields for current stock and stock levels
- **Error Handling**: Displays validation errors from backend

### 3. Inventory Detail View (`/wms/central-inventory/[id]`)
- **Product Information**: SKU, name, and status
- **Stock Details**: Current and available stock
- **Stock Levels**: Minimum and maximum levels
- **Timestamps**: Creation and update dates
- **Navigation**: Links to create new inventory or return to list

## API Integration

### List Inventory Items
```javascript
// POST /wms/central-inventory/paginated
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
      "id": "f132a373-8cb0-43ed-9fa8-2053e1b5922e",
      "product_id": "bc615c6b-be05-4c17-bc2a-020870945834",
      "central_warehouse_id": "30b32040-39ec-41a3-ae13-eb1609ef4eee",
      "current_stock": 500,
      "reserved_stock": 50,
      "min_stock_level": 10,
      "max_stock_level": 100,
      "reorder_point": 20,
      "avg_cost": "50000.0000",
      "last_stock_take": "2025-07-10 09:19:42",
      "created_at": "2025-06-17 09:19:42",
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
    "last_page": 1,
    "per_page": 10,
    "total": 8,
    "from": 1,
    "to": 8
  }
}
```

### Create Inventory Item
```javascript
// POST /wms/central-inventory
{
  "central_warehouse_id": "30b32040-39ec-41a3-ae13-eb1609ef4eee",
  "product_id": "bc615c6b-be05-4c17-bc2a-020870945834",
  "current_stock": 500,
  "reserved_stock": 50,
  "min_stock_level": 10,
  "max_stock_level": 100
}
```

### Get Inventory Item Detail
```javascript
// GET /wms/central-inventory/{id}
```

## Data Structure

### Inventory Item
```typescript
interface CentralInventoryItem {
  id: string
  product_id: string
  central_warehouse_id: string
  current_stock: number
  reserved_stock: number
  min_stock_level?: number
  max_stock_level?: number
  reorder_point?: number
  avg_cost?: string
  last_stock_take?: string
  created_at: string
  updated_at: string
  product?: {
    id: string
    sku: string
    name: string
    is_active: boolean
  }
  central_warehouse?: {
    id: string
    name: string
    code: string
    region: string
    address: string
    created_at: string
    updated_at: string
  }
}
```

## Filtering Options

### Available Fields
- `product.sku`: Product SKU (text search)
- `product.name`: Product name (text search)
- `central_warehouse.name`: Central warehouse name (text search)
- `central_warehouse.code`: Central warehouse code (text search)
- `central_warehouse.region`: Central warehouse region (text search)
- `central_warehouse_id`: Central warehouse ID (text search)
- `current_stock`: Current stock level (number range)
- `reserved_stock`: Reserved stock level (number range)
- `min_stock_level`: Minimum stock level (number range)
- `max_stock_level`: Maximum stock level (number range)
- `created_at`: Creation date (date range)

### Quick Search Fields
- `product.sku`
- `product.name`
- `central_warehouse.name`
- `central_warehouse.code`
- `central_warehouse.region`

## Navigation

### Menu Structure
```
WMS
├── Branches
├── Regional Warehouses
├── Product Categories
├── Products
├── Regional Inventory
└── Central Inventory
```

### Routes
- **List**: `/wms/central-inventory` → `wms-central-inventory`
- **Create**: `/wms/central-inventory/create` → `wms-central-inventory-create`
- **Detail**: `/wms/central-inventory/:id` → `wms-central-inventory-id`

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
- **Dropdown Integration**: Fetches data from products and central warehouses APIs
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
- **Inventory Reports**: Detailed stock reports
- **Audit Trail**: Track inventory changes
- **Barcode Integration**: Scan products for quick updates 
