<route lang="yaml">
meta:
  layout: default
  navActiveLink: transaction-consultations
</route>

<template>
  <VCard>
    <!-- Simple Header -->
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
            Konsultasi Dokter
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ID: {{ consultationId }}
          </p>
        </div>
      </div>
      <VBtn
        variant="text"
        color="secondary"
        prepend-icon="tabler-arrow-left"
        :to="{ name: 'transaction-consultations' }"
      >
        Kembali
      </VBtn>
      <VBtn
        v-if="consultation && !consultation.end_time"
        color="success"
        prepend-icon="tabler-check"
        :loading="completingConsultation"
        @click="completeConsultation"
      >
        Selesai
      </VBtn>
    </VCardTitle>

    <VDivider />

    <VCardText class="pa-4">
      <VRow v-if="loading">
        <VCol cols="12">
          <VSkeletonLoader
            type="article"
            class="mx-auto"
          />
        </VCol>
      </VRow>

      <VRow v-else-if="consultation">
        <!-- Simple Info Card -->
        <VCol cols="12" class="mb-4">
          <VCard variant="outlined" color="primary" class="mb-4">
            <VCardText class="pa-4">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <h4 class="text-subtitle-1 font-weight-medium mb-1">
                    {{ getConsultationTypeText(consultation.consultation_type) }}
                  </h4>
                  <p class="text-body-2 mb-0">
                    Biaya: {{ formatCurrency(consultation.fee) }}
                  </p>
                </div>
                <VChip
                  :color="getConsultationTypeColor(consultation.consultation_type)"
                  size="small"
                  label
                >
                  {{ consultation.consultation_type }}
                </VChip>
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Form Section -->
        <VCol cols="12">
          <h3 class="text-h6 mb-4">
            Form Konsultasi
          </h3>
          <VForm ref="consultationFormRef" v-model="isFormValid">
            <VRow>
              <!-- Diagnosis -->
              <VCol cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                  Diagnosis
                </label>
                <VTextarea
                  v-model="consultationForm.diagnosis"
                  :placeholder="consultation.diagnosis || 'Masukkan diagnosis pasien...'"
                  rows="3"
                  variant="outlined"
                  :rules="[v => !!v || 'Diagnosis harus diisi']"
                  required
                  hide-details
                />
              </VCol>

              <!-- Treatment Plan -->
              <VCol cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                  Rencana Perawatan
                </label>
                <VTextarea
                  v-model="consultationForm.treatment_plan"
                  :placeholder="consultation.treatment_plan || 'Masukkan rencana perawatan...'"
                  rows="3"
                  variant="outlined"
                  :rules="[v => !!v || 'Rencana perawatan harus diisi']"
                  required
                  hide-details
                />
              </VCol>

              <!-- Notes -->
              <VCol cols="12">
                <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                  Catatan Konsultasi
                </label>
                <VTextarea
                  v-model="consultationForm.consultation_notes"
                  :placeholder="consultation.consultation_notes || 'Masukkan catatan tambahan...'"
                  rows="3"
                  variant="outlined"
                  hide-details
                />
              </VCol>



              <!-- Action Buttons -->
              <VCol cols="12">
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
                    @click="submitConsultation"
                  >
                    Simpan
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VCol>

        <!-- Existing Recommendations -->
        <VCol cols="12" class="mt-6" v-if="existingRecommendations.length > 0">
          <VCard variant="outlined">
            <VCardTitle class="pa-4 pb-2">
              <div class="d-flex align-center gap-2">
                <VIcon size="20" color="info">
                  tabler-list-check
                </VIcon>
                <h4 class="text-subtitle-1 font-weight-medium">
                  Rekomendasi Tindakan/Produk
                </h4>
              </div>
            </VCardTitle>
            <VCardText class="pa-4 pt-0">
              <div v-for="(recommendation, index) in existingRecommendations" :key="recommendation.id">
                <!-- Recommendation Header -->
                <div class="d-flex align-center justify-space-between mb-4" :class="{ 'mt-6': index > 0 }">
                  <div class="d-flex align-center gap-3">
                    <div class="d-flex align-center justify-center rounded-circle bg-primary pa-2" style="width: 40px; height: 40px;">
                      <VIcon size="20" color="white">
                        tabler-clipboard-list
                      </VIcon>
                    </div>
                    <div>
                      <h5 class="text-h6 font-weight-medium mb-1">
                        {{ recommendation.recommendation_number }}
                      </h5>
                      <p class="text-caption text-medium-emphasis mb-0">
                        Dibuat pada {{ formatDateTime(recommendation.created_at) }}
                      </p>
                    </div>
                  </div>
                  <div class="d-flex align-center gap-2">
                    <VChip
                      :color="getPriorityColor(recommendation.priority_level)"
                      size="small"
                      label
                      class="font-weight-medium"
                    >
                      {{ getPriorityText(recommendation.priority_level) }}
                    </VChip>
                    <VChip
                      :color="getRecommendationStatusColor(recommendation.status)"
                      size="small"
                      label
                      class="font-weight-medium"
                    >
                      {{ getRecommendationStatusText(recommendation.status) }}
                    </VChip>
                  </div>
                </div>

                <!-- Recommendation Content -->
                <VRow>
                  <!-- Medical Information -->
                  <VCol cols="12" md="8">
                    <div class="space-y-4">
                      <!-- Diagnosis -->
                      <div class="bg-light-primary rounded pa-3">
                        <div class="d-flex align-center gap-2 mb-2">
                          <VIcon size="18" color="primary">
                            tabler-stethoscope
                          </VIcon>
                          <h6 class="text-subtitle-2 font-weight-medium mb-0">
                            Diagnosis
                          </h6>
                        </div>
                        <p class="text-body-1 mb-0">{{ recommendation.diagnosis_summary }}</p>
                      </div>

                      <!-- Treatment Goals -->
                      <div class="bg-light-success rounded pa-3">
                        <div class="d-flex align-center gap-2 mb-2">
                          <VIcon size="18" color="success">
                            tabler-target
                          </VIcon>
                          <h6 class="text-subtitle-2 font-weight-medium mb-0">
                            Tujuan Perawatan
                          </h6>
                        </div>
                        <p class="text-body-1 mb-0">{{ recommendation.treatment_goals }}</p>
                      </div>

                      <!-- Expected Outcomes -->
                      <div v-if="recommendation.expected_outcomes" class="bg-light-info rounded pa-3">
                        <div class="d-flex align-center gap-2 mb-2">
                          <VIcon size="18" color="info">
                            tabler-chart-line
                          </VIcon>
                          <h6 class="text-subtitle-2 font-weight-medium mb-0">
                            Hasil yang Diharapkan
                          </h6>
                        </div>
                        <p class="text-body-1 mb-0">{{ recommendation.expected_outcomes }}</p>
                      </div>

                      <!-- Notes -->
                      <div v-if="recommendation.notes" class="bg-light-warning rounded pa-3">
                        <div class="d-flex align-center gap-2 mb-2">
                          <VIcon size="18" color="warning">
                            tabler-notes
                          </VIcon>
                          <h6 class="text-subtitle-2 font-weight-medium mb-0">
                            Catatan Tambahan
                          </h6>
                        </div>
                        <p class="text-body-1 mb-0">{{ recommendation.notes }}</p>
                      </div>
                    </div>
                  </VCol>

                  <!-- Technical Details -->
                  <VCol cols="12" md="4">
                    <VCard variant="outlined" class="pa-4">
                      <div class="d-flex align-center gap-2 mb-3">
                        <VIcon size="16" color="secondary">
                          tabler-settings
                        </VIcon>
                        <h6 class="text-subtitle-2 font-weight-medium mb-0">
                          Detail Perawatan
                        </h6>
                      </div>
                      
                      <div class="space-y-3">
                        <!-- Doctor Info -->
                        <div class="bg-light-primary rounded pa-3 mb-3">
                          <div class="d-flex align-center gap-2 mb-2">
                            <VIcon size="16" color="primary">
                              tabler-user-md
                            </VIcon>
                            <h6 class="text-caption font-weight-medium mb-0">
                              Dokter Penanggung Jawab
                            </h6>
                          </div>
                          <div class="space-y-1">
                            <div class="text-body-2 font-weight-medium">{{ doctorInfo?.name || 'Dr. Sarah Wijaya, Sp.KK' }}</div>
                            <div class="text-caption text-medium-emphasis">{{ doctorInfo?.specialization || 'Dermatologi & Kosmetik' }}</div>
                            <div class="text-caption text-medium-emphasis">STR: {{ doctorInfo?.license_number || 'STR-12345678901' }}</div>
                          </div>
                        </div>

                        <!-- Duration -->
                        <div class="d-flex align-center justify-space-between py-2 border-bottom">
                          <span class="text-caption text-medium-emphasis">Durasi Perawatan</span>
                          <span class="text-body-2 font-weight-medium">{{ recommendation.duration_weeks }} minggu</span>
                        </div>
                        <!-- Valid Period -->
                        <div class="d-flex align-center justify-space-between py-2 border-bottom">
                          <span class="text-caption text-medium-emphasis">Periode Berlaku</span>
                          <div class="text-right">
                            <div class="text-body-2 font-weight-medium">{{ formatDate(recommendation.valid_from) }}</div>
                            <div class="text-caption text-medium-emphasis">sampai</div>
                            <div class="text-body-2 font-weight-medium">{{ formatDate(recommendation.valid_until) }}</div>
                          </div>
                        </div> 

                        <!-- IDs Section -->
                        <div class="mt-4">
                          <!-- <h6 class="text-caption font-weight-medium text-medium-emphasis mb-2">Referensi ID</h6> -->
                          <div class="space-y-2">
                            <!-- <div class="d-flex align-center justify-space-between">
                              <span class="text-caption text-medium-emphasis">Cabang</span>
                              <span class="text-caption font-weight-medium">{{ recommendation.branch_id }}</span>
                            </div>
                            <div class="d-flex align-center justify-space-between">
                              <span class="text-caption text-medium-emphasis">Pasien</span>
                              <span class="text-caption font-weight-medium">{{ recommendation.patient_id }}</span>
                            </div>
                            <div class="d-flex align-center justify-space-between">
                              <span class="text-caption text-medium-emphasis">Kunjungan</span>
                              <span class="text-caption font-weight-medium">{{ recommendation.visit_id }}</span>
                            </div> -->
                          </div>
                        </div>
                      </div>
                    </VCard>
                  </VCol>
                </VRow>

                <!-- Recommendation Details/Items -->
                <div v-if="getRecommendationDetails(recommendation.id).length > 0" class="mt-6">
                  <VCard variant="outlined">
                    <VCardTitle class="pa-4 pb-2">
                      <div class="d-flex align-center gap-2">
                        <VIcon size="20" color="primary">
                          tabler-list-details
                        </VIcon>
                        <h4 class="text-subtitle-1 font-weight-medium">
                          Detail Tindakan/Produk
                        </h4>
                      </div>
                    </VCardTitle>
                    <VCardText class="pa-4 pt-0">
                      <div class="space-y-4">
                        <div 
                          v-for="detail in getRecommendationDetails(recommendation.id)" 
                          :key="detail.id"
                          class="bg-light-surface rounded pa-4"
                        >
                          <div class="d-flex align-center justify-space-between mb-3">
                            <div class="d-flex align-center gap-3">
                              <div class="d-flex align-center justify-center rounded-circle pa-2" 
                                   :class="detail.item_type === 'TREATMENT' ? 'bg-primary' : 'bg-success'"
                                   style="width: 36px; height: 36px;">
                                <VIcon size="18" color="white">
                                  {{ detail.item_type === 'TREATMENT' ? 'tabler-stethoscope' : 'tabler-package' }}
                                </VIcon>
                              </div>
                              <div>
                                <h6 class="text-subtitle-1 font-weight-medium mb-1">
                                  {{ detail.item_info?.name || `Item ${detail.item_id}` }}
                                </h6>
                                <p class="text-caption text-medium-emphasis mb-0">
                                  <VChip
                                    :color="detail.item_type === 'TREATMENT' ? 'primary' : 'success'"
                                    size="x-small"
                                    class="mr-2"
                                    label
                                    style="vertical-align: middle;"
                                  >
                                    <VIcon size="14" left>
                                      {{ detail.item_type === 'TREATMENT' ? 'tabler-stethoscope' : 'tabler-package' }}
                                    </VIcon>
                                    {{ detail.item_type === 'TREATMENT' ? 'Tindakan' : 'Produk' }}
                                  </VChip>
                                  {{ detail.item_info?.code || detail.item_id }}
                                </p>
                              </div>
                            </div>
                            <div class="d-flex align-center gap-2">
                              <VChip
                                :color="detail.is_required ? 'success' : 'warning'"
                                size="small"
                                label
                              >
                                {{ detail.is_required ? 'Wajib' : 'Opsional' }}
                              </VChip>
                              <VChip
                                color="primary"
                                size="small"
                                label
                              >
                                Urutan {{ detail.sequence_order }}
                              </VChip>
                            </div>
                          </div>

                          <VRow>
                            <!-- Item Details -->
                            <VCol cols="12" md="8">
                              <div class="space-y-3">
                                <!-- Instructions -->
                                <div v-if="detail.instructions" class="bg-light-primary rounded pa-3">
                                  <div class="d-flex align-center gap-2 mb-2">
                                    <VIcon size="16" color="primary">
                                      tabler-notes
                                    </VIcon>
                                    <h6 class="text-caption font-weight-medium mb-0">
                                      Instruksi Penggunaan
                                    </h6>
                                  </div>
                                  <p class="text-body-2 mb-0">{{ detail.instructions }}</p>
                                </div>

                                <!-- Contraindications -->
                                <div v-if="detail.contraindications" class="bg-light-warning rounded pa-3">
                                  <div class="d-flex align-center gap-2 mb-2">
                                    <VIcon size="16" color="warning">
                                      tabler-alert-triangle
                                    </VIcon>
                                    <h6 class="text-caption font-weight-medium mb-0">
                                      Kontraindikasi
                                    </h6>
                                  </div>
                                  <p class="text-body-2 mb-0">{{ detail.contraindications }}</p>
                                </div>

                                <!-- Expected Results -->
                                <div v-if="detail.expected_results" class="bg-light-success rounded pa-3">
                                  <div class="d-flex align-center gap-2 mb-2">
                                    <VIcon size="16" color="success">
                                      tabler-target
                                    </VIcon>
                                    <h6 class="text-caption font-weight-medium mb-0">
                                      Hasil yang Diharapkan
                                    </h6>
                                  </div>
                                  <p class="text-body-2 mb-0">{{ detail.expected_results }}</p>
                                </div>

                                <!-- Item Description -->
                                <div v-if="detail.item_info?.description" class="bg-light-info rounded pa-3">
                                  <div class="d-flex align-center gap-2 mb-2">
                                    <VIcon size="16" color="info">
                                      tabler-info-circle
                                    </VIcon>
                                    <h6 class="text-caption font-weight-medium mb-0">
                                      Deskripsi
                                    </h6>
                                  </div>
                                  <p class="text-body-2 mb-0">{{ detail.item_info.description }}</p>
                                </div>
                              </div>
                            </VCol>

                            <!-- Technical Details -->
                            <VCol cols="12" md="4">
                              <VCard variant="outlined" class="pa-3">
                                <div class="space-y-3">
                                  <!-- Quantity & Frequency -->
                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Jumlah</span>
                                    <span class="text-body-2 font-weight-medium">{{ detail.quantity }}</span>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Frekuensi</span>
                                    <span class="text-body-2 font-weight-medium">{{ detail.frequency }}</span>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Durasi</span>
                                    <span class="text-body-2 font-weight-medium">{{ detail.duration_days }} hari</span>
                                  </div>

                                  <!-- Pricing -->
                                  <!-- <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Harga Satuan</span>
                                    <span class="text-body-2 font-weight-medium text-success">{{ formatCurrency(detail.unit_price) }}</span>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Total Harga</span>
                                    <span class="text-body-2 font-weight-medium text-primary">{{ formatCurrency(detail.total_price) }}</span>
                                  </div> -->

                                  <!-- Treatment-specific details -->
                                  <div v-if="detail.item_type === 'TREATMENT' && detail.item_info">
                                    <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                      <span class="text-caption text-medium-emphasis">Durasi Treatment</span>
                                      <span class="text-body-2 font-weight-medium">{{ detail.item_info.duration_minutes }} menit</span>
                                    </div>

                                    <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                      <span class="text-caption text-medium-emphasis">Kategori</span>
                                      <span class="text-body-2 font-weight-medium">{{ detail.item_info.category?.name }}</span>
                                    </div>
                                  </div>

                                  <!-- Product-specific details -->
                                  <div v-if="detail.item_type === 'PRODUCT' && detail.item_info">
                                    <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                      <span class="text-caption text-medium-emphasis">Brand</span>
                                      <span class="text-body-2 font-weight-medium">{{ detail.item_info.brand }}</span>
                                    </div>

                                    <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                      <span class="text-caption text-medium-emphasis">Kategori</span>
                                      <span class="text-body-2 font-weight-medium">{{ detail.item_info.category?.name }}</span>
                                    </div>

                                    <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                      <span class="text-caption text-medium-emphasis">Unit</span>
                                      <span class="text-body-2 font-weight-medium">{{ detail.item_info.unit_of_measure }}</span>
                                    </div>
                                  </div>
                                </div>
                              </VCard>
                            </VCol>
                          </VRow>
                        </div>
                      </div>
                    </VCardText>
                  </VCard>
                </div>

                <!-- Divider between recommendations -->
                <VDivider v-if="index < existingRecommendations.length - 1" class="my-6" />
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Recommendation Details Form -->
        <VCol cols="12" class="mt-6" v-if="existingRecommendations.length > 0 && !consultation.end_time">
          <VCard variant="outlined">
            <VCardTitle class="pa-4 pb-2">
              <div class="d-flex align-center gap-2">
                <VIcon size="20" color="success">
                  tabler-plus
                </VIcon>
                <h4 class="text-subtitle-1 font-weight-medium">
                  Tambah Tindakan/Produk ke Rekomendasi
                </h4>
              </div>
            </VCardTitle>
            <VCardText class="pa-4 pt-0">
              <VForm ref="recommendationDetailsFormRef" v-model="isRecommendationDetailsFormValid">
                <VRow>
                  <!-- Item Type Selection -->
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Jenis Item
                    </label>
                    <VSelect
                      v-model="recommendationDetailsForm.item_type"
                      :items="itemTypeOptions"
                      variant="outlined"
                      :rules="[v => !!v || 'Jenis item harus diisi']"
                      required
                      clearable
                      hide-details
                      @update:model-value="onItemTypeChange"
                    />
                  </VCol>

                  <!-- Treatment Selection -->
                  <VCol cols="12" md="6" v-if="recommendationDetailsForm.item_type === 'TREATMENT'">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Pilih Tindakan
                    </label>
                    <VSelect
                      v-model="recommendationDetailsForm.selectedTreatments"
                      :items="treatments"
                      :loading="loadingTreatments"
                      variant="outlined"
                      :rules="[v => v && v.length > 0 || 'Pilih minimal satu tindakan']"
                      required
                      multiple
                      clearable
                      hide-details
                      placeholder="Pilih tindakan..."
                    />
                  </VCol>

                  <!-- Product Selection -->
                  <VCol cols="12" md="6" v-if="recommendationDetailsForm.item_type === 'PRODUCT'">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Pilih Produk
                    </label>
                    <VSelect
                      v-model="recommendationDetailsForm.selectedProducts"
                      :items="products"
                      :loading="loadingProducts"
                      variant="outlined"
                      :rules="[v => v && v.length > 0 || 'Pilih minimal satu produk']"
                      required
                      multiple
                      clearable
                      placeholder="Pilih produk..."
                    />
                  </VCol>

                  <!-- Sequence Order -->
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Urutan
                    </label>
                    <VTextField
                      v-model="recommendationDetailsForm.sequence_order"
                      type="number"
                      variant="outlined"
                      :rules="[v => !!v || 'Urutan harus diisi', v => v > 0 || 'Urutan harus lebih dari 0']"
                      required
                    />
                  </VCol>

                  <!-- Quantity -->
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Jumlah
                    </label>
                    <VTextField
                      v-model="recommendationDetailsForm.quantity"
                      type="number"
                      variant="outlined"
                      :rules="[v => !!v || 'Jumlah harus diisi', v => v > 0 || 'Jumlah harus lebih dari 0']"
                      required
                    />
                  </VCol>

                  <!-- Frequency -->
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Frekuensi
                    </label>
                    <VTextField
                      v-model="recommendationDetailsForm.frequency"
                      variant="outlined"
                      placeholder="Contoh: 2x daily, 3x weekly"
                      :rules="[v => !!v || 'Frekuensi harus diisi']"
                      required
                    />
                  </VCol>

                  <!-- Duration Days -->
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Durasi (Hari)
                    </label>
                    <VTextField
                      v-model="recommendationDetailsForm.duration_days"
                      type="number"
                      variant="outlined"
                      :rules="[v => !!v || 'Durasi harus diisi', v => v > 0 || 'Durasi harus lebih dari 0']"
                      required
                    />
                  </VCol>

                  <!-- Unit Price (Hidden/Static) -->
                  <VCol cols="12" md="6" style="display: none;">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Harga Satuan
                    </label>
                    <VTextField
                      v-model="recommendationDetailsForm.unit_price"
                      type="number"
                      variant="outlined"
                      :rules="[v => !!v || 'Harga satuan harus diisi', v => v >= 0 || 'Harga tidak boleh negatif']"
                      required
                      hide-details
                    />
                  </VCol>

                  <!-- Instructions -->
                  <VCol cols="12">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Instruksi Penggunaan
                    </label>
                    <VTextarea
                      v-model="recommendationDetailsForm.instructions"
                      placeholder="Masukkan instruksi penggunaan..."
                      rows="3"
                      variant="outlined"
                      :rules="[v => !!v || 'Instruksi penggunaan harus diisi']"
                      required
                    />
                  </VCol>

                  <!-- Contraindications -->
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Kontraindikasi
                    </label>
                    <VTextarea
                      v-model="recommendationDetailsForm.contraindications"
                      placeholder="Masukkan kontraindikasi jika ada..."
                      rows="3"
                      variant="outlined"
                      hide-details
                    />
                  </VCol>

                  <!-- Expected Results -->
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Hasil yang Diharapkan
                    </label>
                    <VTextarea
                      v-model="recommendationDetailsForm.expected_results"
                      placeholder="Masukkan hasil yang diharapkan..."
                      rows="3"
                      variant="outlined"
                      hide-details
                    />
                  </VCol>

                  <!-- Is Required -->
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Wajib Dilakukan
                    </label>
                    <VSwitch
                      v-model="recommendationDetailsForm.is_required"
                      color="primary"
                      hide-details
                    />
                  </VCol>

                  <!-- Action Buttons -->
                  <VCol cols="12">
                    <VDivider class="my-4" />
                    <div class="d-flex gap-3 justify-end">
                      <VBtn
                        variant="outlined"
                        color="secondary"
                        @click="resetRecommendationDetailsForm"
                      >
                        Reset
                      </VBtn>
                      <VBtn
                        color="success"
                        :loading="savingRecommendationDetails"
                        @click="submitRecommendationDetails"
                      >
                        Tambah ke Rekomendasi
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VCardText>
          </VCard>
        </VCol> 

        <!-- Treatment Recommendation Form -->
        <VCol cols="12" class="mt-6" v-if="existingRecommendations.length === 0 && !consultation.end_time">
          <VCard variant="outlined">
            <VCardTitle class="pa-4 pb-2">
              <div class="d-flex align-center gap-2">
                <VIcon size="20" color="success">
                  tabler-clipboard-list
                </VIcon>
                <h4 class="text-subtitle-1 font-weight-medium">
                  Buat Rekomendasi Treatment
                </h4>
              </div>
            </VCardTitle>
            <VCardText class="pa-4 pt-0">
              <VForm ref="recommendationFormRef" v-model="isRecommendationFormValid">
                <VRow>
                  <!-- Recommendation Type (Hidden/Static) -->
                  <VCol cols="12" md="6" style="display: none;">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Jenis Rekomendasi
                    </label>
                    <VTextField
                      v-model="recommendationForm.recommendation_type"
                      value="TREATMENT_PLAN"
                      variant="outlined"
                      readonly
                      hide-details
                    />
                  </VCol>

                  <!-- Priority Level -->
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Tingkat Prioritas
                    </label>
                    <VSelect
                      v-model="recommendationForm.priority_level"
                      :items="priorityLevelOptions"
                      variant="outlined"
                      :rules="[v => !!v || 'Tingkat prioritas harus diisi']"
                      required
                      hide-details
                    />
                  </VCol>

                  <!-- Status (Hidden/Static) -->
                  <VCol cols="12" md="6" style="display: none;">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Status
                    </label>
                    <VSelect
                      v-model="recommendationForm.status"
                      :items="statusOptions"
                      variant="outlined"
                      :rules="[v => !!v || 'Status harus diisi']"
                      required
                      hide-details
                    />
                  </VCol>

                  <!-- Duration Weeks -->
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Durasi (Minggu)
                    </label>
                    <VTextField
                      v-model="recommendationForm.duration_weeks"
                      type="number"
                      variant="outlined"
                      :rules="[v => !!v || 'Durasi harus diisi', v => v > 0 || 'Durasi harus lebih dari 0']"
                      required
                      hide-details
                    />
                  </VCol>

                  <!-- Diagnosis Summary -->
                  <VCol cols="12">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Ringkasan Diagnosis
                    </label>
                    <VTextarea
                      v-model="recommendationForm.diagnosis_summary"
                      placeholder="Masukkan ringkasan diagnosis..."
                      rows="3"
                      variant="outlined"
                      :rules="[v => !!v || 'Ringkasan diagnosis harus diisi']"
                      required
                      hide-details
                    />
                  </VCol>

                  <!-- Treatment Goals -->
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Tujuan Perawatan
                    </label>
                    <VTextarea
                      v-model="recommendationForm.treatment_goals"
                      placeholder="Masukkan tujuan perawatan..."
                      rows="3"
                      variant="outlined"
                      :rules="[v => !!v || 'Tujuan perawatan harus diisi']"
                      required
                      hide-details
                    />
                  </VCol>

                  <!-- Expected Outcomes -->
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Hasil yang Diharapkan
                    </label>
                    <VTextarea
                      v-model="recommendationForm.expected_outcomes"
                      placeholder="Masukkan hasil yang diharapkan..."
                      rows="3"
                      variant="outlined"
                      :rules="[v => !!v || 'Hasil yang diharapkan harus diisi']"
                      required
                      hide-details
                    />
                  </VCol>

                  <!-- Total Estimated Cost (Hidden/Static) -->
                  <VCol cols="12" md="6" style="display: none;">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Total Estimasi Biaya
                    </label>
                    <VTextField
                      v-model="recommendationForm.total_estimated_cost"
                      type="number"
                      variant="outlined"
                      placeholder="0"
                      :rules="[v => !!v || 'Total estimasi biaya harus diisi', v => v >= 0 || 'Biaya tidak boleh negatif']"
                      required
                      hide-details
                    />
                  </VCol>

                  <!-- Valid From -->
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Berlaku Dari
                    </label>
                    <VTextField
                      v-model="recommendationForm.valid_from"
                      type="date"
                      variant="outlined"
                      :rules="[v => !!v || 'Tanggal berlaku dari harus diisi']"
                      required
                      hide-details
                    />
                  </VCol>

                  <!-- Valid Until -->
                  <VCol cols="12" md="6">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Berlaku Sampai
                    </label>
                    <VTextField
                      v-model="recommendationForm.valid_until"
                      type="date"
                      variant="outlined"
                      :rules="[v => !!v || 'Tanggal berlaku sampai harus diisi']"
                      required
                      hide-details
                    />
                  </VCol>

                  <!-- Notes -->
                  <VCol cols="12">
                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                      Catatan
                    </label>
                    <VTextarea
                      v-model="recommendationForm.notes"
                      placeholder="Masukkan catatan tambahan..."
                      rows="3"
                      variant="outlined"
                      hide-details
                    />
                  </VCol>

                  <!-- Visit Data Info -->
                  <VCol v-if="visitData" cols="12">
                    <VAlert
                      type="info"
                      variant="tonal"
                      class="mb-4"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-info-circle" />
                      </template>
                      <div>
                        <strong>Data Kunjungan:</strong> {{ visitData.patient?.name }} ({{ visitData.visit_number }}) - {{ visitData.branch_id }}
                      </div>
                    </VAlert>
                  </VCol>

                  <!-- Loading Visit Data -->
                  <VCol v-if="loadingVisitData" cols="12">
                    <VAlert
                      type="info"
                      variant="tonal"
                      class="mb-4"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-loader-2" class="animate-spin" />
                      </template>
                      <div>
                        Memuat data kunjungan...
                      </div>
                    </VAlert>
                  </VCol>

                  <!-- Action Buttons -->
                  <VCol cols="12">
                    <VDivider class="my-4" />
                    <div class="d-flex gap-3 justify-end">
                      <VBtn
                        variant="outlined"
                        color="secondary"
                        @click="resetRecommendationForm"
                      >
                        Reset
                      </VBtn>
                      <VBtn
                        color="success"
                        :loading="savingRecommendation"
                        :disabled="!isRecommendationFormValid"
                        @click="submitRecommendation"
                      >
                        Buat Rekomendasi
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VCardText>
          </VCard>
        </VCol> 
      </VRow>

      <VRow v-else>
        <VCol cols="12">
          <div class="text-center py-8">
            <VIcon
              size="48"
              color="error"
              class="mb-3"
            >
              tabler-alert-circle
            </VIcon>
            <h3 class="text-h6 mb-2">
              Data tidak ditemukan
            </h3>
            <VBtn
              color="primary"
              variant="tonal"
              :to="{ name: 'transaction-consultations' }"
            >
              Kembali
            </VBtn>
          </div>
        </VCol>
      </VRow>
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
const consultationId = route.params.id

const consultation = ref(null)
const loading = ref(true)
const saving = ref(false)
const completingConsultation = ref(false)
const isFormValid = ref(true)
const consultationFormRef = ref(null)

const consultationForm = ref({
  diagnosis: '',
  treatment_plan: '',
  consultation_notes: '',
  end_time: '',
})

// Recommendation form variables
const savingRecommendation = ref(false)
const isRecommendationFormValid = ref(true)
const recommendationFormRef = ref(null)
const visitData = ref(null)
const loadingVisitData = ref(false)
const existingRecommendations = ref([])
const loadingRecommendations = ref(false)

// Recommendation details form variables
const savingRecommendationDetails = ref(false)
const isRecommendationDetailsFormValid = ref(true)
const recommendationDetailsFormRef = ref(null)
const treatments = ref([])
const products = ref([])
const loadingTreatments = ref(false)
const loadingProducts = ref(false)
const recommendationDetails = ref([])
const loadingRecommendationDetails = ref(false)
const doctorInfo = ref(null)
const loadingDoctorInfo = ref(false)

const recommendationDetailsForm = ref({
  item_type: '',
  selectedTreatments: [],
  selectedProducts: [],
  sequence_order: 1,
  quantity: 1,
  frequency: '',
  duration_days: 30,
  unit_price: 0, // Static value
  instructions: '',
  contraindications: '',
  expected_results: '',
  is_required: true, // Will be converted to boolean in submission
})

// Options for recommendation details form
const itemTypeOptions = [
  { title: 'Tindakan', value: 'TREATMENT' },
  { title: 'Produk', value: 'PRODUCT' },
]

const recommendationForm = ref({
  recommendation_type: 'TREATMENT_PLAN', // Static value
  priority_level: 'MEDIUM',
  status: 'COMPLETED', // Static value
  diagnosis_summary: '',
  treatment_goals: '',
  expected_outcomes: '',
  duration_weeks: 1,
  total_estimated_cost: 0, // Static value
  notes: '',
  valid_from: '',
  valid_until: '',
})

// Options for recommendation form
const recommendationTypeOptions = [
  { title: 'Treatment Plan', value: 'TREATMENT_PLAN' },
  { title: 'Product Recommendation', value: 'PRODUCT_RECOMMENDATION' },
  { title: 'Lifestyle Advice', value: 'LIFESTYLE_ADVICE' },
]

const priorityLevelOptions = [
  { title: 'Low', value: 'LOW' },
  { title: 'Medium', value: 'MEDIUM' },
  { title: 'High', value: 'HIGH' },
  { title: 'Urgent', value: 'URGENT' },
]

const statusOptions = [
  { title: 'Draft', value: 'DRAFT' },
  { title: 'Active', value: 'ACTIVE' },
  { title: 'Completed', value: 'COMPLETED' },
  { title: 'Cancelled', value: 'CANCELLED' },
]

// Get today's date in YYYY-MM-DD format for time input
function getTodayDate() {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// Get current time in HH:MM format
function getCurrentTime() {
  const now = new Date()
  return now.toTimeString().slice(0, 5)
}

// Get default dates for recommendation form
function getDefaultDates() {
  const today = new Date()
  const validFrom = today.toISOString().split('T')[0]
  
  // Set valid_until to 2 months from today
  const validUntil = new Date(today)
  validUntil.setMonth(validUntil.getMonth() + 2)
  const validUntilStr = validUntil.toISOString().split('T')[0]
  
  return { validFrom, validUntilStr }
}

// Get recommendation details for a specific recommendation
function getRecommendationDetails(recommendationId) {
  return recommendationDetails.value.filter(detail => detail.recommendation_id === recommendationId)
}

// Fetch doctor information
async function fetchDoctorInfo(doctorId) {
  if (!doctorId) return null
  
  try {
    loadingDoctorInfo.value = true
    const res = await $api(`/hris/doctors/${doctorId}`, {
      method: 'GET',
    })
    
    doctorInfo.value = res.data
    console.log('✅ Doctor info loaded:', doctorInfo.value)
    
    return res.data
  } catch (error) {
    console.error('❌ Error fetching doctor info:', error)
    // Don't show error alert for this, just log it
    return null
  } finally {
    loadingDoctorInfo.value = false
  }
}

// Fetch visit data to get patient_id and branch_id
async function fetchVisitData(visitId) {
  if (!visitId) return null
  
  try {
    loadingVisitData.value = true
    const res = await $api(`/rme/patient-visits/${visitId}`, {
      method: 'GET',
    })
    
    visitData.value = res.data
    console.log('✅ Visit data loaded:', visitData.value)
    
    return res.data
  } catch (error) {
    console.error('❌ Error fetching visit data:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Kunjungan',
      text: 'Tidak dapat memuat data kunjungan. Silakan coba lagi.',
    })
    return null
  } finally {
    loadingVisitData.value = false
  }
}

// Fetch recommendation details for a specific recommendation
async function fetchRecommendationDetails(recommendationId) {
  if (!recommendationId) return []
  
  try {
    loadingRecommendationDetails.value = true
    const res = await $api(`/rme/visit-recommendation-details/recommendation/${recommendationId}`, {
      method: 'GET',
    })
    
    const details = res.data || []
    
    // Fetch treatment/product details for each item
    const detailsWithInfo = await Promise.all(
      details.map(async (detail) => {
        try {
          let itemInfo = null
          
          if (detail.item_type === 'TREATMENT') {
            const treatmentRes = await $api(`/crm/treatments/${detail.item_id}`, {
              method: 'GET',
            })
            itemInfo = treatmentRes.data
          } else if (detail.item_type === 'PRODUCT') {
            const productRes = await $api(`/wms/products/${detail.item_id}`, {
              method: 'GET',
            })
            itemInfo = productRes.data
          }
          
          return {
            ...detail,
            item_info: itemInfo,
          }
        } catch (error) {
          console.error(`❌ Error fetching item info for ${detail.item_type} ${detail.item_id}:`, error)
          return {
            ...detail,
            item_info: null,
          }
        }
      })
    )
    
    recommendationDetails.value = detailsWithInfo
    console.log('✅ Recommendation details loaded:', recommendationDetails.value)
    
    return detailsWithInfo
  } catch (error) {
    console.error('❌ Error fetching recommendation details:', error)
    return []
  } finally {
    loadingRecommendationDetails.value = false
  }
}

// Fetch existing recommendations for the visit
async function fetchExistingRecommendations(visitId) {
  if (!visitId) return []
  
  try {
    loadingRecommendations.value = true
    const res = await $api(`/rme/visit-recommendations/visit/${visitId}`, {
      method: 'GET',
    })
    
    existingRecommendations.value = res.data || []
    console.log('✅ Existing recommendations loaded:', existingRecommendations.value)
    
    // Fetch details for each recommendation
    const allDetails = []
    for (const recommendation of existingRecommendations.value) {
      const details = await fetchRecommendationDetails(recommendation.id)
      allDetails.push(...details)
    }
    
    recommendationDetails.value = allDetails
    
    return res.data || []
  } catch (error) {
    console.error('❌ Error fetching recommendations:', error)
    // Don't show error alert for this, just log it
    return []
  } finally {
    loadingRecommendations.value = false
  }
}

// Load treatments for recommendation details
async function loadTreatmentsForRecommendation() {
  try {
    loadingTreatments.value = true
    const response = await $api('/crm/treatments', { method: 'GET' })
    treatments.value = (response.data || []).map(item => ({
      title: item.name,
      value: item.id,
    }))
    console.log('✅ Treatments loaded for recommendation:', treatments.value)
  } catch (error) {
    console.error('❌ Error loading treatments:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Treatment',
      text: 'Tidak dapat memuat daftar treatment. Silakan refresh halaman.',
    })
  } finally {
    loadingTreatments.value = false
  }
}

// Load products for recommendation details
async function loadProductsForRecommendation() {
  try {
    loadingProducts.value = true
    const response = await $api('/wms/products', { method: 'GET' })
    products.value = (response.data || []).map(item => ({
      title: item.name,
      value: item.id,
    }))
    console.log('✅ Products loaded for recommendation:', products.value)
  } catch (error) {
    console.error('❌ Error loading products:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Produk',
      text: 'Tidak dapat memuat daftar produk. Silakan refresh halaman.',
    })
  } finally {
    loadingProducts.value = false
  }
}

// Handle item type change
function onItemTypeChange() {
  recommendationDetailsForm.value.selectedTreatments = []
  recommendationDetailsForm.value.selectedProducts = []
}

async function fetchConsultation() {
  loading.value = true
  
  try {
    const res = await $api(`/rme/visit-consultations/${consultationId}`, {
      method: 'GET',
    })
    
    consultation.value = res.data
    console.log('✅ Consultation loaded:', consultation.value)
    
    // Populate form with existing data if available
    if (consultation.value) {
              consultationForm.value = {
          diagnosis: consultation.value.diagnosis || '',
          treatment_plan: consultation.value.treatment_plan || '',
          consultation_notes: consultation.value.consultation_notes || '',
        }
      
      // Fetch visit data if visit_id is available
      const visitId = consultation.value.visit_id || consultation.value.visit?.id
      const doctorId = consultation.value.doctor_id || consultation.value.doctor?.id
      
      if (visitId) {
        await Promise.all([
          fetchVisitData(visitId),
          fetchExistingRecommendations(visitId)
        ])
      }
      
      // Fetch doctor info if doctor_id is available
      if (doctorId) {
        await fetchDoctorInfo(doctorId)
      }
    }
  } catch (error) {
    console.error('❌ Error fetching consultation:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Konsultasi',
      text: 'Tidak dapat memuat data konsultasi. Silakan coba lagi.',
    })
    consultation.value = null
  } finally {
    loading.value = false
  }
}

function getConsultationTypeColor(type) {
  switch (type) {
  case 'INITIAL': return 'primary'
  case 'FOLLOW_UP': return 'success'
  case 'EMERGENCY': return 'error'
  default: return 'secondary'
  }
}

function getConsultationTypeText(type) {
  switch (type) {
  case 'INITIAL': return 'Konsultasi Awal'
  case 'FOLLOW_UP': return 'Konsultasi Lanjutan'
  case 'EMERGENCY': return 'Konsultasi Darurat'
  default: return type
  }
}

function getVisitStatusColor(status) {
  switch (status) {
  case 'COMPLETED': return 'success'
  case 'IN_PROGRESS': return 'warning'
  case 'SCHEDULED': return 'info'
  default: return 'secondary'
  }
}

function getVisitStatusText(status) {
  switch (status) {
  case 'COMPLETED': return 'Selesai'
  case 'IN_PROGRESS': return 'Sedang Berlangsung'
  case 'SCHEDULED': return 'Terjadwal'
  default: return status
  }
}

function formatCurrency(amount) {
  if (!amount) return 'Rp 0'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleDateString('id-ID')
}

function getRecommendationStatusColor(status) {
  switch (status) {
  case 'ACTIVE': return 'success'
  case 'DRAFT': return 'warning'
  case 'COMPLETED': return 'info'
  case 'CANCELLED': return 'error'
  default: return 'secondary'
  }
}

function getRecommendationStatusText(status) {
  switch (status) {
  case 'ACTIVE': return 'Aktif'
  case 'DRAFT': return 'Draft'
  case 'COMPLETED': return 'Selesai'
  case 'CANCELLED': return 'Dibatalkan'
  default: return status
  }
}

function getPriorityColor(priority) {
  switch (priority) {
  case 'HIGH': return 'error'
  case 'MEDIUM': return 'warning'
  case 'LOW': return 'success'
  case 'URGENT': return 'error'
  default: return 'secondary'
  }
}

function getPriorityText(priority) {
  switch (priority) {
  case 'HIGH': return 'Tinggi'
  case 'MEDIUM': return 'Sedang'
  case 'LOW': return 'Rendah'
  case 'URGENT': return 'Urgent'
  default: return priority
  }
}

function resetForm() {
  consultationForm.value = {
    diagnosis: '',
    treatment_plan: '',
    consultation_notes: '',
  }
  consultationFormRef.value?.reset()
}

function resetRecommendationForm() {
  const { validFrom, validUntilStr } = getDefaultDates()
  recommendationForm.value = {
    recommendation_type: 'TREATMENT_PLAN', // Always static
    priority_level: 'MEDIUM',
    status: 'COMPLETED', // Static value
    diagnosis_summary: '',
    treatment_goals: '',
    expected_outcomes: '',
    duration_weeks: 1,
    total_estimated_cost: 0, // Static value
    notes: '',
    valid_from: validFrom,
    valid_until: validUntilStr,
  }
  recommendationFormRef.value?.reset()
}

function resetRecommendationDetailsForm() {
  recommendationDetailsForm.value = {
    item_type: '',
    selectedTreatments: [],
    selectedProducts: [],
    sequence_order: 1,
    quantity: 1,
    frequency: '',
    duration_days: 30,
    unit_price: 0, // Static value
    instructions: '',
    contraindications: '',
    expected_results: '',
    is_required: true, // Will be converted to boolean in submission
  }
  recommendationDetailsFormRef.value?.reset()
}

async function submitConsultation() {
  // Show validation errors only on submit
  const isValid = await consultationFormRef.value?.validate()
  if (!isValid) return

  saving.value = true

  try {
    const requestData = {
      diagnosis: consultationForm.value.diagnosis,
      treatment_plan: consultationForm.value.treatment_plan,
      consultation_notes: consultationForm.value.consultation_notes,
    }

    console.log('📤 Submitting consultation data:', requestData)

    const res = await $api(`/rme/visit-consultations/${consultationId}`, {
      method: 'PATCH',
      body: requestData,
    })

    console.log('✅ Consultation submitted:', res.data)

    // Update local data
    consultation.value = { ...consultation.value, ...res.data }

    // Show success message
    await showSuccessAlert(
      'Konsultasi berhasil diperbarui',
      'Berhasil!'
    )

    // Redirect back to consultations list
    router.push({ name: 'transaction-consultations' })
  } catch (error) {
    console.error('❌ Error submitting consultation:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memperbarui Konsultasi',
      text: 'Tidak dapat memperbarui data konsultasi. Silakan coba lagi.',
    })
  } finally {
    saving.value = false
  }
}

async function completeConsultation() {
  if (!consultation.value) return

  completingConsultation.value = true

  try {
    // Get current date and time in Indonesian format
    const now = new Date()
    const indonesianDateTime = now.toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    
    // Convert to ISO string for API
    const requestData = {
      end_time: now.toISOString()
    }

    console.log('📤 Submitting consultation completion data:', requestData)
    console.log('📅 Indonesian format:', indonesianDateTime)

    const res = await $api(`/rme/visit-consultations/${consultationId}/status`, {
      method: 'PATCH',
      body: requestData,
    })

    console.log('✅ Consultation completed:', res.data)

    // Update local data
    consultation.value = { ...consultation.value, ...res.data }

    // Update billing status to forwarded_to_doctor
    try {
      // Get billing ID from consultation data or visit data
      let billingId = consultation.value.billing_id
      
      if (!billingId && visitData.value) {
        // Try to get billing ID from visit data
        billingId = visitData.value.billing_id
      }

      if (billingId) {
        console.log('📤 Updating billing status to forwarded_to_doctor:', billingId)
        
        const billingRes = await $api(`/transaction/billings/${billingId}`, {
          method: 'PATCH',
          body: {
            status: 'completed'
          },
        })

        console.log('✅ Billing status updated:', billingRes.data)
      } else {
        console.log('⚠️ No billing ID found, skipping billing update')
      }
    } catch (billingError) {
      console.error('❌ Error updating billing status:', billingError)
      // Don't show error alert for billing update failure, just log it
    }

    // Show success message with Indonesian date format
    await showSuccessAlert(
      `Konsultasi berhasil diselesaikan pada ${indonesianDateTime}`,
      'Berhasil!'
    )

    // Redirect back to consultations list
    router.push({ name: 'transaction-consultations' })
  } catch (error) {
    console.error('❌ Error completing consultation:', error)
    await showErrorAlert(error, {
      title: 'Gagal Menyelesaikan Konsultasi',
      text: 'Tidak dapat menyelesaikan konsultasi. Silakan coba lagi.',
    })
  } finally {
    completingConsultation.value = false
  }
}

async function submitRecommendation() {
  // Check if recommendation already exists
  if (existingRecommendations.value.length > 0) {
    await showErrorAlert(new Error('Rekomendasi treatment sudah ada untuk kunjungan ini'), {
      title: 'Tidak Dapat Membuat Rekomendasi',
      text: 'Hanya dapat dibuat 1 rekomendasi per kunjungan.',
    })
    return
  }

  // Show validation errors only on submit
  const isValid = await recommendationFormRef.value?.validate()
  if (!isValid) return

  savingRecommendation.value = true

  try {
    // Debug: Log the consultation data to see its structure
    console.log('🔍 Consultation data:', consultation.value)
    
    // Get consultation data to extract required fields
    const visitId = consultation.value?.visit_id || consultation.value?.visit?.id
    const doctorId = consultation.value?.doctor_id || consultation.value?.doctor?.id

    console.log('🔍 Consultation data:', { visitId, doctorId })

    if (!visitId) {
      throw new Error('Visit ID tidak ditemukan dalam data konsultasi')
    }

    // Get patient_id and branch_id from visit data
    let patientId = null
    let branchId = null

    if (visitData.value) {
      patientId = visitData.value.patient_id
      branchId = visitData.value.branch_id
    } else {
      // If visit data is not loaded, try to fetch it
      const visitDataResult = await fetchVisitData(visitId)
      if (visitDataResult) {
        patientId = visitDataResult.patient_id
        branchId = visitDataResult.branch_id
      }
    }

    console.log('🔍 Extracted IDs:', { visitId, patientId, doctorId, branchId })

    if (!patientId || !branchId) {
      throw new Error(`Data kunjungan tidak lengkap. Patient: ${patientId}, Branch: ${branchId}`)
    }

    const requestData = {
      visit_id: visitId,
      patient_id: patientId,
      doctor_id: doctorId,
      branch_id: branchId,
      is_active: true,
      recommendation_type: recommendationForm.value.recommendation_type,
      priority_level: recommendationForm.value.priority_level,
      status: recommendationForm.value.status,
      diagnosis_summary: recommendationForm.value.diagnosis_summary,
      treatment_goals: recommendationForm.value.treatment_goals,
      expected_outcomes: recommendationForm.value.expected_outcomes,
      duration_weeks: parseInt(recommendationForm.value.duration_weeks),
      total_estimated_cost: parseFloat(recommendationForm.value.total_estimated_cost),
      notes: recommendationForm.value.notes,
      valid_from: recommendationForm.value.valid_from,
      valid_until: recommendationForm.value.valid_until,
    }

    console.log('📤 Submitting recommendation data:', requestData)

    const res = await $api('/rme/visit-recommendations', {
      method: 'POST',
      body: requestData,
    })

    console.log('✅ Recommendation submitted:', res.data)

    // Show success message
    await showSuccessAlert(
      'Rekomendasi treatment berhasil dibuat',
      'Berhasil!'
    )

    // Refresh existing recommendations
    const currentVisitId = consultation.value?.visit_id || consultation.value?.visit?.id
    if (currentVisitId) {
      await fetchExistingRecommendations(currentVisitId)
    }

    // Reset form after successful submission
    resetRecommendationForm()
  } catch (error) {
    console.error('❌ Error submitting recommendation:', error)
    await showErrorAlert(error, {
      title: 'Gagal Membuat Rekomendasi',
      text: 'Tidak dapat membuat rekomendasi treatment. Silakan coba lagi.',
    })
  } finally {
    savingRecommendation.value = false
  }
}

async function submitRecommendationDetails() {
  // Show validation errors only on submit
  const isValid = await recommendationDetailsFormRef.value?.validate()
  if (!isValid) return

  savingRecommendationDetails.value = true

  try {
    // Get the first recommendation ID (assuming we're adding to the first recommendation)
    const recommendationId = existingRecommendations.value[0]?.id
    if (!recommendationId) {
      throw new Error('Tidak ada rekomendasi yang tersedia')
    }

    // Get selected items based on item type
    const selectedItems = recommendationDetailsForm.value.item_type === 'TREATMENT' 
      ? recommendationDetailsForm.value.selectedTreatments 
      : recommendationDetailsForm.value.selectedProducts

    if (!selectedItems || selectedItems.length === 0) {
      throw new Error('Pilih minimal satu item')
    }

    // Submit each selected item
    for (const itemId of selectedItems) {
      const requestData = {
        recommendation_id: recommendationId,
        item_type: recommendationDetailsForm.value.item_type,
        item_id: itemId,
        sequence_order: parseInt(recommendationDetailsForm.value.sequence_order),
        quantity: parseInt(recommendationDetailsForm.value.quantity),
        frequency: recommendationDetailsForm.value.frequency,
        duration_days: parseInt(recommendationDetailsForm.value.duration_days),
        unit_price: parseFloat(recommendationDetailsForm.value.unit_price),
        total_price: parseFloat(recommendationDetailsForm.value.unit_price) * parseInt(recommendationDetailsForm.value.quantity),
        instructions: recommendationDetailsForm.value.instructions,
        contraindications: recommendationDetailsForm.value.contraindications,
        expected_results: recommendationDetailsForm.value.expected_results,
        is_required: recommendationDetailsForm.value.is_required === true,
        is_active: true,
      }

      console.log('📤 Submitting recommendation detail:', requestData)

      const res = await $api('/rme/visit-recommendation-details', {
        method: 'POST',
        body: requestData,
      })

      console.log('✅ Recommendation detail submitted:', res.data)
    }

    // Show success message
    await showSuccessAlert(
      'Detail rekomendasi berhasil ditambahkan',
      'Berhasil!'
    )

    // Refresh recommendation details
    const currentRecommendationId = existingRecommendations.value[0]?.id
    if (currentRecommendationId) {
      await fetchRecommendationDetails(currentRecommendationId)
    }

    // Reset form after successful submission
    resetRecommendationDetailsForm()
  } catch (error) {
    console.error('❌ Error submitting recommendation details:', error)
    await showErrorAlert(error, {
      title: 'Gagal Menambahkan Detail Rekomendasi',
      text: 'Tidak dapat menambahkan detail rekomendasi. Silakan coba lagi.',
    })
  } finally {
    savingRecommendationDetails.value = false
  }
}

onMounted(() => {
  fetchConsultation()
  // Initialize recommendation form with default dates
  const { validFrom, validUntilStr } = getDefaultDates()
  recommendationForm.value.valid_from = validFrom
  recommendationForm.value.valid_until = validUntilStr
  
  // Load treatments and products for recommendation details
  loadTreatmentsForRecommendation()
  loadProductsForRecommendation()
})
</script> 

