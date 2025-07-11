<route lang="yaml">
meta:
  layout: default
  navActiveLink: rme-kunjungan
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Kunjungan"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      :quick-search-placeholder="'Cari nomor kunjungan, nama pasien, atau keluhan...'"
      :quick-search-fields="['visit_number', 'patient.name', 'chief_complaint']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
    >
      <template #actions>
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          :to="{ name: 'rme-kunjungan-create' }"
        >
          Tambah Kunjungan
        </VBtn>
      </template>
    </DynamicFilter>
    
    <VDivider />
    <VDataTableServer
      :headers="headers"
      :items="visits"
      :items-length="totalVisits"
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
      <template #item.visit_number="{ item }">
        <RouterLink :to="{ name: 'rme-kunjungan-id', params: { id: item.id } }" class="text-primary text-decoration-underline font-weight-medium">
          {{ item.visit_number }}
        </RouterLink>
      </template>
      <template #item.patient="{ item }">
        <div>
          <div class="font-weight-medium">{{ item.patient?.name || '-' }}</div>
          <div class="text-caption text-medium-emphasis">{{ item.patient?.patient_number || '-' }}</div>
        </div>
      </template>
      <template #item.visit_date="{ item }">
        {{ formatDateTime(item.visit_date) }}
      </template>
      <template #item.status="{ item }">
        <VChip :color="getStatusColor(item.status)" size="small" label>
          {{ getStatusLabel(item.status) }}
        </VChip>
      </template>
      <template #item.payment_status="{ item }">
        <VChip :color="getPaymentStatusColor(item.payment_status)" size="small" label>
          {{ getPaymentStatusLabel(item.payment_status) }}
        </VChip>
      </template>
      <template #item.total_amount="{ item }">
        {{ formatCurrency(item.total_amount) }}
      </template>
      <template #item.doctor_id="{ item }">
        {{ getDoctorName(item.doctor_id) }}
      </template>
      <template #item.created_at="{ item }">
        {{ formatDateTime(item.created_at) }}
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex gap-2">
          <VBtn
            icon="tabler-eye"
            size="small"
            variant="text"
            color="primary"
            :to="{ name: 'rme-kunjungan-id', params: { id: item.id } }"
            title="Lihat Detail"
          />
          <VBtn
            icon="tabler-edit"
            size="small"
            variant="text"
            color="warning"
            :to="{ name: 'rme-kunjungan-edit-id', params: { id: item.id } }"
            title="Edit Kunjungan"
          />
        </div>
      </template>
      <template #loading>
        <VSkeletonLoader
          class="mx-auto"
          type="table-row@10"
        />
      </template>
      <template #no-data>
        <div class="text-center py-12">
          <VIcon size="64" color="primary" class="mb-4">tabler-calendar-event</VIcon>
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
            {{ paginationMeta({ page: page, itemsPerPage: itemsPerPage }, totalVisits) }}
          </div>
          <TablePagination
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalVisits"
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
console.log('Kunjungan index.vue loaded');
import TablePagination from '@/@core/components/TablePagination.vue';
import DynamicFilter from '@/components/DynamicFilter.vue';
import { $api } from '@/utils/api';
import { showErrorAlert } from '@/utils/errorHandler';
import { paginationMeta } from '@/utils/paginationMeta';
import { computed, onActivated, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';

// State
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref('visit_date')
const orderBy = ref('desc')
const loading = ref(false)

const visits = ref([])
const totalVisits = ref(0)
const currentFilters = ref([])
const currentQuickSearch = ref('')

const doctorOptions = ref([])
const branchOptions = ref([])

// Reactive field configurations
const allowedFields = [
  'visit_number',
  'patient_id',
  'doctor_id',
  'branch_id',
  'status',
  'payment_status',
  'visit_date',
  'created_at'
]

const fieldConfigs = computed(() => {
  return {
    'visit_number': {
      title: 'Nomor Kunjungan',
      type: 'text'
    },
    'patient_id': {
      title: 'Pasien',
      type: 'select',
      options: [] // Will be populated from patients API
    },
    'doctor_id': {
      title: 'Dokter',
      type: 'select',
      options: doctorOptions.value.slice()
    },
    'branch_id': {
      title: 'Cabang',
      type: 'select',
      options: branchOptions.value.slice()
    },
    'status': {
      title: 'Status',
      type: 'select',
      options: [
        { title: 'Scheduled', value: 'SCHEDULED' },
        { title: 'In Progress', value: 'IN_PROGRESS' },
        { title: 'Completed', value: 'COMPLETED' },
        { title: 'Cancelled', value: 'CANCELLED' }
      ]
    },
    'payment_status': {
      title: 'Status Pembayaran',
      type: 'select',
      options: [
        { title: 'Pending', value: 'PENDING' },
        { title: 'Paid', value: 'PAID' },
        { title: 'Partial', value: 'PARTIAL' },
        { title: 'Refunded', value: 'REFUNDED' }
      ]
    },
    'visit_date': {
      title: 'Tanggal Kunjungan',
      type: 'date'
    },
    'created_at': {
      title: 'Tanggal Dibuat',
      type: 'date'
    }
  }
})

const filterFields = computed(() => {
  return allowedFields.map(field => ({
    title: fieldConfigs.value[field]?.title || field,
    value: field,
    type: fieldConfigs.value[field]?.type || 'text',
    ...fieldConfigs.value[field]
  }))
})

// Dynamic filter configuration
const filterConfig = computed(() => ({
  fields: filterFields.value,
  fieldConfigs: fieldConfigs.value
}))

const perPageOptions = [
  { value: 5, title: '5' },
  { value: 10, title: '10' },
  { value: 15, title: '15' },
  { value: 20, title: '20' },
  { value: -1, title: 'All' },
]

const headers = [
  { title: 'No', key: 'no', sortable: false },
  { title: 'No. Kunjungan', key: 'visit_number' },
  { title: 'Pasien', key: 'patient', sortable: false },
  { title: 'Tanggal Kunjungan', key: 'visit_date' },
  { title: 'Dokter', key: 'doctor_id', sortable: false },
  { title: 'Keluhan', key: 'chief_complaint' },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Status Pembayaran', key: 'payment_status', sortable: false },
  { title: 'Total Bayar', key: 'total_amount' },
  { title: 'Tanggal Input', key: 'created_at' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

// Functions
async function fetchVisits() {
  loading.value = true
  console.log('🔄 Starting fetchVisits...')
  
  try {
    const requestBody = {
      page: page.value,
      per_page: itemsPerPage.value === -1 ? 1000 : itemsPerPage.value,
      sort_by: sortBy.value,
      sort_order: orderBy.value,
    }

    // Add filters if any
    if (currentFilters.value.length > 0) {
      requestBody.filters = currentFilters.value.map(f => ({
        ...f,
        search_query: f.search_query != null ? String(f.search_query) : '',
      }))
    }

    // Add quick search if exists
    if (currentQuickSearch.value?.trim()) {
      if (!requestBody.filters) requestBody.filters = []
      requestBody.filters.push({
        search_by: 'visit_number',
        filter_type: 'like',
        search_query: currentQuickSearch.value.trim()
      })
    }

    console.log('📤 API Request body:', requestBody)
    
    const res = await $api('/rme/patient-visits/paginated', {
      method: 'POST',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    
    visits.value = res.data || []
    totalVisits.value = res.meta?.total || 0
    
    console.log('✅ Visits loaded:', visits.value.length, 'total:', totalVisits.value)
  } catch (error) {
    console.error('❌ Error fetching visits:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Kunjungan',
      text: 'Tidak dapat memuat data kunjungan. Silakan coba lagi.'
    })
    visits.value = []
    totalVisits.value = 0
  } finally {
    loading.value = false
    console.log('🏁 fetchVisits completed')
  }
}

async function fetchDoctors() {
  try {
    const res = await $api('/hris/doctors', {
      method: 'GET',
    })
    doctorOptions.value = (res.data || []).map(doctor => ({
      title: doctor.name,
      value: doctor.id,
    }))
  } catch (e) {
    console.error('Error fetching doctors:', e)
    await showErrorAlert(e, {
      title: 'Gagal Memuat Data Dokter',
      text: 'Tidak dapat memuat daftar dokter untuk filter.'
    })
    doctorOptions.value = []
  }
}

async function fetchBranches() {
  try {
    const res = await $api('/wms/branches', {
      method: 'GET',
    })
    branchOptions.value = (res.data || []).map(branch => ({
      title: `${branch.name} (${branch.code})`,
      value: branch.id,
    }))
  } catch (e) {
    console.error('Error fetching branches:', e)
    await showErrorAlert(e, {
      title: 'Gagal Memuat Data Cabang',
      text: 'Tidak dapat memuat daftar cabang untuk filter.'
    })
    branchOptions.value = []
  }
}

function handleApplyFilters({ filters, quickSearch }) {
  currentFilters.value = filters
  currentQuickSearch.value = quickSearch
  page.value = 1
  fetchVisits()
}

function handleClearFilters() {
  currentFilters.value = []
  currentQuickSearch.value = ''
  page.value = 1
  fetchVisits()
}

function handleApplyQuickSearch(searchQuery) {
  currentQuickSearch.value = searchQuery
  page.value = 1
  fetchVisits()
}

function onUpdateOptions(options) {
  if (options.page !== page.value) page.value = options.page
  if (options.itemsPerPage !== itemsPerPage.value) itemsPerPage.value = options.itemsPerPage
  
  // Handle sorting
  if (options.sortBy && options.sortBy.length > 0) {
    const sortItem = options.sortBy[0]
    sortBy.value = sortItem.key
    orderBy.value = sortItem.order
    fetchVisits()
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'SCHEDULED': return 'info'
    case 'IN_PROGRESS': return 'warning'
    case 'COMPLETED': return 'success'
    case 'CANCELLED': return 'error'
    default: return 'secondary'
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'SCHEDULED': return 'Terjadwal'
    case 'IN_PROGRESS': return 'Sedang Berlangsung'
    case 'COMPLETED': return 'Selesai'
    case 'CANCELLED': return 'Dibatalkan'
    default: return status
  }
}

function getPaymentStatusColor(status) {
  switch (status) {
    case 'PENDING': return 'warning'
    case 'PAID': return 'success'
    case 'PARTIAL': return 'info'
    case 'REFUNDED': return 'error'
    default: return 'secondary'
  }
}

function getPaymentStatusLabel(status) {
  switch (status) {
    case 'PENDING': return 'Menunggu'
    case 'PAID': return 'Lunas'
    case 'PARTIAL': return 'Sebagian'
    case 'REFUNDED': return 'Dikembalikan'
    default: return status
  }
}

function getDoctorName(doctorId) {
  const doctor = doctorOptions.value.find(d => d.value === doctorId)
  return doctor ? doctor.title : '-'
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('id-ID')
}

function formatCurrency(amount) {
  if (!amount) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Watchers
watch([page, itemsPerPage], () => {
  fetchVisits()
})

// Always refresh data when component becomes active
onActivated(() => {
  console.log('🎯 Component onActivated triggered')
  fetchVisits()
})

// Initialize filter config
onMounted(async () => {
  console.log('onMounted kunjungan');
  try {
    await fetchDoctors()
  } catch (e) {}
  try {
    await fetchBranches()
  } catch (e) {}
  fetchVisits()
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
