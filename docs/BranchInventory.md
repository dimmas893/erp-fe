# Branch Inventory Management System

## Overview
Sistem Branch Inventory Management memungkinkan pengelolaan inventori untuk setiap cabang (branch) dalam sistem warehouse management. Sistem ini menangani stok produk di level cabang dengan informasi detail seperti stok saat ini, stok terpesan, level stok minimum/maksimum, dan informasi tambahan lainnya.

## Features

### 1. Index Page (`/wms/branch-inventory`)
- **Dynamic Filter**: Filter berdasarkan SKU produk, nama produk, nama branch, kode branch, alamat branch
- **Quick Search**: Pencarian cepat berdasarkan SKU, nama produk, atau informasi branch
- **Pagination**: Pagination dengan opsi 5, 10, 15, 20, atau semua data
- **Sorting**: Sorting berdasarkan kolom yang dapat diurutkan
- **Branch Details**: Menampilkan informasi lengkap branch (nama, kode, alamat)
- **Stock Information**: Menampilkan stok saat ini, stok terpesan, dan stok tersedia
- **Navigation**: Tombol untuk menambah inventori baru dan melihat detail

### 2. Create Page (`/wms/branch-inventory/create`)
- **Branch Selection**: Dropdown untuk memilih branch dari API `/branches`
- **Product Selection**: Dropdown untuk memilih produk dari API `/wms/products`
- **Stock Information**: Input untuk stok saat ini, stok terpesan, level stok minimum/maksimum
- **Validation**: Validasi form yang komprehensif
- **Error Handling**: Penanganan error dari API

### 3. Detail Page (`/wms/branch-inventory/[id]`)
- **Product Information**: Informasi lengkap produk (SKU, nama, status)
- **Branch Information**: Informasi lengkap branch (nama, kode, alamat)
- **Stock Information**: Detail stok saat ini, terpesan, dan tersedia
- **Stock Levels**: Level stok minimum dan maksimum
- **Additional Information**: Reorder point, rata-rata biaya, stock take terakhir
- **Timestamps**: Informasi waktu pembuatan dan update

## API Endpoints

### 1. Get Paginated Branch Inventory
```
POST /wms/branch-inventory/paginated
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
      "field": "product.sku",
      "operator": "like",
      "value": "SKN"
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
      "id": "e713b8c6-9387-414c-a9ba-69711000b504",
      "branch_id": "cdb715b9-4b62-4b9d-833c-47b4ac2b410f",
      "product_id": "b9b63004-c84c-408f-b6cf-47fba627f6d1",
      "current_stock": 25,
      "reserved_stock": 5,
      "min_stock_level": 7,
      "max_stock_level": 60,
      "reorder_point": 13,
      "avg_cost": "75000.0000",
      "last_stock_take": "2025-07-14 09:19:42",
      "created_at": "2025-06-27 09:19:42",
      "updated_at": "2025-07-17 09:19:42",
      "product": {
        "id": "b9b63004-c84c-408f-b6cf-47fba627f6d1",
        "sku": "SKN-002",
        "name": "Retinol Night Cream",
        "is_active": true
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 48,
    "from": 1,
    "to": 10
  }
}
```

### 2. Create Branch Inventory
```
POST /wms/branch-inventory
```

**Request Body:**
```json
{
  "branch_id": "0db1694c-468d-41d7-b542-5c7be92f149f",
  "product_id": "bc615c6b-be05-4c17-bc2a-020870945834",
  "current_stock": 100,
  "reserved_stock": 20,
  "min_stock_level": 10,
  "max_stock_level": 200
}
```

### 3. Get Branch Inventory Detail
```
GET /wms/branch-inventory/{id}
```

**Response:**
```json
{
  "id": "e713b8c6-9387-414c-a9ba-69711000b504",
  "branch_id": "cdb715b9-4b62-4b9d-833c-47b4ac2b410f",
  "product_id": "b9b63004-c84c-408f-b6cf-47fba627f6d1",
  "current_stock": 25,
  "reserved_stock": 5,
  "min_stock_level": 7,
  "max_stock_level": 60,
  "reorder_point": 13,
  "avg_cost": "75000.0000",
  "last_stock_take": "2025-07-14 09:19:42",
  "created_at": "2025-06-27 09:19:42",
  "updated_at": "2025-07-17 09:19:42",
  "product": {
    "id": "b9b63004-c84c-408f-b6cf-47fba627f6d1",
    "sku": "SKN-002",
    "name": "Retinol Night Cream",
    "is_active": true
  }
}
```

### 4. Get Branch Details
```
GET /wms/branches/{id}
```

**Response:**
```json
{
  "id": "cdb715b9-4b62-4b9d-833c-47b4ac2b410f",
  "name": "Branch Jakarta",
  "code": "BR-JKT",
  "address": "Jl. Sudirman No. 123, Jakarta Pusat",
  "created_at": "2025-06-27 09:19:42",
  "updated_at": "2025-07-17 09:19:42"
}
```

## Data Structure

### Branch Inventory Item
```typescript
interface BranchInventoryItem {
  id: string
  branch_id: string
  product_id: string
  current_stock: number
  reserved_stock: number
  min_stock_level: number
  max_stock_level: number
  reorder_point: number
  avg_cost: string
  last_stock_take: string
  created_at: string
  updated_at: string
  product?: {
    id: string
    sku: string
    name: string
    is_active: boolean
  }
  branch?: {
    id: string
    name: string
    code: string
    address: string
  }
}
```

### Create Request
```typescript
interface CreateBranchInventoryRequest {
  branch_id: string
  product_id: string
  current_stock: number
  reserved_stock?: number
  min_stock_level?: number
  max_stock_level?: number
}
```

## Navigation

### Routes
- `wms-branch-inventory`: Index page
- `wms-branch-inventory-create`: Create page
- `wms-branch-inventory-id`: Detail page

### Menu Location
Branch Inventory ditambahkan ke menu WMS di navigation vertical dengan title "Branch Inventory".

## Features Summary

### Index Page Features
- ✅ Dynamic filtering dengan multiple fields
- ✅ Quick search functionality
- ✅ Pagination dengan berbagai opsi
- ✅ Sorting berdasarkan kolom
- ✅ Branch details fetching dan display
- ✅ Stock calculation (available = current - reserved)
- ✅ Responsive design
- ✅ Loading states dan error handling

### Create Page Features
- ✅ Branch selection dropdown
- ✅ Product selection dropdown dengan display name
- ✅ Stock information input fields
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Success redirect

### Detail Page Features
- ✅ Complete inventory information display
- ✅ Product details dengan status
- ✅ Branch details dengan alamat
- ✅ Stock information dengan calculation
- ✅ Additional information (reorder point, avg cost, last stock take)
- ✅ Timestamps
- ✅ Error handling untuk data tidak ditemukan

## Technical Implementation

### Key Components
1. **DynamicFilter**: Untuk filtering dan searching
2. **VDataTableServer**: Untuk tabel dengan pagination
3. **VForm**: Untuk form validation
4. **VSelect**: Untuk dropdown selection
5. **VTextField**: Untuk input fields

### API Integration
- Menggunakan `$api` utility untuk HTTP requests
- Error handling dengan `showErrorAlert`
- Success handling dengan `showSuccessAlert`
- Loading states untuk UX yang baik

### Data Flow
1. **Index**: Fetch paginated data → Fetch branch details → Display
2. **Create**: Fetch branches & products → Validate form → Submit → Redirect
3. **Detail**: Fetch inventory item → Fetch branch details → Display

## Usage Examples

### Creating New Branch Inventory
1. Navigate ke `/wms/branch-inventory/create`
2. Pilih branch dari dropdown
3. Pilih produk dari dropdown
4. Isi stok saat ini (required)
5. Isi stok terpesan (optional)
6. Isi level stok minimum/maksimum (optional)
7. Klik "Simpan Inventori"

### Filtering Branch Inventory
1. Di halaman index, gunakan filter panel
2. Pilih field yang ingin difilter
3. Masukkan nilai filter
4. Klik "Apply Filters"

### Viewing Branch Inventory Details
1. Di halaman index, klik pada nama produk atau tombol "Detail"
2. Sistem akan menampilkan informasi lengkap inventori cabang
3. Informasi termasuk product details, branch details, stock information, dan timestamps 
 