<route lang="yaml">
meta:
  layout: default
  navActiveLink: hris-therapists
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

    <VCardText v-else-if="therapist">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center gap-4">
          <VAvatar
            size="72"
            color="primary"
          >
            <VIcon size="40">
              tabler-user-star
            </VIcon>
          </VAvatar>
          <div class="flex-grow-1">
            <h2 class="text-h4 font-weight-bold mb-1">
              {{ therapist.name }}
            </h2>
            <div class="d-flex align-center gap-2">
              <VChip
                color="primary"
                size="small"
                variant="outlined"
              >
                {{ therapist.therapist_id }}
              </VChip>
              <VChip
                :color="therapist.is_active ? 'success' : 'error'"
                size="small"
              >
                {{ therapist.is_active ? 'Aktif' : 'Nonaktif' }}
              </VChip>
              <VChip
                :color="therapist.is_available ? 'success' : 'warning'"
                size="small"
              >
                {{ therapist.is_available ? 'Tersedia' : 'Tidak Tersedia' }}
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
            :to="{ name: 'hris-therapists' }"
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
              Nama Terapis
            </div>
            <div class="text-h6 font-weight-medium">
              {{ therapist.name }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              ID Terapis
            </div>
            <div class="text-h6 font-weight-medium">
              {{ therapist.therapist_id }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Spesialisasi
            </div>
            <div class="text-body-1">
              {{ therapist.specialization }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Nomor Lisensi
            </div>
            <div class="text-body-1">
              {{ therapist.license_number }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Level Sertifikasi
            </div>
            <VChip
              :color="getCertificationColor(therapist.certification_level)"
              size="small"
              variant="tonal"
            >
              {{ therapist.certification_level }}
            </VChip>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Pengalaman
            </div>
            <VChip
              color="warning"
              size="small"
              variant="tonal"
            >
              {{ therapist.experience_years }} tahun
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Gaji
            </div>
            <VChip
              color="success"
              size="small"
              variant="tonal"
            >
              {{ formatCurrency(therapist.salary) }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Departemen
            </div>
            <div class="text-body-1">
              {{ therapist.department }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Preferensi Shift
            </div>
            <VChip
              color="info"
              size="small"
              variant="tonal"
            >
              {{ therapist.shift_preference }}
            </VChip>
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
              {{ therapist.phone }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Email
            </div>
            <div class="text-body-1">
              {{ therapist.email }}
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
              {{ therapist.address }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Emergency Contact -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-alert-circle
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
            <div class="text-body-1">
              {{ therapist.emergency_contact?.name || '-' }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Telepon Kontak Darurat
            </div>
            <div class="text-body-1">
              {{ therapist.emergency_contact?.phone || '-' }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Hubungan
            </div>
            <div class="text-body-1">
              {{ therapist.emergency_contact?.relationship || '-' }}
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
              {{ therapist.birth_date ? formatDate(therapist.birth_date) : '-' }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Bergabung
            </div>
            <div class="text-body-1">
              {{ therapist.hire_date ? formatDate(therapist.hire_date) : '-' }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Professional Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-briefcase
        </VIcon>
        Informasi Profesional
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
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
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status Aktif
            </div>
            <VChip
              :color="therapist.is_active ? 'success' : 'error'"
              size="small"
              variant="tonal"
            >
              {{ therapist.is_active ? 'Aktif' : 'Nonaktif' }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status Tersedia
            </div>
            <VChip
              :color="therapist.is_available ? 'success' : 'warning'"
              size="small"
              variant="tonal"
            >
              {{ therapist.is_available ? 'Tersedia' : 'Tidak Tersedia' }}
            </VChip>
          </div>
        </VCol>
      </VRow>

      <!-- Skills -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-award
        </VIcon>
        Keahlian
      </h3>
      
      <VRow class="mb-6">
        <VCol cols="12">
          <div class="mb-4">
            <div class="text-medium-emphasis mb-2">
              Skills
            </div>
            <div class="d-flex flex-wrap gap-1">
              <VChip
                v-for="skill in therapist.skills"
                :key="skill"
                color="info"
                size="small"
                variant="tonal"
              >
                {{ skill }}
              </VChip>
              <span v-if="!therapist.skills || therapist.skills.length === 0" class="text-medium-emphasis">
                Tidak ada skills
              </span>
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Certifications -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-certificate
        </VIcon>
        Sertifikasi
      </h3>
      
      <VRow class="mb-6">
        <VCol cols="12">
          <div class="mb-4">
            <div class="text-medium-emphasis mb-2">
              Certifications
            </div>
            <div v-if="therapist.certifications && therapist.certifications.length > 0">
              <div
                v-for="cert in therapist.certifications"
                :key="cert.name"
                class="mb-3 pa-3 border rounded"
              >
                <div class="font-weight-medium">{{ cert.name }}</div>
                <div class="text-body-2 text-medium-emphasis">
                  Date: {{ cert.date ? formatDate(cert.date) : '-' }} | 
                  Expiry: {{ cert.expiry ? formatDate(cert.expiry) : '-' }} | 
                  Issuer: {{ cert.issuer || '-' }}
                </div>
              </div>
            </div>
            <span v-else class="text-medium-emphasis">
              Tidak ada sertifikasi
            </span>
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
              {{ therapist.notes || '-' }}
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
              {{ therapist.created_at ? formatDateTime(therapist.created_at) : '-' }}
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
              {{ therapist.updated_at ? formatDateTime(therapist.updated_at) : '-' }}
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
          Terapis yang Anda cari tidak ditemukan atau telah dihapus
        </p>
        <VBtn
          color="primary"
          variant="tonal"
          :to="{ name: 'hris-therapists' }"
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
const therapist = ref(null)
const loading = ref(false)
const branchName = ref('')
const employeeName = ref('')

// Methods
const fetchTherapist = async () => {
  loading.value = true
  console.log('🔄 Starting fetchTherapist...')
  
  try {
    const res = await $api(`/hris/therapists/${route.params.id}`, {
      method: 'GET',
    })
    
    console.log('📥 API Response:', res)
    
    if (res && res.response_code === 200) {
      therapist.value = res.data
      
      // Fetch branch name if branch_id exists
      if (therapist.value.branch_id) {
        await fetchBranchName(therapist.value.branch_id)
      }
      
      // Fetch employee name if employee_id exists
      if (therapist.value.employee_id) {
        await fetchEmployeeName(therapist.value.employee_id)
      }
    } else {
      therapist.value = null
    }
  } catch (error) {
    console.error('❌ Error fetching therapist:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Terapis',
      text: 'Tidak dapat memuat data terapis. Silakan coba lagi.',
    })
    therapist.value = null
  } finally {
    loading.value = false
    console.log('🏁 fetchTherapist completed')
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

const getCertificationColor = (level) => {
  switch (level) {
    case 'MASTER':
      return 'success'
    case 'BACHELOR':
      return 'info'
    case 'DIPLOMA':
      return 'warning'
    default:
      return 'default'
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
  fetchTherapist()
})
</script> 
