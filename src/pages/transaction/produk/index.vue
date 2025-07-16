<route lang="yaml">
meta:
  layout: default
  navActiveLink: transaction-produk
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Produk"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      quick-search-placeholder="Cari berdasarkan instruksi..."
      :quick-search-fields="['instructions']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
    >
      <template #actions>
        <!-- Create button removed as per requirement -->
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

      <template #item.unit_cost="{ item }">
        {{ formatCurrency(item.unit_cost) }}
      </template>
      <template #item.unit_price="{ item }">
        {{ formatCurrency(item.unit_price) }}
      </template>
      <template #item.total_price="{ item }">
        {{ formatCurrency(item.total_price) }}
      </template>
      <template #item.usage_type="{ item }">
        <VChip
          :color="getUsageTypeColor(item.usage_type)"
          size="small"
          label
        >
          {{ getUsageTypeText(item.usage_type) }}
        </VChip>
      </template>
      <template #item.dispensed_at="{ item }">
        {{ formatDate(item.dispensed_at) }}
      </template>
      <template #item.expiry_date="{ item }">
        {{ formatDate(item.expiry_date) }}
      </template>
      <template #item.created_at="{ item }">
        {{ formatDateTime(item.created_at) }}
      </template>
      <template #item.visit_status="{ item }">
        <VChip
          :color="getVisitStatusColor(item.visit?.status)"
          size="small"
          label
        >
          {{ getVisitStatusText(item.visit?.status) }}
        </VChip>
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex gap-2">
          <VBtn
            icon="tabler-eye"
            size="small"
            variant="text"
            color="primary"
            :to="{ name: 'transaction-produk-id', params: { id: item.id } }"
            title="Lihat Detail"
          />
          <!-- Edit button removed as per requirement -->
          <!-- Billing button removed as route might not exist -->
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
  'instructions',
  'usage_type',
  'prescribed_by',
  'dispensed_by',
  'batch_number',
]

const fieldConfigs = computed(() => {
  return {
    'instructions': {
      title: 'Instruksi',
      type: 'text',
      operator: 'like',
    },
    'usage_type': {
      title: 'Tipe Penggunaan',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Resep', value: 'PRESCRIPTION' },
        { title: 'Konsumsi Perawatan', value: 'TREATMENT_CONSUMPTION' },
      ],
    },
    'prescribed_by': {
      title: 'Diresepkan Oleh',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Dokter 1', value: 1 },
        { title: 'Dokter 2', value: 2 },
        { title: 'Dokter 3', value: 3 },
        { title: 'Dokter 4', value: 4 },
        { title: 'Dokter 5', value: 5 },
      ],
    },
    'dispensed_by': {
      title: 'Dibagikan Oleh',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Apoteker 1', value: 1 },
        { title: 'Apoteker 2', value: 2 },
        { title: 'Apoteker 3', value: 3 },
        { title: 'Apoteker 4', value: 4 },
      ],
    },
    'batch_number': {
      title: 'Nomor Batch',
      type: 'text',
      operator: 'like',
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
  { title: 'Tipe Penggunaan', key: 'usage_type' },
  { title: 'Jumlah', key: 'quantity' },
  { title: 'Harga Satuan', key: 'unit_price' },
  { title: 'Total Harga', key: 'total_price' },
  { title: 'Nomor Batch', key: 'batch_number' },
  { title: 'Tanggal Kadaluarsa', key: 'expiry_date' },
  { title: 'Tanggal Dibagikan', key: 'dispensed_at' },
  { title: 'Instruksi', key: 'instructions' },
  { title: 'Status Kunjungan', key: 'visit_status' },
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
        search_by: 'instructions',
        filter_type: 'like',
        search_query: currentQuickSearch.value.trim(),
      })
    }

    console.log('📤 API Request body:', requestBody)
    
    const res = await $api('/rme/visit-products/paginated', {
      method: 'POST',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    
    products.value = res.data || []
    totalProducts.value = res.meta?.total || 0
    
    console.log('✅ Products loaded:', products.value.length, 'total:', totalProducts.value)
    console.log('📋 Sample product data:', products.value[0])
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

function getUsageTypeColor(type) {
  switch (type) {
  case 'PRESCRIPTION': return 'primary'
  case 'TREATMENT_CONSUMPTION': return 'success'
  default: return 'secondary'
  }
}

function getUsageTypeText(type) {
  switch (type) {
  case 'PRESCRIPTION': return 'Resep'
  case 'TREATMENT_CONSUMPTION': return 'Konsumsi Perawatan'
  default: return type
  }
}

function getVisitStatusColor(status) {
  switch (status) {
  case 'COMPLETED': return 'success'
  case 'IN_PROGRESS': return 'warning'
  case 'CANCELLED': return 'error'
  default: return 'secondary'
  }
}

function getVisitStatusText(status) {
  switch (status) {
  case 'COMPLETED': return 'Selesai'
  case 'IN_PROGRESS': return 'Sedang Berlangsung'
  case 'CANCELLED': return 'Dibatalkan'
  default: return status || '-'
  }
}

function formatCurrency(amount) {
  if (!amount) return 'Rp 0'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleDateString('id-ID')
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
