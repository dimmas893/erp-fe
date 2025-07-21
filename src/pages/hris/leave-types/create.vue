<route lang="yaml">
meta:
  layout: default
  navActiveLink: hris-leave-types
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
          tabler-calendar-off
        </VIcon>
        <div>
          <h2 class="text-h5 mb-1">
            Tambah Jenis Cuti Baru
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Tambahkan jenis cuti baru ke sistem
          </p>
        </div>
      </div>
      <VBtn
        variant="text"
        color="secondary"
        prepend-icon="tabler-arrow-left"
        :to="{ name: 'hris-leave-types' }"
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
              Kode Jenis Cuti
            </label>
            <VTextField
              v-model="formData.code"
              placeholder="Contoh: CTH"
              variant="outlined"
              maxlength="10"
              :rules="[
                v => !!v || 'Kode jenis cuti harus diisi',
                v => v.length <= 10 || 'Kode maksimal 10 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Nama Jenis Cuti
            </label>
            <VTextField
              v-model="formData.name"
              placeholder="Masukkan nama jenis cuti"
              variant="outlined"
              maxlength="100"
              :rules="[
                v => !!v || 'Nama jenis cuti harus diisi',
                v => v.length <= 100 || 'Nama maksimal 100 karakter'
              ]"
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
              placeholder="Masukkan deskripsi jenis cuti"
              variant="outlined"
              rows="3"
              maxlength="500"
              :rules="[
                v => !!v || 'Deskripsi harus diisi',
                v => v.length <= 500 || 'Deskripsi maksimal 500 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <!-- Leave Configuration -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Konfigurasi Cuti
            </h3>
          </VCol>

          <VCol cols="12" md="4">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Maksimal Hari per Request
            </label>
            <VTextField
              v-model.number="formData.max_days_per_request"
              type="number"
              placeholder="5"
              variant="outlined"
              min="1"
              max="365"
              :rules="[
                v => v !== null && v !== undefined || 'Maksimal hari per request harus diisi',
                v => v >= 1 || 'Minimal 1 hari',
                v => v <= 365 || 'Maksimal 365 hari'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="4">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Maksimal Hari per Tahun
            </label>
            <VTextField
              v-model.number="formData.max_days_per_year"
              type="number"
              placeholder="12"
              variant="outlined"
              min="1"
              max="365"
              :rules="[
                v => v !== null && v !== undefined || 'Maksimal hari per tahun harus diisi',
                v => v >= 1 || 'Minimal 1 hari',
                v => v <= 365 || 'Maksimal 365 hari',
                v => v >= formData.max_days_per_request || 'Maksimal per tahun harus lebih besar dari per request'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="4">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Pemberitahuan Awal (Hari)
            </label>
            <VTextField
              v-model.number="formData.advance_notice_days"
              type="number"
              placeholder="1"
              variant="outlined"
              min="0"
              max="30"
              :rules="[
                v => v !== null && v !== undefined || 'Pemberitahuan awal harus diisi',
                v => v >= 0 || 'Minimal 0 hari',
                v => v <= 30 || 'Maksimal 30 hari'
              ]"
              required
              hide-details
            />
          </VCol>

          <!-- Settings -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Pengaturan
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Status Bayar
            </label>
            <VSelect
              v-model="formData.is_paid"
              :items="paidOptions"
              variant="outlined"
              placeholder="Pilih status bayar"
              :rules="[v => v !== null && v !== undefined || 'Status bayar harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Gender Spesifik
            </label>
            <VSelect
              v-model="formData.gender_specific"
              :items="genderOptions"
              variant="outlined"
              placeholder="Pilih gender"
              :rules="[v => !!v || 'Gender harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Dokumen Wajib
            </label>
            <VSelect
              v-model="formData.requires_document"
              :items="documentOptions"
              variant="outlined"
              placeholder="Pilih kebutuhan dokumen"
              :rules="[v => v !== null && v !== undefined || 'Kebutuhan dokumen harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Perlu Approval
            </label>
            <VSelect
              v-model="formData.approval_required"
              :items="approvalOptions"
              variant="outlined"
              placeholder="Pilih kebutuhan approval"
              :rules="[v => v !== null && v !== undefined || 'Kebutuhan approval harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Status Aktif
            </label>
            <VSelect
              v-model="formData.is_active"
              :items="activeOptions"
              variant="outlined"
              placeholder="Pilih status"
              :rules="[v => v !== null && v !== undefined || 'Status harus dipilih']"
              required
              hide-details
            />
          </VCol>
        </VRow>

        <!-- Action Buttons -->
        <VDivider class="my-6" />
        <div class="d-flex gap-3 justify-end">
          <VBtn
            variant="outlined"
            color="secondary"
            :to="{ name: 'hris-leave-types' }"
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
        </div>
      </VForm>
    </VCardText>
  </VCard>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert, showSuccessAlert } from '@/utils/errorHandler'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

// Router
const router = useRouter()

// Form
const formRef = ref()
const isFormValid = ref(false)
const loading = ref(false)

// Form Data
const formData = reactive({
  name: '',
  code: '',
  description: '',
  max_days_per_request: 5,
  max_days_per_year: 12,
  requires_document: false,
  is_paid: true,
  gender_specific: 'ALL',
  approval_required: true,
  advance_notice_days: 1,
  is_active: true
})

// Options
const paidOptions = [
  { title: 'Berbayar', value: true },
  { title: 'Tidak Berbayar', value: false }
]

const genderOptions = [
  { title: 'Semua Gender', value: 'ALL' },
  { title: 'Pria Saja', value: 'MALE' },
  { title: 'Wanita Saja', value: 'FEMALE' }
]

const documentOptions = [
  { title: 'Dokumen Wajib', value: true },
  { title: 'Dokumen Opsional', value: false }
]

const approvalOptions = [
  { title: 'Perlu Approval', value: true },
  { title: 'Otomatis Disetujui', value: false }
]

const activeOptions = [
  { title: 'Aktif', value: true },
  { title: 'Nonaktif', value: false }
]

// Methods
const handleSubmit = async () => {
  if (!formRef.value.validate()) return

  loading.value = true
  console.log('🔄 Starting submit...')
  
  try {
    const res = await $api('/hris/leave-types', {
      method: 'POST',
      body: formData,
    })
    
    console.log('📥 API Response:', res)
    
    if (res && res.response_code === 201) {
      await showSuccessAlert({
        title: 'Berhasil',
        text: 'Jenis cuti berhasil ditambahkan',
      })
      
      // Redirect to index page
      router.push({ name: 'hris-leave-types' })
    } else {
      throw new Error('Failed to create leave type')
    }
  } catch (error) {
    console.error('❌ Error creating leave type:', error)
    await showErrorAlert(error, {
      title: 'Gagal Menambahkan Jenis Cuti',
      text: 'Tidak dapat menambahkan jenis cuti. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
    console.log('🏁 Submit completed')
  }
}

// Lifecycle
onMounted(() => {
  console.log('🚀 Component onMounted triggered')
})
</script> 
