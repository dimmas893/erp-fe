<route lang="yaml">
meta:
  layout: default
  navActiveLink: wms-regional-warehouses
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
          tabler-building-warehouse
        </VIcon>
        <div>
          <h2 class="text-h5 mb-1">
            Tambah Regional Warehouse Baru
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Tambahkan regional warehouse baru
          </p>
        </div>
      </div>
      <VBtn
        variant="text"
        color="secondary"
        prepend-icon="tabler-arrow-left"
        :to="{ name: 'wms-regional-warehouses' }"
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
              Nama Regional Warehouse
            </label>
            <VTextField
              v-model="formData.name"
              placeholder="Masukkan nama regional warehouse"
              variant="outlined"
              maxlength="100"
              :rules="[
                v => !!v || 'Nama regional warehouse harus diisi',
                v => v.length <= 100 || 'Nama regional warehouse maksimal 100 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Region
            </label>
            <VSelect
              v-model="formData.region"
              :items="regionOptions"
              variant="outlined"
              placeholder="Pilih region"
              :rules="[v => !!v || 'Region harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Central Warehouse
            </label>
            <VSelect
              v-model="formData.central_warehouse_id"
              :items="centralWarehouses"
              :loading="loadingCentralWarehouses"
              variant="outlined"
              placeholder="Pilih central warehouse"
              :rules="[v => !!v || 'Central warehouse harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <!-- Address Information -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Informasi Alamat
            </h3>
          </VCol>

          <VCol cols="12">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Alamat Lengkap
            </label>
            <VTextarea
              v-model="formData.address"
              placeholder="Masukkan alamat lengkap regional warehouse"
              rows="4"
              variant="outlined"
              :rules="[v => !!v || 'Alamat harus diisi']"
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
                :to="{ name: 'wms-regional-warehouses' }"
              >
                Batal
              </VBtn>
              <VBtn
                color="primary"
                :loading="loading"
                :disabled="!isFormValid"
                @click="handleSubmit"
              >
                Simpan Regional Warehouse
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
const loadingCentralWarehouses = ref(false)

const formData = ref({
  name: '',
  region: '',
  address: '',
  central_warehouse_id: '',
})

const centralWarehouses = ref([])

const regionOptions = [
  { title: 'JABODETABEK', value: 'JABODETABEK' },
  { title: 'JAWA_BARAT', value: 'JAWA_BARAT' },
  { title: 'JAWA_TIMUR', value: 'JAWA_TIMUR' },
  { title: 'JAWA_TENGAH', value: 'JAWA_TENGAH' },
  { title: 'SUMATERA_UTARA', value: 'SUMATERA_UTARA' },
  { title: 'SUMATERA_SELATAN', value: 'SUMATERA_SELATAN' },
  { title: 'KALIMANTAN', value: 'KALIMANTAN' },
  { title: 'SULAWESI', value: 'SULAWESI' },
  { title: 'PAPUA', value: 'PAPUA' },
]

// Functions
async function fetchCentralWarehouses() {
  loadingCentralWarehouses.value = true
  
  try {
    const res = await $api('/central-warehouses', {
      method: 'GET',
    })
    
    if (res.data && Array.isArray(res.data)) {
      centralWarehouses.value = res.data.map(warehouse => ({
        title: warehouse.name,
        value: warehouse.id,
      }))
    }
  } catch (error) {
    console.error('❌ Error fetching central warehouses:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Central Warehouse',
      text: 'Tidak dapat memuat data central warehouse. Silakan coba lagi.',
    })
  } finally {
    loadingCentralWarehouses.value = false
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
      region: formData.value.region,
      address: formData.value.address.trim(),
      central_warehouse_id: formData.value.central_warehouse_id,
    }

    console.log('📤 API Request body:', requestBody)

    const res = await $api('/wms/regional-warehouses', {
      method: 'POST',
      body: requestBody,
    })

    console.log('📥 API Response:', res)

    await showSuccessAlert({
      title: 'Berhasil',
      text: 'Regional warehouse berhasil ditambahkan',
    })

    // Redirect to index page
    router.push({ name: 'wms-regional-warehouses' })
  } catch (error) {
    console.error('❌ Error creating regional warehouse:', error)
    await showErrorAlert(error, {
      title: 'Gagal Menambahkan Regional Warehouse',
      text: 'Tidak dapat menambahkan regional warehouse. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
  }
}

// Initialize data
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')
  
  // Fetch central warehouses for dropdown
  await fetchCentralWarehouses()
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
