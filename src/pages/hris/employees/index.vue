<route lang="yaml">
meta:
  layout: default
  navActiveLink: hris-employees
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Karyawan"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      quick-search-placeholder="Cari nama, email, atau nomor telepon..."
      :quick-search-fields="['name', 'email', 'phone']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
    >
      <template #actions>
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          :to="{ name: 'hris-employees-create' }"
        >
          Tambah Karyawan
        </VBtn>
      </template>
    </DynamicFilter>
    
    <VDivider />
    <VDataTableServer
      :headers="headers"
      :items="employees"
      :items-length="totalEmployees"
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
          :to="{ name: 'hris-employees-id', params: { id: item.id } }"
        >
          {{ item?.name || '-' }}
        </VBtn>
      </template>
      <template #item.email="{ item }">
        <span v-if="item && item.email" class="text-body-2">
          {{ item.email }}
        </span>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.phone="{ item }">
        <span v-if="item && item.phone" class="text-body-2">
          {{ item.phone }}
        </span>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.department="{ item }">
        <div v-if="item && item.department" class="d-flex align-center gap-2">
          <VChip
            color="primary"
            size="small"
            variant="tonal"
          >
            {{ item.department.code }}
          </VChip>
          <span class="text-body-2">{{ item.department.name }}</span>
        </div>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.position="{ item }">
        <div v-if="item && item.position" class="d-flex align-center gap-2">
          <VChip
            color="success"
            size="small"
            variant="tonal"
          >
            {{ item.position.code }}
          </VChip>
          <span class="text-body-2">{{ item.position.title }}</span>
        </div>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.employment_status="{ item }">
        <VChip
          v-if="item"
          :color="getEmploymentStatusColor(item.employment_status)"
          size="small"
          label
        >
          {{ getEmploymentStatusLabel(item.employment_status) }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.contract_type="{ item }">
        <VChip
          v-if="item"
          :color="getContractTypeColor(item.contract_type)"
          size="small"
          label
        >
          {{ getContractTypeLabel(item.contract_type) }}
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
            :to="{ name: 'hris-employees-id', params: { id: item.id } }"
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
            tabler-users
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
            {{ paginationMeta({ page: page, itemsPerPage: itemsPerPage }, totalEmployees) }}
          </div>
          <TablePagination
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalEmployees"
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

const employees = ref([])
const totalEmployees = ref(0)
const currentFilters = ref([])
const currentQuickSearch = ref('')

// Reactive field configurations
const allowedFields = [
  'name',
  'email',
  'phone',
  'gender',
  'marital_status',
  'department_id',
  'position_id',
  'employment_status',
  'contract_type',
  'created_at',
]

const fieldConfigs = computed(() => {
  return {
    'name': {
      title: 'Nama Karyawan',
      type: 'text',
      operator: 'like',
    },
    'email': {
      title: 'Email',
      type: 'text',
      operator: 'like',
    },
    'phone': {
      title: 'Nomor Telepon',
      type: 'text',
      operator: 'like',
    },
    'gender': {
      title: 'Jenis Kelamin',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Laki-laki', value: 'MALE' },
        { title: 'Perempuan', value: 'FEMALE' },
      ],
    },
    'marital_status': {
      title: 'Status Pernikahan',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Belum Menikah', value: 'SINGLE' },
        { title: 'Menikah', value: 'MARRIED' },
        { title: 'Cerai', value: 'DIVORCED' },
        { title: 'Janda/Duda', value: 'WIDOWED' },
      ],
    },
    'department_id': {
      title: 'Departemen',
      type: 'select',
      operator: 'equal',
      options: [], // Will be populated from API
    },
    'position_id': {
      title: 'Posisi',
      type: 'select',
      operator: 'equal',
      options: [], // Will be populated from API
    },
    'employment_status': {
      title: 'Status Karyawan',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Aktif', value: 'ACTIVE' },
        { title: 'Nonaktif', value: 'INACTIVE' },
        { title: 'Cuti', value: 'ON_LEAVE' },
        { title: 'Terminasi', value: 'TERMINATED' },
      ],
    },
    'contract_type': {
      title: 'Tipe Kontrak',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Permanen', value: 'PERMANENT' },
        { title: 'Kontrak', value: 'CONTRACT' },
        { title: 'Probation', value: 'PROBATION' },
        { title: 'Internship', value: 'INTERNSHIP' },
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
  return !loading.value && initialLoadCompleted.value && employees.value.length === 0
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
  { title: 'Nama Karyawan', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Telepon', key: 'phone' },
  { title: 'Departemen', key: 'department' },
  { title: 'Posisi', key: 'position' },
  { title: 'Status', key: 'employment_status', sortable: false },
  { title: 'Tipe Kontrak', key: 'contract_type', sortable: false },
  { title: 'Tanggal Dibuat', key: 'created_at' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

// Functions
async function fetchEmployees() {
  loading.value = true
  console.log('🔄 Starting fetchEmployees...')
  
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
    
    const res = await $api('/hris/employees/paginated', {
      method: 'POST',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    
    // Handle the API response structure correctly
    if (res.data && Array.isArray(res.data)) {
      employees.value = res.data || []
      totalEmployees.value = res.meta?.total || 0
    } else if (res.data && res.data.data) {
      employees.value = res.data.data || []
      totalEmployees.value = res.data.meta?.total || 0
    } else {
      employees.value = res.data || []
      totalEmployees.value = res.meta?.total || 0
    }
    
    console.log('✅ Employees loaded:', employees.value.length, 'total:', totalEmployees.value)
  } catch (error) {
    console.error('❌ Error fetching employees:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Karyawan',
      text: 'Tidak dapat memuat data karyawan. Silakan coba lagi.',
    })
    employees.value = []
    totalEmployees.value = 0
  } finally {
    loading.value = false
    initialLoadCompleted.value = true
    console.log('🏁 fetchEmployees completed')
  }
}

async function loadFilterOptions() {
  try {
    // Load departments for filter
    const deptResponse = await $api('/hris/departments', {
      method: 'GET',
    })
    
    if (deptResponse.data && Array.isArray(deptResponse.data)) {
      const deptOptions = deptResponse.data.map(dept => ({
        title: dept.name,
        value: dept.id,
      }))
      fieldConfigs.value.department_id.options = deptOptions
    }

    // Load positions for filter
    const posResponse = await $api('/hris/positions', {
      method: 'GET',
    })
    
    if (posResponse.data && Array.isArray(posResponse.data)) {
      const posOptions = posResponse.data.map(pos => ({
        title: pos.title,
        value: pos.id,
      }))
      fieldConfigs.value.position_id.options = posOptions
    }
  } catch (error) {
    console.error('❌ Error loading filter options:', error)
  }
}

function handleApplyFilters({ filters, quickSearch }) {
  currentFilters.value = filters
  currentQuickSearch.value = quickSearch
  page.value = 1
  fetchEmployees()
}

function handleClearFilters() {
  currentFilters.value = []
  currentQuickSearch.value = ''
  page.value = 1
  fetchEmployees()
}

function handleApplyQuickSearch(searchQuery) {
  currentQuickSearch.value = searchQuery
  page.value = 1
  fetchEmployees()
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

function getEmploymentStatusColor(status) {
  switch (status) {
  case 'ACTIVE': return 'success'
  case 'INACTIVE': return 'error'
  case 'ON_LEAVE': return 'warning'
  case 'TERMINATED': return 'error'
  default: return 'secondary'
  }
}

function getEmploymentStatusLabel(status) {
  switch (status) {
  case 'ACTIVE': return 'Aktif'
  case 'INACTIVE': return 'Nonaktif'
  case 'ON_LEAVE': return 'Cuti'
  case 'TERMINATED': return 'Terminasi'
  default: return status
  }
}

function getContractTypeColor(type) {
  switch (type) {
  case 'PERMANENT': return 'success'
  case 'CONTRACT': return 'warning'
  case 'PROBATION': return 'info'
  case 'INTERNSHIP': return 'secondary'
  default: return 'secondary'
  }
}

function getContractTypeLabel(type) {
  switch (type) {
  case 'PERMANENT': return 'Permanen'
  case 'CONTRACT': return 'Kontrak'
  case 'PROBATION': return 'Probation'
  case 'INTERNSHIP': return 'Internship'
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
    fetchEmployees()
  }
})

// Always refresh data when component becomes active
onActivated(() => {
  console.log('🎯 Component onActivated triggered')

  // Only fetch if we don't have data and initial load is completed
  if (employees.value.length === 0 && initialLoadCompleted.value) {
    fetchEmployees()
  }
})

// Initialize filter config
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')

  // Ensure loading is true for initial load
  loading.value = true
  
  // Load filter options first
  await loadFilterOptions()
  
  // Only fetch employees once on mount
  fetchEmployees()
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
