<route lang="yaml">
meta:
  layout: default
  navActiveLink: hris-therapists
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Terapis"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      quick-search-placeholder="Cari ID, nama, atau spesialisasi terapis..."
      :quick-search-fields="['therapist_id', 'name', 'specialization']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
    >
      <template #actions>
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          :to="{ name: 'hris-therapists-create' }"
        >
          Tambah Terapis
        </VBtn>
      </template>
    </DynamicFilter>
    
    <VDivider />
    <VDataTableServer
      :headers="headers"
      :items="therapists"
      :items-length="totalTherapists"
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
          :to="{ name: 'hris-therapists-id', params: { id: item.id } }"
        >
          {{ item?.name || '-' }}
        </VBtn>
      </template>
      <template #item.therapist_id="{ item }">
        <VChip
          v-if="item && item.therapist_id"
          color="primary"
          size="small"
          label
        >
          {{ item.therapist_id }}
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
      <template #item.certification_level="{ item }">
        <VChip
          v-if="item && item.certification_level"
          :color="getCertificationColor(item.certification_level)"
          size="small"
          label
        >
          {{ item.certification_level }}
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
      <template #item.salary="{ item }">
        <VChip
          v-if="item && item.salary"
          color="success"
          size="small"
          label
        >
          {{ formatCurrency(item.salary) }}
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
      <template #item.employee_name="{ item }">
        <VChip
          v-if="item && item.employee_id"
          color="secondary"
          size="small"
          label
        >
          {{ getEmployeeName(item.employee_id) }}
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
      <template #item.is_available="{ item }">
        <VChip
          v-if="item"
          :color="item.is_available ? 'success' : 'warning'"
          size="small"
          label
        >
          {{ item.is_available ? 'Tersedia' : 'Tidak Tersedia' }}
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
            :to="{ name: 'hris-therapists-id', params: { id: item.id } }"
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
            tabler-user-star
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
            {{ paginationMeta({ page: page, itemsPerPage: itemsPerPage }, totalTherapists) }}
          </div>
          <TablePagination
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalTherapists"
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

const therapists = ref([])
const totalTherapists = ref(0)
const currentFilters = ref([])
const currentQuickSearch = ref('')
const branches = ref([])
const employees = ref([])

// Reactive field configurations
const allowedFields = [
  'name',
  'therapist_id',
  'specialization',
  'license_number',
  'phone',
  'email',
  'certification_level',
  'experience_years',
  'salary',
  'branch_id',
  'employee_id',
  'is_active',
  'is_available',
  'created_at',
]

const fieldConfigs = ref({
  name: {
    title: 'Nama',
    type: 'text',
    operator: 'like',
  },
  therapist_id: {
    title: 'ID Terapis',
    type: 'text',
    operator: 'like',
  },
  specialization: {
    title: 'Spesialisasi',
    type: 'select',
    operator: '=',
    options: [
      { title: 'AESTHETIC', value: 'AESTHETIC' },
      { title: 'GENERAL', value: 'GENERAL' },
      { title: 'DERMATOLOGY', value: 'DERMATOLOGY' },
      { title: 'SURGICAL', value: 'SURGICAL' },
      { title: 'EMERGENCY', value: 'EMERGENCY' },
      { title: 'PEDIATRIC', value: 'PEDIATRIC' }
    ]
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
  certification_level: {
    title: 'Level Sertifikasi',
    type: 'select',
    operator: '=',
    options: [
      { title: 'DIPLOMA', value: 'DIPLOMA' },
      { title: 'BACHELOR', value: 'BACHELOR' },
      { title: 'MASTER', value: 'MASTER' }
    ]
  },
  experience_years: {
    title: 'Pengalaman (Tahun)',
    type: 'number',
    operator: '=',
  },
  salary: {
    title: 'Gaji',
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
  employee_id: {
    title: 'Karyawan',
    type: 'select',
    operator: '=',
    options: computed(() => employees.value.map(employee => ({
      title: `${employee.name} (${employee.email})`,
      value: employee.id
    })))
  },
  is_active: {
    title: 'Status Aktif',
    type: 'select',
    operator: '=',
    options: [
      { title: 'Aktif', value: true },
      { title: 'Nonaktif', value: false }
    ]
  },
  is_available: {
    title: 'Status Tersedia',
    type: 'select',
    operator: '=',
    options: [
      { title: 'Tersedia', value: true },
      { title: 'Tidak Tersedia', value: false }
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
  return !loading.value && initialLoadCompleted.value && therapists.value.length === 0
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
  { title: 'Nama Terapis', key: 'name' },
  { title: 'ID Terapis', key: 'therapist_id' },
  { title: 'Spesialisasi', key: 'specialization' },
  { title: 'Level Sertifikasi', key: 'certification_level' },
  { title: 'Pengalaman', key: 'experience_years' },
  { title: 'Gaji', key: 'salary' },
  { title: 'Cabang', key: 'branch_name' },
  { title: 'Karyawan', key: 'employee_name' },
  { title: 'Status Aktif', key: 'is_active' },
  { title: 'Status Tersedia', key: 'is_available' },
  { title: 'Tanggal Dibuat', key: 'created_at' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

// Functions
async function fetchTherapists() {
  loading.value = true
  console.log('🔄 Starting fetchTherapists...')
  
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
    
    const res = await $api('/hris/therapists/paginated', {
      method: 'POST',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    
    // Handle the API response structure correctly
    if (res && res.response_code === 200) {
      therapists.value = res.data || []
      totalTherapists.value = res.meta?.total || 0
    } else {
      therapists.value = []
      totalTherapists.value = 0
    }
    
    console.log('✅ Therapists loaded:', therapists.value.length, 'total:', totalTherapists.value)
  } catch (error) {
    console.error('❌ Error fetching therapists:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Terapis',
      text: 'Tidak dapat memuat data terapis. Silakan coba lagi.',
    })
    therapists.value = []
    totalTherapists.value = 0
  } finally {
    loading.value = false
    initialLoadCompleted.value = true
    console.log('🏁 fetchTherapists completed')
  }
}

function handleApplyFilters({ filters, quickSearch }) {
  currentFilters.value = filters
  currentQuickSearch.value = quickSearch
  page.value = 1
  fetchTherapists()
}

function handleClearFilters() {
  currentFilters.value = []
  currentQuickSearch.value = ''
  page.value = 1
  fetchTherapists()
}

function handleApplyQuickSearch(searchQuery) {
  currentQuickSearch.value = searchQuery
  page.value = 1
  fetchTherapists()
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

const getCertificationColor = (level) => {
  switch (level) {
    case 'MASTER':
      return 'success'
    case 'BACHELOR':
      return 'info'
    case 'DIPLOMA':
      return 'warning'
    default:
      return 'default'
  }
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

// Watchers
watch([page, itemsPerPage, sortBy, orderBy], () => {
  // Only fetch if component is already mounted and not in initial loading
  if (initialLoadCompleted.value) {
    fetchTherapists()
  }
})

// Always refresh data when component becomes active
onActivated(() => {
  console.log('🎯 Component onActivated triggered')

  // Only fetch if we don't have data and initial load is completed
  if (therapists.value.length === 0 && initialLoadCompleted.value) {
    fetchTherapists()
  }
})

// Initialize filter config
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')

  // Fetch branches and employees first
  await Promise.all([fetchBranches(), fetchEmployees()])

  // Ensure loading is true for initial load
  loading.value = true
  
  // Only fetch therapists once on mount
  fetchTherapists()
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
