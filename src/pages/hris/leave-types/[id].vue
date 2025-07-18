<route lang="yaml">
meta:
  layout: default
  navActiveLink: hris-leave-types
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

    <VCardText v-else-if="leaveType">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center gap-4">
          <VAvatar
            size="72"
            color="primary"
          >
            <VIcon size="40">
              tabler-calendar-off
            </VIcon>
          </VAvatar>
          <div class="flex-grow-1">
            <h2 class="text-h4 font-weight-bold mb-1">
              {{ leaveType.name }}
            </h2>
            <div class="d-flex align-center gap-2">
              <VChip
                color="primary"
                size="small"
                variant="outlined"
              >
                {{ leaveType.code }}
              </VChip>
              <VChip
                :color="leaveType.is_active ? 'success' : 'error'"
                size="small"
              >
                {{ leaveType.is_active ? 'Aktif' : 'Nonaktif' }}
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
            :to="{ name: 'hris-leave-types' }"
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
              Nama Jenis Cuti
            </div>
            <div class="text-h6 font-weight-medium">
              {{ leaveType.name }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kode
            </div>
            <div class="text-h6 font-weight-medium">
              {{ leaveType.code }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Deskripsi
            </div>
            <div class="text-body-1">
              {{ leaveType.description }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status
            </div>
            <VChip
              :color="leaveType.is_active ? 'success' : 'error'"
              size="small"
              variant="tonal"
            >
              {{ leaveType.is_active ? 'Aktif' : 'Nonaktif' }}
            </VChip>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Gender Spesifik
            </div>
            <VChip
              :color="getGenderColor(leaveType.gender_specific)"
              size="small"
              variant="tonal"
            >
              {{ getGenderLabel(leaveType.gender_specific) }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status Bayar
            </div>
            <VChip
              :color="leaveType.is_paid ? 'success' : 'warning'"
              size="small"
              variant="tonal"
            >
              {{ leaveType.is_paid ? 'Berbayar' : 'Tidak Berbayar' }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Dokumen Wajib
            </div>
            <VChip
              :color="leaveType.requires_document ? 'error' : 'success'"
              size="small"
              variant="tonal"
            >
              {{ leaveType.requires_document ? 'Ya' : 'Tidak' }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Perlu Approval
            </div>
            <VChip
              :color="leaveType.approval_required ? 'error' : 'success'"
              size="small"
              variant="tonal"
            >
              {{ leaveType.approval_required ? 'Ya' : 'Tidak' }}
            </VChip>
          </div>
        </VCol>
      </VRow>

      <!-- Leave Configuration -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-settings
        </VIcon>
        Konfigurasi Cuti
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="4"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Maksimal Hari per Request
            </div>
            <div class="d-flex align-center gap-2">
              <VChip
                color="info"
                size="small"
                variant="tonal"
              >
                {{ leaveType.max_days_per_request }} hari
              </VChip>
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="4"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Maksimal Hari per Tahun
            </div>
            <div class="d-flex align-center gap-2">
              <VChip
                color="warning"
                size="small"
                variant="tonal"
              >
                {{ leaveType.max_days_per_year }} hari
              </VChip>
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="4"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Pemberitahuan Awal
            </div>
            <div class="d-flex align-center gap-2">
              <VChip
                color="primary"
                size="small"
                variant="tonal"
              >
                {{ leaveType.advance_notice_days }} hari
              </VChip>
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
              {{ leaveType.created_at ? formatDateTime(leaveType.created_at) : '-' }}
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
              {{ leaveType.updated_at ? formatDateTime(leaveType.updated_at) : '-' }}
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>

    <VCardText v-else>
      <!-- Not Found -->
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
          Jenis cuti yang Anda cari tidak ditemukan atau telah dihapus
        </p>
        <VBtn
          color="primary"
          variant="tonal"
          :to="{ name: 'hris-leave-types' }"
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

// Route
const route = useRoute()

// Data
const leaveType = ref(null)
const loading = ref(false)

// Methods
const fetchLeaveType = async () => {
  loading.value = true
  console.log('🔄 Starting fetchLeaveType...')
  
  try {
    const res = await $api(`/hris/leave-types/${route.params.id}`, {
      method: 'GET',
    })
    
    console.log('📥 API Response:', res)
    
    if (res && res.response_code === 200) {
      leaveType.value = res.data
    } else {
      leaveType.value = null
    }
  } catch (error) {
    console.error('❌ Error fetching leave type:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Jenis Cuti',
      text: 'Tidak dapat memuat data jenis cuti. Silakan coba lagi.',
    })
    leaveType.value = null
  } finally {
    loading.value = false
    console.log('🏁 fetchLeaveType completed')
  }
}

const getGenderColor = (gender) => {
  switch (gender) {
    case 'ALL':
      return 'primary'
    case 'MALE':
      return 'info'
    case 'FEMALE':
      return 'warning'
    default:
      return 'default'
  }
}

const getGenderLabel = (gender) => {
  switch (gender) {
    case 'ALL':
      return 'Semua Gender'
    case 'MALE':
      return 'Pria Saja'
    case 'FEMALE':
      return 'Wanita Saja'
    default:
      return gender
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

// Lifecycle
onMounted(() => {
  console.log('🚀 Component onMounted triggered')
  fetchLeaveType()
})
</script> 
