<route lang="yaml">
meta:
  layout: default
  navActiveLink: wms-products
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
            Tambah Produk Baru
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Tambahkan produk baru ke sistem
          </p>
        </div>
      </div>
      <VBtn
        variant="text"
        color="secondary"
        prepend-icon="tabler-arrow-left"
        :to="{ name: 'wms-products' }"
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
              SKU
            </label>
            <VTextField
              v-model="formData.sku"
              placeholder="Contoh: SKU-COSMETIC-001"
              variant="outlined"
              maxlength="50"
              :rules="[
                v => !!v || 'SKU harus diisi',
                v => v.length <= 50 || 'SKU maksimal 50 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Nama Produk
            </label>
            <VTextField
              v-model="formData.name"
              placeholder="Masukkan nama produk"
              variant="outlined"
              maxlength="200"
              :rules="[
                v => !!v || 'Nama produk harus diisi',
                v => v.length <= 200 || 'Nama produk maksimal 200 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Brand
            </label>
            <VTextField
              v-model="formData.brand"
              placeholder="Masukkan brand produk"
              variant="outlined"
              maxlength="100"
              :rules="[
                v => !!v || 'Brand harus diisi',
                v => v.length <= 100 || 'Brand maksimal 100 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Kategori
            </label>
            <VSelect
              v-model="formData.category_id"
              :items="categories"
              :loading="loadingCategories"
              variant="outlined"
              placeholder="Pilih kategori produk"
              :rules="[v => !!v || 'Kategori harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tipe Produk
            </label>
            <VSelect
              v-model="formData.product_type"
              :items="productTypeOptions"
              variant="outlined"
              placeholder="Pilih tipe produk"
              :rules="[v => !!v || 'Tipe produk harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Satuan
            </label>
            <VSelect
              v-model="formData.unit_of_measure"
              :items="unitOfMeasureOptions"
              variant="outlined"
              placeholder="Pilih satuan"
              :rules="[v => !!v || 'Satuan harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <!-- Stock Information -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Informasi Stok
            </h3>
          </VCol>

          <VCol cols="12" md="4">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Stok Minimum
            </label>
            <VTextField
              v-model.number="formData.min_stock_level"
              type="number"
              placeholder="0"
              variant="outlined"
              min="0"
              :rules="[
                v => v !== null && v !== undefined || 'Stok minimum harus diisi',
                v => v >= 0 || 'Stok minimum tidak boleh negatif'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="4">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Stok Maksimum
            </label>
            <VTextField
              v-model.number="formData.max_stock_level"
              type="number"
              placeholder="0"
              variant="outlined"
              min="0"
              :rules="[
                v => v !== null && v !== undefined || 'Stok maksimum harus diisi',
                v => v >= 0 || 'Stok maksimum tidak boleh negatif',
                v => v >= formData.min_stock_level || 'Stok maksimum harus lebih besar dari minimum'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="4">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Titik Reorder
            </label>
            <VTextField
              v-model.number="formData.reorder_point"
              type="number"
              placeholder="0"
              variant="outlined"
              min="0"
              :rules="[
                v => v !== null && v !== undefined || 'Titik reorder harus diisi',
                v => v >= 0 || 'Titik reorder tidak boleh negatif'
              ]"
              required
              hide-details
            />
          </VCol>

          <!-- Storage Information -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Informasi Penyimpanan
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Persyaratan Penyimpanan
            </label>
            <VSelect
              v-model="formData.storage_requirement"
              :items="storageRequirementOptions"
              variant="outlined"
              placeholder="Pilih persyaratan penyimpanan"
              :rules="[v => !!v || 'Persyaratan penyimpanan harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Masa Simpan (Hari)
            </label>
            <VTextField
              v-model.number="formData.shelf_life_days"
              type="number"
              placeholder="365"
              variant="outlined"
              min="0"
              :rules="[
                v => v !== null && v !== undefined || 'Masa simpan harus diisi',
                v => v >= 0 || 'Masa simpan tidak boleh negatif'
              ]"
              required
              hide-details
            />
          </VCol>

          <!-- Physical Information -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Informasi Fisik
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Berat (gram)
            </label>
            <VTextField
              v-model.number="formData.weight_grams"
              type="number"
              placeholder="0.00"
              variant="outlined"
              min="0"
              step="0.01"
              :rules="[
                v => v !== null && v !== undefined || 'Berat harus diisi',
                v => v >= 0 || 'Berat tidak boleh negatif'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Panjang (cm)
            </label>
            <VTextField
              v-model.number="formData.dimensions_cm.length"
              type="number"
              placeholder="0"
              variant="outlined"
              min="0"
              :rules="[
                v => v !== null && v !== undefined || 'Panjang harus diisi',
                v => v >= 0 || 'Panjang tidak boleh negatif'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Lebar (cm)
            </label>
            <VTextField
              v-model.number="formData.dimensions_cm.width"
              type="number"
              placeholder="0"
              variant="outlined"
              min="0"
              :rules="[
                v => v !== null && v !== undefined || 'Lebar harus diisi',
                v => v >= 0 || 'Lebar tidak boleh negatif'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tinggi (cm)
            </label>
            <VTextField
              v-model.number="formData.dimensions_cm.height"
              type="number"
              placeholder="0"
              variant="outlined"
              min="0"
              :rules="[
                v => v !== null && v !== undefined || 'Tinggi harus diisi',
                v => v >= 0 || 'Tinggi tidak boleh negatif'
              ]"
              required
              hide-details
            />
          </VCol>

          <!-- Tracking Information -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Informasi Tracking
            </h3>
          </VCol>

          <VCol cols="12" md="4">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Serialized
            </label>
            <VSwitch
              v-model="formData.is_serialized"
              color="primary"
              :label="formData.is_serialized ? 'Serialized' : 'Non-Serialized'"
              hide-details
            />
          </VCol>

          <VCol cols="12" md="4">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Batch Tracked
            </label>
            <VSwitch
              v-model="formData.is_batch_tracked"
              color="primary"
              :label="formData.is_batch_tracked ? 'Batch Tracked' : 'Non-Batch'"
              hide-details
            />
          </VCol>

          <VCol cols="12" md="4">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Prescription Required
            </label>
            <VSwitch
              v-model="formData.is_prescription_required"
              color="primary"
              :label="formData.is_prescription_required ? 'Prescription Required' : 'OTC'"
              hide-details
            />
          </VCol>

          <VCol cols="12" md="4">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Status
            </label>
            <VSwitch
              v-model="formData.is_active"
              color="primary"
              :label="formData.is_active ? 'Aktif' : 'Nonaktif'"
              hide-details
            />
          </VCol>

          <!-- Description Information -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Informasi Deskripsi
            </h3>
          </VCol>

          <VCol cols="12">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Deskripsi Produk
            </label>
            <VTextarea
              v-model="formData.description"
              placeholder="Masukkan deskripsi produk"
              rows="4"
              variant="outlined"
              :rules="[v => !!v || 'Deskripsi harus diisi']"
              required
              hide-details
            />
          </VCol>

          <!-- Action Buttons -->
          <VCol cols="12" class="mt-6">
            <div class="d-flex gap-3 justify-end">
              <VBtn
                variant="outlined"
                color="secondary"
                :to="{ name: 'wms-products' }"
              >
                Batal
              </VBtn>
              <VBtn
                color="primary"
                :loading="loading"
                :disabled="!isFormValid"
                @click="handleSubmit"
              >
                Simpan Produk
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
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form state
const formRef = ref(null)
const isFormValid = ref(false)
const loading = ref(false)
const loadingCategories = ref(false)

const formData = ref({
  sku: '',
  name: '',
  category_id: null,
  brand: '',
  description: '',
  product_type: '',
  unit_of_measure: '',
  min_stock_level: 0,
  max_stock_level: 0,
  reorder_point: 0,
  shelf_life_days: 365,
  storage_requirement: '',
  weight_grams: 0,
  dimensions_cm: {
    length: 0,
    width: 0,
    height: 0,
  },
  is_serialized: false,
  is_batch_tracked: false,
  is_prescription_required: false,
  is_active: true,
})

const categories = ref([])

const productTypeOptions = [
  { title: 'Consumable', value: 'CONSUMABLE' },
  { title: 'Non-Consumable', value: 'NON_CONSUMABLE' },
]

const unitOfMeasureOptions = [
  { title: 'Bottle', value: 'bottle' },
  { title: 'Jar', value: 'jar' },
  { title: 'Tube', value: 'tube' },
  { title: 'Unit', value: 'unit' },
  { title: 'Vial', value: 'vial' },
  { title: 'Syringe', value: 'syringe' },
  { title: 'Pieces', value: 'pcs' },
]

const storageRequirementOptions = [
  { title: 'Room Temperature', value: 'ROOM_TEMP' },
  { title: 'Refrigerated', value: 'REFRIGERATED' },
  { title: 'Frozen', value: 'FROZEN' },
]

// Functions
async function fetchCategories() {
  loadingCategories.value = true
  
  try {
    const res = await $api('/wms/product-categories', {
      method: 'GET',
    })
    
    if (res.data && Array.isArray(res.data)) {
      const options = res.data.map(category => ({
        title: category.name,
        value: category.id,
      }))
      
      categories.value = options
    }
  } catch (error) {
    console.error('❌ Error fetching categories:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Kategori',
      text: 'Tidak dapat memuat data kategori. Silakan coba lagi.',
    })
  } finally {
    loadingCategories.value = false
  }
}

async function handleSubmit() {
  if (!formRef.value?.validate()) {
    return
  }

  loading.value = true

  try {
    const requestBody = {
      sku: formData.value.sku.trim().toUpperCase(),
      name: formData.value.name.trim(),
      category_id: formData.value.category_id,
      brand: formData.value.brand.trim(),
      description: formData.value.description.trim(),
      product_type: formData.value.product_type,
      unit_of_measure: formData.value.unit_of_measure,
      min_stock_level: formData.value.min_stock_level,
      max_stock_level: formData.value.max_stock_level,
      reorder_point: formData.value.reorder_point,
      shelf_life_days: formData.value.shelf_life_days,
      storage_requirement: formData.value.storage_requirement,
      weight_grams: formData.value.weight_grams,
      dimensions_cm: {
        length: formData.value.dimensions_cm.length,
        width: formData.value.dimensions_cm.width,
        height: formData.value.dimensions_cm.height,
      },
      is_serialized: formData.value.is_serialized,
      is_batch_tracked: formData.value.is_batch_tracked,
      is_prescription_required: formData.value.is_prescription_required,
      is_active: formData.value.is_active,
    }

    console.log('📤 API Request body:', requestBody)

    const res = await $api('/wms/products', {
      method: 'POST',
      body: requestBody,
    })

    console.log('📥 API Response:', res)

    await showSuccessAlert({
      title: 'Berhasil',
      text: 'Produk berhasil ditambahkan',
    })

    // Redirect to index page
    router.push({ name: 'wms-products' })
  } catch (error) {
    console.error('❌ Error creating product:', error)
    await showErrorAlert(error, {
      title: 'Gagal Menambahkan Produk',
      text: 'Tidak dapat menambahkan produk. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
  }
}

// Initialize data
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')
  
  // Fetch categories for dropdown
  await fetchCategories()
})
</script>

<style scoped>
.v-form {
  max-width: 100%;
}

.v-textarea {
  resize: vertical;
}
</style> 
