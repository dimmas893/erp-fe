<route lang="yaml">
meta:
  layout: default
  navActiveLink: hris-employees
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

    <VCardText v-else-if="employee">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center gap-4">
          <VAvatar
            size="72"
            color="primary"
          >
            <VIcon size="40">
              tabler-users
            </VIcon>
          </VAvatar>
          <div class="flex-grow-1">
            <h2 class="text-h4 font-weight-bold mb-1">
              {{ employee.name }}
            </h2>
            <div class="d-flex align-center gap-2">
              <VChip
                color="primary"
                size="small"
                variant="outlined"
              >
                {{ employee.email }}
              </VChip>
              <VChip
                :color="getEmploymentStatusColor(employee.employment_status)"
                size="small"
              >
                {{ getEmploymentStatusLabel(employee.employment_status) }}
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
            :to="{ name: 'hris-employees' }"
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
              Nama Lengkap
            </div>
            <div class="text-h6 font-weight-medium">
              {{ employee.name }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Email
            </div>
            <div class="text-h6 font-weight-medium">
              {{ employee.email }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Nomor Telepon
            </div>
            <div class="text-h6 font-weight-medium">
              {{ employee.phone }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Alamat
            </div>
            <div class="text-h6 font-weight-medium">
              {{ employee.address }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Lahir
            </div>
            <div class="text-h6 font-weight-medium">
              {{ formatDate(employee.birth_date) }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Jenis Kelamin
            </div>
            <VChip
              color="info"
              size="small"
              variant="tonal"
            >
              {{ getGenderLabel(employee.gender) }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status Pernikahan
            </div>
            <VChip
              color="warning"
              size="small"
              variant="tonal"
            >
              {{ getMaritalStatusLabel(employee.marital_status) }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status Karyawan
            </div>
            <VChip
              :color="getEmploymentStatusColor(employee.employment_status)"
              size="small"
              variant="tonal"
            >
              {{ getEmploymentStatusLabel(employee.employment_status) }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tipe Kontrak
            </div>
            <VChip
              :color="getContractTypeColor(employee.contract_type)"
              size="small"
              variant="tonal"
            >
              {{ getContractTypeLabel(employee.contract_type) }}
            </VChip>
          </div>
        </VCol>
      </VRow>

      <!-- Employment Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-briefcase
        </VIcon>
        Informasi Pekerjaan
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Departemen
            </div>
            <div v-if="employee.department" class="d-flex align-center gap-2">
              <VChip
                color="primary"
                size="small"
                variant="tonal"
              >
                {{ employee.department.code }}
              </VChip>
              <span class="text-h6 font-weight-medium">{{ employee.department.name }}</span>
            </div>
            <span v-else class="text-medium-emphasis">-</span>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Posisi
            </div>
            <div v-if="employee.position" class="d-flex align-center gap-2">
              <VChip
                color="success"
                size="small"
                variant="tonal"
              >
                {{ employee.position.code }}
              </VChip>
              <span class="text-h6 font-weight-medium">{{ employee.position.title }}</span>
            </div>
            <span v-else class="text-medium-emphasis">-</span>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Bergabung
            </div>
            <div class="text-h6 font-weight-medium">
              {{ formatDateTime(employee.hire_date) }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Gaji
            </div>
            <div class="text-h6 font-weight-medium">
              {{ formatCurrency(employee.salary) }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kuota Cuti Tahunan
            </div>
            <div class="text-h6 font-weight-medium">
              {{ employee.annual_leave_quota }} hari
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kuota Cuti Sakit
            </div>
            <div class="text-h6 font-weight-medium">
              {{ employee.sick_leave_quota }} hari
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Dibuat
            </div>
            <div class="text-h6 font-weight-medium">
              {{ formatDateTime(employee.created_at) }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Diperbarui
            </div>
            <div class="text-h6 font-weight-medium">
              {{ formatDateTime(employee.updated_at) }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Emergency Contact -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-phone
        </VIcon>
        Kontak Darurat
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Nama Kontak Darurat
            </div>
            <div class="text-h6 font-weight-medium">
              {{ employee.emergency_contact_name }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Nomor Telepon Kontak Darurat
            </div>
            <div class="text-h6 font-weight-medium">
              {{ employee.emergency_contact_phone }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Hubungan dengan Kontak Darurat
            </div>
            <div class="text-h6 font-weight-medium">
              {{ employee.emergency_contact_relation }}
            </div>
          </div>
          
          <div class="mb-4" v-if="employee.notes">
            <div class="text-medium-emphasis mb-1">
              Catatan Tambahan
            </div>
            <div class="text-h6 font-weight-medium">
              {{ employee.notes }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Action Buttons -->
      <VDivider class="my-6" />
      <div class="d-flex gap-3 justify-end">
        <VBtn
          variant="outlined"
          color="secondary"
          :to="{ name: 'hris-employees' }"
        >
          Kembali ke Daftar
        </VBtn>
      </div>
    </VCardText>

    <!-- Error State -->
    <VCardText v-else>
      <div class="text-center py-12">
        <VIcon
          size="64"
          color="error"
          class="mb-4"
        >
          tabler-alert-circle
        </VIcon>
        <h3 class="text-h6 mb-2">
          Karyawan tidak ditemukan
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Karyawan yang Anda cari tidak ditemukan atau telah dihapus.
        </p>
        <VBtn
          color="primary"
          variant="tonal"
          :to="{ name: 'hris-employees' }"
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

const route = useRoute()

// State
const loading = ref(true)
const employee = ref(null)

// Functions
async function fetchEmployee() {
  loading.value = true
  
  try {
    console.log('🔄 Fetching employee with ID:', route.params.id)
    
    const res = await $api(`/hris/employees/${route.params.id}`, {
      method: 'GET',
    })
    
    console.log('📥 API Response:', res)
    
    if (res.data) {
      employee.value = res.data
    } else {
      employee.value = null
    }
    
    console.log('✅ Employee loaded:', employee.value)
  } catch (error) {
    console.error('❌ Error fetching employee:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Karyawan',
      text: 'Tidak dapat memuat data karyawan. Silakan coba lagi.',
    })
    employee.value = null
  } finally {
    loading.value = false
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
  }).format(amount)
}

function getGenderLabel(gender) {
  switch (gender) {
  case 'MALE': return 'Laki-laki'
  case 'FEMALE': return 'Perempuan'
  default: return gender
  }
}

function getMaritalStatusLabel(status) {
  switch (status) {
  case 'SINGLE': return 'Belum Menikah'
  case 'MARRIED': return 'Menikah'
  case 'DIVORCED': return 'Cerai'
  case 'WIDOWED': return 'Janda/Duda'
  default: return status
  }
}

function getEmploymentStatusColor(status) {
  switch (status) {
  case 'ACTIVE': return 'success'
  case 'INACTIVE': return 'error'
  case 'ON_LEAVE': return 'warning'
  case 'TERMINATED': return 'error'
  default: return 'secondary'
  }
}

function getEmploymentStatusLabel(status) {
  switch (status) {
  case 'ACTIVE': return 'Aktif'
  case 'INACTIVE': return 'Nonaktif'
  case 'ON_LEAVE': return 'Cuti'
  case 'TERMINATED': return 'Terminasi'
  default: return status
  }
}

function getContractTypeColor(type) {
  switch (type) {
  case 'PERMANENT': return 'success'
  case 'CONTRACT': return 'warning'
  case 'PROBATION': return 'info'
  case 'INTERNSHIP': return 'secondary'
  default: return 'secondary'
  }
}

function getContractTypeLabel(type) {
  switch (type) {
  case 'PERMANENT': return 'Permanen'
  case 'CONTRACT': return 'Kontrak'
  case 'PROBATION': return 'Probation'
  case 'INTERNSHIP': return 'Internship'
  default: return type
  }
}

// Initialize
onMounted(() => {
  console.log('🚀 Component onMounted triggered')
  fetchEmployee()
})
</script>

<style scoped>
.v-card-text {
  padding: 24px;
}

.v-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.text-medium-emphasis {
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.font-weight-medium {
  font-weight: 500;
}

.font-weight-bold {
  font-weight: 700;
}
</style> 
