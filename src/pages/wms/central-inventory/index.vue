<route lang="yaml">
meta:
  layout: default
  navActiveLink: wms-central-inventory
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Inventori Pusat"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      quick-search-placeholder="Cari SKU, nama produk, atau central warehouse..."
      :quick-search-fields="['product.sku', 'product.name', 'central_warehouse.name', 'central_warehouse.code', 'central_warehouse.address']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
    >
      <template #actions>
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          :to="{ name: 'wms-central-inventory-create' }"
        >
          Tambah Inventori
        </VBtn>
      </template>
    </DynamicFilter>
    
    <VDivider />
    <VDataTableServer
      :headers="headers"
      :items="inventoryItems"
      :items-length="totalInventoryItems"
      :loading="loading"
      :items-per-page="itemsPerPage"
      :page="page"
      :sort-by="[{ key: sortBy, order: orderBy }]"
      class="text-no-wrap"
      @update:options="onUpdateOptions"
    >
      <template #item.no="{ index }">
        {{ (itemsPerPage * (page - 1)) + index + 1 }}
      </template>
      <template #item.product="{ item }">
        <VBtn
          v-if="item?.product"
          variant="text"
          color="primary"
          class="font-weight-medium pa-0 text-none"
          :to="{ name: 'wms-central-inventory-id', params: { id: item.id } }"
        >
          <div class="font-weight-medium">{{ item.product.sku }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ item.product.name }}</div>
        </VBtn>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.central_warehouse="{ item }">
        <div v-if="item?.central_warehouse">
          <div class="font-weight-medium">{{ item.central_warehouse.name }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ item.central_warehouse.code }} - {{ item.central_warehouse.address }}</div>
        </div>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.current_stock="{ item }">
        <span class="font-weight-medium">{{ item?.current_stock || 0 }}</span>
      </template>

      <template #item.reserved_stock="{ item }">
        <span class="font-weight-medium text-warning">{{ item?.reserved_stock || 0 }}</span>
      </template>

      <template #item.available_stock="{ item }">
        <span class="font-weight-medium text-success">
          {{ (item?.current_stock || 0) - (item?.reserved_stock || 0) }}
        </span>
      </template>
      <template #item.stock_levels="{ item }">
        <div class="d-flex flex-column gap-1">
          <div class="text-body-2">
            <span class="text-medium-emphasis">Min:</span>
            <span class="font-weight-medium">{{ item?.min_stock_level || 0 }}</span>
          </div>
          <div class="text-body-2">
            <span class="text-medium-emphasis">Max:</span>
            <span class="font-weight-medium">{{ item?.max_stock_level || 0 }}</span>
          </div>
        </div>
      </template>
      <template #item.created_at="{ item }">
        {{ item && item.created_at ? formatDateTime(item.created_at) : '-' }}
      </template>
      
      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <VBtn
            size="small"
            variant="text"
            color="primary"
            :to="{ name: 'wms-central-inventory-id', params: { id: item.id } }"
            prepend-icon="tabler-eye"
          >
            Detail
          </VBtn>
        </div>
      </template>

      <template #loading>
        <VSkeletonLoader
          class="mx-auto"
          type="table-row@10"
        />
      </template>
      <template #no-data>
        <div
          v-if="shouldShowNoData"
          class="text-center py-12"
        >
          <VIcon
            size="64"
            color="primary"
            class="mb-4"
          >
            tabler-package
          </VIcon>
          <h3 class="text-h6 mb-2">
            Tidak ada data ditemukan
          </h3>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Coba ubah filter atau kriteria pencarian Anda
          </p>
          <VBtn
            color="primary"
            variant="tonal"
            @click="handleClearFilters"
          >
            Reset Filter
          </VBtn>
        </div>
      </template>
      <template #bottom>
        <div class="d-flex align-center justify-space-between flex-wrap gap-3 pa-4">
          <div class="d-flex align-center gap-2">
            <span class="text-body-2 text-medium-emphasis">Tampilkan:</span>
            <VSelect
              v-model="itemsPerPage"
              :items="perPageOptions"
              item-title="title"
              item-value="value"
              density="compact"
              variant="outlined"
              hide-details
              style="min-width: 80px; max-width: 100px;"
            />
            <span class="text-body-2 text-medium-emphasis">per halaman</span>
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{ paginationMeta({ page: page, itemsPerPage: itemsPerPage }, totalInventoryItems) }}
          </div>
          <TablePagination
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalInventoryItems"
            :items-per-page-options="perPageOptions"
            hide-details
            :show-meta="false"
          />
        </div>
      </template>
    </VDataTableServer>
  </VCard>
</template>

<script setup>
import TablePagination from '@/@core/components/TablePagination.vue'
import DynamicFilter from '@/components/DynamicFilter.vue'
import { $api } from '@/utils/api'
import { showErrorAlert } from '@/utils/errorHandler'
import { paginationMeta } from '@/utils/paginationMeta'
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref('created_at')
const orderBy = ref('desc')
const loading = ref(true)
const initialLoadCompleted = ref(false)

const inventoryItems = ref([])
const totalInventoryItems = ref(0)
const currentFilters = ref([])
const currentQuickSearch = ref('')

// Reactive field configurations
const allowedFields = [
  'product.sku',
  'product.name',
  'central_warehouse.name',
  'central_warehouse.code',
  'central_warehouse.address',
  'central_warehouse_id',
  'current_stock',
  'reserved_stock',
  'min_stock_level',
  'max_stock_level',
  'created_at',
]

const fieldConfigs = computed(() => {
  return {
    'product.sku': {
      title: 'SKU Produk',
      type: 'text',
      operator: 'like',
    },
    'product.name': {
      title: 'Nama Produk',
      type: 'text',
      operator: 'like',
    },
    'central_warehouse.name': {
      title: 'Nama Gudang Pusat',
      type: 'text',
      operator: 'like',
    },
    'central_warehouse.code': {
      title: 'Kode Gudang Pusat',
      type: 'text',
      operator: 'like',
    },
    'central_warehouse.address': {
      title: 'Alamat Gudang',
      type: 'text',
      operator: 'like',
    },
    'central_warehouse_id': {
      title: 'ID Gudang Pusat',
      type: 'text',
      operator: 'like',
    },
    'current_stock': {
      title: 'Stok Saat Ini',
      type: 'number',
      operator: 'range',
    },
    'reserved_stock': {
      title: 'Stok Terpesan',
      type: 'number',
      operator: 'range',
    },
    'min_stock_level': {
      title: 'Level Stok Minimum',
      type: 'number',
      operator: 'range',
    },
    'max_stock_level': {
      title: 'Level Stok Maksimum',
      type: 'number',
      operator: 'range',
    },
    'created_at': {
      title: 'Tanggal Dibuat',
      type: 'date',
      operator: 'range',
    },
  }
})

const filterFields = computed(() => {
  return allowedFields.map(field => ({
    value: field,
    title: fieldConfigs.value[field]?.title || field,
  }))
})

// Dynamic filter configuration
const filterConfig = computed(() => ({
  fields: filterFields.value,
  fieldConfigs: fieldConfigs.value,
}))

// Computed property to control no-data display
const shouldShowNoData = computed(() => {
  return !loading.value && initialLoadCompleted.value && inventoryItems.value.length === 0
})

const perPageOptions = [
  { value: 5, title: '5' },
  { value: 10, title: '10' },
  { value: 15, title: '15' },
  { value: 20, title: '20' },
  { value: -1, title: 'All' },
]

const headers = [
  { title: 'No', key: 'no', sortable: false },
  { title: 'Produk', key: 'product' },
  { title: 'Central Warehouse', key: 'central_warehouse' },
  { title: 'Stok Saat Ini', key: 'current_stock' },
  { title: 'Stok Terpesan', key: 'reserved_stock' },
  { title: 'Stok Tersedia', key: 'available_stock', sortable: false },
  { title: 'Level Stok', key: 'stock_levels', sortable: false },
  { title: 'Tanggal Dibuat', key: 'created_at' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

// Functions
async function fetchInventoryItems() {
  loading.value = true
  console.log('🔄 Starting fetchInventoryItems...')
  
  try {
    const requestBody = {
      page: page.value,
      per_page: itemsPerPage.value === -1 ? 1000 : itemsPerPage.value,
      sort_by: sortBy.value,
      sort_order: orderBy.value,
    }

    // Add filters if any
    if (currentFilters.value.length > 0) {
      requestBody.filters = currentFilters.value
    }

    // Add quick search if exists
    if (currentQuickSearch.value?.trim()) {
      if (!requestBody.filters) requestBody.filters = []
      requestBody.filters.push({
        search_by: 'product.sku',
        filter_type: 'like',
        search_query: currentQuickSearch.value.trim(),
      })
    }

    console.log('📤 API Request body:', requestBody)
    
    const res = await $api('/wms/central-inventory/paginated', {
      method: 'POST',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    console.log('📊 Response data structure:', {
      hasData: !!res.data,
      isArray: Array.isArray(res.data),
      hasNestedData: !!(res.data && res.data.data),
      sampleItem: res.data?.[0] || res.data?.data?.rows?.[0]
    })
    
    // Handle the API response structure correctly
    if (res.data && Array.isArray(res.data)) {
      // Direct array response
      inventoryItems.value = res.data
      totalInventoryItems.value = res.meta?.total || res.data.length
    } else if (res.data && res.data.data) {
      // Nested data structure
      inventoryItems.value = res.data.data.rows || []
      totalInventoryItems.value = res.data.data.count || 0
    } else {
      // Fallback
      inventoryItems.value = res.data?.rows || []
      totalInventoryItems.value = res.data?.count || 0
    }
    
    console.log('✅ Inventory items loaded:', inventoryItems.value.length, 'total:', totalInventoryItems.value)
    console.log('📊 Sample inventory item:', inventoryItems.value[0])
    
    // Fetch central warehouse details for each inventory item
    if (inventoryItems.value.length > 0) {
      console.log('🔄 Fetching central warehouse details...')
      await fetchCentralWarehouseDetails()
    }
  } catch (error) {
    console.error('❌ Error fetching inventory items:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Inventori',
      text: 'Tidak dapat memuat data inventori pusat. Silakan coba lagi.',
    })
    inventoryItems.value = []
    totalInventoryItems.value = 0
  } finally {
    loading.value = false
    initialLoadCompleted.value = true
    console.log('🏁 fetchInventoryItems completed')
  }
}

async function fetchCentralWarehouseDetails() {
  try {
    console.log('🔍 All inventory items:', inventoryItems.value)
    
    // Check all possible field names for warehouse ID
    const sampleItem = inventoryItems.value[0]
    console.log('🔍 Sample item fields:', Object.keys(sampleItem || {}))
    console.log('🔍 Sample item central_warehouse_id:', sampleItem?.central_warehouse_id)
    console.log('🔍 Sample item central_warehouse:', sampleItem?.central_warehouse)
    console.log('🔍 All items central_warehouse_id values:', inventoryItems.value.map(item => item.central_warehouse_id))
    
    // Check if warehouse data is already included
    const itemsWithWarehouseData = inventoryItems.value.filter(item => item.central_warehouse)
    console.log('🔍 Items with existing warehouse data:', itemsWithWarehouseData.length)
    
    // Get unique central warehouse IDs
    const warehouseIds = [...new Set(inventoryItems.value
      .filter(item => item.central_warehouse_id)
      .map(item => item.central_warehouse_id))]
    
    console.log('📋 Unique warehouse IDs to fetch:', warehouseIds)
    console.log('🔍 Items with warehouse IDs:', inventoryItems.value.filter(item => item.central_warehouse_id))
    
    if (warehouseIds.length === 0) {
      console.log('⚠️ No warehouse IDs found')
      return
    }
    
    // Fetch warehouse details for each unique ID
    const warehouseDetails = {}
    
    for (const warehouseId of warehouseIds) {
      try {
        const res = await $api(`/central-warehouses/${warehouseId}`)
        warehouseDetails[warehouseId] = res.data
        console.log(`✅ Fetched warehouse ${warehouseId}:`, res.data)
      } catch (error) {
        console.error(`❌ Error fetching warehouse ${warehouseId}:`, error)
        warehouseDetails[warehouseId] = null
      }
    }
    
    // Update inventory items with warehouse details
    inventoryItems.value = inventoryItems.value.map(item => ({
      ...item,
      central_warehouse: warehouseDetails[item.central_warehouse_id] || item.central_warehouse || null
    }))
    
    console.log('✅ Updated inventory items with warehouse details')
    console.log('📊 Final sample item:', inventoryItems.value[0])
  } catch (error) {
    console.error('❌ Error fetching central warehouse details:', error)
  }
}

function handleApplyFilters({ filters, quickSearch }) {
  currentFilters.value = filters
  currentQuickSearch.value = quickSearch
  page.value = 1
  fetchInventoryItems()
}

function handleClearFilters() {
  currentFilters.value = []
  currentQuickSearch.value = ''
  page.value = 1
  fetchInventoryItems()
}

function handleApplyQuickSearch(searchQuery) {
  currentQuickSearch.value = searchQuery
  page.value = 1
  fetchInventoryItems()
}

function onUpdateOptions(options) {
  if (options.page !== page.value) page.value = options.page
  if (options.itemsPerPage !== itemsPerPage.value) itemsPerPage.value = options.itemsPerPage
  
  // Handle sorting - just update the values, let the watcher handle fetching
  if (options.sortBy && options.sortBy.length > 0) {
    const sortItem = options.sortBy[0]

    sortBy.value = sortItem.key
    orderBy.value = sortItem.order
  }
}

function formatCurrency(amount) {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

// Watchers
watch([page, itemsPerPage, sortBy, orderBy], () => {
  // Only fetch if component is already mounted and not in initial loading
  if (initialLoadCompleted.value) {
    fetchInventoryItems()
  }
})

// Always refresh data when component becomes active
onActivated(() => {
  console.log('🎯 Component onActivated triggered')

  // Only fetch if we don't have data and initial load is completed
  if (inventoryItems.value.length === 0 && initialLoadCompleted.value) {
    fetchInventoryItems()
  }
})

// Initialize filter config
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')

  // Ensure loading is true for initial load
  loading.value = true
  
  // Only fetch inventory items once on mount
  fetchInventoryItems()
})
</script>

<style scoped>
.v-table {
  width: 100%;
  border-collapse: collapse;
}

.v-table th, .v-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.v-table th {
  background: #f5f5f5;
}

.text-center {
  text-align: center;
}
</style> 
 