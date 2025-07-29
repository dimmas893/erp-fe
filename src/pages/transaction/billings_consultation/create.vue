<route lang="yaml">
meta:
  layout: default
  navActiveLink: transaction-billings
</route>

<script setup>
import { requiredValidator } from '@/@core/utils/validators'
import { $api } from '@/utils/api'
import { showErrorAlert, showSuccessAlert } from '@/utils/errorHandler'
import { useRoute, useRouter } from 'vue-router'
import { VForm } from 'vuetify/components/VForm'

// Initialize router and route
const router = useRouter()
const route = useRoute()

// Form data structure for consultation
const formData = ref({
  doctor_id: '',
})

// Form validation
const refForm = ref()
const isLoading = ref(false)

// Status is now static for consultation creation

// Data for dropdowns
const doctors = ref([])
const loadingDoctors = ref(false)

// Selected data
const selectedDoctor = ref(null)
const selectedDate = ref('')

// Patient and Branch data
const patientData = ref(null)
const branchData = ref(null)
const loadingPatient = ref(false)
const loadingBranch = ref(false)
// Status is static, no need for selectedStatus

// Function to fetch patient data
async function fetchPatientData(id) {
  loadingPatient.value = true
  try {
    const response = await $api(`/rme/patients/${id}`, {
      method: 'GET',
    })
    patientData.value = response.data
    console.log('Patient data fetched:', patientData.value)
  } catch (error) {
    console.error('Error fetching patient data:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Pasien',
      text: 'Tidak dapat memuat data pasien. Silakan coba lagi.',
    })
    patientData.value = null
  } finally {
    loadingPatient.value = false
  }
}

// Function to fetch branch data
async function fetchBranchData(id) {
  loadingBranch.value = true
  try {
    const response = await $api(`/wms/branches/${id}`, {
      method: 'GET',
    })
    branchData.value = response.data
    console.log('Branch data fetched:', branchData.value)
  } catch (error) {
    console.error('Error fetching branch data:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Cabang',
      text: 'Tidak dapat memuat data cabang. Silakan coba lagi.',
    })
    branchData.value = null
  } finally {
    loadingBranch.value = false
  }
}

// Function to format date
function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID')
}

// onMounted: load initial data
onMounted(async () => {
  // Set today's date as default
  const today = new Date()
  const todayString = today.toISOString().split('T')[0]
  selectedDate.value = todayString
  
  // Check for patient_id and branch_id in query parameters
  if (route.query.patient_id) {
    console.log('Patient ID from query:', route.query.patient_id)
    await fetchPatientData(route.query.patient_id)
  }
  
  if (route.query.branch_id) {
    console.log('Branch ID from query:', route.query.branch_id)
    await fetchBranchData(route.query.branch_id)
    // Load doctors for this branch immediately
    await loadDoctors(route.query.branch_id)
  }
})



// Watch doctor selection
watch(() => selectedDoctor.value, newVal => {
  console.log('Doctor selection changed to:', newVal)
  if (newVal) {
      formData.value.doctor_id = typeof newVal === 'object' ? newVal.value : newVal
  } else {
    formData.value.doctor_id = ''
  }
})



// Fetch doctors for selected branch
const loadDoctors = async branchId => {
  console.log('loadDoctors called with branchId:', branchId)
  console.log('branchId type:', typeof branchId)
  console.log('branchId value:', branchId)
  
  if (!branchId) {
    console.log('No branchId provided, clearing doctors')
    doctors.value = []
    return
  }
  
  try {
    loadingDoctors.value = true
    const apiUrl = `/hris/doctors/branch/${branchId}`
    console.log('Making API call to:', apiUrl)

    const response = await $api(apiUrl, {
      method: 'GET',
    })

    console.log('Doctors API response:', response)

    if (response.data && Array.isArray(response.data)) {
      if (response.data.length === 0) {
        console.warn('No doctors found for branch_id:', branchId)
        doctors.value = []
      } else {
    doctors.value = response.data.map(doctor => ({
          title: `${doctor.name} - ${doctor.specialization}`,
      value: doctor.id,
          data: doctor, // Store full doctor data
        }))
        
        // Set selectedDoctor if there's a doctor_id from visit
        if (formData.value.doctor_id) {
          const doctorToSelect = doctors.value.find(d => d.value === formData.value.doctor_id)
          if (doctorToSelect) {
            selectedDoctor.value = doctorToSelect
            console.log('Auto-selected doctor:', doctorToSelect.title)
          }
        }
        
        console.log('Processed doctors:', doctors.value)
      }
    } else {
      console.error('Invalid response format:', response)
      doctors.value = []
    }
  } catch (error) {
    console.error('Error loading doctors:', error)
    console.error('Error details:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    })
    
    // Check if it's a 404 or no data found
    if (error.response?.status === 404 || error.message?.includes('not found')) {
      console.log('No doctors found for branch')
      doctors.value = []
    } else {
      doctors.value = []
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Dokter',
      text: 'Tidak dapat memuat daftar dokter. Silakan refresh halaman.',
    })
    }
  } finally {
    loadingDoctors.value = false
  }
}



















// Submit form
const submitForm = async () => {
  const { valid } = await refForm.value.validate()
  
  if (!valid) return

  try {
    isLoading.value = true

    // Prepare data for the new API endpoint
    const submitData = {
      patient_id: route.query.patient_id,
      branch_id: route.query.branch_id,
      visit_date: selectedDate.value,
      doctor_id: formData.value.doctor_id,
      status: 'open_consultation'
    }
    
    console.log('📤 Final billing submit data:', submitData)
    console.log('📤 API call to /transaction/billings/with-consultation with body:', JSON.stringify(submitData, null, 2))
    
    const response = await $api('/transaction/billings/with-consultation', {
      method: 'POST',
      body: submitData,
    })

    await showSuccessAlert(
      response.data.response_message,
      'Berhasil!',
    )

    // Redirect back to patient list
    await router.push({ 
      name: 'rme-pasien'
    })
    
  } catch (error) {
    console.error('Error creating billing:', error)
    await showErrorAlert(error)
  } finally {
    isLoading.value = false
  }
}

// Reset form
const resetForm = () => {
  refForm.value?.reset()
  formData.value = {
    doctor_id: '',
  }
  selectedDoctor.value = ''
  selectedDate.value = ''
}



// Cancel and go back
const goBack = () => {
  router.push({ name: 'transaction-billings' })
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
        Tambah Tagihan Konsultasi
      </VCardTitle>
      <VCardSubtitle>
        Lengkapi data tagihan konsultasi untuk membuat tagihan baru
      </VCardSubtitle>
    </VCardItem>

    <VCardText>
      <!-- Display Patient and Branch Data -->
      <VRow v-if="patientData || branchData" class="mb-6">
        <!-- Patient Data -->
        <VCol v-if="patientData" cols="12" md="6">
          <VCard variant="outlined" class="pa-4">
            <VCardTitle class="d-flex align-center gap-2">
              <VIcon size="24" color="primary">
                tabler-user
              </VIcon>
              <span>Data Pasien</span>
            </VCardTitle>
            <VCardText>
              <div class="d-flex flex-column gap-2">
                <div class="d-flex justify-space-between">
                  <span class="font-weight-medium">No. Pasien:</span>
                  <span>{{ patientData.patient_number }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="font-weight-medium">Nama:</span>
                  <span>{{ patientData.name }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="font-weight-medium">NIK:</span>
                  <span>{{ patientData.nik }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="font-weight-medium">Jenis Kelamin:</span>
                  <span>{{ patientData.gender === 'MALE' ? 'Laki-laki' : 'Perempuan' }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="font-weight-medium">Tanggal Lahir:</span>
                  <span>{{ formatDate(patientData.birth_date) }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="font-weight-medium">Telepon:</span>
                  <span>{{ patientData.phone }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="font-weight-medium">Email:</span>
                  <span>{{ patientData.email }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="font-weight-medium">Alamat:</span>
                  <span>{{ patientData.address }}</span>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Branch Data -->
        <VCol v-if="branchData" cols="12" md="6">
          <VCard variant="outlined" class="pa-4">
            <VCardTitle class="d-flex align-center gap-2">
              <VIcon size="24" color="info">
                tabler-building
              </VIcon>
              <span>Data Cabang</span>
            </VCardTitle>
            <VCardText>
              <div class="d-flex flex-column gap-2">
                <div class="d-flex justify-space-between">
                  <span class="font-weight-medium">Kode Cabang:</span>
                  <span>{{ branchData.code }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="font-weight-medium">Nama Cabang:</span>
                  <span>{{ branchData.name }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="font-weight-medium">Alamat:</span>
                  <span>{{ branchData.address }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="font-weight-medium">Telepon:</span>
                  <span>{{ branchData.phone }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="font-weight-medium">Email:</span>
                  <span>{{ branchData.email }}</span>
                </div>

              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <VForm
        ref="refForm"
        @submit.prevent="submitForm"
        validate-on="submit"
      >
        <VRow>
          <!-- Doctor Selection -->
          <VCol  
            cols="12"
            md="6"
          >
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Dokter *
            </label>
            <AppCombobox
              v-model="selectedDoctor"
              placeholder="Pilih dokter..."
              :items="doctors"
              :loading="loadingDoctors"
              :rules="[requiredValidator]"
              required
              clearable
              hide-details="auto"
              return-object
            />
          </VCol>

        <!-- Date Selection -->
          <VCol
            cols="12"
            md="6"
          >
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tanggal Konsultasi *
            </label>
            <VTextField
              v-model="selectedDate"
              placeholder="Pilih tanggal..."
              type="date"
              variant="outlined"
              :rules="[requiredValidator]"
              required
              hide-details="auto"
              prepend-inner-icon="tabler-calendar"
            />
          </VCol>
        </VRow>
        
        <div class="d-flex justify-end mt-4">
          <VBtn
            type="submit"
            
            :loading="isLoading"
            :disabled="isLoading"
            color="primary"
          >
            <VIcon start icon="tabler-device-floppy" />
            Lanjutkan
          </VBtn>
        </div>
      </VForm>
    </VCardText>
  </VCard>
</template> 

 
