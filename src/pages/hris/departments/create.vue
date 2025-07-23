<route lang="yaml">
meta:
  layout: default
  navActiveLink: hris-departments
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
          tabler-building
        </VIcon>
        <div>
          <h2 class="text-h5 mb-1">
            Tambah Departemen Baru
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Tambahkan departemen baru ke sistem
          </p>
        </div>
      </div>
      <VBtn
        variant="text"
        color="secondary"
        prepend-icon="tabler-arrow-left"
        :to="{ name: 'hris-departments' }"
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
              Informasi Departemen
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Nama Departemen
            </label>
            <VTextField
              v-model="formData.name"
              placeholder="Masukkan nama departemen"
              variant="outlined"
              maxlength="200"
              :rules="[
                v => !!v || 'Nama departemen harus diisi',
                v => v.length <= 200 || 'Nama departemen maksimal 200 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Kode Departemen
            </label>
            <VTextField
              v-model="formData.code"
              placeholder="Contoh: IT, HR, FIN"
              variant="outlined"
              maxlength="50"
              :rules="[
                v => !!v || 'Kode departemen harus diisi',
                v => v.length <= 50 || 'Kode departemen maksimal 50 karakter'
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
              placeholder="Masukkan deskripsi departemen"
              variant="outlined"
              rows="4"
              maxlength="500"
              :rules="[
                v => v.length <= 500 || 'Deskripsi maksimal 500 karakter'
              ]"
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Manager
            </label>
            <AppCombobox
              v-model="formData.manager_id"
              placeholder="Pilih manager..."
              :items="employees"
              :loading="loadingEmployees"
              :rules="[
                v => !!v || 'Manager harus dipilih'
              ]"
              required
              clearable
              hide-details="auto"
            />
          </VCol>
        </VRow>

        <!-- Action Buttons -->
        <VRow class="mt-6">
          <VCol cols="12" class="d-flex gap-3 justify-end">
            <VBtn
              variant="outlined"
              color="secondary"
              :to="{ name: 'hris-departments' }"
            >
              Batal
            </VBtn>
            <VBtn
              color="primary"
              :loading="loading"
              :disabled="!isFormValid"
              @click="handleSubmit"
            >
              Simpan Departemen
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>

<script setup>
import AppCombobox from '@/@core/components/app-form-elements/AppCombobox.vue'
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
  code: '',
  description: '',
  manager_id: null,
})

// Employees data for manager selection
const employees = ref([])
const loadingEmployees = ref(false)

// Functions
async function loadEmployees() {
  try {
    loadingEmployees.value = true

    const response = await $api('/hris/employees', {
      method: 'GET',
    })

    employees.value = response.data.map(employee => ({
      title: `${employee.name} - ${employee.email}`,
      value: parseInt(employee.id), // Ensure it's a number
      data: employee, // Store full employee data
    }))
  } catch (error) {
    console.error('❌ Error loading employees:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Karyawan',
      text: 'Tidak dapat memuat daftar karyawan. Silakan coba lagi.',
    })
  } finally {
    loadingEmployees.value = false
  }
}

async function handleSubmit() {
  if (!formRef.value?.validate()) return

  loading.value = true

  try {
    console.log('📤 Submitting department data:', formData.value)
    console.log('📤 Manager ID type:', typeof formData.value.manager_id, 'Value:', formData.value.manager_id)

    // Ensure manager_id is a number
    const submitData = {
      ...formData.value,
      manager_id: parseInt(formData.value.manager_id)
    }
    
    console.log('📤 Final submit data:', submitData)

    const res = await $api('/hris/departments', {
      method: 'POST',
      body: submitData,
    })

    console.log('📥 API Response:', res)

    // Show success message and redirect
    await showSuccessAlert('Departemen berhasil ditambahkan', 'Berhasil!')

    // Redirect to departments list
    router.push({ name: 'hris-departments' })
  } catch (error) {
    console.error('❌ Error creating department:', error)
    await showErrorAlert(error, {
      title: 'Gagal Menambahkan Departemen',
      text: 'Tidak dapat menambahkan departemen. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
  }
}



// Load employees on mount
onMounted(() => {
  loadEmployees()
})
</script>

<style scoped>
.v-form {
  max-width: 100%;
}

.v-text-field,
.v-textarea,
.v-select {
  width: 100%;
}
</style> 
