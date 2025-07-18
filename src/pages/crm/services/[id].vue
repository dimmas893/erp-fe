<route lang="yaml">
meta:
  layout: default
  navActiveLink: crm-services
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

    <VCardText v-else-if="service">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center gap-4">
          <VAvatar
            size="72"
            color="primary"
          >
            <VIcon size="40">
              tabler-stethoscope
            </VIcon>
          </VAvatar>
          <div class="flex-grow-1">
            <h2 class="text-h4 font-weight-bold mb-1">
              {{ service.name }}
            </h2>
            <div class="d-flex align-center gap-2">
              <VChip
                color="primary"
                size="small"
                variant="outlined"
              >
                {{ service.code }}
              </VChip>
              <VChip
                :color="service.is_active ? 'success' : 'error'"
                size="small"
              >
                {{ service.is_active ? 'Aktif' : 'Nonaktif' }}
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
            :to="{ name: 'crm-services' }"
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
              Nama Layanan
            </div>
            <div class="text-h6 font-weight-medium">
              {{ service.name }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kode Layanan
            </div>
            <div class="text-h6 font-weight-medium">
              {{ service.code }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tipe Layanan
            </div>
            <VChip
              :color="getServiceTypeColor(service.service_type)"
              size="small"
              variant="tonal"
            >
              {{ getServiceTypeLabel(service.service_type) }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status
            </div>
            <VChip
              :color="service.is_active ? 'success' : 'error'"
              size="small"
              variant="tonal"
            >
              {{ service.is_active ? 'Aktif' : 'Nonaktif' }}
            </VChip>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Durasi
            </div>
            <div class="text-h6 font-weight-medium">
              {{ service.duration_minutes !== null ? `${service.duration_minutes} menit` : '-' }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status Billable
            </div>
            <VChip
              :color="service.is_billable ? 'success' : 'warning'"
              size="small"
              variant="tonal"
            >
              {{ service.is_billable ? 'Billable' : 'Non-Billable' }}
            </VChip>
          </div>
        </VCol>
      </VRow>

      <!-- Description -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-file-text
        </VIcon>
        Deskripsi
      </h3>
      
      <VRow class="mb-6">
        <VCol cols="12">
          <div class="text-body-1">
            {{ service.description || 'Tidak ada deskripsi' }}
          </div>
        </VCol>
      </VRow>

      <!-- Timestamps -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-clock
        </VIcon>
        Informasi Sistem
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Dibuat
            </div>
            <div class="text-h6 font-weight-medium">
              {{ formatDateTime(service.created_at) }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Terakhir Diupdate
            </div>
            <div class="text-h6 font-weight-medium">
              {{ formatDateTime(service.updated_at) }}
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>

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
          Layanan tidak ditemukan
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Layanan yang Anda cari tidak ditemukan atau telah dihapus
        </p>
        <VBtn
          color="primary"
          variant="tonal"
          :to="{ name: 'crm-services' }"
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
const service = ref(null)

// Functions
async function fetchService() {
  loading.value = true
  console.log('🔄 Starting fetchService...')
  
  try {
    const res = await $api(`/crm/services/${route.params.id}`, {
      method: 'GET',
    })
    
    console.log('📥 API Response:', res)
    
    service.value = res.data || res
    console.log('✅ Service loaded:', service.value)
  } catch (error) {
    console.error('❌ Error fetching service:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Layanan',
      text: 'Tidak dapat memuat data layanan. Silakan coba lagi.',
    })
    service.value = null
  } finally {
    loading.value = false
    console.log('🏁 fetchService completed')
  }
}

function getServiceTypeColor(type) {
  switch (type) {
  case 'CONSULTATION': return 'primary'
  case 'ADMIN': return 'success'
  case 'SUPPORT': return 'warning'
  case 'OTHER': return 'info'
  default: return 'secondary'
  }
}

function getServiceTypeLabel(type) {
  switch (type) {
  case 'CONSULTATION': return 'Konsultasi'
  case 'ADMIN': return 'Administrasi'
  case 'SUPPORT': return 'Dukungan'
  case 'OTHER': return 'Lainnya'
  default: return type
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

// Lifecycle
onMounted(() => {
  fetchService()
})
</script> 
