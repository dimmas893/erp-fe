<route lang="yaml">
meta:
  layout: default
  navActiveLink: crm-services
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Layanan"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      quick-search-placeholder="Cari kode, nama, atau deskripsi layanan..."
      :quick-search-fields="['code', 'name', 'description']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
    >
      <template #actions>
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          :to="{ name: 'crm-services-create' }"
        >
          Tambah Layanan
        </VBtn>
      </template>
    </DynamicFilter>
    
    <VDivider />
    <VDataTableServer
      :headers="headers"
      :items="services"
      :items-length="totalServices"
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
          :to="{ name: 'crm-services-id', params: { id: item.id } }"
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
      <template #item.service_type="{ item }">
        <VChip
          v-if="item && item.service_type"
          :color="getServiceTypeColor(item.service_type)"
          size="small"
          label
        >
          {{ getServiceTypeLabel(item.service_type) }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.duration_minutes="{ item }">
        <span v-if="item && item.duration_minutes !== null" class="font-weight-medium">
          {{ item.duration_minutes }} menit
        </span>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.is_billable="{ item }">
        <VChip
          v-if="item"
          :color="item.is_billable ? 'success' : 'warning'"
          size="small"
          label
        >
          {{ item.is_billable ? 'Berbayar' : 'Tidak Berbayar' }}
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
            :to="{ name: 'crm-services-id', params: { id: item.id } }"
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
            tabler-stethoscope
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
            {{ paginationMeta({ page: page, itemsPerPage: itemsPerPage }, totalServices) }}
          </div>
          <TablePagination
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalServices"
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

const services = ref([])
const totalServices = ref(0)
const currentFilters = ref([])
const currentQuickSearch = ref('')

// Reactive field configurations
const allowedFields = [
  'code',
  'name',
  'service_type',
  'description',
  'duration_minutes',
  'is_billable',
  'is_active',
  'created_at',
]

const fieldConfigs = computed(() => {
  return {
    'code': {
      title: 'Kode Layanan',
      type: 'text',
      operator: 'like',
    },
    'name': {
      title: 'Nama Layanan',
      type: 'text',
      operator: 'like',
    },
    'service_type': {
      title: 'Tipe Layanan',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Konsultasi', value: 'CONSULTATION' },
        { title: 'Administrasi', value: 'ADMIN' },
        { title: 'Dukungan', value: 'SUPPORT' },
        { title: 'Lainnya', value: 'OTHER' },
      ],
    },
    'description': {
      title: 'Deskripsi',
      type: 'text',
      operator: 'like',
    },
    'duration_minutes': {
      title: 'Durasi (Menit)',
      type: 'number',
      operator: 'equal',
    },
    'is_billable': {
      title: 'Billable',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Billable', value: true },
        { title: 'Non-Billable', value: false },
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
  return !loading.value && initialLoadCompleted.value && services.value.length === 0
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
  { title: 'Nama Layanan', key: 'name' },
  { title: 'Kode', key: 'code' },
  { title: 'Tipe', key: 'service_type' },
  { title: 'Durasi', key: 'duration_minutes' },
  { title: 'Billable', key: 'is_billable', sortable: false },
  { title: 'Status', key: 'is_active', sortable: false },
  { title: 'Tanggal Dibuat', key: 'created_at' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

// Functions
async function fetchServices() {
  loading.value = true
  console.log('🔄 Starting fetchServices...')
  
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
    
    const res = await $api('/crm/services/paginated', {
      method: 'POST',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    
    // Handle the API response structure correctly
    if (res.data && Array.isArray(res.data)) {
      services.value = res.data || []
      totalServices.value = res.meta?.total || 0
    } else if (res.data && res.data.data) {
      services.value = res.data.data || []
      totalServices.value = res.data.meta?.total || 0
    } else {
      services.value = res.data || []
      totalServices.value = res.meta?.total || 0
    }
    
    console.log('✅ Services loaded:', services.value.length, 'total:', totalServices.value)
  } catch (error) {
    console.error('❌ Error fetching services:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Layanan',
      text: 'Tidak dapat memuat data layanan. Silakan coba lagi.',
    })
    services.value = []
    totalServices.value = 0
  } finally {
    loading.value = false
    initialLoadCompleted.value = true
    console.log('🏁 fetchServices completed')
  }
}

function handleApplyFilters({ filters, quickSearch }) {
  currentFilters.value = filters
  currentQuickSearch.value = quickSearch
  page.value = 1
  fetchServices()
}

function handleClearFilters() {
  currentFilters.value = []
  currentQuickSearch.value = ''
  page.value = 1
  fetchServices()
}

function handleApplyQuickSearch(searchQuery) {
  currentQuickSearch.value = searchQuery
  page.value = 1
  fetchServices()
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

function getServiceTypeColor(type) {
  switch (type) {
  case 'CONSULTATION': return 'primary'
  case 'ADMIN': return 'success'
  case 'SUPPORT': return 'warning'
  case 'OTHER': return 'info'
  default: return 'secondary'
  }
}

function getServiceTypeLabel(type) {
  switch (type) {
  case 'CONSULTATION': return 'Konsultasi'
  case 'ADMIN': return 'Administrasi'
  case 'SUPPORT': return 'Dukungan'
  case 'OTHER': return 'Lainnya'
  default: return type
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
    fetchServices()
  }
})

// Always refresh data when component becomes active
onActivated(() => {
  console.log('🎯 Component onActivated triggered')

  // Only fetch if we don't have data and initial load is completed
  if (services.value.length === 0 && initialLoadCompleted.value) {
    fetchServices()
  }
})

// Initialize filter config
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')

  // Ensure loading is true for initial load
  loading.value = true
  
  // Only fetch services once on mount
  fetchServices()
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
