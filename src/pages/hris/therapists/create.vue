<route lang="yaml">
meta:
  layout: default
  navActiveLink: hris-therapists
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
          tabler-user-star
        </VIcon>
        <div>
          <h2 class="text-h5 mb-1">
            Tambah Terapis Baru
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Tambahkan terapis baru ke sistem
          </p>
        </div>
      </div>
      <VBtn
        variant="text"
        color="secondary"
        prepend-icon="tabler-arrow-left"
        :to="{ name: 'hris-therapists' }"
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
              ID Terapis
            </label>
            <VTextField
              v-model="formData.therapist_id"
              placeholder="Contoh: THP001"
              variant="outlined"
              maxlength="20"
              :rules="[
                v => !!v || 'ID terapis harus diisi',
                v => v.length <= 20 || 'ID maksimal 20 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Nama Terapis
            </label>
            <VTextField
              v-model="formData.name"
              placeholder="Masukkan nama terapis"
              variant="outlined"
              maxlength="100"
              :rules="[
                v => !!v || 'Nama terapis harus diisi',
                v => v.length <= 100 || 'Nama maksimal 100 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Spesialisasi
            </label>
            <VSelect
              v-model="formData.specialization"
              :items="specializationOptions"
              variant="outlined"
              placeholder="Pilih spesialisasi"
              :rules="[v => !!v || 'Spesialisasi harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Nomor Lisensi
            </label>
            <VTextField
              v-model="formData.license_number"
              placeholder="Masukkan nomor lisensi"
              variant="outlined"
              maxlength="50"
              :rules="[
                v => !!v || 'Nomor lisensi harus diisi',
                v => v.length <= 50 || 'Nomor lisensi maksimal 50 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Level Sertifikasi
            </label>
            <VSelect
              v-model="formData.certification_level"
              :items="certificationLevelOptions"
              variant="outlined"
              placeholder="Pilih level sertifikasi"
              :rules="[v => !!v || 'Level sertifikasi harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Pengalaman (Tahun)
            </label>
            <VTextField
              v-model.number="formData.experience_years"
              type="number"
              placeholder="5"
              variant="outlined"
              min="0"
              max="50"
              :rules="[
                v => v !== null && v !== undefined || 'Pengalaman harus diisi',
                v => v >= 0 || 'Pengalaman minimal 0 tahun',
                v => v <= 50 || 'Pengalaman maksimal 50 tahun'
              ]"
              required
              hide-details
            />
          </VCol>

          <!-- Contact Information -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Informasi Kontak
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Telepon
            </label>
            <VTextField
              v-model="formData.phone"
              placeholder="Masukkan nomor telepon"
              variant="outlined"
              maxlength="20"
              :rules="[
                v => !!v || 'Nomor telepon harus diisi',
                v => v.length <= 20 || 'Nomor telepon maksimal 20 karakter'
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

          <VCol cols="12">
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
                v => !!v || 'Alamat harus diisi',
                v => v.length <= 500 || 'Alamat maksimal 500 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <!-- Personal Information -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Informasi Pribadi
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tanggal Lahir
            </label>
            <VTextField
              v-model="formData.birth_date"
              type="date"
              variant="outlined"
              :rules="[v => !!v || 'Tanggal lahir harus diisi']"
              required
              hide-details
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
              Departemen
            </label>
            <VTextField
              v-model="formData.department"
              placeholder="Masukkan departemen"
              variant="outlined"
              maxlength="100"
              :rules="[
                v => !!v || 'Departemen harus diisi',
                v => v.length <= 100 || 'Departemen maksimal 100 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Preferensi Shift
            </label>
            <VSelect
              v-model="formData.shift_preference"
              :items="shiftPreferenceOptions"
              variant="outlined"
              placeholder="Pilih preferensi shift"
              :rules="[v => !!v || 'Preferensi shift harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <!-- Professional Information -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Informasi Profesional
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Gaji
            </label>
            <VTextField
              v-model.number="formData.salary"
              type="number"
              placeholder="5000000"
              variant="outlined"
              min="0"
              :rules="[
                v => v !== null && v !== undefined || 'Gaji harus diisi',
                v => v >= 0 || 'Gaji tidak boleh negatif'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Cabang
            </label>
            <VAutocomplete
              v-model="formData.branch_id"
              :items="branchOptions"
              variant="outlined"
              placeholder="Cari dan pilih cabang..."
              :rules="[v => !!v || 'Cabang harus dipilih']"
              required
              hide-details
              :loading="loadingBranches"
              clearable
              filterable
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Karyawan (Opsional)
            </label>
            <VAutocomplete
              v-model="formData.employee_id"
              :items="employeeOptions"
              variant="outlined"
              placeholder="Cari dan pilih karyawan..."
              hide-details
              :loading="loadingEmployees"
              clearable
              filterable
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Status Aktif
            </label>
            <VSelect
              v-model="formData.is_active"
              :items="activeOptions"
              variant="outlined"
              placeholder="Pilih status"
              :rules="[v => v !== null && v !== undefined || 'Status harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Status Tersedia
            </label>
            <VSelect
              v-model="formData.is_available"
              :items="availableOptions"
              variant="outlined"
              placeholder="Pilih status"
              :rules="[v => v !== null && v !== undefined || 'Status tersedia harus dipilih']"
              required
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
              v-model="formData.emergency_contact.name"
              placeholder="Masukkan nama kontak darurat"
              variant="outlined"
              maxlength="100"
              :rules="[
                v => !!v || 'Nama kontak darurat harus diisi',
                v => v.length <= 100 || 'Nama maksimal 100 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Telepon Kontak Darurat
            </label>
            <VTextField
              v-model="formData.emergency_contact.phone"
              placeholder="Masukkan nomor telepon"
              variant="outlined"
              maxlength="20"
              :rules="[
                v => !!v || 'Nomor telepon kontak darurat harus diisi',
                v => v.length <= 20 || 'Nomor telepon maksimal 20 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Hubungan dengan Kontak Darurat
            </label>
            <VSelect
              v-model="formData.emergency_contact.relationship"
              :items="emergencyContactRelationOptions"
              variant="outlined"
              placeholder="Pilih hubungan dengan kontak darurat"
              :rules="[v => !!v || 'Hubungan harus dipilih']"
              required
              clearable
              hide-details
            />
          </VCol>

          <VCol cols="12">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Catatan
            </label>
            <VTextarea
              v-model="formData.notes"
              placeholder="Masukkan catatan tambahan"
              variant="outlined"
              rows="3"
              maxlength="1000"
              :rules="[
                v => v.length <= 1000 || 'Catatan maksimal 1000 karakter'
              ]"
              hide-details
            />
          </VCol>
        </VRow>

        <!-- Action Buttons -->
        <VDivider class="my-6" />
        <div class="d-flex gap-3 justify-end">
          <VBtn
            variant="outlined"
            color="secondary"
            :to="{ name: 'hris-therapists' }"
          >
            Batal
          </VBtn>
          <VBtn
            color="primary"
            :loading="loading"
            :disabled="!isFormValid"
            @click="handleSubmit"
          >
            Simpan
          </VBtn>
        </div>
      </VForm>
    </VCardText>
  </VCard>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert, showSuccessAlert } from '@/utils/errorHandler'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

// Router
const router = useRouter()

// Form
const formRef = ref()
const isFormValid = ref(false)
const loading = ref(false)
const loadingBranches = ref(false)
const loadingEmployees = ref(false)

// Form Data
const formData = reactive({
  therapist_id: '',
  license_number: '',
  name: '',
  email: '',
  specialization: '',
  certification_level: '',
  experience_years: 0,
  phone: '',
  emergency_contact: {
    name: '',
    phone: '',
    relationship: ''
  },
  address: '',
  birth_date: '',
  hire_date: '',
  department: '',
  shift_preference: '',
  salary: 0,
  employee_id: '',
  branch_id: '',
  notes: '',
  is_active: true,
  is_available: true
})

// Options
const specializationOptions = [
  { title: 'Estetika', value: 'AESTHETIC' },
  { title: 'Umum', value: 'GENERAL' },
  { title: 'Dermatologi', value: 'DERMATOLOGY' },
  { title: 'Bedah', value: 'SURGICAL' },
  { title: 'Darurat', value: 'EMERGENCY' },
  { title: 'Pediatri', value: 'PEDIATRIC' }
]

const certificationLevelOptions = [
  { title: 'Diploma', value: 'DIPLOMA' },
  { title: 'Sarjana', value: 'BACHELOR' },
  { title: 'Magister', value: 'MASTER' }
]

const shiftPreferenceOptions = [
  { title: 'Pagi', value: 'MORNING' },
  { title: 'Siang', value: 'AFTERNOON' },
  { title: 'Malam', value: 'NIGHT' },
  { title: 'Fleksibel', value: 'FLEXIBLE' }
]

const activeOptions = [
  { title: 'Aktif', value: true },
  { title: 'Nonaktif', value: false }
]

const availableOptions = [
  { title: 'Tersedia', value: true },
  { title: 'Tidak Tersedia', value: false }
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

const branchOptions = ref([])
const employeeOptions = ref([])

// Methods
const fetchBranches = async () => {
  loadingBranches.value = true
  console.log('🔄 Starting fetchBranches...')
  
  try {
    const res = await $api('/wms/branches', {
      method: 'GET',
    })
    
    console.log('📥 Branches API Response:', res)
    
    if (res && res.response_code === 200) {
      branchOptions.value = res.data.map(branch => ({
        title: `${branch.name} (${branch.code})`,
        value: branch.id
      }))
    } else {
      branchOptions.value = []
    }
  } catch (error) {
    console.error('❌ Error fetching branches:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Cabang',
      text: 'Tidak dapat memuat data cabang. Silakan coba lagi.',
    })
    branchOptions.value = []
  } finally {
    loadingBranches.value = false
    console.log('🏁 fetchBranches completed')
  }
}

const fetchEmployees = async () => {
  loadingEmployees.value = true
  console.log('🔄 Starting fetchEmployees...')
  
  try {
    const res = await $api('/hris/employees', {
      method: 'GET',
    })
    
    console.log('📥 Employees API Response:', res)
    
    if (res && res.response_code === 200) {
      employeeOptions.value = res.data.map(employee => ({
        title: `${employee.name} (${employee.email})`,
        value: employee.id
      }))
    } else {
      employeeOptions.value = []
    }
  } catch (error) {
    console.error('❌ Error fetching employees:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Karyawan',
      text: 'Tidak dapat memuat data karyawan. Silakan coba lagi.',
    })
    employeeOptions.value = []
  } finally {
    loadingEmployees.value = false
    console.log('🏁 fetchEmployees completed')
  }
}

const handleSubmit = async () => {
  if (!formRef.value.validate()) return

  loading.value = true
  console.log('🔄 Starting submit...')
  
  try {
    // Prepare data for submission
    const submitData = { ...formData }
    
    // Handle employee_id - send null if empty
    if (!submitData.employee_id || submitData.employee_id === '') {
      submitData.employee_id = null
    } else {
      // employee_id is already a number from select
      submitData.employee_id = parseInt(submitData.employee_id)
    }
    
    console.log('📤 Submit data:', submitData)
    
    const res = await $api('/hris/therapists', {
      method: 'POST',
      body: submitData,
    })
    
    console.log('📥 API Response:', res)
    
    if (res && res.response_code === 200) {
      await showSuccessAlert({
        title: 'Berhasil',
        text: 'Terapis berhasil ditambahkan',
      })
      
      // Redirect to index page
      router.push({ name: 'hris-therapists' })
    } else {
      throw new Error('Failed to create therapist')
    }
  } catch (error) {
    console.error('❌ Error creating therapist:', error)
    await showErrorAlert(error, {
      title: 'Gagal Menambahkan Terapis',
      text: 'Tidak dapat menambahkan terapis. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
    console.log('🏁 Submit completed')
  }
}

// Lifecycle
onMounted(() => {
  console.log('🚀 Component onMounted triggered')
  fetchBranches()
  fetchEmployees()
})
</script> 
