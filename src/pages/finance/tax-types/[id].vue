<route lang="yaml">
meta:
  layout: default
  navActiveLink: finance-tax-types
</route>

<template>
  <VCard>
    <VProgressLinear v-if="loading" indeterminate color="primary" />

    <!-- Breadcrumb Navigation -->
    <VCardText class="pb-0">
      <VBreadcrumbs :items="breadcrumbItems" divider="tabler-chevron-right">
        <template #title="{ item }">
          <span :class="{ 'text-primary font-weight-medium': item.active }">
            {{ item.title }}
          </span>
        </template>
      </VBreadcrumbs>
    </VCardText>

    <VCardTitle class="d-flex align-center gap-3">
      <VIcon size="24" color="primary">
        tabler-receipt-tax
      </VIcon>
      <span>Detail Jenis Pajak</span>
    </VCardTitle>

    <VCardText v-if="loading">
      <!-- Loading skeleton -->
      <div class="d-flex align-center gap-4 mb-6">
        <VSkeleton type="avatar" size="72" />
        <div class="flex-grow-1">
          <VSkeleton type="heading" class="mb-2" />
          <VSkeleton type="chip" width="80" />
        </div>
      </div>
      
      <VRow>
        <VCol cols="12" md="6">
          <VSkeletonLoader type="list-item-two-line@6" />
        </VCol>
        <VCol cols="12" md="6">
          <VSkeletonLoader type="list-item-two-line@6" />
        </VCol>
      </VRow>
    </VCardText>

    <VCardText v-else-if="taxType">
      <!-- Header Information -->
      <div class="d-flex align-center gap-4 mb-6">
        <VAvatar size="72" color="primary">
          <VIcon size="40">
            tabler-receipt-tax
          </VIcon>
        </VAvatar>
        <div class="flex-grow-1">
          <h2 class="text-h4 font-weight-bold mb-1">
            {{ taxType.tax_name }}
          </h2>
          <div class="d-flex align-center gap-2">
            <VChip color="info" size="small" variant="outlined">
              {{ taxType.tax_code }}
            </VChip>
            <VChip :color="getTaxCategoryColor(taxType.tax_category)" size="small">
              {{ taxType.tax_category }}
            </VChip>
            <VChip :color="taxType.is_active ? 'success' : 'error'" size="small">
              {{ taxType.is_active ? 'Aktif' : 'Nonaktif' }}
            </VChip>
          </div>
        </div>

        <VBtn color="secondary" variant="outlined" prepend-icon="tabler-arrow-left" @click="goBack">
          Kembali
        </VBtn>

        <VBtn color="warning" variant="outlined" prepend-icon="tabler-edit" @click="editTaxType">
          Edit
        </VBtn>
      </div>

      <!-- Tax Type Details -->
      <VRow>
        <!-- Basic Information -->
        <VCol cols="12" md="6">
          <VCard variant="outlined" class="pa-4">
            <VCardTitle class="d-flex align-center gap-2 mb-4">
              <VIcon color="primary">
                tabler-info-circle
              </VIcon>
              Informasi Dasar
            </VCardTitle>
            
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Kode Pajak:</span>
                <span class="info-value">{{ taxType.tax_code }}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Nama Pajak:</span>
                <span class="info-value">{{ taxType.tax_name }}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Kategori:</span>
                <VChip :color="getTaxCategoryColor(taxType.tax_category)" size="small">
                  {{ taxType.tax_category }}
                </VChip>
              </div>
              
              <div class="info-item">
                <span class="info-label">Status:</span>
                <VChip :color="taxType.is_active ? 'success' : 'error'" size="small">
                  {{ taxType.is_active ? 'Aktif' : 'Nonaktif' }}
                </VChip>
              </div>
            </div>
          </VCard>
        </VCol>

        <!-- Timestamps -->
        <VCol cols="12" md="6">
          <VCard variant="outlined" class="pa-4">
            <VCardTitle class="d-flex align-center gap-2 mb-4">
              <VIcon color="success">
                tabler-calendar
              </VIcon>
              Informasi Waktu
            </VCardTitle>
            
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Dibuat:</span>
                <span class="info-value">{{ formatDateTime(taxType.created_at) }}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Update Terakhir:</span>
                <span class="info-value">{{ formatDateTime(taxType.updated_at) }}</span>
              </div>
              
              <div v-if="taxType.deleted_at" class="info-item">
                <span class="info-label">Dihapus:</span>
                <span class="info-value">{{ formatDateTime(taxType.deleted_at) }}</span>
              </div>
            </div>
          </VCard>
        </VCol>
      </VRow>

      <!-- Description -->
      <div v-if="taxType.description" class="mt-6">
        <VCard variant="outlined" class="pa-4">
          <VCardTitle class="d-flex align-center gap-2 mb-4">
            <VIcon color="warning">
              tabler-notes
            </VIcon>
            Deskripsi
          </VCardTitle>
          
          <p class="text-body-1 text-medium-emphasis mb-0">
            {{ taxType.description }}
          </p>
        </VCard>
      </div>

    </VCardText>

    <VCardText v-else>
      <div class="text-center pa-8">
        <VIcon size="64" color="error" class="mb-4">
          tabler-alert-circle
        </VIcon>
        <h4 class="text-h5 font-weight-medium mb-2">Jenis Pajak Tidak Ditemukan</h4>
        <p class="text-medium-emphasis mb-4">
          Jenis pajak dengan ID yang diberikan tidak ditemukan atau telah dihapus.
        </p>
        <VBtn color="primary" prepend-icon="tabler-arrow-left" @click="goBack">
          Kembali ke Daftar Jenis Pajak
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert } from '@/utils/errorHandler'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const taxType = ref(null)
const loading = ref(true)

const breadcrumbItems = ref([
  {
    title: 'Dashboard',
    to: { name: 'dashboards-analytics' },
    active: false,
  },
  {
    title: 'Finance',
    to: { name: 'finance-tax-types' },
    active: false,
  },
  {
    title: 'Jenis Pajak',
    to: { name: 'finance-tax-types' },
    active: false,
  },
  {
    title: 'Detail Jenis Pajak',
    to: { name: 'finance-tax-types-id', params: { id: route.params.id } },
    active: true,
  },
])

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

const loadTaxType = async () => {
  try {
    loading.value = true
    const response = await $api(`/finance/tax-types/${route.params.id}`, {
      method: 'GET',
    })
    
    taxType.value = response.data
    console.log('Tax type data loaded:', taxType.value)
  } catch (error) {
    console.error('Error loading tax type:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Jenis Pajak',
      text: 'Tidak dapat memuat detail jenis pajak. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
  }
}

const editTaxType = () => {
  router.push({ 
    name: 'finance-tax-types-edit-id', 
    params: { id: route.params.id } 
  })
}

const goBack = () => {
  router.push({ name: 'finance-tax-types' })
}

onMounted(() => {
  loadTaxType()
})
</script>

<style lang="scss" scoped>
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  
  .info-label {
    font-weight: 500;
    color: #666;
  }
  
  .info-value {
    font-weight: 600;
    color: #333;
  }
}

// Responsive design
@media (max-width: 768px) {
  .info-grid {
    gap: 0.5rem;
  }
  
  .info-item {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}
</style> 
