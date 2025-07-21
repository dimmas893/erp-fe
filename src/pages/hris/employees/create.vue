<route lang="yaml">
meta:
  layout: default
  navActiveLink: hris-employees
</route>

<template>
  <VCard>
    <!-- Header -->
    <VCardTitle class="d-flex align-center justify-space-between pa-4">
      <div class="d-flex align-center gap-3">
        <VIcon
          size="28"
          color="primary"
        >
          tabler-users
        </VIcon>
        <div>
          <h2 class="text-h5 mb-1">
            Tambah Karyawan Baru
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Tambahkan karyawan baru ke sistem
          </p>
        </div>
      </div>
      <VBtn
        variant="text"
        color="secondary"
        prepend-icon="tabler-arrow-left"
        :to="{ name: 'hris-employees' }"
      >
        Kembali
      </VBtn>
    </VCardTitle>

    <VDivider />

    <VCardText class="pa-4">
      <VForm ref="formRef" v-model="isFormValid">
        <VRow>
          <!-- Basic Information -->
          <VCol cols="12">
            <h3 class="text-h6 mb-4">
              Informasi Dasar
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Nama Lengkap
            </label>
            <VTextField
              v-model="formData.name"
              placeholder="Masukkan nama lengkap"
              variant="outlined"
              maxlength="200"
              :rules="[
                v => !!v || 'Nama lengkap harus diisi',
                v => v.length <= 200 || 'Nama lengkap maksimal 200 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Email
            </label>
            <VTextField
              v-model="formData.email"
              placeholder="Masukkan email"
              variant="outlined"
              type="email"
              maxlength="100"
              :rules="[
                v => !!v || 'Email harus diisi',
                v => /.+@.+\..+/.test(v) || 'Email harus valid',
                v => v.length <= 100 || 'Email maksimal 100 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Nomor Telepon
            </label>
            <VTextField
              v-model="formData.phone"
              placeholder="Masukkan nomor telepon"
              variant="outlined"
              maxlength="20"
              :rules="[
                v => v.length <= 20 || 'Nomor telepon maksimal 20 karakter'
              ]"
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Alamat
            </label>
            <VTextarea
              v-model="formData.address"
              placeholder="Masukkan alamat lengkap"
              variant="outlined"
              rows="3"
              maxlength="500"
              :rules="[
                v => v.length <= 500 || 'Alamat maksimal 500 karakter'
              ]"
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tanggal Lahir
            </label>
            <VTextField
              v-model="formData.birth_date"
              type="date"
              variant="outlined"
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Jenis Kelamin
            </label>
            <VSelect
              v-model="formData.gender"
              :items="genderOptions"
              variant="outlined"
              placeholder="Pilih jenis kelamin"
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Status Pernikahan
            </label>
            <VSelect
              v-model="formData.marital_status"
              :items="maritalStatusOptions"
              variant="outlined"
              placeholder="Pilih status pernikahan"
              hide-details
            />
          </VCol>

          <!-- Employment Information -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Informasi Pekerjaan
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Departemen
            </label>
            <VSelect
              v-model="formData.department_id"
              placeholder="Pilih departemen..."
              :items="departments"
              :loading="loadingDepartments"
              :rules="[v => !!v || 'Departemen harus dipilih']"
              required
              clearable
              hide-details="auto"
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Posisi
            </label>
            <VSelect
              v-model="formData.position_id"
              placeholder="Pilih posisi..."
              :items="positions"
              :loading="loadingPositions"
              :rules="[v => !!v || 'Posisi harus dipilih']"
              required
              clearable
              hide-details="auto"
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tanggal Bergabung
            </label>
            <VTextField
              v-model="formData.hire_date"
              type="date"
              variant="outlined"
              :rules="[v => !!v || 'Tanggal bergabung harus diisi']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tipe Kontrak
            </label>
            <VSelect
              v-model="formData.contract_type"
              :items="contractTypeOptions"
              variant="outlined"
              placeholder="Pilih tipe kontrak"
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Status Karyawan
            </label>
            <VSelect
              v-model="formData.employment_status"
              :items="employmentStatusOptions"
              variant="outlined"
              placeholder="Pilih status karyawan"
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tanggal Terminasi (Opsional)
            </label>
            <VTextField
              v-model="formData.termination_date"
              type="date"
              variant="outlined"
              placeholder="Pilih tanggal terminasi (opsional)"
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Gaji
            </label>
            <VTextField
              v-model="formData.salary"
              placeholder="Masukkan gaji"
              variant="outlined"
              type="number"
              min="0"
              step="0.01"
              :rules="[
                v => v >= 0 || 'Gaji tidak boleh negatif'
              ]"
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Kuota Cuti Tahunan
            </label>
            <VTextField
              v-model.number="formData.annual_leave_quota"
              placeholder="12"
              variant="outlined"
              type="number"
              min="0"
              :rules="[
                v => v >= 0 || 'Kuota cuti tahunan tidak boleh negatif'
              ]"
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Kuota Cuti Sakit
            </label>
            <VTextField
              v-model.number="formData.sick_leave_quota"
              placeholder="12"
              variant="outlined"
              type="number"
              min="0"
              :rules="[
                v => v >= 0 || 'Kuota cuti sakit tidak boleh negatif'
              ]"
              hide-details
            />
          </VCol>

          <!-- Emergency Contact -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Kontak Darurat
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Nama Kontak Darurat
            </label>
            <VTextField
              v-model="formData.emergency_contact_name"
              placeholder="Masukkan nama kontak darurat"
              variant="outlined"
              maxlength="100"
              :rules="[
                v => v.length <= 100 || 'Nama kontak darurat maksimal 100 karakter'
              ]"
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Nomor Telepon Kontak Darurat
            </label>
            <VTextField
              v-model="formData.emergency_contact_phone"
              placeholder="Masukkan nomor telepon kontak darurat"
              variant="outlined"
              maxlength="20"
              :rules="[
                v => v.length <= 20 || 'Nomor telepon kontak darurat maksimal 20 karakter'
              ]"
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Hubungan dengan Kontak Darurat
            </label>
            <VSelect
              v-model="formData.emergency_contact_relation"
              :items="emergencyContactRelationOptions"
              variant="outlined"
              placeholder="Pilih hubungan dengan kontak darurat"
              clearable
              hide-details
            />
          </VCol>

          <VCol cols="12">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Catatan Tambahan
            </label>
            <VTextarea
              v-model="formData.notes"
              placeholder="Masukkan catatan tambahan (opsional)"
              variant="outlined"
              rows="3"
              maxlength="1000"
              :rules="[
                v => v.length <= 1000 || 'Catatan tambahan maksimal 1000 karakter'
              ]"
              hide-details
            />
          </VCol>
        </VRow>

        <!-- Action Buttons -->
        <VRow class="mt-6">
          <VCol cols="12" class="d-flex gap-3 justify-end">
            <VBtn
              variant="outlined"
              color="secondary"
              :to="{ name: 'hris-employees' }"
            >
              Batal
            </VBtn>
            <VBtn
              color="primary"
              :loading="loading"
              :disabled="!isFormValid"
              @click="handleSubmit"
            >
              Simpan Karyawan
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert, showSuccessAlert } from '@/utils/errorHandler'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form state
const formRef = ref()
const isFormValid = ref(false)
const loading = ref(false)

// Form data
const formData = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  birth_date: '',
  gender: '',
  marital_status: '',
  department_id: null,
  position_id: null,
  hire_date: '',
  contract_type: '',
  employment_status: '',
  termination_date: null, // Changed to null for optional field
  salary: '',
  annual_leave_quota: 12,
  sick_leave_quota: 12,
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergency_contact_relation: '',
  notes: '',
})

// Watch for form data changes
watch(() => formData.value.department_id, (newVal, oldVal) => {
  console.log('🔍 Department ID changed:', { old: oldVal, new: newVal, type: typeof newVal })
})

watch(() => formData.value.position_id, (newVal, oldVal) => {
  console.log('🔍 Position ID changed:', { old: oldVal, new: newVal, type: typeof newVal })
})

// Options for dropdowns
const genderOptions = [
  { title: 'Laki-laki', value: 'MALE' },
  { title: 'Perempuan', value: 'FEMALE' },
]

const maritalStatusOptions = [
  { title: 'Belum Menikah', value: 'SINGLE' },
  { title: 'Menikah', value: 'MARRIED' },
  { title: 'Cerai', value: 'DIVORCED' },
  { title: 'Janda/Duda', value: 'WIDOWED' },
]

const contractTypeOptions = [
  { title: 'Permanen', value: 'PERMANENT' },
  { title: 'Kontrak', value: 'CONTRACT' },
  { title: 'Probation', value: 'PROBATION' },
  { title: 'Internship', value: 'INTERNSHIP' },
]

const employmentStatusOptions = [
  { title: 'Aktif', value: 'ACTIVE' },
  { title: 'Nonaktif', value: 'INACTIVE' },
  { title: 'Cuti', value: 'ON_LEAVE' },
  { title: 'Terminasi', value: 'TERMINATED' },
]

const emergencyContactRelationOptions = [
  { title: 'Suami', value: 'SUAMI' },
  { title: 'Istri', value: 'ISTRI' },
  { title: 'Anak', value: 'ANAK' },
  { title: 'Orang Tua', value: 'ORANG_TUA' },
  { title: 'Saudara Kandung', value: 'SAUDARA_KANDUNG' },
  { title: 'Kakek/Nenek', value: 'KAKEK_NENEK' },
  { title: 'Paman/Bibi', value: 'PAMAN_BIBI' },
  { title: 'Sepupu', value: 'SEPUPU' },
  { title: 'Teman', value: 'TEMAN' },
  { title: 'Tetangga', value: 'TETANGGA' },
  { title: 'Lainnya', value: 'LAINNYA' },
]

// Data for dropdowns
const departments = ref([])
const positions = ref([])
const loadingDepartments = ref(false)
const loadingPositions = ref(false)

// Functions
async function loadDepartments() {
  try {
    loadingDepartments.value = true

    const response = await $api('/hris/departments', {
      method: 'GET',
    })

    departments.value = response.data.map(dept => ({
      title: `${dept.name} (${dept.code})`,
      value: parseInt(dept.id),
      data: dept,
    }))
  } catch (error) {
    console.error('❌ Error loading departments:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Departemen',
      text: 'Tidak dapat memuat daftar departemen. Silakan coba lagi.',
    })
  } finally {
    loadingDepartments.value = false
  }
}

async function loadPositions() {
  try {
    loadingPositions.value = true

    const response = await $api('/hris/positions', {
      method: 'GET',
    })

    positions.value = response.data.map(pos => ({
      title: `${pos.title} (${pos.code})`,
      value: parseInt(pos.id),
      data: pos,
    }))
  } catch (error) {
    console.error('❌ Error loading positions:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Posisi',
      text: 'Tidak dapat memuat daftar posisi. Silakan coba lagi.',
    })
  } finally {
    loadingPositions.value = false
  }
}

async function handleSubmit() {
  console.log('🔍 Form data before validation:', formData.value)
  
  // Manual validation first
  if (!formData.value.department_id || formData.value.department_id === null) {
    console.log('❌ Department validation failed:', formData.value.department_id)
    await showErrorAlert(new Error('Departemen harus dipilih'), {
      title: 'Validasi Error',
      text: 'Departemen harus dipilih',
    })
    return
  }

  if (!formData.value.position_id || formData.value.position_id === null) {
    console.log('❌ Position validation failed:', formData.value.position_id)
    await showErrorAlert(new Error('Posisi harus dipilih'), {
      title: 'Validasi Error',
      text: 'Posisi harus dipilih',
    })
    return
  }

  if (!formData.value.hire_date) {
    console.log('❌ Hire date validation failed:', formData.value.hire_date)
    await showErrorAlert(new Error('Tanggal bergabung harus diisi'), {
      title: 'Validasi Error',
      text: 'Tanggal bergabung harus diisi',
    })
    return
  }

  console.log('✅ All validations passed')
  console.log('🔍 Department ID:', formData.value.department_id, 'Type:', typeof formData.value.department_id)
  console.log('🔍 Position ID:', formData.value.position_id, 'Type:', typeof formData.value.position_id)

  // Then validate form
  if (!formRef.value?.validate()) return

  loading.value = true

  try {
    console.log('📤 Submitting employee data:', formData.value)

    // Create a clean submit data object
    const submitData = {
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone || undefined,
      address: formData.value.address || undefined,
      birth_date: formData.value.birth_date ? new Date(formData.value.birth_date).toISOString().split('T')[0] : undefined,
      gender: formData.value.gender || undefined,
      marital_status: formData.value.marital_status || undefined,
      department_id: parseInt(formData.value.department_id),
      position_id: parseInt(formData.value.position_id),
      hire_date: new Date(formData.value.hire_date).toISOString(),
      contract_type: formData.value.contract_type || undefined,
      employment_status: formData.value.employment_status || undefined,
      termination_date: formData.value.termination_date ? new Date(formData.value.termination_date).toISOString() : undefined,
      salary: formData.value.salary ? formData.value.salary.toString() : undefined,
      annual_leave_quota: formData.value.annual_leave_quota ? parseInt(formData.value.annual_leave_quota) : undefined,
      sick_leave_quota: formData.value.sick_leave_quota ? parseInt(formData.value.sick_leave_quota) : undefined,
      emergency_contact_name: formData.value.emergency_contact_name || undefined,
      emergency_contact_phone: formData.value.emergency_contact_phone || undefined,
      emergency_contact_relation: formData.value.emergency_contact_relation || undefined,
      notes: formData.value.notes || undefined,
    }

    // Remove undefined values
    Object.keys(submitData).forEach(key => {
      if (submitData[key] === undefined) {
        delete submitData[key]
      }
    })

    console.log('📤 Final submit data:', submitData)

    const res = await $api('/hris/employees', {
      method: 'POST',
      body: submitData,
    })

    console.log('📥 API Response:', res)

    // Show success message and redirect
    await showSuccessAlert('Karyawan berhasil ditambahkan', 'Berhasil!')

    // Redirect to employees list
    router.push({ name: 'hris-employees' })
  } catch (error) {
    console.error('❌ Error creating employee:', error)
    await showErrorAlert(error, {
      title: 'Gagal Menambahkan Karyawan',
      text: 'Tidak dapat menambahkan karyawan. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
  }
}

// Load data on mount
onMounted(async () => {
  await Promise.all([
    loadDepartments(),
    loadPositions(),
  ])
})
</script>

<style scoped>
.v-form {
  max-width: 100%;
}

.v-text-field,
.v-textarea,
.v-select {
  width: 100%;
}
</style> 
