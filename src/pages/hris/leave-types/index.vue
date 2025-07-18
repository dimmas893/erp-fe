<route lang="yaml">
meta:
  layout: default
  navActiveLink: hris-leave-types
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Jenis Cuti"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      quick-search-placeholder="Cari kode, nama, atau deskripsi..."
      :quick-search-fields="['code', 'name', 'description']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
    >
      <template #actions>
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          :to="{ name: 'hris-leave-types-create' }"
        >
          Tambah Jenis Cuti
        </VBtn>
      </template>
    </DynamicFilter>
    
    <VDivider />
    <VDataTableServer
      :headers="headers"
      :items="leaveTypes"
      :items-length="totalLeaveTypes"
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
          :to="{ name: 'hris-leave-types-id', params: { id: item.id } }"
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
      <template #item.max_days_per_request="{ item }">
        <VChip
          v-if="item && item.max_days_per_request"
          color="info"
          size="small"
          label
        >
          {{ item.max_days_per_request }} hari
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.max_days_per_year="{ item }">
        <VChip
          v-if="item && item.max_days_per_year"
          color="warning"
          size="small"
          label
        >
          {{ item.max_days_per_year }} hari/tahun
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.is_paid="{ item }">
        <VChip
          v-if="item"
          :color="item.is_paid ? 'success' : 'warning'"
          size="small"
          label
        >
          {{ item.is_paid ? 'Berbayar' : 'Tidak Berbayar' }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.requires_document="{ item }">
        <VChip
          v-if="item"
          :color="item.requires_document ? 'error' : 'success'"
          size="small"
          label
        >
          {{ item.requires_document ? 'Dokumen Wajib' : 'Dokumen Opsional' }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.approval_required="{ item }">
        <VChip
          v-if="item"
          :color="item.approval_required ? 'error' : 'success'"
          size="small"
          label
        >
          {{ item.approval_required ? 'Perlu Approval' : 'Otomatis' }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.gender_specific="{ item }">
        <VChip
          v-if="item && item.gender_specific"
          :color="getGenderColor(item.gender_specific)"
          size="small"
          label
        >
          {{ getGenderLabel(item.gender_specific) }}
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
            :to="{ name: 'hris-leave-types-id', params: { id: item.id } }"
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
            tabler-calendar-off
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
            {{ paginationMeta({ page: page, itemsPerPage: itemsPerPage }, totalLeaveTypes) }}
          </div>
          <TablePagination
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalLeaveTypes"
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

const leaveTypes = ref([])
const totalLeaveTypes = ref(0)
const currentFilters = ref([])
const currentQuickSearch = ref('')

// Reactive field configurations
const allowedFields = [
  'name',
  'code',
  'description',
  'max_days_per_request',
  'max_days_per_year',
  'is_paid',
  'requires_document',
  'approval_required',
  'gender_specific',
  'is_active',
  'created_at',
]

const fieldConfigs = ref({
  name: {
    title: 'Nama',
    type: 'text',
    operator: 'like',
  },
  code: {
    title: 'Kode',
    type: 'text',
    operator: 'like',
  },
  description: {
    title: 'Deskripsi',
    type: 'text',
    operator: 'like',
  },
  max_days_per_request: {
    title: 'Maksimal Hari per Request',
    type: 'number',
    operator: '=',
  },
  max_days_per_year: {
    title: 'Maksimal Hari per Tahun',
    type: 'number',
    operator: '=',
  },
  is_paid: {
    title: 'Status Bayar',
    type: 'select',
    operator: '=',
    options: [
      { title: 'Berbayar', value: true },
      { title: 'Tidak Berbayar', value: false }
    ]
  },
  requires_document: {
    title: 'Dokumen Wajib',
    type: 'select',
    operator: '=',
    options: [
      { title: 'Ya', value: true },
      { title: 'Tidak', value: false }
    ]
  },
  approval_required: {
    title: 'Perlu Approval',
    type: 'select',
    operator: '=',
    options: [
      { title: 'Ya', value: true },
      { title: 'Tidak', value: false }
    ]
  },
  gender_specific: {
    title: 'Gender',
    type: 'select',
    operator: '=',
    options: [
      { title: 'Semua', value: 'ALL' },
      { title: 'Pria', value: 'MALE' },
      { title: 'Wanita', value: 'FEMALE' }
    ]
  },
  is_active: {
    title: 'Status',
    type: 'select',
    operator: '=',
    options: [
      { title: 'Aktif', value: true },
      { title: 'Nonaktif', value: false }
    ]
  },
  created_at: {
    title: 'Tanggal Dibuat',
    type: 'date',
    operator: 'date',
  },
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
  return !loading.value && initialLoadCompleted.value && leaveTypes.value.length === 0
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
  { title: 'Nama Jenis Cuti', key: 'name' },
  { title: 'Kode', key: 'code' },
  { title: 'Maksimal per Request', key: 'max_days_per_request' },
  { title: 'Maksimal per Tahun', key: 'max_days_per_year' },
  { title: 'Status Bayar', key: 'is_paid' },
  { title: 'Dokumen', key: 'requires_document' },
  { title: 'Approval', key: 'approval_required' },
  { title: 'Gender', key: 'gender_specific' },
  { title: 'Status', key: 'is_active' },
  { title: 'Tanggal Dibuat', key: 'created_at' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

// Functions
async function fetchLeaveTypes() {
  loading.value = true
  console.log('🔄 Starting fetchLeaveTypes...')
  
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
    
    const res = await $api('/hris/leave-types/paginated', {
      method: 'POST',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    
    // Handle the API response structure correctly
    if (res && res.response_code === 200) {
      leaveTypes.value = res.data || []
      totalLeaveTypes.value = res.meta?.total || 0
    } else {
      leaveTypes.value = []
      totalLeaveTypes.value = 0
    }
    
    console.log('✅ Leave types loaded:', leaveTypes.value.length, 'total:', totalLeaveTypes.value)
  } catch (error) {
    console.error('❌ Error fetching leave types:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Jenis Cuti',
      text: 'Tidak dapat memuat data jenis cuti. Silakan coba lagi.',
    })
    leaveTypes.value = []
    totalLeaveTypes.value = 0
  } finally {
    loading.value = false
    initialLoadCompleted.value = true
    console.log('🏁 fetchLeaveTypes completed')
  }
}

function handleApplyFilters({ filters, quickSearch }) {
  currentFilters.value = filters
  currentQuickSearch.value = quickSearch
  page.value = 1
  fetchLeaveTypes()
}

function handleClearFilters() {
  currentFilters.value = []
  currentQuickSearch.value = ''
  page.value = 1
  fetchLeaveTypes()
}

function handleApplyQuickSearch(searchQuery) {
  currentQuickSearch.value = searchQuery
  page.value = 1
  fetchLeaveTypes()
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

const getGenderColor = (gender) => {
  switch (gender) {
    case 'ALL':
      return 'primary'
    case 'MALE':
      return 'info'
    case 'FEMALE':
      return 'warning'
    default:
      return 'default'
  }
}

const getGenderLabel = (gender) => {
  switch (gender) {
    case 'ALL':
      return 'Semua'
    case 'MALE':
      return 'Pria'
    case 'FEMALE':
      return 'Wanita'
    default:
      return gender
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
    fetchLeaveTypes()
  }
})

// Always refresh data when component becomes active
onActivated(() => {
  console.log('🎯 Component onActivated triggered')

  // Only fetch if we don't have data and initial load is completed
  if (leaveTypes.value.length === 0 && initialLoadCompleted.value) {
    fetchLeaveTypes()
  }
})

// Initialize filter config
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')

  // Ensure loading is true for initial load
  loading.value = true
  
  // Only fetch leave types once on mount
  fetchLeaveTypes()
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


