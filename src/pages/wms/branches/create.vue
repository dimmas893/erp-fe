<route lang="yaml">
meta:
  layout: default
  navActiveLink: wms-branches
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
            Tambah Cabang Baru
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Tambahkan cabang klinik baru
          </p>
        </div>
      </div>
      <VBtn
        variant="text"
        color="secondary"
        prepend-icon="tabler-arrow-left"
        :to="{ name: 'wms-branches' }"
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
              Nama Cabang
            </label>
            <VTextField
              v-model="formData.name"
              placeholder="Masukkan nama cabang"
              variant="outlined"
              maxlength="100"
              :rules="[
                v => !!v || 'Nama cabang harus diisi',
                v => v.length <= 100 || 'Nama cabang maksimal 100 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Kode Cabang
            </label>
            <VTextField
              v-model="formData.code"
              placeholder="Contoh: BR-JKT-01"
              variant="outlined"
              maxlength="20"
              :rules="[
                v => !!v || 'Kode cabang harus diisi',
                v => v.length <= 20 || 'Kode cabang maksimal 20 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tipe Cabang
            </label>
            <VSelect
              v-model="formData.type"
              :items="typeOptions"
              variant="outlined"
              placeholder="Pilih tipe cabang"
              :rules="[v => !!v || 'Tipe cabang harus dipilih']"
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
              color="primary"
              :label="formData.is_active ? 'Aktif' : 'Nonaktif'"
              hide-details
            />
          </VCol>

          <!-- Contact Information -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Informasi Kontak
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Alamat
            </label>
            <VTextarea
              v-model="formData.address"
              placeholder="Masukkan alamat lengkap cabang"
              rows="3"
              variant="outlined"
              :rules="[v => !!v || 'Alamat harus diisi']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Telepon
            </label>
            <VTextField
              v-model="formData.phone"
              placeholder="Contoh: +62-21-5551234"
              variant="outlined"
              maxlength="20"
              :rules="[
                v => !!v || 'Telepon harus diisi',
                v => v.length <= 20 || 'Telepon maksimal 20 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Email
            </label>
            <VTextField
              v-model="formData.email"
              placeholder="Contoh: jakarta@klinik.com"
              variant="outlined"
              maxlength="100"
              :rules="[
                v => !!v || 'Email harus diisi', 
                v => /.+@.+\..+/.test(v) || 'Email tidak valid',
                v => v.length <= 100 || 'Email maksimal 100 karakter'
              ]"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Regional Warehouse
            </label>
            <VSelect
              v-model="formData.regional_warehouse_id"
              :items="warehouses"
              :loading="loadingWarehouses"
              variant="outlined"
              placeholder="Pilih regional warehouse"
              clearable
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Manager Cabang
            </label>
            <VSelect
              v-model="formData.manager_id"
              :items="employees"
              :loading="loadingEmployees"
              variant="outlined"
              placeholder="Pilih manager cabang"
              clearable
              hide-details
            />
          </VCol>

          <!-- Capacity and Settings -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Kapasitas dan Pengaturan
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Kapasitas Maksimal (m³)
            </label>
            <VTextField
              v-model="formData.max_stock_capacity_m3"
              type="number"
              step="0.01"
              placeholder="Contoh: 30.00"
              variant="outlined"
              :rules="[v => !!v || 'Kapasitas harus diisi', v => v > 0 || 'Kapasitas harus lebih dari 0']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Auto Reorder
            </label>
            <VSwitch
              v-model="formData.auto_reorder_enabled"
              color="primary"
              :label="formData.auto_reorder_enabled ? 'Diaktifkan' : 'Dinonaktifkan'"
              hide-details
            />
          </VCol>

          <!-- Operational Hours -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Jam Operasional
            </h3>
          </VCol>

          <VCol cols="12">
            <VCard variant="outlined">
              <VCardText class="pa-4">
                <VRow>
                  <VCol cols="12" md="6" v-for="day in operationalDays" :key="day.value">
                    <div class="d-flex align-center justify-space-between mb-3">
                      <span class="text-subtitle-2 font-weight-medium">{{ day.label }}</span>
                      <VSwitch
                        v-model="formData.operational_hours[day.value].enabled"
                        color="primary"
                        density="compact"
                        hide-details
                      />
                    </div>
                    <div v-if="formData.operational_hours[day.value].enabled" class="d-flex gap-2">
                      <VTextField
                        v-model="formData.operational_hours[day.value].open"
                        type="time"
                        label="Buka"
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                      <VTextField
                        v-model="formData.operational_hours[day.value].close"
                        type="time"
                        label="Tutup"
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                    </div>
                    <div v-else class="text-caption text-medium-emphasis">
                      Tutup
                    </div>
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </VCol>

          <!-- Settings -->
          <VCol cols="12" class="mt-6">
            <h3 class="text-h6 mb-4">
              Pengaturan Lanjutan
            </h3>
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Maksimal Hari Stok
            </label>
            <VTextField
              v-model="formData.settings.max_stock_days"
              type="number"
              placeholder="Contoh: 90"
              variant="outlined"
              :rules="[v => !!v || 'Maksimal hari stok harus diisi', v => v > 0 || 'Hari harus lebih dari 0']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Minimal Hari Stok
            </label>
            <VTextField
              v-model="formData.settings.min_stock_days"
              type="number"
              placeholder="Contoh: 14"
              variant="outlined"
              :rules="[v => !!v || 'Minimal hari stok harus diisi', v => v > 0 || 'Hari harus lebih dari 0']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tingkat Prioritas
            </label>
            <VSelect
              v-model="formData.settings.priority_level"
              :items="priorityOptions"
              variant="outlined"
              placeholder="Pilih tingkat prioritas"
              :rules="[v => !!v || 'Tingkat prioritas harus dipilih']"
              required
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Hari Auto Reorder
            </label>
            <VTextField
              v-model="formData.settings.auto_reorder_days"
              type="number"
              placeholder="Contoh: 7"
              variant="outlined"
              :rules="[v => !!v || 'Hari auto reorder harus diisi', v => v > 0 || 'Hari harus lebih dari 0']"
              required
              hide-details
            />
          </VCol>

          <!-- Action Buttons -->
          <VCol cols="12" class="mt-6">
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
                @click="submitForm"
              >
                Simpan
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

// Initialize router
const router = useRouter()

// Form data
const formData = ref({
  name: '',
  code: '',
  type: '',
  address: '',
  phone: '',
  email: '',
  regional_warehouse_id: null,
  manager_id: null,
  max_stock_capacity_m3: '',
  auto_reorder_enabled: true,
  is_active: true,
  operational_hours: {
    monday: { enabled: true, open: '09:00', close: '19:00' },
    tuesday: { enabled: true, open: '09:00', close: '19:00' },
    wednesday: { enabled: true, open: '09:00', close: '19:00' },
    thursday: { enabled: true, open: '09:00', close: '19:00' },
    friday: { enabled: true, open: '09:00', close: '19:00' },
    saturday: { enabled: true, open: '10:00', close: '17:00' },
    sunday: { enabled: false, open: '10:00', close: '17:00' },
  },
  settings: {
    max_stock_days: 90,
    min_stock_days: 14,
    priority_level: 'MEDIUM',
    auto_reorder_days: 7,
  },
})

// Form validation
const formRef = ref()
const isFormValid = ref(false)
const saving = ref(false)

// Options
const typeOptions = [
  { title: 'FLAGSHIP', value: 'FLAGSHIP' },
  { title: 'STANDARD', value: 'STANDARD' },
  { title: 'MINI', value: 'MINI' },
]

const priorityOptions = [
  { title: 'LOW', value: 'LOW' },
  { title: 'MEDIUM', value: 'MEDIUM' },
  { title: 'HIGH', value: 'HIGH' },
]

const operationalDays = [
  { label: 'Senin', value: 'monday' },
  { label: 'Selasa', value: 'tuesday' },
  { label: 'Rabu', value: 'wednesday' },
  { label: 'Kamis', value: 'thursday' },
  { label: 'Jumat', value: 'friday' },
  { label: 'Sabtu', value: 'saturday' },
  { label: 'Minggu', value: 'sunday' },
]

// Data for dropdowns
const warehouses = ref([])
const loadingWarehouses = ref(false)
const employees = ref([])
const loadingEmployees = ref(false)

// Functions
async function loadWarehouses() {
  try {
    loadingWarehouses.value = true
    const response = await $api('/wms/regional-warehouses', { method: 'GET' })
    warehouses.value = (response.data || []).map(warehouse => ({
      title: warehouse.name,
      value: warehouse.id,
    }))
    console.log('✅ Warehouses loaded:', warehouses.value.length)
  } catch (error) {
    console.error('❌ Error loading warehouses:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Warehouse',
      text: 'Tidak dapat memuat daftar warehouse. Silakan refresh halaman.',
    })
  } finally {
    loadingWarehouses.value = false
  }
}

async function loadEmployees() {
  try {
    loadingEmployees.value = true
    const response = await $api('/hris/employees', { method: 'GET' })
    employees.value = (response.data || []).map(employee => ({
      title: `${employee.name} (${employee.email})`,
      value: employee.id,
    }))
    console.log('✅ Employees loaded:', employees.value.length)
  } catch (error) {
    console.error('❌ Error loading employees:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Karyawan',
      text: 'Tidak dapat memuat daftar karyawan. Silakan refresh halaman.',
    })
  } finally {
    loadingEmployees.value = false
  }
}

function resetForm() {
  formData.value = {
    name: '',
    code: '',
    type: '',
    address: '',
    phone: '',
    email: '',
    regional_warehouse_id: null,
    manager_id: null,
    max_stock_capacity_m3: '',
    auto_reorder_enabled: true,
    is_active: true,
    operational_hours: {
      monday: { enabled: true, open: '09:00', close: '19:00' },
      tuesday: { enabled: true, open: '09:00', close: '19:00' },
      wednesday: { enabled: true, open: '09:00', close: '19:00' },
      thursday: { enabled: true, open: '09:00', close: '19:00' },
      friday: { enabled: true, open: '09:00', close: '19:00' },
      saturday: { enabled: true, open: '10:00', close: '17:00' },
      sunday: { enabled: false, open: '10:00', close: '17:00' },
    },
    settings: {
      max_stock_days: 90,
      min_stock_days: 14,
      priority_level: 'MEDIUM',
      auto_reorder_days: 7,
    },
  }
  formRef.value?.reset()
}

async function submitForm() {
  const isValid = await formRef.value?.validate()
  if (!isValid) return

  saving.value = true

  try {
    // Prepare operational hours data
    const operationalHours = {}
    Object.keys(formData.value.operational_hours).forEach(day => {
      const dayData = formData.value.operational_hours[day]
      if (dayData.enabled) {
        operationalHours[day] = {
          open: dayData.open,
          close: dayData.close,
        }
      } else {
        operationalHours[day] = 'CLOSED'
      }
    })

    const requestData = {
      name: formData.value.name,
      code: formData.value.code,
      type: formData.value.type,
      address: formData.value.address,
      phone: formData.value.phone,
      email: formData.value.email,
      regional_warehouse_id: formData.value.regional_warehouse_id,
      manager_id: formData.value.manager_id,
      max_stock_capacity_m3: parseFloat(formData.value.max_stock_capacity_m3),
      auto_reorder_enabled: formData.value.auto_reorder_enabled,
      is_active: formData.value.is_active,
      operational_hours: operationalHours,
      settings: {
        max_stock_days: parseInt(formData.value.settings.max_stock_days),
        min_stock_days: parseInt(formData.value.settings.min_stock_days),
        priority_level: formData.value.settings.priority_level,
        auto_reorder_days: parseInt(formData.value.settings.auto_reorder_days),
      },
    }

    console.log('📤 Submitting branch data:', requestData)

    const res = await $api('/wms/branches', {
      method: 'POST',
      body: requestData,
    })

    console.log('✅ Branch created:', res.data)

    await showSuccessAlert({
      title: 'Berhasil',
      text: 'Cabang berhasil ditambahkan.',
    })

    // Redirect to branches list
    router.push({ name: 'wms-branches' })
  } catch (error) {
    console.error('❌ Error creating branch:', error)
    await showErrorAlert(error, {
      title: 'Gagal Menambahkan Cabang',
      text: 'Tidak dapat menambahkan cabang. Silakan coba lagi.',
    })
  } finally {
    saving.value = false
  }
}

// Initialize
onMounted(() => {
  loadWarehouses()
  loadEmployees()
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
