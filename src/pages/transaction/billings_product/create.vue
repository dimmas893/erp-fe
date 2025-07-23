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

// Form data structure for product
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

// Product-specific form data - will be an object with product IDs as keys
const productFormData = ref({})

// Form validation
const refForm = ref()
const isLoading = ref(false)

// Options
const statusOptions = [
  { title: 'Draft', value: 'draft' },
  { title: 'Unpaid', value: 'unpaid' },
  { title: 'Paid', value: 'paid' },
]

// Usage type options for products
const usageTypeOptions = [
  { title: 'Resep', value: 'PRESCRIPTION' },
  { title: 'Administrasi', value: 'ADMINISTRATION' },
  { title: 'Prosedur', value: 'PROCEDURE' },
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

// Add new refs and state for branch, therapist, products
const branches = ref([])
const loadingBranches = ref(false)
const therapists = ref([])
const loadingTherapists = ref(false)
const products = ref([])
const loadingProducts = ref(false)

// Tambah state untuk multi select product
const selectedProducts = ref([]) // Array of product IDs for multi-select
const selectedProductObjects = ref([]) // Array of product objects with therapist

// Set default value of serviceType to product
const serviceType = ref('product') // Fixed to product
// Change selectedBranch to be a string (branch id)
const selectedBranch = ref('') // string, not object
const selectedTherapist = ref('')

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
    // Jangan set formData.value.visit_id di sini, biarkan dari combobox
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
      console.error('Error fetching doctors as fallback:', fallbackError)
      therapists.value = []
    }
  } finally {
    loadingTherapists.value = false
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
      } catch (e) { }

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
      title: `${visit.patient?.name} - ${visit.visit_number}`,
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
  selectedTherapist.value = ''
  formData.value.visit_id = ''
  selectedVisit.value = null
  selectedProducts.value = []
  selectedProductObjects.value = []

  if (branchId) {
    await Promise.all([
      loadTherapists(branchId),
      loadVisits(branchId),
      loadProducts(branchId)
    ])
  } else {
    therapists.value = []
    visits.value = []
    products.value = []
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

// Helper function to create product object
const createProductObject = (productId, productData) => {
  // Extract just the product name without the price
  const productName = productData.title.split(' - ')[0]

  return {
    id: productId,
    name: productName,
    price: productData.price,
    therapist_id: '',
    therapist_name: ''
  }
}

// Helper function to initialize product form data
const initializeProductFormData = (productId) => {
  if (!productFormData.value[productId]) {
    productFormData.value[productId] = {
      usage_type: 'PRESCRIPTION',
      quantity: 1,
      batch_number: '',
      expiry_date: '',
      instructions: '',
    }
  }
}

// Handle multi-select product selection
const handleProductSelection = (selectedIds) => {
  console.log('🔄 handleProductSelection called with:', selectedIds)

  // Clear existing product objects
  selectedProductObjects.value = []

  // Create product objects for each selected ID
  selectedIds.forEach(productId => {
    const product = products.value.find(p => p.value === productId)
    if (product) {
      const newProduct = createProductObject(productId, product)
      selectedProductObjects.value.push(newProduct)

      // Initialize form data for this product
      initializeProductFormData(productId)
    }
  })

  console.log('📋 Updated selectedProductObjects:', selectedProductObjects.value)
}

// Remove product from selected products
const removeProduct = (productId) => {
  const index = selectedProductObjects.value.findIndex(p => p.id === productId)
  if (index > -1) {
    selectedProductObjects.value.splice(index, 1)

    // Also remove from the multi-select array
    const selectIndex = selectedProducts.value.indexOf(productId)
    if (selectIndex > -1) {
      selectedProducts.value.splice(selectIndex, 1)
    }

    // Clean up form data for this product
    if (productFormData.value[productId]) {
      delete productFormData.value[productId]
    }
  }
}

// Update therapist for specific product
const updateProductTherapist = (productId, therapistId) => {
  const product = selectedProductObjects.value.find(p => p.id === productId)
  if (product) {
    // Handle Proxy object - extract the actual value
    let actualTherapistId = therapistId
    if (therapistId && typeof therapistId === 'object' && therapistId.value !== undefined) {
      actualTherapistId = therapistId.value
    }

    product.therapist_id = actualTherapistId
    const therapist = therapists.value.find(t => t.value === actualTherapistId)
    product.therapist_name = therapist ? therapist.title : ''
  }
}

// Calculate total amount for products
const calculateProductTotal = computed(() => {
  let total = 0

  // Add selected products total with quantities
  if (selectedProductObjects.value && selectedProductObjects.value.length > 0) {
    const productsTotal = selectedProductObjects.value.reduce((sum, product) => {
      const quantity = parseInt(productFormData.value[product.id]?.quantity) || 1
      return sum + (parseFloat(product?.price) || 0) * quantity
    }, 0)
    total += productsTotal
  }

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

  // Get the current total based on product total
  const subtotal = calculateProductTotal.value

  console.log('🔍 Discount calculation debug:', {
    selectedPromo: selectedPromo.value,
    promo: promo,
    subtotal: subtotal,
    discountType: promo.discount_type,
    discountValue: promo.discount_value,
    minPurchase: promo.min_purchase,
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

  // For products, calculate total from selected products
  total = calculateProductTotal.value
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
  () => selectedProductObjects.value,
  () => selectedPromo.value,
  () => calculateDiscount.value, // Add discount calculation to watchers
], () => {
  calculateGrandTotal()
})

// Watch usage_type to ensure it's always valid
watch(() => productFormData.value.usage_type, (newValue) => {
  const allowedUsageTypes = ['PRESCRIPTION', 'ADMINISTRATION', 'PROCEDURE']
  if (newValue && !allowedUsageTypes.includes(newValue)) {
    console.warn('Invalid usage_type detected:', newValue, 'Resetting to PRESCRIPTION')
    productFormData.value.usage_type = 'PRESCRIPTION'
  }
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

    // Add amounts based on product service
    if (selectedProductObjects.value.length > 0) {
      const total = calculateProductTotal.value
      submitData.total_amount = total
      submitData.grand_total = parseFloat(formData.value.grand_total) || total
      console.log('📤 Billing data with product total:', {
        total_amount: submitData.total_amount,
        grand_total: submitData.grand_total,
        product_total: total,
        selected_products: selectedProductObjects.value
      })
    } else {
      // For when no products selected, set default values
      submitData.total_amount = parseFloat(formData.value.total_amount) || 0
      submitData.grand_total = parseFloat(formData.value.grand_total) || 0
      console.log('📤 Billing data without products:', {
        total_amount: submitData.total_amount,
        grand_total: submitData.grand_total
      })
    }

    console.log('📤 Final billing submit data:', submitData)
    console.log('📤 API call to /transaction/billings with body:', JSON.stringify(submitData, null, 2))

    // First, create the billing
    const billingResponse = await $api('/transaction/billings', {
      method: 'POST',
      body: submitData,
    })

    const billingId = billingResponse.data.id
    console.log('✅ Billing created with ID:', billingId)

    // Then create visit products for each selected product
    if (selectedProductObjects.value.length > 0) {
      const visitProductPromises = selectedProductObjects.value.map(async (product) => {
        try {
          // Get product details from the products array
          const productData = products.value.find(p => p.value === product.id)

          if (!productData) {
            throw new Error(`Product data not found for ID: ${product.id}`)
          }

          // Get product-specific form data
          const productForm = productFormData.value[product.id] || {}

          // Prepare visit product data according to API spec
          const visitProductData = {
            visit_id: visitId,
            product_id: typeof product.id === 'object' && product.id !== null
              ? product.id.value
              : product.id,
            branch_id: typeof selectedBranch.value === 'object' && selectedBranch.value !== null
              ? selectedBranch.value.value
              : selectedBranch.value,
            billing_id: billingId,
            usage_type: productForm.usage_type || 'PRESCRIPTION',
            quantity: parseInt(productForm.quantity) || 1,
            unit_cost: productData.price,
            unit_price: productData.price,
            total_price: (productData.price * (parseInt(productForm.quantity) || 1)),
            batch_number: productForm.batch_number || '',
            expiry_date: productForm.expiry_date || '',
            instructions: productForm.instructions || '',
            dispensed_at: new Date().toISOString().split('T')[0], // Today's date
          }

          console.log('📤 Creating visit product:', visitProductData)
          console.log('🔍 Debug branch_id type:', typeof visitProductData.branch_id, 'value:', visitProductData.branch_id)
          console.log('🔍 Debug product_id type:', typeof visitProductData.product_id, 'value:', visitProductData.product_id)
          console.log('🔍 Debug usage_type:', visitProductData.usage_type)

          // Validate required fields
          if (!visitProductData.visit_id || !visitProductData.product_id || !visitProductData.branch_id) {
            throw new Error(`Missing required fields: visit_id=${visitProductData.visit_id}, product_id=${visitProductData.product_id}, branch_id=${visitProductData.branch_id}`)
          }

          // Validate usage_type
          const allowedUsageTypes = ['PRESCRIPTION', 'ADMINISTRATION', 'PROCEDURE']
          if (!allowedUsageTypes.includes(visitProductData.usage_type)) {
            throw new Error(`Invalid usage_type: ${visitProductData.usage_type}. Must be one of: ${allowedUsageTypes.join(', ')}`)
          }

          const visitProductResponse = await $api('/rme/visit-products', {
            method: 'POST',
            body: visitProductData,
          })

          console.log('✅ Visit product created:', visitProductResponse.data)
          return { success: true, product: product.name, data: visitProductResponse.data }
        } catch (error) {
          console.error('❌ Error creating visit product for', product.name, ':', error)
          return { success: false, product: product.name, error: error.message }
        }
      })

      // Wait for all visit products to be created
      const results = await Promise.all(visitProductPromises)

      // Check if all were successful
      const failedProducts = results.filter(result => !result.success)

      if (failedProducts.length > 0) {
        // Some products failed to create
        const failedNames = failedProducts.map(f => f.product).join(', ')
        await showErrorAlert(new Error(`Gagal membuat beberapa produk: ${failedNames}`), {
          title: 'Peringatan',
          text: 'Tagihan berhasil dibuat, tetapi beberapa produk gagal ditambahkan. Silakan cek kembali.',
        })
      } else {
        // All products created successfully
        await showSuccessAlert(
          `Tagihan produk berhasil dibuat dengan ID: ${billingId}. Semua produk (${selectedProductObjects.value.length}) berhasil ditambahkan.`,
          'Berhasil!',
        )
      }
    } else {
      // No products selected, just show billing success
      await showSuccessAlert(
        `Tagihan produk berhasil dibuat dengan ID: ${billingId}`,
        'Berhasil!',
      )
    }

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
  productFormData.value = {}
  selectedTherapist.value = ''
  selectedProducts.value = []
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
        <VBtn icon="tabler-arrow-left" variant="text" size="small" @click="goBack" />
        Tambah Tagihan Produk
      </VCardTitle>
      <VCardSubtitle>
        Lengkapi data tagihan produk untuk membuat tagihan baru
      </VCardSubtitle>
    </VCardItem>

    <VCardText>
      <VForm ref="refForm" @submit.prevent="submitForm" validate-on="submit">
        <VRow>
          <!-- Data Cabang -->
          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Cabang *
            </label>
            <AppCombobox v-model="selectedBranch" placeholder="Pilih cabang..." :items="branches"
              :loading="loadingBranches" :rules="[requiredValidator]" required clearable hide-details="auto" />
          </VCol>

          <!-- Visit Autocomplete (only show after branch is selected) -->
          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Kunjungan *
            </label>
            <AppCombobox v-model="formData.visit_id" placeholder="Pilih kunjungan..." :items="visits"
              :loading="loadingVisits" :rules="[requiredValidator]" required clearable hide-details="auto" />
          </VCol>

          <!-- Product selection -->
          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Produk (bisa lebih dari satu)
            </label>
            <VSelect v-model="selectedProducts" :items="products" :loading="loadingProducts" multiple chips
              closable-chips clearable hide-details="auto" placeholder="Pilih produk..." item-title="title"
              item-value="value" @update:model-value="handleProductSelection" />
          </VCol>

          <!-- Promo Selection -->
          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Promo (Opsional)
            </label>
            <AppCombobox v-model="selectedPromo" placeholder="Pilih promo..." :items="promos" :loading="loadingPromos"
              clearable hide-details="auto" />
          </VCol>
        </VRow>

        <!-- Product Details Section -->
        <VRow v-if="selectedProductObjects.length > 0">
          <VCol cols="12">
            <VCard variant="outlined" class="pa-4">
              <VCardTitle class="text-h6 mb-4">
                <VIcon start color="info">
                  tabler-settings
                </VIcon>
                Detail Produk ({{ selectedProductObjects.length }} produk)
              </VCardTitle>

              <!-- Individual Product Details -->
              <div v-for="(product, index) in selectedProductObjects" :key="product.id" class="mb-6">
                <VCard variant="tonal" class="pa-4">
                  <VCardTitle class="text-subtitle-1 mb-3">
                    <VIcon start color="primary">
                      tabler-package
                    </VIcon>
                    {{ product.name }} - {{ formatCurrency(product.price) }}
                  </VCardTitle>

                  <VRow>
                    <VCol cols="12" md="6">
                      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                        Jenis Penggunaan
                      </label>
                      <VSelect v-model="productFormData[product.id].usage_type" :items="usageTypeOptions"
                        placeholder="Pilih jenis penggunaan..." hide-details="auto" />
                    </VCol>

                    <VCol cols="12" md="6">
                      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                        Jumlah
                      </label>
                      <VTextField v-model="productFormData[product.id].quantity" type="number" min="1"
                        placeholder="Masukkan jumlah..." hide-details="auto" />
                    </VCol>

                    <VCol cols="12" md="6">
                      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                        Nomor Batch (Opsional)
                      </label>
                      <VTextField v-model="productFormData[product.id].batch_number"
                        placeholder="Masukkan nomor batch..." hide-details="auto" />
                    </VCol>

                    <VCol cols="12" md="6">
                      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                        Tanggal Kadaluarsa (Opsional)
                      </label>
                      <VTextField v-model="productFormData[product.id].expiry_date" type="date"
                        placeholder="Pilih tanggal kadaluarsa..." hide-details="auto" />
                    </VCol>

                    <VCol cols="12">
                      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                        Instruksi (Opsional)
                      </label>
                      <VTextarea v-model="productFormData[product.id].instructions"
                        placeholder="Masukkan instruksi penggunaan..." rows="3" hide-details="auto" />
                    </VCol>
                  </VRow>
                </VCard>
              </div>
            </VCard>
          </VCol>
        </VRow>

        <!-- Selected Products with Therapist -->
        <VRow v-if="selectedProductObjects.length > 0">
          <VCol cols="12">
            <VCard variant="outlined" class="pa-4">
              <VCardTitle class="text-h6 mb-4">
                <VIcon start color="success">
                  tabler-package
                </VIcon>
                Produk yang Dipilih ({{ selectedProductObjects.length }} produk)
              </VCardTitle>

              <div v-for="(product, index) in selectedProductObjects" :key="product.id" class="mb-4">
                <VCard variant="tonal" class="pa-3">
                  <div class="d-flex align-center justify-space-between mb-3">
                    <div>
                      <h6 class="text-subtitle-1 font-weight-medium mb-1">{{ product.name }}</h6>
                      <span class="text-body-2 text-medium-emphasis">{{ formatCurrency(product.price) }}</span>
                    </div>
                    <VBtn icon="tabler-x" size="small" variant="text" color="error"
                      @click="removeProduct(product.id)" />
                  </div>
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
                Ringkasan Biaya Produk
              </VCardTitle>
              <VRow>
                <VCol cols="12" md="4">
                  <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                    Total Produk
                  </label>
                  <VTextField :model-value="calculateProductTotal" type="number" prefix="Rp" readonly
                    density="comfortable" variant="outlined" />
                </VCol>
                <VCol cols="12" md="4">
                  <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                    Diskon Promo
                  </label>
                  <VTextField :model-value="calculateDiscount" type="number" prefix="Rp" readonly density="comfortable"
                    variant="outlined" color="success" />
                </VCol>
                <VCol cols="12" md="4">
                  <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                    Total Biaya
                  </label>
                  <VTextField :model-value="formData.grand_total || 0" type="number" prefix="Rp" readonly
                    density="comfortable" variant="outlined" color="primary" />
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
                  <span class="text-body-2">Total Produk:</span>
                  <span class="text-body-1 font-weight-medium">
                    {{ formatCurrency(calculateProductTotal) }}
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
                  const subtotal = calculateProductTotal
                  return promo?.min_purchase && subtotal < parseFloat(promo.min_purchase)
                })()" class="d-flex align-center gap-2 mb-2 pa-2 bg-warning-lighten-5 rounded">
                  <VIcon size="16" color="warning">
                    tabler-alert-triangle
                  </VIcon>
                  <span class="text-caption text-warning">
                    Minimum pembelian: {{formatCurrency((() => {
                      const promoId = typeof selectedPromo === 'object' && selectedPromo !== null
                        ? selectedPromo.value
                        : selectedPromo
                      return promos.find(p => p.value === promoId)?.data?.min_purchase || 0
                    })())}}
                  </span>
                </div>

                <!-- Minimum Purchase Success -->
                <div v-if="selectedPromo && (() => {
                  const promoId = typeof selectedPromo === 'object' && selectedPromo !== null
                    ? selectedPromo.value
                    : selectedPromo
                  const promo = promos.find(p => p.value === promoId)?.data
                  const subtotal = calculateProductTotal
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
                <div v-if="formData.tax_amount && parseFloat(formData.tax_amount) > 0"
                  class="d-flex justify-space-between align-center mb-2">
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
                      Promo Aktif: {{promos.find(p => p.value === selectedPromo)?.data?.name}}
                    </span>
                  </div>
                  <div class="text-caption text-success">
                    {{promos.find(p => p.value === selectedPromo)?.data?.description}}
                  </div>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>

        <div class="d-flex justify-end mt-4">
          <VBtn type="submit" :loading="isLoading" :disabled="isLoading || selectedProductObjects.length === 0"
            color="primary">
            <VIcon start icon="tabler-device-floppy" />
            Buat Tagihan Produk
          </VBtn>
        </div>
      </VForm>
    </VCardText>
  </VCard>
</template>
