<template>
  <div class="patient-fullpage-wrapper px-2 px-md-8 py-8">
    <v-overlay :model-value="loading" class="z-10" persistent>
      <v-progress-circular indeterminate size="48" color="primary" />
    </v-overlay>
    <!-- Header simple -->
    <div class="d-flex align-center gap-4 mb-6">
      <VBtn icon variant="text" color="primary" @click="$router.back()">
        <VIcon>tabler-arrow-left</VIcon>
      </VBtn>
      <VAvatar size="72" color="primary">
        <VIcon size="40">tabler-user</VIcon>
      </VAvatar>
      <div>
        <h2 class="text-h4 font-weight-bold mb-1 mb-sm-0">{{ patient?.name || '-' }}</h2>
        <VChip v-if="patient" :color="patient.is_active ? 'success' : 'error'" size="small">
          {{ patient.is_active ? 'Aktif' : 'Nonaktif' }}
        </VChip>
      </div>
    </div>
    <VRow v-if="patient" class="mb-2">
      <VCol cols="12" md="6">
        <div class="text-medium-emphasis mb-1">NIK</div>
        <div class="mb-3 text-h6">{{ patient?.nik }}</div>
        <div class="text-medium-emphasis mb-1">Tanggal Lahir</div>
        <div class="mb-3">{{ formatDate(patient?.birth_date) }}</div>
        <div class="text-medium-emphasis mb-1">Telepon</div>
        <div class="mb-3">{{ patient?.phone }}</div>
        <div class="text-medium-emphasis mb-1">Alamat</div>
        <div class="mb-3">{{ patient?.address }}</div>
        <div class="text-medium-emphasis mb-1">Medical History</div>
        <div class="mb-3">{{ patient?.medical_history || '-' }}</div>
        <div class="text-medium-emphasis mb-1">Allergies</div>
        <div class="mb-3">{{ patient?.allergies || '-' }}</div>
        <div class="text-medium-emphasis mb-1">Current Medications</div>
        <div class="mb-3">{{ patient?.current_medications || '-' }}</div>
      </VCol>
      <VCol cols="12" md="6">
        <div class="text-medium-emphasis mb-1">No. RM</div>
        <div class="mb-3 text-h6">{{ patient?.patient_number }}</div>
        <div class="text-medium-emphasis mb-1">Gender</div>
        <div class="mb-3">
          <VChip :color="patient?.gender === 'MALE' ? 'primary' : 'pink'" size="small" variant="tonal">
            <VIcon start size="16">tabler-gender-{{ patient?.gender === 'MALE' ? 'male' : 'female' }}</VIcon>
            {{ patient?.gender === 'MALE' ? 'Laki-laki' : 'Perempuan' }}
          </VChip>
        </div>
        <div class="text-medium-emphasis mb-1">Email</div>
        <div class="mb-3">{{ patient?.email }}</div>
        <div class="text-medium-emphasis mb-1">Status Persetujuan</div>
        <div class="mb-3">
          <VChip :color="getConsentColor(patient?.consent_status)" size="small" variant="tonal">
            {{ patient?.consent_status }}
          </VChip>
        </div>
        <div class="text-medium-emphasis mb-1">Tanggal Input</div>
        <div class="mb-3">{{ formatDateTime(patient?.created_at) }}</div>
      </VCol>
    </VRow>
    <VDivider class="my-6" />
    <VRow v-if="patient">
      <VCol cols="12" md="6">
        <div class="d-flex align-center mb-2 mt-2">
          <VIcon color="red" class="me-2">tabler-user-heart</VIcon>
          <span class="font-weight-medium text-h6">Emergency Contact</span>
        </div>
        <div v-if="patient?.emergency_contact">
          <div class="text-medium-emphasis mb-1">Nama</div>
          <div class="mb-2">{{ patient.emergency_contact.name }}</div>
          <div class="text-medium-emphasis mb-1">Telepon</div>
          <div class="mb-2">{{ patient.emergency_contact.phone }}</div>
          <div class="text-medium-emphasis mb-1">Hubungan</div>
          <div class="mb-2">{{ patient.emergency_contact.relation || patient.emergency_contact.relationship }}</div>
        </div>
        <div v-else class="text-disabled">-</div>
      </VCol>
    </VRow>
    <VAlert v-else type="error" class="ma-6">Data pasien tidak ditemukan.</VAlert>
  </div>
</template>

<script setup>
import { $api } from '@/utils/api'
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

<style scoped>
.patient-fullpage-wrapper {
  max-width: 1100px;
  margin: 0 auto;
}
</style> 
