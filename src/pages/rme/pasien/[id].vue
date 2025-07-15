<route lang="yaml">
meta:
  layout: default
  navActiveLink: rme-pasien
</route>

<template>
  <VCard>
    <!-- Header with actions only, no filter functionality -->
    <VCardText class="d-flex flex-wrap gap-4 align-center justify-space-between">
      <h2 class="text-h4 font-weight-bold mb-0">
        {{ patient ? `Detail Pasien: ${patient.name}` : 'Detail Pasien' }}
      </h2>
      <div class="d-flex gap-3 align-center flex-wrap">
        <VBtn
          icon="tabler-arrow-left"
          variant="text"
          color="secondary"
          :to="{ name: 'rme-pasien' }"
          title="Kembali ke Daftar Pasien"
        />
      </div>
    </VCardText>
    
    <VDivider />

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

    <VCardText v-else-if="patient">
      <!-- Header -->
      <div class="d-flex align-center gap-4 mb-6">
        <VAvatar
          size="72"
          color="primary"
        >
          <VIcon size="40">
            tabler-user
          </VIcon>
        </VAvatar>
        <div class="flex-grow-1">
          <h2 class="text-h4 font-weight-bold mb-1">
            {{ patient.name }}
          </h2>
          <div class="d-flex align-center gap-2">
            <VChip
              :color="patient.is_active ? 'success' : 'error'"
              size="small"
            >
              {{ patient.is_active ? 'Aktif' : 'Nonaktif' }}
            </VChip>
            <VChip
              color="primary"
              size="small"
              variant="outlined"
            >
              {{ patient.patient_number }}
            </VChip>
          </div>
        </div>
      </div>

      <!-- Patient Information -->
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              NIK
            </div>
            <div class="text-h6">
              {{ patient.nik }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Lahir
            </div>
            <div>{{ formatDate(patient.birth_date) }}</div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Jenis Kelamin
            </div>
            <VChip
              :color="patient.gender === 'MALE' ? 'primary' : 'pink'"
              size="small"
              variant="tonal"
            >
              <VIcon
                start
                size="16"
              >
                tabler-gender-{{ patient.gender === 'MALE' ? 'male' : 'female' }}
              </VIcon>
              {{ patient.gender === 'MALE' ? 'Laki-laki' : 'Perempuan' }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Telepon
            </div>
            <div>{{ patient.phone }}</div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Email
            </div>
            <div>{{ patient.email || '-' }}</div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status Persetujuan
            </div>
            <VChip
              :color="getConsentColor(patient.consent_status)"
              size="small"
              variant="tonal"
            >
              {{ patient.consent_status }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Input
            </div>
            <div>{{ formatDateTime(patient.created_at) }}</div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Alamat
            </div>
            <div>{{ patient.address }}</div>
          </div>
        </VCol>
      </VRow>

      <!-- Medical Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-health-recognition
        </VIcon>
        Informasi Medis
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="4"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Riwayat Penyakit
            </div>
            <div>{{ patient.medical_history || '-' }}</div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="4"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Alergi
            </div>
            <div>{{ patient.allergies || '-' }}</div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="4"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Obat yang Dikonsumsi
            </div>
            <div>{{ patient.current_medications || '-' }}</div>
          </div>
        </VCol>
      </VRow>

      <!-- Emergency Contact -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon
          class="me-2"
          color="error"
        >
          tabler-user-heart
        </VIcon>
        Kontak Darurat
      </h3>
      
      <VRow v-if="patient.emergency_contact">
        <VCol
          cols="12"
          md="4"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Nama
            </div>
            <div>{{ patient.emergency_contact.name }}</div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="4"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Telepon
            </div>
            <div>{{ patient.emergency_contact.phone }}</div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="4"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Hubungan
            </div>
            <div>{{ patient.emergency_contact.relation || patient.emergency_contact.relationship }}</div>
          </div>
        </VCol>
      </VRow>
      
      <div
        v-else
        class="text-medium-emphasis"
      >
        Tidak ada kontak darurat yang terdaftar
      </div>
    </VCardText>

    <VCardText v-else>
      <VAlert
        type="error"
        variant="tonal"
      >
        <VAlertTitle>Data Tidak Ditemukan</VAlertTitle>
        <div>Pasien dengan ID tersebut tidak ditemukan atau telah dihapus.</div>
        <template #append>
          <VBtn
            size="small"
            variant="outlined"
            :to="{ name: 'rme-pasien' }"
          >
            Kembali ke Daftar
          </VBtn>
        </template>
      </VAlert>
    </VCardText>
  </VCard>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert } from '@/utils/errorHandler'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const patient = ref(null)
const loading = ref(true)

async function fetchPatient() {
  loading.value = true
  try {
    const res = await $api(`/rme/patients/${route.params.id}`)

    patient.value = res.data
  } catch (e) {
    console.error('Error fetching patient:', e)
    await showErrorAlert(e, {
      title: 'Gagal Memuat Data Pasien',
      text: 'Tidak dapat memuat detail pasien. Silakan coba lagi.',
    })
    patient.value = null
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleDateString('id-ID')
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

function getConsentColor(status) {
  if (status === 'GIVEN') return 'success'
  if (status === 'PENDING') return 'warning'
  
  return 'secondary'
}

onMounted(fetchPatient)
</script> 
