<route lang="yaml">
meta:
  layout: default
  navActiveLink: finance-tax-types
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Jenis Pajak"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      quick-search-placeholder="Cari kode, nama, atau kategori pajak..."
      :quick-search-fields="['tax_code', 'tax_name', 'tax_category']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
    >
      <template #actions>
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          :to="{ name: 'finance-tax-types-create' }"
        >
          Tambah Jenis Pajak
        </VBtn>
      </template>
    </DynamicFilter>
    
    <VDivider />
    <VDataTableServer
      :headers="headers"
      :items="taxTypes"
      :items-length="totalTaxTypes"
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
      <template #item.tax_name="{ item }">
        <RouterLink
          :to="{ name: 'finance-tax-types-id', params: { id: item.id } }"
          class="text-primary text-decoration-underline font-weight-medium"
        >
          {{ item.tax_name }}
        </RouterLink>
      </template>
      <template #item.tax_code="{ item }">
        <VChip
          color="info"
          size="small"
          variant="outlined"
        >
          {{ item.tax_code }}
        </VChip>
      </template>
      <template #item.tax_category="{ item }">
        <VChip
          :color="getTaxCategoryColor(item.tax_category)"
          size="small"
          variant="outlined"
        >
          {{ item.tax_category }}
        </VChip>
      </template>
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
      <template #item.actions="{ item }">
        <div class="d-flex gap-2">
          <VBtn
            icon="tabler-eye"
            size="small"
            variant="text"
            color="primary"
            :to="{ name: 'finance-tax-types-id', params: { id: item.id } }"
            title="Lihat Detail"
          />
          <VBtn
            icon="tabler-edit"
            size="small"
            variant="text"
            color="warning"
            :to="{ name: 'finance-tax-types-edit-id', params: { id: item.id } }"
            title="Edit Jenis Pajak"
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
        <div
          v-if="shouldShowNoData"
          class="text-center py-12"
        >
          <VIcon
            size="64"
            color="primary"
            class="mb-4"
          >
            tabler-receipt-tax
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
            {{ paginationMeta({ page: page, itemsPerPage: itemsPerPage }, totalTaxTypes) }}
          </div>
          <TablePagination
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalTaxTypes"
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
import { RouterLink } from 'vue-router'

// State
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref('created_at')
const orderBy = ref('desc')
const loading = ref(true)
const initialLoadCompleted = ref(false)

const taxTypes = ref([])
const totalTaxTypes = ref(0)
const appliedFilters = ref({})
const quickSearchQuery = ref('')

// Per page options
const perPageOptions = [
  { title: '10', value: 10 },
  { title: '25', value: 25 },
  { title: '50', value: 50 },
  { title: '100', value: 100 },
]

// Table headers
const headers = [
  { title: 'No', key: 'no', sortable: false, width: '80px' },
  { title: 'Kode Pajak', key: 'tax_code', sortable: true },
  { title: 'Nama Pajak', key: 'tax_name', sortable: true },
  { title: 'Kategori', key: 'tax_category', sortable: true },
  { title: 'Deskripsi', key: 'description', sortable: false },
  { title: 'Status', key: 'is_active', sortable: true },
  { title: 'Dibuat', key: 'created_at', sortable: true },
  { title: 'Aksi', key: 'actions', sortable: false, width: '120px' },
]

// Filter configuration
const filterConfig = {
  fields: [
    {
      key: 'tax_code',
      label: 'Kode Pajak',
      type: 'text',
      placeholder: 'Masukkan kode pajak...',
    },
    {
      key: 'tax_name',
      label: 'Nama Pajak',
      type: 'text',
      placeholder: 'Masukkan nama pajak...',
    },
    {
      key: 'tax_category',
      label: 'Kategori',
      type: 'select',
      placeholder: 'Pilih kategori...',
      options: [
        { title: 'PPN', value: 'PPN' },
        { title: 'PPH', value: 'PPH' },
        { title: 'OTHER', value: 'OTHER' },
      ],
    },
    {
      key: 'is_active',
      label: 'Status',
      type: 'select',
      placeholder: 'Pilih status...',
      options: [
        { title: 'Aktif', value: 'true' },
        { title: 'Nonaktif', value: 'false' },
      ],
    },
  ],
  fieldConfigs: {
    tax_code: { clearable: true },
    tax_name: { clearable: true },
    tax_category: { clearable: true },
    is_active: { clearable: true },
  },
}

// Computed
const shouldShowNoData = computed(() => {
  return !loading.value && taxTypes.value.length === 0
})

// Methods
const getTaxCategoryColor = (category) => {
  const colors = {
    'PPN': 'warning',
    'PPH': 'error',
    'OTHER': 'secondary',
  }
  return colors[category] || 'default'
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  
  return new Date(dateString).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const loadTaxTypes = async () => {
  try {
    loading.value = true
    console.log('🔄 Loading tax types...')
    
    const params = {
      page: page.value,
      per_page: itemsPerPage.value,
      sort_by: sortBy.value,
      sort_order: orderBy.value,
    }
    
    // Add filters
    if (Object.keys(appliedFilters.value).length > 0) {
      Object.assign(params, appliedFilters.value)
    }
    
    // Add quick search
    if (quickSearchQuery.value) {
      params.search = quickSearchQuery.value
    }
    
    console.log('📤 Request params:', params)
    
    const response = await $api('/finance/tax-types/paginated', {
      method: 'POST',
      body: params,
    })
    
    console.log('📥 Response:', response)
    
    taxTypes.value = response.data || []
    totalTaxTypes.value = response.meta?.total || 0
    
    console.log('✅ Tax types loaded:', taxTypes.value.length, 'items')
  } catch (error) {
    console.error('❌ Error loading tax types:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Jenis Pajak',
      text: 'Tidak dapat memuat daftar jenis pajak. Silakan coba lagi.',
    })
    taxTypes.value = []
    totalTaxTypes.value = 0
  } finally {
    loading.value = false
    initialLoadCompleted.value = true
  }
}

const onUpdateOptions = (options) => {
  console.log('🔄 Table options updated:', options)
  
  if (options.page) page.value = options.page
  if (options.itemsPerPage) itemsPerPage.value = options.itemsPerPage
  
  if (options.sortBy && options.sortBy.length > 0) {
    const sort = options.sortBy[0]
    sortBy.value = sort.key
    orderBy.value = sort.order
  }
  
  loadTaxTypes()
}

const handleApplyFilters = (filters) => {
  console.log('🔍 Applying filters:', filters)
  appliedFilters.value = filters
  page.value = 1 // Reset to first page
  loadTaxTypes()
}

const handleClearFilters = () => {
  console.log('🧹 Clearing filters')
  appliedFilters.value = {}
  quickSearchQuery.value = ''
  page.value = 1
  loadTaxTypes()
}

const handleApplyQuickSearch = (query) => {
  console.log('🔍 Applying quick search:', query)
  quickSearchQuery.value = query
  page.value = 1
  loadTaxTypes()
}

// Watchers
watch([page, itemsPerPage], () => {
  if (initialLoadCompleted.value) {
    loadTaxTypes()
  }
})

// Lifecycle
onMounted(() => {
  loadTaxTypes()
})

onActivated(() => {
  if (initialLoadCompleted.value) {
    loadTaxTypes()
  }
})
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style> 
