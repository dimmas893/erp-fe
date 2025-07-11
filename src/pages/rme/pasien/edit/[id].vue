<route lang="yaml">
meta:
  layout: default
  navActiveLink: rme-pasien
</route>

<script setup>
import { emailValidator, requiredValidator } from '@/@core/utils/validators'
import { $api } from '@/utils/api'
import { showErrorAlert, showSuccessAlert, showValidationErrorAlert } from '@/utils/errorHandler'
import { useRoute, useRouter } from 'vue-router'
import { VForm } from 'vuetify/components/VForm'

// Initialize router and route
const router = useRouter()
const route = useRoute()

// Form data structure based on API
const formData = ref({
  name: '',
  branch_id: '',
  nik: '',
  birth_date: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  emergency_contact: {
    name: '',
    phone: '',
    relation: ''
  },
  medical_history: '',
  allergies: '',
  current_medications: '',
  is_active: true
})

// Form validation
const refForm = ref()
const isLoading = ref(false)
const isLoadingPatient = ref(true)

// Options
const genderOptions = [
  { title: 'Laki-laki', value: 'MALE' },
  { title: 'Perempuan', value: 'FEMALE' }
]

const relationOptions = [
  'Suami', 'Istri', 'Ayah', 'Ibu', 'Anak', 'Saudara', 'Teman', 'Lainnya'
]

// Branches data
const branches = ref([])
const loadingBranches = ref(false)

// Patient data
const patient = ref(null)

// Load data on mount
onMounted(async () => {
  await Promise.all([
    loadBranches(),
    loadPatient()
  ])
})

const loadBranches = async () => {
  try {
    loadingBranches.value = true
    const response = await $api('/wms/branches')
    branches.value = response.data.map(branch => ({
      title: `${branch.name} (${branch.code})`,
      value: branch.id
    }))
  } catch (error) {
    console.error('Error loading branches:', error)
    await showErrorAlert(error, { 
      title: 'Gagal Memuat Data Cabang',
      text: 'Tidak dapat memuat daftar cabang. Silakan refresh halaman.'
    })
  } finally {
    loadingBranches.value = false
  }
}

const loadPatient = async () => {
  try {
    isLoadingPatient.value = true
    const response = await $api(`/rme/patients/${route.params.id}`)
    patient.value = response.data
    
    // Populate form with existing data
    formData.value = {
      name: patient.value.name || '',
      branch_id: patient.value.branch_id || '',
      nik: patient.value.nik || '',
      birth_date: patient.value.birth_date || '',
      gender: patient.value.gender || '',
      phone: patient.value.phone || '',
      email: patient.value.email || '',
      address: patient.value.address || '',
      emergency_contact: {
        name: patient.value.emergency_contact?.name || '',
        phone: patient.value.emergency_contact?.phone || '',
        relation: patient.value.emergency_contact?.relation || patient.value.emergency_contact?.relationship || ''
      },
      medical_history: patient.value.medical_history || '',
      allergies: patient.value.allergies || '',
      current_medications: patient.value.current_medications || '',
      is_active: patient.value.is_active !== false
    }
  } catch (error) {
    console.error('Error loading patient:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Pasien',
      text: 'Tidak dapat memuat data pasien. Silakan coba lagi.'
    })
    router.push({ name: 'rme-pasien' })
  } finally {
    isLoadingPatient.value = false
  }
}

// Validation rules
const nikValidator = (value) => {
  if (!value) return 'NIK wajib diisi'
  if (!/^\d{16}$/.test(value)) return 'NIK harus 16 digit angka'
  return true
}

const phoneValidator = (value) => {
  if (!value) return 'Nomor telepon wajib diisi'
  if (!/^(\+62|62|0)[0-9]{9,13}$/.test(value)) return 'Format nomor telepon tidak valid'
  return true
}

const emergencyPhoneValidator = (value) => {
  if (!value) return 'Nomor telepon kontak darurat wajib diisi'
  if (!/^[0-9]{10,15}$/.test(value)) return 'Format nomor telepon tidak valid'
  return true
}

// Submit form with PATCH method
const submitForm = async () => {
  const { valid } = await refForm.value.validate()
  
  if (!valid) return

  try {
    isLoading.value = true
    
    // Prepare data for API
    const submitData = {
      ...formData.value,
      // Ensure birth_date is in YYYY-MM-DD format
      birth_date: formData.value.birth_date ? new Date(formData.value.birth_date).toISOString().split('T')[0] : ''
    }
    
    const response = await $api(`/rme/patients/${route.params.id}`, {
      method: 'PATCH',
      body: submitData
    })

    await showSuccessAlert(
      'Data pasien berhasil diperbarui!',
      'Berhasil!'
    )

    // Redirect to patient detail page
    await router.push({ name: 'rme-pasien-id', params: { id: route.params.id } })
    
  } catch (error) {
    console.error('Error updating patient:', error)
    
    // Check if it's a validation error (400 status)
    const errorData = error.data || error.response?.data || error
    if (errorData.response_code === 400 || error.status === 400) {
      await showValidationErrorAlert(error, 'Data Tidak Valid')
    } else {
      await showErrorAlert(error)
    }
  } finally {
    isLoading.value = false
  }
}

// Cancel and go back
const goBack = () => {
  router.push({ name: 'rme-pasien-id', params: { id: route.params.id } })
}

const goToList = () => {
  router.push({ name: 'rme-pasien' })
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="d-flex align-center gap-2">
        <VBtn
          icon="tabler-arrow-left"
          variant="text"
          size="small"
          @click="goBack"
        />
        Edit Pasien: {{ patient?.name || 'Loading...' }}
      </VCardTitle>
      <VCardSubtitle>
        Perbarui data pasien yang sudah terdaftar di sistem RME
      </VCardSubtitle>
    </VCardItem>

    <!-- Loading State -->
    <VProgressLinear v-if="isLoadingPatient" indeterminate color="primary" />
    <VCardText v-if="isLoadingPatient">
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
      <VForm
        ref="refForm"
        @submit.prevent="submitForm"
      >
        <VRow>
          <!-- Data Pribadi -->
          <VCol cols="12">
            <h6 class="text-h6 font-weight-medium mb-4">
              Data Pribadi
            </h6>
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="formData.name"
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap"
              :rules="[requiredValidator]"
              required
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppSelect
              v-model="formData.branch_id"
              label="Cabang"
              placeholder="Pilih cabang"
              :items="branches"
              :loading="loadingBranches"
              :rules="[requiredValidator]"
              required
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="formData.nik"
              label="NIK"
              placeholder="Masukkan 16 digit NIK"
              :rules="[nikValidator]"
              type="number"
              required
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppDateTimePicker
              v-model="formData.birth_date"
              label="Tanggal Lahir"
              placeholder="Pilih tanggal lahir"
              :rules="[requiredValidator]"
              required
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppSelect
              v-model="formData.gender"
              label="Jenis Kelamin"
              placeholder="Pilih jenis kelamin"
              :items="genderOptions"
              :rules="[requiredValidator]"
              required
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="formData.phone"
              label="Nomor Telepon"
              placeholder="Contoh: +6281234567890"
              :rules="[phoneValidator]"
              required
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="formData.email"
              label="Email"
              placeholder="contoh@email.com"
              :rules="[emailValidator]"
              type="email"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VCheckbox
              v-model="formData.is_active"
              label="Status Aktif"
              color="primary"
            />
          </VCol>

          <VCol cols="12">
            <AppTextarea
              v-model="formData.address"
              label="Alamat"
              placeholder="Masukkan alamat lengkap"
              :rules="[requiredValidator]"
              rows="3"
              required
            />
          </VCol>

          <!-- Kontak Darurat -->
          <VCol cols="12">
            <VDivider class="my-4" />
            <h6 class="text-h6 font-weight-medium mb-4">
              Kontak Darurat
            </h6>
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <AppTextField
              v-model="formData.emergency_contact.name"
              label="Nama Kontak Darurat"
              placeholder="Nama lengkap"
              :rules="[requiredValidator]"
              required
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <AppTextField
              v-model="formData.emergency_contact.phone"
              label="Nomor Telepon"
              placeholder="08123456789"
              :rules="[emergencyPhoneValidator]"
              required
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <AppSelect
              v-model="formData.emergency_contact.relation"
              label="Hubungan"
              placeholder="Pilih hubungan"
              :items="relationOptions"
              :rules="[requiredValidator]"
              required
            />
          </VCol>

          <!-- Riwayat Medis -->
          <VCol cols="12">
            <VDivider class="my-4" />
            <h6 class="text-h6 font-weight-medium mb-4">
              Riwayat Medis
            </h6>
          </VCol>

          <VCol cols="12">
            <AppTextarea
              v-model="formData.medical_history"
              label="Riwayat Penyakit"
              placeholder="Masukkan riwayat penyakit (opsional)"
              rows="3"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextarea
              v-model="formData.allergies"
              label="Alergi"
              placeholder="Masukkan daftar alergi (opsional)"
              rows="3"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextarea
              v-model="formData.current_medications"
              label="Obat yang Sedang Dikonsumsi"
              placeholder="Masukkan daftar obat (opsional)"
              rows="3"
            />
          </VCol>

          <!-- Action Buttons -->
          <VCol cols="12">
            <div class="d-flex gap-4 mt-6">
              <VBtn
                type="submit"
                :loading="isLoading"
                :disabled="isLoading || isLoadingPatient"
                color="primary"
              >
                <VIcon
                  start
                  icon="tabler-device-floppy"
                />
                Update
              </VBtn>

              <VBtn
                color="secondary"
                variant="tonal"
                @click="goBack"
                :disabled="isLoading"
              >
                <VIcon
                  start
                  icon="tabler-arrow-left"
                />
                Kembali
              </VBtn>

              <VBtn
                color="error"
                variant="outlined"
                @click="goToList"
                :disabled="isLoading"
              >
                <VIcon
                  start
                  icon="tabler-x"
                />
                Batal
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template> 
