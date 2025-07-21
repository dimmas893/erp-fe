<route lang="yaml">
meta:
  layout: default
  navActiveLink: hris-doctors
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Dokter"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      quick-search-placeholder="Cari kode, nama, atau spesialisasi dokter..."
      :quick-search-fields="['doctor_code', 'name', 'specialization']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
    >
      <template #actions>
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          :to="{ name: 'hris-doctors-create' }"
        >
          Tambah Dokter
        </VBtn>
      </template>
    </DynamicFilter>
    
    <VDivider />
    <VDataTableServer
      :headers="headers"
      :items="doctors"
      :items-length="totalDoctors"
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
          :to="{ name: 'hris-doctors-id', params: { id: item.id } }"
        >
          {{ item?.name || '-' }}
        </VBtn>
      </template>
      <template #item.doctor_code="{ item }">
        <VChip
          v-if="item && item.doctor_code"
          color="primary"
          size="small"
          label
        >
          {{ item.doctor_code }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.specialization="{ item }">
        <VChip
          v-if="item && item.specialization"
          color="info"
          size="small"
          label
        >
          {{ item.specialization }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.gender="{ item }">
        <VChip
          v-if="item && item.gender"
          :color="getGenderColor(item.gender)"
          size="small"
          label
        >
          {{ getGenderLabel(item.gender) }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.experience_years="{ item }">
        <VChip
          v-if="item && item.experience_years"
          color="warning"
          size="small"
          label
        >
          {{ item.experience_years }} tahun
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.consultation_fee="{ item }">
        <VChip
          v-if="item && item.consultation_fee"
          color="success"
          size="small"
          label
        >
          {{ formatCurrency(item.consultation_fee) }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.branch_name="{ item }">
        <VChip
          v-if="item && item.branch_id"
          color="info"
          size="small"
          label
        >
          {{ getBranchName(item.branch_id) }}
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
            :to="{ name: 'hris-doctors-id', params: { id: item.id } }"
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
            tabler-user-md
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
            {{ paginationMeta({ page: page, itemsPerPage: itemsPerPage }, totalDoctors) }}
          </div>
          <TablePagination
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalDoctors"
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

const doctors = ref([])
const totalDoctors = ref(0)
const currentFilters = ref([])
const currentQuickSearch = ref('')
const branches = ref([])
const employees = ref([])

// Reactive field configurations
const allowedFields = [
  'name',
  'doctor_code',
  'specialization',
  'license_number',
  'phone',
  'email',
  'gender',
  'experience_years',
  'consultation_fee',
  'branch_id',
  'is_active',
  'created_at',
]

const fieldConfigs = ref({
  name: {
    title: 'Nama',
    type: 'text',
    operator: 'like',
  },
  doctor_code: {
    title: 'Kode Dokter',
    type: 'text',
    operator: 'like',
  },
  specialization: {
    title: 'Spesialisasi',
    type: 'text',
    operator: 'like',
  },
  license_number: {
    title: 'Nomor Lisensi',
    type: 'text',
    operator: 'like',
  },
  phone: {
    title: 'Telepon',
    type: 'text',
    operator: 'like',
  },
  email: {
    title: 'Email',
    type: 'text',
    operator: 'like',
  },
  gender: {
    title: 'Gender',
    type: 'select',
    operator: '=',
    options: [
      { title: 'Pria', value: 'L' },
      { title: 'Wanita', value: 'P' }
    ]
  },
  experience_years: {
    title: 'Pengalaman (Tahun)',
    type: 'number',
    operator: '=',
  },
  consultation_fee: {
    title: 'Biaya Konsultasi',
    type: 'number',
    operator: '=',
  },
  branch_id: {
    title: 'Cabang',
    type: 'select',
    operator: '=',
    options: computed(() => branches.value.map(branch => ({
      title: `${branch.name} (${branch.code})`,
      value: branch.id
    })))
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
  return !loading.value && initialLoadCompleted.value && doctors.value.length === 0
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
  { title: 'Nama Dokter', key: 'name' },
  { title: 'Kode', key: 'doctor_code' },
  { title: 'Spesialisasi', key: 'specialization' },
  { title: 'Gender', key: 'gender' },
  { title: 'Pengalaman', key: 'experience_years' },
  { title: 'Biaya Konsultasi', key: 'consultation_fee' },
  { title: 'Cabang', key: 'branch_name' },
  { title: 'Karyawan', key: 'employee_name' },
  { title: 'Status', key: 'is_active' },
  { title: 'Tanggal Dibuat', key: 'created_at' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

// Functions
async function fetchDoctors() {
  loading.value = true
  console.log('🔄 Starting fetchDoctors...')
  
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
    
    const res = await $api('/hris/doctors/paginated', {
      method: 'POST',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    
    // Handle the API response structure correctly
    if (res && res.response_code === 200) {
      doctors.value = res.data || []
      totalDoctors.value = res.meta?.total || 0
    } else {
      doctors.value = []
      totalDoctors.value = 0
    }
    
    console.log('✅ Doctors loaded:', doctors.value.length, 'total:', totalDoctors.value)
  } catch (error) {
    console.error('❌ Error fetching doctors:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Dokter',
      text: 'Tidak dapat memuat data dokter. Silakan coba lagi.',
    })
    doctors.value = []
    totalDoctors.value = 0
  } finally {
    loading.value = false
    initialLoadCompleted.value = true
    console.log('🏁 fetchDoctors completed')
  }
}

function handleApplyFilters({ filters, quickSearch }) {
  currentFilters.value = filters
  currentQuickSearch.value = quickSearch
  page.value = 1
  fetchDoctors()
}

function handleClearFilters() {
  currentFilters.value = []
  currentQuickSearch.value = ''
  page.value = 1
  fetchDoctors()
}

function handleApplyQuickSearch(searchQuery) {
  currentQuickSearch.value = searchQuery
  page.value = 1
  fetchDoctors()
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
    case 'L':
      return 'info'
    case 'P':
      return 'warning'
    default:
      return 'default'
  }
}

const getGenderLabel = (gender) => {
  switch (gender) {
    case 'L':
      return 'Pria'
    case 'P':
      return 'Wanita'
    default:
      return gender
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

function formatCurrency(amount) {
  if (!amount) return '-'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const fetchBranches = async () => {
  try {
    const res = await $api('/wms/branches', {
      method: 'GET',
    })
    
    if (res && res.response_code === 200) {
      branches.value = res.data
    }
  } catch (error) {
    console.error('❌ Error fetching branches:', error)
  }
}

const fetchEmployees = async () => {
  try {
    const res = await $api('/hris/employees', {
      method: 'GET',
    })
    
    if (res && res.response_code === 200) {
      employees.value = res.data
    }
  } catch (error) {
    console.error('❌ Error fetching employees:', error)
  }
}

const getBranchName = (branchId) => {
  const branch = branches.value.find(b => b.id === branchId)
  return branch ? `${branch.name} (${branch.code})` : 'Cabang tidak ditemukan'
}

const getEmployeeName = (employeeId) => {
  const employee = employees.value.find(e => e.id === employeeId)
  return employee ? `${employee.name} (${employee.email})` : 'Karyawan tidak ditemukan'
}

// Watchers
watch([page, itemsPerPage, sortBy, orderBy], () => {
  // Only fetch if component is already mounted and not in initial loading
  if (initialLoadCompleted.value) {
    fetchDoctors()
  }
})

// Always refresh data when component becomes active
onActivated(() => {
  console.log('🎯 Component onActivated triggered')

  // Only fetch if we don't have data and initial load is completed
  if (doctors.value.length === 0 && initialLoadCompleted.value) {
    fetchDoctors()
  }
})

// Initialize filter config
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')

  // Fetch branches and employees first
  await Promise.all([fetchBranches(), fetchEmployees()])

  // Ensure loading is true for initial load
  loading.value = true
  
  // Only fetch doctors once on mount
  fetchDoctors()
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
