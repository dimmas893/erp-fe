<route lang="yaml">
meta:
  layout: default
  navActiveLink: finance-tax-types
</route>

<template>
  <VCard>
    <VCardTitle class="d-flex align-center gap-3">
      <VIcon size="24" color="primary">
        tabler-plus
      </VIcon>
      <span>Tambah Jenis Pajak</span>
    </VCardTitle>

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

    <VDivider />

    <VCardActions class="pa-4">
      <VSpacer />
      <VBtn
        variant="outlined"
        color="secondary"
        :to="{ name: 'finance-tax-types' }"
      >
        Batal
      </VBtn>
      <VBtn
        color="primary"
        :loading="loading"
        :disabled="!isFormValid"
        @click="handleSubmit"
      >
        Simpan
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert, showSuccessAlert } from '@/utils/errorHandler'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form state
const formRef = ref()
const isFormValid = ref(false)
const loading = ref(false)

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

// Validation
const requiredValidator = (value) => {
  if (!value || value.trim() === '') {
    return 'Field ini wajib diisi'
  }
  return true
}

// Methods
async function handleSubmit() {
  if (!formRef.value.validate()) return

  loading.value = true

  try {
    console.log('📤 Submitting tax type data:', formData.value)

    const res = await $api('/finance/tax-types', {
      method: 'POST',
      body: formData.value,
    })

    console.log('📥 API Response:', res)

    await showSuccessAlert({
      title: 'Berhasil!',
      text: 'Jenis pajak berhasil ditambahkan',
    })

    // Navigate back to list
    router.push({ name: 'finance-tax-types' })
  } catch (error) {
    console.error('❌ Error creating tax type:', error)
    await showErrorAlert(error, {
      title: 'Gagal Menambahkan Jenis Pajak',
      text: 'Tidak dapat menambahkan jenis pajak. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style> 
