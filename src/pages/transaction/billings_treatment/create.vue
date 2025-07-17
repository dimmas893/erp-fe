<route lang="yaml">
meta:
  layout: default
  navActiveLink: transaction-billings
</route>

<script setup>
import { requiredValidator } from '@/@core/utils/validators'
import { $api } from '@/utils/api'
import { showErrorAlert, showSuccessAlert } from '@/utils/errorHandler'
import { useRouter } from 'vue-router'
import { VForm } from 'vuetify/components/VForm'

// Initialize router
const router = useRouter()

// Form data structure for treatment
const formData = ref({
  patient_id: '',
  visit_id: '',
  promo_id: '',
  payment_method_id: '',
  total_amount: '',
  discount_amount: '',
  tax_amount: '',
  grand_total: '',
  status: '',
})

// Form validation
const refForm = ref()
const isLoading = ref(false)

// Options
const statusOptions = [
  { title: 'Draft', value: 'draft' },
  { title: 'Unpaid', value: 'unpaid' },
  { title: 'Paid', value: 'paid' },
]

// Data for dropdowns
const visits = ref([])
const promos = ref([])
const paymentMethods = ref([])

const loadingVisits = ref(false)
const loadingPromos = ref(false)
const loadingPaymentMethods = ref(false)

// Selected promo data
const selectedPromo = ref(null)

// Selected visit data
const selectedVisit = ref(null)

// Add new refs and state for branch, doctor, therapist, treatments
const branches = ref([])
const loadingBranches = ref(false)
const doctors = ref([])
const loadingDoctors = ref(false)
const treatments = ref([])
const loadingTreatments = ref(false)
const therapists = ref([])
const loadingTherapists = ref(false)

// State untuk treatment dengan dokter dan terapis per treatment
const selectedTreatments = ref([]) // Array of treatment IDs for multi-select
const selectedTreatmentObjects = ref([]) // Array of treatment objects with doctor and therapist

// Set default value of serviceType to treatment
const serviceType = ref('tindakan') // Fixed to treatment
// Change selectedBranch to be a string (branch id)
const selectedBranch = ref('') // string, not object

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
  await Promise.all([
    loadBranches(),
    loadPromos(),
    loadPaymentMethods(),
  ])
})

// Auto-fill form when visit is selected
const onVisitSelected = visitId => {
  const visit = visits.value.find(v => v.value === visitId)?.data
  if (visit) {
    selectedVisit.value = visit

    // Auto-fill form data from visit
    formData.value.patient_id = visit.patient_id
    selectedBranch.value = visit.branch_id
    
    // Auto-calculate amounts
    const consultationFee = parseFloat(visit.total_consultation_fee) || 0
    const treatmentFee = parseFloat(visit.total_treatment_fee) || 0
    const productFee = parseFloat(visit.total_product_fee) || 0
    
    formData.value.total_amount = (consultationFee + treatmentFee + productFee).toFixed(2)
    calculateGrandTotal()
  }
}

// Watch visit selection
watch(() => formData.value.visit_id, newVal => {
  if (newVal) {
    onVisitSelected(newVal)
  }
})

const loadPromos = async () => {
  try {
    loadingPromos.value = true

    const response = await $api('/crm/promo-engine/promos')

    promos.value = response.data.map(promo => ({
      title: `${promo.name} - ${promo.description} (${promo.code})`,
      value: promo.id,
      data: promo, // Store full promo data for calculations
    }))
  } catch (error) {
    await showErrorAlert(error, { 
      title: 'Gagal Memuat Data Promo',
      text: 'Tidak dapat memuat daftar promo. Silakan refresh halaman.',
    })
  } finally {
    loadingPromos.value = false
  }
}

const loadPaymentMethods = async () => {
  
}

// Fetch branches on mount
const loadBranches = async () => {
  try {
    loadingBranches.value = true

    const response = await $api('/wms/branches')

    branches.value = response.data.map(branch => ({
      title: `${branch.name} (${branch.code})`,
      value: branch.id,
    }))
  } catch (error) {
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Cabang',
      text: 'Tidak dapat memuat daftar cabang. Silakan refresh halaman.',
    })
  } finally {
    loadingBranches.value = false
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

    const response = await $api('/hris/doctors/paginated', {
      method: 'POST',
      body: {
        page: 1,
        per_page: 100,
        sort_by: 'created_at',
        sort_order: 'desc',
        filters: [
          {
            search_by: 'branch_id',
            filter_type: 'equal',
            search_query: branchId,
          },
        ],
      },
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
    const response = await $api('/hris/therapists/paginated', {
      method: 'POST',
      body: {
        page: 1,
        per_page: 100,
        sort_by: 'created_at',
        sort_order: 'desc',
        filters: [
          {
            search_by: 'branch_id',
            filter_type: 'equal',
            search_query: branchId,
          },
        ],
      },
    })

    therapists.value = response.data.map(therapist => ({
      title: therapist.name,
      value: therapist.id,
    }))
  } catch (error) {
    // Fallback: use doctors as therapists if therapists endpoint doesn't exist
    try {
      const doctorResponse = await $api('/hris/doctors/paginated', {
        method: 'POST',
        body: {
          page: 1,
          per_page: 100,
          sort_by: 'created_at',
          sort_order: 'desc',
          filters: [
            {
              search_by: 'branch_id',
              filter_type: 'equal',
              search_query: branchId,
            },
          ],
        },
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
  if (!branchId) {
    treatments.value = []
    return
  }
  try {
    loadingTreatments.value = true

    const response = await $api(`/wms/branch-pricing/branch/${branchId}`, {
      method: 'GET',
    })
    
    const treatmentItems = (response.data || []).filter(item => item.item_type === 'TREATMENT')
    
    // Fetch treatment details for each item
    const treatmentDetails = await Promise.all(treatmentItems.map(async item => {
      let treatmentName = item.item_id
      try {
        const detail = await $api(`/crm/treatments/${item.item_id}`, { method: 'GET' })
        treatmentName = detail.data?.name || item.item_id
      } catch (e) {
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
  } catch (error) {
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Treatment',
      text: 'Tidak dapat memuat daftar treatment cabang. Silakan refresh halaman.',
    })
  } finally {
    loadingTreatments.value = false
  }
}

// Fetch visits for selected branch
const loadVisits = async branchId => {
  if (!branchId) {
    visits.value = []
    return
  }
  try {
    loadingVisits.value = true

    const response = await $api(`/rme/patient-visits/branch/${branchId}`, {
      method: 'GET',
    })

    visits.value = (response.data || []).map(visit => ({
      title: `${visit.patient?.name } - ${visit.visit_number}`,
      value: visit.id,
      data: visit, // Store full visit data for auto-fill
    }))
  } catch (error) {
    await showErrorAlert(error, { 
      title: 'Gagal Memuat Data Kunjungan',
      text: 'Tidak dapat memuat daftar kunjungan. Silakan refresh halaman.',
    })
  } finally {
    loadingVisits.value = false
  }
}

// Watcher for selectedBranch
watch(selectedBranch, async (val) => {
  const branchId = typeof val === 'object' && val !== null ? val.value : val
  formData.value.visit_id = ''
  selectedVisit.value = null
  selectedTreatments.value = []
  selectedTreatmentObjects.value = []

  if (branchId) {
    await Promise.all([
      loadDoctors(branchId),
      loadTherapists(branchId),
      loadVisits(branchId),
      loadTreatments(branchId)
    ])
  } else {
    doctors.value = []
    therapists.value = []
    visits.value = []
    treatments.value = []
  }
})

// Validation rules
const amountValidator = value => {
  if (!value) return 'Jumlah wajib diisi'
  if (isNaN(value) || parseFloat(value) < 0) return 'Jumlah harus berupa angka positif'
  
  return true
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

// Calculate total amount for treatments
const calculateTreatmentTotal = computed(() => {
  let total = 0
  
  // Add selected treatments total
  if (selectedTreatmentObjects.value && selectedTreatmentObjects.value.length > 0) {
    const treatmentsTotal = selectedTreatmentObjects.value.reduce((sum, treatment) => {
      return sum + (parseFloat(treatment?.price) || 0)
    }, 0)
    total += treatmentsTotal
  }
  
  return total
})

// Calculate discount based on selected promo
const calculateDiscount = computed(() => {
  if (!selectedPromo.value) {
    return 0
  }
  
  // Handle case where selectedPromo might be an object
  const promoId = typeof selectedPromo.value === 'object' && selectedPromo.value !== null 
    ? selectedPromo.value.value 
    : selectedPromo.value
    
  const promo = promos.value.find(p => p.value === promoId)?.data
  
  if (!promo) {
    return 0
  }
  
  // Get the current total based on treatment total
  const subtotal = calculateTreatmentTotal.value
  
  // Check minimum purchase requirement
  if (promo.min_purchase && subtotal < parseFloat(promo.min_purchase)) {
    return 0
  }
  
  let discount = 0
  if (promo.discount_type === 'percentage') {
    // Percentage: total * discount_value / 100
    discount = (subtotal * parseFloat(promo.discount_value) / 100)
  } else if (promo.discount_type === 'nominal' || promo.discount_type === 'fixed') {
    // Nominal/Fixed: direct discount value
    discount = parseFloat(promo.discount_value)
  }
  
  return discount
})

const calculateGrandTotal = () => {
  let total = 0
  
  // For treatments, calculate total from selected treatments
  total = calculateTreatmentTotal.value
  formData.value.total_amount = total.toString()
  
  // Calculate discount from selected promo
  const promoDiscount = calculateDiscount.value
  formData.value.discount_amount = promoDiscount.toString()
  
  const discount = parseFloat(formData.value.discount_amount) || 0
  const tax = parseFloat(formData.value.tax_amount) || 0
  
  // Apply discount to grand total: total - discount + tax
  formData.value.grand_total = (total - discount + tax).toFixed(2)
}

// Watch for changes in amounts to auto-calculate grand total
watch([
  () => formData.value.total_amount,
  () => formData.value.discount_amount,
  () => formData.value.tax_amount,
  () => selectedTreatments.value,
  () => selectedPromo.value,
  () => calculateDiscount.value,
], () => {
  calculateGrandTotal()
})

// Submit form
const submitForm = async () => {
  const { valid } = await refForm.value.validate()
  
  if (!valid) return

  try {
    isLoading.value = true

    // Ambil visit_id dan patient_id dari pilihan kunjungan
    let visitId = formData.value.visit_id
    let patientId = formData.value.patient_id
    if (typeof visitId === 'object' && visitId !== null) {
      // Jika visit_id masih object, ambil value dan patient_id dari data
      patientId = visitId.data?.patient_id || ''
      visitId = visitId.value || ''
    }

    // Extract promo_id correctly and ensure it's a number
    let promoId = null
    if (selectedPromo.value) {
      promoId = typeof selectedPromo.value === 'object' && selectedPromo.value !== null 
        ? parseInt(selectedPromo.value.value) 
        : parseInt(selectedPromo.value)
    }
    
    // Set status selalu forwarded_to_doctor
    const submitData = {
      patient_id: patientId,
      visit_id: visitId,
      promo_id: promoId,
      discount_amount: parseFloat(formData.value.discount_amount) || 0,
      status: 'forwarded_to_doctor',
    }
    
    // Add amounts based on treatment service
    if (selectedTreatmentObjects.value.length > 0) {
      const total = calculateTreatmentTotal.value
      submitData.total_amount = total
      submitData.grand_total = parseFloat(formData.value.grand_total) || total
    } else {
      // For when no treatments selected, set default values
      submitData.total_amount = parseFloat(formData.value.total_amount) || 0
      submitData.grand_total = parseFloat(formData.value.grand_total) || 0
    }
    
    const response = await $api('/transaction/billings', {
      method: 'POST',
      body: submitData,
    })

    // Validate billing response
    if (!response.data || !response.data.id) {
      throw new Error('Billing ID tidak ditemukan dalam response')
    }

    console.log('✅ Billing created successfully:', response.data)

    // Tambah insert visit treatment
    if (selectedTreatmentObjects.value.length > 0) {
      const createdTreatments = []
      const failedTreatments = []
      
      // Validate visit_id
      if (!visitId) {
        await showErrorAlert({
          title: 'Visit ID Tidak Valid',
          text: 'Visit ID tidak ditemukan. Silakan pilih kunjungan terlebih dahulu.'
        })
        return
      }
      
      for (const treatment of selectedTreatmentObjects.value) {
        console.log('🔄 Processing treatment:', treatment)
        console.log('🔍 Treatment data:', {
          id: treatment.id,
          name: treatment.name,
          price: treatment.price,
          doctor_id: treatment.doctor_id,
          therapist_id: treatment.therapist_id,
          doctor_id_type: typeof treatment.doctor_id,
          therapist_id_type: typeof treatment.therapist_id
        })
        
        // Validate treatment_id
        if (!treatment.id) {
          console.log('❌ No treatment_id for treatment:', treatment.id)
          failedTreatments.push({ 
            id: treatment.id, 
            name: treatment.name,
            reason: 'ID Treatment tidak valid' 
          })
          continue
        }

        // Doctor and therapist are now optional - use default values if not provided
        let doctorId = 1 // Default doctor ID
        let therapistId = 1 // Default therapist ID
        
        // Only parse if values are provided and not empty
        if (treatment.doctor_id && treatment.doctor_id !== '') {
          const parsedDoctorId = parseInt(treatment.doctor_id)
          if (!isNaN(parsedDoctorId)) {
            doctorId = parsedDoctorId
          }
        }
        
        if (treatment.therapist_id && treatment.therapist_id !== '') {
          const parsedTherapistId = parseInt(treatment.therapist_id)
          if (!isNaN(parsedTherapistId)) {
            therapistId = parsedTherapistId
          }
        }
        
        console.log('🔍 Parsed IDs:', { doctorId, therapistId, original: { doctor_id: treatment.doctor_id, therapist_id: treatment.therapist_id } })

        // Validate treatment_id
        if (!treatment.id) {
          console.log('❌ No treatment_id for treatment:', treatment.id)
          failedTreatments.push({ 
            id: treatment.id, 
            name: treatment.name,
            reason: 'ID Treatment tidak valid' 
          })
          continue
        }

        const visitTreatmentPayload = {
          visit_id: visitId,
          treatment_id: treatment.id,
          doctor_id: doctorId,
          therapist_id: therapistId,
          quantity: 1,
          unit_price: parseFloat(treatment.price).toFixed(2),
          total_price: parseFloat(treatment.price).toFixed(2),
          treatment_notes: `Treatment created from billing ${response.data.id}`,
          billing_id: response.data.id
        }

        console.log('📤 Visit treatment payload:', JSON.stringify(visitTreatmentPayload, null, 2))

        try {
          const visitTreatmentResponse = await $api('/rme/visit-treatments', {
            method: 'POST',
            body: visitTreatmentPayload,
          })
          createdTreatments.push({
            id: treatment.id,
            name: treatment.name,
            response: visitTreatmentResponse.data
          })
        } catch (visitTreatmentError) {
          let errorMessage = `Tagihan berhasil, tapi pembuatan treatment "${treatment.name}" gagal.`
          if (visitTreatmentError.response?.data?.response_message) {
            errorMessage += ` Error: ${visitTreatmentError.response.data.response_message}`
          } else if (visitTreatmentError.message) {
            errorMessage += ` Error: ${visitTreatmentError.message}`
          }
          
          failedTreatments.push({ 
            id: treatment.id, 
            name: treatment.name,
            reason: errorMessage,
            error: visitTreatmentError
          })
        }
      }
      
      if (failedTreatments.length > 0) {
        const failedNames = failedTreatments.map(f => f.name).join(', ')
        await showErrorAlert({
          title: 'Beberapa Treatment Gagal Dibuat',
          text: `Tagihan berhasil dibuat, tetapi ${failedTreatments.length} treatment gagal: ${failedNames}. Silakan cek data treatment.`
        })
      }
    }
    


    await showSuccessAlert(
      `Tagihan treatment berhasil dibuat dengan ID: ${response.data.id}`,
      'Berhasil!',
    )

    // Redirect to previous page
    await router.back()
    
  } catch (error) {
    await showErrorAlert(error)
  } finally {
    isLoading.value = false
  }
}

// Reset form
const resetForm = () => {
  refForm.value?.reset()
  formData.value = {
    patient_id: '',
    visit_id: '',
    promo_id: '',
    payment_method_id: '',
    total_amount: '',
    discount_amount: '',
    tax_amount: '',
    grand_total: '',
    status: '',
  }
  selectedTreatments.value = []
  selectedTreatmentObjects.value = []
  selectedBranch.value = ''
  selectedPromo.value = null
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
        Tambah Tagihan Treatment
      </VCardTitle>
      <VCardSubtitle>
        Lengkapi data tagihan treatment untuk membuat tagihan baru
      </VCardSubtitle>
    </VCardItem>

    <VCardText>
      <VForm
        ref="refForm"
        @submit.prevent="submitForm"
        validate-on="submit"
      >
        <VRow>
          <!-- Data Cabang -->
          <VCol
            cols="12"
            md="6"
          >
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Cabang *
            </label>
            <AppCombobox
              v-model="selectedBranch"
              placeholder="Pilih cabang..."
              :items="branches"
              :loading="loadingBranches"
              :rules="[requiredValidator]"
              required
              clearable
              hide-details="auto"
            />
          </VCol>

          <!-- Visit Autocomplete -->
          <VCol
            cols="12"
            md="6"
          >
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Kunjungan *
            </label>
            <AppCombobox
              v-model="formData.visit_id"
              placeholder="Pilih kunjungan..."
              :items="visits"
              :loading="loadingVisits"
              :rules="[requiredValidator]"
              required
              clearable
              hide-details="auto"
            />
          </VCol>

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
          </VCol>
          

          
          <!-- Promo Selection -->
          <VCol
            cols="12"
            md="6"
          >
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Promo (Opsional)
            </label>
            <AppCombobox
              v-model="selectedPromo"
              placeholder="Pilih promo..."
              :items="promos"
              :loading="loadingPromos"
              clearable
              hide-details="auto"
            />
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

        <!-- Cost Summary Section -->
        <VRow>
          <VCol cols="12">
            <VCard variant="outlined" class="pa-4">
              <VCardTitle class="text-h6 mb-4">
                <VIcon start color="primary">
                  tabler-calculator
                </VIcon>
                Ringkasan Biaya Treatment
              </VCardTitle>
              <VRow>
                <VCol cols="12" md="4">
                  <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                    Total Treatment
                  </label>
                  <VTextField
                    :model-value="calculateTreatmentTotal"
                    type="number"
                    prefix="Rp"
                    readonly
                    density="comfortable"
                    variant="outlined"
                  />
                </VCol>
                <VCol cols="12" md="4">
                  <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                    Diskon Promo
                  </label>
                  <VTextField
                    :model-value="calculateDiscount"
                    type="number"
                    prefix="Rp"
                    readonly
                    density="comfortable"
                    variant="outlined"
                    color="success"
                  />
                </VCol>
                <VCol cols="12" md="4">
                  <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                    Total Biaya
                  </label>
                  <VTextField
                    :model-value="formData.grand_total || 0"
                    type="number"
                    prefix="Rp"
                    readonly
                    density="comfortable"
                    variant="outlined"
                    color="primary"
                  />
                </VCol>
              </VRow>
            </VCard>
          </VCol>
        </VRow>
        
        <!-- Combined Summary Card -->
        <VRow>
          <VCol cols="12">
            <VCard variant="outlined" color="info">
              <VCardText class="pa-4">
                <div class="d-flex align-center gap-2 mb-3">
                  <VIcon size="20" color="info">
                    tabler-calculator
                  </VIcon>
                  <h6 class="text-subtitle-1 font-weight-medium mb-0">
                    Detail Perhitungan
                  </h6>
                </div>
                
                <!-- Subtotal Section -->
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-2">Total Treatment:</span>
                  <span class="text-body-1 font-weight-medium">
                    {{ formatCurrency(calculateTreatmentTotal) }}
                  </span>
                </div>
                
                <!-- Promo Discount Section -->
                <div v-if="selectedPromo" class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-2">Diskon Promo:</span>
                  <span class="text-body-1 font-weight-medium text-success">
                    -{{ formatCurrency(calculateDiscount) }}
                  </span>
                </div>
                
                <!-- Minimum Purchase Warning -->
                <div v-if="selectedPromo && (() => {
                  const promoId = typeof selectedPromo === 'object' && selectedPromo !== null 
                    ? selectedPromo.value 
                    : selectedPromo
                  const promo = promos.find(p => p.value === promoId)?.data
                  const subtotal = calculateTreatmentTotal
                  return promo?.min_purchase && subtotal < parseFloat(promo.min_purchase)
                })()" class="d-flex align-center gap-2 mb-2 pa-2 bg-warning-lighten-5 rounded">
                  <VIcon size="16" color="warning">
                    tabler-alert-triangle
                  </VIcon>
                  <span class="text-caption text-warning">
                    Minimum pembelian: {{ formatCurrency((() => {
                      const promoId = typeof selectedPromo === 'object' && selectedPromo !== null 
                        ? selectedPromo.value 
                        : selectedPromo
                      return promos.find(p => p.value === promoId)?.data?.min_purchase || 0
                    })()) }}
                  </span>
                </div>
                
                <!-- Minimum Purchase Success -->
                <div v-if="selectedPromo && (() => {
                  const promoId = typeof selectedPromo === 'object' && selectedPromo !== null 
                    ? selectedPromo.value 
                    : selectedPromo
                  const promo = promos.find(p => p.value === promoId)?.data
                  const subtotal = calculateTreatmentTotal
                  return promo?.min_purchase && subtotal >= parseFloat(promo.min_purchase)
                })()" class="d-flex align-center gap-2 mb-2 pa-2 bg-success-lighten-5 rounded">
                  <VIcon size="16" color="success">
                    tabler-check
                  </VIcon>
                  <span class="text-caption text-success">
                    Minimum pembelian terpenuhi ✓
                  </span>
                </div>
                
                <!-- Tax Section (if any) -->
                <div v-if="formData.tax_amount && parseFloat(formData.tax_amount) > 0" class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-2">Pajak:</span>
                  <span class="text-body-1 font-weight-medium">
                    {{ formatCurrency(formData.tax_amount) }}
                  </span>
                </div>
                
                <VDivider class="my-3" />
                
                <!-- Grand Total -->
                <div class="d-flex justify-space-between align-center">
                  <span class="text-subtitle-2 font-weight-medium">Total Akhir:</span>
                  <span class="text-h6 font-weight-bold text-primary">{{ formatCurrency(formData.grand_total) }}</span>
                </div>
                
                <!-- Promo Info (if selected) -->
                <div v-if="selectedPromo" class="mt-3 pa-3 bg-success-lighten-5 rounded">
                  <div class="d-flex align-center gap-2 mb-2">
                    <VIcon size="16" color="success">
                      tabler-discount
                    </VIcon>
                    <span class="text-caption font-weight-medium text-success">
                      Promo Aktif: {{ promos.find(p => p.value === selectedPromo)?.data?.name }}
                    </span>
                  </div>
                  <div class="text-caption text-success">
                    {{ promos.find(p => p.value === selectedPromo)?.data?.description }}
                  </div>
                </div>
              </VCardText>
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
            <VIcon start icon="tabler-device-floppy" />
            Buat Tagihan Treatment
          </VBtn>
        </div>
      </VForm>
    </VCardText>
  </VCard>
</template> 
