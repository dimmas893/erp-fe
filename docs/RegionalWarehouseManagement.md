# Regional Warehouse Management System

## Overview

The Regional Warehouse Management System allows users to manage regional warehouses within the WMS (Warehouse Management System). This system provides CRUD operations for regional warehouses with filtering, searching, and pagination capabilities.

## Features

### 1. List Regional Warehouses
- **URL**: `/wms/regional-warehouses`
- **Route Name**: `wms-regional-warehouses`
- **Features**:
  - Data table with server-side pagination
  - Dynamic filtering by multiple fields
  - Quick search functionality
  - Sorting by columns
  - Export capabilities

### 2. Create Regional Warehouse
- **URL**: `/wms/regional-warehouses/create`
- **Route Name**: `wms-regional-warehouses-create`
- **Features**:
  - Form validation
  - Integration with Central Warehouse API
  - Region selection dropdown
  - Address management

### 3. View Regional Warehouse Details
- **URL**: `/wms/regional-warehouses/:id`
- **Route Name**: `wms-regional-warehouses-id`
- **Features**:
  - Comprehensive warehouse information display
  - Central warehouse details integration
  - Region information with descriptions
  - Navigation actions
  - Loading states and error handling



## API Endpoints

### List Regional Warehouses
```bash
POST /wms/regional-warehouses/paginated
```

**Request Body:**
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
      "value": "Jakarta"
    }
  ]
}
```

**Response:**
```json
{
  "response_code": 200,
  "response_message": "Success",
  "data": [
    {
      "id": "7895dceb-04ec-44b8-be6b-29b3692a11f0",
      "name": "Regional Warehouse Jakarta",
      "address": "Jl. Raya Jakarta-Bekasi KM 28, Jakarta Timur 13950",
      "code": "RWH-JKT",
      "region": "JABODETABEK",
      "central_warehouse_id": "30b32040-39ec-41a3-ae13-eb1609ef4eee",
      "created_at": "2025-07-17 09:19:42",
      "updated_at": "2025-07-17 09:19:42"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 10,
    "total": 2,
    "from": 1,
    "to": 2
  }
}
```

### Create Regional Warehouse
```bash
POST /wms/regional-warehouses
```

**Request Body:**
```json
{
  "name": "West Java Warehouse",
  "address": "Jl. Merdeka 123, Bandung, West Java",
  "region": "JAWA_BARAT",
  "central_warehouse_id": "30b32040-39ec-41a3-ae13-eb1609ef4eee"
}
```

**Response:**
```json
{
  "response_code": 201,
  "response_message": "Regional warehouse created successfully",
  "data": {
    "id": "82e9a88c-44d1-4a55-af80-df1dc0c6df04",
    "name": "West Java Warehouse",
    "address": "Jl. Merdeka 123, Bandung, West Java",
    "code": "RWH-MD6YCEGOXUC",
    "region": "JAWA_BARAT",
    "central_warehouse_id": "30b32040-39ec-41a3-ae13-eb1609ef4eee",
    "created_at": "2025-07-17 12:31:03",
    "updated_at": "2025-07-17 12:31:03"
  }
}
```

### Get Regional Warehouse Details
```bash
GET /wms/regional-warehouses/{id}
```

**Response:**
```json
{
  "response_code": 200,
  "response_message": "Success",
  "data": {
    "id": "7895dceb-04ec-44b8-be6b-29b3692a11f0",
    "name": "Regional Warehouse Jakarta",
    "address": "Jl. Raya Jakarta-Bekasi KM 28, Jakarta Timur 13950",
    "code": "RWH-JKT",
    "region": "JABODETABEK",
    "central_warehouse_id": "30b32040-39ec-41a3-ae13-eb1609ef4eee",
    "created_at": "2025-07-17 09:19:42",
    "updated_at": "2025-07-17 09:19:42"
  }
}
```



### Get Central Warehouses
```bash
GET /central-warehouses
```

**Response:**
```json
{
  "response_code": 200,
  "response_message": "Success",
  "data": [
    {
      "id": "30b32040-39ec-41a3-ae13-eb1609ef4eee",
      "code": "CWH-001",
      "name": "Central Warehouse Tangerang",
      "address": "Jl. Industri Raya No. 123, Tangerang Selatan, Banten 15134",
      "manager_id": null,
      "capacity_m3": "1000.00",
      "is_active": true,
      "created_at": "2025-07-17T02:19:42.337Z",
      "updated_at": "2025-07-17T02:19:42.337Z"
    }
  ]
}
```

## Available Regions

The system supports the following regions:

- `JABODETABEK` - Jakarta, Bogor, Depok, Tangerang, Bekasi
- `JAWA_BARAT` - West Java
- `JAWA_TIMUR` - East Java
- `JAWA_TENGAH` - Central Java
- `SUMATERA_UTARA` - North Sumatra
- `SUMATERA_SELATAN` - South Sumatra
- `KALIMANTAN` - Kalimantan
- `SULAWESI` - Sulawesi
- `PAPUA` - Papua

## Navigation

The Regional Warehouse Management is accessible through:

1. **Vertical Navigation**: WMS → Regional Warehouses
2. **Horizontal Navigation**: WMS → Regional Warehouses

**Available Actions:**
- View list of regional warehouses
- Create new regional warehouse
- View detailed information of regional warehouse

## Components

### Index Page (`/wms/regional-warehouses/index.vue`)
- Uses `DynamicFilter` component for advanced filtering
- Uses `VDataTableServer` for data display
- Implements pagination and sorting
- Shows central warehouse names instead of IDs
- Clickable warehouse names for quick navigation to details
- Action buttons for detail view

### Create Page (`/wms/regional-warehouses/create.vue`)
- Form validation with Vuetify components
- Integration with Central Warehouse API for dropdown
- Region selection with predefined options
- Address management with textarea

### Detail Page (`/wms/regional-warehouses/[id].vue`)
- Comprehensive warehouse information display
- Central warehouse details integration
- Region information with descriptions and color coding
- Edit and navigation actions
- Loading states and error handling
- Responsive design with proper layout



## Filtering Options

The system supports filtering by:

- **Name**: Text search for warehouse name
- **Code**: Text search for warehouse code
- **Region**: Dropdown selection
- **Address**: Text search for address
- **Central Warehouse**: Dropdown populated from API
- **Created Date**: Date range selection

## Quick Search

Quick search functionality allows searching across:
- Warehouse name
- Warehouse code
- Address

## Error Handling

The system includes comprehensive error handling:

- API error alerts with user-friendly messages
- Form validation with real-time feedback
- Loading states for better UX
- Success notifications for completed operations

## Dependencies

- Vue 3 Composition API
- Vuetify 3 components
- Custom API utility (`$api`)
- Error handling utilities
- Dynamic filter component
- Table pagination component 
