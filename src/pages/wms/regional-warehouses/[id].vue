<route lang="yaml">
meta:
  layout: default
  navActiveLink: wms-regional-warehouses
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

    <VCardText v-else-if="regionalWarehouse">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center gap-4">
          <VAvatar
            size="72"
            color="primary"
          >
            <VIcon size="40">
              tabler-building-warehouse
            </VIcon>
          </VAvatar>
          <div class="flex-grow-1">
            <h2 class="text-h4 font-weight-bold mb-1">
              {{ regionalWarehouse.name }}
            </h2>
            <div class="d-flex align-center gap-2">
              <VChip
                :color="getRegionColor(regionalWarehouse.region)"
                size="small"
              >
                {{ regionalWarehouse.region }}
              </VChip>
              <VChip
                color="primary"
                size="small"
                variant="outlined"
              >
                {{ regionalWarehouse.code }}
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
            :to="{ name: 'wms-regional-warehouses' }"
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
              Nama Regional Warehouse
            </div>
            <div class="text-h6 font-weight-medium">
              {{ regionalWarehouse.name }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kode Regional Warehouse
            </div>
            <div class="text-h6 font-weight-medium">
              {{ regionalWarehouse.code }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Region
            </div>
            <VChip
              :color="getRegionColor(regionalWarehouse.region)"
              size="small"
              variant="tonal"
            >
              {{ regionalWarehouse.region }}
            </VChip>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Central Warehouse
            </div>
            <div class="text-h6 font-weight-medium">
              {{ getCentralWarehouseName(regionalWarehouse.central_warehouse_id) }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Dibuat
            </div>
            <div>{{ formatDateTime(regionalWarehouse.created_at) }}</div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Update
            </div>
            <div>{{ formatDateTime(regionalWarehouse.updated_at) }}</div>
          </div>
        </VCol>
      </VRow>

      <!-- Address Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-map-pin
        </VIcon>
        Informasi Alamat
      </h3>
      
      <VRow class="mb-6">
        <VCol cols="12">
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Alamat Lengkap
            </div>
            <div class="text-body-1">
              {{ regionalWarehouse.address }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Central Warehouse Details -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-building
        </VIcon>
        Informasi Central Warehouse
      </h3>
      
      <VRow class="mb-6" v-if="centralWarehouse">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Nama Central Warehouse
            </div>
            <div class="text-h6 font-weight-medium">
              {{ centralWarehouse.name }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kode Central Warehouse
            </div>
            <div class="text-h6 font-weight-medium">
              {{ centralWarehouse.code }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kapasitas (m³)
            </div>
            <div class="text-h6 font-weight-medium">
              {{ formatNumber(centralWarehouse.capacity_m3) }} m³
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status
            </div>
            <VChip
              :color="centralWarehouse.is_active ? 'success' : 'error'"
              size="small"
              variant="tonal"
            >
              {{ centralWarehouse.is_active ? 'Aktif' : 'Nonaktif' }}
            </VChip>
          </div>
        </VCol>
        
        <VCol cols="12">
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Alamat Central Warehouse
            </div>
            <div class="text-body-1">
              {{ centralWarehouse.address }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Region Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-world
        </VIcon>
        Informasi Region
      </h3>
      
      <VRow class="mb-6">
        <VCol cols="12">
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Region
            </div>
            <VChip
              :color="getRegionColor(regionalWarehouse.region)"
              size="large"
              variant="tonal"
            >
              {{ regionalWarehouse.region }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Deskripsi Region
            </div>
            <div class="text-body-1">
              {{ getRegionDescription(regionalWarehouse.region) }}
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
          Regional Warehouse Tidak Ditemukan
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Regional warehouse yang Anda cari tidak ditemukan atau telah dihapus.
        </p>
        <VBtn
          color="primary"
          variant="tonal"
          :to="{ name: 'wms-regional-warehouses' }"
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
const regionalWarehouse = ref(null)
const centralWarehouse = ref(null)

// Functions
async function fetchRegionalWarehouse() {
  loading.value = true
  
  try {
    const res = await $api(`/wms/regional-warehouses/${route.params.id}`, {
      method: 'GET',
    })
    
    console.log('📥 API Response:', res)
    
    if (res.data) {
      regionalWarehouse.value = res.data
      
      // Fetch central warehouse details if we have the ID
      if (regionalWarehouse.value.central_warehouse_id) {
        await fetchCentralWarehouse(regionalWarehouse.value.central_warehouse_id)
      }
    }
  } catch (error) {
    console.error('❌ Error fetching regional warehouse:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Regional Warehouse',
      text: 'Tidak dapat memuat data regional warehouse. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
  }
}

async function fetchCentralWarehouse(centralWarehouseId) {
  try {
    const res = await $api(`/central-warehouses/${centralWarehouseId}`, {
      method: 'GET',
    })
    
    if (res.data) {
      centralWarehouse.value = res.data
    }
  } catch (error) {
    console.error('❌ Error fetching central warehouse:', error)
    // Don't show error alert for this as it's not critical
  }
}

function getRegionColor(region) {
  switch (region) {
  case 'JABODETABEK': return 'primary'
  case 'JAWA_BARAT': return 'success'
  case 'JAWA_TIMUR': return 'warning'
  case 'JAWA_TENGAH': return 'info'
  case 'SUMATERA_UTARA': return 'error'
  case 'SUMATERA_SELATAN': return 'secondary'
  case 'KALIMANTAN': return 'purple'
  case 'SULAWESI': return 'orange'
  case 'PAPUA': return 'brown'
  default: return 'secondary'
  }
}

function getRegionDescription(region) {
  switch (region) {
  case 'JABODETABEK': return 'Jakarta, Bogor, Depok, Tangerang, Bekasi'
  case 'JAWA_BARAT': return 'Provinsi Jawa Barat'
  case 'JAWA_TIMUR': return 'Provinsi Jawa Timur'
  case 'JAWA_TENGAH': return 'Provinsi Jawa Tengah'
  case 'SUMATERA_UTARA': return 'Provinsi Sumatra Utara'
  case 'SUMATERA_SELATAN': return 'Provinsi Sumatra Selatan'
  case 'KALIMANTAN': return 'Pulau Kalimantan'
  case 'SULAWESI': return 'Pulau Sulawesi'
  case 'PAPUA': return 'Pulau Papua'
  default: return 'Region tidak diketahui'
  }
}

function getCentralWarehouseName(centralWarehouseId) {
  if (!centralWarehouseId) return '-'
  return centralWarehouse.value?.name || 'Loading...'
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

function formatNumber(number) {
  if (!number) return '0'
  
  return new Intl.NumberFormat('id-ID').format(number)
}

// Initialize data
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')
  
  // Fetch regional warehouse data
  await fetchRegionalWarehouse()
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
