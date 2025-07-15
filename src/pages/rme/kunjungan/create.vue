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
        >
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="formData.patient_id"
                :items="patientOptions"
                item-title="title"
                item-value="value"
                label="Pasien *"
                :rules="[v => !!v || 'Pasien harus dipilih']"
                required
                density="comfortable"
                variant="outlined"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="formData.doctor_id"
                :items="doctorOptions"
                item-title="title"
                item-value="value"
                label="Dokter *"
                :rules="[v => !!v || 'Dokter harus dipilih']"
                required
                density="comfortable"
                variant="outlined"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="formData.branch_id"
                :items="branchOptions"
                item-title="title"
                item-value="value"
                label="Cabang *"
                :rules="[v => !!v || 'Cabang harus dipilih']"
                required
                density="comfortable"
                variant="outlined"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="formData.visit_date"
                label="Tanggal Kunjungan *"
                type="datetime-local"
                :rules="[v => !!v || 'Tanggal kunjungan harus diisi']"
                required
                density="comfortable"
                variant="outlined"
              />
            </VCol>
            <VCol cols="12">
              <VTextarea
                v-model="formData.chief_complaint"
                label="Keluhan Utama"
                placeholder="Masukkan keluhan utama pasien"
                rows="3"
                density="comfortable"
                variant="outlined"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="formData.status"
                :items="statusOptions"
                item-title="title"
                item-value="value"
                label="Status *"
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
              <VSelect
                v-model="formData.payment_status"
                :items="paymentStatusOptions"
                item-title="title"
                item-value="value"
                label="Status Pembayaran *"
                :rules="[v => !!v || 'Status pembayaran harus dipilih']"
                required
                density="comfortable"
                variant="outlined"
              />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <VTextField
                v-model="formData.total_consultation_fee"
                label="Biaya Konsultasi"
                type="number"
                prefix="Rp"
                density="comfortable"
                variant="outlined"
              />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <VTextField
                v-model="formData.total_treatment_fee"
                label="Biaya Treatment"
                type="number"
                prefix="Rp"
                density="comfortable"
                variant="outlined"
              />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <VTextField
                v-model="formData.total_product_fee"
                label="Biaya Produk"
                type="number"
                prefix="Rp"
                density="comfortable"
                variant="outlined"
              />
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
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref(null)
const loading = ref(false)

const formData = ref({
  patient_id: '',
  doctor_id: '',
  branch_id: '',
  visit_date: '',
  chief_complaint: '',
  status: 'SCHEDULED',
  payment_status: 'PENDING',
  total_consultation_fee: '',
  total_treatment_fee: '',
  total_product_fee: '',
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

async function fetchPatients() {
  try {
    const res = await $api('/rme/patients/paginated', {
      method: 'POST',
      body: {
        page: 1,
        per_page: 1000,
        sort_by: 'name',
        sort_order: 'asc',
      },
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
  }
}

async function fetchDoctors() {
  try {
    const res = await $api('/hris/doctors', {
      method: 'GET',
    })

    doctorOptions.value = (res.data || []).map(doctor => ({
      title: doctor.name,
      value: String(doctor.id),
    }))
  } catch (e) {
    console.error('Error fetching doctors:', e)
    await showErrorAlert(e, {
      title: 'Gagal Memuat Data Dokter',
      text: 'Tidak dapat memuat daftar dokter.',
    })
  }
}

async function fetchBranches() {
  try {
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
  }
}

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
      total_consultation_fee: parseFloat(formData.value.total_consultation_fee) || 0,
      total_treatment_fee: parseFloat(formData.value.total_treatment_fee) || 0,
      total_product_fee: parseFloat(formData.value.total_product_fee) || 0,
    }

    const response = await $api('/rme/patient-visits', {
      method: 'POST',
      body: submitData,
    })

    await showSuccessAlert({
      title: 'Berhasil',
      text: 'Kunjungan berhasil ditambahkan',
    })

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
    fetchDoctors(),
    fetchBranches(),
  ])
})
</script> 
