<route lang="yaml">
meta:
  layout: default
  navActiveLink: rme-pasien
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <!-- <DynamicFilter
      title="Data Pasien"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      quick-search-placeholder="Cari nama, NIK, telepon, atau email..."
      :quick-search-fields="['name', 'nik', 'phone', 'email']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
      > -->
      <div class="d-flex justify-space-between align-center flex-wrap mx-4 my-2">
        <v-text-field
          v-model="search"
          label="Search..."
          class="my-2"
          prepend-inner-icon="mdi-magnify"
          clearable
          density="comfortable"
          style="max-width: 300px"
        />

        <v-btn
          color="primary"
          prepend-icon="tabler-plus"
          :to="{ name: 'rme-pasien-create' }"
          class="my-2"
        >
          Tambah Pasien
        </v-btn>
      </div>

        <!-- </template> -->
    <!-- </DynamicFilter> -->
    
    <VDivider />
    <v-data-table v-model:search="search"
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
        <RouterLink
          :to="{ name: 'rme-pasien-id', params: { id: item.id } }"
          class="text-primary text-decoration-underline font-weight-medium"
        >
          {{ item.name }}
        </RouterLink>
      </template>
      <!-- <template #item.birth_date="{ item }">
        {{ formatDate(item.birth_date) }}
      </template> -->
      <template #item.created_at="{ item }">
        {{ formatDateTime(item.created_at) }}
      </template>
      <template #item.is_active="{ item }">
        <VChip
          :color="item.is_active ? 'success' : 'error'"
          size="small"
          label
        >
          {{ item.is_active ? 'Aktif' : 'Nonaktif' }}
        </VChip>
      </template>
      <template #item.consent_status="{ item }">
        <VChip
          :color="getConsentColor(item.consent_status)"
          size="small"
          label
        >
          {{ item.consent_status }}
        </VChip>
      </template>
      <!-- <template #item.emergency_contact="{ item }">
        <div v-if="item.emergency_contact">
          <div class="font-weight-medium">
            {{ item.emergency_contact.name }}
          </div>
          <div class="text-body-2">
            {{ item.emergency_contact.phone }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ item.emergency_contact.relationship }}
          </div>
        </div>
        <div
          v-else
          class="text-medium-emphasis"
        >
          -
        </div>
      </template> -->
      <template #item.actions="{ item }">
        <VMenu>
          <template #activator="{ props }">
            <VBtn color="primary" size="small" v-bind="props">
              Action <VIcon class="tabler-arrow-big-down-line"></VIcon>
            </VBtn>
          </template>
          <VList>
            <VListItem :to="{ name: 'rme-pasien-id', params: { id: item.id } }">View</VListItem>
            <VListItem :to="{ name: 'rme-pasien-edit-id', params: { id: item.id } }">Edit</VListItem>
            <VListItem :to="{ name: 'rme-pasien-edit-id', params: { id: item.id } }">Data Kunjungan</VListItem>
            <VListItem :to="{ name: 'transaction-visit-id', params: { id: item.id } }">Kunjungan Baru</VListItem>
          </VList>
        </VMenu>  
        <!-- <div class="d-flex gap-2">
          <VBtn
            icon="tabler-eye"
            size="small"
            variant="text"
            color="primary"
            :to="{ name: 'rme-pasien-id', params: { id: item.id } }"
            title="Lihat Detail"
          />
          <VBtn
            icon="tabler-edit"
            size="small"
            variant="text"
            color="warning"
            :to="{ name: 'rme-pasien-edit-id', params: { id: item.id } }"
            title="Edit Pasien"
          />
        </div> -->
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
    </v-data-table>
  </VCard>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert } from '@/utils/errorHandler'
import { computed, onActivated, onMounted, ref, watch } from 'vue'

// State
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref('createdAt')
const orderBy = ref('desc')
const loading = ref(true) // Start with loading true for initial load
const initialLoadCompleted = ref(false)

const search = ref('')
const patients = ref([])
const totalPatients = ref(0)
const currentFilters = ref([])
const currentQuickSearch = ref('')

const branchOptions = ref([])

// Reactive field configurations
const allowedFields = [
  'patient_number',
  'nik', 
  'name',
  'gender',
  'phone',
  'email',
  'branch_id',
  'created_at',
]

const fieldConfigs = computed(() => {
  return {
    'patient_number': {
      title: 'No. Pasien',
      type: 'text',
      operator: 'like',
    },
    'nik': {
      title: 'NIK',
      type: 'text',
      operator: 'like',
    },
    'name': {
      title: 'Nama',
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
    'phone': {
      title: 'Telepon',
      type: 'tel',
      operator: 'like',
    },
    // 'email': {
    //   title: 'Email',
    //   type: 'email',
    //   operator: 'like',
    // },
    'branch_id': {
      title: 'Cabang',
      type: 'select',
      operator: 'equal',
      options: branchOptions.value.slice(),
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
  return !loading.value && initialLoadCompleted.value && patients.value.length === 0
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
  { title: 'Nama', key: 'name', sortable: true },
  { title: 'NIK', key: 'nik', sortable: true },
  // { title: 'Tgl Lahir', key: 'birth_date' },
  { title: 'Gender', key: 'gender', sortable: true },
  // { title: 'Telepon', key: 'phone' },
  // { title: 'Email', key: 'email' },
  // { title: 'Alamat', key: 'address' },
  // { title: 'Emergency Contact', key: 'emergency_contact', sortable: false },
  // { title: 'Status Persetujuan', key: 'consent_status' },
  { title: 'Aktif', key: 'is_active', sortable: false },
  { title: 'Tanggal Input', key: 'created_at', sortable: true },
  { title: '#', key: 'actions', sortable: false },
]

// Functions
async function fetchPatients() {
  loading.value = true
  console.log('🔄 Starting fetchPatients...')
  
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
    
    const res = await $api('/rme/patients/paginated', {
      method: 'POST',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    
    patients.value = res.data || []
    totalPatients.value = res.meta?.total || 0
    
    console.log('✅ Patients loaded:', patients.value.length, 'total:', totalPatients.value)
  } catch (error) {
    console.error('❌ Error fetching patients:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Pasien',
      text: 'Tidak dapat memuat data pasien. Silakan coba lagi.',
    })
    patients.value = []
    totalPatients.value = 0
  } finally {
    loading.value = false
    initialLoadCompleted.value = true
    console.log('🏁 fetchPatients completed')
  }
}

async function fetchBranches() {
  try {
    const res = await $api('/wms/branches', {
      method: 'GET',
      headers: {
        // Authorization header will be set automatically if needed
      },
    })

    branchOptions.value = (res.data || []).map(branch => ({
      title: `${branch.name} (${branch.code})`,
      value: branch.id,
    }))
  } catch (e) {
    console.error('Error fetching branches:', e)
    await showErrorAlert(e, {
      title: 'Gagal Memuat Data Cabang',
      text: 'Tidak dapat memuat daftar cabang untuk filter.',
    })
    branchOptions.value = []
  }
}

// generateFilterConfig function is removed

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
  
  // Handle sorting - just update the values, let the watcher handle fetching
  if (options.sortBy && options.sortBy.length > 0) {
    const sortItem = options.sortBy[0]

    sortBy.value = sortItem.key
    orderBy.value = sortItem.order

    // Remove direct fetch call - let the watcher handle it
  }
}

function getConsentColor(status) {
  switch (status) {
  case 'GIVEN': return 'success'
  case 'PENDING': return 'warning'
  case 'DENIED': return 'error'
  default: return 'secondary'
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
watch([page, itemsPerPage, sortBy, orderBy], () => {
  // Only fetch if component is already mounted and not in initial loading
  if (initialLoadCompleted.value) {
    fetchPatients()
  }
})

// Always refresh data when component becomes active
onActivated(() => {
  console.log('🎯 Component onActivated triggered')

  // Only fetch if we don't have data and initial load is completed
  if (patients.value.length === 0 && initialLoadCompleted.value) {
    fetchPatients()
  }
})

// Initialize filter config
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')

  // Ensure loading is true for initial load
  loading.value = true
  
  await fetchBranches()

  // Only fetch patients once on mount
  fetchPatients()
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
