<route lang="yaml">
meta:
  layout: default
  navActiveLink: hris-doctors
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
          tabler-user-md
        </VIcon>
        <div>
          <h2 class="text-h5 mb-1">
            Tambah Dokter Baru
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Tambahkan dokter baru ke sistem
          </p>
        </div>
      </div>
      <VBtn
        variant="text"
        color="secondary"
        prepend-icon="tabler-arrow-left"
        :to="{ name: 'hris-doctors' }"
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
              Nama Dokter
            </label>
            <VTextField
              v-model="formData.name"
              placeholder="Masukkan nama dokter"
              variant="outlined"
              maxlength="100"
              :rules="[
                v => !!v || 'Nama dokter harus diisi',
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
            <VTextField
              v-model="formData.specialization"
              placeholder="Masukkan spesialisasi"
              variant="outlined"
              maxlength="100"
              :rules="[
                v => !!v || 'Spesialisasi harus diisi',
                v => v.length <= 100 || 'Spesialisasi maksimal 100 karakter'
              ]"
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
              Gender
            </label>
            <VSelect
              v-model="formData.gender"
              :items="genderOptions"
              variant="outlined"
              placeholder="Pilih gender"
              :rules="[v => !!v || 'Gender harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Pendidikan
            </label>
            <VTextarea
              v-model="formData.education"
              placeholder="Masukkan riwayat pendidikan"
              variant="outlined"
              rows="3"
              maxlength="500"
              :rules="[
                v => !!v || 'Pendidikan harus diisi',
                v => v.length <= 500 || 'Pendidikan maksimal 500 karakter'
              ]"
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

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Biaya Konsultasi
            </label>
            <VTextField
              v-model.number="formData.consultation_fee"
              type="number"
              placeholder="150000"
              variant="outlined"
              min="0"
              :rules="[
                v => v !== null && v !== undefined || 'Biaya konsultasi harus diisi',
                v => v >= 0 || 'Biaya konsultasi tidak boleh negatif'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tanggal Bergabung
            </label>
            <VTextField
              v-model="formData.join_date"
              type="date"
              variant="outlined"
              :rules="[v => !!v || 'Tanggal bergabung harus diisi']"
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
            :to="{ name: 'hris-doctors' }"
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
  name: '',
  specialization: '',
  license_number: '',
  phone: '',
  email: '',
  address: '',
  birth_date: '',
  gender: '',
  education: '',
  experience_years: 0,
  consultation_fee: 0,
  is_active: true,
  join_date: '',
  branch_id: '',
  employee_id: '',
  notes: ''
})

// Options
const genderOptions = [
  { title: 'Pria', value: 'L' },
  { title: 'Wanita', value: 'P' }
]

const activeOptions = [
  { title: 'Aktif', value: true },
  { title: 'Nonaktif', value: false }
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
    
    const res = await $api('/hris/doctors', {
      method: 'POST',
      body: submitData,
    })
    
    console.log('📥 API Response:', res)
    
    if (res && res.response_code === 200) {
      await showSuccessAlert({
        title: 'Berhasil',
        text: 'Dokter berhasil ditambahkan',
      })
      
      // Redirect to index page
      router.push({ name: 'hris-doctors' })
    } else {
      throw new Error('Failed to create doctor')
    }
  } catch (error) {
    console.error('❌ Error creating doctor:', error)
    await showErrorAlert(error, {
      title: 'Gagal Menambahkan Dokter',
      text: 'Tidak dapat menambahkan dokter. Silakan coba lagi.',
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
