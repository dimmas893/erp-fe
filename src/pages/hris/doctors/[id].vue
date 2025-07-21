<route lang="yaml">
meta:
  layout: default
  navActiveLink: hris-doctors
</route>

<template>
  <VCard>
    <VProgressLinear
      v-if="loading"
      indeterminate
      color="primary"
    />

    <VCardText v-if="loading">
      <!-- Loading skeleton -->
      <div class="d-flex align-center gap-4 mb-6">
        <VSkeleton
          type="avatar"
          size="72"
        />
        <div class="flex-grow-1">
          <VSkeleton
            type="heading"
            class="mb-2"
          />
          <VSkeleton
            type="chip"
            width="80"
          />
        </div>
      </div>
      
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VSkeletonLoader type="list-item-two-line@8" />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VSkeletonLoader type="list-item-two-line@8" />
        </VCol>
      </VRow>
    </VCardText>

    <VCardText v-else-if="doctor">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center gap-4">
          <VAvatar
            size="72"
            color="primary"
          >
            <VIcon size="40">
              tabler-user-md
            </VIcon>
          </VAvatar>
          <div class="flex-grow-1">
            <h2 class="text-h4 font-weight-bold mb-1">
              {{ doctor.name }}
            </h2>
            <div class="d-flex align-center gap-2">
              <VChip
                color="primary"
                size="small"
                variant="outlined"
              >
                {{ doctor.doctor_code }}
              </VChip>
              <VChip
                :color="doctor.is_active ? 'success' : 'error'"
                size="small"
              >
                {{ doctor.is_active ? 'Aktif' : 'Nonaktif' }}
              </VChip>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="d-flex gap-2">
          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="tabler-arrow-left"
            :to="{ name: 'hris-doctors' }"
          >
            Kembali
          </VBtn>
        </div>
      </div>

      <!-- Basic Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-info-circle
        </VIcon>
        Informasi Dasar
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Nama Dokter
            </div>
            <div class="text-h6 font-weight-medium">
              {{ doctor.name }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kode Dokter
            </div>
            <div class="text-h6 font-weight-medium">
              {{ doctor.doctor_code }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Spesialisasi
            </div>
            <div class="text-body-1">
              {{ doctor.specialization }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Nomor Lisensi
            </div>
            <div class="text-body-1">
              {{ doctor.license_number }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status
            </div>
            <VChip
              :color="doctor.is_active ? 'success' : 'error'"
              size="small"
              variant="tonal"
            >
              {{ doctor.is_active ? 'Aktif' : 'Nonaktif' }}
            </VChip>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Gender
            </div>
            <VChip
              :color="getGenderColor(doctor.gender)"
              size="small"
              variant="tonal"
            >
              {{ getGenderLabel(doctor.gender) }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Pengalaman
            </div>
            <VChip
              color="warning"
              size="small"
              variant="tonal"
            >
              {{ doctor.experience_years }} tahun
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Biaya Konsultasi
            </div>
            <VChip
              color="success"
              size="small"
              variant="tonal"
            >
              {{ formatCurrency(doctor.consultation_fee) }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Cabang
            </div>
            <div class="text-body-1">
              {{ branchName || '-' }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Karyawan
            </div>
            <div class="text-body-1">
              {{ employeeName || '-' }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Bergabung
            </div>
            <div class="text-body-1">
              {{ doctor.join_date ? formatDate(doctor.join_date) : '-' }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Contact Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-phone
        </VIcon>
        Informasi Kontak
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Telepon
            </div>
            <div class="text-body-1">
              {{ doctor.phone }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Email
            </div>
            <div class="text-body-1">
              {{ doctor.email }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Alamat
            </div>
            <div class="text-body-1">
              {{ doctor.address }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Personal Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-user
        </VIcon>
        Informasi Pribadi
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Lahir
            </div>
            <div class="text-body-1">
              {{ doctor.birth_date ? formatDate(doctor.birth_date) : '-' }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Pendidikan
            </div>
            <div class="text-body-1">
              {{ doctor.education }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Additional Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-notes
        </VIcon>
        Informasi Tambahan
      </h3>
      
      <VRow class="mb-6">
        <VCol cols="12">
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Catatan
            </div>
            <div class="text-body-1">
              {{ doctor.notes || '-' }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Timestamps -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-clock
        </VIcon>
        Informasi Waktu
      </h3>
      
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Dibuat
            </div>
            <div class="text-body-1">
              {{ doctor.created_at ? formatDateTime(doctor.created_at) : '-' }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Diperbarui
            </div>
            <div class="text-body-1">
              {{ doctor.updated_at ? formatDateTime(doctor.updated_at) : '-' }}
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>

    <VCardText v-else>
      <!-- Not Found -->
      <div class="text-center py-12">
        <VIcon
          size="64"
          color="error"
          class="mb-4"
        >
          tabler-alert-circle
        </VIcon>
        <h3 class="text-h6 mb-2">
          Data tidak ditemukan
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Dokter yang Anda cari tidak ditemukan atau telah dihapus
        </p>
        <VBtn
          color="primary"
          variant="tonal"
          :to="{ name: 'hris-doctors' }"
        >
          Kembali ke Daftar
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert } from '@/utils/errorHandler'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Route
const route = useRoute()

// Data
const doctor = ref(null)
const loading = ref(false)
const branchName = ref('')
const employeeName = ref('')

// Methods
const fetchDoctor = async () => {
  loading.value = true
  console.log('🔄 Starting fetchDoctor...')
  
  try {
    const res = await $api(`/hris/doctors/${route.params.id}`, {
      method: 'GET',
    })
    
    console.log('📥 API Response:', res)
    
    if (res && res.response_code === 200) {
      doctor.value = res.data
      
      // Fetch branch name if branch_id exists
      if (doctor.value.branch_id) {
        await fetchBranchName(doctor.value.branch_id)
      }
      
      // Fetch employee name if employee_id exists
      if (doctor.value.employee_id) {
        await fetchEmployeeName(doctor.value.employee_id)
      }
    } else {
      doctor.value = null
    }
  } catch (error) {
    console.error('❌ Error fetching doctor:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Dokter',
      text: 'Tidak dapat memuat data dokter. Silakan coba lagi.',
    })
    doctor.value = null
  } finally {
    loading.value = false
    console.log('🏁 fetchDoctor completed')
  }
}

const fetchBranchName = async (branchId) => {
  try {
    const res = await $api('/wms/branches', {
      method: 'GET',
    })
    
    if (res && res.response_code === 200) {
      const branch = res.data.find(b => b.id === branchId)
      if (branch) {
        branchName.value = `${branch.name} (${branch.code})`
      } else {
        branchName.value = 'Cabang tidak ditemukan'
      }
    }
  } catch (error) {
    console.error('❌ Error fetching branch name:', error)
    branchName.value = 'Gagal memuat nama cabang'
  }
}

const fetchEmployeeName = async (employeeId) => {
  try {
    const res = await $api('/hris/employees', {
      method: 'GET',
    })
    
    if (res && res.response_code === 200) {
      const employee = res.data.find(e => e.id === employeeId)
      if (employee) {
        employeeName.value = `${employee.name} (${employee.email})`
      } else {
        employeeName.value = 'Karyawan tidak ditemukan'
      }
    }
  } catch (error) {
    console.error('❌ Error fetching employee name:', error)
    employeeName.value = 'Gagal memuat nama karyawan'
  }
}

const getGenderColor = (gender) => {
  switch (gender) {
    case 'L':
      return 'info'
    case 'P':
      return 'warning'
    default:
      return 'default'
  }
}

const getGenderLabel = (gender) => {
  switch (gender) {
    case 'L':
      return 'Pria'
    case 'P':
      return 'Wanita'
    default:
      return gender
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleDateString('id-ID')
}

function formatCurrency(amount) {
  if (!amount) return '-'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Lifecycle
onMounted(() => {
  console.log('🚀 Component onMounted triggered')
  fetchDoctor()
})
</script> 
