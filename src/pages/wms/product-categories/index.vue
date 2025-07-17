<route lang="yaml">
meta:
  layout: default
  navActiveLink: wms-product-categories
</route>

<template>
  <VCard>
    <!-- Dynamic Filter Component -->
    <DynamicFilter
      title="Data Kategori Produk"
      :fields="filterConfig.fields"
      :field-configs="filterConfig.fieldConfigs"
      quick-search-placeholder="Cari nama, kode, atau deskripsi..."
      :quick-search-fields="['name', 'code', 'description']"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @apply-quick-search="handleApplyQuickSearch"
    >
      <template #actions>
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          :to="{ name: 'wms-product-categories-create' }"
        >
          Tambah Kategori Produk
        </VBtn>
      </template>
    </DynamicFilter>
    
    <VDivider />
    <VDataTableServer
      :headers="headers"
      :items="productCategories"
      :items-length="totalProductCategories"
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
          :to="{ name: 'wms-product-categories-id', params: { id: item.id } }"
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
      <template #item.parent="{ item }">
        <div v-if="item && item.parent" class="d-flex align-center gap-2">
          <VChip
            :color="getParentColor(item.parent.code)"
            size="small"
            label
          >
            {{ item.parent.code }}
          </VChip>
          <span class="text-body-2">{{ item.parent.name }}</span>
        </div>
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
            :to="{ name: 'wms-product-categories-id', params: { id: item.id } }"
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
            tabler-category
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
            {{ paginationMeta({ page: page, itemsPerPage: itemsPerPage }, totalProductCategories) }}
          </div>
          <TablePagination
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalProductCategories"
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

const productCategories = ref([])
const totalProductCategories = ref(0)
const currentFilters = ref([])
const currentQuickSearch = ref('')

// Reactive field configurations
const allowedFields = [
  'name',
  'code', 
  'description',
  'parent_id',
  'is_active',
  'created_at',
]

const parentCategoryOptions = ref([])

const fieldConfigs = computed(() => {
  return {
    'name': {
      title: 'Nama Kategori',
      type: 'text',
      operator: 'like',
    },
    'code': {
      title: 'Kode Kategori',
      type: 'text',
      operator: 'like',
    },
    'description': {
      title: 'Deskripsi',
      type: 'text',
      operator: 'like',
    },
    'parent_id': {
      title: 'Kategori Induk',
      type: 'select',
      operator: 'equal',
      options: parentCategoryOptions.value,
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
  return !loading.value && initialLoadCompleted.value && productCategories.value.length === 0
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
  { title: 'Nama Kategori', key: 'name' },
  { title: 'Kode', key: 'code' },
  { title: 'Deskripsi', key: 'description' },
  { title: 'Kategori Induk', key: 'parent' },
  { title: 'Status', key: 'is_active', sortable: false },
  { title: 'Tanggal Dibuat', key: 'created_at' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

// Functions
async function fetchProductCategories() {
  loading.value = true
  console.log('🔄 Starting fetchProductCategories...')
  
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
    
    const res = await $api('/wms/product-categories/paginated', {
      method: 'POST',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    
    // Handle the API response structure correctly
    if (res.data && Array.isArray(res.data)) {
      productCategories.value = res.data || []
      totalProductCategories.value = res.meta?.total || 0
    } else if (res.data && res.data.data) {
      productCategories.value = res.data.data || []
      totalProductCategories.value = res.data.meta?.total || 0
    } else {
      productCategories.value = res.data || []
      totalProductCategories.value = res.meta?.total || 0
    }
    
    console.log('✅ Product Categories loaded:', productCategories.value.length, 'total:', totalProductCategories.value)
  } catch (error) {
    console.error('❌ Error fetching product categories:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Kategori Produk',
      text: 'Tidak dapat memuat data kategori produk. Silakan coba lagi.',
    })
    productCategories.value = []
    totalProductCategories.value = 0
  } finally {
    loading.value = false
    initialLoadCompleted.value = true
    console.log('🏁 fetchProductCategories completed')
  }
}

async function fetchParentCategories() {
  try {
    const res = await $api('/wms/product-categories', {
      method: 'GET',
    })
    
    if (res.data && Array.isArray(res.data)) {
      const options = res.data
        .filter(category => category.parent_id === null) // Only parent categories
        .map(category => ({
          title: category.name,
          value: category.id,
        }))
      
      // Update the parent category options
      parentCategoryOptions.value = options
    }
  } catch (error) {
    console.error('❌ Error fetching parent categories:', error)
  }
}

function handleApplyFilters({ filters, quickSearch }) {
  currentFilters.value = filters
  currentQuickSearch.value = quickSearch
  page.value = 1
  fetchProductCategories()
}

function handleClearFilters() {
  currentFilters.value = []
  currentQuickSearch.value = ''
  page.value = 1
  fetchProductCategories()
}

function handleApplyQuickSearch(searchQuery) {
  currentQuickSearch.value = searchQuery
  page.value = 1
  fetchProductCategories()
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

function getParentColor(parentCode) {
  switch (parentCode) {
  case 'MEDICINE': return 'primary'
  case 'EQUIPMENT': return 'success'
  case 'COSMETIC': return 'warning'
  case 'DISPOSABLE': return 'info'
  case 'SUPPLEMENT': return 'purple'
  default: return 'secondary'
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
    fetchProductCategories()
  }
})

// Always refresh data when component becomes active
onActivated(() => {
  console.log('🎯 Component onActivated triggered')

  // Only fetch if we don't have data and initial load is completed
  if (productCategories.value.length === 0 && initialLoadCompleted.value) {
    fetchProductCategories()
  }
})

// Initialize filter config
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')

  // Ensure loading is true for initial load
  loading.value = true
  
  // Fetch parent categories for filter options
  await fetchParentCategories()
  
  // Only fetch product categories once on mount
  fetchProductCategories()
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
