<route lang="yaml">
meta:
  layout: default
  navActiveLink: transaction-tindakan
</route>

<template>
  <VCard>
    <!-- Simple Header -->
    <VCardTitle class="d-flex align-center justify-space-between pa-4">
      <div class="d-flex align-center gap-3">
        <VIcon
          size="28"
          color="primary"
        >
          tabler-stethoscope
        </VIcon>
        <div>
          <h2 class="text-h5 mb-1">
            Detail Tindakan
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ID: {{ treatmentId }}
          </p>
        </div>
      </div>
      <VBtn
        variant="text"
        color="secondary"
        prepend-icon="tabler-arrow-left"
        :to="{ name: 'transaction-tindakan' }"
      >
        Kembali
      </VBtn>
      <VBtn
        v-if="treatment && !treatment.completed_at"
        color="success"
        prepend-icon="tabler-check"
        :loading="completingTreatment"
        @click="completeTreatment"
      >
        Selesai
      </VBtn>
    </VCardTitle>

    <VDivider />

    <VCardText class="pa-4">
      <VRow v-if="loading">
        <VCol cols="12">
          <VSkeletonLoader
            type="article"
            class="mx-auto"
          />
        </VCol>
      </VRow>

      <VRow v-else-if="treatment">
        <!-- Simple Info Card -->
        <VCol cols="12" class="mb-4">
          <VCard variant="outlined" color="primary" class="mb-4">
            <VCardText class="pa-4">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <h4 class="text-subtitle-1 font-weight-medium mb-1">
                    Tindakan Medis
                  </h4>
                  <p class="text-body-2 mb-0">
                    Total Harga: {{ formatCurrency(treatment.total_price) }}
                  </p>
                </div>
                <VChip
                  :color="treatment.completed_at ? 'success' : 'warning'"
                  size="small"
                  label
                >
                  {{ treatment.completed_at ? 'Selesai' : 'Sedang Berlangsung' }}
                </VChip>
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Treatment Details -->
        <VCol cols="12">
          <h3 class="text-h6 mb-4">
            Informasi Tindakan
          </h3>
          <VRow>
            <!-- Visit Information -->
            <VCol cols="12" md="6">
              <VCard variant="outlined">
                <VCardTitle class="pa-4 pb-2">
                  <div class="d-flex align-center gap-2">
                    <VIcon size="20" color="info">
                      tabler-calendar
                    </VIcon>
                    <h4 class="text-subtitle-1 font-weight-medium">
                      Informasi Kunjungan
                    </h4>
                  </div>
                </VCardTitle>
                <VCardText class="pa-4 pt-0">
                  <div class="d-flex flex-column gap-2">
                    <div class="d-flex justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">Nomor Kunjungan:</span>
                      <span class="text-body-2 font-weight-medium">{{ treatment.visit?.visit_number || '-' }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">Tanggal Kunjungan:</span>
                      <span class="text-body-2 font-weight-medium">{{ formatDateTime(treatment.visit?.visit_date) }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">Dokter ID:</span>
                      <span class="text-body-2 font-weight-medium">{{ treatment.doctor_id }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">Terapis ID:</span>
                      <span class="text-body-2 font-weight-medium">{{ treatment.therapist_id }}</span>
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </VCol>

            <!-- Treatment Information -->
            <VCol cols="12" md="6">
              <VCard variant="outlined">
                <VCardTitle class="pa-4 pb-2">
                  <div class="d-flex align-center gap-2">
                    <VIcon size="20" color="success">
                      tabler-stethoscope
                    </VIcon>
                    <h4 class="text-subtitle-1 font-weight-medium">
                      Detail Tindakan
                    </h4>
                  </div>
                </VCardTitle>
                <VCardText class="pa-4 pt-0">
                  <div class="d-flex flex-column gap-2">
                    <div class="d-flex justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">Treatment ID:</span>
                      <span class="text-body-2 font-weight-medium">{{ treatment.treatment_id }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">Jumlah:</span>
                      <span class="text-body-2 font-weight-medium">{{ treatment.quantity }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">Harga Satuan:</span>
                      <span class="text-body-2 font-weight-medium">{{ formatCurrency(treatment.unit_price) }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">Total Harga:</span>
                      <span class="text-body-2 font-weight-medium">{{ formatCurrency(treatment.total_price) }}</span>
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </VCol>

            <!-- Timing Information -->
            <VCol cols="12">
              <VCard variant="outlined">
                <VCardTitle class="pa-4 pb-2">
                  <div class="d-flex align-center gap-2">
                    <VIcon size="20" color="warning">
                      tabler-clock
                    </VIcon>
                    <h4 class="text-subtitle-1 font-weight-medium">
                      Informasi Waktu
                    </h4>
                  </div>
                </VCardTitle>
                <VCardText class="pa-4 pt-0">
                  <VRow>
                    <VCol cols="12" md="4">
                      <div class="d-flex flex-column gap-2">
                        <div class="d-flex justify-space-between">
                          <span class="text-body-2 text-medium-emphasis">Waktu Dilakukan:</span>
                          <span class="text-body-2 font-weight-medium">{{ formatDateTime(treatment.performed_at) }}</span>
                        </div>
                      </div>
                    </VCol>
                    <VCol cols="12" md="4">
                      <div class="d-flex flex-column gap-2">
                        <div class="d-flex justify-space-between">
                          <span class="text-body-2 text-medium-emphasis">Waktu Selesai:</span>
                          <span class="text-body-2 font-weight-medium">{{ treatment.completed_at ? formatDateTime(treatment.completed_at) : '-' }}</span>
                        </div>
                      </div>
                    </VCol>
                    <VCol cols="12" md="4">
                      <div class="d-flex flex-column gap-2">
                        <div class="d-flex justify-space-between">
                          <span class="text-body-2 text-medium-emphasis">Dibuat Pada:</span>
                          <span class="text-body-2 font-weight-medium">{{ formatDateTime(treatment.created_at) }}</span>
                        </div>
                      </div>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>

            <!-- Treatment Notes -->
            <VCol cols="12">
              <VCard variant="outlined">
                <VCardTitle class="pa-4 pb-2">
                  <div class="d-flex align-center gap-2">
                    <VIcon size="20" color="info">
                      tabler-notes
                    </VIcon>
                    <h4 class="text-subtitle-1 font-weight-medium">
                      Catatan Tindakan
                    </h4>
                  </div>
                </VCardTitle>
                <VCardText class="pa-4 pt-0">
                  <VTextarea
                    v-model="treatmentForm.treatment_notes"
                    :placeholder="treatment.treatment_notes || 'Masukkan catatan tindakan...'"
                    rows="4"
                    variant="outlined"
                    :rules="[v => !!v || 'Catatan tindakan harus diisi']"
                    required
                    hide-details
                  />
                </VCardText>
              </VCard>
            </VCol>

            <!-- Action Buttons -->
            <VCol cols="12">
              <VDivider class="my-4" />
              <div class="d-flex gap-3 justify-end">
                <VBtn
                  variant="outlined"
                  color="secondary"
                  @click="resetForm"
                >
                  Reset
                </VBtn>
                <VBtn
                  color="primary"
                  :loading="saving"
                  :disabled="!isFormValid"
                  @click="submitTreatment"
                >
                  Simpan
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VCol>
      </VRow>

      <!-- Error State -->
      <VRow v-else>
        <VCol cols="12">
          <VCard variant="outlined" color="error">
            <VCardText class="pa-4 text-center">
              <VIcon
                size="64"
                color="error"
                class="mb-4"
              >
                tabler-alert-circle
              </VIcon>
              <h3 class="text-h6 mb-2">
                Tindakan Tidak Ditemukan
              </h3>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Tindakan dengan ID {{ treatmentId }} tidak ditemukan atau telah dihapus.
              </p>
              <VBtn
                color="primary"
                variant="tonal"
                :to="{ name: 'transaction-tindakan' }"
              >
                Kembali ke Daftar
              </VBtn>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert, showSuccessAlert } from '@/utils/errorHandler'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Route and Router
const route = useRoute()
const router = useRouter()

// State
const loading = ref(true)
const saving = ref(false)
const completingTreatment = ref(false)
const treatment = ref(null)
const treatmentForm = ref({
  treatment_notes: '',
})

const treatmentFormRef = ref(null)
const isFormValid = ref(false)

// Computed
const treatmentId = computed(() => route.params.id)

// Functions
async function fetchTreatment() {
  loading.value = true
  console.log('🔄 Starting fetchTreatment...', treatmentId.value)
  
  try {
    const res = await $api(`/rme/visit-treatments/${treatmentId.value}`, {
      method: 'GET',
    })
    
    console.log('📥 API Response:', res)
    
    treatment.value = res.data
    treatmentForm.value.treatment_notes = res.data.treatment_notes || ''
    
    console.log('✅ Treatment loaded:', treatment.value)
  } catch (error) {
    console.error('❌ Error fetching treatment:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Tindakan',
      text: 'Tidak dapat memuat data tindakan. Silakan coba lagi.',
    })
    treatment.value = null
  } finally {
    loading.value = false
    console.log('🏁 fetchTreatment completed')
  }
}

async function submitTreatment() {
  if (!treatment.value) return
  
  saving.value = true
  console.log('🔄 Starting submitTreatment...')
  
  try {
    const requestBody = {
      treatment_notes: treatmentForm.value.treatment_notes,
    }
    
    console.log('📤 API Request body:', requestBody)
    
    const res = await $api(`/rme/visit-treatments/${treatmentId.value}`, {
      method: 'PATCH',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    
    // Update local data
    treatment.value = { ...treatment.value, ...res.data }
    
    await showSuccessAlert({
      title: 'Berhasil',
      text: 'Data tindakan berhasil diperbarui.',
    })
    
    console.log('✅ Treatment updated successfully')
  } catch (error) {
    console.error('❌ Error updating treatment:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memperbarui Data Tindakan',
      text: 'Tidak dapat memperbarui data tindakan. Silakan coba lagi.',
    })
  } finally {
    saving.value = false
    console.log('🏁 submitTreatment completed')
  }
}

async function completeTreatment() {
  if (!treatment.value) return
  
  completingTreatment.value = true
  console.log('🔄 Starting completeTreatment...')
  
  try {
    const res = await $api(`/rme/visit-treatments/${treatmentId.value}/status`, {
      method: 'PATCH',
      body: {
        status: 'completed',
      },
    })
    
    console.log('📥 API Response:', res)
    
    // Update local data
    treatment.value = { ...treatment.value, ...res.data }
    
    await showSuccessAlert({
      title: 'Berhasil',
      text: 'Tindakan berhasil diselesaikan.',
    })
    
    console.log('✅ Treatment completed successfully')
  } catch (error) {
    console.error('❌ Error completing treatment:', error)
    await showErrorAlert(error, {
      title: 'Gagal Menyelesaikan Tindakan',
      text: 'Tidak dapat menyelesaikan tindakan. Silakan coba lagi.',
    })
  } finally {
    completingTreatment.value = false
    console.log('🏁 completeTreatment completed')
  }
}

function resetForm() {
  if (treatment.value) {
    treatmentForm.value.treatment_notes = treatment.value.treatment_notes || ''
  }
}

function formatCurrency(amount) {
  if (!amount) return 'Rp 0'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

// Initialize
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')
  await fetchTreatment()
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
