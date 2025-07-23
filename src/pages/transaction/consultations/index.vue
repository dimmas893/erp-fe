<route lang="yaml">
meta:
  layout: default
  navActiveLink: transaction-consultations
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Konsultasi"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      quick-search-placeholder="Cari berdasarkan tipe konsultasi..."
      :quick-search-fields="['consultation_type']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
    >
      <template #actions>
        <!-- Create button removed as per requirement -->
      </template>
    </DynamicFilter>
    
    <VDivider />
    <VDataTableServer
      :headers="headers"
      :items="consultations"
      :items-length="totalConsultations"
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

      <template #item.fee="{ item }">
        {{ formatCurrency(item.fee) }}
      </template>
      <template #item.consultation_type="{ item }">
        <VChip
          :color="getConsultationTypeColor(item.consultation_type)"
          size="small"
          label
        >
          {{ getConsultationTypeText(item.consultation_type) }}
        </VChip>
      </template>
      <template #item.start_time="{ item }">
        {{ formatDateTime(item.start_time) }}
      </template>
      <template #item.end_time="{ item }">
        {{ item.end_time ? formatDateTime(item.end_time) : '-' }}
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
            :to="{ name: 'transaction-consultations-id', params: { id: item.id } }"
            title="Lihat Detail"
          />
          <!-- Edit button removed as per requirement -->
          <!-- Billing button removed as route might not exist -->
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
            {{ paginationMeta({ page: page, itemsPerPage: itemsPerPage }, totalConsultations) }}
          </div>
          <TablePagination
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalConsultations"
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
const sortBy = ref('start_time')
const orderBy = ref('desc')
const loading = ref(true) // Start with loading true for initial load
const initialLoadCompleted = ref(false)

const consultations = ref([])
const totalConsultations = ref(0)
const currentFilters = ref([])
const currentQuickSearch = ref('')

// Reactive field configurations
const allowedFields = [
  'consultation_type',
]

const fieldConfigs = computed(() => {
  return {
    'consultation_type': {
      title: 'Tipe Konsultasi',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Konsultasi Awal', value: 'INITIAL' },
        { title: 'Konsultasi Lanjutan', value: 'FOLLOW_UP' },
        { title: 'Konsultasi Darurat', value: 'EMERGENCY' },
      ],
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
  return !loading.value && initialLoadCompleted.value && consultations.value.length === 0
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
  { title: 'Tipe Konsultasi', key: 'consultation_type' },
  { title: 'Biaya', key: 'fee' },
  { title: 'Waktu Mulai', key: 'start_time' },
  { title: 'Waktu Selesai', key: 'end_time' },
  { title: 'Diagnosis', key: 'diagnosis' },
  { title: 'Rencana Perawatan', key: 'treatment_plan' },
  { title: 'Catatan', key: 'consultation_notes' },
  { title: 'Tanggal Dibuat', key: 'created_at' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

// Functions
async function fetchConsultations() {
  loading.value = true
  console.log('🔄 Starting fetchConsultations...')
  
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
        search_by: 'consultation_type',
        filter_type: 'like',
        search_query: currentQuickSearch.value.trim(),
      })
    }

    console.log('📤 API Request body:', requestBody)
    
    const res = await $api('/rme/visit-consultations/paginated', {
      method: 'POST',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    
    consultations.value = res.data || []
    totalConsultations.value = res.meta?.total || 0
    
    console.log('✅ Consultations loaded:', consultations.value.length, 'total:', totalConsultations.value)
    console.log('📋 Sample consultation data:', consultations.value[0])
  } catch (error) {
    console.error('❌ Error fetching consultations:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Konsultasi',
      text: 'Tidak dapat memuat data konsultasi. Silakan coba lagi.',
    })
    consultations.value = []
    totalConsultations.value = 0
  } finally {
    loading.value = false
    initialLoadCompleted.value = true
    console.log('🏁 fetchConsultations completed')
  }
}

function handleApplyFilters({ filters, quickSearch }) {
  currentFilters.value = filters
  currentQuickSearch.value = quickSearch
  page.value = 1
  fetchConsultations()
}

function handleClearFilters() {
  currentFilters.value = []
  currentQuickSearch.value = ''
  page.value = 1
  fetchConsultations()
}

function handleApplyQuickSearch(searchQuery) {
  currentQuickSearch.value = searchQuery
  page.value = 1
  fetchConsultations()
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

function getConsultationTypeColor(type) {
  switch (type) {
  case 'INITIAL': return 'primary'
  case 'FOLLOW_UP': return 'success'
  case 'EMERGENCY': return 'error'
  default: return 'secondary'
  }
}

function getConsultationTypeText(type) {
  switch (type) {
  case 'INITIAL': return 'Konsultasi Awal'
  case 'FOLLOW_UP': return 'Konsultasi Lanjutan'
  case 'EMERGENCY': return 'Konsultasi Darurat'
  default: return type
  }
}

function formatCurrency(amount) {
  if (!amount) return 'Rp 0'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

// Watchers
watch([page, itemsPerPage, sortBy, orderBy], () => {
  // Only fetch if component is already mounted and not in initial loading
  if (initialLoadCompleted.value) {
    fetchConsultations()
  }
})

// Always refresh data when component becomes active
onActivated(() => {
  console.log('🎯 Component onActivated triggered')

  // Only fetch if we don't have data and initial load is completed
  if (consultations.value.length === 0 && initialLoadCompleted.value) {
    fetchConsultations()
  }
})

// Initialize filter config
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')

  // Ensure loading is true for initial load
  loading.value = true
  
  // Only fetch consultations once on mount
  fetchConsultations()
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
 