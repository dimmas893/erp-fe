<route lang="yaml">
meta:
  layout: default
  navActiveLink: crm-promos
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
          tabler-tag
        </VIcon>
        <div>
          <h2 class="text-h5 mb-1">
            Tambah Promo Baru
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Tambahkan promo baru ke sistem
          </p>
        </div>
      </div>
      <VBtn
        variant="text"
        color="secondary"
        prepend-icon="tabler-arrow-left"
        :to="{ name: 'crm-promos' }"
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
              Nama Promo
            </label>
            <VTextField
              v-model="formData.name"
              placeholder="Masukkan nama promo"
              variant="outlined"
              maxlength="200"
              :rules="[
                v => !!v || 'Nama promo harus diisi',
                v => v.length <= 200 || 'Nama promo maksimal 200 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tipe Promo
            </label>
            <VSelect
              v-model="formData.type"
              :items="promoTypeOptions"
              variant="outlined"
              placeholder="Pilih tipe promo"
              :rules="[v => !!v || 'Tipe promo harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Deskripsi
            </label>
            <VTextarea
              v-model="formData.description"
              placeholder="Masukkan deskripsi promo"
              variant="outlined"
              maxlength="500"
              :rules="[
                v => !!v || 'Deskripsi harus diisi',
                v => v.length <= 500 || 'Deskripsi maksimal 500 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <!-- Discount Information -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Informasi Diskon
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tipe Diskon
            </label>
            <VSelect
              v-model="formData.discount_type"
              :items="discountTypeOptions"
              variant="outlined"
              placeholder="Pilih tipe diskon"
              :rules="[v => !!v || 'Tipe diskon harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Nilai Diskon
            </label>
            <VTextField
              v-model.number="formData.discount_value"
              type="number"
              :placeholder="formData.discount_type === 'percentage' ? '20' : '50000'"
              variant="outlined"
              min="0"
              :rules="[
                v => v !== null && v !== undefined || 'Nilai diskon harus diisi',
                v => v >= 0 || 'Nilai diskon tidak boleh negatif',
                v => formData.discount_type !== 'percentage' || v <= 100 || 'Persentase maksimal 100%'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Minimal Pembelian
            </label>
            <VTextField
              v-model.number="formData.min_purchase"
              type="number"
              placeholder="100000"
              variant="outlined"
              min="0"
              :rules="[
                v => v !== null && v !== undefined || 'Minimal pembelian harus diisi',
                v => v >= 0 || 'Minimal pembelian tidak boleh negatif'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Limit Penggunaan
            </label>
            <VTextField
              v-model.number="formData.usage_limit"
              type="number"
              placeholder="100"
              variant="outlined"
              min="1"
              :rules="[
                v => v !== null && v !== undefined || 'Limit penggunaan harus diisi',
                v => v >= 1 || 'Limit penggunaan minimal 1'
              ]"
              required
              hide-details
            />
          </VCol>

          <!-- Date Range -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Periode Promo
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tanggal Mulai
            </label>
            <VTextField
              v-model="formData.start_date"
              type="datetime-local"
              variant="outlined"
              :rules="[v => !!v || 'Tanggal mulai harus diisi']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tanggal Berakhir
            </label>
            <VTextField
              v-model="formData.end_date"
              type="datetime-local"
              variant="outlined"
              :rules="[
                v => !!v || 'Tanggal berakhir harus diisi',
                v => !formData.start_date || v > formData.start_date || 'Tanggal berakhir harus setelah tanggal mulai'
              ]"
              required
              hide-details
            />
          </VCol>

          <!-- Status -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Status
            </h3>
          </VCol>

          <VCol cols="12">
            <VSwitch
              v-model="formData.is_active"
              :label="formData.is_active ? 'Aktif' : 'Nonaktif'"
              color="success"
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
        :to="{ name: 'crm-promos' }"
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
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form state
const formRef = ref()
const isFormValid = ref(false)
const loading = ref(false)

// Form data
const formData = ref({
  name: '',
  type: '',
  description: '',
  discount_type: '',
  discount_value: null,
  min_purchase: null,
  usage_limit: null,
  start_date: '',
  end_date: '',
  is_active: true,
})

// Options
const promoTypeOptions = [
  { title: 'Voucher', value: 'voucher' },
  { title: 'Diskon', value: 'discount' },
  { title: 'Cashback', value: 'cashback' },
]

const discountTypeOptions = [
  { title: 'Persentase', value: 'percentage' },
  { title: 'Nominal', value: 'nominal' },
]

// Watch for discount type changes to update placeholder
watch(() => formData.value.discount_type, (newType) => {
  if (newType === 'percentage') {
    formData.value.discount_value = null
  } else if (newType === 'nominal') {
    formData.value.discount_value = null
  }
})

// Methods
async function handleSubmit() {
  if (!formRef.value.validate()) return

  loading.value = true

  try {
    // Format dates for API
    const submitData = {
      ...formData.value,
      start_date: formData.value.start_date ? new Date(formData.value.start_date).toISOString() : null,
      end_date: formData.value.end_date ? new Date(formData.value.end_date).toISOString() : null,
    }

    console.log('📤 Submitting promo data:', submitData)

    const res = await $api('/crm/promo-engine/promos', {
      method: 'POST',
      body: submitData,
    })

    console.log('📥 API Response:', res)

    await showSuccessAlert({
      title: 'Berhasil!',
      text: 'Promo berhasil ditambahkan',
    })

    // Navigate back to list
    router.push({ name: 'crm-promos' })
  } catch (error) {
    console.error('❌ Error creating promo:', error)
    await showErrorAlert(error, {
      title: 'Gagal Menambahkan Promo',
      text: 'Tidak dapat menambahkan promo. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
  }
}
</script> 
