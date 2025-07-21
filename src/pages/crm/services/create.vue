<route lang="yaml">
meta:
  layout: default
  navActiveLink: crm-services
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
          tabler-stethoscope
        </VIcon>
        <div>
          <h2 class="text-h5 mb-1">
            Tambah Layanan Baru
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Tambahkan layanan baru ke sistem
          </p>
        </div>
      </div>
      <VBtn
        variant="text"
        color="secondary"
        prepend-icon="tabler-arrow-left"
        :to="{ name: 'crm-services' }"
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
              Nama Layanan
            </label>
            <VTextField
              v-model="formData.name"
              placeholder="Masukkan nama layanan"
              variant="outlined"
              maxlength="200"
              :rules="[
                v => !!v || 'Nama layanan harus diisi',
                v => v.length <= 200 || 'Nama layanan maksimal 200 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tipe Layanan
            </label>
            <VSelect
              v-model="formData.service_type"
              :items="serviceTypeOptions"
              variant="outlined"
              placeholder="Pilih tipe layanan"
              :rules="[v => !!v || 'Tipe layanan harus dipilih']"
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
              placeholder="Masukkan deskripsi layanan"
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

          <!-- Service Details -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Detail Layanan
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Durasi (Menit)
            </label>
            <VTextField
              v-model.number="formData.duration_minutes"
              type="number"
              placeholder="30"
              variant="outlined"
              min="0"
              :rules="[
                v => v !== null && v !== undefined || 'Durasi harus diisi',
                v => v >= 0 || 'Durasi tidak boleh negatif'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Status Billable
            </label>
            <VSelect
              v-model="formData.is_billable"
              :items="billableOptions"
              variant="outlined"
              placeholder="Pilih status billable"
              :rules="[v => v !== null && v !== undefined || 'Status billable harus dipilih']"
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
        :to="{ name: 'crm-services' }"
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
  name: '',
  service_type: '',
  description: '',
  duration_minutes: null,
  is_billable: null,
  is_active: true,
})

// Options
const serviceTypeOptions = [
  { title: 'Konsultasi', value: 'CONSULTATION' },
  { title: 'Administrasi', value: 'ADMIN' },
  { title: 'Dukungan', value: 'SUPPORT' },
  { title: 'Lainnya', value: 'OTHER' },
]

const billableOptions = [
  { title: 'Billable', value: true },
  { title: 'Non-Billable', value: false },
]

// Methods
async function handleSubmit() {
  if (!formRef.value.validate()) return

  loading.value = true

  try {
    console.log('📤 Submitting service data:', formData.value)

    const res = await $api('/crm/services', {
      method: 'POST',
      body: formData.value,
    })

    console.log('📥 API Response:', res)

    await showSuccessAlert({
      title: 'Berhasil!',
      text: 'Layanan berhasil ditambahkan',
    })

    // Navigate back to list
    router.push({ name: 'crm-services' })
  } catch (error) {
    console.error('❌ Error creating service:', error)
    await showErrorAlert(error, {
      title: 'Gagal Menambahkan Layanan',
      text: 'Tidak dapat menambahkan layanan. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
  }
}
</script> 
