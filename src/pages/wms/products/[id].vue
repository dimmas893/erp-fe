<route lang="yaml">
meta:
  layout: default
  navActiveLink: wms-products
</route>

<template>
  <VCard>
    <VProgressLinear
      v-if="loading"
      indeterminate
      color="primary"
    />

    <VCardText v-if="loading">
      <!-- Loading skeleton -->
      <div class="d-flex align-center gap-4 mb-6">
        <VSkeleton
          type="avatar"
          size="72"
        />
        <div class="flex-grow-1">
          <VSkeleton
            type="heading"
            class="mb-2"
          />
          <VSkeleton
            type="chip"
            width="80"
          />
        </div>
      </div>
      
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VSkeletonLoader type="list-item-two-line@8" />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VSkeletonLoader type="list-item-two-line@8" />
        </VCol>
      </VRow>
    </VCardText>

    <VCardText v-else-if="product">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center gap-4">
          <VAvatar
            size="72"
            color="primary"
          >
            <VIcon size="40">
              tabler-package
            </VIcon>
          </VAvatar>
          <div class="flex-grow-1">
            <h2 class="text-h4 font-weight-bold mb-1">
              {{ product.name }}
            </h2>
            <div class="d-flex align-center gap-2">
              <VChip
                color="primary"
                size="small"
                variant="outlined"
              >
                {{ product.sku }}
              </VChip>
              <VChip
                :color="product.is_active ? 'success' : 'error'"
                size="small"
              >
                {{ product.is_active ? 'Aktif' : 'Nonaktif' }}
              </VChip>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="d-flex gap-2">
          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="tabler-arrow-left"
            :to="{ name: 'wms-products' }"
          >
            Kembali
          </VBtn>
        </div>
      </div>

      <!-- Basic Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-info-circle
        </VIcon>
        Informasi Dasar
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Nama Produk
            </div>
            <div class="text-h6 font-weight-medium">
              {{ product.name }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              SKU
            </div>
            <div class="text-h6 font-weight-medium">
              {{ product.sku }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Brand
            </div>
            <div class="text-h6 font-weight-medium">
              {{ product.brand }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status
            </div>
            <VChip
              :color="product.is_active ? 'success' : 'error'"
              size="small"
              variant="tonal"
            >
              {{ product.is_active ? 'Aktif' : 'Nonaktif' }}
            </VChip>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kategori
            </div>
            <div v-if="product.category" class="d-flex align-center gap-2">
              <VChip
                :color="getCategoryColor(product.category.code)"
                size="small"
                variant="tonal"
              >
                {{ product.category.code }}
              </VChip>
              <span class="text-h6 font-weight-medium">
                {{ product.category.name }}
              </span>
            </div>
            <span v-else class="text-medium-emphasis">-</span>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tipe Produk
            </div>
            <VChip
              :color="getProductTypeColor(product.product_type)"
              size="small"
              variant="tonal"
            >
              {{ getProductTypeLabel(product.product_type) }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Satuan
            </div>
            <div class="text-h6 font-weight-medium">
              {{ product.unit_of_measure }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Dibuat
            </div>
            <div>{{ formatDateTime(product.created_at) }}</div>
          </div>
        </VCol>
      </VRow>

      <!-- Stock Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-box
        </VIcon>
        Informasi Stok
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="4"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Stok Minimum
            </div>
            <div class="text-h6 font-weight-medium">
              {{ product.min_stock_level }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="4"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Stok Maksimum
            </div>
            <div class="text-h6 font-weight-medium">
              {{ product.max_stock_level }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="4"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Titik Reorder
            </div>
            <div class="text-h6 font-weight-medium">
              {{ product.reorder_point }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Storage Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-temperature
        </VIcon>
        Informasi Penyimpanan
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Persyaratan Penyimpanan
            </div>
            <VChip
              :color="getStorageColor(product.storage_requirement)"
              size="small"
              variant="tonal"
            >
              {{ getStorageLabel(product.storage_requirement) }}
            </VChip>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Masa Simpan
            </div>
            <div class="text-h6 font-weight-medium">
              {{ product.shelf_life_days }} hari
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Physical Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-ruler
        </VIcon>
        Informasi Fisik
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Berat
            </div>
            <div class="text-h6 font-weight-medium">
              {{ product.weight_grams }} gram
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Dimensi
            </div>
            <div class="text-h6 font-weight-medium">
              {{ product.dimensions_cm?.length || 0 }} × {{ product.dimensions_cm?.width || 0 }} × {{ product.dimensions_cm?.height || 0 }} cm
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Tracking Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-qrcode
        </VIcon>
        Informasi Tracking
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="3"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Serialized
            </div>
            <VChip
              :color="product.is_serialized ? 'success' : 'warning'"
              size="small"
              variant="tonal"
            >
              {{ product.is_serialized ? 'Serialized' : 'Non-Serialized' }}
            </VChip>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="3"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Batch Tracked
            </div>
            <VChip
              :color="product.is_batch_tracked ? 'success' : 'warning'"
              size="small"
              variant="tonal"
            >
              {{ product.is_batch_tracked ? 'Batch Tracked' : 'Non-Batch' }}
            </VChip>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="3"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Prescription Required
            </div>
            <VChip
              :color="product.is_prescription_required ? 'error' : 'success'"
              size="small"
              variant="tonal"
            >
              {{ product.is_prescription_required ? 'Prescription' : 'OTC' }}
            </VChip>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="3"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Update
            </div>
            <div>{{ formatDateTime(product.updated_at) }}</div>
          </div>
        </VCol>
      </VRow>

      <!-- Description Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-file-description
        </VIcon>
        Informasi Deskripsi
      </h3>
      
      <VRow class="mb-6">
        <VCol cols="12">
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Deskripsi Produk
            </div>
            <div class="text-body-1">
              {{ product.description }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Product Specifications -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-settings
        </VIcon>
        Spesifikasi Produk
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Volume (cm³)
            </div>
            <div class="text-h6 font-weight-medium">
              {{ calculateVolume() }} cm³
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Density (g/cm³)
            </div>
            <div class="text-h6 font-weight-medium">
              {{ calculateDensity() }} g/cm³
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>

    <!-- Error State -->
    <VCardText v-else>
      <div class="text-center py-12">
        <VIcon
          size="64"
          color="error"
          class="mb-4"
        >
          tabler-alert-circle
        </VIcon>
        <h3 class="text-h6 mb-2">
          Produk Tidak Ditemukan
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Produk yang Anda cari tidak ditemukan atau telah dihapus.
        </p>
        <VBtn
          color="primary"
          variant="tonal"
          :to="{ name: 'wms-products' }"
        >
          Kembali ke Daftar
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert } from '@/utils/errorHandler'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// State
const loading = ref(true)
const product = ref(null)

// Functions
async function fetchProduct() {
  loading.value = true
  
  try {
    const res = await $api(`/wms/products/${route.params.id}`, {
      method: 'GET',
    })
    
    console.log('📥 API Response:', res)
    
    if (res.data) {
      product.value = res.data
    }
  } catch (error) {
    console.error('❌ Error fetching product:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Produk',
      text: 'Tidak dapat memuat data produk. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
  }
}

function getCategoryColor(categoryCode) {
  switch (categoryCode) {
  case 'MEDICINE': return 'primary'
  case 'EQUIPMENT': return 'success'
  case 'COSMETIC': return 'warning'
  case 'DISPOSABLE': return 'info'
  case 'SUPPLEMENT': return 'purple'
  case 'SKINCARE': return 'pink'
  default: return 'secondary'
  }
}

function getProductTypeColor(productType) {
  switch (productType) {
  case 'CONSUMABLE': return 'primary'
  case 'NON_CONSUMABLE': return 'success'
  default: return 'secondary'
  }
}

function getProductTypeLabel(productType) {
  switch (productType) {
  case 'CONSUMABLE': return 'Habis Pakai'
  case 'NON_CONSUMABLE': return 'Tidak Habis Pakai'
  default: return productType
  }
}

function getStorageColor(storageRequirement) {
  switch (storageRequirement) {
  case 'ROOM_TEMP': return 'success'
  case 'REFRIGERATED': return 'info'
  case 'FROZEN': return 'primary'
  default: return 'secondary'
  }
}

function getStorageLabel(storageRequirement) {
  switch (storageRequirement) {
  case 'ROOM_TEMP': return 'Suhu Ruangan'
  case 'REFRIGERATED': return 'Didinginkan'
  case 'FROZEN': return 'Beku'
  default: return storageRequirement
  }
}

function calculateVolume() {
  if (!product.value?.dimensions_cm) return 0
  
  const { length, width, height } = product.value.dimensions_cm
  return (length || 0) * (width || 0) * (height || 0)
}

function calculateDensity() {
  if (!product.value?.weight_grams || !product.value?.dimensions_cm) return 0
  
  const volume = calculateVolume()
  if (volume === 0) return 0
  
  return (product.value.weight_grams / volume).toFixed(2)
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

// Initialize data
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')
  
  // Fetch product data
  await fetchProduct()
})
</script>

<style scoped>
.v-card-text {
  padding: 24px;
}

.v-avatar {
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-primary-darken1));
}

.text-h4 {
  color: var(--v-primary-base);
}

.v-chip {
  font-weight: 500;
}
</style> 
 