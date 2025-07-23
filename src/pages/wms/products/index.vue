<route lang="yaml">
meta:
  layout: default
  navActiveLink: wms-products
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Produk"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      quick-search-placeholder="Cari SKU, nama, brand, atau deskripsi..."
      :quick-search-fields="['sku', 'name', 'brand', 'description']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
    >
      <template #actions>
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          :to="{ name: 'wms-products-create' }"
        >
          Tambah Produk
        </VBtn>
      </template>
    </DynamicFilter>
    
    <VDivider />
    <VDataTableServer
      :headers="headers"
      :items="products"
      :items-length="totalProducts"
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
      <template #item.name="{ item }">
        <VBtn
          variant="text"
          color="primary"
          class="font-weight-medium pa-0 text-none"
          :to="{ name: 'wms-products-id', params: { id: item.id } }"
        >
          {{ item?.name || '-' }}
        </VBtn>
      </template>
      <template #item.sku="{ item }">
        <VChip
          v-if="item && item.sku"
          color="primary"
          size="small"
          label
        >
          {{ item.sku }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.category="{ item }">
        <div v-if="item && item.category" class="d-flex align-center gap-2">
          <VChip
            :color="getCategoryColor(item.category.code)"
            size="small"
            label
          >
            {{ item.category.code }}
          </VChip>
          <span class="text-body-2">{{ item.category.name }}</span>
        </div>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.product_type="{ item }">
        <VChip
          v-if="item && item.product_type"
          :color="getProductTypeColor(item.product_type)"
          size="small"
          label
        >
          {{ getProductTypeLabel(item.product_type) }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.storage_requirement="{ item }">
        <VChip
          v-if="item && item.storage_requirement"
          :color="getStorageColor(item.storage_requirement)"
          size="small"
          label
        >
          {{ getStorageLabel(item.storage_requirement) }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.is_serialized="{ item }">
        <VChip
          v-if="item"
          :color="item.is_serialized ? 'success' : 'warning'"
          size="small"
          label
        >
          {{ item.is_serialized ? 'Serialized' : 'Non-Serialized' }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.is_batch_tracked="{ item }">
        <VChip
          v-if="item"
          :color="item.is_batch_tracked ? 'success' : 'warning'"
          size="small"
          label
        >
          {{ item.is_batch_tracked ? 'Batch Tracked' : 'Non-Batch' }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.is_prescription_required="{ item }">
        <VChip
          v-if="item"
          :color="item.is_prescription_required ? 'error' : 'success'"
          size="small"
          label
        >
          {{ item.is_prescription_required ? 'Prescription' : 'OTC' }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.is_active="{ item }">
        <VChip
          v-if="item"
          :color="item.is_active ? 'success' : 'error'"
          size="small"
          label
        >
          {{ item.is_active ? 'Aktif' : 'Nonaktif' }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
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
            :to="{ name: 'wms-products-id', params: { id: item.id } }"
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
            {{ paginationMeta({ page: page, itemsPerPage: itemsPerPage }, totalProducts) }}
          </div>
          <TablePagination
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalProducts"
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

// State
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref('created_at')
const orderBy = ref('desc')
const loading = ref(true) // Start with loading true for initial load
const initialLoadCompleted = ref(false)

const products = ref([])
const totalProducts = ref(0)
const currentFilters = ref([])
const currentQuickSearch = ref('')

// Reactive field configurations
const allowedFields = [
  'sku',
  'name',
  'brand',
  'description',
  'category_id',
  'product_type',
  'unit_of_measure',
  'storage_requirement',
  'is_serialized',
  'is_batch_tracked',
  'is_prescription_required',
  'is_active',
  'created_at',
]

const categoryOptions = ref([])

const fieldConfigs = computed(() => {
  return {
    'sku': {
      title: 'SKU',
      type: 'text',
      operator: 'like',
    },
    'name': {
      title: 'Nama Produk',
      type: 'text',
      operator: 'like',
    },
    'brand': {
      title: 'Brand',
      type: 'text',
      operator: 'like',
    },
    'description': {
      title: 'Deskripsi',
      type: 'text',
      operator: 'like',
    },
    'category_id': {
      title: 'Kategori',
      type: 'select',
      operator: 'equal',
      options: categoryOptions.value,
    },
    'product_type': {
      title: 'Tipe Produk',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Habis Pakai', value: 'CONSUMABLE' },
        { title: 'Tidak Habis Pakai', value: 'NON_CONSUMABLE' },
      ],
    },
    'unit_of_measure': {
      title: 'Satuan',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'BOTTLE', value: 'BOTTLE' },
        { title: 'JAR', value: 'JAR' },
        { title: 'TUBE', value: 'TUBE' },
        { title: 'UNIT', value: 'UNIT' },
        { title: 'VIAL', value: 'VIAL' },
        { title: 'SYRINGE', value: 'SYRINGE' },
        { title: 'PCS', value: 'PCS' },
      ],
    },
    'storage_requirement': {
      title: 'Persyaratan Penyimpanan',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Suhu Ruangan', value: 'ROOM_TEMP' },
        { title: 'Didinginkan', value: 'REFRIGERATED' },
        { title: 'Beku', value: 'FROZEN' },
      ],
    },
    'is_serialized': {
      title: 'Berseri',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Berseri', value: true },
        { title: 'Tidak Berseri', value: false },
      ],
    },
    'is_batch_tracked': {
      title: 'Pelacakan Batch',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Dilacak Batch', value: true },
        { title: 'Tidak Dilacak', value: false },
      ],
    },
    'is_prescription_required': {
      title: 'Resep Diperlukan',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Resep Diperlukan', value: true },
        { title: 'Bebas', value: false },
      ],
    },
    'is_active': {
      title: 'Status',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Aktif', value: true },
        { title: 'Nonaktif', value: false },
      ],
    },
    'created_at': {
      title: 'Tanggal Dibuat',
      type: 'date',
      operator: 'date',
    },
  }
})

const filterFields = computed(() => {
  return allowedFields.map(field => ({
    title: fieldConfigs.value[field]?.title || field,
    value: field,
    type: fieldConfigs.value[field]?.type || 'text',
    ...fieldConfigs.value[field],
  }))
})

// Dynamic filter configuration
const filterConfig = computed(() => ({
  fields: filterFields.value,
  fieldConfigs: fieldConfigs.value,
}))

// Computed property to control no-data display
const shouldShowNoData = computed(() => {
  return !loading.value && initialLoadCompleted.value && products.value.length === 0
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
  { title: 'Nama Produk', key: 'name' },
  { title: 'SKU', key: 'sku' },
  { title: 'Brand', key: 'brand' },
  { title: 'Kategori', key: 'category' },
  { title: 'Tipe Produk', key: 'product_type' },
  { title: 'Satuan', key: 'unit_of_measure' },
  { title: 'Penyimpanan', key: 'storage_requirement' },
  { title: 'Serialized', key: 'is_serialized', sortable: false },
  { title: 'Batch Tracked', key: 'is_batch_tracked', sortable: false },
  { title: 'Prescription', key: 'is_prescription_required', sortable: false },
  { title: 'Status', key: 'is_active', sortable: false },
  { title: 'Tanggal Dibuat', key: 'created_at' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

// Functions
async function fetchProducts() {
  loading.value = true
  console.log('🔄 Starting fetchProducts...')
  
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
        search_by: 'name',
        filter_type: 'like',
        search_query: currentQuickSearch.value.trim(),
      })
    }

    console.log('📤 API Request body:', requestBody)
    
    const res = await $api('/wms/products/paginated', {
      method: 'POST',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    
    // Handle the API response structure correctly
    if (res.data && Array.isArray(res.data)) {
      products.value = res.data || []
      totalProducts.value = res.meta?.total || 0
    } else if (res.data && res.data.data) {
      products.value = res.data.data || []
      totalProducts.value = res.data.meta?.total || 0
    } else {
      products.value = res.data || []
      totalProducts.value = res.meta?.total || 0
    }
    
    console.log('✅ Products loaded:', products.value.length, 'total:', totalProducts.value)
  } catch (error) {
    console.error('❌ Error fetching products:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Produk',
      text: 'Tidak dapat memuat data produk. Silakan coba lagi.',
    })
    products.value = []
    totalProducts.value = 0
  } finally {
    loading.value = false
    initialLoadCompleted.value = true
    console.log('🏁 fetchProducts completed')
  }
}

async function fetchCategories() {
  try {
    const res = await $api('/wms/product-categories', {
      method: 'GET',
    })
    
    if (res.data && Array.isArray(res.data)) {
      const options = res.data.map(category => ({
        title: category.name,
        value: category.id,
      }))
      
      categoryOptions.value = options
    }
  } catch (error) {
    console.error('❌ Error fetching categories:', error)
  }
}

function handleApplyFilters({ filters, quickSearch }) {
  currentFilters.value = filters
  currentQuickSearch.value = quickSearch
  page.value = 1
  fetchProducts()
}

function handleClearFilters() {
  currentFilters.value = []
  currentQuickSearch.value = ''
  page.value = 1
  fetchProducts()
}

function handleApplyQuickSearch(searchQuery) {
  currentQuickSearch.value = searchQuery
  page.value = 1
  fetchProducts()
}

function onUpdateOptions(options) {
  if (options.page !== page.value) page.value = options.page
  if (options.itemsPerPage !== itemsPerPage.value) itemsPerPage.value = options.itemsPerPage
  
  // Handle sorting - just update the values, let the watcher handle fetching
  if (options.sortBy && options.sortBy.length > 0) {
    const sortItem = options.sortBy[0]

    sortBy.value = sortItem.key
    orderBy.value = sortItem.order

    // Remove direct fetch call - let the watcher handle it
  }
}

function getCategoryColor(categoryCode) {
  switch (categoryCode) {
  case 'MEDICINE': return 'primary'
  case 'EQUIPMENT': return 'success'
  case 'COSMETIC': return 'warning'
  case 'DISPOSABLE': return 'info'
  case 'SUPPLEMENT': return 'purple'
  case 'SKINCARE': return 'pink'
  default: return 'secondary'
  }
}

function getProductTypeColor(productType) {
  switch (productType) {
  case 'CONSUMABLE': return 'primary'
  case 'NON_CONSUMABLE': return 'success'
  default: return 'secondary'
  }
}

function getProductTypeLabel(productType) {
  switch (productType) {
  case 'CONSUMABLE': return 'Habis Pakai'
  case 'NON_CONSUMABLE': return 'Tidak Habis Pakai'
  default: return productType
  }
}

function getStorageColor(storageRequirement) {
  switch (storageRequirement) {
  case 'ROOM_TEMP': return 'success'
  case 'REFRIGERATED': return 'info'
  case 'FROZEN': return 'primary'
  default: return 'secondary'
  }
}

function getStorageLabel(storageRequirement) {
  switch (storageRequirement) {
  case 'ROOM_TEMP': return 'Suhu Ruangan'
  case 'REFRIGERATED': return 'Didinginkan'
  case 'FROZEN': return 'Beku'
  default: return storageRequirement
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

// Watchers
watch([page, itemsPerPage, sortBy, orderBy], () => {
  // Only fetch if component is already mounted and not in initial loading
  if (initialLoadCompleted.value) {
    fetchProducts()
  }
})

// Always refresh data when component becomes active
onActivated(() => {
  console.log('🎯 Component onActivated triggered')

  // Only fetch if we don't have data and initial load is completed
  if (products.value.length === 0 && initialLoadCompleted.value) {
    fetchProducts()
  }
})

// Initialize filter config
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')

  // Ensure loading is true for initial load
  loading.value = true
  
  // Fetch categories for filter options
  await fetchCategories()
  
  // Only fetch products once on mount
  fetchProducts()
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
 