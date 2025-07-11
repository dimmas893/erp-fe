<route lang="yaml">
meta:
  layout: default
  navActiveLink: rme-kunjungan
</route>

<template>
  <div class="d-flex flex-column gap-6">
    <!-- Header Card -->
    <VCard>
      <VCardText>
        <div class="d-flex align-center justify-space-between flex-wrap gap-4">
          <div class="d-flex align-center gap-4">
            <VBtn
              icon="tabler-arrow-left"
              variant="text"
              color="secondary"
              :to="{ name: 'rme-kunjungan' }"
              size="small"
            />
            <div>
              <h1 class="text-h4 font-weight-bold mb-1">
                {{ visit ? visit.visit_number : 'Detail Kunjungan' }}
              </h1>
              <div v-if="visit" class="d-flex align-center gap-3 flex-wrap">
                <VChip :color="getStatusColor(visit.status)" size="small" label>
                  {{ getStatusLabel(visit.status) }}
                </VChip>
                <VChip :color="getPaymentStatusColor(visit.payment_status)" size="small" label>
                  {{ getPaymentStatusLabel(visit.payment_status) }}
                </VChip>
                <span class="text-body-2 text-medium-emphasis">
                  {{ formatDateTime(visit.visit_date) }}
                </span>
              </div>
            </div>
          </div>
          
          <div v-if="visit" class="text-end">
            <div class="text-h4 font-weight-bold text-success">
              {{ formatCurrency(visit.total_amount) }}
            </div>
            <div class="text-caption text-medium-emphasis">Total Biaya</div>
          </div>
        </div>
      </VCardText>
    </VCard>

    <!-- Loading State -->
    <VProgressLinear v-if="loading" indeterminate color="primary" />
    
    <div v-if="loading" class="d-flex flex-column gap-4">
      <VSkeletonLoader type="card" />
      <VSkeletonLoader type="card" />
      <VSkeletonLoader type="card" />
    </div>

    <!-- Main Content -->
    <div v-else-if="visit" class="d-flex flex-column gap-6">
      
      <!-- Patient & Visit Info -->
      <VRow>
        <VCol cols="12" md="8">
          <VCard>
            <VCardTitle class="d-flex align-center gap-2 pb-4">
              <VIcon color="primary">tabler-user</VIcon>
              Informasi Pasien & Kunjungan
            </VCardTitle>
            <VCardText>
              <VRow>
                <VCol cols="12" sm="6">
                  <div class="d-flex flex-column gap-4">
                    <div>
                      <div class="text-caption text-medium-emphasis mb-1">Nama Pasien</div>
                      <div class="text-h6 font-weight-medium">{{ visit.patient?.name || '-' }}</div>
                    </div>
                    <div>
                      <div class="text-caption text-medium-emphasis mb-1">No. Pasien</div>
                      <div class="text-body-1">{{ visit.patient?.patient_number || '-' }}</div>
                    </div>
                    <div>
                      <div class="text-caption text-medium-emphasis mb-1">Keluhan Utama</div>
                      <div class="text-body-1">{{ visit.chief_complaint || '-' }}</div>
                    </div>
                  </div>
                </VCol>
                <VCol cols="12" sm="6">
                  <div class="d-flex flex-column gap-4">
                    <div>
                      <div class="text-caption text-medium-emphasis mb-1">Dokter</div>
                      <div class="text-body-1">{{ getDoctorName(visit.doctor_id) }}</div>
                    </div>
                    <div>
                      <div class="text-caption text-medium-emphasis mb-1">Cabang</div>
                      <div class="text-body-1">{{ getBranchName(visit.branch_id) }}</div>
                    </div>
                    <div>
                      <div class="text-caption text-medium-emphasis mb-1">Kontak</div>
                      <div class="text-body-2">{{ visit.patient?.phone || '-' }}</div>
                      <div class="text-body-2">{{ visit.patient?.email || '-' }}</div>
                    </div>
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
        
        <VCol cols="12" md="4">
          <VCard>
            <VCardTitle class="d-flex align-center gap-2 pb-4">
              <VIcon color="primary">tabler-cash</VIcon>
              Ringkasan Biaya
            </VCardTitle>
            <VCardText>
              <div class="d-flex flex-column gap-3">
                <div class="d-flex justify-space-between align-center">
                  <span class="text-body-2">Konsultasi</span>
                  <span class="font-weight-medium">{{ formatCurrency(visit.total_consultation_fee) }}</span>
                </div>
                <div class="d-flex justify-space-between align-center">
                  <span class="text-body-2">Treatment</span>
                  <span class="font-weight-medium">{{ formatCurrency(visit.total_treatment_fee) }}</span>
                </div>
                <div class="d-flex justify-space-between align-center">
                  <span class="text-body-2">Produk</span>
                  <span class="font-weight-medium">{{ formatCurrency(visit.total_product_fee) }}</span>
                </div>
                <VDivider />
                <div class="d-flex justify-space-between align-center">
                  <span class="text-h6 font-weight-bold">Total</span>
                  <span class="text-h6 font-weight-bold text-success">{{ formatCurrency(visit.total_amount) }}</span>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Services Tabs -->
      <VCard>
        <VTabs v-model="activeTab" bg-color="transparent" color="primary" show-arrows>
          <VTab value="consultations" @click="handleTabChange">
            <VIcon start>tabler-user-doctor</VIcon>
            Konsultasi ({{ visitConsultations.length }})
          </VTab>
          <VTab value="treatments" @click="handleTabChange">
            <VIcon start>tabler-medical-cross</VIcon>
            Tindakan ({{ visitTreatments.length }})
          </VTab>
          <VTab value="products" @click="handleTabChange">
            <VIcon start>tabler-pill</VIcon>
            Produk ({{ visitProducts.length }})
          </VTab>
          <VTab value="records" @click="handleTabChange">
            <VIcon start>tabler-file-medical</VIcon>
            Rekam Medis ({{ medicalRecords.length }})
          </VTab>
          <VTab value="photos" @click="handleTabChange">
            <VIcon start>tabler-camera</VIcon>
            Foto ({{ consentPhotos.length }})
          </VTab>
        </VTabs>

        <VDivider />

        <VWindow v-model="activeTab" class="overflow-visible">
          <!-- Consultations Tab -->
          <VWindowItem value="consultations">
            <Transition name="slide-fade" mode="out-in">
              <div v-if="tabLoading" key="loading" class="text-center py-12">
                <VProgressCircular indeterminate color="primary" size="40" />
                <div class="text-body-1 text-medium-emphasis mt-4">Loading...</div>
              </div>
              <div v-else key="consultations-content">
                <VCardText>
                  <div v-if="loadingConsultations" class="text-center py-8">
                    <VProgressCircular indeterminate color="primary" />
                  </div>
                  <div v-else-if="visitConsultations.length === 0" class="text-center py-8">
                    <VIcon size="64" color="grey-lighten-2" class="mb-4">tabler-user-doctor</VIcon>
                    <div class="text-h6 text-medium-emphasis">Belum ada konsultasi</div>
                  </div>
                  <div v-else class="d-flex flex-column gap-4">
                    <VCard
                      v-for="consultation in visitConsultations"
                      :key="consultation.id"
                      variant="outlined"
                      class="service-card"
                    >
                      <VCardText>
                        <div class="d-flex align-center gap-2 mb-4">
                          <VChip color="primary" size="small" label>CONSULTATION</VChip>
                          <span class="text-body-2 text-medium-emphasis">
                            {{ formatDateTime(consultation.start_time) }} | {{ getDoctorName(consultation.doctor_id) }}
                          </span>
                        </div>
                        
                        <div class="d-flex justify-space-between align-start flex-wrap gap-4">
                          <div class="flex-grow-1">
                            <div class="text-h6 font-weight-medium mb-2">
                              {{ getServiceName(consultation.service_id) }}
                            </div>
                            <div class="d-flex align-center gap-4 flex-wrap mb-3">
                              <VChip :color="getConsultationTypeColor(consultation.consultation_type)" size="small" label>
                                {{ getConsultationTypeLabel(consultation.consultation_type) }}
                              </VChip>
                              <span class="text-body-2">Durasi: {{ calculateConsultationDuration(consultation.start_time, consultation.end_time) }}</span>
                            </div>
                            <div class="text-body-2 text-medium-emphasis">
                              {{ formatDateTime(consultation.start_time) }} - {{ formatDateTime(consultation.end_time) }}
                            </div>
                          </div>
                          <div class="text-end">
                            <div class="text-h6 font-weight-bold text-primary">
                              {{ formatCurrency(consultation.fee) }}
                            </div>
                          </div>
                        </div>
                      </VCardText>
                    </VCard>
                  </div>
                </VCardText>
              </div>
            </Transition>
          </VWindowItem>

          <!-- Treatments Tab -->
          <VWindowItem value="treatments">
            <Transition name="slide-fade" mode="out-in">
              <div v-if="tabLoading" key="loading" class="text-center py-12">
                <VProgressCircular indeterminate color="primary" size="40" />
                <div class="text-body-1 text-medium-emphasis mt-4">Loading...</div>
              </div>
                            <div v-else key="treatments-content">
                <VCardText>
                  <div v-if="loadingTreatments" class="text-center py-8">
                    <VProgressCircular indeterminate color="primary" />
                  </div>
                  <div v-else-if="visitTreatments.length === 0" class="text-center py-8">
                    <VIcon size="64" color="grey-lighten-2" class="mb-4">tabler-medical-cross</VIcon>
                    <div class="text-h6 text-medium-emphasis">Belum ada tindakan</div>
                  </div>
                  <div v-else class="d-flex flex-column gap-4">
                    <VCard
                      v-for="treatment in visitTreatments"
                      :key="treatment.id"
                      variant="outlined"
                      class="service-card"
                    >
                      <VCardText>
                        <div class="d-flex justify-space-between align-start flex-wrap gap-4">
                          <div class="flex-grow-1">
                            <div class="text-h6 font-weight-medium mb-2">
                              {{ getTreatmentName(treatment.treatment_id) }}
                            </div>
                            <div class="d-flex align-center gap-4 flex-wrap mb-3">
                              <VChip :color="getTreatmentStatusColor(treatment)" size="small" label>
                                {{ getTreatmentStatusLabel(treatment) }}
                              </VChip>
                              <span class="text-body-2">{{ getDoctorName(treatment.doctor_id) }}</span>
                              <span class="text-body-2">Terapis: {{ getTherapistName(treatment.therapist_id) }}</span>
                            </div>
                            <div class="text-body-2 text-medium-emphasis">
                              Jumlah: {{ treatment.quantity }} | 
                              {{ formatDateTime(treatment.created_at) }}
                            </div>
                            <div v-if="treatment.treatment_notes" class="text-body-2 mt-2 pa-3 bg-grey-lighten-5 rounded">
                              {{ treatment.treatment_notes }}
                            </div>
                          </div>
                          <div class="text-end">
                            <div class="text-h6 font-weight-bold text-warning">
                              {{ formatCurrency(treatment.total_price) }}
                            </div>
                            <div class="text-caption text-medium-emphasis">
                              {{ formatCurrency(treatment.unit_price) }} × {{ treatment.quantity }}
                            </div>
                          </div>
                        </div>
                      </VCardText>
                    </VCard>
                  </div>
                </VCardText>
              </div>
            </Transition>
          </VWindowItem>

                    <!-- Products Tab -->
          <VWindowItem value="products">
            <Transition name="slide-fade" mode="out-in">
              <div v-if="tabLoading" key="loading" class="text-center py-12">
                <VProgressCircular indeterminate color="primary" size="40" />
                <div class="text-body-1 text-medium-emphasis mt-4">Loading...</div>
              </div>
              <div v-else key="products-content">
                <VCardText>
                  <div v-if="loadingProducts" class="text-center py-8">
                    <VProgressCircular indeterminate color="primary" />
                  </div>
                  <div v-else-if="visitProducts.length === 0" class="text-center py-8">
                    <VIcon size="64" color="grey-lighten-2" class="mb-4">tabler-pill</VIcon>
                    <div class="text-h6 text-medium-emphasis">Belum ada produk</div>
                  </div>
                  <div v-else class="d-flex flex-column gap-4">
                    <VCard
                      v-for="product in visitProducts"
                      :key="product.id"
                      variant="outlined"
                      class="service-card"
                    >
                      <VCardText>
                        <div class="d-flex justify-space-between align-start flex-wrap gap-4">
                          <div class="flex-grow-1">
                            <div class="text-h6 font-weight-medium mb-2">
                              {{ getProductName(product.product_id) }}
                            </div>
                            <div class="d-flex align-center gap-4 flex-wrap mb-3">
                              <VChip :color="getUsageTypeColor(product.usage_type)" size="small" label>
                                {{ getUsageTypeLabel(product.usage_type) }}
                              </VChip>
                              <span class="text-body-2">Batch: {{ product.batch_number }}</span>
                              <span class="text-body-2">Exp: {{ product.expiry_date }}</span>
                            </div>
                            <div class="text-body-2 text-medium-emphasis">
                              Jumlah: {{ product.quantity }} | 
                              Diresepkan: {{ getDoctorName(product.prescribed_by) }}
                            </div>
                            <div v-if="product.instructions" class="text-body-2 mt-2 pa-3 bg-blue-lighten-5 rounded">
                              <strong>Instruksi:</strong> {{ product.instructions }}
                            </div>
                          </div>
                          <div class="text-end">
                            <div class="text-h6 font-weight-bold text-info">
                              {{ formatCurrency(product.total_price) }}
                            </div>
                            <div class="text-caption text-medium-emphasis">
                              {{ formatCurrency(product.unit_price) }} × {{ product.quantity }}
                            </div>
                          </div>
                        </div>
                      </VCardText>
                    </VCard>
                  </div>
                </VCardText>
              </div>
            </Transition>
          </VWindowItem>

                    <!-- Medical Records Tab -->
          <VWindowItem value="records">
            <Transition name="slide-fade" mode="out-in">
              <div v-if="tabLoading" key="loading" class="text-center py-12">
                <VProgressCircular indeterminate color="primary" size="40" />
                <div class="text-body-1 text-medium-emphasis mt-4">Loading...</div>
              </div>
              <div v-else key="records-content">
                <VCardText>
                  <div v-if="loadingMedicalRecords" class="text-center py-8">
                    <VProgressCircular indeterminate color="primary" />
                  </div>
                  <div v-else-if="medicalRecords.length === 0" class="text-center py-8">
                    <VIcon size="64" color="grey-lighten-2" class="mb-4">tabler-file-medical</VIcon>
                    <div class="text-h6 text-medium-emphasis">Belum ada rekam medis</div>
                  </div>
                  <div v-else class="d-flex flex-column gap-4">
                    <VCard
                      v-for="record in medicalRecords"
                      :key="record.id"
                      variant="outlined"
                      class="service-card"
                    >
                      <VCardText>
                        <div class="d-flex align-center gap-2 mb-4">
                          <VChip color="primary" size="small" label>{{ record.record_type }}</VChip>
                          <span class="text-body-2 text-medium-emphasis">
                            {{ formatDateTime(record.created_at) }} | {{ getDoctorName(record.doctor_id) }}
                          </span>
                        </div>
                        
                        <VRow v-if="record.record_type === 'SOAP'">
                          <VCol cols="12" md="6">
                            <div class="mb-4">
                              <div class="text-subtitle-2 font-weight-bold text-info mb-2">Subjective</div>
                              <div class="text-body-2 pa-3 bg-blue-lighten-5 rounded">
                                {{ record.subjective || '-' }}
                              </div>
                            </div>
                            <div class="mb-4">
                              <div class="text-subtitle-2 font-weight-bold text-warning mb-2">Objective</div>
                              <div class="text-body-2 pa-3 bg-orange-lighten-5 rounded">
                                {{ record.objective || '-' }}
                              </div>
                            </div>
                          </VCol>
                          <VCol cols="12" md="6">
                            <div class="mb-4">
                              <div class="text-subtitle-2 font-weight-bold text-error mb-2">Assessment</div>
                              <div class="text-body-2 pa-3 bg-red-lighten-5 rounded">
                                {{ record.assessment || '-' }}
                              </div>
                            </div>
                            <div class="mb-4">
                              <div class="text-subtitle-2 font-weight-bold text-success mb-2">Plan</div>
                              <div class="text-body-2 pa-3 bg-green-lighten-5 rounded">
                                {{ record.plan || '-' }}
                              </div>
                            </div>
                          </VCol>
                        </VRow>
                      </VCardText>
                    </VCard>
                  </div>
                </VCardText>
              </div>
            </Transition>
          </VWindowItem>

          <!-- Photos Tab -->
          <VWindowItem value="photos">
            <Transition name="slide-fade" mode="out-in">
              <div v-if="tabLoading" key="loading" class="text-center py-12">
                <VProgressCircular indeterminate color="primary" size="40" />
                <div class="text-body-1 text-medium-emphasis mt-4">Loading...</div>
              </div>
              <div v-else key="photos-content">
                <VCardText>
                  <div v-if="loadingConsentPhotos" class="text-center py-8">
                    <VProgressCircular indeterminate color="primary" />
                  </div>
                  <div v-else-if="consentPhotos.length === 0" class="text-center py-8">
                    <VIcon size="64" color="grey-lighten-2" class="mb-4">tabler-camera</VIcon>
                    <div class="text-h6 text-medium-emphasis">Belum ada foto persetujuan</div>
                  </div>
                  <div v-else>
                    <!-- Photo Summary -->
                    <div class="d-flex gap-2 mb-6 flex-wrap">
                      <VChip
                        v-for="(group, consentType) in groupedConsentPhotos"
                        :key="consentType"
                        :color="getConsentTypeColor(consentType)"
                        size="small"
                        variant="tonal"
                      >
                        {{ getConsentTypeLabel(consentType) }}: {{ group.length }}
                      </VChip>
                    </div>

                    <!-- Photo Grid -->
                    <VRow>
                      <VCol
                        v-for="photo in consentPhotos"
                        :key="photo.id"
                        cols="6"
                        sm="4"
                        md="3"
                        lg="2"
                      >
                        <VCard class="photo-card" @click="openPhotoDialog(photo)">
                          <VImg
                            :src="photo.photo_url"
                            :alt="`${getConsentTypeLabel(photo.consent_type)} consent photo`"
                            aspect-ratio="1"
                            cover
                            class="cursor-pointer"
                            @error="onImageError"
                          >
                            <template #placeholder>
                              <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                                <VProgressCircular color="primary" indeterminate size="24" />
                              </div>
                            </template>
                            <template #error>
                              <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3">
                                <VIcon size="32" color="grey">tabler-photo-off</VIcon>
                              </div>
                            </template>
                          </VImg>
                          
                          <!-- Photo Overlay -->
                          <div class="photo-overlay">
                            <VChip :color="getConsentTypeColor(photo.consent_type)" size="x-small" label class="mb-1">
                              {{ getConsentTypeLabel(photo.consent_type) }}
                            </VChip>
                            <div class="text-caption text-white">
                              {{ formatDateTime(photo.taken_at).split(' ')[0] }}
                            </div>
                          </div>
                        </VCard>
                      </VCol>
                    </VRow>
                  </div>
                </VCardText>
              </div>
            </Transition>
          </VWindowItem>
        </VWindow>
      </VCard>
    </div>

    <!-- Error State -->
    <VCard v-else>
      <VCardText class="text-center py-12">
        <VIcon size="64" color="error" class="mb-4">tabler-alert-circle</VIcon>
        <div class="text-h6 text-medium-emphasis mb-2">Data Tidak Ditemukan</div>
        <div class="text-body-2 text-medium-emphasis mb-4">
          Kunjungan dengan ID tersebut tidak ditemukan atau telah dihapus.
        </div>
        <VBtn color="primary" :to="{ name: 'rme-kunjungan' }">
          Kembali ke Daftar Kunjungan
        </VBtn>
      </VCardText>
    </VCard>
  </div>

  <!-- Photo Detail Dialog -->
  <VDialog v-model="photoDialog" max-width="800px">
    <VCard v-if="selectedPhoto">
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon color="primary">tabler-camera</VIcon>
        {{ getConsentTypeLabel(selectedPhoto.consent_type) }}
        <VSpacer />
        <VBtn icon="tabler-x" variant="text" @click="closePhotoDialog" />
      </VCardTitle>
      
      <VCardText>
        <VImg
          :src="selectedPhoto.photo_url"
          :alt="`${getConsentTypeLabel(selectedPhoto.consent_type)} consent photo`"
          class="mb-4 rounded"
          max-height="400"
          contain
        >
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4" style="min-height: 200px;">
              <VProgressCircular color="primary" indeterminate />
            </div>
          </template>
          <template #error>
            <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3" style="min-height: 200px;">
              <div class="text-center">
                <VIcon size="64" color="grey">tabler-photo-off</VIcon>
                <div class="text-h6 text-grey mt-2">Foto tidak dapat dimuat</div>
              </div>
            </div>
          </template>
        </VImg>
        
        <VRow>
          <VCol cols="12" md="6">
            <div class="d-flex flex-column gap-3">
              <div>
                <div class="text-caption text-medium-emphasis">Status Persetujuan</div>
                <VChip :color="getConsentStatusColor(selectedPhoto)" size="small" label>
                  {{ getConsentStatusLabel(selectedPhoto) }}
                </VChip>
              </div>
              <div v-if="selectedPhoto.signatory_name">
                <div class="text-caption text-medium-emphasis">Penandatangan</div>
                <div class="text-body-1">{{ selectedPhoto.signatory_name }} ({{ selectedPhoto.signatory_relation }})</div>
              </div>
              <div v-if="selectedPhoto.photographer">
                <div class="text-caption text-medium-emphasis">Fotografer</div>
                <div class="text-body-1">{{ selectedPhoto.photographer.name }}</div>
              </div>
            </div>
          </VCol>
          <VCol cols="12" md="6">
            <div class="d-flex flex-column gap-3">
              <div>
                <div class="text-caption text-medium-emphasis">Tanggal Diambil</div>
                <div class="text-body-1">{{ formatDateTime(selectedPhoto.taken_at) }}</div>
              </div>
              <div>
                <div class="text-caption text-medium-emphasis">Resolusi</div>
                <div class="text-body-1">{{ selectedPhoto.image_width }}×{{ selectedPhoto.image_height }}</div>
              </div>
              <div>
                <div class="text-caption text-medium-emphasis">Ukuran File</div>
                <div class="text-body-1">{{ formatFileSize(selectedPhoto.file_size) }}</div>
              </div>
            </div>
          </VCol>
        </VRow>
        
        <div v-if="selectedPhoto.notes" class="mt-4">
          <div class="text-caption text-medium-emphasis">Catatan</div>
          <div class="text-body-1">{{ selectedPhoto.notes }}</div>
        </div>
      </VCardText>
      
      <VCardActions>
        <VSpacer />
        <VBtn
          v-if="selectedPhoto.photo_url"
          color="primary"
          variant="tonal"
          :href="selectedPhoto.photo_url"
          target="_blank"
        >
          <VIcon start>tabler-download</VIcon>
          Download
        </VBtn>
        <VBtn variant="text" @click="closePhotoDialog">Tutup</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert } from '@/utils/errorHandler'
import { computed, nextTick, onActivated, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const visit = ref(null)
const loading = ref(true)
const visitTreatments = ref([])
const loadingTreatments = ref(true)
const visitProducts = ref([])
const loadingProducts = ref(true)
const medicalRecords = ref([])
const loadingMedicalRecords = ref(true)
const visitConsultations = ref([])
const loadingConsultations = ref(true)
const consentPhotos = ref([])
const loadingConsentPhotos = ref(true)

const doctorOptions = ref([])
const branchOptions = ref([])
const therapistOptions = ref([])
const treatmentOptions = ref([])
const productOptions = ref([])
const serviceOptions = ref([])

// UI State
const activeTab = ref('consultations')
const photoDialog = ref(false)
const selectedPhoto = ref(null)
const tabLoading = ref(false)

// Store scroll position to prevent auto scroll
const scrollPosition = ref(0)

// Watch for tab changes to maintain scroll position and show loading
watch(activeTab, (newTab, oldTab) => {
  if (newTab !== oldTab) {
    // Show loading immediately to hide any data transition
    tabLoading.value = true
    
    // Extended loading time to ensure smooth transition and data hiding
    setTimeout(() => {
      // Double check to ensure all animations are complete
      nextTick(() => {
        tabLoading.value = false
        
        // Additional nextTick to ensure DOM is fully updated
        nextTick(() => {
          // Prevent automatic scrolling
          if (scrollPosition.value > 0) {
            window.scrollTo({ 
              top: scrollPosition.value, 
              behavior: 'instant' 
            })
          }
        })
      })
    }, 500) // 500ms loading
  }
})

// Store scroll position before tab change
const handleTabChange = () => {
  scrollPosition.value = window.scrollY
}

// Computed properties
const groupedConsentPhotos = computed(() => {
  const groups = {}
  consentPhotos.value.forEach(photo => {
    if (!groups[photo.consent_type]) {
      groups[photo.consent_type] = []
    }
    groups[photo.consent_type].push(photo)
  })
  return groups
})



async function fetchVisit() {
  loading.value = true
  try {
    const response = await $api('/rme/patient-visits/paginated', {
      method: 'POST',
      body: {
        page: 1,
        per_page: 1,
        filters: [
          {
            search_by: "id",
            filter_type: "equal",
            search_query: String(route.params.id)
          }
        ]
      }
    })
    
    if (response.data && response.data.length > 0) {
      visit.value = response.data[0]
    } else {
      visit.value = null
    }
  } catch (err) {
    console.error('Error fetching visit:', err)
    await showErrorAlert(err, {
      title: 'Gagal Memuat Data Kunjungan',
      text: 'Tidak dapat memuat detail kunjungan. Silakan coba lagi.'
    })
    visit.value = null
  } finally {
    loading.value = false
  }
}

async function fetchDoctors() {
  try {
    const res = await $api('/hris/doctors', {
      method: 'GET',
    })
    doctorOptions.value = (res.data || []).map(doctor => ({
      title: doctor.name,
      value: doctor.id,
    }))
  } catch (e) {
    console.error('Error fetching doctors:', e)
  }
}

async function fetchBranches() {
  try {
    const res = await $api('/wms/branches', {
      method: 'GET',
    })
    branchOptions.value = (res.data || []).map(branch => ({
      title: branch.name,
      value: branch.id,
    }))
  } catch (e) {
    console.error('Error fetching branches:', e)
  }
}

async function fetchTherapists() {
  try {
    // Try therapists endpoint first, fallback to doctors if not available
    const res = await $api('/hris/therapists', {
      method: 'GET',
    })
    therapistOptions.value = (res.data || []).map(therapist => ({
      title: therapist.name,
      value: therapist.id,
    }))
  } catch (e) {
    console.error('Error fetching therapists, using doctors as fallback:', e)
    // Fallback: use doctors as therapists if therapists endpoint doesn't exist
    therapistOptions.value = doctorOptions.value.slice()
  }
}

async function fetchVisitTreatments() {
  if (!route.params.id) return
  
  loadingTreatments.value = true
  try {
    const res = await $api(`/rme/visit-treatments/visit/${route.params.id}`)
    visitTreatments.value = res.data || []
    
    // Fetch treatment details for each treatment
    await fetchTreatmentDetails()
  } catch (err) {
    console.error('Error fetching visit treatments:', err)
    visitTreatments.value = []
  } finally {
    loadingTreatments.value = false
  }
}

async function fetchTreatmentDetails() {
  if (visitTreatments.value.length === 0) return
  
  try {
    // Get unique treatment IDs
    const treatmentIds = [...new Set(visitTreatments.value.map(vt => vt.treatment_id))]
    
    // Fetch details for each treatment
    const treatmentPromises = treatmentIds.map(async (treatmentId) => {
      try {
        const res = await $api(`/crm/treatments/${treatmentId}`)
        return res.data
      } catch (e) {
        console.error(`Error fetching treatment ${treatmentId}:`, e)
        return null
      }
    })
    
    const treatments = await Promise.all(treatmentPromises)
    
    // Store treatment details for lookup
    treatmentOptions.value = treatments.filter(Boolean).map(treatment => ({
      id: treatment.id,
      code: treatment.code,
      name: treatment.name,
      description: treatment.description,
      category: treatment.category,
      duration_minutes: treatment.duration_minutes,
      requires_consultation: treatment.requires_consultation,
      requires_doctor: treatment.requires_doctor
    }))
  } catch (err) {
    console.error('Error fetching treatment details:', err)
  }
}

async function fetchVisitProducts() {
  if (!route.params.id) return
  
  loadingProducts.value = true
  try {
    const res = await $api(`/rme/visit-products/by-visit/${route.params.id}`)
    visitProducts.value = res.data || []
    
    // Fetch product details for each product
    await fetchProductDetails()
  } catch (err) {
    console.error('Error fetching visit products:', err)
    visitProducts.value = []
  } finally {
    loadingProducts.value = false
  }
}

async function fetchProductDetails() {
  if (visitProducts.value.length === 0) return
  
  try {
    // Get unique product IDs
    const productIds = [...new Set(visitProducts.value.map(vp => vp.product_id))]
    
    // Fetch details for each product
    const productPromises = productIds.map(async (productId) => {
      try {
        const res = await $api(`/wms/products/${productId}`)
        return res.data
      } catch (e) {
        console.error(`Error fetching product ${productId}:`, e)
        return null
      }
    })
    
    const products = await Promise.all(productPromises)
    
    // Store product details for lookup
    productOptions.value = products.filter(Boolean).map(product => ({
      id: product.id,
      code: product.code,
      name: product.name,
      description: product.description,
      category: product.category,
      unit: product.unit,
      type: product.type
    }))
  } catch (err) {
    console.error('Error fetching product details:', err)
  }
}

async function fetchMedicalRecords() {
  if (!route.params.id) return
  
  loadingMedicalRecords.value = true
  try {
    const res = await $api(`/rme/medical-records/by-visit/${route.params.id}`)
    medicalRecords.value = res.data || []
  } catch (err) {
    console.error('Error fetching medical records:', err)
    medicalRecords.value = []
  } finally {
    loadingMedicalRecords.value = false
  }
}

async function fetchVisitConsultations() {
  if (!route.params.id) return
  
  loadingConsultations.value = true
  try {
    const res = await $api(`/rme/visit-consultations/by-visit/${route.params.id}`)
    visitConsultations.value = res.data || []
    
    // Fetch service details for each consultation
    await fetchServiceDetails()
  } catch (err) {
    console.error('Error fetching visit consultations:', err)
    visitConsultations.value = []
  } finally {
    loadingConsultations.value = false
  }
}

async function fetchServiceDetails() {
  if (visitConsultations.value.length === 0) return
  
  try {
    // Get unique service IDs
    const serviceIds = [...new Set(visitConsultations.value.map(vc => vc.service_id))]
    
    // Fetch details for each service
    const servicePromises = serviceIds.map(async (serviceId) => {
      try {
        const res = await $api(`/crm/services/${serviceId}`)
        return res.data
      } catch (e) {
        console.error(`Error fetching service ${serviceId}:`, e)
        return null
      }
    })
    
    const services = await Promise.all(servicePromises)
    
    // Store service details for lookup
    serviceOptions.value = services.filter(Boolean).map(service => ({
      id: service.id,
      code: service.code,
      name: service.name,
      service_type: service.service_type,
      description: service.description,
      duration_minutes: service.duration_minutes,
      is_billable: service.is_billable
    }))
  } catch (err) {
    console.error('Error fetching service details:', err)
  }
}

async function fetchConsentPhotos() {
  if (!route.params.id) return
  
  loadingConsentPhotos.value = true
  try {
    const requestBody = {
      page: 1,
      per_page: 50, // Get all consent photos for this visit
      sort_by: "taken_at",
      sort_order: "desc",
      filters: [
        {
          search_by: "visit_id",
          filter_type: "equal",
          search_query: String(route.params.id)
        }
      ]
    }
    
    const res = await $api('/rme/consent-photos/paginated', {
      method: 'POST',
      body: requestBody,
    })
    consentPhotos.value = res.data || []
    console.log('Consent photos loaded:', consentPhotos.value)
  } catch (err) {
    console.error('Error fetching consent photos:', err)
    consentPhotos.value = []
  } finally {
    loadingConsentPhotos.value = false
  }
}

function openPhotoDialog(photo) {
  selectedPhoto.value = photo
  photoDialog.value = true
}

function closePhotoDialog() {
  photoDialog.value = false
  selectedPhoto.value = null
}

function onImageError(event) {
  console.error('Image failed to load:', event.target.src)
}

function getStatusColor(status) {
  switch (status) {
    case 'SCHEDULED': return 'info'
    case 'IN_PROGRESS': return 'warning'
    case 'COMPLETED': return 'success'
    case 'CANCELLED': return 'error'
    default: return 'secondary'
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'SCHEDULED': return 'Terjadwal'
    case 'IN_PROGRESS': return 'Sedang Berlangsung'
    case 'COMPLETED': return 'Selesai'
    case 'CANCELLED': return 'Dibatalkan'
    default: return status
  }
}

function getPaymentStatusColor(status) {
  switch (status) {
    case 'PENDING': return 'warning'
    case 'PAID': return 'success'
    case 'PARTIAL': return 'info'
    case 'REFUNDED': return 'error'
    default: return 'secondary'
  }
}

function getPaymentStatusLabel(status) {
  switch (status) {
    case 'PENDING': return 'Menunggu'
    case 'PAID': return 'Lunas'
    case 'PARTIAL': return 'Sebagian'
    case 'REFUNDED': return 'Dikembalikan'
    default: return status
  }
}

function getDoctorName(doctorId) {
  const doctor = doctorOptions.value.find(d => d.value === doctorId)
  return doctor ? doctor.title : '-'
}

function getBranchName(branchId) {
  const branch = branchOptions.value.find(b => b.value === branchId)
  return branch ? branch.title : '-'
}

function getTherapistName(therapistId) {
  const therapist = therapistOptions.value.find(t => t.value === therapistId)
  return therapist ? therapist.title : '-'
}

function getTreatmentDetails(treatmentId) {
  const treatment = treatmentOptions.value.find(t => t.id === treatmentId)
  return treatment || null
}

function getTreatmentName(treatmentId) {
  const treatment = getTreatmentDetails(treatmentId)
  return treatment ? treatment.name : 'Treatment tidak ditemukan'
}

function getTreatmentCode(treatmentId) {
  const treatment = getTreatmentDetails(treatmentId)
  return treatment ? treatment.code : '-'
}

function getProductDetails(productId) {
  const product = productOptions.value.find(p => p.id === productId)
  return product || null
}

function getProductName(productId) {
  const product = getProductDetails(productId)
  return product ? product.name : 'Produk tidak ditemukan'
}

function getProductCode(productId) {
  const product = getProductDetails(productId)
  return product ? product.code : '-'
}

function getUsageTypeLabel(usageType) {
  switch (usageType) {
    case 'TREATMENT_CONSUMPTION': return 'Konsumsi Treatment'
    case 'PRESCRIPTION': return 'Resep'
    case 'RETAIL': return 'Retail'
    default: return usageType
  }
}

function getUsageTypeColor(usageType) {
  switch (usageType) {
    case 'TREATMENT_CONSUMPTION': return 'info'
    case 'PRESCRIPTION': return 'success'
    case 'RETAIL': return 'warning'
    default: return 'secondary'
  }
}

function getServiceDetails(serviceId) {
  const service = serviceOptions.value.find(s => s.id === serviceId)
  return service || null
}

function getServiceName(serviceId) {
  const service = getServiceDetails(serviceId)
  return service ? service.name : 'Layanan tidak ditemukan'
}

function getServiceCode(serviceId) {
  const service = getServiceDetails(serviceId)
  return service ? service.code : '-'
}

function getConsultationTypeLabel(consultationType) {
  switch (consultationType) {
    case 'INITIAL': return 'Konsultasi Awal'
    case 'FOLLOW_UP': return 'Konsultasi Lanjutan'
    case 'EMERGENCY': return 'Konsultasi Darurat'
    case 'ROUTINE': return 'Konsultasi Rutin'
    default: return consultationType
  }
}

function getConsultationTypeColor(consultationType) {
  switch (consultationType) {
    case 'INITIAL': return 'primary'
    case 'FOLLOW_UP': return 'info'
    case 'EMERGENCY': return 'error'
    case 'ROUTINE': return 'success'
    default: return 'secondary'
  }
}

function calculateConsultationDuration(startTime, endTime) {
  if (!startTime || !endTime) return '-'
  const start = new Date(startTime)
  const end = new Date(endTime)
  const diffInMinutes = Math.round((end - start) / (1000 * 60))
  return `${diffInMinutes} menit`
}

function getConsentTypeLabel(consentType) {
  switch (consentType) {
    case 'TREATMENT': return 'Treatment'
    case 'MARKETING': return 'Marketing'
    case 'RESEARCH': return 'Penelitian'
    case 'SOCIAL_MEDIA': return 'Media Sosial'
    case 'MEDICAL_RECORD': return 'Rekam Medis'
    case 'PORTFOLIO': return 'Portfolio'
    default: return consentType
  }
}

function getConsentTypeColor(consentType) {
  switch (consentType) {
    case 'TREATMENT': return 'primary'
    case 'MARKETING': return 'warning'
    case 'RESEARCH': return 'info'
    case 'SOCIAL_MEDIA': return 'purple'
    case 'MEDICAL_RECORD': return 'success'
    case 'PORTFOLIO': return 'pink'
    default: return 'secondary'
  }
}

function getPhotoQualityLabel(quality) {
  switch (quality) {
    case 'RAW': return 'Raw'
    case 'COMPRESSED': return 'Compressed'
    case 'PROCESSED': return 'Processed'
    default: return quality
  }
}

function getPhotoQualityColor(quality) {
  switch (quality) {
    case 'RAW': return 'success'
    case 'COMPRESSED': return 'warning'
    case 'PROCESSED': return 'info'
    default: return 'secondary'
  }
}

function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getConsentStatusLabel(photo) {
  if (photo.is_revoked) return 'Dicabut'
  if (!photo.consent_given) return 'Menunggu'
  if (photo.verified_at) return 'Terverifikasi'
  return 'Diberikan'
}

function getConsentStatusColor(photo) {
  if (photo.is_revoked) return 'error'
  if (!photo.consent_given) return 'warning'
  if (photo.verified_at) return 'success'
  return 'info'
}

function getTreatmentStatusColor(treatment) {
  if (treatment.completed_at) return 'success'
  if (treatment.performed_at) return 'warning'
  return 'secondary'
}

function getTreatmentStatusLabel(treatment) {
  if (treatment.completed_at) return 'Selesai'
  if (treatment.performed_at) return 'Sedang Berlangsung'
  return 'Terjadwal'
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('id-ID')
}

function formatCurrency(amount) {
  if (!amount) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

onMounted(async () => {
  await Promise.all([fetchDoctors(), fetchBranches(), fetchTherapists()])
  fetchVisit()
  fetchVisitTreatments()
  fetchVisitProducts()
  fetchVisitConsultations()
  fetchMedicalRecords()
  fetchConsentPhotos()
})

onActivated(() => {
  fetchVisit()
  fetchVisitTreatments()
  fetchVisitProducts()
  fetchVisitConsultations()
  fetchMedicalRecords()
  fetchConsentPhotos()
})
</script>

<style scoped>
.photo-card {
  position: relative;
  transition: transform 0.2s ease;
  cursor: pointer;
}

.photo-card:hover {
  transform: translateY(-2px);
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 12px 8px 8px;
  color: white;
}

.photo-overlay .v-chip {
  background: rgba(255, 255, 255, 0.9) !important;
  color: rgba(0, 0, 0, 0.87) !important;
  font-weight: 500;
}

/* Prevent auto scroll when changing tabs */
:deep(.v-window) {
  overflow: visible !important;
}

:deep(.v-window-item) {
  transform: none !important;
}

/* Smooth tab transitions without scroll */
:deep(.v-tabs) {
  position: sticky;
  top: 0;
  z-index: 1;
  background: white;
}

/* Ensure consistent card layout */
.service-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  margin-bottom: 16px;
}

.service-card:last-child {
  margin-bottom: 0;
}

/* Slide fade animation for tab transitions */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-fade-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateX(0);
  opacity: 1;
}


</style>
