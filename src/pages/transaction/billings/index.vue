<route lang="yaml">
meta:
  layout: default
  navActiveLink: transaction-billings
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Tagihan"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      quick-search-placeholder="Cari berdasarkan status..."
      :quick-search-fields="['status']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
    >
      <template #actions>
        <div class="d-flex gap-2">
          <!-- <VBtn
            color="info"
            prepend-icon="tabler-route"
            :to="{ name: 'transaction-billings-flow' }"
            variant="tonal"
          >
            Alur
          </VBtn> -->
          <VBtn
            color="primary"
            prepend-icon="tabler-message-circle"
            :to="{ name: 'transaction-billings-consultation-create' }"
            variant="tonal"
          >
            Konsultasi
          </VBtn>
          <VBtn
            color="warning"
            prepend-icon="tabler-stethoscope"
            :to="{ name: 'transaction-billings-treatment-create' }"
            variant="tonal"
          >
            Tindakan
          </VBtn>
          <!-- <VBtn
            color="success"
            prepend-icon="tabler-package"
            :to="{ name: 'transaction-billings-product-create' }"
            variant="tonal"
          >
            Produk
          </VBtn> -->
        </div>
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

      <template #item.total_amount="{ item }">
        {{ formatCurrency(item.total_amount) }}
      </template>
      
      <template #item.discount_amount="{ item }">
        {{ formatCurrency(item.discount_amount) }}
      </template>
      <template #item.tax_amount="{ item }">
        {{ formatCurrency(item.tax_amount) }}
      </template>
      <template #item.grand_total="{ item }">
        <span class="font-weight-bold">{{ formatCurrency(item.grand_total) }}</span>
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
      <template #item.paid_at="{ item }">
        {{ item.paid_at ? formatDateTime(item.paid_at) : '-' }}
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
            :to="{ name: 'transaction-billings-id', params: { id: item.id } }"
            title="Lihat Detail"
          />
          <VBtn
            icon="tabler-edit"
            size="small"
            variant="text"
            color="warning"
            :to="{ name: 'transaction-billings-edit-id', params: { id: item.id } }"
            title="Edit Tagihan"
          />
          <!-- Consultation button removed as route doesn't exist -->
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
  'status',
]

const fieldConfigs = computed(() => {
  return {
    'status': {
      title: 'Status',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Draft', value: 'draft' },
        { title: 'Belum Lunas', value: 'unpaid' },
        { title: 'Lunas', value: 'paid' },
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
  { title: 'Nomor Tagihan', key: 'billing_number' },
  { title: 'Total', key: 'total_amount' },
  { title: 'Diskon', key: 'discount_amount' },
  { title: 'Pajak', key: 'tax_amount' },
  { title: 'Total Akhir', key: 'grand_total' },
  { title: 'Status', key: 'status' },
  { title: 'Tanggal Bayar', key: 'paid_at' },
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
        search_by: 'status',
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
      title: 'Gagal Memuat Data Tagihan',
      text: 'Tidak dapat memuat data tagihan. Silakan coba lagi.',
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

function getStatusColor(status) {
  switch (status) {
  case 'paid': return 'success'
  case 'unpaid': return 'warning'
  case 'draft': return 'secondary'
  default: return 'secondary'
  }
}

function getStatusText(status) {
  switch (status) {
  case 'paid': return 'Lunas'
  case 'unpaid': return 'Belum Lunas'
  case 'draft': return 'Draft'
  default: return status
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
