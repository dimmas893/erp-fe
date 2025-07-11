<route lang="yaml">
meta:
  layout: default
  navActiveLink: rme-kunjungan
</route>

<template>
  <VCard>
    <!-- Header -->
    <VCardText class="d-flex flex-wrap gap-4 align-center justify-space-between">
      <h2 class="text-h4 font-weight-bold mb-0">
        {{ visit ? `Edit Kunjungan: ${visit?.visit_number || ''}` : 'Edit Kunjungan' }}
      </h2>
      <div class="d-flex gap-3 align-center flex-wrap">
        <VBtn icon="tabler-arrow-left" variant="text" color="secondary" :to="{ name: 'rme-kunjungan' }"
          title="Kembali ke Daftar Kunjungan" />
      </div>
    </VCardText>
    <VDivider />

    <VProgressLinear v-if="isLoadingVisit" indeterminate color="primary" />

    <VCardText v-if="isLoadingVisit">
      <!-- Loading skeleton -->
      <div class="d-flex align-center gap-4 mb-6">
        <VSkeleton type="avatar" size="72" />
        <div class="flex-grow-1">
          <VSkeleton type="heading" class="mb-2" />
          <VSkeleton type="chip" width="80" />
        </div>
      </div>
      <VRow>
        <VCol cols="12" md="6">
          <VSkeletonLoader type="list-item-two-line@6" />
        </VCol>
        <VCol cols="12" md="6">
          <VSkeletonLoader type="list-item-two-line@6" />
        </VCol>
      </VRow>
    </VCardText>

    <!-- Edit Form -->
    <VCardText v-else>
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon color="primary">tabler-edit</VIcon>
        Form Edit Kunjungan
      </VCardTitle>
      <VCardText>
        <VForm ref="form" @submit.prevent="handleSubmit">
          <VRow>
            <VCol cols="12" md="6">
              <VSelect v-model="formData.patient_id" :items="patientOptions" item-title="title" item-value="value"
                label="Pasien *" :rules="[v => !!v || 'Pasien harus dipilih']" required density="comfortable"
                variant="outlined" />
            </VCol>
            <VCol cols="12" md="6">
              <VSelect v-model="formData.doctor_id" :items="doctorOptions" item-title="title" item-value="value"
                label="Dokter *" :rules="[v => !!v || 'Dokter harus dipilih']" required density="comfortable"
                variant="outlined" />
            </VCol>
            <VCol cols="12" md="6">
              <VSelect v-model="formData.branch_id" :items="branchOptions" item-title="title" item-value="value"
                label="Cabang *" :rules="[v => !!v || 'Cabang harus dipilih']" required density="comfortable"
                variant="outlined" />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model="formData.visit_date" label="Tanggal Kunjungan *" type="datetime-local"
                :rules="[v => !!v || 'Tanggal kunjungan harus diisi']" required density="comfortable"
                variant="outlined" />
            </VCol>
            <VCol cols="12">
              <VTextarea v-model="formData.chief_complaint" label="Keluhan Utama"
                placeholder="Masukkan keluhan utama pasien" rows="3" density="comfortable" variant="outlined" />
            </VCol>
            <VCol cols="12" md="6">
              <VSelect v-model="formData.status" :items="statusOptions" item-title="title" item-value="value"
                label="Status *" :rules="[v => !!v || 'Status harus dipilih']" required density="comfortable"
                variant="outlined" />
            </VCol>
            <VCol cols="12" md="6">
              <VSelect v-model="formData.payment_status" :items="paymentStatusOptions" item-title="title"
                item-value="value" label="Status Pembayaran *" :rules="[v => !!v || 'Status pembayaran harus dipilih']"
                required density="comfortable" variant="outlined" />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField v-model="formData.total_consultation_fee" label="Biaya Konsultasi" type="number" prefix="Rp"
                density="comfortable" variant="outlined" />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField v-model="formData.total_treatment_fee" label="Biaya Treatment" type="number" prefix="Rp"
                density="comfortable" variant="outlined" />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField v-model="formData.total_product_fee" label="Biaya Produk" type="number" prefix="Rp"
                density="comfortable" variant="outlined" />
            </VCol>
          </VRow>

          <!-- Action Buttons -->
          <div class="d-flex gap-3 mt-6">
            <VBtn type="submit" color="primary" :loading="submitting" :disabled="submitting">
              <VIcon start>tabler-check</VIcon>
              Update Kunjungan
            </VBtn>
            <VBtn color="secondary" variant="outlined"
              :to="{ name: 'rme-kunjungan-id', params: { id: route.params.id } }" :disabled="submitting">
              Batal
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCardText>
  </VCard>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert, showSuccessAlert } from '@/utils/errorHandler'
import { onActivated, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const form = ref(null)
const isLoading = ref(false)
const isLoadingVisit = ref(true)

const visit = ref(null)
const formData = ref({
  patient_id: '',
  doctor_id: '',
  branch_id: '',
  visit_date: '',
  chief_complaint: '',
  status: '',
  payment_status: '',
  total_consultation_fee: '',
  total_treatment_fee: '',
  total_product_fee: ''
})

const patientOptions = ref([])
const doctorOptions = ref([])
const branchOptions = ref([])

const statusOptions = [
  { title: 'Terjadwal', value: 'SCHEDULED' },
  { title: 'Sedang Berlangsung', value: 'IN_PROGRESS' },
  { title: 'Selesai', value: 'COMPLETED' },
  { title: 'Dibatalkan', value: 'CANCELLED' }
]

const paymentStatusOptions = [
  { title: 'Menunggu', value: 'PENDING' },
  { title: 'Lunas', value: 'PAID' },
  { title: 'Sebagian', value: 'PARTIAL' },
  { title: 'Dikembalikan', value: 'REFUNDED' }
]

async function fetchVisit() {
  isLoadingVisit.value = true
  try {
    const res = await $api(`/rme/patient-visits/${route.params.id}`)
    visit.value = res.data

    // Populate form data
    formData.value = {
      patient_id: String(visit.value.patient_id),
      doctor_id: String(visit.value.doctor_id),
      branch_id: String(visit.value.branch_id),
      visit_date: formatDateTimeForInput(visit.value.visit_date),
      chief_complaint: visit.value.chief_complaint || '',
      status: visit.value.status,
      payment_status: visit.value.payment_status,
      total_consultation_fee: visit.value.total_consultation_fee || '',
      total_treatment_fee: visit.value.total_treatment_fee || '',
      total_product_fee: visit.value.total_product_fee || ''
    }
  } catch (err) {
    console.error('Error fetching visit:', err)
    await showErrorAlert(err, {
      title: 'Gagal Memuat Data Kunjungan',
      text: 'Tidak dapat memuat detail kunjungan. Silakan coba lagi.'
    })
    router.push({ name: 'rme-kunjungan' })
  } finally {
    isLoadingVisit.value = false
  }
}

async function fetchPatients() {
  try {
    const res = await $api('/rme/patients/paginated', {
      method: 'POST',
      body: {
        page: 1,
        per_page: 1000,
        sort_by: 'name',
        sort_order: 'asc'
      }
    })
    patientOptions.value = (res.data || []).map(patient => ({
      title: `${patient.name} (${patient.patient_number})`,
      value: String(patient.id),
    }))
  } catch (e) {
    console.error('Error fetching patients:', e)
    await showErrorAlert(e, {
      title: 'Gagal Memuat Data Pasien',
      text: 'Tidak dapat memuat daftar pasien.'
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
      text: 'Tidak dapat memuat daftar dokter.'
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
      text: 'Tidak dapat memuat daftar cabang.'
    })
  }
}

async function handleSubmit() {
  const { valid } = await form.value.validate()

  if (!valid) return

  submitting.value = true

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

    const response = await $api(`/rme/patient-visits/${route.params.id}`, {
      method: 'PUT',
      body: submitData,
    })

    await showSuccessAlert({
      title: 'Berhasil',
      text: 'Kunjungan berhasil diperbarui'
    })

    await router.push({ name: 'rme-kunjungan-id', params: { id: route.params.id } })
  } catch (error) {
    console.error('Error updating visit:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memperbarui Kunjungan',
      text: 'Tidak dapat memperbarui kunjungan. Silakan coba lagi.'
    })
  } finally {
    submitting.value = false
  }
}

function formatDateTimeForInput(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:MM
}

onMounted(async () => {
  await Promise.all([
    fetchPatients(),
    fetchDoctors(),
    fetchBranches()
  ])
  fetchVisit()
})

onActivated(() => {
  fetchVisit()
})
</script>
