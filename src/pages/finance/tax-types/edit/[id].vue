<route lang="yaml">
meta:
  layout: default
  navActiveLink: finance-tax-types
</route>

<template>
  <VCard>
    <VProgressLinear v-if="loading" indeterminate color="primary" />

    <!-- Breadcrumb Navigation -->
    <VCardText class="pb-0">
      <VBreadcrumbs :items="breadcrumbItems" divider="tabler-chevron-right">
        <template #title="{ item }">
          <span :class="{ 'text-primary font-weight-medium': item.active }">
            {{ item.title }}
          </span>
        </template>
      </VBreadcrumbs>
    </VCardText>

    <VCardTitle class="d-flex align-center gap-3">
      <VIcon size="24" color="warning">
        tabler-edit
      </VIcon>
      <span>Edit Jenis Pajak</span>
    </VCardTitle>

    <VCardText v-if="loading">
      <!-- Loading skeleton -->
      <div class="d-flex align-center gap-4 mb-6">
        <VSkeleton type="avatar" size="72" />
        <div class="flex-grow-1">
          <VSkeleton type="heading" class="mb-2" />
          <VSkeleton type="chip" width="80" />
        </div>
      </div>
      
      <VRow>
        <VCol cols="12" md="6">
          <VSkeletonLoader type="list-item-two-line@6" />
        </VCol>
        <VCol cols="12" md="6">
          <VSkeletonLoader type="list-item-two-line@6" />
        </VCol>
      </VRow>
    </VCardText>

    <VCardText v-else-if="taxType" class="pa-4">
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
              Kode Pajak *
            </label>
            <VTextField
              v-model="formData.tax_code"
              placeholder="Contoh: PPN, PPH21, PPH23"
              variant="outlined"
              maxlength="10"
              :rules="[
                v => !!v || 'Kode pajak harus diisi',
                v => v.length <= 10 || 'Kode pajak maksimal 10 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Nama Pajak *
            </label>
            <VTextField
              v-model="formData.tax_name"
              placeholder="Contoh: Pajak Pertambahan Nilai"
              variant="outlined"
              maxlength="200"
              :rules="[
                v => !!v || 'Nama pajak harus diisi',
                v => v.length <= 200 || 'Nama pajak maksimal 200 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Kategori Pajak *
            </label>
            <VSelect
              v-model="formData.tax_category"
              :items="taxCategoryOptions"
              variant="outlined"
              placeholder="Pilih kategori pajak"
              :rules="[v => !!v || 'Kategori pajak harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Status
            </label>
            <VSwitch
              v-model="formData.is_active"
              :label="formData.is_active ? 'Aktif' : 'Nonaktif'"
              color="success"
              hide-details
            />
          </VCol>

          <VCol cols="12">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Deskripsi
            </label>
            <VTextarea
              v-model="formData.description"
              placeholder="Masukkan deskripsi atau penjelasan tentang jenis pajak ini..."
              variant="outlined"
              maxlength="500"
              :rules="[
                v => v.length <= 500 || 'Deskripsi maksimal 500 karakter'
              ]"
              hide-details
            />
          </VCol>
        </VRow>
      </VForm>
    </VCardText>

    <VDivider v-if="taxType" />

    <VCardActions v-if="taxType" class="pa-4">
      <VSpacer />
      <VBtn
        variant="outlined"
        color="secondary"
        :to="{ name: 'finance-tax-types-id', params: { id: route.params.id } }"
      >
        Batal
      </VBtn>
      <VBtn
        color="primary"
        :loading="loading"
        :disabled="!isFormValid"
        @click="handleSubmit"
      >
        Simpan Perubahan
      </VBtn>
    </VCardActions>

    <VCardText v-else-if="!taxType">
      <div class="text-center pa-8">
        <VIcon size="64" color="error" class="mb-4">
          tabler-alert-circle
        </VIcon>
        <h4 class="text-h5 font-weight-medium mb-2">Jenis Pajak Tidak Ditemukan</h4>
        <p class="text-medium-emphasis mb-4">
          Jenis pajak dengan ID yang diberikan tidak ditemukan atau telah dihapus.
        </p>
        <VBtn color="primary" prepend-icon="tabler-arrow-left" @click="goBack">
          Kembali ke Daftar Jenis Pajak
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert, showSuccessAlert } from '@/utils/errorHandler'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const formRef = ref()
const taxType = ref(null)
const loading = ref(true)
const isFormValid = ref(false)

// Form data
const formData = ref({
  tax_code: '',
  tax_name: '',
  tax_category: '',
  description: '',
  is_active: true,
})

// Tax category options
const taxCategoryOptions = [
  { title: 'PPN', value: 'PPN' },
  { title: 'PPH', value: 'PPH' },
  { title: 'OTHER', value: 'OTHER' },
]

const breadcrumbItems = ref([
  {
    title: 'Dashboard',
    to: { name: 'dashboards-analytics' },
    active: false,
  },
  {
    title: 'Finance',
    to: { name: 'finance-tax-types' },
    active: false,
  },
  {
    title: 'Jenis Pajak',
    to: { name: 'finance-tax-types' },
    active: false,
  },
  {
    title: 'Edit Jenis Pajak',
    to: { name: 'finance-tax-types-edit-id', params: { id: route.params.id } },
    active: true,
  },
])

// Validation
const requiredValidator = (value) => {
  if (!value || value.trim() === '') {
    return 'Field ini wajib diisi'
  }
  return true
}

// Methods
const loadTaxType = async () => {
  try {
    loading.value = true
    const response = await $api(`/finance/tax-types/${route.params.id}`, {
      method: 'GET',
    })
    
    taxType.value = response.data
    console.log('Tax type data loaded:', taxType.value)
    
    // Populate form data
    formData.value = {
      tax_code: taxType.value.tax_code || '',
      tax_name: taxType.value.tax_name || '',
      tax_category: taxType.value.tax_category || '',
      description: taxType.value.description || '',
      is_active: taxType.value.is_active ?? true,
    }
  } catch (error) {
    console.error('Error loading tax type:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Jenis Pajak',
      text: 'Tidak dapat memuat detail jenis pajak. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  if (!formRef.value.validate()) return

  loading.value = true

  try {
    console.log('📤 Submitting tax type update:', formData.value)

    const res = await $api(`/finance/tax-types/${route.params.id}`, {
      method: 'PATCH',
      body: formData.value,
    })

    console.log('📥 API Response:', res)

    await showSuccessAlert({
      title: 'Berhasil!',
      text: 'Jenis pajak berhasil diperbarui',
    })

    // Redirect to tax type detail
    router.push({ name: 'finance-tax-types-id', params: { id: route.params.id } })
  } catch (error) {
    console.error('❌ Error updating tax type:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memperbarui Jenis Pajak',
      text: 'Tidak dapat memperbarui jenis pajak. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'finance-tax-types' })
}

onMounted(() => {
  loadTaxType()
})
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style> 
