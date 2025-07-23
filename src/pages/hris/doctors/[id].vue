<route lang="yaml">
meta:
  layout: default
  navActiveLink: hris-doctors
</route>

<template>
  <VCard>
    <VProgressLinear
      v-if="loading"
      indeterminate
      color="primary"
    />

    <VCardText v-if="loading">
      <!-- Loading skeleton -->
      <div class="d-flex align-center gap-4 mb-6">
        <VSkeleton
          type="avatar"
          size="72"
        />
        <div class="flex-grow-1">
          <VSkeleton
            type="heading"
            class="mb-2"
          />
          <VSkeleton
            type="chip"
            width="80"
          />
        </div>
      </div>
      
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VSkeletonLoader type="list-item-two-line@8" />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VSkeletonLoader type="list-item-two-line@8" />
        </VCol>
      </VRow>
    </VCardText>

    <VCardText v-else-if="doctor">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center gap-4">
          <VAvatar
            size="72"
            color="primary"
          >
            <VIcon size="40">
              tabler-user-md
            </VIcon>
          </VAvatar>
          <div class="flex-grow-1">
            <h2 class="text-h4 font-weight-bold mb-1">
              {{ doctor.name }}
            </h2>
            <div class="d-flex align-center gap-2">
              <VChip
                color="primary"
                size="small"
                variant="outlined"
              >
                {{ doctor.doctor_code }}
              </VChip>
              <VChip
                :color="doctor.is_active ? 'success' : 'error'"
                size="small"
              >
                {{ doctor.is_active ? 'Aktif' : 'Nonaktif' }}
              </VChip>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="d-flex gap-2">
          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="tabler-arrow-left"
            :to="{ name: 'hris-doctors' }"
          >
            Kembali
          </VBtn>
        </div>
      </div>

      <!-- Basic Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-info-circle
        </VIcon>
        Informasi Dasar
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Nama Dokter
            </div>
            <div class="text-h6 font-weight-medium">
              {{ doctor.name }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kode Dokter
            </div>
            <div class="text-h6 font-weight-medium">
              {{ doctor.doctor_code }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Spesialisasi
            </div>
            <div class="text-body-1">
              {{ doctor.specialization }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Nomor Lisensi
            </div>
            <div class="text-body-1">
              {{ doctor.license_number }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status
            </div>
            <VChip
              :color="doctor.is_active ? 'success' : 'error'"
              size="small"
              variant="tonal"
            >
              {{ doctor.is_active ? 'Aktif' : 'Nonaktif' }}
            </VChip>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Gender
            </div>
            <VChip
              :color="getGenderColor(doctor.gender)"
              size="small"
              variant="tonal"
            >
              {{ getGenderLabel(doctor.gender) }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Pengalaman
            </div>
            <VChip
              color="warning"
              size="small"
              variant="tonal"
            >
              {{ doctor.experience_years }} tahun
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Biaya Konsultasi
            </div>
            <VChip
              color="success"
              size="small"
              variant="tonal"
            >
              {{ formatCurrency(doctor.consultation_fee) }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Cabang
            </div>
            <div class="text-body-1">
              {{ branchName || '-' }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Karyawan
            </div>
            <div class="text-body-1">
              {{ employeeName || '-' }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Bergabung
            </div>
            <div class="text-body-1">
              {{ doctor.join_date ? formatDate(doctor.join_date) : '-' }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Contact Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-phone
        </VIcon>
        Informasi Kontak
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Telepon
            </div>
            <div class="text-body-1">
              {{ doctor.phone }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Email
            </div>
            <div class="text-body-1">
              {{ doctor.email }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Alamat
            </div>
            <div class="text-body-1">
              {{ doctor.address }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Personal Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-user
        </VIcon>
        Informasi Pribadi
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Lahir
            </div>
            <div class="text-body-1">
              {{ doctor.birth_date ? formatDate(doctor.birth_date) : '-' }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Pendidikan
            </div>
            <div class="text-body-1">
              {{ doctor.education }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Additional Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-notes
        </VIcon>
        Informasi Tambahan
      </h3>
      
      <VRow class="mb-6">
        <VCol cols="12">
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Catatan
            </div>
            <div class="text-body-1">
              {{ doctor.notes || '-' }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Timestamps -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-clock
        </VIcon>
        Informasi Waktu
      </h3>
      
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Dibuat
            </div>
            <div class="text-body-1">
              {{ doctor.created_at ? formatDateTime(doctor.created_at) : '-' }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Diperbarui
            </div>
            <div class="text-body-1">
              {{ doctor.updated_at ? formatDateTime(doctor.updated_at) : '-' }}
            </div>
          </div>
        </VCol>
      </VRow>
      <!-- Doctor Treatments -->
      <VDivider class="my-6" />
      <div class="d-flex align-center justify-space-between mb-4">
        <h3 class="text-h6 font-weight-medium">
          <VIcon class="me-2">
            tabler-stethoscope
          </VIcon>
          Treatment Dokter
        </h3>
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          @click="openAddTreatmentDialog"
        >
          Tambah Treatment
        </VBtn>
      </div>
      
      <VRow class="mb-6">
        <VCol cols="12">
          <div v-if="loadingTreatments" class="text-center py-8">
            <VProgressCircular
              indeterminate
              color="primary"
            />
            <div class="mt-2 text-medium-emphasis">
              Memuat data treatment...
            </div>
          </div>
          
          <div v-else-if="doctorTreatments.length === 0" class="text-center py-8">
            <VIcon
              size="48"
              color="medium-emphasis"
              class="mb-2"
            >
              tabler-stethoscope-off
            </VIcon>
            <div class="text-medium-emphasis">
              Belum ada treatment yang ditambahkan
            </div>
          </div>
          
          <div v-else>
            <VRow>
              <VCol
                v-for="treatment in doctorTreatments"
                :key="treatment.id"
                cols="12"
                md="6"
                lg="4"
              >
                <VCard variant="outlined">
                  <VCardText>
                    <div class="d-flex align-center justify-space-between mb-2">
                      <div class="d-flex align-center gap-2">
                        <VChip
                          color="primary"
                          size="small"
                          variant="tonal"
                        >
                          {{ treatment.treatment.code }}
                        </VChip>
                        <VChip
                          :color="treatment.is_active ? 'success' : 'error'"
                          size="small"
                          variant="tonal"
                        >
                          {{ treatment.is_active ? 'Aktif' : 'Nonaktif' }}
                        </VChip>
                      </div>
                      <VTooltip location="top">
                        <template #activator="{ props }">
                          <VBtn
                            v-bind="props"
                            icon
                            size="small"
                            color="error"
                            variant="text"
                            @click="confirmDeleteTreatment(treatment)"
                            :loading="deletingTreatmentId === treatment.id"
                            :disabled="deletingTreatmentId !== null && deletingTreatmentId !== treatment.id"
                          >
                            <VIcon>tabler-trash</VIcon>
                          </VBtn>
                        </template>
                        <span>Hapus Treatment</span>
                      </VTooltip>
                    </div>
                    
                    <h4 class="text-h6 font-weight-medium mb-2">
                      {{ treatment.treatment.name }}
                    </h4>
                    
                    <p class="text-body-2 text-medium-emphasis mb-3">
                      {{ treatment.treatment.description }}
                    </p>
                    
                    <div v-if="treatment.notes" class="mb-3">
                      <div class="text-caption text-medium-emphasis mb-1">
                        Catatan:
                      </div>
                      <div class="text-body-2">
                        {{ treatment.notes }}
                      </div>
                    </div>
                    
                    <div class="text-caption text-medium-emphasis">
                      Ditambahkan: {{ formatDate(treatment.created_at) }}
                    </div>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
            
            <!-- Pagination -->
            <div v-if="treatmentMeta.last_page > 1" class="d-flex justify-center mt-6">
              <VPagination
                v-model="treatmentPage"
                :length="treatmentMeta.last_page"
                :total-visible="7"
                @update:model-value="fetchDoctorTreatments"
              />
            </div>
          </div>
        </VCol>
      </VRow>

    </VCardText>

    <VCardText v-else>
      <!-- Not Found -->
      <div class="text-center py-12">
        <VIcon
          size="64"
          color="error"
          class="mb-4"
        >
          tabler-alert-circle
        </VIcon>
        <h3 class="text-h6 mb-2">
          Data tidak ditemukan
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Dokter yang Anda cari tidak ditemukan atau telah dihapus
        </p>
        <VBtn
          color="primary"
          variant="tonal"
          :to="{ name: 'hris-doctors' }"
        >
          Kembali ke Daftar
        </VBtn>
      </div>
    </VCardText>
  </VCard>

  <!-- Add Treatment Dialog -->
  <VDialog
    v-model="showAddTreatmentDialog"
    max-width="600"
    :persistent="submittingTreatment"
  >
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between">
        <span>Tambah Treatment untuk {{ doctor?.name }}</span>
        <VBtn
          icon
          variant="text"
          size="small"
          :disabled="submittingTreatment"
          @click="closeAddTreatmentDialog"
        >
          <VIcon>tabler-x</VIcon>
        </VBtn>
      </VCardTitle>
      
      <VCardText>
        <VForm ref="addTreatmentForm" @submit.prevent="submitAddTreatment">
          <VRow>
            <VCol cols="12">
              <div class="text-body-2 font-weight-medium mb-2">
                Pilih Treatment
              </div>
              <VAutocomplete
                v-model="newTreatment.treatment_id"
                :items="availableTreatments"
                item-title="name"
                item-value="id"
                placeholder="Ketik untuk mencari treatment..."
                :rules="[v => v !== null && v !== undefined || 'Treatment harus dipilih']"
                required
                :loading="loadingTreatmentsList"
                :disabled="loadingTreatmentsList"
                clearable
                :custom-filter="customFilter"
                :menu-props="{ maxHeight: '300px' }"
                variant="outlined"
                hide-details="auto"
              >
                <template #item="{ props, item }">
                  <VListItem v-bind="props">
                    <template #title>
                      <div class="d-flex align-center">
                        <span class="font-weight-medium">{{ item.raw.name }}</span>
                        <VChip
                          size="x-small"
                          color="primary"
                          variant="tonal"
                          class="ms-2"
                        >
                          {{ item.raw.code }}
                        </VChip>
                      </div>
                    </template>
                    <template #subtitle>
                      <div class="d-flex align-center mt-1">
                        <VIcon size="16" class="me-1">tabler-category</VIcon>
                        <span>{{ item.raw.category?.name || 'Tanpa Kategori' }}</span>
                        <span class="mx-2">•</span>
                        <VIcon size="16" class="me-1">tabler-clock</VIcon>
                        <span>{{ item.raw.duration_minutes }} menit</span>
                      </div>
                    </template>
                  </VListItem>
                </template>
                <template #selection="{ item }">
                  <div class="d-flex align-center">
                    <span class="font-weight-medium">{{ item.raw.name }}</span>
                    <VChip
                      size="x-small"
                      color="primary"
                      variant="tonal"
                      class="ms-2"
                    >
                      {{ item.raw.code }}
                    </VChip>
                  </div>
                </template>
                <template #no-data>
                  <div v-if="loadingTreatmentsList" class="text-center py-4">
                    <VProgressCircular
                      indeterminate
                      size="20"
                      color="primary"
                    />
                    <div class="mt-2 text-caption">
                      Memuat data treatment...
                    </div>
                  </div>
                  <div v-else class="text-center py-4 text-medium-emphasis">
                    Tidak ada treatment tersedia
                  </div>
                </template>
              </VAutocomplete>
            </VCol>
            
            <VCol cols="12">
              <div class="text-body-2 font-weight-medium mb-2">
                Catatan
              </div>
              <VTextarea
                v-model="newTreatment.notes"
                placeholder="Tambahkan catatan khusus tentang pengalaman dokter dalam treatment ini"
                rows="3"
                auto-grow
                variant="outlined"
                hide-details="auto"
              />
            </VCol>
            
            <!-- Treatment Details Preview -->
            <VCol cols="12" v-if="selectedTreatmentDetails">
              <VCard variant="outlined" class="pa-4">
                <h4 class="text-h6 font-weight-medium mb-3">
                  Detail Treatment
                </h4>
                <VRow>
                  <VCol cols="12" md="6">
                    <div class="mb-2">
                      <span class="text-caption text-medium-emphasis">Kode:</span>
                      <div class="font-weight-medium">{{ selectedTreatmentDetails.code }}</div>
                    </div>
                    <div class="mb-2">
                      <span class="text-caption text-medium-emphasis">Kategori:</span>
                      <div class="font-weight-medium">{{ selectedTreatmentDetails.category?.name || 'Tanpa Kategori' }}</div>
                    </div>
                    <div class="mb-2">
                      <span class="text-caption text-medium-emphasis">Durasi:</span>
                      <div class="font-weight-medium">{{ selectedTreatmentDetails.duration_minutes }} menit</div>
                    </div>
                  </VCol>
                  <VCol cols="12" md="6">
                    <div class="mb-2">
                      <span class="text-caption text-medium-emphasis">Persiapan:</span>
                      <div class="font-weight-medium">{{ selectedTreatmentDetails.preparation_time_minutes }} menit</div>
                    </div>
                    <div class="mb-2">
                      <span class="text-caption text-medium-emphasis">Konsultasi:</span>
                      <VChip
                        :color="selectedTreatmentDetails.requires_consultation ? 'warning' : 'success'"
                        size="small"
                        variant="tonal"
                      >
                        {{ selectedTreatmentDetails.requires_consultation ? 'Diperlukan' : 'Tidak Diperlukan' }}
                      </VChip>
                    </div>
                    <div class="mb-2">
                      <span class="text-caption text-medium-emphasis">Dokter:</span>
                      <VChip
                        :color="selectedTreatmentDetails.requires_doctor ? 'error' : 'success'"
                        size="small"
                        variant="tonal"
                      >
                        {{ selectedTreatmentDetails.requires_doctor ? 'Diperlukan' : 'Tidak Diperlukan' }}
                      </VChip>
                    </div>
                  </VCol>
                  <VCol cols="12">
                    <div class="mb-2">
                      <span class="text-caption text-medium-emphasis">Deskripsi:</span>
                      <div class="text-body-2">{{ selectedTreatmentDetails.description }}</div>
                    </div>
                  </VCol>
                </VRow>
              </VCard>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      
      <VCardActions>
        <VSpacer />
        <VBtn
          variant="outlined"
          :disabled="submittingTreatment"
          @click="closeAddTreatmentDialog"
        >
          Batal
        </VBtn>
        <VBtn
          color="primary"
          :loading="submittingTreatment"
          :disabled="submittingTreatment"
          @click="submitAddTreatment"
        >
          {{ submittingTreatment ? 'Menambahkan Treatment...' : 'Tambah Treatment' }}
        </VBtn>
             </VCardActions>
     </VCard>
   </VDialog>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert } from '@/utils/errorHandler'
import Swal from 'sweetalert2'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// Route
const route = useRoute()

// Data
const doctor = ref(null)
const loading = ref(false)
const branchName = ref('')
const employeeName = ref('')

// Treatment related data
const doctorTreatments = ref([])
const loadingTreatments = ref(false)
const treatmentPage = ref(1)
const treatmentMeta = ref({})
const availableTreatments = ref([])
const loadingTreatmentsList = ref(false)

// Dialog data
const showAddTreatmentDialog = ref(false)
const submittingTreatment = ref(false)
const addTreatmentForm = ref(null)
const newTreatment = ref({
  treatment_id: null,
  notes: ''
})

// Delete treatment data
const deletingTreatmentId = ref(null)

// Computed properties
const selectedTreatmentDetails = computed(() => {
  if (!newTreatment.value.treatment_id || !availableTreatments.value.length) return null
  return availableTreatments.value.find(treatment => treatment.id === newTreatment.value.treatment_id)
})

// Custom filter function for autocomplete
const customFilter = (itemTitle, queryText, item) => {
  const textOne = item.raw.name.toLowerCase()
  const textTwo = item.raw.code.toLowerCase()
  const textThree = item.raw.category?.name?.toLowerCase() || ''
  const searchText = queryText.toLowerCase()
  
  return textOne.includes(searchText) || 
         textTwo.includes(searchText) || 
         textThree.includes(searchText)
}

// Methods
const fetchDoctorTreatments = async () => {
  if (!doctor.value?.id) return
  
  loadingTreatments.value = true
  console.log('🔄 Starting fetchDoctorTreatments...')
  
  try {
    const res = await $api('/hris/doctor-treatments', {
      method: 'GET',
      params: {
        doctor_id: doctor.value.id,
        page: treatmentPage.value,
        per_page: 12
      }
    })
    
    console.log('📥 Doctor Treatments Response:', res)
    
    if (res && res.response_code === 200) {
      doctorTreatments.value = res.data
      treatmentMeta.value = res.meta || {}
    } else {
      doctorTreatments.value = []
      treatmentMeta.value = {}
    }
  } catch (error) {
    console.error('❌ Error fetching doctor treatments:', error)
    doctorTreatments.value = []
    treatmentMeta.value = {}
  } finally {
    loadingTreatments.value = false
    console.log('🏁 fetchDoctorTreatments completed')
  }
}

const fetchAvailableTreatments = async () => {
  loadingTreatmentsList.value = true
  console.log('🔄 Starting fetchAvailableTreatments...')
  
  try {
    const res = await $api('/crm/treatments', {
      method: 'GET',
      params: {
        per_page: 1000,
        filters: [
          {
            field: 'is_active',
            filter_type: '=',
            value: true
          }
        ]
      }
    })
    
    console.log('📥 Available Treatments Response:', res)
    
    if (res && res.response_code === 200) {
      availableTreatments.value = res.data || []
    } else {
      availableTreatments.value = []
    }
  } catch (error) {
    console.error('❌ Error fetching available treatments:', error)
    availableTreatments.value = []
  } finally {
    loadingTreatmentsList.value = false
    console.log('🏁 fetchAvailableTreatments completed')
  }
}

const openAddTreatmentDialog = async () => {
  showAddTreatmentDialog.value = true
  newTreatment.value = {
    treatment_id: null,
    notes: ''
  }
  
  // Fetch available treatments if not already loaded
  if (availableTreatments.value.length === 0) {
    await fetchAvailableTreatments()
  }
}

const closeAddTreatmentDialog = () => {
  showAddTreatmentDialog.value = false
  newTreatment.value = {
    treatment_id: null,
    notes: ''
  }
  if (addTreatmentForm.value) {
    addTreatmentForm.value.reset()
  }
  console.log('✅ Modal closed successfully')
}

const submitAddTreatment = async () => {
  if (!addTreatmentForm.value) return
  
  const { valid } = await addTreatmentForm.value.validate()
  if (!valid) return
  
  // Additional validation
  if (!newTreatment.value.treatment_id || newTreatment.value.treatment_id === null) {
    await Swal.fire({
      title: 'Data Tidak Lengkap',
      text: 'Silakan pilih treatment terlebih dahulu.',
      icon: 'warning',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
      customClass: {
        popup: 'swal-high-z-index'
      },
      didOpen: () => {
        const popup = Swal.getPopup()
        if (popup) {
          popup.style.zIndex = '9999'
        }
      }
    })
    return
  }
  
  if (!doctor.value?.id) {
    await Swal.fire({
      title: 'Data Dokter Tidak Ditemukan',
      text: 'Data dokter tidak valid. Silakan refresh halaman.',
      icon: 'error',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
      customClass: {
        popup: 'swal-high-z-index'
      },
      didOpen: () => {
        const popup = Swal.getPopup()
        if (popup) {
          popup.style.zIndex = '9999'
        }
      }
    })
    return
  }
  
  // Check if treatment already exists for this doctor
  const existingTreatment = doctorTreatments.value.find(t => 
    t.treatment_id === newTreatment.value.treatment_id
  )
  
  if (existingTreatment) {
    await Swal.fire({
      title: 'Treatment Sudah Ada',
      text: `Treatment "${existingTreatment.treatment.name}" sudah ada untuk dokter ini.`,
      icon: 'warning',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
      customClass: {
        popup: 'swal-high-z-index'
      },
      didOpen: () => {
        const popup = Swal.getPopup()
        if (popup) {
          popup.style.zIndex = '9999'
        }
      }
    })
    return
  }
  
  submittingTreatment.value = true
  console.log('🔄 Starting submitAddTreatment...')
  
  // Log request data
  const requestData = {
    doctor_id: doctor.value.id,
    treatment_id: newTreatment.value.treatment_id,
    notes: newTreatment.value.notes || ''
  }
  
  console.log('📤 Request data:', requestData)
  
  try {
    // Retry mechanism for network issues
    let res = null
    let retryCount = 0
    const maxRetries = 2
    
    while (retryCount <= maxRetries) {
      try {
        res = await $api('/hris/doctor-treatments', {
          method: 'POST',
          body: requestData
        })
        
        console.log(`📥 Add Treatment Response (attempt ${retryCount + 1}):`, res)
        break // Success, exit retry loop
        
      } catch (retryError) {
        retryCount++
        console.warn(`⚠️ Attempt ${retryCount} failed:`, retryError)
        
        if (retryCount > maxRetries) {
          throw retryError // Re-throw if max retries reached
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
      }
    }
    
    if (res && res.response_code === 201) {
      // Show success message
      console.log('✅ Treatment added successfully')
      
      // Store treatment name before closing dialog
      const treatmentName = res.data?.treatment?.name || 
                           selectedTreatmentDetails.value?.name || 
                           availableTreatments.value.find(t => t.id === newTreatment.value.treatment_id)?.name || 
                           'Treatment'
      
      console.log('📝 Treatment details for success message:', {
        responseData: res.data,
        selectedTreatmentDetails: selectedTreatmentDetails.value,
        treatmentId: newTreatment.value.treatment_id,
        availableTreatments: availableTreatments.value,
        foundTreatment: availableTreatments.value.find(t => t.id === newTreatment.value.treatment_id),
        finalTreatmentName: treatmentName
      })
      
      // Close dialog first
      closeAddTreatmentDialog()
      
      // Ensure modal is closed
      if (showAddTreatmentDialog.value) {
        showAddTreatmentDialog.value = false
        console.log('🔄 Force closing modal...')
      }
      
      // Refresh treatments
      await fetchDoctorTreatments()
      
      // Show success alert using Swal directly
      await Swal.fire({
        title: 'Berhasil Menambahkan Treatment',
        text: `Treatment "${treatmentName}" berhasil ditambahkan ke dokter ${doctor.value?.name}.`,
        icon: 'success',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'swal-high-z-index'
        },
        didOpen: () => {
          // Ensure alert is on top
          const popup = Swal.getPopup()
          if (popup) {
            popup.style.zIndex = '9999'
          }
        }
      })
    } else {
      // Handle non-201 response
      console.warn('⚠️ Unexpected response code:', res?.response_code)
      console.warn('⚠️ Response data:', res)
      
      if (res?.response_code === 400) {
        throw new Error(`Bad Request: ${res?.response_message || 'Data tidak valid'}`)
      } else if (res?.response_code === 409) {
        throw new Error(`Conflict: Treatment sudah ada untuk dokter ini`)
      } else if (res?.response_code === 422) {
        throw new Error(`Validation Error: ${res?.response_message || 'Data tidak sesuai format'}`)
      } else {
        throw new Error(`Unexpected response (${res?.response_code}): ${res?.response_message || 'Unknown error'}`)
      }
    }
  } catch (error) {
    console.error('❌ Error adding treatment:', error)
    
    // Close dialog first
    closeAddTreatmentDialog()
    
    // Show error alert
    await Swal.fire({
      title: 'Gagal Menambah Treatment',
      text: 'Tidak dapat menambahkan treatment. Silakan coba lagi.',
      icon: 'error',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
      customClass: {
        popup: 'swal-high-z-index'
      },
      didOpen: () => {
        // Ensure alert is on top
        const popup = Swal.getPopup()
        if (popup) {
          popup.style.zIndex = '9999'
        }
      }
    })
  } finally {
    submittingTreatment.value = false
    console.log('🏁 submitAddTreatment completed')
  }
}

const confirmDeleteTreatment = async (treatment) => {
  const result = await Swal.fire({
    title: 'Konfirmasi Hapus Treatment',
    text: `Apakah Anda yakin ingin menghapus treatment "${treatment.treatment.name}" dari dokter ${doctor.value?.name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
    allowOutsideClick: false,
  })
  
  if (result.isConfirmed) {
    await deleteTreatment(treatment.id)
  }
}

const deleteTreatment = async (treatmentId) => {
  deletingTreatmentId.value = treatmentId
  console.log('🔄 Starting deleteTreatment...')
  
  try {
    const res = await $api(`/hris/doctor-treatments/${treatmentId}`, {
      method: 'DELETE',
    })
    
    console.log('📥 Delete Treatment Response:', res)
    
    if (res && res.response_code === 200) {
      console.log('✅ Treatment deleted successfully')
      
      // Refresh treatments list
      await fetchDoctorTreatments()
      
      // Show success alert
      await Swal.fire({
        title: 'Berhasil Menghapus Treatment',
        text: 'Treatment berhasil dihapus dari dokter.',
        icon: 'success',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
      })
    }
  } catch (error) {
    console.error('❌ Error deleting treatment:', error)
    await showErrorAlert(error, {
      title: 'Gagal Menghapus Treatment',
      text: 'Tidak dapat menghapus treatment. Silakan coba lagi.',
    })
  } finally {
    deletingTreatmentId.value = null
    console.log('🏁 deleteTreatment completed')
  }
}

const fetchDoctor = async () => {
  loading.value = true
  console.log('🔄 Starting fetchDoctor...')
  
  try {
    const res = await $api(`/hris/doctors/${route.params.id}`, {
      method: 'GET',
    })
    
    console.log('📥 API Response:', res)
    
    if (res && res.response_code === 200) {
      doctor.value = res.data
      
      // Fetch branch name if branch_id exists
      if (doctor.value.branch_id) {
        await fetchBranchName(doctor.value.branch_id)
      }
      
      // Fetch employee name if employee_id exists
      if (doctor.value.employee_id) {
        await fetchEmployeeName(doctor.value.employee_id)
      }
    } else {
      doctor.value = null
    }
  } catch (error) {
    console.error('❌ Error fetching doctor:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Dokter',
      text: 'Tidak dapat memuat data dokter. Silakan coba lagi.',
    })
    doctor.value = null
  } finally {
    loading.value = false
    console.log('🏁 fetchDoctor completed')
  }
}

const fetchBranchName = async (branchId) => {
  try {
    const res = await $api('/wms/branches', {
      method: 'GET',
    })
    
    if (res && res.response_code === 200) {
      const branch = res.data.find(b => b.id === branchId)
      if (branch) {
        branchName.value = `${branch.name} (${branch.code})`
      } else {
        branchName.value = 'Cabang tidak ditemukan'
      }
    }
  } catch (error) {
    console.error('❌ Error fetching branch name:', error)
    branchName.value = 'Gagal memuat nama cabang'
  }
}

const fetchEmployeeName = async (employeeId) => {
  try {
    const res = await $api('/hris/employees', {
      method: 'GET',
    })
    
    if (res && res.response_code === 200) {
      const employee = res.data.find(e => e.id === employeeId)
      if (employee) {
        employeeName.value = `${employee.name} (${employee.email})`
      } else {
        employeeName.value = 'Karyawan tidak ditemukan'
      }
    }
  } catch (error) {
    console.error('❌ Error fetching employee name:', error)
    employeeName.value = 'Gagal memuat nama karyawan'
  }
}

const getGenderColor = (gender) => {
  switch (gender) {
    case 'L':
      return 'info'
    case 'P':
      return 'warning'
    default:
      return 'default'
  }
}

const getGenderLabel = (gender) => {
  switch (gender) {
    case 'L':
      return 'Pria'
    case 'P':
      return 'Wanita'
    default:
      return gender
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleDateString('id-ID')
}

function formatCurrency(amount) {
  if (!amount) return '-'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Lifecycle
onMounted(() => {
  console.log('🚀 Component onMounted triggered')
  fetchDoctor()
  
  // Add CSS for high z-index alert
  const style = document.createElement('style')
  style.textContent = `
    .swal-high-z-index {
      z-index: 9999 !important;
    }
    .swal2-container {
      z-index: 9999 !important;
    }
    .swal2-popup {
      z-index: 9999 !important;
    }
  `
  document.head.appendChild(style)
})

// Watch for doctor changes to fetch treatments
watch(doctor, async (newDoctor) => {
  if (newDoctor?.id) {
    await fetchDoctorTreatments()
  }
}, { immediate: true })
</script> 
