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

// Form data structure for consultation
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

// Tambah state untuk jenis konsultasi
const consultationServices = ref([])
const loadingConsultationServices = ref(false)
const selectedConsultationService = ref('')
const consultationFee = ref('') // Tambah state untuk fee konsultasi

// Set default value of serviceType to consultation
const serviceType = ref('consultation') // Fixed to consultation
// Change selectedBranch to be a string (branch id)
const selectedBranch = ref('') // string, not object
const selectedDoctor = ref('')

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

    // const response = await $api('/hris/doctors/paginated', {
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

    const response = await $api(`/hris/doctors/branch/${branchId}`, {
      method: 'GET',
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
  formData.value.visit_id = ''
  selectedVisit.value = null
  selectedConsultationService.value = ''
  consultationFee.value = ''

  if (branchId) {
    await Promise.all([
      loadDoctors(branchId),
      loadVisits(branchId),
    ])
  } else {
    doctors.value = []
    visits.value = []
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
  
  // Get the current total based on consultation fee
  const subtotal = parseFloat(consultationFee.value) || 0
  
  console.log('🔍 Discount calculation debug:', {
    selectedPromo: selectedPromo.value,
    promo: promo,
    subtotal: subtotal,
    discountType: promo.discount_type,
    discountValue: promo.discount_value,
    minPurchase: promo.min_purchase,
    consultationFee: consultationFee.value
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
  total = parseFloat(consultationFee.value) || 0
  formData.value.total_amount = total.toString()
  
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
      consultation_service_id: selectedConsultationService.value,
    }
    
    // Add amounts based on consultation service
    if (consultationFee.value) {
      const fee = parseFloat(consultationFee.value)
      submitData.total_amount = fee
      submitData.grand_total = parseFloat(formData.value.grand_total) || fee
      console.log('📤 Billing data with consultation fee:', {
        total_amount: submitData.total_amount,
        grand_total: submitData.grand_total,
        consultation_fee: consultationFee.value
      })
    } else {
      // For when no fee, set default values
      submitData.total_amount = parseFloat(formData.value.total_amount) || 0
      submitData.grand_total = parseFloat(formData.value.grand_total) || 0
      console.log('📤 Billing data without consultation fee:', {
        total_amount: submitData.total_amount,
        grand_total: submitData.grand_total
      })
    }
    
    console.log('📤 Final billing submit data:', submitData)
    console.log('📤 API call to /transaction/billings with body:', JSON.stringify(submitData, null, 2))
    
    const response = await $api('/transaction/billings', {
      method: 'POST',
      body: submitData,
    })

    // Tambah insert visit consultation
    if (consultationFee.value) {
      const consultationPayload = {
        billing_id: response.data.id,
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
    }

    await showSuccessAlert(
      `Tagihan konsultasi berhasil dibuat dengan ID: ${response.data.id}`,
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
        Tambah Tagihan Konsultasi
      </VCardTitle>
      <VCardSubtitle>
        Lengkapi data tagihan konsultasi untuk membuat tagihan baru
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

          <!-- Visit Autocomplete (only show after branch is selected) -->
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

          <!-- Jenis Konsultasi -->
          <VCol  
            cols="12"
            md="6"
          >
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Jenis Konsultasi *
            </label>
            <AppCombobox
              v-model="selectedConsultationService"
              placeholder="Pilih jenis konsultasi..."
              :items="consultationServices"
              :loading="loadingConsultationServices"
              :rules="[requiredValidator]"
              required
              clearable
              hide-details="auto"
            />
          </VCol>

          <!-- Doctor selection -->
          <VCol  
            cols="12"
            md="6"
          >
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Dokter *
            </label>
            <AppCombobox
              v-model="selectedDoctor"
              placeholder="Cari dokter..."
              :items="doctors"
              :loading="loadingDoctors"
              :rules="[requiredValidator]"
              required
              clearable
              hide-details="auto"
            />
          </VCol>

          <!-- Consultation Fee -->
          <VCol 
            cols="12"
            md="6"
          >
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Biaya Konsultasi *
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
            <div class="text-caption text-medium-emphasis mt-1">
              <VIcon size="14" class="me-1">tabler-info-circle</VIcon>
              Biaya akan dihitung otomatis di ringkasan
            </div>
          </VCol>
          
          <!-- Promo Selection -->
          <VCol
            v-if="selectedBranch && formData.visit_id"
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

        <!-- Cost Summary Section -->
        <VRow>
          <VCol cols="12">
            <VCard variant="outlined" class="pa-4">
              <VCardTitle class="text-h6 mb-4">
                <VIcon start color="primary">
                  tabler-calculator
                </VIcon>
                Ringkasan Biaya Konsultasi
              </VCardTitle>
              <VRow>
                <VCol cols="12" md="4">
                  <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                    Biaya Konsultasi
                  </label>
                  <VTextField
                    :model-value="consultationFee || 0"
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
                  <span class="text-body-2">Biaya Konsultasi:</span>
                  <span class="text-body-1 font-weight-medium">
                    {{ formatCurrency(consultationFee) }}
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
                  const subtotal = parseFloat(consultationFee) || 0
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
                  const subtotal = parseFloat(consultationFee) || 0
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
            :disabled="isLoading || !consultationFee"
            color="primary"
          >
            <VIcon start icon="tabler-device-floppy" />
            Buat Tagihan Konsultasi
          </VBtn>
        </div>
      </VForm>
    </VCardText>
  </VCard>
</template> 
