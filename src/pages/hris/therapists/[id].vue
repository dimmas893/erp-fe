<route lang="yaml">
meta:
  layout: default
  navActiveLink: hris-therapists
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

    <VCardText v-else-if="therapist">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center gap-4">
          <VAvatar
            size="72"
            color="primary"
          >
            <VIcon size="40">
              tabler-user-star
            </VIcon>
          </VAvatar>
          <div class="flex-grow-1">
            <h2 class="text-h4 font-weight-bold mb-1">
              {{ therapist.name }}
            </h2> 
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="d-flex gap-2">
          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="tabler-arrow-left"
            :to="{ name: 'hris-therapists' }"
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
              Nama Terapis
            </div>
            <div class="text-h6 font-weight-medium">
              {{ therapist.name }}
            </div>
          </div> 
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Spesialisasi
            </div>
            <div class="text-body-1">
              {{ therapist.specialization }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Nomor Lisensi
            </div>
            <div class="text-body-1">
              {{ therapist.license_number }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Level Sertifikasi
            </div>
            <VChip
              :color="getCertificationColor(therapist.certification_level)"
              size="small"
              variant="tonal"
            >
              {{ therapist.certification_level }}
            </VChip>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Pengalaman
            </div>
            <VChip
              color="warning"
              size="small"
              variant="tonal"
            >
              {{ therapist.experience_years }} tahun
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Gaji
            </div>
            <VChip
              color="success"
              size="small"
              variant="tonal"
            >
              {{ formatCurrency(therapist.salary) }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Departemen
            </div>
            <div class="text-body-1">
              {{ therapist.department }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Preferensi Shift
            </div>
            <VChip
              color="info"
              size="small"
              variant="tonal"
            >
              {{ therapist.shift_preference }}
            </VChip>
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
              {{ therapist.phone }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Email
            </div>
            <div class="text-body-1">
              {{ therapist.email }}
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
              {{ therapist.address }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Emergency Contact -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-alert-circle
        </VIcon>
        Kontak Darurat
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Nama Kontak Darurat
            </div>
            <div class="text-body-1">
              {{ therapist.emergency_contact?.name || '-' }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Telepon Kontak Darurat
            </div>
            <div class="text-body-1">
              {{ therapist.emergency_contact?.phone || '-' }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Hubungan
            </div>
            <div class="text-body-1">
              {{ therapist.emergency_contact?.relationship || '-' }}
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
              {{ therapist.birth_date ? formatDate(therapist.birth_date) : '-' }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Bergabung
            </div>
            <div class="text-body-1">
              {{ therapist.hire_date ? formatDate(therapist.hire_date) : '-' }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Professional Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-briefcase
        </VIcon>
        Informasi Profesional
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
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
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status Aktif
            </div>
            <VChip
              :color="therapist.is_active ? 'success' : 'error'"
              size="small"
              variant="tonal"
            >
              {{ therapist.is_active ? 'Aktif' : 'Nonaktif' }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status Tersedia
            </div>
            <VChip
              :color="therapist.is_available ? 'success' : 'warning'"
              size="small"
              variant="tonal"
            >
              {{ therapist.is_available ? 'Tersedia' : 'Tidak Tersedia' }}
            </VChip>
          </div>
        </VCol>
      </VRow>

      <!-- Skills -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-award
        </VIcon>
        Keahlian
      </h3>
      
      <VRow class="mb-6">
        <VCol cols="12">
          <div class="mb-4">
            <div class="text-medium-emphasis mb-2">
              Skills
            </div>
            <div class="d-flex flex-wrap gap-1">
              <VChip
                v-for="skill in therapist.skills"
                :key="skill"
                color="info"
                size="small"
                variant="tonal"
              >
                {{ skill }}
              </VChip>
              <span v-if="!therapist.skills || therapist.skills.length === 0" class="text-medium-emphasis">
                Tidak ada skills
              </span>
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Certifications -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-certificate
        </VIcon>
        Sertifikasi
      </h3>
      
      <VRow class="mb-6">
        <VCol cols="12">
          <div class="mb-4">
            <div class="text-medium-emphasis mb-2">
              Certifications
            </div>
            <div v-if="therapist.certifications && therapist.certifications.length > 0">
              <div
                v-for="cert in therapist.certifications"
                :key="cert.name"
                class="mb-3 pa-3 border rounded"
              >
                <div class="font-weight-medium">{{ cert.name }}</div>
                <div class="text-body-2 text-medium-emphasis">
                  Date: {{ cert.date ? formatDate(cert.date) : '-' }} | 
                  Expiry: {{ cert.expiry ? formatDate(cert.expiry) : '-' }} | 
                  Issuer: {{ cert.issuer || '-' }}
                </div>
              </div>
            </div>
            <span v-else class="text-medium-emphasis">
              Tidak ada sertifikasi
            </span>
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
              {{ therapist.notes || '-' }}
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
              {{ therapist.created_at ? formatDateTime(therapist.created_at) : '-' }}
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
              {{ therapist.updated_at ? formatDateTime(therapist.updated_at) : '-' }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Therapist Treatments -->
      <VDivider class="my-6" />
      <div class="d-flex align-center justify-space-between mb-4">
        <h3 class="text-h6 font-weight-medium">
          <VIcon class="me-2">
            tabler-stethoscope
          </VIcon>
          Treatment Terapis
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
          
          <div v-else-if="therapistTreatments.length === 0" class="text-center py-8">
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
                v-for="treatment in therapistTreatments"
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
                @update:model-value="fetchTherapistTreatments"
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
          Terapis yang Anda cari tidak ditemukan atau telah dihapus
        </p>
        <VBtn
          color="primary"
          variant="tonal"
          :to="{ name: 'hris-therapists' }"
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
        <span>Tambah Treatment untuk {{ therapist?.name }}</span>
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
                :rules="[v => v !== null && v !== '' || 'Treatment harus dipilih']"
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
                placeholder="Tambahkan catatan khusus tentang pengalaman terapis dalam treatment ini"
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
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Route
const route = useRoute()

// Data
const therapist = ref(null)
const loading = ref(false)
const branchName = ref('')
const employeeName = ref('')

// Treatment related data
const therapistTreatments = ref([])
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
  treatment_id: '',
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
const fetchTherapist = async () => {
  loading.value = true
  console.log('🔄 Starting fetchTherapist...')
  
  try {
    const res = await $api(`/hris/therapists/${route.params.id}`, {
      method: 'GET',
    })
    
    console.log('📥 API Response:', res)
    
    if (res && res.response_code === 200) {
      therapist.value = res.data
      
      // Fetch branch name if branch_id exists
      if (therapist.value.branch_id) {
        await fetchBranchName(therapist.value.branch_id)
      }
      
      // Fetch employee name if employee_id exists
      if (therapist.value.employee_id) {
        await fetchEmployeeName(therapist.value.employee_id)
      }
      
      // Fetch therapist treatments
      await fetchTherapistTreatments()
    } else {
      therapist.value = null
    }
  } catch (error) {
    console.error('❌ Error fetching therapist:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Terapis',
      text: 'Tidak dapat memuat data terapis. Silakan coba lagi.',
    })
    therapist.value = null
  } finally {
    loading.value = false
    console.log('🏁 fetchTherapist completed')
  }
}

const fetchTherapistTreatments = async () => {
  if (!therapist.value) return
  
  loadingTreatments.value = true
  console.log('🔄 Starting fetchTherapistTreatments...')
  
  try {
    const res = await $api('/hris/therapist-treatments/paginated', {
      method: 'POST',
      body: {
        page: treatmentPage.value,
        per_page: 12,
        sort_by: 'created_at',
        sort_order: 'desc',
        filters: []
      }
    })
    
    console.log('📥 Therapist Treatments Response:', res)
    
    if (res && res.response_code === 200) {
      // Filter data berdasarkan therapist_id di client side
      const filteredData = res.data.filter(item => item.therapist_id === therapist.value.id)
      therapistTreatments.value = filteredData
      treatmentMeta.value = res.meta
    } else {
      therapistTreatments.value = []
    }
  } catch (error) {
    console.error('❌ Error fetching therapist treatments:', error)
    
    // Show error alert
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Treatment',
      text: 'Tidak dapat memuat data treatment terapis. Silakan coba lagi.',
    })
    therapistTreatments.value = []
  } finally {
    loadingTreatments.value = false
    console.log('🏁 fetchTherapistTreatments completed')
  }
}

const fetchAvailableTreatments = async () => {
  loadingTreatmentsList.value = true
  console.log('🔄 Starting fetchAvailableTreatments...')
  
  try {
    const res = await $api('/crm/treatments', {
      method: 'GET',
    })
    
    console.log('📥 Available Treatments Response:', res)
    
    if (res && res.response_code === 200) {
      availableTreatments.value = res.data
    } else {
      availableTreatments.value = []
    }
  } catch (error) {
    console.error('❌ Error fetching available treatments:', error)
    
    // Close dialog first
    closeAddTreatmentDialog()
    
    // Show error alert
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Treatment',
      text: 'Tidak dapat memuat daftar treatment yang tersedia. Silakan coba lagi.',
    })
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
  
  // Reset form validation
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
  if (!newTreatment.value.treatment_id) {
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
  
  if (!therapist.value?.id) {
    await Swal.fire({
      title: 'Data Terapis Tidak Ditemukan',
      text: 'Data terapis tidak valid. Silakan refresh halaman.',
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
  
  // Check if treatment already exists for this therapist
  const existingTreatment = therapistTreatments.value.find(t => 
    t.treatment_id === newTreatment.value.treatment_id
  )
  
  if (existingTreatment) {
    await Swal.fire({
      title: 'Treatment Sudah Ada',
      text: `Treatment "${existingTreatment.treatment.name}" sudah ada untuk terapis ini.`,
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
    therapist_id: therapist.value.id,
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
        res = await $api('/hris/therapist-treatments', {
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
      await fetchTherapistTreatments()
      
      // Show success alert using Swal directly
      await Swal.fire({
        title: 'Berhasil Menambahkan Treatment',
        text: `Treatment "${treatmentName}" berhasil ditambahkan ke terapis ${therapist.value?.name}.`,
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
        throw new Error(`Conflict: Treatment sudah ada untuk terapis ini`)
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
  console.log('🔄 Starting confirmDeleteTreatment...')
  
  try {
    // Show confirmation dialog using Swal directly
    const result = await Swal.fire({
      title: 'Konfirmasi Hapus Treatment',
      text: `Apakah Anda yakin ingin menghapus treatment "${treatment.treatment.name}" (${treatment.treatment.code}) dari terapis ${therapist.value?.name}?\n\nTindakan ini tidak dapat dibatalkan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      allowOutsideClick: false,
    })
    
    if (result.isConfirmed) {
      await deleteTreatment(treatment.id)
    }
  } catch (error) {
    console.error('❌ Error in confirmDeleteTreatment:', error)
  }
}

const deleteTreatment = async (treatmentId) => {
  deletingTreatmentId.value = treatmentId
  console.log('🔄 Starting deleteTreatment...')
  
  // Find treatment data before deletion for success message
  const treatmentToDelete = therapistTreatments.value.find(t => t.id === treatmentId)
  
  try {
    const res = await $api(`/hris/therapist-treatments/${treatmentId}`, {
      method: 'DELETE',
    })
    
    console.log('📥 Delete Treatment Response:', res)
    
    if (res && res.response_code === 200) {
      // Show success message
      console.log('✅ Treatment deleted successfully')
      
      // Refresh treatments
      await fetchTherapistTreatments()
      
      // Show success alert using Swal directly
      await Swal.fire({
        title: 'Berhasil Menghapus Treatment',
        text: `Treatment "${treatmentToDelete?.treatment?.name}" berhasil dihapus dari terapis ${therapist.value?.name}.`,
        icon: 'success',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
      })
    }
  } catch (error) {
    console.error('❌ Error deleting treatment:', error)
    
    // Show error alert
    await showErrorAlert(error, {
      title: 'Gagal Menghapus Treatment',
      text: 'Tidak dapat menghapus treatment. Silakan coba lagi.',
    })
  } finally {
    deletingTreatmentId.value = null
    console.log('🏁 deleteTreatment completed')
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

const getCertificationColor = (level) => {
  switch (level) {
    case 'MASTER':
      return 'success'
    case 'BACHELOR':
      return 'info'
    case 'DIPLOMA':
      return 'warning'
    default:
      return 'default'
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
  fetchTherapist()
  
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
</script> 
