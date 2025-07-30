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

// Initialize router
const router = useRouter()
const route = useRoute()

// Get parameters from route query
const patientId = computed(() => route.query.patient_id)
const branchId = computed(() => route.query.branch_id)

// Patient and Branch data
const patientData = ref(null)
const branchData = ref(null)
const loadingPatient = ref(false)
const loadingBranch = ref(false)

// Form validation
const refForm = ref()
const isLoading = ref(false)

// Add new refs and state for branch, doctor, therapist, treatments
const doctors = ref([])
const loadingDoctors = ref(false)
const treatments = ref([])
const loadingTreatments = ref(false)
const therapists = ref([])
const loadingTherapists = ref(false)

// State untuk treatment dengan dokter dan terapis per treatment
const selectedTreatments = ref([]) // Array of treatment IDs for multi-select
const selectedTreatmentObjects = ref([]) // Array of treatment objects with doctor and therapist

// Date selection
const selectedDate = ref('')

// Branch ID will be set automatically from billing data
const currentBranchId = ref('')

// Function to format date
function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID')
}

// Helper function to create treatment object
const createTreatmentObject = (treatmentId, treatmentData) => {
  return {
    id: treatmentId,
    name: treatmentData.title,
    price: treatmentData.price,
    doctor_id: '',
    therapist_id: '',
    doctor_name: '',
    therapist_name: ''
  }
}

// Handle multi-select treatment selection
const handleTreatmentSelection = (selectedIds) => {
  console.log('🔄 handleTreatmentSelection called with:', selectedIds)
  
  // Clear existing treatment objects
  selectedTreatmentObjects.value = []
  
  // Create treatment objects for each selected ID
  selectedIds.forEach(treatmentId => {
    const treatment = treatments.value.find(t => t.value === treatmentId)
    if (treatment) {
      const newTreatment = createTreatmentObject(treatmentId, treatment)
      selectedTreatmentObjects.value.push(newTreatment)
    }
  })
  
  console.log('📋 Updated selectedTreatmentObjects:', selectedTreatmentObjects.value)
}

// Remove treatment from selected treatments
const removeTreatment = (treatmentId) => {
  const index = selectedTreatmentObjects.value.findIndex(t => t.id === treatmentId)
  if (index > -1) {
    selectedTreatmentObjects.value.splice(index, 1)
    
    // Also remove from the multi-select array
    const selectIndex = selectedTreatments.value.indexOf(treatmentId)
    if (selectIndex > -1) {
      selectedTreatments.value.splice(selectIndex, 1)
    }
  }
}

// Update doctor for specific treatment
const updateTreatmentDoctor = (treatmentId, doctorId) => {
  const treatment = selectedTreatmentObjects.value.find(t => t.id === treatmentId)
  if (treatment) {
    // Handle Proxy object - extract the actual value
    let actualDoctorId = doctorId
    if (doctorId && typeof doctorId === 'object' && doctorId.value !== undefined) {
      actualDoctorId = doctorId.value
    }
    
    treatment.doctor_id = actualDoctorId
    const doctor = doctors.value.find(d => d.value === actualDoctorId)
    treatment.doctor_name = doctor ? doctor.title : ''
  }
}

// Update therapist for specific treatment
const updateTreatmentTherapist = (treatmentId, therapistId) => {
  const treatment = selectedTreatmentObjects.value.find(t => t.id === treatmentId)
  if (treatment) {
    // Handle Proxy object - extract the actual value
    let actualTherapistId = therapistId
    if (therapistId && typeof therapistId === 'object' && therapistId.value !== undefined) {
      actualTherapistId = therapistId.value
    }
    
    treatment.therapist_id = actualTherapistId
    const therapist = therapists.value.find(t => t.value === actualTherapistId)
    treatment.therapist_name = therapist ? therapist.title : ''
  }
}

// onMounted: load initial data
onMounted(async () => {
  // Load patient and branch data if available
  if (patientId.value) {
    await loadPatientData()
  }
  if (branchId.value) {
    await loadBranchData(branchId.value)
  }
})

// Load patient data
const loadPatientData = async () => {
  loadingPatient.value = true
  try {
    const response = await $api(`/rme/patients/${patientId.value}`, {
      method: 'GET',
    })
    
    patientData.value = response.data
    console.log('✅ Patient data loaded:', patientData.value)
  } catch (error) {
    console.error('❌ Error loading patient data:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Pasien',
      text: 'Tidak dapat memuat data pasien. Silakan coba lagi.',
    })
    patientData.value = null
  } finally {
    loadingPatient.value = false
  }
}

// Load branch data
const loadBranchData = async (branchId) => {
  loadingBranch.value = true
  try {
    const response = await $api(`/wms/branches/${branchId}`, {
      method: 'GET',
    })
    
    branchData.value = response.data
    currentBranchId.value = branchId
    
    console.log('✅ Branch data loaded:', branchData.value)
    
    // Load related data for this branch
    await Promise.all([
      loadDoctors(branchId),
      loadTherapists(branchId),
      loadTreatments(branchId)
    ])
  } catch (error) {
    console.error('❌ Error loading branch data:', error)
    await showErrorAlert(error, { 
      title: 'Gagal Memuat Data Cabang',
      text: 'Tidak dapat memuat data cabang. Silakan coba lagi.',
    })
    branchData.value = null
  } finally {
    loadingBranch.value = false
  }
}

  



// Fetch doctors for selected branch
const loadDoctors = async branchId => {
  if (!branchId) {
    doctors.value = []
    return
  }
  try {
    loadingDoctors.value = true

    const response = await $api(`/hris/doctors/branch/${branchId}`, {
        method: 'GET',
      })
    doctors.value = response.data.map(doctor => ({
      title: doctor.name,
      value: doctor.id,
    }))
  } catch (error) {
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Dokter',
      text: 'Tidak dapat memuat daftar dokter. Silakan refresh halaman.',
    })
  } finally {
    loadingDoctors.value = false
  }
}

// Fetch therapists for selected branch
const loadTherapists = async branchId => {
  if (!branchId) {
    therapists.value = []
    return
  }
  try {
    loadingTherapists.value = true

    // Try therapists endpoint first, fallback to doctors if not available
    // const response = await $api('/hris/therapists/paginated', {
    //   method: 'POST',
    //   body: {
    //     page: 1,
    //     per_page: 100,
    //     sort_by: 'created_at',
    //     sort_order: 'desc',
    //     filters: [
    //       {
    //         search_by: 'branch_id',
    //         filter_type: 'equal',
    //         search_query: branchId,
    //       },
    //     ],
    //   },
    // })

    const response = await $api(`/hris/therapists/branch/${branchId}`, {
      method: 'GET',
    })
    therapists.value = response.data.map(therapist => ({
      title: therapist.name,
      value: therapist.id,
    }))
  } catch (error) {
    // Fallback: use doctors as therapists if therapists endpoint doesn't exist
    try {
      // const doctorResponse = await $api('/hris/doctors/paginated', {
      //   method: 'POST',
      //   body: {
      //     page: 1,
      //     per_page: 100,
      //     sort_by: 'created_at',
      //     sort_order: 'desc',
      //     filters: [
      //       {
      //         search_by: 'branch_id',
      //         filter_type: 'equal',
      //         search_query: branchId,
      //       },
      //     ],
      //   },
      // })

      const doctorResponse = await $api(`/hris/doctors/branch/${branchId}`, {
        method: 'GET',
      })
      therapists.value = doctorResponse.data.map(doctor => ({
        title: doctor.name,
        value: doctor.id,
      }))
    } catch (fallbackError) {
      therapists.value = []
    }
  } finally {
    loadingTherapists.value = false
  }
}

// Fetch treatments for selected branch using branch-pricing endpoint
const loadTreatments = async (branchId = null) => {
  console.log('🔄 loadTreatments called with branchId:', branchId)
  
  if (!branchId) {
    console.log('❌ No branchId provided, clearing treatments')
    treatments.value = []
    return
  }
  
  try {
    loadingTreatments.value = true
    console.log('📡 Fetching treatments from API for branch:', branchId)

    const response = await $api(`/wms/branch-pricing/branch/${branchId}`, {
      method: 'GET',
    })
    
    console.log('📦 Raw branch pricing response:', response.data)
    
    const treatmentItems = (response.data || []).filter(item => item.item_type === 'TREATMENT')
    console.log('🔍 Found treatment items:', treatmentItems.length)
    
    // Fetch treatment details for each item
    const treatmentDetails = await Promise.all(treatmentItems.map(async item => {
      let treatmentName = item.item_id
      try {
        const detail = await $api(`/crm/treatments/${item.item_id}`, { method: 'GET' })
        treatmentName = detail.data?.name || item.item_id
        console.log('📋 Fetched treatment detail:', treatmentName)
      } catch (e) {
        console.warn('⚠️ Could not fetch treatment detail for:', item.item_id)
        // Use item_id as fallback
      }
      
      const mappedItem = {
        title: `${treatmentName} - ${item.final_price_formatted}`,
        value: item.item_id,
        price: parseFloat(item.final_price),
        priceFormatted: item.final_price_formatted,
        raw: item,
      }
      return mappedItem
    }))
    
    treatments.value = treatmentDetails
    console.log('✅ Final treatments array:', treatments.value)
    console.log('📊 Total treatments loaded:', treatments.value.length)
  } catch (error) {
    console.error('❌ Error loading treatments:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Treatment',
      text: 'Tidak dapat memuat daftar treatment cabang. Silakan refresh halaman.',
    })
  } finally {
    loadingTreatments.value = false
  }
}







// Format currency helper
const formatCurrency = (amount) => {
  if (!amount) return 'Rp 0'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Submit form
const submitForm = async () => {
  const { valid } = await refForm.value.validate()
  
  if (!valid) return

  try {
    isLoading.value = true

    // Validate required data
    if (!patientId.value || !branchId.value) {
      await showErrorAlert({
        title: 'Data Tidak Lengkap',
        text: 'Patient ID atau Branch ID tidak ditemukan.'
      })
      return
    }

    if (selectedTreatmentObjects.value.length === 0) {
        await showErrorAlert({
        title: 'Treatment Tidak Dipilih',
        text: 'Silakan pilih minimal satu treatment.'
        })
        return
      }

    // Prepare treatments data for the new API endpoint
    const treatmentsData = selectedTreatmentObjects.value.map(treatment => {
      const treatmentPayload = {
        treatment_id: treatment.id
      }
      
      // Add doctor_id if provided (optional)
        if (treatment.doctor_id && treatment.doctor_id !== '') {
          const parsedDoctorId = parseInt(treatment.doctor_id)
          if (!isNaN(parsedDoctorId)) {
          treatmentPayload.doctor_id = parsedDoctorId
          }
        }
        
      // Add therapist_id if provided (optional)
        if (treatment.therapist_id && treatment.therapist_id !== '') {
          const parsedTherapistId = parseInt(treatment.therapist_id)
          if (!isNaN(parsedTherapistId)) {
          treatmentPayload.therapist_id = parsedTherapistId
        }
      }
      
      return treatmentPayload
    })

    // Prepare data for the new API endpoint
    const submitData = {
      patient_id: patientId.value,
      branch_id: branchId.value,
      visit_date: selectedDate.value,
      status: 'open_treatment',
      treatments: treatmentsData
    }
    
    console.log('📤 Final billing submit data:', submitData)
    console.log('📤 API call to /transaction/billings/with-treatment with body:', JSON.stringify(submitData, null, 2))
    
    const response = await $api('/transaction/billings/with-treatment', {
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
    console.error('Error creating billing with treatments:', error)
    await showErrorAlert(error)
  } finally {
    isLoading.value = false
  }
}

// Reset form
const resetForm = () => {
  refForm.value?.reset()
  selectedTreatments.value = []
  selectedTreatmentObjects.value = []
  selectedDate.value = ''
}

// Cancel and go back
const goBack = () => {
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
        Tambah Treatment
      </VCardTitle>
      <VCardSubtitle>
        Pilih treatment untuk membuat billing baru dengan treatment
      </VCardSubtitle>
    </VCardItem>

    <VCardText>
      <VForm
        ref="refForm"
        @submit.prevent="submitForm"
        validate-on="submit"
      >


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

        <VRow>
          <!-- Treatment selection -->
          <VCol
            cols="12"
            md="6"
          >
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Pilih Tindakan (bisa lebih dari satu)
            </label>
            <VSelect
              v-model="selectedTreatments"
              :items="treatments"
              :loading="loadingTreatments"
              multiple
              chips
              closable-chips
              clearable
              hide-details="auto"
              placeholder="Pilih tindakan..."
              item-title="title"
              item-value="value"
              @update:model-value="handleTreatmentSelection"
            />
            <div class="text-caption text-medium-emphasis mt-1">
              <VIcon size="14" class="mr-1">
                tabler-info-circle
              </VIcon>
              <span v-if="loadingTreatments">Memuat treatments untuk cabang ini...</span>
              <span v-else-if="treatments.length > 0">{{ treatments.length }} treatments tersedia</span>
              <span v-else-if="branchId">Tidak ada treatments tersedia untuk cabang ini</span>
              <span v-else>Data cabang tidak tersedia</span>
            </div>
          </VCol>
          
          <!-- Date Selection -->
          <VCol
            cols="12"
            md="6"
          >
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tanggal Treatment *
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
              :min="new Date().toISOString().split('T')[0]"
            />
            <div class="text-caption text-medium-emphasis mt-1">
              <VIcon size="14" class="mr-1">
                tabler-info-circle
              </VIcon>
              Pilih tanggal untuk melihat jadwal tersedia dokter
            </div>
          </VCol>
        </VRow>

        <!-- Selected Treatments with Doctor & Therapist -->
        <VRow v-if="selectedTreatmentObjects.length > 0">
          <VCol cols="12">
            <VCard variant="outlined" class="pa-4">
              <VCardTitle class="text-h6 mb-4">
                <VIcon start color="warning">
                  tabler-syringe
                </VIcon>
                Treatment yang Dipilih ({{ selectedTreatmentObjects.length }} treatment)
              </VCardTitle>
              
              <div v-for="(treatment, index) in selectedTreatmentObjects" :key="treatment.id" class="mb-4">
                <VCard variant="tonal" class="pa-3">
                  <div class="d-flex align-center justify-space-between mb-3">
                    <div>
                      <h6 class="text-subtitle-1 font-weight-medium mb-1">{{ treatment.name }}</h6>
                      <span class="text-body-2 text-medium-emphasis">{{ formatCurrency(treatment.price) }}</span>
                    </div>
                    <VBtn
                      icon="tabler-x"
                      size="small"
                      variant="text"
                      color="error"
                      @click="removeTreatment(treatment.id)"
                    />
                  </div>
                  
                  <VRow>
                    <!-- Doctor selection for this treatment -->
                    <VCol cols="12" md="6">
                      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                        Dokter (Opsional)
                      </label>
                      <AppCombobox
                        v-model="treatment.doctor_id"
                        placeholder="Pilih dokter..."
                        :items="doctors"
                        :loading="loadingDoctors"
                        clearable
                        hide-details="auto"
                        @update:model-value="(val) => updateTreatmentDoctor(treatment.id, val)"
                      />
                    </VCol>
                    
                    <!-- Therapist selection for this treatment -->
                    <VCol cols="12" md="6">
                      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                        Terapis (Opsional)
                      </label>
                      <AppCombobox
                        v-model="treatment.therapist_id"
                        placeholder="Pilih terapis..."
                        :items="therapists"
                        :loading="loadingTherapists"
                        clearable
                        hide-details="auto"
                        @update:model-value="(val) => updateTreatmentTherapist(treatment.id, val)"
                      />
                    </VCol>
                  </VRow>
                </VCard>
              </div>
            </VCard>
          </VCol>
        </VRow>



        
        <div class="d-flex justify-end mt-4">
          <VBtn
            type="submit"
            :loading="isLoading"
            :disabled="isLoading || selectedTreatmentObjects.length === 0"
            color="primary"
          >
            <VIcon start icon="tabler-plus" />
            Lanjutkan
          </VBtn>
        </div>
      </VForm>
    </VCardText>
  </VCard>
</template> 

 
