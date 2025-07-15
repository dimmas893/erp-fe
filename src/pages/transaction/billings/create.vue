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

// Update form data structure
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

// Add new refs and state for branch, doctor, service type, treatments, products
const branches = ref([])
const loadingBranches = ref(false)
const doctors = ref([])
const loadingDoctors = ref(false)
const treatments = ref([])
const loadingTreatments = ref(false)
const products = ref([])
const loadingProducts = ref(false)
const therapists = ref([])
const loadingTherapists = ref(false)

// Tambah state untuk multi select treatment
const selectedTreatment = ref([])

// Tambah state untuk jenis konsultasi
const consultationServices = ref([])
const loadingConsultationServices = ref(false)
const selectedConsultationService = ref('')
const consultationFee = ref('') // Tambah state untuk fee konsultasi

// Set default value of serviceType to empty string
const serviceType = ref('') // '' means not selected
// Change selectedBranch to be a string (branch id)
const selectedBranch = ref('') // string, not object
const selectedDoctor = ref('')
const selectedTherapist = ref('')
const selectedTreatments = ref([])
const selectedProducts = ref([])

// onMounted: load initial data
onMounted(async () => {
  await Promise.all([
    loadBranches(),
    loadPromos(),
    loadPaymentMethods(),
  ])
  await loadConsultationServices()
})

// Auto-fill form when visit is selected
const onVisitSelected = visitId => {
  const visit = visits.value.find(v => v.value === visitId)?.data
  if (visit) {
    selectedVisit.value = visit

    // Auto-fill form data from visit
    formData.value.patient_id = visit.patient_id
    // Jangan set formData.value.visit_id di sini, biarkan dari combobox
    selectedBranch.value = visit.branch_id
    selectedDoctor.value = visit.doctor_id
    
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
    console.error('Error loading promos:', error)
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
  console.log('loadDoctors called with:', branchId)
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
    console.log('Doctors loaded:', doctors.value)
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
  console.log('loadTherapists called with:', branchId)
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
    console.log('Therapists loaded:', therapists.value)
  } catch (error) {
    console.error('Error fetching therapists, using doctors as fallback:', error)

    // Fallback: use doctors as therapists if therapists endpoint doesn't exist
    // Try to get doctors for this branch as fallback
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
      console.error('Error fetching doctors as fallback:', fallbackError)
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
    console.log('🔍 Raw treatment items from API:', treatmentItems)
    
    // Fetch treatment details for each item
    const treatmentDetails = await Promise.all(treatmentItems.map(async item => {
      let treatmentName = item.item_id
      try {
        const detail = await $api(`/crm/treatments/${item.item_id}`, { method: 'GET' })
        treatmentName = detail.data?.name || item.item_id
        console.log('✅ Treatment detail fetched:', detail.data)
      } catch (e) {
        console.log('⚠️ Failed to fetch treatment detail for ID:', item.item_id, 'Error:', e)
      }
      
      const mappedItem = {
        title: `${treatmentName} - ${item.final_price_formatted}`,
        value: item.item_id,
        price: parseFloat(item.final_price),
        priceFormatted: item.final_price_formatted,
        raw: item,
      }
      console.log('🔍 Mapped treatment item:', mappedItem)
      return mappedItem
    }))
    
    treatments.value = treatmentDetails
    console.log('✅ Treatments loaded with pricing:', treatments.value)
  } catch (error) {
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Treatment',
      text: 'Tidak dapat memuat daftar treatment cabang. Silakan refresh halaman.',
    })
  } finally {
    loadingTreatments.value = false
  }
}

// Fetch products for selected branch using branch-pricing endpoint
const loadProducts = async (branchId = null) => {
  if (!branchId) {
    products.value = []
    return
  }
  try {
    loadingProducts.value = true
    const response = await $api(`/wms/branch-pricing/branch/${branchId}`, {
      method: 'GET',
    })
    const productItems = (response.data || []).filter(item => item.item_type === 'PRODUCT')
    
    // Fetch product details for each item
    const productDetails = await Promise.all(productItems.map(async item => {
      let productName = item.item_id
      try {
        const detail = await $api(`/wms/products/${item.item_id}`, { method: 'GET' })
        productName = detail.data?.name || item.item_id
      } catch (e) {}
      
      return {
        title: `${productName} - ${item.final_price_formatted}`,
        value: item.item_id,
        price: parseFloat(item.final_price),
        priceFormatted: item.final_price_formatted,
        raw: item
      }
    }))
    
    products.value = productDetails
    console.log('✅ Products loaded with pricing:', products.value)
  } catch (error) {
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Produk',
      text: 'Tidak dapat memuat daftar produk cabang. Silakan refresh halaman.'
    })
  } finally {
    loadingProducts.value = false
  }
}



// Fetch visits for selected branch
const loadVisits = async branchId => {
  console.log('loadVisits called with:', branchId)
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
    console.log('Visits loaded:', visits.value)
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
  selectedDoctor.value = ''
  selectedTherapist.value = ''
  formData.value.visit_id = ''
  selectedVisit.value = null
  selectedProducts.value = []
  selectedConsultationService.value = ''
  consultationFee.value = ''

  if (branchId) {
    await Promise.all([
      loadDoctors(branchId),
      loadTherapists(branchId),
      loadVisits(branchId),
      loadProducts(branchId),
      loadTreatments(branchId)
    ])
  } else {
    doctors.value = []
    therapists.value = []
    visits.value = []
    products.value = []
    treatments.value = []
  }
})

// Watcher serviceType: hanya untuk produk dan konsultasi
watch(serviceType, async (val) => {
  if (val === 'product' && selectedBranch) {
    const branchId = typeof selectedBranch === 'object' && selectedBranch !== null ? selectedBranch.value : selectedBranch
    await loadProducts(branchId)
    await loadTherapists(branchId)
  }
  if (val === 'consultation') {
    await loadConsultationServices()
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

// Computed property to get service type value
const currentServiceType = computed(() => {
  const serviceTypeValue = serviceType.value || serviceType
  return typeof serviceTypeValue === 'object' && serviceTypeValue !== null 
    ? serviceTypeValue.value 
    : serviceTypeValue
})

// Computed property to check if it's consultation
const isConsultationService = computed(() => {
  return currentServiceType.value === 'consultation'
})

// Computed property to check if it's treatment
const isTreatmentService = computed(() => {
  return currentServiceType.value === 'tindakan'
})

// Computed property to check if it's product
const isProductService = computed(() => {
  return currentServiceType.value === 'product'
})

// Calculate total amount for treatments
const calculateTreatmentTotal = computed(() => {
  if (!selectedTreatment.value || selectedTreatment.value.length === 0) return 0
  
  // Debug log
  console.log('🧮 selectedTreatment:', selectedTreatment.value)
  console.log('🧮 treatments.value:', treatments.value)

  const total = selectedTreatment.value.reduce((total, treatmentId) => {
    // Pastikan treatmentId adalah string
    const id = typeof treatmentId === 'object' && treatmentId !== null ? treatmentId.value : treatmentId
    const treatment = treatments.value.find(t => t.value === id)
    console.log('🧮 Processing treatmentId:', id, 'Found treatment:', treatment, 'Price:', treatment?.price)
    return total + (treatment?.price || 0)
  }, 0)
  
  console.log('🧮 Final treatment total:', total)
  return total
})

// Calculate total amount for products
const calculateProductTotal = computed(() => {
  if (!selectedProducts.value || selectedProducts.value.length === 0) return 0
  
  const total = selectedProducts.value.reduce((total, productId) => {
    // Pastikan productId adalah string
    const id = typeof productId === 'object' && productId !== null ? productId.value : productId
    const product = products.value.find(p => p.value === id)
    console.log('🧮 Processing productId:', id, 'Found product:', product, 'Price:', product?.price)
    return total + (product?.price || 0)
  }, 0)
  
  console.log('🧮 Final product total:', total)
  return total
})

// Calculate discount based on selected promo
const calculateDiscount = computed(() => {
  console.log('🔍 calculateDiscount called with selectedPromo:', selectedPromo.value)
  console.log('🔍 Available promos:', promos.value)
  
  if (!selectedPromo.value) {
    console.log('❌ No selectedPromo.value')
    return 0
  }
  
  // Handle case where selectedPromo might be an object
  const promoId = typeof selectedPromo.value === 'object' && selectedPromo.value !== null 
    ? selectedPromo.value.value 
    : selectedPromo.value
    
  console.log('🔍 Extracted promoId:', promoId)
  
  const promo = promos.value.find(p => p.value === promoId)?.data
  console.log('🔍 Found promo:', promo)
  
  if (!promo) {
    console.log('❌ No promo found for promoId:', promoId)
    return 0
  }
  
  // Get the current total based on service type
  let subtotal = 0
  
  if (isConsultationService.value && consultationFee.value) {
    subtotal = parseFloat(consultationFee.value) || 0
  } else if (isTreatmentService.value) {
    subtotal = calculateTreatmentTotal.value
  } else if (isProductService.value) {
    subtotal = calculateProductTotal.value
  } else {
    subtotal = parseFloat(formData.value.total_amount) || 0
  }
  
  console.log('🔍 Discount calculation debug:', {
    selectedPromo: selectedPromo.value,
    promo: promo,
    subtotal: subtotal,
    discountType: promo.discount_type,
    discountValue: promo.discount_value,
    minPurchase: promo.min_purchase,
    isConsultation: isConsultationService.value,
    consultationFee: consultationFee.value,
    isTreatment: isTreatmentService.value,
    treatmentTotal: calculateTreatmentTotal.value,
    isProduct: isProductService.value,
    productTotal: calculateProductTotal.value
  })
  
  // Check minimum purchase requirement
  if (promo.min_purchase && subtotal < parseFloat(promo.min_purchase)) {
    console.log('❌ Minimum purchase not met:', subtotal, '<', promo.min_purchase)
    return 0
  }
  
  let discount = 0
  if (promo.discount_type === 'percentage') {
    // Percentage: total * discount_value / 100
    discount = (subtotal * parseFloat(promo.discount_value) / 100)
    console.log('✅ Percentage discount calculated:', subtotal, '*', promo.discount_value, '/ 100 =', discount)
  } else if (promo.discount_type === 'nominal' || promo.discount_type === 'fixed') {
    // Nominal/Fixed: direct discount value
    discount = parseFloat(promo.discount_value)
    console.log('✅ Nominal discount applied:', discount)
  }
  
  console.log('💰 Final discount amount:', discount)
  return discount
})

const calculateGrandTotal = () => {
  let total = 0
  
  // For consultation, use consultation fee as the base total
  if (isConsultationService.value && consultationFee.value) {
    total = parseFloat(consultationFee.value) || 0
    formData.value.total_amount = total.toString()
  }
  
  // For treatments, calculate total from selected treatments
  if (isTreatmentService.value) {
    total = calculateTreatmentTotal.value
    formData.value.total_amount = total.toString()
  }
  
  // For products, calculate total from selected products
  if (isProductService.value) {
    total = calculateProductTotal.value
    formData.value.total_amount = total.toString()
  }
  
  // Calculate discount from selected promo
  const promoDiscount = calculateDiscount.value
  formData.value.discount_amount = promoDiscount.toString()
  
  const discount = parseFloat(formData.value.discount_amount) || 0
  const tax = parseFloat(formData.value.tax_amount) || 0
  
  // Apply discount to grand total: total - discount + tax
  formData.value.grand_total = (total - discount + tax).toFixed(2)
  
  console.log('💰 Calculated grand total:', {
    total,
    discount,
    tax,
    grandTotal: formData.value.grand_total,
    consultationFee: consultationFee.value,
    treatmentTotal: calculateTreatmentTotal.value,
    productTotal: calculateProductTotal.value,
    promoDiscount,
    discountType: selectedPromo.value ? (() => {
      const promoId = typeof selectedPromo.value === 'object' && selectedPromo.value !== null 
        ? selectedPromo.value.value 
        : selectedPromo.value
      return promos.value.find(p => p.value === promoId)?.data?.discount_type || 'none'
    })() : 'none'
  })
}

// Watch for changes in amounts to auto-calculate grand total
watch([
  () => formData.value.total_amount,
  () => formData.value.discount_amount,
  () => formData.value.tax_amount,
  () => consultationFee.value,
  () => selectedTreatment.value,
  () => selectedProducts.value,
  () => selectedPromo.value,
  () => calculateDiscount.value, // Add discount calculation to watchers
], () => {
  calculateGrandTotal()
})

// Fetch consultation services
const loadConsultationServices = async () => {
  try {
    loadingConsultationServices.value = true
    const response = await $api('/crm/services', { method: 'GET' })
    consultationServices.value = (response.data || []).filter(s => s.service_type === 'CONSULTATION' && s.is_active).map(s => ({
      title: s.name,
      value: s.id,
      raw: s
    }))
  } catch (error) {
    await showErrorAlert(error, {
      title: 'Gagal Memuat Jenis Konsultasi',
      text: 'Tidak dapat memuat daftar jenis konsultasi. Silakan refresh halaman.'
    })
  } finally {
    loadingConsultationServices.value = false
  }
}

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
      consultation_service_id: ((serviceType.value || serviceType) === 'consultation') ? selectedConsultationService.value : undefined,
    }
    
    console.log('🔍 Debug info:', {
      serviceType: serviceType.value,
      currentServiceType: serviceType.value || serviceType,
      consultationFee: consultationFee.value,
      formDataGrandTotal: formData.value.grand_total,
      isConsultation: (serviceType.value || serviceType) === 'consultation'
    })
    
    // Add amounts based on service type
    console.log('🔍 Service type check:', {
      serviceType: serviceType.value,
      serviceTypeRaw: serviceType,
      currentServiceType: currentServiceType.value,
      isConsultation: isConsultationService.value,
      isTreatment: isTreatmentService.value,
      isProduct: isProductService.value,
      consultationFee: consultationFee.value,
      treatmentTotal: calculateTreatmentTotal.value,
      productTotal: calculateProductTotal.value
    })
    
    if (isConsultationService.value && consultationFee.value) {
      const fee = parseFloat(consultationFee.value)
      submitData.total_amount = fee
      submitData.grand_total = parseFloat(formData.value.grand_total) || fee
      console.log('📤 Billing data with consultation fee:', {
        total_amount: submitData.total_amount,
        grand_total: submitData.grand_total,
        consultation_fee: consultationFee.value
      })
    } else if (isTreatmentService.value && selectedTreatment.value.length > 0) {
      const total = calculateTreatmentTotal.value
      submitData.total_amount = total
      submitData.grand_total = parseFloat(formData.value.grand_total) || total
      console.log('📤 Billing data with treatment total:', {
        total_amount: submitData.total_amount,
        grand_total: submitData.grand_total,
        treatment_total: total,
        selected_treatments: selectedTreatment.value
      })
    } else if (isProductService.value && selectedProducts.value.length > 0) {
      const total = calculateProductTotal.value
      submitData.total_amount = total
      submitData.grand_total = parseFloat(formData.value.grand_total) || total
      console.log('📤 Billing data with product total:', {
        total_amount: submitData.total_amount,
        grand_total: submitData.grand_total,
        product_total: total,
        selected_products: selectedProducts.value
      })
    } else {
      // For non-consultation or when no fee, set default values
      submitData.total_amount = parseFloat(formData.value.total_amount) || 0
      submitData.grand_total = parseFloat(formData.value.grand_total) || 0
      console.log('📤 Billing data without specific service:', {
        total_amount: submitData.total_amount,
        grand_total: submitData.grand_total
      })
    }
    
    console.log('📤 Final billing submit data:', submitData)
    console.log('📤 API call to /transaction/billings with body:', JSON.stringify(submitData, null, 2))
    console.log('🔍 Promo ID debug:', {
      selectedPromoValue: selectedPromo.value,
      promoIdType: typeof promoId,
      promoIdValue: promoId
    })
    const response = await $api('/transaction/billings', {
      method: 'POST',
      body: submitData,
    })

    // Tambah insert visit consultation jika serviceType konsulta 
      // TODO: Ganti hardcode dengan value dari UI jika sudah ada
      const consultationPayload = {
        visit_id: visitId,
        doctor_id: typeof selectedDoctor.value === 'object' && selectedDoctor.value !== null
          ? selectedDoctor.value.value
          : selectedDoctor.value,
        service_id: typeof selectedConsultationService.value === 'object' && selectedConsultationService.value !== null
          ? selectedConsultationService.value.value
          : selectedConsultationService.value,
        consultation_type: 'INITIAL', // hardcoded, ganti jika ada field
        fee: consultationFee.value || '0'
      }
      try {
        await $api('/rme/visit-consultations', {
          method: 'POST',
          body: consultationPayload,
        })
      } catch (consultationError) {
        // Jika gagal, tetap lanjut, tapi tampilkan error
        await showErrorAlert(consultationError, {
          title: 'Gagal Membuat Visit Consultation',
          text: 'Tagihan berhasil, tapi pembuatan konsultasi gagal. Silakan cek data kunjungan.'
        })
      } 
    console.log('response', serviceType.value)
    await showSuccessAlert(
      `Tagihan berhasil dibuat dengan ID: ${response.data.id}`,
      'Berhasil!',
    )

    // Redirect to previous page
    await router.back()
    
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
  selectedDoctor.value = ''
  selectedTherapist.value = ''
  selectedTreatments.value = []
  selectedProducts.value = []
  selectedTreatment.value = []
  serviceType.value = ''
  selectedBranch.value = ''
  selectedConsultationService.value = ''
  consultationFee.value = ''
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
        Tambah Tagihan Baru
      </VCardTitle>
      <VCardSubtitle>
        Lengkapi data tagihan untuk membuat tagihan baru
      </VCardSubtitle>
    </VCardItem>

    <!-- DEBUG LOG -->
    <VCardText>
      <div style="color: #888; font-size: 12px; margin-bottom: 8px;">
        selectedBranch: {{ selectedBranch }} | serviceType: {{ serviceType }} | 
        consultationFee: {{ consultationFee }} | 
        selectedPromo: {{ selectedPromo }} | 
        grandTotal: {{ formData.grand_total }} | 
        totalAmount: {{ formData.total_amount }} | 
        discountAmount: {{ formData.discount_amount }}
      </div>
    </VCardText>

    <VCardText>
      <VForm
        ref="refForm"
        @submit.prevent="submitForm"
        validate-on="submit"
      >
        <VRow>
          <!-- Data Cabang & Layanan -->
          <VCol
            cols="12"
            md="6"
          >
            <AppCombobox
              v-model="selectedBranch"
              label="Cabang"
              placeholder="Pilih cabang..."
              :items="branches"
              :loading="loadingBranches"
              :rules="[requiredValidator]"
              required
              clearable
              hide-details="auto"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <AppCombobox
              v-model="serviceType"
              label="Jenis Layanan"
              placeholder="Pilih jenis layanan..."
              :items="[
                { title: 'Konsultasi', value: 'consultation' },
                { title: 'Tindakan', value: 'tindakan' },
                { title: 'Produk', value: 'product' }
              ]"
              :rules="[requiredValidator]"
              required
              clearable
              hide-details="auto"
            />
          </VCol>

          <!-- Jenis Konsultasi (hanya untuk konsultasi) -->
          <VCol 
            v-if="selectedBranch && isConsultationService" 
            cols="12"
            md="6"
          >
            <AppCombobox
              v-model="selectedConsultationService"
              label="Jenis Konsultasi"
              placeholder="Pilih jenis konsultasi..."
              :items="consultationServices"
              :loading="loadingConsultationServices"
              :rules="[requiredValidator]"
              required
              clearable
              hide-details="auto"
            />
          </VCol>
          <!-- Visit Autocomplete (only show after branch is selected) -->
          <VCol
            v-if="selectedBranch"
            cols="12"
            md="6"
          >
            <AppCombobox
              v-model="formData.visit_id"
              label="Kunjungan"
              placeholder="Pilih kunjungan..."
              :items="visits"
              :loading="loadingVisits"
              :rules="[requiredValidator]"
              required
              clearable
              hide-details="auto"
            />
          </VCol>
          <!-- Doctor selection (only for consultation) -->
          <VCol 
            v-if="selectedBranch && isConsultationService" 
            cols="12"
            md="6"
          >
            <AppCombobox
              v-model="selectedDoctor"
              label="Dokter"
              placeholder="Cari dokter..."
              :items="doctors"
              :loading="loadingDoctors"
              :rules="[requiredValidator]"
              required
              clearable
              hide-details="auto"
            />
          </VCol>
          
          <!-- Consultation Fee (only for consultation) -->
          <VCol 
            v-if="selectedBranch && isConsultationService" 
            cols="12"
            md="6"
          >
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Biaya Konsultasi
            </label>
            <VTextField
              v-model="consultationFee"
              placeholder="Masukkan biaya konsultasi..."
              type="number"
              variant="outlined"
              :rules="[requiredValidator, amountValidator]"
              required
              hide-details="auto"
              prepend-inner-icon="tabler-currency-dollar"
            />
          </VCol>

          <VCol
            v-if="selectedBranch && isTreatmentService" 
            cols="12"
            md="6"
          >
            <AppCombobox
              v-model="selectedTreatment"
              label="Tindakan"
              placeholder="Pilih tindakan..."
              :items="treatments"
              :loading="loadingTreatments"
              :rules="[requiredValidator]"
              required
              clearable
              multiple
              hide-details="auto"
            />
          </VCol>
          <VCol
            v-if="selectedBranch && isTreatmentService" 
            cols="12"
            md="6"
          >
            <AppCombobox
              v-model="selectedTherapist"
              label="Terapis"
              placeholder="Pilih terapis..."
              :items="therapists"
              :loading="loadingTherapists"
              :rules="[requiredValidator]"
              required
              clearable
              hide-details="auto"
            />
          </VCol>
          <!-- Product & Therapist (only for produk) -->
          <VCol
          v-if="selectedBranch && serviceType.value === 'product'" 
           cols="12" md="6">
            <AppCombobox
              v-model="selectedProducts"
              label="Produk (bisa lebih dari satu)"
              placeholder="Pilih produk..."
              :items="products"
              :loading="loadingProducts"
              multiple
              clearable
              hide-details="auto"
            />
          </VCol>
          
          <!-- Promo Selection -->
          <VCol
            v-if="selectedBranch && formData.visit_id"
            cols="12"
            md="6"
          >
            <AppCombobox
              v-model="selectedPromo"
              label="Promo (Opsional)"
              placeholder="Pilih promo..."
              :items="promos"
              :loading="loadingPromos"
              clearable
              hide-details="auto"
            />
          </VCol>
        </VRow>
        
        <!-- Combined Summary Card -->
        <VRow v-if="(isConsultationService && consultationFee) || (isTreatmentService && selectedTreatment.length) || (isProductService && selectedProducts.length)">
          <VCol cols="12">
            <VCard variant="outlined" color="info">
              <VCardText class="pa-4">
                <div class="d-flex align-center gap-2 mb-3">
                  <VIcon size="20" color="info">
                    tabler-calculator
                  </VIcon>
                  <h6 class="text-subtitle-1 font-weight-medium mb-0">
                    Ringkasan Biaya
                  </h6>
                </div>
                
                <!-- Subtotal Section -->
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-2">
                    {{ isConsultationService ? 'Biaya Konsultasi:' : isTreatmentService ? 'Total Tindakan:' : 'Total Produk:' }}
                  </span>
                  <span class="text-body-1 font-weight-medium">
                    {{ formatCurrency(isConsultationService ? consultationFee : isTreatmentService ? calculateTreatmentTotal : calculateProductTotal) }}
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
                  const subtotal = isConsultationService ? (parseFloat(consultationFee) || 0) : 
                                 isTreatmentService ? calculateTreatmentTotal : 
                                 isProductService ? calculateProductTotal : 0
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
                  const subtotal = isConsultationService ? (parseFloat(consultationFee) || 0) : 
                                 isTreatmentService ? calculateTreatmentTotal : 
                                 isProductService ? calculateProductTotal : 0
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
