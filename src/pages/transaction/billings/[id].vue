<route lang="yaml">
meta:
  layout: default
  navActiveLink: transaction-billings
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
          <VSkeletonLoader type="list-item-two-line@6" />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VSkeletonLoader type="list-item-two-line@6" />
        </VCol>
      </VRow>
    </VCardText>

    <VCardText v-else-if="billing">
      <!-- Header -->
      <div class="d-flex align-center gap-4 mb-6">
        <VAvatar
          size="72"
          color="primary"
        >
          <VIcon size="40">
            tabler-receipt
          </VIcon>
        </VAvatar>
        <div class="flex-grow-1">
          <h2 class="text-h4 font-weight-bold mb-1">
            Tagihan #{{ billing.billing_number || billing.id }}
          </h2>
          <div class="d-flex align-center gap-2">
            <VChip
              :color="getStatusColor(billing.status)"
              size="small"
            >
              {{ getStatusText(billing.status) }}
            </VChip>
            <VChip
              color="primary"
              size="small"
              variant="outlined"
            >
              {{ formatCurrency(billing.grand_total) }}
            </VChip>
          </div>
        </div>
      </div>

      <!-- Billing Information -->
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Billing Number
            </div>
            <div class="text-h6 font-weight-medium">
              {{ billing.billing_number || billing.id }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status
            </div>
            <VChip
              :color="getStatusColor(billing.status)"
              size="small"
              variant="tonal"
            >
              {{ getStatusText(billing.status) }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Dibuat
            </div>
            <div>{{ formatDateTime(billing.created_at) }}</div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Bayar
            </div>
            <div>{{ billing.paid_at ? formatDateTime(billing.paid_at) : '-' }}</div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Update
            </div>
            <div>{{ formatDateTime(billing.updated_at) }}</div>
          </div>
        </VCol>
      </VRow>

      <!-- Financial Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-calculator
        </VIcon>
        Informasi Keuangan
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="3"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Total Amount
            </div>
            <div class="text-h6">
              {{ formatCurrency(billing.total_amount) }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="3"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Discount Amount
            </div>
            <div class="text-h6 text-success">
              {{ formatCurrency(billing.discount_amount) }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="3"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tax Amount
            </div>
            <div class="text-h6 text-warning">
              {{ formatCurrency(billing.tax_amount) }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="3"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Grand Total
            </div>
            <div class="text-h5 font-weight-bold text-primary">
              {{ formatCurrency(billing.grand_total) }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Payment Summary -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon
          class="me-2"
          color="success"
        >
          tabler-credit-card
        </VIcon>
        Ringkasan Pembayaran
      </h3>
      
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VCard
            variant="outlined"
            class="pa-4"
          >
            <div class="d-flex align-center justify-space-between mb-3">
              <span class="text-medium-emphasis">Subtotal</span>
              <span class="font-weight-medium">{{ formatCurrency(billing.total_amount) }}</span>
            </div>
            <div class="d-flex align-center justify-space-between mb-3">
              <span class="text-medium-emphasis">Diskon</span>
              <span class="text-success font-weight-medium">-{{ formatCurrency(billing.discount_amount) }}</span>
            </div>
            <div class="d-flex align-center justify-space-between mb-3">
              <span class="text-medium-emphasis">Pajak</span>
              <span class="text-warning font-weight-medium">+{{ formatCurrency(billing.tax_amount) }}</span>
            </div>
            <VDivider class="my-3" />
            <div class="d-flex align-center justify-space-between">
              <span class="text-h6 font-weight-bold">Total</span>
              <span class="text-h6 font-weight-bold text-primary">{{ formatCurrency(billing.grand_total) }}</span>
            </div>
          </VCard>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <VCard
            variant="outlined"
            class="pa-4"
          >
            <div class="d-flex align-center justify-space-between mb-3">
              <span class="text-medium-emphasis">Status Pembayaran</span>
              <VChip
                :color="getStatusColor(billing.status)"
                size="small"
              >
                {{ getStatusText(billing.status) }}
              </VChip>
            </div>
            <div class="d-flex align-center justify-space-between mb-3">
              <span class="text-medium-emphasis">Tanggal Dibuat</span>
              <span class="font-weight-medium">{{ formatDate(billing.created_at) }}</span>
            </div>
            <div class="d-flex align-center justify-space-between mb-3">
              <span class="text-medium-emphasis">Tanggal Bayar</span>
              <span class="font-weight-medium">{{ billing.paid_at ? formatDate(billing.paid_at) : '-' }}</span>
            </div>
            <div class="d-flex align-center justify-space-between">
              <span class="text-medium-emphasis">Metode Pembayaran</span>
              <span class="font-weight-medium">{{ billing.payment_method_id }}</span>
            </div>
          </VCard>
        </VCol>
      </VRow>

      <!-- Consultation Details -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon
          class="me-2"
          color="info"
        >
          tabler-message-circle
        </VIcon>
        Detail Konsultasi
      </h3>
      
      <div v-if="loadingConsultations" class="text-center pa-4">
        <VProgressCircular indeterminate color="primary" />
        <p class="text-sm text-medium-emphasis mt-2">Memuat data konsultasi...</p>
      </div>
      
      <div v-else-if="consultations.length > 0">
        <VRow>
          <VCol
            v-for="(consultation, index) in consultations"
            :key="consultation.id"
            cols="12"
            md="6"
          >
            <VCard
              variant="outlined"
              class="pa-4"
            >
              <div class="d-flex align-center justify-space-between mb-3">
                <span class="text-h6 font-weight-medium">Konsultasi #{{ index + 1 }}</span>
                <VChip
                  :color="getConsultationTypeColor(consultation.consultation_type)"
                  size="small"
                >
                  {{ getConsultationTypeText(consultation.consultation_type) }}
                </VChip>
              </div>
              
              <!-- Doctor Information -->
              <div class="mb-4" v-if="consultation.doctor">
                <div class="d-flex align-center gap-2 mb-2">
                  <VIcon size="16" color="primary">tabler-user-md</VIcon>
                  <span class="text-sm font-weight-medium text-primary">Doctor</span>
                </div>
                <div class="pa-3 bg-primary-subtle rounded">
                  <div class="font-weight-medium">{{ consultation.doctor.name }}</div>
                  <div class="text-sm text-medium-emphasis">{{ consultation.doctor.specialization }}</div>
                  <div class="text-xs text-disabled">{{ consultation.doctor.license_number }}</div>
                </div>
              </div>
              
              <VDivider class="mb-3" />
              
              <!-- Service Information -->
              <div class="mb-4" v-if="consultation.service">
                <div class="d-flex align-center gap-2 mb-2">
                  <VIcon size="16" color="info">tabler-stethoscope</VIcon>
                  <span class="text-sm font-weight-medium text-info">Service</span>
                </div>
                <div class="pa-3 bg-info-subtle rounded">
                  <div class="font-weight-medium">{{ consultation.service.name }}</div>
                  <div class="text-sm text-medium-emphasis">{{ consultation.service.code }}</div>
                  <div class="text-xs text-disabled">{{ consultation.service.service_type }}</div>
                  <div class="text-xs text-medium-emphasis mt-1">{{ consultation.service.description }}</div>
                  <div class="text-xs text-disabled mt-1">Duration: {{ consultation.service.duration_minutes }} minutes</div>
                </div>
              </div>
              
              <VDivider class="mb-3" />
              
              
              <div class="mb-3">
                <div class="text-medium-emphasis mb-1">Consultation Fee</div>
                <div class="text-h6 font-weight-bold text-primary">{{ formatCurrency(consultation.fee) }}</div>
              </div>
              
              <div class="mb-3">
                <div class="text-medium-emphasis mb-1">Start Time</div>
                <div class="font-weight-medium">{{ formatDateTime(consultation.start_time) }}</div>
              </div>
              
              <div class="mb-3" v-if="consultation.end_time">
                <div class="text-medium-emphasis mb-1">End Time</div>
                <div class="font-weight-medium">{{ formatDateTime(consultation.end_time) }}</div>
              </div>
              
              <!-- Visit Information -->
              <VDivider class="my-3" />
              <div v-if="consultation.visit">
                <div class="text-medium-emphasis mb-2">Visit Information</div>
                <div class="mb-2">
                  <span class="text-medium-emphasis">Patient ID:</span>
                  <span class="font-weight-medium ms-2">{{ consultation.visit.patient_id }}</span>
                </div>
                <div class="mb-2">
                  <span class="text-medium-emphasis">Visit Type:</span>
                  <span class="font-weight-medium ms-2">{{ getVisitTypeText(consultation.visit.visit_type) }}</span>
                </div>
                <div class="mb-2">
                  <span class="text-medium-emphasis">Status:</span>
                  <VChip
                    :color="getVisitStatusColor(consultation.visit.status)"
                    size="small"
                    class="ms-2"
                  >
                    {{ getVisitStatusText(consultation.visit.status) }}
                  </VChip>
                </div>
                <div>
                  <span class="text-medium-emphasis">Visit Date:</span>
                  <span class="font-weight-medium ms-2">{{ formatDate(consultation.visit.visit_date) }}</span>
                </div>
              </div>
            </VCard>
          </VCol>
        </VRow>
      </div>
      
      <div v-else class="text-center pa-4">
        <VIcon
          icon="tabler-message-circle"
          size="48"
          color="disabled"
          class="mb-3"
        />
        <p class="text-medium-emphasis">Tidak ada data konsultasi untuk tagihan ini</p>
      </div>

      <!-- Recommendation Details -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon
          class="me-2"
          color="warning"
        >
          tabler-clipboard-list
        </VIcon>
        Rekomendasi Tindakan/Produk
      </h3>
      
      <div v-if="loadingVisitRecommendations" class="text-center pa-4">
        <VProgressCircular indeterminate color="primary" />
        <p class="text-sm text-medium-emphasis mt-2">Memuat data rekomendasi...</p>
      </div>
      
      <div v-else-if="visitRecommendations.length > 0">
        <div v-for="(recommendation, index) in visitRecommendations" :key="recommendation.id">
          <!-- Recommendation Header -->
          <VCard variant="outlined" class="mb-6">
            <VCardTitle class="pa-4 pb-2">
              <div class="d-flex align-center justify-space-between">
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
            </VCardTitle>
            
            <VCardText class="pa-4 pt-0">
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
                                  {{ detail.treatment?.name || detail.product?.name || `Item ${detail.item_id}` }}
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
                                  {{ detail.treatment?.code || detail.product?.sku || detail.item_id }}
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
                              <div v-if="detail.treatment?.description || detail.product?.description" class="bg-light-info rounded pa-3">
                                <div class="d-flex align-center gap-2 mb-2">
                                  <VIcon size="16" color="info">
                                    tabler-info-circle
                                  </VIcon>
                                  <h6 class="text-caption font-weight-medium mb-0">
                                    Deskripsi
                                  </h6>
                                </div>
                                <p class="text-body-2 mb-0">{{ detail.treatment?.description || detail.product?.description }}</p>
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
                                <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                  <span class="text-caption text-medium-emphasis">Harga Satuan</span>
                                  <span class="text-body-2 font-weight-medium text-success">{{ formatCurrency(detail.unit_price) }}</span>
                                </div>

                                <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                  <span class="text-caption text-medium-emphasis">Total Harga</span>
                                  <span class="text-body-2 font-weight-medium text-primary">{{ formatCurrency(detail.total_price) }}</span>
                                </div>

                                <!-- Treatment-specific details -->
                                <div v-if="detail.item_type === 'TREATMENT' && detail.treatment">
                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Durasi Treatment</span>
                                    <span class="text-body-2 font-weight-medium">{{ detail.treatment.duration_minutes }} menit</span>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Waktu Persiapan</span>
                                    <span class="text-body-2 font-weight-medium">{{ detail.treatment.preparation_time_minutes }} menit</span>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Waktu Recovery</span>
                                    <span class="text-body-2 font-weight-medium">{{ detail.treatment.recovery_time_minutes }} menit</span>
                                  </div>

                                  <div v-if="detail.treatment.contraindications" class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Kontraindikasi</span>
                                    <span class="text-body-2 font-weight-medium text-warning">{{ detail.treatment.contraindications }}</span>
                                  </div>

                                  <div v-if="detail.treatment.side_effects" class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Efek Samping</span>
                                    <span class="text-body-2 font-weight-medium text-warning">{{ detail.treatment.side_effects }}</span>
                                  </div>

                                  <div v-if="detail.treatment.aftercare_instructions" class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Instruksi Aftercare</span>
                                    <span class="text-body-2 font-weight-medium text-success">{{ detail.treatment.aftercare_instructions }}</span>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Butuh Konsultasi</span>
                                    <VChip
                                      :color="detail.treatment.requires_consultation ? 'warning' : 'success'"
                                      size="x-small"
                                      label
                                    >
                                      {{ detail.treatment.requires_consultation ? 'Ya' : 'Tidak' }}
                                    </VChip>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Butuh Dokter</span>
                                    <VChip
                                      :color="detail.treatment.requires_doctor ? 'warning' : 'success'"
                                      size="x-small"
                                      label
                                    >
                                      {{ detail.treatment.requires_doctor ? 'Ya' : 'Tidak' }}
                                    </VChip>
                                  </div>

                                  <div v-if="detail.treatment.age_restriction_min" class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Batas Usia</span>
                                    <span class="text-body-2 font-weight-medium">{{ detail.treatment.age_restriction_min }}+ tahun</span>
                                  </div>
                                </div>

                                <!-- Product-specific details -->
                                <div v-if="detail.item_type === 'PRODUCT' && detail.product">
                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Brand</span>
                                    <span class="text-body-2 font-weight-medium">{{ detail.product.brand }}</span>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Tipe Produk</span>
                                    <span class="text-body-2 font-weight-medium">{{ detail.product.product_type }}</span>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Unit</span>
                                    <span class="text-body-2 font-weight-medium">{{ detail.product.unit_of_measure }}</span>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Berat</span>
                                    <span class="text-body-2 font-weight-medium">{{ detail.product.weight_grams }} gram</span>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Min Stock</span>
                                    <span class="text-body-2 font-weight-medium">{{ detail.product.min_stock_level }}</span>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Max Stock</span>
                                    <span class="text-body-2 font-weight-medium">{{ detail.product.max_stock_level }}</span>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Reorder Point</span>
                                    <span class="text-body-2 font-weight-medium">{{ detail.product.reorder_point }}</span>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Shelf Life</span>
                                    <span class="text-body-2 font-weight-medium">{{ detail.product.shelf_life_days }} hari</span>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Storage</span>
                                    <span class="text-body-2 font-weight-medium">{{ detail.product.storage_requirement }}</span>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Butuh Resep</span>
                                    <VChip
                                      :color="detail.product.is_prescription_required ? 'warning' : 'success'"
                                      size="x-small"
                                      label
                                    >
                                      {{ detail.product.is_prescription_required ? 'Ya' : 'Tidak' }}
                                    </VChip>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Serialized</span>
                                    <VChip
                                      :color="detail.product.is_serialized ? 'warning' : 'success'"
                                      size="x-small"
                                      label
                                    >
                                      {{ detail.product.is_serialized ? 'Ya' : 'Tidak' }}
                                    </VChip>
                                  </div>

                                  <div class="d-flex align-center justify-space-between py-2 border-bottom">
                                    <span class="text-caption text-medium-emphasis">Batch Tracked</span>
                                    <VChip
                                      :color="detail.product.is_batch_tracked ? 'warning' : 'success'"
                                      size="x-small"
                                      label
                                    >
                                      {{ detail.product.is_batch_tracked ? 'Ya' : 'Tidak' }}
                                    </VChip>
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
            </VCardText>
          </VCard>

          <!-- Divider between recommendations -->
          <VDivider v-if="index < visitRecommendations.length - 1" class="my-6" />
        </div>
      </div>
      
      <div v-else class="text-center pa-4">
        <VIcon
          icon="tabler-clipboard-list"
          size="48"
          color="disabled"
          class="mb-3"
        />
        <p class="text-medium-emphasis">Tidak ada data rekomendasi untuk tagihan ini</p>
      </div>

      <!-- Treatment Details -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon
          class="me-2"
          color="info"
        >
          tabler-stethoscope
        </VIcon>
        Detail Treatment
      </h3>
      
      <div v-if="loadingTreatments" class="text-center pa-4">
        <VProgressCircular indeterminate color="primary" />
        <p class="text-sm text-medium-emphasis mt-2">Memuat data treatment...</p>
      </div>
      
      <div v-else-if="treatments.length > 0">
        <VRow>
          <VCol
            v-for="(treatment, index) in treatments"
            :key="treatment.id"
            cols="12"
            md="6"
          >
            <VCard
              variant="outlined"
              class="pa-4"
            >
              <div class="d-flex align-center justify-space-between mb-3">
                <span class="text-h6 font-weight-medium">Treatment #{{ index + 1 }}</span>
                <VChip
                  color="primary"
                  size="small"
                >
                  {{ treatment.quantity }}x
                </VChip>
              </div>
              
              <!-- Doctor and Therapist Information -->
              <div class="mb-4">
                <div class="d-flex gap-3">
                  <!-- Doctor Info -->
                  <div class="flex-grow-1">
                    <div class="d-flex align-center gap-2 mb-2">
                      <VIcon size="16" color="primary">tabler-user-md</VIcon>
                      <span class="text-sm font-weight-medium text-primary">Doctor</span>
                    </div>
                    <div class="pa-3 bg-primary-subtle rounded">
                      <div class="font-weight-medium">{{ treatment.doctor?.name || 'N/A' }}</div>
                      <div class="text-sm text-medium-emphasis">{{ treatment.doctor?.specialization || '' }}</div>
                      <div class="text-xs text-disabled">{{ treatment.doctor?.license_number || '' }}</div>
                    </div>
                  </div>
                  
                  <!-- Therapist Info -->
                  <div class="flex-grow-1">
                    <div class="d-flex align-center gap-2 mb-2">
                      <VIcon size="16" color="success">tabler-user</VIcon>
                      <span class="text-sm font-weight-medium text-success">Therapist</span>
                    </div>
                    <div class="pa-3 bg-success-subtle rounded">
                      <div class="font-weight-medium">{{ treatment.therapist?.name || 'N/A' }}</div>
                      <div class="text-sm text-medium-emphasis">{{ treatment.therapist?.specialization || '' }}</div>
                      <div class="text-xs text-disabled">{{ treatment.therapist?.license_number || '' }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <VDivider class="mb-3" />
              
              <div class="mb-3">
                <div class="text-medium-emphasis mb-1">Doctor</div>
                <div class="font-weight-medium">{{ treatment.doctor?.name || 'N/A' }}</div>
                <div class="text-sm text-medium-emphasis">{{ treatment.doctor?.specialization || '' }}</div>
                <div class="text-xs text-disabled">{{ treatment.doctor?.license_number || '' }}</div>
              </div>
              
              <div class="mb-3">
                <div class="text-medium-emphasis mb-1">Therapist</div>
                <div class="font-weight-medium">{{ treatment.therapist?.name || 'N/A' }}</div>
                <div class="text-sm text-medium-emphasis">{{ treatment.therapist?.specialization || '' }}</div>
                <div class="text-xs text-disabled">{{ treatment.therapist?.license_number || '' }}</div>
              </div>
              
              <div class="mb-3">
                <div class="text-medium-emphasis mb-1">Unit Price</div>
                <div class="font-weight-medium text-success">{{ formatCurrency(treatment.unit_price) }}</div>
              </div>
              
              <div class="mb-3">
                <div class="text-medium-emphasis mb-1">Total Price</div>
                <div class="text-h6 font-weight-bold text-primary">{{ formatCurrency(treatment.total_price) }}</div>
              </div>
              
              <div class="mb-3" v-if="treatment.treatment_notes">
                <div class="text-medium-emphasis mb-1">Notes</div>
                <div class="font-weight-medium">{{ treatment.treatment_notes }}</div>
              </div>
              
              <div class="mb-3">
                <div class="text-medium-emphasis mb-1">Performed At</div>
                <div class="font-weight-medium">{{ formatDateTime(treatment.performed_at) }}</div>
              </div>
              
              <div class="mb-3" v-if="treatment.completed_at">
                <div class="text-medium-emphasis mb-1">Completed At</div>
                <div class="font-weight-medium">{{ formatDateTime(treatment.completed_at) }}</div>
              </div>
              
              <!-- Visit Information -->
              <VDivider class="my-3" />
              <div v-if="treatment.visit">
                <div class="text-medium-emphasis mb-2">Visit Information</div>
                <div class="mb-2">
                  <span class="text-medium-emphasis">Visit Number:</span>
                  <span class="font-weight-medium ms-2">{{ treatment.visit.visit_number }}</span>
                </div> 
                <div>
                  <span class="text-medium-emphasis">Visit Date:</span>
                  <span class="font-weight-medium ms-2">{{ formatDate(treatment.visit.visit_date) }}</span>
                </div>
              </div>
            </VCard>
          </VCol>
        </VRow>
      </div>
      
      <div v-else class="text-center pa-4">
        <VIcon
          icon="tabler-stethoscope"
          size="48"
          color="disabled"
          class="mb-3"
        />
        <p class="text-medium-emphasis">Tidak ada data treatment untuk tagihan ini</p>
      </div>
    </VCardText>

    <VCardText v-else>
      <VAlert
        type="error"
        variant="tonal"
      >
        <VAlertTitle>Data Tidak Ditemukan</VAlertTitle>
        <div>Tagihan dengan ID tersebut tidak ditemukan atau telah dihapus.</div>
        <template #append>
          <VBtn
            size="small"
            variant="outlined"
            :to="{ name: 'transaction-billings' }"
          >
            Kembali ke Daftar
          </VBtn>
        </template>
      </VAlert>
    </VCardText>
  </VCard>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert } from '@/utils/errorHandler'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const billing = ref(null)
const treatments = ref([])
const consultations = ref([])
const visitConsultations = ref([])
const visitRecommendations = ref([])
const recommendationDetails = ref([])
const loading = ref(true)
const loadingTreatments = ref(false)
const loadingConsultations = ref(false)
const loadingVisitConsultations = ref(false)
const loadingVisitRecommendations = ref(false)
const loadingRecommendationDetails = ref(false)

async function fetchBilling() {
  loading.value = true
  try {
    const res = await $api(`/transaction/billings/${route.params.id}`)
    billing.value = res.data
  } catch (e) {
    console.error('Error fetching billing:', e)
    await showErrorAlert(e, {
      title: 'Gagal Memuat Data Tagihan',
      text: 'Tidak dapat memuat detail tagihan. Silakan coba lagi.',
    })
    billing.value = null
  } finally {
    loading.value = false
  }
}

async function fetchTreatments() {
  loadingTreatments.value = true
  try {
    const res = await $api(`/rme/visit-treatments/billing/${route.params.id}`)
    treatments.value = res.data || []
  } catch (e) {
    console.error('Error fetching treatments:', e)
    await showErrorAlert(e, {
      title: 'Gagal Memuat Data Treatment',
      text: 'Tidak dapat memuat detail treatment. Silakan coba lagi.',
    })
    treatments.value = []
  } finally {
    loadingTreatments.value = false
  }
}

async function fetchConsultations() {
  loadingConsultations.value = true
  try {
    // First get the billing to get visit_id
    if (billing.value && billing.value.visit_id) {
      const res = await $api(`/rme/visit-consultations/by-visit/${billing.value.visit_id}`)
      consultations.value = res.data || []
    } else {
      // Fallback to billing-based endpoint if visit_id is not available
      const res = await $api(`/rme/visit-consultations/billing/${route.params.id}`)
      consultations.value = res.data || []
    }
  } catch (e) {
    console.error('Error fetching consultations:', e)
    await showErrorAlert(e, {
      title: 'Gagal Memuat Data Konsultasi',
      text: 'Tidak dapat memuat detail konsultasi. Silakan coba lagi.',
    })
    consultations.value = []
  } finally {
    loadingConsultations.value = false
  }
}



async function fetchVisitConsultations() {
  loadingVisitConsultations.value = true
  try {
    // Get visit_id from billing data first
    if (billing.value && billing.value.visit_id) {
      const res = await $api(`/rme/visit-consultations/by-visit/${billing.value.visit_id}`)
      visitConsultations.value = res.data || []
    }
  } catch (e) {
    console.error('Error fetching visit consultations:', e)
    await showErrorAlert(e, {
      title: 'Gagal Memuat Data Konsultasi Visit',
      text: 'Tidak dapat memuat detail konsultasi visit. Silakan coba lagi.',
    })
    visitConsultations.value = []
  } finally {
    loadingVisitConsultations.value = false
  }
}

async function fetchVisitRecommendations() {
  loadingVisitRecommendations.value = true
  try {
    // Get visit_id from billing data first
    if (billing.value && billing.value.visit_id) {
      const res = await $api(`/rme/visit-recommendations/visit/${billing.value.visit_id}`)
      visitRecommendations.value = res.data || []
      
      // After getting visit recommendations, fetch details for each recommendation
      if (visitRecommendations.value.length > 0) {
        await fetchRecommendationDetails()
      }
    }
  } catch (e) {
    console.error('Error fetching visit recommendations:', e)
    await showErrorAlert(e, {
      title: 'Gagal Memuat Data Rekomendasi Visit',
      text: 'Tidak dapat memuat detail rekomendasi visit. Silakan coba lagi.',
    })
    visitRecommendations.value = []
  } finally {
    loadingVisitRecommendations.value = false
  }
}

async function fetchRecommendationDetails() {
  loadingRecommendationDetails.value = true
  try {
    // Get all recommendation details for all visit recommendations
    const allDetails = []
    
    for (const recommendation of visitRecommendations.value) {
      const res = await $api(`/rme/visit-recommendation-details/recommendation/${recommendation.id}`)
      if (res.data && res.data.length > 0) {
        allDetails.push(...res.data)
      }
    }
    
    recommendationDetails.value = allDetails
    console.log('✅ Recommendation details loaded:', recommendationDetails.value)
    
    return allDetails
  } catch (e) {
    console.error('Error fetching recommendation details:', e)
    await showErrorAlert(e, {
      title: 'Gagal Memuat Data Detail Rekomendasi',
      text: 'Tidak dapat memuat detail rekomendasi. Silakan coba lagi.',
    })
    recommendationDetails.value = []
  } finally {
    loadingRecommendationDetails.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleDateString('id-ID')
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
    maximumFractionDigits: 0,
  }).format(amount)
}

function getStatusColor(status) {
  switch (status) {
  case 'paid': return 'success'
  case 'unpaid': return 'warning'
  case 'draft': return 'secondary'
  default: return 'secondary'
  }
}

function getStatusText(status) {
  switch (status) {
  case 'paid': return 'Lunas'
  case 'unpaid': return 'Belum Lunas'
  case 'draft': return 'Draft'
  default: return status
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

function getVisitTypeColor(type) {
  switch (type) {
  case 'INITIAL': return 'primary'
  case 'FOLLOW_UP': return 'success'
  case 'EMERGENCY': return 'error'
  default: return 'secondary'
  }
}

function getVisitTypeText(type) {
  switch (type) {
  case 'INITIAL': return 'Kunjungan Awal'
  case 'FOLLOW_UP': return 'Kunjungan Lanjutan'
  case 'EMERGENCY': return 'Kunjungan Darurat'
  default: return type
  }
}

function getVisitStatusColor(status) {
  switch (status) {
  case 'COMPLETED': return 'success'
  case 'IN_PROGRESS': return 'warning'
  case 'CANCELLED': return 'error'
  case 'SCHEDULED': return 'info'
  default: return 'secondary'
  }
}

function getVisitStatusText(status) {
  switch (status) {
  case 'COMPLETED': return 'Selesai'
  case 'IN_PROGRESS': return 'Sedang Berlangsung'
  case 'CANCELLED': return 'Dibatalkan'
  case 'SCHEDULED': return 'Terjadwal'
  default: return status
  }
}

function getItemTypeColor(type) {
  switch (type) {
  case 'TREATMENT': return 'primary'
  case 'PRODUCT': return 'success'
  case 'CONSULTATION': return 'info'
  default: return 'secondary'
  }
}

function getItemTypeText(type) {
  switch (type) {
  case 'TREATMENT': return 'Treatment'
  case 'PRODUCT': return 'Produk'
  case 'CONSULTATION': return 'Konsultasi'
  default: return type
  }
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

// Get recommendation details for a specific recommendation
function getRecommendationDetails(recommendationId) {
  return recommendationDetails.value.filter(detail => detail.recommendation_id === recommendationId)
}

onMounted(async () => {
  await fetchBilling()
  // Fetch consultations after billing is loaded to get visit_id
  if (billing.value) {
    await fetchConsultations()
    await fetchVisitRecommendations()
  }
  await fetchTreatments()
})
</script> 
