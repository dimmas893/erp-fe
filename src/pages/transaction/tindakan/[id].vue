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

            <!-- Photo Upload Section -->
            <VCol cols="12">
              <VCard variant="outlined">
                <VCardTitle class="pa-4 pb-2">
                  <div class="d-flex align-center gap-2">
                    <VIcon size="20" color="primary">
                      tabler-camera
                    </VIcon>
                    <h4 class="text-subtitle-1 font-weight-medium">
                      Foto Sebelum & Sesudah Tindakan
                    </h4>
                  </div>
                </VCardTitle>
                <VCardText class="pa-4 pt-0">
                  <!-- Upload Form -->
                  <VRow>
                    <VCol cols="12" md="6">
                      <VCard variant="outlined">
                        <VCardTitle class="pa-4 pb-2">
                          <div class="d-flex align-center gap-2">
                            <VIcon size="16" color="info">
                              tabler-upload
                            </VIcon>
                            <h5 class="text-subtitle-2 font-weight-medium">
                              Upload Foto Baru
                            </h5>
                          </div>
                        </VCardTitle>
                        <VCardText class="pa-4 pt-0">
                          <VForm ref="photoFormRef" v-model="isPhotoFormValid">
                            <VRow>
                              <VCol cols="12">
                                <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                                  Pilih Foto
                                </label>
                                <VFileInput
                                  v-model="photoForm.photo"
                                  :rules="[v => !!v || 'Foto harus dipilih']"
                                  accept="image/*"
                                  prepend-icon="tabler-camera"
                                  placeholder="Pilih foto sebelum/sesudah tindakan"
                                  variant="outlined"
                                  hide-details
                                  @change="handlePhotoChange"
                                />
                              </VCol>
                              <VCol cols="12" md="6">
                                <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                                  Tipe Konsen
                                </label>
                                <VSelect
                                  v-model="photoForm.consent_type"
                                  :items="consentTypeOptions"
                                  item-title="title"
                                  item-value="value"
                                  variant="outlined"
                                  placeholder="Pilih tipe konsen"
                                  :rules="[v => !!v || 'Tipe konsen harus dipilih']"
                                  hide-details
                                />
                              </VCol>
                              <VCol cols="12" md="6">
                                <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                                  Kualitas Foto
                                </label>
                                <VSelect
                                  v-model="photoForm.photo_quality"
                                  :items="photoQualityOptions"
                                  item-title="title"
                                  item-value="value"
                                  variant="outlined"
                                  placeholder="Pilih kualitas foto"
                                  :rules="[v => !!v || 'Kualitas foto harus dipilih']"
                                  hide-details
                                />
                              </VCol>
                              <VCol cols="12">
                                <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                                  Catatan
                                </label>
                                <VTextarea
                                  v-model="photoForm.notes"
                                  placeholder="Masukkan catatan untuk foto ini..."
                                  rows="3"
                                  variant="outlined"
                                  hide-details
                                />
                              </VCol>
                              <VCol cols="12">
                                <VCheckbox
                                  v-model="photoForm.is_visible_to_patient"
                                  label="Terlihat oleh pasien"
                                  hide-details
                                />
                              </VCol>
                              <VCol cols="12">
                                <div class="d-flex gap-2 justify-end">
                                  <VBtn
                                    variant="outlined"
                                    color="secondary"
                                    @click="resetPhotoForm"
                                  >
                                    Reset
                                  </VBtn>
                                  <VBtn
                                    color="primary"
                                    :loading="uploadingPhoto"
                                    :disabled="!isPhotoFormValid"
                                    @click="uploadPhoto"
                                  >
                                    Upload Foto
                                  </VBtn>
                                </div>
                              </VCol>
                            </VRow>
                          </VForm>
                        </VCardText>
                      </VCard>
                    </VCol>

                    <!-- Existing Photos -->
                    <VCol cols="12" md="6">
                      <VCard variant="outlined">
                        <VCardTitle class="pa-4 pb-2">
                          <div class="d-flex align-center gap-2">
                            <VIcon size="16" color="success">
                              tabler-photo
                            </VIcon>
                            <h5 class="text-subtitle-2 font-weight-medium">
                              Foto yang Sudah Ada
                            </h5>
                          </div>
                        </VCardTitle>
                        <VCardText class="pa-4 pt-0">
                          <div v-if="loadingPhotos" class="text-center py-4">
                            <VProgressCircular
                              indeterminate
                              color="primary"
                            />
                            <p class="text-body-2 text-medium-emphasis mt-2">
                              Memuat foto...
                            </p>
                          </div>
                          <div v-else-if="consentPhotos.length === 0" class="text-center py-4">
                            <VIcon
                              size="48"
                              color="grey"
                              class="mb-2"
                            >
                              tabler-photo-off
                            </VIcon>
                            <p class="text-body-2 text-medium-emphasis">
                              Belum ada foto yang diupload
                            </p>
                          </div>
                          <div v-else class="d-flex flex-column gap-3">
                            <div
                              v-for="photo in consentPhotos"
                              :key="photo.id"
                              class="d-flex align-center gap-3 p-3 rounded border"
                            >
                              <VImg
                                :src="photo.thumbnail_url || photo.photo_url"
                                :alt="photo.notes"
                                width="80"
                                height="60"
                                cover
                                class="rounded"
                              />
                              <div class="flex-grow-1">
                                <div class="d-flex align-center gap-2 mb-1">
                                  <VChip
                                    :color="getConsentTypeColor(photo.consent_type)"
                                    size="small"
                                    label
                                  >
                                    {{ getConsentTypeText(photo.consent_type) }}
                                  </VChip>
                                  <VChip
                                    :color="photo.consent_given ? 'success' : 'warning'"
                                    size="small"
                                    label
                                  >
                                    {{ photo.consent_given ? 'Diterima' : 'Pending' }}
                                  </VChip>
                                </div>
                                <p class="text-body-2 text-medium-emphasis mb-1">
                                  {{ photo.notes || 'Tidak ada catatan' }}
                                </p>
                                <p class="text-caption text-medium-emphasis">
                                  {{ formatDateTime(photo.taken_at) }}
                                </p>
                              </div>
                              <VBtn
                                icon="tabler-eye"
                                size="small"
                                variant="text"
                                color="primary"
                                @click="viewPhoto(photo)"
                                title="Lihat Foto"
                              />
                            </div>
                          </div>
                        </VCardText>
                      </VCard>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
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

    <!-- Photo Viewer Dialog -->
    <VDialog v-model="showPhotoViewer" max-width="800px">
      <VCard>
        <VCardTitle class="pa-4">
          <div class="d-flex align-center justify-space-between">
            <h4 class="text-h6">
              Detail Foto
            </h4>
            <VBtn
              icon="tabler-x"
              variant="text"
              @click="showPhotoViewer = false"
            />
          </div>
        </VCardTitle>
        <VCardText class="pa-4">
          <div v-if="selectedPhoto" class="text-center">
            <VImg
              :src="selectedPhoto.photo_url"
              :alt="selectedPhoto.notes"
              max-height="500"
              contain
              class="mb-4"
            />
            <div class="text-left">
              <h5 class="text-h6 mb-2">Informasi Foto</h5>
              <div class="d-flex flex-column gap-2">
                <div class="d-flex justify-space-between">
                  <span class="text-body-2 text-medium-emphasis">Tipe Konsen:</span>
                  <VChip
                    :color="getConsentTypeColor(selectedPhoto.consent_type)"
                    size="small"
                    label
                  >
                    {{ getConsentTypeText(selectedPhoto.consent_type) }}
                  </VChip>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-body-2 text-medium-emphasis">Status:</span>
                  <VChip
                    :color="selectedPhoto.consent_given ? 'success' : 'warning'"
                    size="small"
                    label
                  >
                    {{ selectedPhoto.consent_given ? 'Diterima' : 'Pending' }}
                  </VChip>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-body-2 text-medium-emphasis">Kualitas:</span>
                  <span class="text-body-2 font-weight-medium">{{ selectedPhoto.photo_quality }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-body-2 text-medium-emphasis">Ukuran File:</span>
                  <span class="text-body-2 font-weight-medium">{{ formatFileSize(selectedPhoto.file_size) }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-body-2 text-medium-emphasis">Resolusi:</span>
                  <span class="text-body-2 font-weight-medium">{{ selectedPhoto.image_width }} x {{ selectedPhoto.image_height }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-body-2 text-medium-emphasis">Diambil Pada:</span>
                  <span class="text-body-2 font-weight-medium">{{ formatDateTime(selectedPhoto.taken_at) }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-body-2 text-medium-emphasis">Oleh:</span>
                  <span class="text-body-2 font-weight-medium">{{ selectedPhoto.photographer?.name || '-' }}</span>
                </div>
                <div v-if="selectedPhoto.notes" class="d-flex justify-space-between">
                  <span class="text-body-2 text-medium-emphasis">Catatan:</span>
                  <span class="text-body-2 font-weight-medium">{{ selectedPhoto.notes }}</span>
                </div>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VDialog>
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

// Photo related state
const loadingPhotos = ref(false)
const uploadingPhoto = ref(false)
const consentPhotos = ref([])
const showPhotoViewer = ref(false)
const selectedPhoto = ref(null)

const photoFormRef = ref(null)
const isPhotoFormValid = ref(false)
const photoForm = ref({
  photo: null,
  consent_type: 'TREATMENT',
  photo_quality: 'RAW',
  notes: '',
  is_visible_to_patient: true,
})

// Computed
const treatmentId = computed(() => route.params.id)

// Options
const consentTypeOptions = [
  { title: 'Tindakan', value: 'TREATMENT' },
  { title: 'Portfolio', value: 'PORTFOLIO' },
  { title: 'Penelitian', value: 'RESEARCH' },
  { title: 'Rekam Medis', value: 'MEDICAL_RECORD' },
  { title: 'Legal', value: 'LEGAL' },
  { title: 'Marketing', value: 'MARKETING' },
]

const photoQualityOptions = [
  { title: 'RAW', value: 'RAW' },
  { title: 'Compressed', value: 'COMPRESSED' },
  { title: 'Processed', value: 'PROCESSED' },
]

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
    
    // Fetch photos after treatment is loaded
    if (treatment.value?.visit_id) {
      await fetchConsentPhotos()
    }
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

async function fetchConsentPhotos() {
  if (!treatment.value?.visit_id) return
  
  loadingPhotos.value = true
  console.log('🔄 Starting fetchConsentPhotos...', treatment.value.visit_id)
  
  try {
    const res = await $api(`/rme/consent-photos/visit/${treatment.value.visit_id}`, {
      method: 'GET',
    })
    
    console.log('📥 Consent Photos API Response:', res)
    
    consentPhotos.value = res.data || []
    
    console.log('✅ Consent photos loaded:', consentPhotos.value.length)
  } catch (error) {
    console.error('❌ Error fetching consent photos:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Foto',
      text: 'Tidak dapat memuat foto. Silakan coba lagi.',
    })
    consentPhotos.value = []
  } finally {
    loadingPhotos.value = false
    console.log('🏁 fetchConsentPhotos completed')
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
    
    // Update billing status to confirmed
    try {
      // Get billing ID from treatment data or visit data
      let billingId = res.data.billing_id
      if (!billingId && treatment.value?.visit?.billing_id) {
        billingId = treatment.value.visit.billing_id
      }
      if (billingId) {
        console.log('📤 Updating billing status to confirmed:', billingId)
        const billingRes = await $api(`/transaction/billings/${billingId}`, {
          method: 'PATCH',
          body: {
            status: 'confirmed',
          },
        })
        console.log('✅ Billing status updated:', billingRes.data)
      } else {
        console.log('⚠️ No billing ID found, skipping billing update')
      }
    } catch (billingError) {
      console.error('❌ Error updating billing status:', billingError)
      // Don't show error alert for billing update failure, just log it
    }
    
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

async function uploadPhoto() {
  if (!photoForm.value.photo || !treatment.value?.visit_id) return
  
  uploadingPhoto.value = true
  console.log('🔄 Starting uploadPhoto...')
  
  try {
    const formData = new FormData()
    formData.append('photo', photoForm.value.photo)
    formData.append('consent_type', photoForm.value.consent_type)
    formData.append('photo_quality', photoForm.value.photo_quality)
    formData.append('notes', photoForm.value.notes)
    formData.append('is_visible_to_patient', photoForm.value.is_visible_to_patient)
    formData.append('visit_id', treatment.value.visit_id)
    formData.append('patient_id', treatment.value.visit?.patient_id || '')
    formData.append('taken_at', new Date().toISOString())
    formData.append('consent_date', new Date().toISOString())
    formData.append('consent_given', 'true')
    formData.append('signatory_relation', 'self')
    
    console.log('📤 Upload Photo FormData:', formData)
    
    // Log FormData contents for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`📋 FormData ${key}:`, value)
    }
    
    // Don't set Content-Type header - let browser set it automatically with boundary
    const res = await $api('/rme/consent-photos', {
      method: 'POST',
      body: formData,
    })
    
    console.log('📥 Upload Photo API Response:', res)
    
    await showSuccessAlert({
      title: 'Berhasil',
      text: 'Foto berhasil diupload.',
    })
    
    // Reset form and reload photos
    resetPhotoForm()
    await fetchConsentPhotos()
    
    console.log('✅ Photo uploaded successfully')
  } catch (error) {
    console.error('❌ Error uploading photo:', error)
    await showErrorAlert(error, {
      title: 'Gagal Upload Foto',
      text: 'Tidak dapat mengupload foto. Silakan coba lagi.',
    })
  } finally {
    uploadingPhoto.value = false
    console.log('🏁 uploadPhoto completed')
  }
}

function handlePhotoChange(file) {
  console.log('📸 Photo selected:', file)
}

function resetPhotoForm() {
  photoForm.value = {
    photo: null,
    consent_type: 'TREATMENT',
    photo_quality: 'RAW',
    notes: '',
    is_visible_to_patient: true,
  }
}

function viewPhoto(photo) {
  selectedPhoto.value = photo
  showPhotoViewer.value = true
}

function resetForm() {
  if (treatment.value) {
    treatmentForm.value.treatment_notes = treatment.value.treatment_notes || ''
  }
}

function getConsentTypeColor(type) {
  switch (type) {
  case 'TREATMENT': return 'primary'
  case 'PORTFOLIO': return 'success'
  case 'RESEARCH': return 'info'
  case 'MEDICAL_RECORD': return 'warning'
  case 'LEGAL': return 'error'
  case 'MARKETING': return 'secondary'
  default: return 'grey'
  }
}

function getConsentTypeText(type) {
  switch (type) {
  case 'TREATMENT': return 'Tindakan'
  case 'PORTFOLIO': return 'Portfolio'
  case 'RESEARCH': return 'Penelitian'
  case 'MEDICAL_RECORD': return 'Rekam Medis'
  case 'LEGAL': return 'Legal'
  case 'MARKETING': return 'Marketing'
  default: return type
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

function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
