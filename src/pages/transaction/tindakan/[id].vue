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
        <VIcon size="28" color="primary">
          tabler-stethoscope
        </VIcon>
        <div>
          <h2 class="text-h5 mb-1">
            Detail Billing Treatment
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Billing ID: {{ treatmentId }}
          </p>
        </div>
      </div>
      <VBtn variant="text" color="secondary" prepend-icon="tabler-arrow-left" :to="{ name: 'transaction-tindakan' }">
        Kembali
      </VBtn>
      <div class="d-flex gap-2">
        <VBtn v-if="selectedTreatment && !selectedTreatment.completed_at" color="warning" prepend-icon="tabler-player-play" :loading="progressingTreatment"
          @click="progressTreatment">
          Progress
        </VBtn>
        <VBtn v-if="selectedTreatment && !selectedTreatment.completed_at" color="success" prepend-icon="tabler-check" :loading="completingTreatment"
          @click="completeTreatment">
          Selesai
        </VBtn>
      </div>
    </VCardTitle>

    <VDivider />

    <VCardText class="pa-4">
      <VRow v-if="loading">
        <VCol cols="12">
          <VSkeletonLoader type="article" class="mx-auto" />
        </VCol>
      </VRow>

      <VRow v-else-if="treatments.length > 0">
        <!-- Billing Summary Card -->
        <VCol cols="12" class="mb-4">
          <VCard variant="outlined" color="primary" class="mb-4">
            <VCardText class="pa-4">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <h4 class="text-subtitle-1 font-weight-medium mb-1">
                    Billing Treatment Summary
                  </h4>
                  <p class="text-body-2 mb-0">
                    Billing Number: {{ billingData?.billing_number || '-' }} • Total Treatments: {{ treatments.length }} • Total Value: {{ formatCurrency(billingData?.grand_total || 0) }}
                  </p>
                </div>
                <VChip :color="getBillingStatusColor(billingData?.status)" size="small" label>
                  {{ getBillingStatusText(billingData?.status) }}
                </VChip>
              </div>
            </VCardText>
          </VCard>
        </VCol>



        <!-- All Treatments List -->
        <VCol cols="12">
          <VCard variant="outlined">
            <VCardTitle class="pa-4 pb-2">
              <div class="d-flex align-center gap-2">
                <VIcon size="20" color="primary">
                  tabler-list
                </VIcon>
                <h4 class="text-subtitle-1 font-weight-medium">
                  Daftar Semua Treatment
                </h4>
              </div>
            </VCardTitle>
            <VCardText class="pa-4 pt-0">
              <VDataTable
                :headers="treatmentHeaders"
                :items="treatments"
                :loading="loading"
                class="text-no-wrap"
                density="comfortable"
                hover
                :items-per-page="-1"
                hide-default-footer
              >
                <template #item.no="{ index }">
                  <VChip :color="treatments[index].completed_at ? 'success' : 'warning'" size="small" label>
                    {{ index + 1 }}
                  </VChip>
                </template>

                <template #item.treatment_name="{ item }">
                  <div>
                    <div class="font-weight-medium">{{ item.treatment?.name || 'Unknown Treatment' }}</div>
                    <div class="text-caption text-medium-emphasis">{{ item.treatment?.code || '-' }}</div>
                  </div>
                </template>

                <template #item.doctor="{ item }">
                  <div class="d-flex align-center gap-2">
                    <VIcon size="16" color="primary">tabler-user</VIcon>
                    <span>{{ item.doctor?.name || '-' }}</span>
                  </div>
                </template>

                <template #item.therapist="{ item }">
                  <div class="d-flex align-center gap-2">
                    <VIcon size="16" color="success">tabler-user-check</VIcon>
                    <span>{{ item.therapist?.name || '-' }}</span>
                  </div>
                </template>



                <template #item.unit_price="{ item }">
                  <div class="text-right">
                    <span>{{ formatCurrency(item.unit_price) }}</span>
                  </div>
                </template>



                <template #item.duration="{ item }">
                  <div class="text-center">
                    <span>{{ item.treatment?.duration_minutes || '-' }} menit</span>
                  </div>
                </template>




              </VDataTable>
            </VCardText>
          </VCard>
        </VCol>




      </VRow>

      <!-- Error State -->
      <VRow v-else>
        <VCol cols="12">
          <VCard variant="outlined" color="error">
            <VCardText class="pa-4 text-center">
              <VIcon size="64" color="error" class="mb-4">
                tabler-alert-circle
              </VIcon>
              <h3 class="text-h6 mb-2">
                Billing Treatment Tidak Ditemukan
              </h3>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Billing dengan ID {{ treatmentId }} tidak ditemukan atau telah dihapus.
              </p>
              <VBtn color="primary" variant="tonal" :to="{ name: 'transaction-tindakan' }">
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
const completingTreatment = ref(false)
const progressingTreatment = ref(false)
const treatments = ref([]) // Array to store all treatments
const selectedTreatmentId = ref(null)
const billingData = ref(null) // Store billing information

// Computed
const treatmentId = computed(() => route.params.id)
const selectedTreatment = computed(() => {
  if (!selectedTreatmentId.value || !treatments.value.length) {
    return treatments.value[0] || null
  }
  return treatments.value.find(t => t.id === selectedTreatmentId.value) || treatments.value[0] || null
})

// Table Headers
const treatmentHeaders = [
  { title: 'No', key: 'no', sortable: false, width: '80px' },
  { title: 'Nama Treatment', key: 'treatment_name', sortable: true },
  { title: 'Dokter', key: 'doctor', sortable: true, width: '150px' },
  { title: 'Terapis', key: 'therapist', sortable: true, width: '150px' },
  { title: 'Harga Satuan', key: 'unit_price', sortable: true, width: '120px', align: 'end' },
  { title: 'Durasi', key: 'duration', sortable: true, width: '100px', align: 'center' },
]

// Functions
async function fetchTreatment() {
  loading.value = true
  console.log('🔄 Starting fetchTreatment...', treatmentId.value)

  try {
    const res = await $api(`/transaction/billings/${treatmentId.value}`, {
      method: 'GET',
    })

    console.log('📥 API Response:', res)

    // Store billing data
    billingData.value = res.data

    // Extract treatments from billing response
    if (res.data && res.data.visit_treatments && res.data.visit_treatments.length > 0) {
      treatments.value = res.data.visit_treatments
      // Set the first treatment as selected
      selectedTreatmentId.value = res.data.visit_treatments[0].id

      console.log('✅ Treatments loaded:', treatments.value.length)
      console.log('✅ First treatment selected:', res.data.visit_treatments[0].id)
    } else {
      treatments.value = []
      selectedTreatmentId.value = null
      console.log('❌ No treatments found for this billing')
    }
  } catch (error) {
    console.error('❌ Error fetching treatment:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Tindakan',
      text: 'Tidak dapat memuat data tindakan. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
    console.log('🏁 fetchTreatment completed')
  }
}





async function progressTreatment() {
  if (!selectedTreatment.value) return

  progressingTreatment.value = true
  console.log('🔄 Starting progressTreatment...')

  try {
    const res = await $api(`/rme/visit-treatments/${selectedTreatment.value.id}/status`, {
      method: 'PATCH',
      body: {
        billing_status: 'progress_treatment'
      },
    })

    console.log('📥 API Response:', res)

    await showSuccessAlert({
      title: 'Berhasil',
      text: 'Tindakan berhasil diproses.',
    })

    // Auto fetch new data for real-time update
    await fetchTreatment()

    console.log('✅ Treatment progressed successfully')
  } catch (error) {
    console.error('❌ Error progressing treatment:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memproses Tindakan',
      text: 'Tidak dapat memproses tindakan. Silakan coba lagi.',
    })
  } finally {
    progressingTreatment.value = false
    console.log('🏁 progressTreatment completed')
  }
}

async function completeTreatment() {
  if (!selectedTreatment.value) return

  completingTreatment.value = true
  console.log('🔄 Starting completeTreatment...')

  try {
    // Get current Indonesian time
    const now = new Date()
    const indonesianDateTime = now.toLocaleString('id-ID', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    })

    const requestBody = {
      completed_at: now.toISOString(),
      billing_status: 'complete_treatment'
    }

    console.log('📤 Complete treatment request body:', requestBody)
    console.log('📅 Indonesian format:', indonesianDateTime)

    const res = await $api(`/rme/visit-treatments/${selectedTreatment.value.id}/status`, {
      method: 'PATCH',
      body: requestBody,
    })

    console.log('📥 API Response:', res)

    await showSuccessAlert({
      title: 'Berhasil',
      text: `Tindakan berhasil diselesaikan pada ${indonesianDateTime}`,
    })

    // Auto fetch new data for real-time update
    await fetchTreatment()

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



function selectTreatment(treatmentItem) {
  selectedTreatmentId.value = treatmentItem.id
  console.log('✅ Switched to treatment:', treatmentItem.id)
}

function getCompletedCount() {
  return treatments.value.filter(treatment => treatment.completed_at).length
}

function getPendingCount() {
  return treatments.value.filter(treatment => !treatment.completed_at).length
}

function getBillingStatusColor(status) {
  switch (status) {
    case 'open_treatment':
      return 'warning'
    case 'progress_treatment':
      return 'info'
    case 'complete_treatment':
      return 'success'
    default:
      return 'secondary'
  }
}

function getBillingStatusText(status) {
  return status || 'Unknown'
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

.v-table th,
.v-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.v-table th {
  background: #f5f5f5;
}

.text-center {
  text-align: center;
}

/* Treatment Table Styles */
.selected-treatment-btn {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%) !important;
  border: 2px solid #2196f3 !important;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.15);
}

.v-data-table {
  border-radius: 8px;
  overflow: hidden;
}

.v-data-table .v-data-table__tr:hover {
  background-color: #f5f5f5;
}

.v-data-table .v-data-table__tr.selected {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .v-data-table {
    font-size: 0.875rem;
  }
}
</style>
