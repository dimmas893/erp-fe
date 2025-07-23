<route lang="yaml">
meta:
  layout: default
  navActiveLink: wms-branches
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

    <VCardText v-else-if="!loading && !branch">
      <!-- Error State -->
      <div class="text-center py-12">
        <VIcon
          size="64"
          color="error"
          class="mb-4"
        >
          tabler-alert-circle
        </VIcon>
        <h3 class="text-h6 mb-2">
          Data tidak ditemukan
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Cabang yang Anda cari tidak ditemukan atau telah dihapus
        </p>
        <VBtn
          color="primary"
          variant="tonal"
          :to="{ name: 'wms-branches' }"
        >
          Kembali Ke Daftar
        </VBtn>
      </div>
    </VCardText>

    <VCardText v-else-if="branch">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center gap-4">
          <VAvatar
            size="72"
            color="primary"
          >
            <VIcon size="40">
              tabler-building-store
            </VIcon>
          </VAvatar>
          <div class="flex-grow-1">
            <h2 class="text-h4 font-weight-bold mb-1">
              {{ branch.name }}
            </h2>
            <div class="d-flex align-center gap-2">
              <VChip
                color="primary"
                size="small"
                variant="outlined"
              >
                {{ branch.code }}
              </VChip>
              <VChip
                :color="branch.is_active ? 'success' : 'error'"
                size="small"
              >
                {{ branch.is_active ? 'Aktif' : 'Nonaktif' }}
              </VChip>
              <VChip
                color="info"
                size="small"
                variant="tonal"
              >
                {{ branch.type }}
              </VChip>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="d-flex gap-2">
          <VBtn
            color="primary"
            prepend-icon="tabler-edit"
            :to="{ name: 'wms-branches-edit-id', params: { id: route.params.id } }"
          >
            Edit
          </VBtn>
          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="tabler-arrow-left"
            :to="{ name: 'wms-branches' }"
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
              Nama Cabang
            </div>
            <div class="text-h6 font-weight-medium">
              {{ branch.name }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kode Cabang
            </div>
            <div class="text-h6 font-weight-medium">
              {{ branch.code }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tipe Cabang
            </div>
            <div class="text-h6 font-weight-medium">
              {{ branch.type }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Telepon
            </div>
            <div class="text-h6 font-weight-medium">
              {{ branch.phone || '-' }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Email
            </div>
            <div class="text-h6 font-weight-medium">
              {{ branch.email || '-' }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kapasitas Maksimal
            </div>
            <div class="text-h6 font-weight-medium">
              {{ branch.max_stock_capacity_m3 }} m³
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status Aktif
            </div>
            <div class="text-h6 font-weight-medium">
              <VChip
                :color="branch.is_active ? 'success' : 'error'"
                size="small"
              >
                {{ branch.is_active ? 'Aktif' : 'Nonaktif' }}
              </VChip>
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Auto Reorder
            </div>
            <div class="text-h6 font-weight-medium">
              <VChip
                :color="branch.auto_reorder_enabled ? 'success' : 'warning'"
                size="small"
              >
                {{ branch.auto_reorder_enabled ? 'Diaktifkan' : 'Dinonaktifkan' }}
              </VChip>
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Address -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-map-pin
        </VIcon>
        Alamat
      </h3>
      
      <VRow class="mb-6">
        <VCol cols="12">
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Alamat Lengkap
            </div>
            <div class="text-body-1">
              {{ branch.address || '-' }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Contact Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-users
        </VIcon>
        Informasi Kontak
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Gudang Regional
            </div>
            <div class="text-body-1">
              {{ regionalWarehouseName || '-' }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Manager
            </div>
            <div class="text-body-1">
              {{ managerName || '-' }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Operational Hours -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-clock
        </VIcon>
        Jam Operasional
      </h3>
      
      <VRow class="mb-6">
        <VCol
          v-for="(hours, day) in branch.operational_hours"
          :key="day"
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              {{ getDayLabel(day) }}
            </div>
            <div class="text-body-1">
              <span v-if="hours === 'CLOSED'" class="text-error">
                Tutup
              </span>
              <span v-else>
                {{ hours.open }} - {{ hours.close }}
              </span>
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Settings -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-settings
        </VIcon>
        Pengaturan
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Maksimal Hari Stok
            </div>
            <div class="text-body-1">
              {{ branch.settings?.max_stock_days || '-' }} hari
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Minimal Hari Stok
            </div>
            <div class="text-body-1">
              {{ branch.settings?.min_stock_days || '-' }} hari
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tingkat Prioritas
            </div>
            <div class="text-body-1">
              <VChip
                :color="getPriorityColor(branch.settings?.priority_level)"
                size="small"
              >
                {{ branch.settings?.priority_level || '-' }}
              </VChip>
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Hari Auto Reorder
            </div>
            <div class="text-body-1">
              {{ branch.settings?.auto_reorder_days || '-' }} hari
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Timestamps -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-clock
        </VIcon>
        Informasi Waktu
      </h3>
      
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Dibuat
            </div>
            <div class="text-body-1">
              {{ branch.created_at ? formatDateTime(branch.created_at) : '-' }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Diperbarui
            </div>
            <div class="text-body-1">
              {{ branch.updated_at ? formatDateTime(branch.updated_at) : '-' }}
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert } from '@/utils/errorHandler'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Route
const route = useRoute()

// Data
const branch = ref(null)
const loading = ref(false)
const regionalWarehouseName = ref('')
const managerName = ref('')

// Methods
const fetchBranch = async () => {
  loading.value = true
  
  try {
    const res = await $api(`/wms/branches/${route.params.id}`, {
      method: 'GET',
    })
    
    if (res && res.response_code === 200 && res.data) {
      branch.value = res.data
      
      // Fetch regional warehouse name if exists
      if (branch.value.regional_warehouse_id) {
        await fetchRegionalWarehouseName(branch.value.regional_warehouse_id)
      }
      
      // Fetch manager name if exists
      if (branch.value.manager_id) {
        await fetchManagerName(branch.value.manager_id)
      }
    } else {
      branch.value = null
    }
  } catch (error) {
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Cabang',
      text: 'Tidak dapat memuat data cabang. Silakan coba lagi.',
    })
    branch.value = null
  } finally {
    loading.value = false
  }
}

const fetchRegionalWarehouseName = async (warehouseId) => {
  try {
    const res = await $api('/wms/regional-warehouses', {
      method: 'GET',
    })
    
    if (res && res.response_code === 200) {
      const warehouse = res.data.find(w => w.id === warehouseId)
      if (warehouse) {
        regionalWarehouseName.value = `${warehouse.name} (${warehouse.code})`
      } else {
        regionalWarehouseName.value = 'Warehouse tidak ditemukan'
      }
    }
  } catch (error) {
    regionalWarehouseName.value = 'Gagal memuat nama warehouse'
  }
}

const fetchManagerName = async (managerId) => {
  try {
    const res = await $api('/hris/employees', {
      method: 'GET',
    })
    
    if (res && res.response_code === 200) {
      const manager = res.data.find(m => m.id === managerId)
      if (manager) {
        managerName.value = `${manager.name} (${manager.email})`
      } else {
        managerName.value = 'Manager tidak ditemukan'
      }
    }
  } catch (error) {
    managerName.value = 'Gagal memuat nama manager'
  }
}

const getDayLabel = (day) => {
  const dayLabels = {
    monday: 'Senin',
    tuesday: 'Selasa',
    wednesday: 'Rabu',
    thursday: 'Kamis',
    friday: 'Jumat',
    saturday: 'Sabtu',
    sunday: 'Minggu'
  }
  return dayLabels[day] || day
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'HIGH':
      return 'error'
    case 'MEDIUM':
      return 'warning'
    case 'LOW':
      return 'success'
    default:
      return 'default'
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

// Lifecycle
onMounted(async () => {
  // Fetch branch data
  await fetchBranch()
})
</script> 
