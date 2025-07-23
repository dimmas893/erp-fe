<route lang="yaml">
meta:
  layout: default
  navActiveLink: transaction-produk
</route>

<template>
  <VCard>
    <!-- Simple Header -->
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
            Detail Produk
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ID: {{ productId }}
          </p>
        </div>
      </div>
      <VBtn
        variant="text"
        color="secondary"
        prepend-icon="tabler-arrow-left"
        :to="{ name: 'transaction-produk' }"
      >
        Kembali
      </VBtn>
    </VCardTitle>

    <VDivider />

    <VCardText class="pa-4">
      <VRow v-if="loading">
        <VCol cols="12">
          <VSkeletonLoader
            type="article"
            class="mx-auto"
          />
        </VCol>
      </VRow>

      <VRow v-else-if="product">
        <!-- Simple Info Card -->
        <VCol cols="12" class="mb-4">
          <VCard variant="outlined" color="primary" class="mb-4">
            <VCardText class="pa-4">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <h4 class="text-subtitle-1 font-weight-medium mb-1">
                    {{ getUsageTypeText(product.usage_type) }}
                  </h4>
                  <p class="text-body-2 mb-0">
                    Total Harga: {{ formatCurrency(product.total_price) }}
                  </p>
                </div>
                <VChip
                  :color="getUsageTypeColor(product.usage_type)"
                  size="small"
                  label
                >
                  {{ product.usage_type }}
                </VChip>
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Product Details -->
        <VCol cols="12">
          <h3 class="text-h6 mb-4">
            Informasi Produk
          </h3>
          <VRow>
            <!-- Visit Information -->
            <VCol cols="12" md="6">
              <VCard variant="outlined">
                <VCardTitle class="pa-4 pb-2">
                  <div class="d-flex align-center gap-2">
                    <VIcon size="20" color="info">
                      tabler-calendar
                    </VIcon>
                    <h4 class="text-subtitle-1 font-weight-medium">
                      Informasi Kunjungan
                    </h4>
                  </div>
                </VCardTitle>
                <VCardText class="pa-4 pt-0">
                  <div class="d-flex flex-column gap-2">
                    <div class="d-flex justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">Visit ID:</span>
                      <span class="text-body-2 font-weight-medium">{{ product.visit_id }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">Tanggal Kunjungan:</span>
                      <span class="text-body-2 font-weight-medium">{{ formatDateTime(product.visit?.visit_date) }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">Tipe Kunjungan:</span>
                      <span class="text-body-2 font-weight-medium">{{ product.visit?.visit_type }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">Status Kunjungan:</span>
                      <VChip
                        :color="getVisitStatusColor(product.visit?.status)"
                        size="small"
                        label
                      >
                        {{ getVisitStatusText(product.visit?.status) }}
                      </VChip>
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </VCol>

            <!-- Product Information -->
            <VCol cols="12" md="6">
              <VCard variant="outlined">
                <VCardTitle class="pa-4 pb-2">
                  <div class="d-flex align-center gap-2">
                    <VIcon size="20" color="success">
                      tabler-package
                    </VIcon>
                    <h4 class="text-subtitle-1 font-weight-medium">
                      Detail Produk
                    </h4>
                  </div>
                </VCardTitle>
                <VCardText class="pa-4 pt-0">
                  <div class="d-flex flex-column gap-2">
                    <div class="d-flex justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">Product ID:</span>
                      <span class="text-body-2 font-weight-medium">{{ product.product_id }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">Branch ID:</span>
                      <span class="text-body-2 font-weight-medium">{{ product.branch_id }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">Jumlah:</span>
                      <span class="text-body-2 font-weight-medium">{{ product.quantity }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">Harga Satuan:</span>
                      <span class="text-body-2 font-weight-medium">{{ formatCurrency(product.unit_price) }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">Total Harga:</span>
                      <span class="text-body-2 font-weight-medium">{{ formatCurrency(product.total_price) }}</span>
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </VCol>

            <!-- Batch and Expiry Information -->
            <VCol cols="12">
              <VCard variant="outlined">
                <VCardTitle class="pa-4 pb-2">
                  <div class="d-flex align-center gap-2">
                    <VIcon size="20" color="warning">
                      tabler-calendar-time
                    </VIcon>
                    <h4 class="text-subtitle-1 font-weight-medium">
                      Informasi Batch & Kadaluarsa
                    </h4>
                  </div>
                </VCardTitle>
                <VCardText class="pa-4 pt-0">
                  <VRow>
                    <VCol cols="12" md="4">
                      <div class="d-flex flex-column gap-2">
                        <div class="d-flex justify-space-between">
                          <span class="text-body-2 text-medium-emphasis">Nomor Batch:</span>
                          <span class="text-body-2 font-weight-medium">{{ product.batch_number }}</span>
                        </div>
                      </div>
                    </VCol>
                    <VCol cols="12" md="4">
                      <div class="d-flex flex-column gap-2">
                        <div class="d-flex justify-space-between">
                          <span class="text-body-2 text-medium-emphasis">Tanggal Kadaluarsa:</span>
                          <span class="text-body-2 font-weight-medium">{{ formatDate(product.expiry_date) }}</span>
                        </div>
                      </div>
                    </VCol>
                    <VCol cols="12" md="4">
                      <div class="d-flex flex-column gap-2">
                        <div class="d-flex justify-space-between">
                          <span class="text-body-2 text-medium-emphasis">Tanggal Dibagikan:</span>
                          <span class="text-body-2 font-weight-medium">{{ formatDate(product.dispensed_at) }}</span>
                        </div>
                      </div>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>

            <!-- Personnel Information -->
            <VCol cols="12">
              <VCard variant="outlined">
                <VCardTitle class="pa-4 pb-2">
                  <div class="d-flex align-center gap-2">
                    <VIcon size="20" color="info">
                      tabler-users
                    </VIcon>
                    <h4 class="text-subtitle-1 font-weight-medium">
                      Informasi Petugas
                    </h4>
                  </div>
                </VCardTitle>
                <VCardText class="pa-4 pt-0">
                  <VRow>
                    <VCol cols="12" md="6">
                      <div class="d-flex flex-column gap-2">
                        <div class="d-flex justify-space-between">
                          <span class="text-body-2 text-medium-emphasis">Diresepkan Oleh:</span>
                          <span class="text-body-2 font-weight-medium">{{ product.prescribed_by }}</span>
                        </div>
                      </div>
                    </VCol>
                    <VCol cols="12" md="6">
                      <div class="d-flex flex-column gap-2">
                        <div class="d-flex justify-space-between">
                          <span class="text-body-2 text-medium-emphasis">Dibagikan Oleh:</span>
                          <span class="text-body-2 font-weight-medium">{{ product.dispensed_by }}</span>
                        </div>
                      </div>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>

            <!-- Instructions -->
            <VCol cols="12">
              <VCard variant="outlined">
                <VCardTitle class="pa-4 pb-2">
                  <div class="d-flex align-center gap-2">
                    <VIcon size="20" color="info">
                      tabler-notes
                    </VIcon>
                    <h4 class="text-subtitle-1 font-weight-medium">
                      Instruksi Penggunaan
                    </h4>
                  </div>
                </VCardTitle>
                <VCardText class="pa-4 pt-0">
                  <VTextarea
                    v-model="productForm.instructions"
                    :placeholder="product.instructions || 'Masukkan instruksi penggunaan...'"
                    rows="4"
                    variant="outlined"
                    :rules="[v => !!v || 'Instruksi harus diisi']"
                    required
                    hide-details
                  />
                </VCardText>
              </VCard>
            </VCol>

            <!-- Action Buttons -->
            <VCol cols="12">
              <VDivider class="my-4" />
              <div class="d-flex gap-3 justify-end">
                <VBtn
                  variant="outlined"
                  color="secondary"
                  @click="resetForm"
                >
                  Reset
                </VBtn>
                <VBtn
                  color="primary"
                  :loading="saving"
                  :disabled="!isFormValid"
                  @click="submitProduct"
                >
                  Simpan
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VCol>
      </VRow>

      <!-- Error State -->
      <VRow v-else>
        <VCol cols="12">
          <VCard variant="outlined" color="error">
            <VCardText class="pa-4 text-center">
              <VIcon
                size="64"
                color="error"
                class="mb-4"
              >
                tabler-alert-circle
              </VIcon>
              <h3 class="text-h6 mb-2">
                Produk Tidak Ditemukan
              </h3>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Produk dengan ID {{ productId }} tidak ditemukan atau telah dihapus.
              </p>
              <VBtn
                color="primary"
                variant="tonal"
                :to="{ name: 'transaction-produk' }"
              >
                Kembali ke Daftar
              </VBtn>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert, showSuccessAlert } from '@/utils/errorHandler'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Route and Router
const route = useRoute()
const router = useRouter()

// State
const loading = ref(true)
const saving = ref(false)
const product = ref(null)
const productForm = ref({
  instructions: '',
})

const productFormRef = ref(null)
const isFormValid = ref(false)

// Computed
const productId = computed(() => route.params.id)

// Functions
async function fetchProduct() {
  loading.value = true
  console.log('🔄 Starting fetchProduct...', productId.value)
  
  try {
    const res = await $api(`/rme/visit-products/${productId.value}`, {
      method: 'GET',
    })
    
    console.log('📥 API Response:', res)
    
    product.value = res.data
    productForm.value.instructions = res.data.instructions || ''
    
    console.log('✅ Product loaded:', product.value)
  } catch (error) {
    console.error('❌ Error fetching product:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Produk',
      text: 'Tidak dapat memuat data produk. Silakan coba lagi.',
    })
    product.value = null
  } finally {
    loading.value = false
    console.log('🏁 fetchProduct completed')
  }
}

async function submitProduct() {
  if (!product.value) return
  
  saving.value = true
  console.log('🔄 Starting submitProduct...')
  
  try {
    const requestBody = {
      instructions: productForm.value.instructions,
    }
    
    console.log('📤 API Request body:', requestBody)
    
    const res = await $api(`/rme/visit-products/${productId.value}`, {
      method: 'PATCH',
      body: requestBody,
    })
    
    console.log('📥 API Response:', res)
    
    // Update local data
    product.value = { ...product.value, ...res.data }
    
    await showSuccessAlert({
      title: 'Berhasil',
      text: 'Data produk berhasil diperbarui.',
    })
    
    console.log('✅ Product updated successfully')
  } catch (error) {
    console.error('❌ Error updating product:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memperbarui Data Produk',
      text: 'Tidak dapat memperbarui data produk. Silakan coba lagi.',
    })
  } finally {
    saving.value = false
    console.log('🏁 submitProduct completed')
  }
}

function resetForm() {
  if (product.value) {
    productForm.value.instructions = product.value.instructions || ''
  }
}

function getUsageTypeColor(type) {
  switch (type) {
  case 'PRESCRIPTION': return 'primary'
  case 'TREATMENT_CONSUMPTION': return 'success'
  default: return 'secondary'
  }
}

function getUsageTypeText(type) {
  switch (type) {
  case 'PRESCRIPTION': return 'Resep'
  case 'TREATMENT_CONSUMPTION': return 'Konsumsi Perawatan'
  default: return type
  }
}

function getVisitStatusColor(status) {
  switch (status) {
  case 'COMPLETED': return 'success'
  case 'IN_PROGRESS': return 'warning'
  case 'CANCELLED': return 'error'
  default: return 'secondary'
  }
}

function getVisitStatusText(status) {
  switch (status) {
  case 'COMPLETED': return 'Selesai'
  case 'IN_PROGRESS': return 'Sedang Berlangsung'
  case 'CANCELLED': return 'Dibatalkan'
  default: return status || '-'
  }
}

function formatCurrency(amount) {
  if (!amount) return 'Rp 0'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleDateString('id-ID')
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

// Initialize
onMounted(async () => {
  console.log('🚀 Component onMounted triggered')
  await fetchProduct()
})
</script>

<style scoped>
.v-table {
  width: 100%;
  border-collapse: collapse;
}

.v-table th, .v-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.v-table th {
  background: #f5f5f5;
}

.text-center {
  text-align: center;
}
</style> 
