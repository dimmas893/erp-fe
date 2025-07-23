<route lang="yaml">
meta:
  layout: default
  navActiveLink: crm-promos
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Promo"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      quick-search-placeholder="Cari kode, nama, atau deskripsi promo..."
      :quick-search-fields="['code', 'name', 'description']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
    >
      <template #actions>
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          :to="{ name: 'crm-promos-create' }"
        >
          Tambah Promo
        </VBtn>
      </template>
    </DynamicFilter>
    
    <VDivider />
    <VDataTableServer
      :headers="headers"
      :items="promos"
      :items-length="totalPromos"
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
          :to="{ name: 'crm-promos-id', params: { id: item.id } }"
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
      <template #item.type="{ item }">
        <VChip
          v-if="item && item.type"
          :color="getPromoTypeColor(item.type)"
          size="small"
          label
        >
          {{ getPromoTypeLabel(item.type) }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.discount_type="{ item }">
        <VChip
          v-if="item && item.discount_type"
          :color="getDiscountTypeColor(item.discount_type)"
          size="small"
          label
        >
          {{ getDiscountTypeLabel(item.discount_type) }}
        </VChip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.discount_value="{ item }">
        <span v-if="item && item.discount_value" class="font-weight-medium">
          {{ item.discount_type === 'percentage' ? `${item.discount_value}%` : formatCurrency(item.discount_value) }}
        </span>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.min_purchase="{ item }">
        <span v-if="item && item.min_purchase" class="font-weight-medium">
          {{ formatCurrency(item.min_purchase) }}
        </span>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.usage_limit="{ item }">
        <span v-if="item && item.usage_limit" class="font-weight-medium">
          {{ item.used_count || 0 }} / {{ item.usage_limit }}
        </span>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.start_date="{ item }">
        {{ item && item.start_date ? formatDate(item.start_date) : '-' }}
      </template>
      <template #item.end_date="{ item }">
        {{ item && item.end_date ? formatDate(item.end_date) : '-' }}
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
            :to="{ name: 'crm-promos-id', params: { id: item.id } }"
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
            tabler-tag
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
            {{ paginationMeta({ page: page, itemsPerPage: itemsPerPage }, totalPromos) }}
          </div>
          <TablePagination
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalPromos"
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

const promos = ref([])
const totalPromos = ref(0)
const currentFilters = ref([])
const currentQuickSearch = ref('')

// Reactive field configurations
const allowedFields = [
  'code',
  'name',
  'type',
  'description',
  'discount_type',
  'discount_value',
  'min_purchase',
  'usage_limit',
  'start_date',
  'end_date',
  'is_active',
  'created_at',
]

const fieldConfigs = computed(() => {
  return {
    'code': {
      title: 'Kode Promo',
      type: 'text',
      operator: 'like',
    },
    'name': {
      title: 'Nama Promo',
      type: 'text',
      operator: 'like',
    },
    'type': {
      title: 'Tipe Promo',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Voucher', value: 'voucher' },
        { title: 'Discount', value: 'discount' },
        { title: 'Cashback', value: 'cashback' },
      ],
    },
    'description': {
      title: 'Deskripsi',
      type: 'text',
      operator: 'like',
    },
    'discount_type': {
      title: 'Tipe Diskon',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Persentase', value: 'percentage' },
        { title: 'Nominal', value: 'nominal' },
      ],
    },
    'discount_value': {
      title: 'Nilai Diskon',
      type: 'number',
      operator: 'equal',
    },
    'min_purchase': {
      title: 'Minimal Pembelian',
      type: 'number',
      operator: 'equal',
    },
    'usage_limit': {
      title: 'Limit Penggunaan',
      type: 'number',
      operator: 'equal',
    },
    'start_date': {
      title: 'Tanggal Mulai',
      type: 'date',
      operator: 'date',
    },
    'end_date': {
      title: 'Tanggal Berakhir',
      type: 'date',
      operator: 'date',
    },
    'is_active': {
      title: 'Status',
      type: 'select',
      operator: 'equal',
      options: [
        { title: 'Aktif', value: true },
        { title: 'Nonaktif', value: false },
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
  return !loading.value && initialLoadCompleted.value && promos.value.length === 0
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
  { title: 'Nama Promo', key: 'name' },
  { title: 'Kode', key: 'code' },
  { title: 'Tipe', key: 'type' },
  { title: 'Tipe Diskon', key: 'discount_type' },
  { title: 'Nilai Diskon', key: 'discount_value' },
  { title: 'Min. Pembelian', key: 'min_purchase' },
  { title: 'Penggunaan', key: 'usage_limit', sortable: false },
  { title: 'Mulai', key: 'start_date' },
  { title: 'Berakhir', key: 'end_date' },
  { title: 'Status', key: 'is_active', sortable: false },
  { title: 'Tanggal Dibuat', key: 'created_at' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

// Functions
async function fetchPromos() {
  loading.value = true
  console.log('🔄 Starting fetchPromos...')
  
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
    
    const res = await $api('/crm/promo-engine/promos/paginated', {
      method: 'POST',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    
    // Handle the API response structure correctly
    if (res.data && Array.isArray(res.data)) {
      promos.value = res.data || []
      totalPromos.value = res.meta?.total || 0
    } else if (res.data && res.data.data) {
      promos.value = res.data.data || []
      totalPromos.value = res.data.meta?.total || 0
    } else {
      promos.value = res.data || []
      totalPromos.value = res.meta?.total || 0
    }
    
    console.log('✅ Promos loaded:', promos.value.length, 'total:', totalPromos.value)
  } catch (error) {
    console.error('❌ Error fetching promos:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Promo',
      text: 'Tidak dapat memuat data promo. Silakan coba lagi.',
    })
    promos.value = []
    totalPromos.value = 0
  } finally {
    loading.value = false
    initialLoadCompleted.value = true
    console.log('🏁 fetchPromos completed')
  }
}

function handleApplyFilters({ filters, quickSearch }) {
  currentFilters.value = filters
  currentQuickSearch.value = quickSearch
  page.value = 1
  fetchPromos()
}

function handleClearFilters() {
  currentFilters.value = []
  currentQuickSearch.value = ''
  page.value = 1
  fetchPromos()
}

function handleApplyQuickSearch(searchQuery) {
  currentQuickSearch.value = searchQuery
  page.value = 1
  fetchPromos()
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

function getPromoTypeColor(type) {
  switch (type) {
  case 'voucher': return 'primary'
  case 'discount': return 'success'
  case 'cashback': return 'warning'
  default: return 'secondary'
  }
}

function getPromoTypeLabel(type) {
  switch (type) {
  case 'voucher': return 'Voucher'
  case 'discount': return 'Diskon'
  case 'cashback': return 'Cashback'
  default: return type
  }
}

function getDiscountTypeColor(type) {
  switch (type) {
  case 'percentage': return 'primary'
  case 'nominal': return 'success'
  default: return 'secondary'
  }
}

function getDiscountTypeLabel(type) {
  switch (type) {
  case 'percentage': return 'Persentase'
  case 'nominal': return 'Nominal'
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
    fetchPromos()
  }
})

// Always refresh data when component becomes active
onActivated(() => {
  console.log('🎯 Component onActivated triggered')

  // Only fetch if we don't have data and initial load is completed
  if (promos.value.length === 0 && initialLoadCompleted.value) {
    fetchPromos()
  }
})

// Initialize filter config
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')

  // Ensure loading is true for initial load
  loading.value = true
  
  // Only fetch promos once on mount
  fetchPromos()
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

