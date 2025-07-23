<route lang="yaml">
meta:
  layout: default
  navActiveLink: wms-regional-warehouses
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Gudang Regional"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      quick-search-placeholder="Cari nama, kode, atau alamat..."
      :quick-search-fields="['name', 'code', 'address']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
    >
      <template #actions>
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          :to="{ name: 'wms-regional-warehouses-create' }"
        >
          Tambah Gudang Regional
        </VBtn>
      </template>
    </DynamicFilter>
    
    <VDivider />
    <VDataTableServer
      :headers="headers"
      :items="regionalWarehouses"
      :items-length="totalRegionalWarehouses"
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
          :to="{ name: 'wms-regional-warehouses-id', params: { id: item.id } }"
        >
          {{ item?.name || '-' }}
        </VBtn>
      </template>
      <template #item.code="{ item }">
        <VChip
          v-if="item && item.code"
          color="primary"
          size="small"
          label
        >
          {{ item.code }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.region="{ item }">
        <VChip
          v-if="item && item.region"
          :color="getRegionColor(item.region)"
          size="small"
          label
        >
          {{ item.region }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.address="{ item }">
        <div class="text-body-2">
          {{ item?.address || '-' }}
        </div>
      </template>
      <template #item.central_warehouse_id="{ item }">
        <span v-if="item && item.central_warehouse_id" class="text-body-2">
          {{ getCentralWarehouseName(item.central_warehouse_id) }}
        </span>
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
            :to="{ name: 'wms-regional-warehouses-id', params: { id: item.id } }"
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
            tabler-building-warehouse
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
            {{ paginationMeta({ page: page, itemsPerPage: itemsPerPage }, totalRegionalWarehouses) }}
          </div>
          <TablePagination
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalRegionalWarehouses"
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

const regionalWarehouses = ref([])
const totalRegionalWarehouses = ref(0)
const currentFilters = ref([])
const currentQuickSearch = ref('')
const centralWarehouses = ref([])

// Reactive field configurations
const allowedFields = [
  'name',
  'code', 
  'region',
  'address',
  'central_warehouse_id',
  'created_at',
]

const fieldConfigs = computed(() => {
  return {
    'name': {
      title: 'Nama Gudang Regional',
      type: 'text',
      operator: 'like',
    },
    'code': {
      title: 'Kode Gudang Regional',
      type: 'text',
      operator: 'like',
    },
    'region': {
      title: 'Region',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'JABODETABEK', value: 'JABODETABEK' },
        { title: 'JAWA_BARAT', value: 'JAWA_BARAT' },
        { title: 'JAWA_TIMUR', value: 'JAWA_TIMUR' },
        { title: 'JAWA_TENGAH', value: 'JAWA_TENGAH' },
        { title: 'SUMATERA_UTARA', value: 'SUMATERA_UTARA' },
        { title: 'SUMATERA_SELATAN', value: 'SUMATERA_SELATAN' },
        { title: 'KALIMANTAN', value: 'KALIMANTAN' },
        { title: 'SULAWESI', value: 'SULAWESI' },
        { title: 'PAPUA', value: 'PAPUA' },
      ],
    },
    'address': {
      title: 'Alamat',
      type: 'text',
      operator: 'like',
    },
    'central_warehouse_id': {
      title: 'Gudang Pusat',
      type: 'select',
      operator: 'equal',
      options: [], // Will be populated from API
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
  return !loading.value && initialLoadCompleted.value && regionalWarehouses.value.length === 0
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
  { title: 'Nama Gudang Regional', key: 'name' },
  { title: 'Kode', key: 'code' },
  { title: 'Region', key: 'region' },
  { title: 'Alamat', key: 'address' },
  { title: 'Gudang Pusat', key: 'central_warehouse_id' },
  { title: 'Tanggal Dibuat', key: 'created_at' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

// Functions
async function fetchRegionalWarehouses() {
  loading.value = true
  console.log('🔄 Starting fetchRegionalWarehouses...')
  
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
    
    const res = await $api('/wms/regional-warehouses/paginated', {
      method: 'POST',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    
    // Handle the API response structure correctly
    if (res.data && Array.isArray(res.data)) {
      regionalWarehouses.value = res.data || []
      totalRegionalWarehouses.value = res.meta?.total || 0
    } else if (res.data && res.data.data) {
      regionalWarehouses.value = res.data.data || []
      totalRegionalWarehouses.value = res.data.meta?.total || 0
    } else {
      regionalWarehouses.value = res.data || []
      totalRegionalWarehouses.value = res.meta?.total || 0
    }
    
    console.log('✅ Regional Warehouses loaded:', regionalWarehouses.value.length, 'total:', totalRegionalWarehouses.value)
  } catch (error) {
    console.error('❌ Error fetching regional warehouses:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Regional Warehouse',
      text: 'Tidak dapat memuat data regional warehouse. Silakan coba lagi.',
    })
    regionalWarehouses.value = []
    totalRegionalWarehouses.value = 0
  } finally {
    loading.value = false
    initialLoadCompleted.value = true
    console.log('🏁 fetchRegionalWarehouses completed')
  }
}

async function fetchCentralWarehouses() {
  try {
    const res = await $api('/central-warehouses', {
      method: 'GET',
    })
    
    if (res.data && Array.isArray(res.data)) {
      centralWarehouses.value = res.data
      const centralWarehouseOptions = res.data.map(warehouse => ({
        title: warehouse.name,
        value: warehouse.id,
      }))
      
      // Update the field configs with central warehouse options
      fieldConfigs.value.central_warehouse_id.options = centralWarehouseOptions
    }
  } catch (error) {
    console.error('❌ Error fetching central warehouses:', error)
  }
}

function handleApplyFilters({ filters, quickSearch }) {
  currentFilters.value = filters
  currentQuickSearch.value = quickSearch
  page.value = 1
  fetchRegionalWarehouses()
}

function handleClearFilters() {
  currentFilters.value = []
  currentQuickSearch.value = ''
  page.value = 1
  fetchRegionalWarehouses()
}

function handleApplyQuickSearch(searchQuery) {
  currentQuickSearch.value = searchQuery
  page.value = 1
  fetchRegionalWarehouses()
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

function getRegionColor(region) {
  switch (region) {
  case 'JABODETABEK': return 'primary'
  case 'JAWA_BARAT': return 'success'
  case 'JAWA_TIMUR': return 'warning'
  case 'JAWA_TENGAH': return 'info'
  case 'SUMATERA_UTARA': return 'error'
  case 'SUMATERA_SELATAN': return 'secondary'
  case 'KALIMANTAN': return 'purple'
  case 'SULAWESI': return 'orange'
  case 'PAPUA': return 'brown'
  default: return 'secondary'
  }
}

function getCentralWarehouseName(centralWarehouseId) {
  const centralWarehouse = centralWarehouses.value.find(cw => cw.id === centralWarehouseId)
  return centralWarehouse ? centralWarehouse.name : '-'
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

// Watchers
watch([page, itemsPerPage, sortBy, orderBy], () => {
  // Only fetch if component is already mounted and not in initial loading
  if (initialLoadCompleted.value) {
    fetchRegionalWarehouses()
  }
})

// Always refresh data when component becomes active
onActivated(() => {
  console.log('🎯 Component onActivated triggered')

  // Only fetch if we don't have data and initial load is completed
  if (regionalWarehouses.value.length === 0 && initialLoadCompleted.value) {
    fetchRegionalWarehouses()
  }
})

// Initialize filter config
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')

  // Ensure loading is true for initial load
  loading.value = true
  
  // Fetch central warehouses for filter options
  await fetchCentralWarehouses()
  
  // Only fetch regional warehouses once on mount
  fetchRegionalWarehouses()
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
 