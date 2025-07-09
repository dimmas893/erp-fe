<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Pasien SatuSehat"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      :quick-search-placeholder="'Cari nama, NIK, nomor SatuSehat...'"
      :quick-search-fields="['name', 'nik', 'satusehat_id']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
    />
    
    <VDivider />
    <VDataTableServer
      :headers="headers"
      :items="patients"
      :items-length="totalPatients"
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
        <div class="font-weight-medium">{{ item.name }}</div>
      </template>
      <template #item.birth_date="{ item }">
        {{ formatDate(item.birth_date) }}
      </template>
      <template #item.sync_status="{ item }">
        <VChip :color="getSyncStatusColor(item.sync_status)" size="small" label>
          {{ getSyncStatusText(item.sync_status) }}
        </VChip>
      </template>
      <template #item.last_sync="{ item }">
        {{ formatDateTime(item.last_sync) }}
      </template>
      <template #loading>
        <VSkeletonLoader
          class="mx-auto"
          type="table-row@10"
        />
      </template>
      <template #no-data>
        <div class="text-center py-12">
          <VIcon size="64" color="primary" class="mb-4">tabler-users</VIcon>
          <h3 class="text-h6 mb-2">Tidak ada data ditemukan</h3>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Coba ubah filter atau kriteria pencarian Anda
          </p>
          <VBtn color="primary" variant="tonal" @click="handleClearFilters">
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
            {{ paginationMeta({ page: page, itemsPerPage: itemsPerPage }, totalPatients) }}
          </div>
          <TablePagination
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalPatients"
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
import { createDynamicFilterConfig } from '@/utils/filterUtils'
import { paginationMeta } from '@/utils/paginationMeta'
import { ref, watch } from 'vue'

// State
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref('created_at')
const orderBy = ref('desc')
const loading = ref(false)

const patients = ref([])
const totalPatients = ref(0)
const currentFilters = ref([])
const currentQuickSearch = ref('')

// Dynamic filter configuration
const filterConfig = ref({
  fields: [],
  fieldConfigs: {}
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
  { title: 'Nama', key: 'name' },
  { title: 'NIK', key: 'nik' },
  { title: 'ID SatuSehat', key: 'satusehat_id' },
  { title: 'Tgl Lahir', key: 'birth_date' },
  { title: 'Gender', key: 'gender' },
  { title: 'Status Sync', key: 'sync_status' },
  { title: 'Terakhir Sync', key: 'last_sync' },
  { title: 'Tanggal Input', key: 'created_at' },
]

// Functions
async function fetchPatients() {
  loading.value = true
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
        search_query: currentQuickSearch.value.trim()
      })
    }

    // Mock data for demonstration - replace with actual API call
    const mockData = generateMockSatuSehatData()
    patients.value = mockData.data
    totalPatients.value = mockData.total

    // Generate dynamic filter configuration from first fetch
    if (mockData.data && mockData.data.length > 0 && filterConfig.value.fields.length === 0) {
      generateFilterConfig(mockData.data[0])
    }
  } catch (error) {
    console.error('Error fetching SatuSehat patients:', error)
    patients.value = []
    totalPatients.value = 0
  } finally {
    loading.value = false
  }
}

function generateMockSatuSehatData() {
  // This would be replaced with actual API call
  const mockPatients = [
    {
      id: 1,
      name: 'John Doe',
      nik: '1234567890123456',
      satusehat_id: 'SS-001-2024',
      birth_date: '1990-01-15',
      gender: 'MALE',
      phone: '081234567890',
      email: 'john@example.com',
      address: 'Jakarta',
      sync_status: 'SYNCED',
      last_sync: '2024-01-15T10:30:00Z',
      created_at: '2024-01-10T08:00:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Jane Smith',
      nik: '1234567890123457',
      satusehat_id: 'SS-002-2024',
      birth_date: '1985-05-20',
      gender: 'FEMALE',
      phone: '081234567891',
      email: 'jane@example.com',
      address: 'Bandung',
      sync_status: 'PENDING',
      last_sync: null,
      created_at: '2024-01-12T09:15:00Z',
      updated_at: '2024-01-12T09:15:00Z'
    }
  ]

  return {
    data: mockPatients,
    total: mockPatients.length
  }
}

function generateFilterConfig(sampleData) {
  // Custom field configurations for SatuSehat patient data
  const customConfigs = {
    'satusehat_id': {
      title: 'ID SatuSehat',
      type: 'text'
    },
    'sync_status': {
      title: 'Status Sinkronisasi',
      type: 'select',
      options: [
        { title: 'Tersinkron', value: 'SYNCED' },
        { title: 'Menunggu', value: 'PENDING' },
        { title: 'Gagal', value: 'FAILED' },
        { title: 'Tidak Aktif', value: 'DISABLED' }
      ]
    },
    'last_sync': {
      title: 'Terakhir Sinkron',
      type: 'date'
    }
  }

  const config = createDynamicFilterConfig({ data: [sampleData] }, customConfigs)
  filterConfig.value = config
}

function handleApplyFilters({ filters, quickSearch }) {
  currentFilters.value = filters
  currentQuickSearch.value = quickSearch
  page.value = 1
  fetchPatients()
}

function handleClearFilters() {
  currentFilters.value = []
  currentQuickSearch.value = ''
  page.value = 1
  fetchPatients()
}

function handleApplyQuickSearch(searchQuery) {
  currentQuickSearch.value = searchQuery
  page.value = 1
  fetchPatients()
}

function onUpdateOptions(options) {
  if (options.page !== page.value) page.value = options.page
  if (options.itemsPerPage !== itemsPerPage.value) itemsPerPage.value = options.itemsPerPage
  
  // Handle sorting
  if (options.sortBy && options.sortBy.length > 0) {
    const sortItem = options.sortBy[0]
    sortBy.value = sortItem.key
    orderBy.value = sortItem.order
    fetchPatients()
  }
}

function getSyncStatusColor(status) {
  switch (status) {
    case 'SYNCED': return 'success'
    case 'PENDING': return 'warning'
    case 'FAILED': return 'error'
    case 'DISABLED': return 'secondary'
    default: return 'secondary'
  }
}

function getSyncStatusText(status) {
  switch (status) {
    case 'SYNCED': return 'Tersinkron'
    case 'PENDING': return 'Menunggu'
    case 'FAILED': return 'Gagal'
    case 'DISABLED': return 'Tidak Aktif'
    default: return 'Unknown'
  }
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
watch([page, itemsPerPage], () => {
  fetchPatients()
})

// Initialize
fetchPatients()
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
