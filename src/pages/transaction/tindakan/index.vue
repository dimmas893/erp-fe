<route lang="yaml">
meta:
  layout: default
  navActiveLink: transaction-tindakan
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Billing Treatment"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      quick-search-placeholder="Cari berdasarkan nomor billing..."
      :quick-search-fields="['billing_number']"
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
      :items="billings"
      :items-length="totalBillings"
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

      <template #item.billing_number="{ item }">
        {{ item.billing_number }}
      </template>

      <template #item.status="{ item }">
        <VChip
          :color="getStatusColor(item.status)"
          size="small"
          label
        >
          {{ getStatusText(item.status) }}
        </VChip>
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
            :to="{ name: 'transaction-tindakan-id', params: { id: item.id } }"
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
            tabler-receipt
          </VIcon>
          <h3 class="text-h6 mb-2">
            Tidak ada data billing treatment ditemukan
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
            {{ paginationMeta({ page: page, itemsPerPage: itemsPerPage }, totalBillings) }}
          </div>
                      <TablePagination
              v-model:page="page"
              v-model:items-per-page="itemsPerPage"
              :total-items="totalBillings"
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

const billings = ref([])
const totalBillings = ref(0)
const currentFilters = ref([])
const currentQuickSearch = ref('')

// Reactive field configurations
const allowedFields = [
  'billing_number',
  'status',
  'patient_id',
]

const fieldConfigs = computed(() => {
  return {
    'billing_number': {
      title: 'Nomor Billing',
      type: 'text',
      operator: 'like',
    },
    'status': {
      title: 'Status',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Open Treatment', value: 'open_treatment' },
        { title: 'Progress Treatment', value: 'progress_treatment' },
        { title: 'Complete Treatment', value: 'complete_treatment' },
      ],
    },
    'patient_id': {
      title: 'ID Pasien',
      type: 'text',
      operator: 'like',
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
  return !loading.value && initialLoadCompleted.value && billings.value.length === 0
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
  { title: 'Nomor Billing', key: 'billing_number' },
  { title: 'Status', key: 'status' },
  { title: 'Tanggal Dibuat', key: 'created_at' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

// Functions
async function fetchBillings() {
  loading.value = true
  console.log('🔄 Starting fetchBillings...')
  
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
        search_by: 'billing_number',
        filter_type: 'like',
        search_query: currentQuickSearch.value.trim(),
      })
    }

    console.log('📤 API Request body:', requestBody)
    
    const res = await $api('/transaction/billings/paginated', {
      method: 'POST',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    
    billings.value = res.data || []
    totalBillings.value = res.meta?.total || 0
    
    console.log('✅ Billings loaded:', billings.value.length, 'total:', totalBillings.value)
    console.log('📋 Sample billing data:', billings.value[0])
  } catch (error) {
    console.error('❌ Error fetching billings:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Billing',
      text: 'Tidak dapat memuat data billing. Silakan coba lagi.',
    })
    billings.value = []
    totalBillings.value = 0
  } finally {
    loading.value = false
    initialLoadCompleted.value = true
    console.log('🏁 fetchBillings completed')
  }
}

function handleApplyFilters({ filters, quickSearch }) {
  currentFilters.value = filters
  currentQuickSearch.value = quickSearch
  page.value = 1
  fetchBillings()
}

function handleClearFilters() {
  currentFilters.value = []
  currentQuickSearch.value = ''
  page.value = 1
  fetchBillings()
}

function handleApplyQuickSearch(searchQuery) {
  currentQuickSearch.value = searchQuery
  page.value = 1
  fetchBillings()
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

function getStatusColor(status) {
  switch (status) {
  case 'open_treatment': return 'warning'
  case 'progress_treatment': return 'info'
  case 'complete_treatment': return 'success'
  default: return 'secondary'
  }
}

function getStatusText(status) {
  switch (status) {
  case 'open_treatment': return 'Open Treatment'
  case 'progress_treatment': return 'Progress Treatment'
  case 'complete_treatment': return 'Complete Treatment'
  default: return status
  }
}

// Watchers
watch([page, itemsPerPage, sortBy, orderBy], () => {
  // Only fetch if component is already mounted and not in initial loading
  if (initialLoadCompleted.value) {
    fetchBillings()
  }
})

// Always refresh data when component becomes active
onActivated(() => {
  console.log('🎯 Component onActivated triggered')

  // Only fetch if we don't have data and initial load is completed
  if (billings.value.length === 0 && initialLoadCompleted.value) {
    fetchBillings()
  }
})

// Initialize filter config
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')

  // Ensure loading is true for initial load
  loading.value = true
  
  // Set initial filter to show only treatment-related billings
  currentFilters.value = [
    {
      search_by: 'status',
      filter_type: 'in',
      values_list: "open_treatment,progress_treatment,complete_treatment"
    }
  ]
  
  // Only fetch billings once on mount
  fetchBillings()
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
