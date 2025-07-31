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
import { ref } from 'vue'

import noimage from '@images/addimages/no-image.jpg'

const fileInputs = []

const imageCards = ref([
  { url: '' }, // default 1 card kosong
])

function addNewCard() {
  imageCards.value.push({ url: '' })
}

function onImageChange(event, index) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      imageCards.value[index].url = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function removeItem(index) {
  this.imageCards.splice(index, 1);
}

const tret = ref([
  { id: 1, name: 'Basic Facial Basic Facial Basic Facial Basic Facial Basic Facial Basic Facial', price: 189900 },
  { id: 2, name: 'Deep Cleansing Facial', price: 189900 },
  { id: 3, name: 'Acne Facial', price: 189900 },
  { id: 4, name: 'Brightening Facial', price: 189900 },
  { id: 1, name: 'Basic Facial Basic Facial Basic Facial Basic Facial Basic Facial Basic Facial', price: 189900 },
  { id: 2, name: 'Deep Cleansing Facial', price: 189900 },
  { id: 3, name: 'Acne Facial', price: 189900 },
  { id: 4, name: 'Brightening Facial', price: 189900 },
  
  ])

function formatRupiah(value) {
        if (!value) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(value);
      }




// =====================================================================


// Initialize router
const router = useRouter()
const route = useRoute()

// Get billing_id from route query
const billingId = computed(() => route.query.billing_id)
const visitId = computed(() => route.query.visit_id)
const consultationId = computed(() => route.query.consultation_id)

// Get branch_id from billing data
const branchId = computed(() => {
  // Try to get branch_id from billing data if available
  // For now, we'll need to load it from the billing API
  return null // Will be set when billing data is loaded
})

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

// Selected visit data
const selectedVisit = ref(null)

// Selected promo data
const selectedPromo = ref(null)

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

// Schedule-related variables (for doctor availability checking)
const schedules = ref([])
const loadingSchedules = ref(false)
const availableTimeSlots = ref([])
const selectedDate = ref('')
const selectedTimeSlot = ref(null)

// Set default value of serviceType to treatment
const serviceType = ref('tindakan') // Fixed to treatment
// Branch ID will be set automatically from billing data
const currentBranchId = ref('')

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
  
  // Load schedules for all doctors if date is selected
  if (selectedDate.value) {
    loadSchedulesForAllDoctors()
  }
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
const updateTreatmentDoctor = async (treatmentId, doctorId) => {
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
    
    // Load schedules for all doctors if date is selected
    if (selectedDate.value) {
      console.log('Loading schedules for all doctors, date:', selectedDate.value)
      await loadSchedulesForAllDoctors()
    }
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
  if (billingId.value) {
    await loadBillingData()
  } else {
    // Load all visits when no billing data is available
    await loadAllVisits()
  }
  await Promise.all([
    loadPromos(),
    loadPaymentMethods(),
  ])
})

// Load billing data to get branch_id
const loadBillingData = async () => {
  try {
    const response = await $api(`/transaction/billings/${billingId.value}`, {
      method: 'GET',
    })
    
    const billingData = response.data
    
    // Set branch_id from billing data
    if (billingData.visit_id) {
      // Load visit data to get branch_id
      const visitResponse = await $api(`/rme/patient-visits/${billingData.visit_id}`, {
        method: 'GET',
      })
      
      const visitData = visitResponse.data
      if (visitData.branch_id) {
        // Set the branch and load related data
        await loadBranchData(visitData.branch_id)
      }
    }
  } catch (error) {
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Billing',
      text: 'Tidak dapat memuat data billing. Silakan coba lagi.',
    })
  }
}

// Load branch data and related items
const loadBranchData = async (branchId) => {
  try {
    currentBranchId.value = branchId
    await Promise.all([
      loadDoctors(branchId),
      loadTherapists(branchId),
      loadTreatments(branchId)
    ])
  } catch (error) {
    console.error('Error loading branch data:', error)
  }
}

// Auto-fill form when visit is selected
const onVisitSelected = async visitObject => {
  console.log('onVisitSelected called with:', visitObject)
  
  if (!visitObject) {
    // Clear form when visit is deselected
    selectedVisit.value = null
    formData.value.patient_id = ''
    formData.value.visit_id = ''
    currentBranchId.value = ''
    treatments.value = []
    return
  }
  
  // Handle both object and value
  const visit = typeof visitObject === 'object' && visitObject !== null 
    ? visitObject.data 
    : visits.value.find(v => v.value === visitObject)?.data
    
  if (visit) {
    selectedVisit.value = visitObject // Keep the full object for display

    // Auto-fill form data from visit
    formData.value.patient_id = visit.patient_id
    formData.value.visit_id = visit.id
    currentBranchId.value = visit.branch_id
    
    console.log('🔍 Visit selected with branch_id:', visit.branch_id)
    
    // Load branch data for this visit (includes treatments)
    if (visit.branch_id) {
      console.log('📋 Loading treatments for branch_id:', visit.branch_id)
      await loadBranchData(visit.branch_id)
      console.log('✅ Treatments loaded:', treatments.value.length, 'treatments available')
    } else {
      console.warn('⚠️ No branch_id found in visit data')
    }
    
    // Auto-calculate amounts
    const consultationFee = parseFloat(visit.total_consultation_fee) || 0
    const treatmentFee = parseFloat(visit.total_treatment_fee) || 0
    const productFee = parseFloat(visit.total_product_fee) || 0
    
    formData.value.total_amount = (consultationFee + treatmentFee + productFee).toFixed(2)
    calculateGrandTotal()
    
    console.log('Visit selected:', {
      visit_id: visit.id,
      patient_id: visit.patient_id,
      branch_id: visit.branch_id,
      selectedVisit: selectedVisit.value,
      treatments_loaded: treatments.value.length
    })
  }
}

// Watch visit selection
watch(() => selectedVisit.value, async newVal => {
  console.log('Visit selection changed to:', newVal)
  console.log('Visit selection type:', typeof newVal)
  console.log('Visit selection value:', newVal)
  
  if (newVal) {
    await onVisitSelected(newVal)
  } else {
    // Clear form when visit is cleared
    formData.value.patient_id = ''
    formData.value.visit_id = ''
    currentBranchId.value = ''
    doctors.value = []
    therapists.value = []
    treatments.value = []
    schedules.value = []
    availableTimeSlots.value = []
    selectedDate.value = ''
  }
})

// Watch selected date to check availability
watch(() => selectedDate.value, async newVal => {
  console.log('Selected date changed to:', newVal)
  if (newVal && selectedTreatmentObjects.value.length > 0) {
    // Clear existing schedules when date changes
    schedules.value = []
    availableTimeSlots.value = []
    
    // Check schedules for all selected treatments' doctors
    for (const treatment of selectedTreatmentObjects.value) {
      if (treatment.doctor_id) {
        await loadDoctorSchedules(treatment.doctor_id, newVal)
      }
    }
  } else if (!newVal) {
    // Clear schedules when date is cleared
    schedules.value = []
    availableTimeSlots.value = []
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

// Load schedules for all selected doctors
const loadSchedulesForAllDoctors = async () => {
  if (!selectedDate.value) return
  
  // Clear existing schedules
  schedules.value = []
  availableTimeSlots.value = []
  
  // Load schedules for all doctors in selected treatments
  for (const treatment of selectedTreatmentObjects.value) {
    if (treatment.doctor_id) {
      await loadDoctorSchedules(treatment.doctor_id, selectedDate.value)
    }
  }
}

// Load doctor schedules for availability checking
const loadDoctorSchedules = async (doctorId, date) => {
  try {
    loadingSchedules.value = true
    console.log('Loading schedules for doctor:', doctorId, 'date:', date)

    const response = await $api('/crm/doctor-schedules/check-available', {
      method: 'POST',
      body: {
        doctor_id: doctorId,
        date: date
      }
    })

    console.log('Schedules API response:', response)

    if (response.data && Array.isArray(response.data)) {
      // Add new schedules to existing ones instead of replacing
      const newSchedules = response.data
      
      // Remove any existing schedules for this doctor to avoid duplicates
      schedules.value = schedules.value.filter(schedule => 
        schedule.doctor_id !== doctorId
      )
      
      // Add the new schedules
      schedules.value.push(...newSchedules)
      
      // Rebuild available time slots from all schedules
      availableTimeSlots.value = []
      schedules.value.forEach(schedule => {
        if (schedule.available_time_slots && schedule.available_slots > 0) {
          schedule.available_time_slots.forEach(slot => {
            availableTimeSlots.value.push({
              ...slot,
              schedule_id: schedule.id,
              doctor_name: schedule.doctor_name,
              day: schedule.day
            })
          })
        }
      })
      
      console.log('Available time slots:', availableTimeSlots.value)
      console.log('Processed schedules:', schedules.value)
    } else {
      // Only clear schedules for this specific doctor
      schedules.value = schedules.value.filter(schedule => 
        schedule.doctor_id !== doctorId
      )
      
      // Rebuild available time slots
      availableTimeSlots.value = []
      schedules.value.forEach(schedule => {
        if (schedule.available_time_slots && schedule.available_slots > 0) {
          schedule.available_time_slots.forEach(slot => {
            availableTimeSlots.value.push({
              ...slot,
              schedule_id: schedule.id,
              doctor_name: schedule.doctor_name,
              day: schedule.day
            })
          })
        }
      })
    }
  } catch (error) {
    console.error('Error loading schedules:', error)
    // Only clear schedules for this specific doctor on error
    schedules.value = schedules.value.filter(schedule => 
      schedule.doctor_id !== doctorId
    )
    
    // Rebuild available time slots
    availableTimeSlots.value = []
    schedules.value.forEach(schedule => {
      if (schedule.available_time_slots && schedule.available_slots > 0) {
        schedule.available_time_slots.forEach(slot => {
          availableTimeSlots.value.push({
            ...slot,
            schedule_id: schedule.id,
            doctor_name: schedule.doctor_name,
            day: schedule.day
          })
        })
      }
    })
    
    await showErrorAlert(error, {
      title: 'Gagal Memuat Jadwal Dokter',
      text: 'Tidak dapat memuat jadwal dokter. Silakan coba lagi.',
    })
  } finally {
    loadingSchedules.value = false
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

// Load all visits when no billing data is available
const loadAllVisits = async () => {
  try {
    loadingVisits.value = true

    const response = await $api('/rme/patient-visits', {
      method: 'GET',
    })

    console.log('Raw visits response:', response.data)

    visits.value = (response.data || []).map(visit => {
      const visitItem = {
        title: `${visit.patient?.name || 'Unknown Patient'} - ${visit.visit_number || 'No Visit Number'}`,
        value: visit.id,
        data: visit, // Store full visit data for auto-fill
      }
      console.log('Mapped visit item:', visitItem)
      return visitItem
    })
    
    console.log('Final visits array:', visits.value)
  } catch (error) {
    console.error('Error loading visits:', error)
    await showErrorAlert(error, { 
      title: 'Gagal Memuat Data Kunjungan',
      text: 'Tidak dapat memuat daftar kunjungan. Silakan refresh halaman.',
    })
  } finally {
    loadingVisits.value = false
  }
}

// Watcher for selectedBranch
// watch(selectedBranch, async (val) => { ... }) - REMOVED

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

    // Get visit_id from route query or form
    let currentVisitId = visitId.value || formData.value.visit_id
    if (typeof currentVisitId === 'object' && currentVisitId !== null) {
      currentVisitId = currentVisitId.value || ''
    }

    // Validate required data
    if (!currentVisitId) {
      await showErrorAlert({
        title: 'Visit ID Tidak Valid',
        text: 'Visit ID tidak ditemukan. Silakan pilih kunjungan terlebih dahulu.'
      })
      return
    }

    // If no billing ID, create a new billing first
    let currentBillingId = billingId.value
    if (!currentBillingId) {
      try {
        // Create a new billing for this visit
        const billingData = {
          visit_id: currentVisitId,
          patient_id: formData.value.patient_id,
          total_amount: calculateTreatmentTotal.value,
          discount_amount: 0,
          tax_amount: 0,
          grand_total: calculateTreatmentTotal.value,
          status: 'draft'
    }
    
        const billingResponse = await $api('/transaction/billings', {
      method: 'POST',
          body: billingData,
    })

        currentBillingId = billingResponse.data.id
        console.log('Created new billing with ID:', currentBillingId)
      } catch (billingError) {
        await showErrorAlert(billingError, {
          title: 'Gagal Membuat Billing',
          text: 'Tidak dapat membuat billing baru. Silakan coba lagi.'
        })
        return
      }
    }

    if (selectedTreatmentObjects.value.length === 0) {
        await showErrorAlert({
        title: 'Treatment Tidak Dipilih',
        text: 'Silakan pilih minimal satu treatment.'
        })
        return
      }

    // Create treatments using /rme/visit-treatments endpoint
    const createdTreatments = []
    const failedTreatments = []
      
      for (const treatment of selectedTreatmentObjects.value) {
        console.log('🔄 Processing treatment:', treatment)
        
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

      // Create current timestamp for performed_at and completed_at
      const now = new Date()
      const performedAt = new Date(now.getTime() - 30 * 60000) // 30 minutes ago
      const completedAt = now

        const visitTreatmentPayload = {
        visit_id: currentVisitId,
          treatment_id: treatment.id,
          doctor_id: doctorId,
          therapist_id: therapistId,
          quantity: 1,
          unit_price: parseFloat(treatment.price).toFixed(2),
          total_price: parseFloat(treatment.price).toFixed(2),
        treatment_notes: `Treatment created from billing ${billingId.value}`,
        performed_at: performedAt.toISOString(),
        completed_at: completedAt.toISOString(),
        billing_id: currentBillingId
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
        let errorMessage = `Pembuatan treatment "${treatment.name}" gagal.`
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
        text: `${failedTreatments.length} treatment gagal: ${failedNames}. Silakan cek data treatment.`
        })
    }
    
    if (createdTreatments.length > 0) {
    await showSuccessAlert(
        `${createdTreatments.length} treatment berhasil dibuat untuk billing ${currentBillingId}`,
      'Berhasil!',
    )
    }

    // Redirect back to billing detail page
    await router.push({ 
      name: 'transaction-billings-id', 
      params: { id: currentBillingId } 
    })
    
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
  currentBranchId.value = ''
  selectedPromo.value = null
}

// Cancel and go back
const goBack = () => {
  if (billingId.value) {
    router.push({ 
      name: 'transaction-billings-id', 
      params: { id: billingId.value } 
    })
  } else {
  router.push({ name: 'transaction-billings' })
  }
}
</script>

<template>
  <VRow>
    <VCol cols="12" md="8">
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex align-center gap-2">
            <VBtn
              icon="tabler-arrow-left"
              variant="text"
              size="small"
              @click="goBack"
            />
            Tambah Treatment untuk Billing
          </VCardTitle>
          <VCardSubtitle>
            Pilih treatment untuk ditambahkan ke billing {{ billingId }}
          </VCardSubtitle>
        </VCardItem>

        <VCardText>
          <VForm
            ref="refForm"
            @submit.prevent="submitForm"
            validate-on="submit"
          >
            <!-- Billing Information -->
            <VRow v-if="billingId && currentBranchId">
              <VCol cols="12">
                <VCard variant="outlined" color="info">
                  <VCardText class="pa-4">
                    <div class="d-flex align-center gap-2 mb-3">
                      <VIcon size="20" color="info">
                        tabler-receipt
                      </VIcon>
                      <h6 class="text-subtitle-1 font-weight-medium mb-0">
                        Informasi Billing
                      </h6>
                    </div>
                    <div class="d-flex justify-space-between align-center">
                      <span class="text-body-2">Billing ID:</span>
                      <span class="text-body-1 font-weight-medium">{{ billingId }}</span>
                    </div>
                    <div v-if="visitId" class="d-flex justify-space-between align-center">
                      <span class="text-body-2">Visit ID:</span>
                      <span class="text-body-1 font-weight-medium">{{ visitId }}</span>
                    </div>
                    <div v-if="currentBranchId" class="d-flex justify-space-between align-center">
                      <span class="text-body-2">Cabang ID:</span>
                      <span class="text-body-1 font-weight-medium">{{ currentBranchId }}</span>
                    </div>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>

            <!-- Visit Selection (when no billing data available) -->
            <VRow v-if="!billingId || !currentBranchId">
              <VCol cols="12">
                <!-- <VCol cols="12" md="8" > -->
                <VCard variant="outlined" color="warning">
                    <VCardText class="pa-4">
                      <div class="d-flex align-center gap-2 mb-3">
                        <VIcon size="20" color="warning">
                          tabler-alert-triangle
                        </VIcon>
                        <h6 class="text-subtitle-1 font-weight-medium mb-0">
                          Pilih Kunjungan Terlebih Dahulu
                        </h6>
                      </div>
                      <p class="text-body-2 text-medium-emphasis mb-3">
                        Data billing tidak ditemukan. Silakan pilih kunjungan untuk melanjutkan.
                      </p>
                      
                      <VRow>
                        <!-- Visit Selection -->
                          <VCol
                          cols="12"
                          md="6"
                        >
                          <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                                    Kunjungan *
                          </label>
                          <AppCombobox
                                    v-model="selectedVisit"
                                    placeholder="Pilih kunjungan..."
                                    :items="visits"
                                    :loading="loadingVisits"
                            :rules="[requiredValidator]"
                            required
                            clearable
                            hide-details="auto"
                                    return-object
                          />
                        </VCol>

                        <!-- Branch Display -->
                        <!-- <VCol cols="12" md="6">
                          <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                                    Cabang
                          </label>
                                  <VTextField
                                    :model-value="currentBranchId || 'Belum dipilih'"
                                    readonly
                                    variant="outlined"
                            hide-details="auto"
                                    prepend-inner-icon="tabler-building"
                          />
                                </VCol> -->
                        <VCol cols="12">
                          <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                            Tambah Gambar
                          </label>
                          <VCard  variant="outlined" class="pa-2">
                            
                            <div class="d-flex flex-wrap gap-2">
                              <!-- Loop Gambar Cards -->
                              <div v-for="(image, index) in imageCards" :key="index" class="d-flex flex-column align-center">
                                <VCard max-width="165px">
                                  <VImg :src="image.url || noimage" height="120" cover />
                                  <VCardText class="d-flex justify-center">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      hidden
                                      :ref="el => fileInputs[index] = el"
                                      @change="onImageChange($event, index)"
                                    />
                                    <VBtn @click="fileInputs[index].click()" color="primary" size="small">
                                      + Gambar
                                    </VBtn >
                                    <VBtn class="ml-2" color="error" icon @click="removeItem(index)" size="30">
                                      <VIcon icon="tabler-trash" size="20" />
                                    </VBtn>

                                  </VCardText>
                                </VCard>
                              </div>

                              <!-- Card Tambah Gambar -->
                              <div class="d-flex flex-column align-center justify-center">
                                <VCard
                                  class="d-flex align-center justify-center"
                                  width="180"
                                  height="160"
                                  style="cursor: pointer;"
                                  @click="addNewCard"
                                >
                                  <VIcon icon="tabler-plus" size="40" />
                                </VCard>
                              </div>
                            </div>
                            
                          </VCard>
                        </VCol>
                      </VRow>
                    </VCardText>
                  </VCard>
                <!-- </VCol> -->
                
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
                  <span v-else-if="currentBranchId">Tidak ada treatments tersedia untuk cabang ini</span>
                  <span v-else>Pilih kunjungan terlebih dahulu untuk memuat treatments</span>
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

            <!-- Doctor Schedule Section -->
            <VRow v-if="schedules.length > 0">
              <VCol cols="12">
                <VCard variant="outlined" class="pa-4">
                  <VCardTitle class="text-h6 mb-4">
                    <VIcon start color="primary">
                      tabler-calendar-time
                    </VIcon>
                    Jadwal Tersedia Dokter
                  </VCardTitle>
                  
                  <VRow>
                    <VCol 
                      v-for="schedule in schedules" 
                      :key="schedule.id" 
                      cols="12" 
                      md="6"
                    >
                      <VCard variant="outlined" class="pa-4">
                        <div class="d-flex align-center gap-3 mb-3">
                          <VIcon size="24" color="primary">
                            tabler-user-md
                          </VIcon>
                          <div>
                            <h6 class="text-subtitle-1 font-weight-bold mb-1">
                              {{ schedule.doctor_name }}
                            </h6>
                            <p class="text-caption text-medium-emphasis mb-0">
                              {{ schedule.day }} • {{ schedule.start_time }} - {{ schedule.end_time }}
                            </p>
                          </div>
                        </div>
                        
                        <VDivider class="my-3" />
                        
                        <div class="d-flex justify-space-between align-center mb-2">
                          <span class="text-body-2">Slot Tersedia:</span>
                          <VChip 
                            :color="schedule.available_slots > 0 ? 'success' : 'error'"
                            size="small"
                          >
                            {{ schedule.available_slots }} / {{ schedule.max_appointments }}
                          </VChip>
                        </div>
                        
                        <div class="d-flex justify-space-between align-center mb-2">
                          <span class="text-body-2">Durasi:</span>
                          <span class="text-body-1 font-weight-medium">
                            {{ schedule.duration_hours }} jam
                          </span>
                        </div>
                        
                        <div v-if="schedule.break_start_time && schedule.break_end_time" class="d-flex justify-space-between align-center mb-2">
                          <span class="text-body-2">Istirahat:</span>
                          <span class="text-body-1 font-weight-medium">
                            {{ schedule.break_start_time }} - {{ schedule.break_end_time }}
                          </span>
                        </div>
                        
                        <VDivider class="my-3" />
                        
                        <div class="mb-3">
                          <h6 class="text-subtitle-2 font-weight-medium mb-2">Slot Waktu Tersedia:</h6>
                          <div class="d-flex flex-wrap gap-2">
                            <VChip
                              v-for="timeSlot in schedule.available_time_slots"
                              :key="`${timeSlot.start_time}-${timeSlot.end_time}`"
                              color="primary"
                              variant="outlined"
                              size="small"
                            >
                              {{ timeSlot.start_time }} - {{ timeSlot.end_time }}
                            </VChip>
                          </div>
                        </div>
                        
                        <div v-if="schedule.notes" class="mt-3 pa-3 bg-info-lighten-5 rounded">
                          <div class="d-flex align-center gap-2">
                            <VIcon size="16" color="info">
                              tabler-info-circle
                            </VIcon>
                            <span class="text-caption text-info">
                              {{ schedule.notes }}
                            </span>
                          </div>
                        </div>
                      </VCard>
                    </VCol>
                  </VRow>
                </VCard>
              </VCol>
            </VRow>

            <!-- Available Time Slots -->
            <VRow v-if="availableTimeSlots.length > 0">
              <VCol cols="12">
                <VCard variant="outlined" class="pa-4">
                  <VCardTitle class="text-h6 mb-4">
                    <VIcon start color="success">
                      tabler-clock-check
                    </VIcon>
                    Slot Waktu Tersedia
                  </VCardTitle>
                  
                  <VRow>
                    <VCol 
                      v-for="timeSlot in availableTimeSlots" 
                      :key="`${timeSlot.schedule_id}-${timeSlot.start_time}-${timeSlot.end_time}`" 
                      cols="12" 
                      md="4"
                    >
                      <VCard 
                        variant="outlined" 
                        class="pa-3 time-slot-card"
                        :class="{ 'selected-time-slot': selectedTimeSlot === timeSlot }"
                      >
                        <div class="d-flex align-center gap-3">
                          <VIcon size="24" color="primary">
                            tabler-clock
                          </VIcon>
                          <div class="flex-grow-1">
                            <h6 class="text-subtitle-1 font-weight-bold mb-1">
                              {{ timeSlot.start_time }} - {{ timeSlot.end_time }}
                            </h6>
                            <p class="text-caption text-medium-emphasis mb-0">
                              {{ timeSlot.day }} • {{ timeSlot.doctor_name }}
                            </p>
                          </div>
                        </div>
                      </VCard>
                    </VCol>
                  </VRow>
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
                    <VCol cols="12" md="6">
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
                    <VCol cols="12" md="6">
                      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                        Jumlah Treatment
                      </label>
                      <VTextField
                        :model-value="selectedTreatmentObjects.length"
                        type="number"
                        readonly
                        density="comfortable"
                        variant="outlined"
                        color="info"
                      />
                    </VCol>
                  </VRow>
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
                Tambah Treatment ke Billing
              </VBtn>
            </div>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="4">
      <div style="position: sticky; inset-block: 4rem 0;">
        <VCard  >
          <div>
            <VCardTitle class="text-center  text-h6 text-wrap">Hasil Konsultasi </VCardTitle>
            <div class="pa-2 pt-3 d-flex justify-space-between align-start ">
              <!-- <VImg height="60px" :src="moztu" contain /> -->
              <VCardTitle class="  text-h6 text-wrap">Dokter : </VCardTitle>
              <VCardTitle class="  text-h6 text-wrap">Dr. Amanda Putri, Sp.KK  </VCardTitle>
            </div>
            <VCard variant="outlined" color="warning">
              <!-- if(){ -->
                  <VCardTitle class=" text-left text-h6 text-wrap">Rekomendasi :</VCardTitle>
                <div>
                    <div v-for="(item, index) in tret" :key="index" class="d-flex align-center mb-2">
                        <VIcon icon="tabler-circle" size="10" class="mr-2 ml-5"  />
                        <div class="d-flex justify-space-between align-start flex-grow-1">
                          <span style="font-size: 13px;">{{ item.name }}</span>
                          <span class="mr-10" style="font-size: 13px; white-space: nowrap;">{{formatRupiah (item.price) }}</span>
                        </div>
                    </div>
                </div>
                <!-- } -->
            </VCard>
          </div>
        </VCard>
        </div>
    </VCol>
  </VRow>
</template> 

<style lang="scss" scoped>
.time-slot-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: rgba(25, 118, 210, 0.3);
  }
  
  &.selected-time-slot {
    border-color: #1976d2;
    background: linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05));
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
  }
}
</style> 
