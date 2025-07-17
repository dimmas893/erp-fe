<route lang="yaml">
meta:
  layout: default
  navActiveLink: wms-product-categories
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
          <VSkeletonLoader type="list-item-two-line@6" />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VSkeletonLoader type="list-item-two-line@6" />
        </VCol>
      </VRow>
    </VCardText>

    <VCardText v-else-if="productCategory">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center gap-4">
          <VAvatar
            size="72"
            color="primary"
          >
            <VIcon size="40">
              tabler-category
            </VIcon>
          </VAvatar>
          <div class="flex-grow-1">
            <h2 class="text-h4 font-weight-bold mb-1">
              {{ productCategory.name }}
            </h2>
            <div class="d-flex align-center gap-2">
              <VChip
                color="primary"
                size="small"
                variant="outlined"
              >
                {{ productCategory.code }}
              </VChip>
              <VChip
                :color="productCategory.is_active ? 'success' : 'error'"
                size="small"
              >
                {{ productCategory.is_active ? 'Aktif' : 'Nonaktif' }}
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
            :to="{ name: 'wms-product-categories' }"
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
              Nama Kategori
            </div>
            <div class="text-h6 font-weight-medium">
              {{ productCategory.name }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kode Kategori
            </div>
            <div class="text-h6 font-weight-medium">
              {{ productCategory.code }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status
            </div>
            <VChip
              :color="productCategory.is_active ? 'success' : 'error'"
              size="small"
              variant="tonal"
            >
              {{ productCategory.is_active ? 'Aktif' : 'Nonaktif' }}
            </VChip>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kategori Induk
            </div>
            <div v-if="productCategory.parent" class="d-flex align-center gap-2">
              <VChip
                :color="getParentColor(productCategory.parent.code)"
                size="small"
                variant="tonal"
              >
                {{ productCategory.parent.code }}
              </VChip>
              <span class="text-h6 font-weight-medium">
                {{ productCategory.parent.name }}
              </span>
            </div>
            <span v-else class="text-medium-emphasis">-</span>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Dibuat
            </div>
            <div>{{ formatDateTime(productCategory.created_at) }}</div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Update
            </div>
            <div>{{ formatDateTime(productCategory.updated_at) }}</div>
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
              Deskripsi Kategori
            </div>
            <div class="text-body-1">
              {{ productCategory.description }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Hierarchy Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-hierarchy
        </VIcon>
        Informasi Hierarki
      </h3>
      
      <VRow class="mb-6">
        <VCol cols="12">
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tipe Kategori
            </div>
            <VChip
              :color="productCategory.parent_id ? 'info' : 'primary'"
              size="small"
              variant="tonal"
            >
              {{ productCategory.parent_id ? 'Sub Kategori' : 'Kategori Induk' }}
            </VChip>
          </div>
          
          <div v-if="productCategory.parent_id" class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kategori Induk
            </div>
            <div class="d-flex align-center gap-2">
              <VChip
                :color="getParentColor(productCategory.parent.code)"
                size="small"
                variant="tonal"
              >
                {{ productCategory.parent.code }}
              </VChip>
              <span class="text-body-1">{{ productCategory.parent.name }}</span>
            </div>
          </div>
          
          <div v-else class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kategori Induk
            </div>
            <span class="text-medium-emphasis">Tidak ada (Kategori Induk)</span>
          </div>
        </VCol>
      </VRow>

      <!-- Category Type Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-tag
        </VIcon>
        Informasi Tipe Kategori
      </h3>
      
      <VRow class="mb-6">
        <VCol cols="12">
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kode Kategori
            </div>
            <VChip
              color="primary"
              size="large"
              variant="tonal"
            >
              {{ productCategory.code }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Deskripsi Kode
            </div>
            <div class="text-body-1">
              {{ getCategoryCodeDescription(productCategory.code) }}
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
          Kategori Produk Tidak Ditemukan
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Kategori produk yang Anda cari tidak ditemukan atau telah dihapus.
        </p>
        <VBtn
          color="primary"
          variant="tonal"
          :to="{ name: 'wms-product-categories' }"
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
const productCategory = ref(null)

// Functions
async function fetchProductCategory() {
  loading.value = true
  
  try {
    const res = await $api(`/wms/product-categories/${route.params.id}`, {
      method: 'GET',
    })
    
    console.log('📥 API Response:', res)
    
    if (res.data) {
      productCategory.value = res.data
    }
  } catch (error) {
    console.error('❌ Error fetching product category:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Kategori Produk',
      text: 'Tidak dapat memuat data kategori produk. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
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

function getCategoryCodeDescription(code) {
  switch (code) {
  case 'MEDICINE': return 'Kategori untuk obat-obatan dan suplemen medis'
  case 'EQUIPMENT': return 'Kategori untuk peralatan medis dan alat treatment'
  case 'COSMETIC': return 'Kategori untuk produk kosmetik dan perawatan'
  case 'DISPOSABLE': return 'Kategori untuk perlengkapan sekali pakai'
  case 'SUPPLEMENT': return 'Kategori untuk suplemen dan vitamin'
  case 'INJECTABLE': return 'Kategori untuk obat-obatan injeksi'
  case 'LASER_EQP': return 'Kategori untuk peralatan laser'
  case 'BEAUTY_TOOLS': return 'Kategori untuk alat-alat kecantikan'
  case 'MAKEUP': return 'Kategori untuk produk makeup'
  case 'SUNCARE': return 'Kategori untuk produk perlindungan matahari'
  case 'BODYCARE': return 'Kategori untuk produk perawatan tubuh'
  case 'HAIRCARE': return 'Kategori untuk produk perawatan rambut'
  default: return 'Kategori produk untuk kebutuhan klinik'
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

// Initialize data
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')
  
  // Fetch product category data
  await fetchProductCategory()
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
