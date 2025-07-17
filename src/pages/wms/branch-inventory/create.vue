<route lang="yaml">
meta:
  layout: default
  navActiveLink: wms-branch-inventory
</route>

<template>
  <VCard>
    <!-- Header -->
    <VCardTitle class="d-flex align-center justify-space-between pa-4">
      <div class="d-flex align-center gap-3">
        <VIcon
          size="28"
          color="primary"
        >
          tabler-package
        </VIcon>
        <div>
          <h2 class="text-h5 mb-1">
            Tambah Inventori Cabang
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Tambahkan inventori baru untuk branch
          </p>
        </div>
      </div>
      <VBtn
        variant="text"
        color="secondary"
        prepend-icon="tabler-arrow-left"
        :to="{ name: 'wms-branch-inventory' }"
      >
        Kembali
      </VBtn>
    </VCardTitle>

    <VDivider />

    <VCardText class="pa-4">
      <VForm ref="formRef" v-model="isFormValid">
        <VRow>
          <!-- Basic Information -->
          <VCol cols="12">
            <h3 class="text-h6 mb-4">
              Informasi Dasar
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Branch
            </label>
            <VSelect
              v-model="formData.branch_id"
              :items="branches"
              item-title="name"
              item-value="id"
              placeholder="Pilih branch"
              variant="outlined"
              :rules="[v => !!v || 'Branch harus dipilih']"
              :loading="loadingBranches"
              :error-messages="errors.branch_id"
              required
              hide-details
              @update:model-value="handleBranchChange"
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Produk
            </label>
            <VSelect
              v-model="formData.product_id"
              :items="productsWithDisplayName"
              item-title="displayName"
              item-value="id"
              placeholder="Pilih produk"
              variant="outlined"
              :rules="[v => !!v || 'Produk harus dipilih']"
              :loading="loadingProducts"
              :error-messages="errors.product_id"
              required
              hide-details
              @update:model-value="handleProductChange"
            />
          </VCol>

          <!-- Stock Information -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Informasi Stok
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Stok Saat Ini
            </label>
            <VTextField
              v-model.number="formData.current_stock"
              type="number"
              placeholder="0"
              variant="outlined"
              min="0"
              :rules="[
                v => v !== null && v !== undefined || 'Stok saat ini harus diisi',
                v => v >= 0 || 'Stok tidak boleh negatif'
              ]"
              required
              hide-details
              :error-messages="errors.current_stock"
            />
          </VCol>



          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Level Stok Minimum
            </label>
            <VTextField
              v-model.number="formData.min_stock_level"
              type="number"
              placeholder="0"
              variant="outlined"
              min="0"
              :rules="[
                v => v === null || v === undefined || v >= 0 || 'Level stok minimum tidak boleh negatif'
              ]"
              hide-details
              :error-messages="errors.min_stock_level"
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Level Stok Maksimum
            </label>
            <VTextField
              v-model.number="formData.max_stock_level"
              type="number"
              placeholder="0"
              variant="outlined"
              min="0"
              :rules="[
                v => v === null || v === undefined || v >= 0 || 'Level stok maksimum tidak boleh negatif',
                v => {
                  if (v !== null && v !== undefined && formData.min_stock_level !== null && formData.min_stock_level !== undefined) {
                    return v >= formData.min_stock_level || 'Level stok maksimum harus lebih besar dari minimum'
                  }
                  return true
                }
              ]"
              hide-details
              :error-messages="errors.max_stock_level"
            />
          </VCol>

          <!-- Action Buttons -->
          <VCol cols="12" class="mt-6">
            <div class="d-flex gap-3 justify-end">
              <VBtn
                variant="outlined"
                color="secondary"
                :to="{ name: 'wms-branch-inventory' }"
              >
                Batal
              </VBtn>
              <VBtn
                color="primary"
                :loading="loading"
                :disabled="!isFormValid"
                @click="handleSubmit"
              >
                Simpan Inventori
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert, showSuccessAlert } from '@/utils/errorHandler'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const formRef = ref()
const isFormValid = ref(false)
const loading = ref(false)
const loadingBranches = ref(false)
const loadingProducts = ref(false)

// Form data
const formData = ref({
  branch_id: null,
  product_id: null,
  current_stock: 0,
  min_stock_level: null,
  max_stock_level: null,
})

// Error messages
const errors = ref({})

// Data for dropdowns
const branches = ref([])
const products = ref([])

// Computed properties for product display
const productsWithDisplayName = computed(() => {
  return products.value.map(product => ({
    ...product,
    displayName: `${product.sku} - ${product.name}`,
  }))
})

// Functions
async function fetchBranches() {
  loadingBranches.value = true
  try {
    const res = await $api('/wms/branches')
    branches.value = res.data || []
  } catch (error) {
    console.error('Error fetching branches:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Branch',
      text: 'Tidak dapat memuat data branch. Silakan coba lagi.',
    })
  } finally {
    loadingBranches.value = false
  }
}

async function fetchProducts() {
  loadingProducts.value = true
  try {
    const res = await $api('/wms/products')
    products.value = res.data || []
  } catch (error) {
    console.error('Error fetching products:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Produk',
      text: 'Tidak dapat memuat data produk. Silakan coba lagi.',
    })
  } finally {
    loadingProducts.value = false
  }
}

function handleBranchChange() {
  // Reset product selection when branch changes
  formData.value.product_id = null
  errors.value = {}
}

function handleProductChange() {
  errors.value = {}
}

async function handleSubmit() {
  if (!formRef.value?.validate()) {
    return
  }

  loading.value = true
  errors.value = {}

  try {
    // Prepare the request body
    const requestBody = {
      branch_id: formData.value.branch_id,
      product_id: formData.value.product_id,
      current_stock: formData.value.current_stock,
    }

    // Add optional fields if they have values
    if (formData.value.min_stock_level !== null && formData.value.min_stock_level !== undefined) {
      requestBody.min_stock_level = formData.value.min_stock_level
    }
    if (formData.value.max_stock_level !== null && formData.value.max_stock_level !== undefined) {
      requestBody.max_stock_level = formData.value.max_stock_level
    }

    console.log('📤 Creating branch inventory with data:', requestBody)

    const res = await $api('/wms/branch-inventory', {
      method: 'POST',
      body: requestBody,
    })

    console.log('📥 API Response:', res)

    await showSuccessAlert({
      title: 'Berhasil',
      text: 'Inventori cabang berhasil ditambahkan',
    })

    // Redirect to index page
    router.push({ name: 'wms-branch-inventory' })
  } catch (error) {
    console.error('❌ Error creating branch inventory:', error)
    
    // Handle validation errors
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      await showErrorAlert(error, {
        title: 'Gagal Menambahkan Inventori',
        text: 'Tidak dapat menambahkan inventori cabang. Silakan coba lagi.',
      })
    }
  } finally {
    loading.value = false
  }
}

// Initialize data
onMounted(async () => {
  await Promise.all([
    fetchBranches(),
    fetchProducts(),
  ])
})
</script>

<style scoped>
.v-form {
  max-width: 100%;
}
</style> 
