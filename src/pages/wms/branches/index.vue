<route lang="yaml">
meta:
  layout: default
  navActiveLink: wms-branches
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Cabang"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      quick-search-placeholder="Cari nama, kode, telepon, atau email..."
      :quick-search-fields="['name', 'code', 'phone', 'email']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
    >
      <template #actions>
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          :to="{ name: 'wms-branches-create' }"
        >
          Tambah Cabang
        </VBtn>
      </template>
    </DynamicFilter>
    
    <VDivider />
    <VDataTableServer
      :headers="headers"
      :items="branches"
      :items-length="totalBranches"
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
        <span class="font-weight-medium">{{ item?.name || '-' }}</span>
      </template>
      <template #item.type="{ item }">
        <VChip
          v-if="item && item.type"
          :color="getTypeColor(item.type)"
          size="small"
          label
        >
          {{ item.type }}
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
      <template #item.auto_reorder_enabled="{ item }">
        <VChip
          v-if="item"
          :color="item.auto_reorder_enabled ? 'success' : 'warning'"
          size="small"
          label
        >
          {{ item.auto_reorder_enabled ? 'Diaktifkan' : 'Dinonaktifkan' }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.created_at="{ item }">
        {{ item && item.created_at ? formatDateTime(item.created_at) : '-' }}
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
            tabler-building
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
            {{ paginationMeta({ page: page, itemsPerPage: itemsPerPage }, totalBranches) }}
          </div>
          <TablePagination
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalBranches"
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

const branches = ref([])
const totalBranches = ref(0)
const currentFilters = ref([])
const currentQuickSearch = ref('')

// Reactive field configurations
const allowedFields = [
  'name',
  'code', 
  'type',
  'phone',
  'email',
  'address',
  'is_active',
  'auto_reorder_enabled',
  'created_at',
]

const fieldConfigs = computed(() => {
  return {
    'name': {
      title: 'Nama Cabang',
      type: 'text',
      operator: 'like',
    },
    'code': {
      title: 'Kode Cabang',
      type: 'text',
      operator: 'like',
    },
    'type': {
      title: 'Tipe Cabang',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'FLAGSHIP', value: 'FLAGSHIP' },
        { title: 'STANDARD', value: 'STANDARD' },
        { title: 'MINI', value: 'MINI' },
      ],
    },
    'phone': {
      title: 'Telepon',
      type: 'tel',
      operator: 'like',
    },
    'email': {
      title: 'Email',
      type: 'email',
      operator: 'like',
    },
    'address': {
      title: 'Alamat',
      type: 'text',
      operator: 'like',
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
    'auto_reorder_enabled': {
      title: 'Auto Reorder',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Diaktifkan', value: true },
        { title: 'Dinonaktifkan', value: false },
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
  return !loading.value && initialLoadCompleted.value && branches.value.length === 0
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
  { title: 'Nama Cabang', key: 'name' },
  { title: 'Kode', key: 'code' },
  { title: 'Tipe', key: 'type' },
  { title: 'Alamat', key: 'address' },
  { title: 'Telepon', key: 'phone' },
  { title: 'Email', key: 'email' },
  { title: 'Kapasitas', key: 'max_stock_capacity_m3' },
  { title: 'Auto Reorder', key: 'auto_reorder_enabled', sortable: false },
  { title: 'Status', key: 'is_active', sortable: false },
  { title: 'Tanggal Dibuat', key: 'created_at' },
]

// Functions
async function fetchBranches() {
  loading.value = true
  console.log('🔄 Starting fetchBranches...')
  
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
    
    const res = await $api('/wms/branches/paginated', {
      method: 'POST',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    
    // Handle the API response structure correctly
    if (res.data && res.data.data) {
      branches.value = res.data.data.rows || []
      totalBranches.value = res.data.data.count || 0
    } else {
      branches.value = res.data?.rows || []
      totalBranches.value = res.data?.count || 0
    }
    
    console.log('✅ Branches loaded:', branches.value.length, 'total:', totalBranches.value)
  } catch (error) {
    console.error('❌ Error fetching branches:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Cabang',
      text: 'Tidak dapat memuat data cabang. Silakan coba lagi.',
    })
    branches.value = []
    totalBranches.value = 0
  } finally {
    loading.value = false
    initialLoadCompleted.value = true
    console.log('🏁 fetchBranches completed')
  }
}

function handleApplyFilters({ filters, quickSearch }) {
  currentFilters.value = filters
  currentQuickSearch.value = quickSearch
  page.value = 1
  fetchBranches()
}

function handleClearFilters() {
  currentFilters.value = []
  currentQuickSearch.value = ''
  page.value = 1
  fetchBranches()
}

function handleApplyQuickSearch(searchQuery) {
  currentQuickSearch.value = searchQuery
  page.value = 1
  fetchBranches()
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



function getTypeColor(type) {
  switch (type) {
  case 'FLAGSHIP': return 'primary'
  case 'STANDARD': return 'success'
  case 'MINI': return 'warning'
  default: return 'secondary'
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
    fetchBranches()
  }
})

// Always refresh data when component becomes active
onActivated(() => {
  console.log('🎯 Component onActivated triggered')

  // Only fetch if we don't have data and initial load is completed
  if (branches.value.length === 0 && initialLoadCompleted.value) {
    fetchBranches()
  }
})

// Initialize filter config
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')

  // Ensure loading is true for initial load
  loading.value = true
  
  // Only fetch branches once on mount
  fetchBranches()
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
