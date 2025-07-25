<route lang="yaml">
meta:
  layout: default
  navActiveLink: wms-product-categories
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
          tabler-category
        </VIcon>
        <div>
          <h2 class="text-h5 mb-1">
            Tambah Kategori Produk Baru
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Tambahkan kategori produk baru
          </p>
        </div>
      </div>
      <VBtn
        variant="text"
        color="secondary"
        prepend-icon="tabler-arrow-left"
        :to="{ name: 'wms-product-categories' }"
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
              Nama Kategori
            </label>
            <VTextField
              v-model="formData.name"
              placeholder="Masukkan nama kategori produk"
              variant="outlined"
              maxlength="100"
              :rules="[
                v => !!v || 'Nama kategori harus diisi',
                v => v.length <= 100 || 'Nama kategori maksimal 100 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Kode Kategori
            </label>
            <VTextField
              v-model="formData.code"
              placeholder="Contoh: MEDICINE, EQUIPMENT"
              variant="outlined"
              maxlength="20"
              :rules="[
                v => !!v || 'Kode kategori harus diisi',
                v => v.length <= 20 || 'Kode kategori maksimal 20 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Kategori Induk
            </label>
            <VSelect
              v-model="formData.parent_id"
              :items="parentCategories"
              :loading="loadingParentCategories"
              variant="outlined"
              placeholder="Pilih kategori induk (opsional)"
              clearable
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
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
              Deskripsi Kategori
            </label>
            <VTextarea
              v-model="formData.description"
              placeholder="Masukkan deskripsi kategori produk"
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
                :to="{ name: 'wms-product-categories' }"
              >
                Batal
              </VBtn>
              <VBtn
                color="primary"
                :loading="loading"
                :disabled="!isFormValid"
                @click="handleSubmit"
              >
                Simpan Kategori Produk
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
const loadingParentCategories = ref(false)

const formData = ref({
  name: '',
  code: '',
  description: '',
  parent_id: null,
  is_active: true,
})

const parentCategories = ref([])

// Functions
async function fetchParentCategories() {
  loadingParentCategories.value = true
  
  try {
    const res = await $api('/wms/product-categories', {
      method: 'GET',
    })
    
    if (res.data && Array.isArray(res.data)) {
      // Filter only parent categories (no parent_id)
      const parentOptions = res.data
        .filter(category => category.parent_id === null)
        .map(category => ({
          title: category.name,
          value: category.id,
        }))
      
      parentCategories.value = parentOptions
    }
  } catch (error) {
    console.error('❌ Error fetching parent categories:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Kategori Induk',
      text: 'Tidak dapat memuat data kategori induk. Silakan coba lagi.',
    })
  } finally {
    loadingParentCategories.value = false
  }
}

async function handleSubmit() {
  if (!formRef.value?.validate()) {
    return
  }

  loading.value = true

  try {
    const requestBody = {
      name: formData.value.name.trim(),
      code: formData.value.code.trim().toUpperCase(),
      description: formData.value.description.trim(),
      parent_id: formData.value.parent_id || null,
      is_active: formData.value.is_active,
    }

    console.log('📤 API Request body:', requestBody)

    const res = await $api('/wms/product-categories', {
      method: 'POST',
      body: requestBody,
    })

    console.log('📥 API Response:', res)

    await showSuccessAlert({
      title: 'Berhasil',
      text: 'Kategori produk berhasil ditambahkan',
    })

    // Redirect to index page
    router.push({ name: 'wms-product-categories' })
  } catch (error) {
    console.error('❌ Error creating product category:', error)
    await showErrorAlert(error, {
      title: 'Gagal Menambahkan Kategori Produk',
      text: 'Tidak dapat menambahkan kategori produk. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
  }
}

// Initialize data
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')
  
  // Fetch parent categories for dropdown
  await fetchParentCategories()
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
