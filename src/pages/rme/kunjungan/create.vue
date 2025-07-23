<route lang="yaml">
meta:
  layout: default
  navActiveLink: rme-kunjungan
</route>

<template>
  <div>
    <!-- Header -->
    <VCard class="mb-6">
      <VCardText class="d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-3">
          <VBtn
            icon="tabler-arrow-left"
            variant="text"
            :to="{ name: 'rme-kunjungan' }"
            title="Kembali ke Daftar Kunjungan"
          />
          <div>
            <h1 class="text-h4 font-weight-bold mb-1">
              Tambah Kunjungan Baru
            </h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Daftarkan kunjungan baru untuk pasien
            </p>
          </div>
        </div>
        <VBtn
          size="small"
          variant="outlined"
          :to="{ name: 'rme-kunjungan' }"
        >
          Kembali
        </VBtn>
      </VCardText>
    </VCard>

    <!-- Form -->
    <VCard>
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon color="primary">
          tabler-calendar-plus
        </VIcon>
        Form Kunjungan
      </VCardTitle>
      <VCardText>
        <VForm
          ref="form"
          @submit.prevent="handleSubmit"
          validate-on="submit"
        >
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                Pasien *
              </label>
              <VSelect
                v-model="formData.patient_id"
                :items="patientOptions"
                item-title="title"
                item-value="value"
                :rules="[v => !!v || 'Pasien harus dipilih']"
                required
                density="comfortable"
                variant="outlined"
                :loading="loadingPatients"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                Cabang *
              </label>
              <VSelect
                v-model="formData.branch_id"
                :items="branchOptions"
                item-title="title"
                item-value="value"
                :rules="[v => !!v || 'Cabang harus dipilih']"
                required
                density="comfortable"
                variant="outlined"
                :loading="loadingBranches"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                Dokter *
              </label>
              <VSelect
                v-model="formData.doctor_id"
                :items="doctorOptions"
                item-title="title"
                item-value="value"
                :rules="[v => !!v || 'Dokter harus dipilih']"
                required
                density="comfortable"
                variant="outlined"
                :loading="loadingDoctors"
                :disabled="!formData.branch_id"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                Jenis Kunjungan *
              </label>
              <VSelect
                v-model="formData.visit_type"
                :items="visitTypeOptions"
                item-title="title"
                item-value="value"
                :rules="[v => !!v || 'Jenis kunjungan harus dipilih']"
                required
                density="comfortable"
                variant="outlined"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                Tanggal Kunjungan *
              </label>
              <VTextField
                v-model="formData.visit_date"
                type="date"
                :rules="[v => !!v || 'Tanggal kunjungan harus diisi']"
                required
                density="comfortable"
                variant="outlined"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                Waktu Terjadwal *
              </label>
              <VTextField
                v-model="formData.scheduled_time"
                type="datetime-local"
                :rules="[v => !!v || 'Waktu terjadwal harus diisi']"
                required
                density="comfortable"
                variant="outlined"
              />
            </VCol>
            <VCol cols="12">
              <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                Keluhan Utama
              </label>
              <VTextarea
                v-model="formData.chief_complaint"
                placeholder="Masukkan keluhan utama pasien"
                rows="3"
                density="comfortable"
                variant="outlined"
              />
            </VCol>
            <VCol cols="12">
              <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                Catatan
              </label>
              <VTextarea
                v-model="formData.notes"
                placeholder="Masukkan catatan tambahan"
                rows="2"
                density="comfortable"
                variant="outlined"
              />
            </VCol>

            <!-- Vital Signs Section -->
            <VCol cols="12">
              <VCard variant="outlined" class="pa-4">
                <VCardTitle class="text-h6 mb-4">
                  <VIcon start color="primary">
                    tabler-heartbeat
                  </VIcon>
                  Tanda Vital
                </VCardTitle>
                <VRow>
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Tekanan Darah
                    </label>
                    <VTextField
                      v-model="formData.vital_signs.blood_pressure"
                      placeholder="120/80"
                      density="comfortable"
                      variant="outlined"
                    />
                  </VCol>
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Suhu (°C)
                    </label>
                    <VTextField
                      v-model="formData.vital_signs.temperature"
                      placeholder="36.5"
                      type="number"
                      step="0.1"
                      density="comfortable"
                      variant="outlined"
                    />
                  </VCol>
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Denyut Nadi (bpm)
                    </label>
                    <VTextField
                      v-model="formData.vital_signs.heart_rate"
                      placeholder="75"
                      type="number"
                      density="comfortable"
                      variant="outlined"
                    />
                  </VCol>
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Laju Pernapasan (rpm)
                    </label>
                    <VTextField
                      v-model="formData.vital_signs.respiratory_rate"
                      placeholder="18"
                      type="number"
                      density="comfortable"
                      variant="outlined"
                    />
                  </VCol>
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Berat Badan (kg)
                    </label>
                    <VTextField
                      v-model="formData.vital_signs.weight"
                      placeholder="65"
                      type="number"
                      step="0.1"
                      density="comfortable"
                      variant="outlined"
                    />
                  </VCol>
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Tinggi Badan (cm)
                    </label>
                    <VTextField
                      v-model="formData.vital_signs.height"
                      placeholder="170"
                      type="number"
                      density="comfortable"
                      variant="outlined"
                    />
                  </VCol>
                </VRow>
              </VCard>
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                Status *
              </label>
              <VSelect
                v-model="formData.status"
                :items="statusOptions"
                item-title="title"
                item-value="value"
                :rules="[v => !!v || 'Status harus dipilih']"
                required
                density="comfortable"
                variant="outlined"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                Status Pembayaran *
              </label>
              <VSelect
                v-model="formData.payment_status"
                :items="paymentStatusOptions"
                item-title="title"
                item-value="value"
                :rules="[v => !!v || 'Status pembayaran harus dipilih']"
                required
                density="comfortable"
                variant="outlined"
              />
            </VCol>

            <!-- Fee Section (Static at 0) -->
            <VCol cols="12">
              <VCard variant="outlined" class="pa-4">
                <VCardTitle class="text-h6 mb-4">
                  <VIcon start color="primary">
                    tabler-calculator
                  </VIcon>
                  Biaya (Statis)
                </VCardTitle>
                <VRow>
                  <VCol
                    cols="12"
                    md="3"
                  >
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Biaya Konsultasi
                    </label>
                    <VTextField
                      :model-value="0"
                      type="number"
                      prefix="Rp"
                      readonly
                      density="comfortable"
                      variant="outlined"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="3"
                  >
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Biaya Treatment
                    </label>
                    <VTextField
                      :model-value="0"
                      type="number"
                      prefix="Rp"
                      readonly
                      density="comfortable"
                      variant="outlined"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="3"
                  >
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Biaya Produk
                    </label>
                    <VTextField
                      :model-value="0"
                      type="number"
                      prefix="Rp"
                      readonly
                      density="comfortable"
                      variant="outlined"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="3"
                  >
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Total Biaya
                    </label>
                    <VTextField
                      :model-value="0"
                      type="number"
                      prefix="Rp"
                      readonly
                      density="comfortable"
                      variant="outlined"
                    />
                  </VCol>
                </VRow>
              </VCard>
            </VCol>
          </VRow>

          <!-- Action Buttons -->
          <div class="d-flex gap-3 mt-6">
            <VBtn
              type="submit"
              color="primary"
              :loading="loading"
              :disabled="loading"
            >
              <VIcon start>
                tabler-check
              </VIcon>
              Simpan Kunjungan
            </VBtn>
            <VBtn
              color="secondary"
              variant="outlined"
              :to="{ name: 'rme-kunjungan' }"
              :disabled="loading"
            >
              Batal
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert, showSuccessAlert } from '@/utils/errorHandler'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref(null)
const loading = ref(false)
const loadingPatients = ref(false)
const loadingBranches = ref(false)
const loadingDoctors = ref(false)

const formData = ref({
  patient_id: '',
  doctor_id: '',
  branch_id: '',
  visit_date: '',
  scheduled_time: '',
  chief_complaint: '',
  vital_signs: {
    blood_pressure: '',
    temperature: '',
    heart_rate: '',
    respiratory_rate: '',
    weight: '',
    height: '',
  },
  status: 'SCHEDULED',
  payment_status: 'PENDING',
  visit_type: 'CONSULTATION',
  notes: '',
})

const patientOptions = ref([])
const doctorOptions = ref([])
const branchOptions = ref([])

const statusOptions = [
  { title: 'Terjadwal', value: 'SCHEDULED' },
  { title: 'Sedang Berlangsung', value: 'IN_PROGRESS' },
  { title: 'Selesai', value: 'COMPLETED' },
  { title: 'Dibatalkan', value: 'CANCELLED' },
]

const paymentStatusOptions = [
  { title: 'Menunggu', value: 'PENDING' },
  { title: 'Lunas', value: 'PAID' },
  { title: 'Sebagian', value: 'PARTIAL' },
  { title: 'Dikembalikan', value: 'REFUNDED' },
]

const visitTypeOptions = [
  { title: 'Konsultasi', value: 'CONSULTATION' },
  { title: 'Treatment', value: 'TREATMENT' },
  { title: 'Follow Up', value: 'FOLLOW_UP' },
  { title: 'Emergency', value: 'EMERGENCY' },
]

async function fetchPatients() {
  try {
    loadingPatients.value = true
    const res = await $api('/rme/patients', {
      method: 'GET',
    })

    patientOptions.value = (res.data || []).map(patient => ({
      title: `${patient.name} (${patient.patient_number})`,
      value: String(patient.id),
    }))
  } catch (e) {
    console.error('Error fetching patients:', e)
    await showErrorAlert(e, {
      title: 'Gagal Memuat Data Pasien',
      text: 'Tidak dapat memuat daftar pasien.',
    })
  } finally {
    loadingPatients.value = false
  }
}

async function fetchDoctors(branchId = null) {
  try {
    loadingDoctors.value = true
    
    if (!branchId) {
      doctorOptions.value = []
      return
    }

    const res = await $api(`/hris/doctors/branch/${branchId}`, {
      method: 'GET',
    })

    doctorOptions.value = (res.data || []).map(doctor => ({
      title: `${doctor.name} - ${doctor.specialization}`,
      value: String(doctor.id),
    }))
  } catch (e) {
    console.error('Error fetching doctors:', e)
    await showErrorAlert(e, {
      title: 'Gagal Memuat Data Dokter',
      text: 'Tidak dapat memuat daftar dokter.',
    })
  } finally {
    loadingDoctors.value = false
  }
}

async function fetchBranches() {
  try {
    loadingBranches.value = true
    const res = await $api('/wms/branches', {
      method: 'GET',
    })

    branchOptions.value = (res.data || []).map(branch => ({
      title: `${branch.name} (${branch.code})`,
      value: String(branch.id),
    }))
  } catch (e) {
    console.error('Error fetching branches:', e)
    await showErrorAlert(e, {
      title: 'Gagal Memuat Data Cabang',
      text: 'Tidak dapat memuat daftar cabang.',
    })
  } finally {
    loadingBranches.value = false
  }
}

// Watch for branch selection changes
watch(() => formData.value.branch_id, async (newBranchId) => {
  // Clear doctor selection when branch changes
  formData.value.doctor_id = ''
  
  if (newBranchId) {
    await fetchDoctors(newBranchId)
  } else {
    doctorOptions.value = []
  }
})

async function handleSubmit() {
  const { valid } = await form.value.validate()
  
  if (!valid) return

  loading.value = true
  
  try {
    // Prepare data for API
    const submitData = {
      ...formData.value,
      patient_id: String(formData.value.patient_id),
      doctor_id: Number(formData.value.doctor_id),
      branch_id: String(formData.value.branch_id),
      // Static fees at 0
      total_consultation_fee: 0,
      total_treatment_fee: 0,
      total_product_fee: 0,
      total_amount: 0,
      // Convert vital signs to numbers where appropriate
      vital_signs: {
        ...formData.value.vital_signs,
        temperature: parseFloat(formData.value.vital_signs.temperature) || null,
        heart_rate: parseInt(formData.value.vital_signs.heart_rate) || null,
        respiratory_rate: parseInt(formData.value.vital_signs.respiratory_rate) || null,
        weight: parseFloat(formData.value.vital_signs.weight) || null,
        height: parseInt(formData.value.vital_signs.height) || null,
      },
    }

    console.log('Submitting data:', submitData)

    const response = await $api('/rme/patient-visits', {
      method: 'POST',
      body: submitData,
    })

    await showSuccessAlert(
      'Kunjungan berhasil ditambahkan',
      'Berhasil!'
    )

    await router.push({ name: 'rme-kunjungan' })
  } catch (error) {
    console.error('Error creating visit:', error)
    await showErrorAlert(error, {
      title: 'Gagal Menambah Kunjungan',
      text: 'Tidak dapat menambah kunjungan. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    fetchPatients(),
    fetchBranches(),
  ])
})
</script> 
