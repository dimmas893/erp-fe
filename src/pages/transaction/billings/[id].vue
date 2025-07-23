<route lang="yaml">
meta:
  layout: default
  navActiveLink: transaction-billings
</route>

<template>
  <VCard>
    <VProgressLinear v-if="loading" indeterminate color="primary" />

    <!-- Breadcrumb Navigation -->
    <VCardText class="pb-0">
      <VBreadcrumbs :items="breadcrumbItems" divider="tabler-chevron-right">
        <template #title="{ item }">
          <span :class="{ 'text-primary font-weight-medium': item.active }">
            {{ item.title }}
          </span>
        </template>
      </VBreadcrumbs>
    </VCardText>

    <VCardTitle class="d-flex align-center gap-3">
      <VIcon size="24" color="primary">
        tabler-receipt
      </VIcon>
      <span>Detail Tagihan</span>
    </VCardTitle>

    <VCardText v-if="loading">
      <!-- Loading skeleton -->
      <div class="d-flex align-center gap-4 mb-6">
        <VSkeleton type="avatar" size="72" />
        <div class="flex-grow-1">
          <VSkeleton type="heading" class="mb-2" />
          <VSkeleton type="chip" width="80" />
        </div>
      </div>
      
      <VRow>
        <VCol cols="12" md="6">
          <VSkeletonLoader type="list-item-two-line@6" />
        </VCol>
        <VCol cols="12" md="6">
          <VSkeletonLoader type="list-item-two-line@6" />
        </VCol>
      </VRow>
    </VCardText>

    <VCardText v-else-if="billing">
      <!-- Header Information -->
      <div class="d-flex align-center gap-4 mb-6">
        <VAvatar size="72" color="primary">
          <VIcon size="40">
            tabler-receipt
          </VIcon>
        </VAvatar>
        <div class="flex-grow-1">
          <h2 class="text-h4 font-weight-bold mb-1">
            {{ billing.billing_number || billing.id }}
          </h2>
          <div class="d-flex align-center gap-2">
            <VChip :color="getStatusColor(billing.status)" size="small">
              {{ getStatusText(billing.status) }}
            </VChip>
            <VChip color="primary" size="small" variant="outlined">
              {{ formatCurrency(billing.grand_total) }}
            </VChip>
          </div>
        </div>

        <VBtn color="secondary" variant="outlined" prepend-icon="tabler-arrow-left" @click="goBack">
          Kembali
        </VBtn>

        <VBtn 
          v-if="billing.status !== 'close'"
          color="warning" 
              variant="outlined"
          prepend-icon="tabler-stethoscope"
          @click="continueTreatmentFromBilling"
        >
          Lanjutkan Treatment
        </VBtn>
        <VBtn v-if="billing.status !== 'close'" color="success" prepend-icon="tabler-credit-card"
          @click="processPayment">
          Proses Pembayaran
        </VBtn>

        <VBtn color="primary" prepend-icon="tabler-printer" @click="printBilling">
          Cetak Tagihan
        </VBtn>
      </div>

      <!-- Billing Status Card -->
      <div class="billing-status mb-6">
        <VCard variant="outlined" class="pa-4" :color="getBillingStatusColor()">
          <div class="d-flex align-center gap-4">
            <VIcon size="48" :color="getBillingStatusIconColor()">
              {{ getBillingStatusIcon() }}
              </VIcon>
            <div class="flex-grow-1">
              <h5 class="text-h6 font-weight-medium mb-2">
                {{ getBillingStatusTitle() }}
              </h5>
              <p class="text-body-2 mb-0">
                {{ getBillingStatusDescription() }}
              </p>
            </div>
            <VChip :color="getBillingStatusChipColor()" size="large" class="font-weight-bold">
              {{ getBillingStatusText() }}
            </VChip>
          </div>
            </VCard>
      </div>

      <!-- Billing Details -->
      <VDivider class="my-6" />
      
      <VRow>
        <!-- Basic Information -->
        <VCol cols="12" md="6">
          <VCard variant="outlined" class="pa-4">
            <VCardTitle class="d-flex align-center gap-2 mb-4">
              <VIcon color="primary">
                tabler-info-circle
              </VIcon>
              Informasi Tagihan
            </VCardTitle>
            
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Nomor Tagihan:</span>
                <span class="info-value">{{ billing.billing_number || billing.id }}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Status:</span>
                <VChip :color="getStatusColor(billing.status)" size="small">
                  {{ getStatusText(billing.status) }}
                </VChip>
              </div>
              
              <div class="info-item">
                <span class="info-label">Tanggal Dibuat:</span>
                <span class="info-value">{{ formatDate(billing.created_at) }}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Tanggal Update:</span>
                <span class="info-value">{{ formatDate(billing.updated_at) }}</span>
              </div>
              
              <div v-if="billing.paid_at" class="info-item">
                <span class="info-label">Tanggal Bayar:</span>
                <span class="info-value">{{ formatDate(billing.paid_at) }}</span>
              </div>
            </div>
          </VCard>
        </VCol>

        <!-- Financial Information -->
        <VCol cols="12" md="6">
          <VCard variant="outlined" class="pa-4">
            <VCardTitle class="d-flex align-center gap-2 mb-4">
              <VIcon color="success">
                tabler-calculator
              </VIcon>
              Informasi Keuangan
            </VCardTitle>
            
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Total Amount:</span>
                <span class="info-value">{{ formatCurrency(billing.total_amount) }}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Discount:</span>
                <span class="info-value">{{ formatCurrency(billing.discount_amount) }}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Tax:</span>
                <span class="info-value">{{ formatCurrency(billing.tax_amount) }}</span>
              </div>
              
              <VDivider class="my-3" />
              
              <div class="info-item grand-total">
                <span class="info-label">Grand Total:</span>
                <span class="info-value">{{ formatCurrency(billing.grand_total) }}</span>
              </div>
            </div>
          </VCard>
        </VCol>
      </VRow>

      <!-- Consultation Details -->
      <div v-if="billing.visit_consultations && billing.visit_consultations.length > 0">
        <VDivider class="my-6" />
        <h5 class="text-h6 font-weight-medium mb-4">Detail Konsultasi</h5>
        
        <VRow>
          <VCol v-for="consultation in billing.visit_consultations" :key="consultation.id" cols="12">
            <VCard variant="outlined" class="pa-4">
              <!-- Doctor Information -->
              <div class="d-flex align-center gap-3 mb-4">
                <VAvatar size="64" color="primary">
                  <VIcon size="32">
                  tabler-user-md
                </VIcon>
                </VAvatar>
                <div class="flex-grow-1">
                  <h6 class="text-h6 font-weight-bold mb-1">
                    {{ consultation.doctor?.name || 'Dokter' }}
                  </h6>
                  <p class="text-subtitle-2 text-medium-emphasis mb-1">
                    {{ consultation.doctor?.specialization || 'Spesialisasi' }}
                  </p>
                  <div class="d-flex gap-2 flex-wrap">
                    <VChip size="small" color="info" variant="outlined">
                      {{ consultation.doctor?.license_number || 'N/A' }}
                    </VChip>
                    <VChip size="small" color="success" variant="outlined">
                      {{ consultation.doctor?.experience_years || 0 }} tahun pengalaman
                    </VChip>
                  </div>
                </div>
                <div class="text-right">
                  <VChip color="primary" size="large">
                    {{ formatCurrency(consultation.fee) }}
                  </VChip>
                </div>
              </div>
              
              <VDivider class="my-4" />
              
              <!-- Service Information -->
              <div class="mb-4">
                <h6 class="text-subtitle-1 font-weight-medium mb-3">Informasi Layanan</h6>
                <VRow>
                  <VCol cols="12" md="6">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Layanan:</span>
                  <span class="info-value">{{ consultation.service?.name || 'N/A' }}</span>
                </div>
                
                <div class="info-item">
                        <span class="info-label">Kode Layanan:</span>
                        <span class="info-value">{{ consultation.service?.code || 'N/A' }}</span>
                </div>
                
                <div class="info-item">
                        <span class="info-label">Tipe Layanan:</span>
                        <span class="info-value">{{ consultation.service?.service_type || 'N/A' }}</span>
                      </div>

                      <div class="info-item">
                        <span class="info-label">Durasi:</span>
                        <span class="info-value">{{ consultation.service?.duration_minutes || 0 }} menit</span>
                      </div>
                    </div>
                  </VCol>

                  <VCol cols="12" md="6">
                    <div class="info-grid">
                      <div class="info-item">
                        <span class="info-label">Tipe Konsultasi:</span>
                        <span class="info-value">{{ consultation.consultation_type }}</span>
                </div>
                
                <div class="info-item">
                  <span class="info-label">Waktu Mulai:</span>
                  <span class="info-value">{{ formatDateTime(consultation.start_time) }}</span>
                </div>
                
                <div v-if="consultation.end_time" class="info-item">
                  <span class="info-label">Waktu Selesai:</span>
                  <span class="info-value">{{ formatDateTime(consultation.end_time) }}</span>
                      </div> 
                    </div>
                  </VCol>
                </VRow>
              </div>

              <!-- Medical Information -->
              <div v-if="consultation.diagnosis || consultation.treatment_plan || consultation.consultation_notes">
                <VDivider class="my-4" />
                <h6 class="text-subtitle-1 font-weight-medium mb-3">Informasi Medis</h6>

                <VRow>
                  <VCol cols="12" md="4" v-if="consultation.diagnosis">
                    <VCard variant="outlined" class="pa-3">
                      <div class="d-flex align-center gap-2 mb-2">
                        <VIcon size="20" color="error">
                          tabler-stethoscope
                        </VIcon>
                        <h6 class="text-subtitle-2 font-weight-medium mb-0">Diagnosis</h6>
                      </div>
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{ consultation.diagnosis }}
                      </p>
                    </VCard>
                  </VCol>

                  <VCol cols="12" md="4" v-if="consultation.treatment_plan">
                    <VCard variant="outlined" class="pa-3">
                      <div class="d-flex align-center gap-2 mb-2">
                        <VIcon size="20" color="info">
                          tabler-clipboard-list
                        </VIcon>
                        <h6 class="text-subtitle-2 font-weight-medium mb-0">Rencana Treatment</h6>
                      </div>
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{ consultation.treatment_plan }}
                      </p>
                    </VCard>
                  </VCol>

                  <VCol cols="12" md="4" v-if="consultation.consultation_notes">
                    <VCard variant="outlined" class="pa-3">
                      <div class="d-flex align-center gap-2 mb-2">
                        <VIcon size="20" color="warning">
                          tabler-notes
                        </VIcon>
                        <h6 class="text-subtitle-2 font-weight-medium mb-0">Catatan Konsultasi</h6>
                      </div>
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{ consultation.consultation_notes }}
                      </p>
                    </VCard>
                  </VCol>
                </VRow>
              </div>

              <!-- Doctor Contact Information -->
              <VDivider class="my-4" />
              <div class="d-flex gap-4 flex-wrap">
                <div class="d-flex align-center gap-2">
                  <VIcon size="16" color="primary">
                    tabler-phone
                  </VIcon>
                  <span class="text-body-2">{{ consultation.doctor?.phone || 'N/A' }}</span>
                </div>

                <div class="d-flex align-center gap-2">
                  <VIcon size="16" color="primary">
                    tabler-mail
                  </VIcon>
                  <span class="text-body-2">{{ consultation.doctor?.email || 'N/A' }}</span>
                </div>

                <div class="d-flex align-center gap-2">
                  <VIcon size="16" color="primary">
                    tabler-map-pin
                  </VIcon>
                  <span class="text-body-2">{{ consultation.doctor?.address || 'N/A' }}</span>
                </div>
              </div>
            </VCard>
          </VCol>
        </VRow>
      </div>

      <!-- Recommendations -->
      <div v-if="billing.visit_recommendations && billing.visit_recommendations.length > 0">
        <VDivider class="my-6" />
        <h5 class="text-h6 font-weight-medium mb-4">Rekomendasi</h5>
        
        <VRow>
          <VCol v-for="recommendation in billing.visit_recommendations" :key="recommendation.id" cols="12">
            <VCard variant="outlined" class="pa-4">
              <!-- Recommendation Header -->
              <div class="d-flex align-center gap-3 mb-4">
                <VAvatar size="64" color="info">
                  <VIcon size="32">
                  tabler-clipboard-list
                </VIcon>
                </VAvatar>
                <div class="flex-grow-1">
                  <h6 class="text-h6 font-weight-bold mb-1">
                    {{ recommendation.recommendation_number }}
                  </h6>
                  <p class="text-subtitle-2 text-medium-emphasis mb-1">
                    {{ recommendation.recommendation_type }}
                  </p>
                  <div class="d-flex gap-2 flex-wrap">
                    <VChip size="small" :color="getRecommendationStatusColor(recommendation.status)" variant="outlined">
                      {{ recommendation.status }}
                    </VChip>
                    <VChip size="small" color="warning" variant="outlined">
                      {{ recommendation.priority_level }}
                    </VChip>
                    <VChip size="small" color="info" variant="outlined">
                      {{ recommendation.duration_weeks }} minggu
                    </VChip>
                  </div>
                </div>
                <div class="text-right">
                  <VChip color="success" size="large">
                    {{ formatCurrency(recommendation.total_estimated_cost) }}
                  </VChip>
                </div>
              </div>

              <VDivider class="my-4" />

              <!-- Doctor Information -->
              <div class="mb-4">
                <h6 class="text-subtitle-1 font-weight-medium mb-3">Dokter</h6>
                <div class="d-flex align-center gap-3">
                  <VAvatar size="48" color="primary">
                    <VIcon size="24">
                      tabler-user-md
                    </VIcon>
                  </VAvatar>
                <div>
                  <h6 class="text-subtitle-1 font-weight-bold mb-1">
                      {{ recommendation.doctor?.name || 'Dokter' }}
                  </h6>
                  <p class="text-caption text-medium-emphasis mb-0">
                      {{ recommendation.doctor?.specialization || 'Spesialisasi' }}
                  </p>
                  </div>
                </div>
              </div>
              
              <!-- Recommendation Details -->
              <div class="mb-4">
                <h6 class="text-subtitle-1 font-weight-medium mb-3">Detail Rekomendasi</h6>
                <VRow>
                  <VCol cols="12" md="6">
                    <div class="info-grid">
                      <div class="info-item">
                        <span class="info-label">Tipe:</span>
                        <span class="info-value">{{ recommendation.recommendation_type }}</span>
                      </div>

                      <div class="info-item">
                        <span class="info-label">Prioritas:</span>
                        <VChip :color="getPriorityColor(recommendation.priority_level)" size="small">
                          {{ recommendation.priority_level }}
                        </VChip>
                      </div>

                      <div class="info-item">
                        <span class="info-label">Durasi:</span>
                        <span class="info-value">{{ recommendation.duration_weeks }} minggu</span>
                      </div>

                      <div class="info-item">
                        <span class="info-label">Valid Dari:</span>
                        <span class="info-value">{{ formatDate(recommendation.valid_from) }}</span>
                      </div>

                      <div class="info-item">
                        <span class="info-label">Valid Sampai:</span>
                        <span class="info-value">{{ formatDate(recommendation.valid_until) }}</span>
                      </div>
                    </div>
                  </VCol>

                  <VCol cols="12" md="6">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Status:</span>
                        <VChip :color="getRecommendationStatusColor(recommendation.status)" size="small">
                    {{ recommendation.status }}
                  </VChip>
                </div>

                      <div class="info-item">
                        <span class="info-label">Total Biaya:</span>
                        <span class="info-value">{{ formatCurrency(recommendation.total_estimated_cost) }}</span>
                </div>
                
                <div class="info-item">
                  <span class="info-label">Dibuat:</span>
                  <span class="info-value">{{ formatDate(recommendation.created_at) }}</span>
                </div>

                      <div class="info-item">
                        <span class="info-label">Update:</span>
                        <span class="info-value">{{ formatDate(recommendation.updated_at) }}</span>
                      </div>
                    </div>
                  </VCol>
                </VRow>
              </div>

              <!-- Medical Information -->
              <div
                v-if="recommendation.diagnosis_summary || recommendation.treatment_goals || recommendation.expected_outcomes || recommendation.notes">
                <VDivider class="my-4" />
                <h6 class="text-subtitle-1 font-weight-medium mb-3">Informasi Medis</h6>

                <VRow>
                  <VCol cols="12" md="6" v-if="recommendation.diagnosis_summary">
                    <VCard variant="outlined" class="pa-3">
                      <div class="d-flex align-center gap-2 mb-2">
                        <VIcon size="20" color="error">
                          tabler-stethoscope
                        </VIcon>
                        <h6 class="text-subtitle-2 font-weight-medium mb-0">Ringkasan Diagnosis</h6>
                      </div>
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{ recommendation.diagnosis_summary }}
                      </p>
                    </VCard>
                  </VCol>

                  <VCol cols="12" md="6" v-if="recommendation.treatment_goals">
                    <VCard variant="outlined" class="pa-3">
                      <div class="d-flex align-center gap-2 mb-2">
                        <VIcon size="20" color="info">
                          tabler-target
                        </VIcon>
                        <h6 class="text-subtitle-2 font-weight-medium mb-0">Tujuan Treatment</h6>
                      </div>
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{ recommendation.treatment_goals }}
                      </p>
                    </VCard>
                  </VCol>

                  <VCol cols="12" md="6" v-if="recommendation.expected_outcomes">
                    <VCard variant="outlined" class="pa-3">
                      <div class="d-flex align-center gap-2 mb-2">
                        <VIcon size="20" color="success">
                          tabler-chart-line
                        </VIcon>
                        <h6 class="text-subtitle-2 font-weight-medium mb-0">Hasil yang Diharapkan</h6>
                      </div>
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{ recommendation.expected_outcomes }}
                      </p>
                    </VCard>
                  </VCol>

                  <VCol cols="12" md="6" v-if="recommendation.notes">
                    <VCard variant="outlined" class="pa-3">
                      <div class="d-flex align-center gap-2 mb-2">
                        <VIcon size="20" color="warning">
                          tabler-notes
                        </VIcon>
                        <h6 class="text-subtitle-2 font-weight-medium mb-0">Catatan</h6>
                      </div>
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{ recommendation.notes }}
                      </p>
                    </VCard>
                  </VCol>
                </VRow>
              </div>

              <!-- Recommendation Details -->
              <div v-if="getRecommendationDetails(recommendation.id).length > 0">
                <VDivider class="my-4" />
                <h6 class="text-subtitle-1 font-weight-medium mb-3">Item Rekomendasi</h6>

                <VCard variant="outlined">
                  <VCardText>
                    <VTable>
                      <thead>
                        <tr>
                          <th>Urutan</th>
                          <th>Tipe</th>
                          <th>Item</th>
                          <th>Jumlah</th>
                          <th>Frekuensi</th>
                          <th>Durasi</th>
                          <th>Wajib</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="detail in getRecommendationDetails(recommendation.id)" :key="detail.id">
                          <td>{{ detail.sequence_order }}</td>
                          <td>
                            <VChip :color="detail.item_type === 'TREATMENT' ? 'warning' : 'info'" size="small">
                              {{ detail.item_type }}
                            </VChip>
                          </td>
                          <td>
                            <div>
                              <strong>{{ getItemName(detail) }}</strong>
                              <p class="text-caption text-medium-emphasis mb-0">
                                {{ getItemDescription(detail) }}
                              </p>
                            </div>
                          </td>
                          <td>{{ detail.quantity }}</td>
                          <td>{{ detail.frequency }}</td>
                          <td>{{ detail.duration_days }} hari</td>
                          <td>
                            <VChip :color="detail.is_required ? 'success' : 'secondary'" size="small">
                              {{ detail.is_required ? 'Ya' : 'Tidak' }}
                            </VChip>
                          </td>
                          <td>
                            <VChip :color="detail.is_active ? 'success' : 'error'" size="small">
                              {{ detail.is_active ? 'Aktif' : 'Nonaktif' }}
                            </VChip>
                          </td>
                        </tr>
                      </tbody>
                    </VTable>
                  </VCardText>
                </VCard>
              </div>
            </VCard>
          </VCol>
        </VRow>
      </div>

      <!-- Treatments -->
      <div v-if="billing.visit_treatments && billing.visit_treatments.length > 0">
        <VDivider class="my-6" />
        <h5 class="text-h6 font-weight-medium mb-4">Treatment</h5>
        
        <VRow>
          <VCol v-for="treatment in billing.visit_treatments" :key="treatment.id" cols="12">
            <VCard variant="outlined" class="pa-4">
              <!-- Treatment Header -->
              <div class="d-flex align-center gap-3 mb-4">
                <VAvatar size="64" color="warning">
                  <VIcon size="32">
                  tabler-stethoscope
                </VIcon>
                </VAvatar>
                <div class="flex-grow-1">
                  <h6 class="text-h6 font-weight-bold mb-1">
                    {{ treatment.treatment?.name || 'Treatment' }}
                  </h6>
                  <p class="text-subtitle-2 text-medium-emphasis mb-1">
                    {{ treatment.treatment?.description || 'Deskripsi treatment' }}
                  </p>
                  <div class="d-flex gap-2 flex-wrap">
                    <VChip size="small" color="info" variant="outlined">
                      {{ treatment.treatment?.code || 'N/A' }}
                    </VChip>
                    <VChip size="small" color="success" variant="outlined">
                      {{ formatCurrency(treatment.total_price) }}
                    </VChip>
                  </div>
                </div>
                <div class="text-right">
                  <VChip color="warning" size="large">
                    {{ formatCurrency(treatment.total_price) }}
                  </VChip>
                </div>
              </div>

              <VDivider class="my-4" />

              <!-- Staff Information -->
              <div class="mb-4">
                <h6 class="text-subtitle-1 font-weight-medium mb-3">Staff</h6>
                <VRow>
                  <VCol cols="12" md="6">
                    <div class="d-flex align-center gap-3">
                      <VAvatar size="48" color="primary">
                        <VIcon size="24">
                          tabler-user-md
                        </VIcon>
                      </VAvatar>
                <div>
                  <h6 class="text-subtitle-1 font-weight-bold mb-1">
                          {{ treatment.doctor?.name || 'Dokter' }}
                  </h6>
                  <p class="text-caption text-medium-emphasis mb-0">
                          {{ treatment.doctor?.specialization || 'Spesialisasi' }}
                  </p>
                </div>
              </div>
                  </VCol>

                  <VCol cols="12" md="6">
                    <div class="d-flex align-center gap-3">
                      <VAvatar size="48" color="info">
                        <VIcon size="24">
                          tabler-user
                        </VIcon>
                      </VAvatar>
                      <div>
                        <h6 class="text-subtitle-1 font-weight-bold mb-1">
                          {{ treatment.therapist?.name || 'Terapis' }}
                        </h6>
                        <p class="text-caption text-medium-emphasis mb-0">
                          {{ treatment.therapist?.specialization || 'Spesialisasi' }}
                        </p>
                      </div>
                    </div>
                  </VCol>
                </VRow>
              </div>

              <!-- Treatment Details -->
              <div class="mb-4">
                <h6 class="text-subtitle-1 font-weight-medium mb-3">Detail Treatment</h6>
                <VRow>
                  <VCol cols="12" md="6">
              <div class="info-grid">
                <div class="info-item">
                        <span class="info-label">Nama Treatment:</span>
                        <span class="info-value">{{ treatment.treatment?.name || 'N/A' }}</span>
                </div>
                
                <div class="info-item">
                        <span class="info-label">Kode Treatment:</span>
                        <span class="info-value">{{ treatment.treatment?.code || 'N/A' }}</span>
                </div>
                
                <div class="info-item">
                        <span class="info-label">Jumlah:</span>
                        <span class="info-value">{{ treatment.quantity }}</span>
                </div>

                      <div class="info-item">
                        <span class="info-label">Harga Satuan:</span>
                        <span class="info-value">{{ formatCurrency(treatment.unit_price) }}</span>
              </div>

                      <div class="info-item">
                        <span class="info-label">Total Harga:</span>
                        <span class="info-value">{{ formatCurrency(treatment.total_price) }}</span>
                      </div>
                    </div>
                  </VCol>

                  <VCol cols="12" md="6">
                    <div class="info-grid">  
                      <div class="info-item">
                        <span class="info-label">Waktu Mulai:</span>
                        <span class="info-value">{{ formatDateTime(treatment.performed_at) }}</span>
                      </div>

                      <div class="info-item">
                        <span class="info-label">Waktu Selesai:</span>
                        <span class="info-value">{{ formatDateTime(treatment.completed_at) }}</span>
                      </div>

                      <div class="info-item">
                        <span class="info-label">Durasi:</span>
                        <span class="info-value">{{ calculateTreatmentDuration(treatment.performed_at, treatment.completed_at) }}</span>
                      </div>
                    </div>
                  </VCol>
                </VRow>
              </div>

              <!-- Treatment Notes -->
              <div v-if="treatment.treatment_notes">
                <VDivider class="my-4" />
                <h6 class="text-subtitle-1 font-weight-medium mb-3">Catatan Treatment</h6>
                <VCard variant="outlined" class="pa-3">
                  <div class="d-flex align-center gap-2 mb-2">
                    <VIcon size="20" color="warning">
                      tabler-notes
                    </VIcon>
                    <h6 class="text-subtitle-2 font-weight-medium mb-0">Catatan</h6>
                  </div>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    {{ treatment.treatment_notes }}
                  </p>
                </VCard>
              </div>

              <!-- Treatment Information (if available) -->
              <div v-if="treatment.treatment">
                <VDivider class="my-4" />
                <h6 class="text-subtitle-1 font-weight-medium mb-3">Informasi Treatment</h6>

                <VRow>
                  <VCol cols="12" md="4" v-if="treatment.treatment.duration_minutes">
                    <VCard variant="outlined" class="pa-3">
                      <div class="d-flex align-center gap-2 mb-2">
                        <VIcon size="20" color="info">
                          tabler-clock
                        </VIcon>
                        <h6 class="text-subtitle-2 font-weight-medium mb-0">Durasi</h6>
                      </div>
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{ treatment.treatment.duration_minutes }} menit
                      </p>
                    </VCard>
                  </VCol>

                  <VCol cols="12" md="4" v-if="treatment.treatment.preparation_time_minutes">
                    <VCard variant="outlined" class="pa-3">
                      <div class="d-flex align-center gap-2 mb-2">
                        <VIcon size="20" color="warning">
                          tabler-tools
                        </VIcon>
                        <h6 class="text-subtitle-2 font-weight-medium mb-0">Waktu Persiapan</h6>
                      </div>
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{ treatment.treatment.preparation_time_minutes }} menit
                      </p>
                    </VCard>
                  </VCol>

                  <VCol cols="12" md="4" v-if="treatment.treatment.recovery_time_minutes">
                    <VCard variant="outlined" class="pa-3">
                      <div class="d-flex align-center gap-2 mb-2">
                        <VIcon size="20" color="success">
                          tabler-heart
                        </VIcon>
                        <h6 class="text-subtitle-2 font-weight-medium mb-0">Waktu Pemulihan</h6>
                      </div>
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{ treatment.treatment.recovery_time_minutes }} menit
                      </p>
            </VCard>
          </VCol>
        </VRow>

                <!-- Medical Information -->
                <VRow v-if="treatment.treatment.contraindications || treatment.treatment.side_effects || treatment.treatment.aftercare_instructions">
                  <VCol cols="12" md="4" v-if="treatment.treatment.contraindications">
                    <VCard variant="outlined" class="pa-3">
                      <div class="d-flex align-center gap-2 mb-2">
                        <VIcon size="20" color="error">
                          tabler-alert-triangle
                        </VIcon>
                        <h6 class="text-subtitle-2 font-weight-medium mb-0">Kontraindikasi</h6>
                      </div>
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{ treatment.treatment.contraindications }}
                      </p>
                    </VCard>
                  </VCol>

                  <VCol cols="12" md="4" v-if="treatment.treatment.side_effects">
                    <VCard variant="outlined" class="pa-3">
                      <div class="d-flex align-center gap-2 mb-2">
                        <VIcon size="20" color="warning">
                          tabler-alert-circle
                        </VIcon>
                        <h6 class="text-subtitle-2 font-weight-medium mb-0">Efek Samping</h6>
                      </div>
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{ treatment.treatment.side_effects }}
                      </p>
                    </VCard>
                  </VCol>

                  <VCol cols="12" md="4" v-if="treatment.treatment.aftercare_instructions">
                    <VCard variant="outlined" class="pa-3">
                      <div class="d-flex align-center gap-2 mb-2">
                        <VIcon size="20" color="success">
                          tabler-stethoscope
                        </VIcon>
                        <h6 class="text-subtitle-2 font-weight-medium mb-0">Instruksi Perawatan</h6>
                      </div>
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{ treatment.treatment.aftercare_instructions }}
                      </p>
                    </VCard>
                  </VCol>
                </VRow>
              </div>

              <!-- Timestamps -->
              <VDivider class="my-4" />
              <div class="d-flex gap-4 flex-wrap">
                <div class="d-flex align-center gap-2">
                  <VIcon size="16" color="primary">
                    tabler-calendar
                  </VIcon>
                  <span class="text-body-2">Dibuat: {{ formatDateTime(treatment.created_at) }}</span>
                </div>

                <div class="d-flex align-center gap-2">
                  <VIcon size="16" color="primary">
                    tabler-edit
                  </VIcon>
                  <span class="text-body-2">Update: {{ formatDateTime(treatment.updated_at) }}</span>
                </div>
              </div>
            </VCard>
          </VCol>
        </VRow>
      </div>

      <!-- Billing Items -->
      <div v-if="billing.billing_items && billing.billing_items.length > 0">
        <VDivider class="my-6" />
        <h5 class="text-h6 font-weight-medium mb-4">Item Tagihan</h5>
        
        <VCard variant="outlined">
          <VCardText>
            <VTable>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Deskripsi</th>
                  <th>Jumlah</th>
                  <th>Harga</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in billing.billing_items" :key="item.id">
                  <td>{{ item.item_name }}</td>
                  <td>{{ item.description }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ formatCurrency(item.unit_price) }}</td>
                  <td>{{ formatCurrency(item.total_price) }}</td>
                </tr>
              </tbody>
            </VTable>
          </VCardText>
        </VCard>
      </div>

      <!-- Payment History -->
      <div v-if="billing.billing_payments && billing.billing_payments.length > 0">
        <VDivider class="my-6" />
        <h5 class="text-h6 font-weight-medium mb-4">Riwayat Pembayaran</h5>
        
        <VRow>
          <VCol v-for="payment in billing.billing_payments" :key="payment.id" cols="12" md="6">
            <VCard variant="outlined" class="pa-4">
              <div class="d-flex align-center gap-3 mb-3">
                <VIcon size="24" color="success">
                  tabler-credit-card
                </VIcon>
                <div>
                  <h6 class="text-subtitle-1 font-weight-bold mb-1">
                    Pembayaran #{{ payment.id }}
                  </h6>
                  <p class="text-caption text-medium-emphasis mb-0">
                    {{ payment.payment_method?.name || 'Metode Pembayaran' }}
                  </p>
                </div>
              </div>
              
              <VDivider class="my-3" />
              
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Jumlah:</span>
                  <span class="info-value">{{ formatCurrency(payment.amount) }}</span>
                </div>
                
                <div class="info-item">
                  <span class="info-label">Status:</span>
                  <VChip :color="getPaymentStatusColor(payment.status)" size="small">
                    {{ payment.status }}
                  </VChip>
                </div>
                
                <div class="info-item">
                  <span class="info-label">Tanggal:</span>
                  <span class="info-value">{{ formatDate(payment.created_at) }}</span>
                </div>
              </div>
            </VCard>
          </VCol>
        </VRow>
      </div>

    </VCardText>

    <VCardText v-else>
      <div class="text-center pa-8">
        <VIcon size="64" color="error" class="mb-4">
          tabler-alert-circle
        </VIcon>
        <h4 class="text-h5 font-weight-medium mb-2">Tagihan Tidak Ditemukan</h4>
        <p class="text-medium-emphasis mb-4">
          Tagihan dengan ID yang diberikan tidak ditemukan atau telah dihapus.
        </p>
        <VBtn color="primary" prepend-icon="tabler-arrow-left" @click="goBack">
          Kembali ke Daftar Tagihan
        </VBtn>
      </div>
    </VCardText>
  </VCard>

  <!-- Confirmation Dialog -->
  <VDialog v-model="showConfirmDialog" max-width="400" persistent>
    <VCard>
      <VCardTitle class="text-h6">
        {{ confirmDialogTitle }}
      </VCardTitle>

      <VCardText>
        {{ confirmDialogText }}
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn color="secondary" variant="outlined" @click="showConfirmDialog = false">
          Batal
        </VBtn>
        <VBtn color="primary" @click="() => { confirmDialogAction(); showConfirmDialog = false }">
          Ya, Lanjutkan
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Payment Dialog -->
  <VDialog v-model="showPaymentDialog" max-width="1200" persistent>
    <VCard>
      <VCardTitle class="text-h6 d-flex align-center gap-2">
        <VIcon color="primary">
          tabler-credit-card
        </VIcon>
        Proses Pembayaran
      </VCardTitle>

      <VCardText>
        <!-- Detailed Billing Information -->
        <div class="mb-4">
          <h6 class="text-subtitle-1 font-weight-medium mb-3">Detail Tagihan</h6>
          <VRow>
            <VCol cols="12" md="6">
              <VCard variant="outlined" class="pa-3">
                <div class="d-flex flex-column gap-2">
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Nomor Tagihan:</span>
                    <span class="text-body-2 font-weight-medium">{{ billing?.billing_number || billing?.id }}</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Status:</span>
                    <VChip :color="getStatusColor(billing?.status)" size="small">
                      {{ getStatusText(billing?.status) }}
                    </VChip>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Tanggal Dibuat:</span>
                    <span class="text-body-2 font-weight-medium">{{ formatDateTime(billing?.created_at) }}</span>
                  </div>
                  <!-- <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Pasien:</span>
                    <span class="text-body-2 font-weight-medium">{{ billing?.visit?.patient?.name || 'N/A' }}</span>
                  </div> -->
                </div>
              </VCard>
            </VCol>
            
            <VCol cols="12" md="6">
              <VCard variant="outlined" class="pa-3">
                <div class="d-flex flex-column gap-2">
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Total Amount:</span>
                    <span class="text-body-2 font-weight-medium">{{ formatCurrency(billing?.total_amount) }}</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Discount:</span>
                    <span class="text-body-2 font-weight-medium">{{ formatCurrency(billing?.discount_amount) }}</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Tax:</span>
                    <span class="text-body-2 font-weight-medium">{{ formatCurrency(billing?.tax_amount) }}</span>
                  </div>
                  <VDivider class="my-2" />
                  <div class="d-flex justify-space-between">
                    <span class="text-subtitle-2 font-weight-bold">Grand Total:</span>
                    <span class="text-subtitle-2 font-weight-bold text-primary">
                      {{ formatCurrency(billing?.grand_total) }}
                    </span>
                  </div>
                </div>
              </VCard>
            </VCol>
          </VRow>
        </div>

        <VDivider class="my-4" />

        <!-- Promo Selection -->
        <div class="mb-4">
          <h6 class="text-subtitle-1 font-weight-medium mb-3">Pilih Promo (Opsional)</h6>
          
          <div v-if="loadingPromos" class="text-center py-4">
            <VProgressCircular indeterminate color="warning" />
            <p class="text-body-2 text-medium-emphasis mt-2">
              Memuat promo...
            </p>
          </div>
          
          <VSelect
            v-else
            v-model="selectedPromo"
            :items="promos"
            item-title="name"
            item-value="id"
            variant="outlined"
            placeholder="Pilih promo (opsional)"
            hide-details="auto"
            prepend-inner-icon="tabler-tag"
            clearable
            @update:model-value="handlePromoSelection"
          >
            <template #item="{ props, item }">
              <VListItem v-bind="props">
                <template #prepend>
                  <VIcon color="warning" size="20">
                    tabler-tag
                  </VIcon>
                </template>
                <VListItemTitle>{{ item.raw.name }}</VListItemTitle>
                <VListItemSubtitle>
                  {{ item.raw.description }} - Min. pembelian: {{ formatCurrency(item.raw.min_purchase) }}
                </VListItemSubtitle>
              </VListItem>
            </template>
          </VSelect>
          
          <!-- Available Promos List -->
          <!-- <div v-if="promos.length > 0 && !selectedPromo" class="mt-3">
            <h6 class="text-subtitle-2 font-weight-medium mb-2">Promo Tersedia:</h6>
            <VRow>
              <VCol v-for="promo in promos" :key="promo.id" cols="12" md="6">
                <VCard variant="outlined" class="pa-3 promo-card" @click="handlePromoSelection(promo.id)">
                  <div class="d-flex align-center gap-3">
                    <VIcon color="warning" size="24">
                      tabler-tag
                    </VIcon>
                    <div class="flex-grow-1">
                      <h6 class="text-subtitle-2 font-weight-medium mb-1">{{ promo.name }}</h6>
                      <p class="text-caption text-medium-emphasis mb-1">{{ promo.description }}</p>
                      <div class="d-flex gap-2 flex-wrap">
                        <VChip size="x-small" color="success" variant="outlined">
                          {{ promo.discount_type === 'percentage' ? `${promo.discount_value}%` : formatCurrency(promo.discount_value) }}
                        </VChip>
                        <VChip size="x-small" color="info" variant="outlined">
                          Min: {{ formatCurrency(promo.min_purchase) }}
                        </VChip>
                        <VChip size="x-small" color="warning" variant="outlined">
                          {{ promo.usage_limit - promo.used_count }} tersisa
                        </VChip>
                      </div>
                    </div>
                  </div>
                </VCard>
              </VCol>
            </VRow>
          </div> -->
        </div>

        <!-- Promo Details -->
        <div v-if="selectedPromo" class="mb-4">
          <h6 class="text-subtitle-1 font-weight-medium mb-3">Detail Promo Terpilih</h6>
          <VCard variant="outlined" color="warning" class="pa-4">
            <VRow>
              <VCol cols="12" md="6">
                <div class="d-flex flex-column gap-3">
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Nama Promo:</span>
                    <span class="text-body-2 font-weight-medium">{{ selectedPromo.name }}</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Kode Promo:</span>
                    <span class="text-body-2 font-weight-medium">{{ selectedPromo.code }}</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Deskripsi:</span>
                    <span class="text-body-2 font-weight-medium">{{ selectedPromo.description }}</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Tipe Diskon:</span>
                    <VChip size="small" color="success">
                      {{ selectedPromo.discount_type === 'percentage' ? 'Persentase' : 'Nominal' }}
                    </VChip>
                  </div>
                </div>
              </VCol>
              
              <VCol cols="12" md="6">
                <div class="d-flex flex-column gap-3">
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Nilai Diskon:</span>
                    <span class="text-body-2 font-weight-medium text-success">
                      {{ selectedPromo.discount_type === 'percentage' ? `${selectedPromo.discount_value}%` : formatCurrency(selectedPromo.discount_value) }}
                    </span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Min. Pembelian:</span>
                    <span class="text-body-2 font-weight-medium">{{ formatCurrency(selectedPromo.min_purchase) }}</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Kuota Tersisa:</span>
                    <VChip size="small" color="info">
                      {{ selectedPromo.usage_limit - selectedPromo.used_count }} / {{ selectedPromo.usage_limit }}
                    </VChip>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Periode:</span>
                    <span class="text-body-2 font-weight-medium">
                      {{ formatDate(selectedPromo.start_date) }} - {{ formatDate(selectedPromo.end_date) }}
                    </span>
                  </div>
                </div>
              </VCol>
            </VRow>
            
            <VDivider class="my-4" />
            
            <div class="d-flex flex-column gap-2">
              <div class="d-flex justify-space-between">
                <span class="text-body-2 text-medium-emphasis">Total Awal:</span>
                <span class="text-body-2 font-weight-medium">{{ formatCurrency(billing?.grand_total) }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-body-2 text-medium-emphasis">Potongan Promo:</span>
                <span class="text-body-2 font-weight-medium text-success">
                  -{{ formatCurrency(promoDiscount) }}
                </span>
              </div>
              <VDivider class="my-2" />
              <div class="d-flex justify-space-between">
                <span class="text-subtitle-2 font-weight-bold">Total Setelah Promo:</span>
                <span class="text-subtitle-2 font-weight-bold text-success">
                  {{ formatCurrency(billing?.grand_total - promoDiscount) }}
                </span>
              </div>
            </div>
          </VCard>
        </div>

        <VDivider class="my-4" />

        <!-- Tax Type Selection -->
        <div class="mb-4">
          <h6 class="text-subtitle-1 font-weight-medium mb-3">Pilih Jenis Pajak (Opsional)</h6>
          
          <div v-if="loadingTaxTypes" class="text-center py-4">
            <VProgressCircular indeterminate color="error" />
            <p class="text-body-2 text-medium-emphasis mt-2">
              Memuat jenis pajak...
            </p>
          </div>
          
          <VSelect
            v-else
            v-model="selectedTaxType"
            :items="taxTypes"
            item-title="tax_name"
            item-value="id"
            variant="outlined"
            placeholder="Pilih jenis pajak (opsional)"
            hide-details="auto"
            prepend-inner-icon="tabler-receipt-tax"
            clearable
            @update:model-value="handleTaxTypeSelection"
          />
        </div>

        <!-- Tax Rate Selection -->
        <div v-if="selectedTaxType && taxRates.length > 0" class="mb-4">
          <h6 class="text-subtitle-1 font-weight-medium mb-3">Pilih Tarif Pajak</h6>
          
          <div v-if="loadingTaxRates" class="text-center py-4">
            <VProgressCircular indeterminate color="error" />
            <p class="text-body-2 text-medium-emphasis mt-2">
              Memuat tarif pajak...
            </p>
          </div>
          
          <VSelect
            v-else
            v-model="selectedTaxRate"
            :items="taxRates"
            item-title="rate_name"
            item-value="id"
            variant="outlined"
            placeholder="Pilih tarif pajak"
            hide-details="auto"
            prepend-inner-icon="tabler-percentage"
            clearable
            @update:model-value="handleTaxRateSelection"
          >
            <template #item="{ props, item }">
              <VListItem v-bind="props">
                <template #prepend>
                  <VIcon color="error" size="20">
                    tabler-percentage
                  </VIcon>
                </template>
                <VListItemTitle>{{ item.raw.rate_name }}</VListItemTitle>
                <VListItemSubtitle>
                  {{ item.raw.rate_percentage }}% - {{ item.raw.calculation_method }}
                </VListItemSubtitle>
              </VListItem>
            </template>
          </VSelect>
        </div>

        <!-- Tax Details -->
        <div v-if="selectedTaxRate" class="mb-4">
          <h6 class="text-subtitle-1 font-weight-medium mb-3">Detail Pajak Terpilih</h6>
          <VCard variant="outlined" color="error" class="pa-4">
            <VRow>
              <VCol cols="12" md="6">
                <div class="d-flex flex-column gap-3">
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Jenis Pajak:</span>
                    <span class="text-body-2 font-weight-medium">{{ selectedTaxType.tax_name }}</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Kode Pajak:</span>
                    <span class="text-body-2 font-weight-medium">{{ selectedTaxType.tax_code }}</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Kategori:</span>
                    <span class="text-body-2 font-weight-medium">{{ selectedTaxType.tax_category }}</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Deskripsi:</span>
                    <span class="text-body-2 font-weight-medium">{{ selectedTaxType.description }}</span>
                  </div>
                </div>
              </VCol>
              
              <VCol cols="12" md="6">
                <div class="d-flex flex-column gap-3">
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Tarif Pajak:</span>
                    <span class="text-body-2 font-weight-medium text-error">
                      {{ selectedTaxRate.rate_percentage }}%
                    </span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Metode Kalkulasi:</span>
                    <span class="text-body-2 font-weight-medium">{{ selectedTaxRate.calculation_method }}</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Berlaku Untuk:</span>
                    <span class="text-body-2 font-weight-medium">{{ selectedTaxRate.applicable_to }}</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2 text-medium-emphasis">Tanggal Berlaku:</span>
                    <span class="text-body-2 font-weight-medium">{{ formatDate(selectedTaxRate.effective_from) }}</span>
                  </div>
                </div>
              </VCol>
            </VRow>
            
            <VDivider class="my-4" />
            
            <div class="d-flex flex-column gap-2">
              <div class="d-flex justify-space-between">
                <span class="text-body-2 text-medium-emphasis">Total Setelah Promo:</span>
                <span class="text-body-2 font-weight-medium">{{ formatCurrency(billing?.grand_total - promoDiscount) }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-body-2 text-medium-emphasis">{{ selectedTaxType.tax_name }} ({{ selectedTaxRate.rate_percentage }}%):</span>
                <span class="text-body-2 font-weight-medium text-error">
                  +{{ formatCurrency(calculatedTax) }}
                </span>
              </div>
              <VDivider class="my-2" />
              <div class="d-flex justify-space-between">
                <span class="text-subtitle-2 font-weight-bold">Total Final:</span>
                <span class="text-subtitle-2 font-weight-bold text-error">
                  {{ formatCurrency(calculateFinalAmount) }}
                </span>
              </div>
            </div>
          </VCard>
        </div>

        <VDivider class="my-4" />

        <!-- Payment Method Selection -->
        <div class="mb-4">
          <!-- <h6 class="text-subtitle-1 font-weight-medium mb-3">Pilih Metode Pembayaran *</h6> -->
          
          <!-- <div v-if="loadingPaymentMethods" class="text-center py-4">
            <VProgressCircular indeterminate color="primary" />
            <p class="text-body-2 text-medium-emphasis mt-2">
              Memuat metode pembayaran...
            </p>
          </div>
          
          <VSelect
            v-else
            v-model="selectedPaymentMethod"
            :items="paymentMethods"
            item-title="method_name"
            item-value="id"
            variant="outlined"
            placeholder="Pilih metode pembayaran"
            :rules="[v => !!v || 'Metode pembayaran harus dipilih']"
            hide-details="auto"
            prepend-inner-icon="tabler-credit-card"
          >
            <template #item="{ props, item }">
              <VListItem v-bind="props">
                <template #prepend>
                  <VIcon :color="getPaymentMethodColor(item.raw.method_code)" size="20">
                    {{ getPaymentMethodIcon(item.raw.method_code) }}
                  </VIcon>
                </template>
                <VListItemTitle>{{ item.raw.method_name }}</VListItemTitle>
                <VListItemSubtitle>{{ item.raw.description }}</VListItemSubtitle>
              </VListItem>
            </template>
          </VSelect> -->
          
          <!-- Available Payment Methods -->
          <div v-if="paymentMethods.length > 0" class="mt-3">
            <h6 class="text-subtitle-2 font-weight-medium mb-2">Metode Pembayaran Tersedia:</h6>
            <VRow>
              <VCol v-for="method in paymentMethods" :key="method.id" cols="12" md="4">
                <VCard 
                  variant="outlined" 
                  class="pa-3 payment-method-card"
                  :class="{ 'selected-method': selectedPaymentMethod === method.id }"
                  @click="selectedPaymentMethod = method.id"
                >
                  <div class="text-center">
                    <VIcon :color="getPaymentMethodColor(method.method_code)" size="32" class="mb-2">
                      {{ getPaymentMethodIcon(method.method_code) }}
                    </VIcon>
                    <h6 class="text-subtitle-2 font-weight-medium mb-1">{{ method.method_name }}</h6>
                    <p class="text-caption text-medium-emphasis mb-0">{{ method.description }}</p>
                  </div>
                </VCard>
              </VCol>
            </VRow>
          </div>
        </div>


      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn 
          color="secondary" 
          variant="outlined" 
          :disabled="processingPayment"
          @click="showPaymentDialog = false"
        >
          Batal
        </VBtn>
        <VBtn 
          color="primary" 
          :loading="processingPayment"
          :disabled="!selectedPaymentMethod"
          @click="submitPayment"
        >
          Proses Pembayaran
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert } from '@/utils/errorHandler'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const billing = ref(null)
const loading = ref(true)
const showConfirmDialog = ref(false)
const confirmDialogTitle = ref('')
const confirmDialogText = ref('')
const confirmDialogAction = ref(null)

// Payment dialog state
const showPaymentDialog = ref(false)
const paymentMethods = ref([])
const loadingPaymentMethods = ref(false)
const selectedPaymentMethod = ref(null)
const processingPayment = ref(false)

// Promo state
const promos = ref([])
const loadingPromos = ref(false)
const selectedPromo = ref(null)
const promoDiscount = ref(0)
const finalAmount = ref(0)

// Tax state
const taxTypes = ref([])
const loadingTaxTypes = ref(false)
const selectedTaxType = ref(null)
const taxRates = ref([])
const loadingTaxRates = ref(false)
const selectedTaxRate = ref(null)
const calculatedTax = ref(0)

const breadcrumbItems = ref([
  {
    title: 'Dashboard',
    to: { name: 'dashboards-analytics' },
    active: false,
  },
  {
    title: 'Transaction',
    to: { name: 'transaction-billings' },
    active: false,
  },
  {
    title: 'Detail Tagihan',
    to: { name: 'transaction-billings-id', params: { id: route.params.id } },
    active: true,
  },
])

// Computed properties for status indicators
const hasConsultation = computed(() => {
  return billing.value?.visit_consultations?.length > 0
})

const hasRecommendations = computed(() => {
  return billing.value?.visit_recommendations?.length > 0
})

const hasTreatments = computed(() => {
  return billing.value?.visit_treatments?.length > 0
})

// Load payment methods
const loadPaymentMethods = async () => {
  try {
    loadingPaymentMethods.value = true
    console.log('🔄 Loading payment methods...')
    
    const response = await $api('/transaction/payment-methods/all', {
      method: 'GET',
    })

    paymentMethods.value = response.data || []
    console.log('✅ Payment methods loaded:', paymentMethods.value)
  } catch (error) {
    console.error('❌ Error loading payment methods:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Metode Pembayaran',
      text: 'Tidak dapat memuat daftar metode pembayaran. Silakan coba lagi.',
    })
    paymentMethods.value = []
  } finally {
    loadingPaymentMethods.value = false
  }
}

// Load promos
const loadPromos = async () => {
  try {
    loadingPromos.value = true
    console.log('🔄 Loading promos...')
    
    const response = await $api('/crm/promo-engine/promos', {
      method: 'GET',
    })

    // Filter only active promos
    promos.value = (response.data || []).filter(promo => promo.is_active)
    console.log('✅ Promos loaded:', promos.value)
  } catch (error) {
    console.error('❌ Error loading promos:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Promo',
      text: 'Tidak dapat memuat daftar promo. Silakan coba lagi.',
    })
    promos.value = []
  } finally {
    loadingPromos.value = false
  }
}

// Load tax types
const loadTaxTypes = async () => {
  try {
    loadingTaxTypes.value = true
    console.log('🔄 Loading tax types...')
    
    const response = await $api('/finance/tax-types', {
      method: 'GET',
    })

    taxTypes.value = response.data || []
    console.log('✅ Tax types loaded:', taxTypes.value)
  } catch (error) {
    console.error('❌ Error loading tax types:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Jenis Pajak',
      text: 'Tidak dapat memuat daftar jenis pajak. Silakan coba lagi.',
    })
    taxTypes.value = []
  } finally {
    loadingTaxTypes.value = false
  }
}

// Load tax rates by tax type
const loadTaxRatesByType = async (taxTypeId) => {
  try {
    loadingTaxRates.value = true
    console.log('🔄 Loading tax rates for tax type:', taxTypeId)
    
    const response = await $api(`/finance/tax-rates/by-tax-type/${taxTypeId}`, {
      method: 'GET',
    })

    taxRates.value = response.data || []
    console.log('✅ Tax rates loaded for type:', taxRates.value)
  } catch (error) {
    console.error('❌ Error loading tax rates by type:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Tarif Pajak',
      text: 'Tidak dapat memuat daftar tarif pajak untuk jenis yang dipilih. Silakan coba lagi.',
    })
    taxRates.value = []
  } finally {
    loadingTaxRates.value = false
  }
}

// Load billing data
const loadBilling = async () => {
  try {
    loading.value = true
    const response = await $api(`/transaction/billings/${route.params.id}`, {
      method: 'GET',
    })
    
    billing.value = response.data
    console.log('Billing data loaded:', billing.value)
  } catch (error) {
    console.error('Error loading billing:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Tagihan',
      text: 'Tidak dapat memuat detail tagihan. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
  }
}

// Status helpers
const getStatusColor = (status) => {
  const colors = {
    'open': 'warning',
    'confirmed': 'info',
    'paid': 'success',
    'close': 'success',
    'closed': 'secondary',
    'cancelled': 'error'
  }
  return colors[status] || 'default'
}

const getStatusText = (status) => {
  const texts = {
    'open': 'Terbuka',
    'confirmed': 'Dikonfirmasi',
    'paid': 'Lunas',
    'close': 'Lunas',
    'closed': 'Ditutup',
    'cancelled': 'Dibatalkan'
  }
  return texts[status] || status
}

const getRecommendationStatusColor = (status) => {
  const colors = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'error',
    'completed': 'info'
  }
  return colors[status] || 'default'
}

const getPriorityColor = (priority) => {
  const colors = {
    'LOW': 'success',
    'MEDIUM': 'warning',
    'HIGH': 'error',
    'URGENT': 'error'
  }
  return colors[priority] || 'default'
}

const getRecommendationDetails = (recommendationId) => {
  if (!billing.value?.visit_recommendation_details) return []

  const recommendationDetail = billing.value.visit_recommendation_details.find(
    detail => detail.recommendation_id === recommendationId
  )

  return recommendationDetail?.details || []
}

const getItemName = (detail) => {
  if (detail.item_type === 'TREATMENT' && detail.treatment) {
    return detail.treatment.name
  } else if (detail.item_type === 'PRODUCT' && detail.product) {
    return detail.product.name
  }
  return 'N/A'
}

const getItemDescription = (detail) => {
  if (detail.item_type === 'TREATMENT' && detail.treatment) {
    return detail.treatment.description
  } else if (detail.item_type === 'PRODUCT' && detail.product) {
    return detail.product.description
  }
  return 'N/A'
}

const getTreatmentStatusColor = (status) => {
  const colors = {
    'scheduled': 'info',
    'in_progress': 'warning',
    'completed': 'success',
    'cancelled': 'error'
  }
  return colors[status] || 'default'
}

const getPaymentStatusColor = (status) => {
  const colors = {
    'pending': 'warning',
    'completed': 'success',
    'failed': 'error',
    'refunded': 'info'
  }
  return colors[status] || 'default'
}

const getConsultationStatusColor = (status) => {
  const colors = {
    'open_consultation': 'info',
    'progress_consultation': 'warning',
    'complete_consultation': 'success',
    'draft': 'secondary',
    'pending': 'warning',
    'confirmed': 'info',
    'paid': 'success',
    'cancelled': 'error',
    'refunded': 'info',
    'forwarded_to_doctor': 'primary',
    'progress_treatment': 'warning',
    'complete_treatment': 'success',
    'open_treatment': 'info',
    'close': 'secondary',
    'open': 'info'
  }
  return colors[status] || 'default'
}

const getConsultationStatusText = (status) => {
  const texts = {
    'open_consultation': 'Konsultasi Terbuka',
    'progress_consultation': 'Konsultasi Berlangsung',
    'complete_consultation': 'Konsultasi Selesai',
    'draft': 'Draft',
    'pending': 'Menunggu',
    'confirmed': 'Dikonfirmasi',
    'paid': 'Lunas',
    'cancelled': 'Dibatalkan',
    'refunded': 'Dikembalikan',
    'forwarded_to_doctor': 'Diteruskan ke Dokter',
    'progress_treatment': 'Treatment Berlangsung',
    'complete_treatment': 'Treatment Selesai',
    'open_treatment': 'Treatment Terbuka',
    'close': 'Ditutup',
    'open': 'Terbuka'
  }
  return texts[status] || status
}

// Payment method helpers
const getPaymentMethodIcon = (methodCode) => {
  const icons = {
    'CASH': 'tabler-cash',
    'TRANSFER': 'tabler-building-bank',
    'QRIS': 'tabler-qrcode',
    'CREDIT_CARD': 'tabler-credit-card',
    'DEBIT_CARD': 'tabler-credit-card',
    'EWALLET': 'tabler-wallet'
  }
  return icons[methodCode] || 'tabler-credit-card'
}

const getPaymentMethodColor = (methodCode) => {
  const colors = {
    'CASH': 'success',
    'TRANSFER': 'primary',
    'QRIS': 'warning',
    'CREDIT_CARD': 'info',
    'DEBIT_CARD': 'info',
    'EWALLET': 'secondary'
  }
  return colors[methodCode] || 'primary'
}

// Billing status helpers
const getBillingStatusIcon = () => {
  const status = billing.value?.status
  
  // Check if we have consultation or treatment data to determine current stage
  const hasConsultation = billing.value?.visit_consultations?.length > 0
  const hasTreatment = billing.value?.visit_treatments?.length > 0
  
  const icons = {
    'progress_consultation': 'tabler-message-circle-2',
    'progress_treatment': 'tabler-stethoscope',
    'complete_consultation': hasTreatment ? 'tabler-stethoscope' : 'tabler-check-circle',
    'complete_treatment': 'tabler-check-circle',
    'open_consultation': 'tabler-message-circle',
    'open_treatment': 'tabler-stethoscope',
    'paid': 'tabler-credit-card',
    'draft': 'tabler-file-text',
    'pending': 'tabler-clock',
    'confirmed': hasConsultation ? 'tabler-message-circle-2' : 'tabler-stethoscope',
    'cancelled': 'tabler-x-circle',
    'refunded': 'tabler-refresh',
    'forwarded_to_doctor': 'tabler-user-md',
    'close': 'tabler-credit-card',
    'open': hasConsultation ? 'tabler-message-circle' : 'tabler-stethoscope'
  }
  return icons[status] || 'tabler-info-circle'
}

const getBillingStatusIconColor = () => {
  const status = billing.value?.status
  const colors = {
    'progress_consultation': 'warning',
    'progress_treatment': 'warning',
    'complete_consultation': 'success',
    'complete_treatment': 'success',
    'open_consultation': 'info',
    'open_treatment': 'info',
    'paid': 'success',
    'draft': 'secondary',
    'pending': 'warning',
    'confirmed': 'info',
    'cancelled': 'error',
    'refunded': 'info',
    'forwarded_to_doctor': 'primary',
    'close': 'success',
    'open': 'info'
  }
  return colors[status] || 'primary'
}

const getBillingStatusColor = () => {
  const status = billing.value?.status
  const colors = {
    'progress_consultation': 'warning',
    'progress_treatment': 'warning',
    'complete_consultation': 'success',
    'complete_treatment': 'success',
    'open_consultation': 'info',
    'open_treatment': 'info',
    'paid': 'success',
    'draft': 'secondary',
    'pending': 'warning',
    'confirmed': 'info',
    'cancelled': 'error',
    'refunded': 'info',
    'forwarded_to_doctor': 'primary',
    'close': 'success',
    'open': 'info'
  }
  return colors[status] || 'primary'
}

const getBillingStatusChipColor = () => {
  const status = billing.value?.status
  const colors = {
    'progress_consultation': 'warning',
    'progress_treatment': 'warning',
    'complete_consultation': 'success',
    'complete_treatment': 'success',
    'open_consultation': 'info',
    'open_treatment': 'info',
    'paid': 'success',
    'draft': 'secondary',
    'pending': 'warning',
    'confirmed': 'info',
    'cancelled': 'error',
    'refunded': 'info',
    'forwarded_to_doctor': 'primary',
    'close': 'success',
    'open': 'info'
  }
  return colors[status] || 'primary'
}

const getBillingStatusTitle = () => {
  const status = billing.value?.status
  
  // Check if we have consultation or treatment data to determine current stage
  const hasConsultation = billing.value?.visit_consultations?.length > 0
  const hasTreatment = billing.value?.visit_treatments?.length > 0
  
  const titles = {
    'progress_consultation': 'Konsultasi Sedang Berlangsung',
    'progress_treatment': 'Treatment Sedang Berlangsung',
    'complete_consultation': hasTreatment ? 'Treatment Sedang Berlangsung' : 'Konsultasi Selesai',
    'complete_treatment': 'Treatment Selesai',
    'open_consultation': 'Konsultasi Terbuka',
    'open_treatment': 'Treatment Terbuka',
    'paid': 'Pembayaran Lunas',
    'draft': 'Draft Tagihan',
    'pending': 'Menunggu Konfirmasi',
    'confirmed': hasConsultation ? 'Konsultasi Sedang Berlangsung' : 'Treatment Sedang Berlangsung',
    'cancelled': 'Tagihan Dibatalkan',
    'refunded': 'Pembayaran Dikembalikan',
    'forwarded_to_doctor': 'Diteruskan ke Dokter',
    'close': 'Pembayaran Lunas',
    'open': hasConsultation ? 'Konsultasi Terbuka' : 'Treatment Terbuka'
  }
  return titles[status] || 'Status Tagihan'
}

const getBillingStatusDescription = () => {
  const status = billing.value?.status
  
  // Check if we have consultation or treatment data to determine current stage
  const hasConsultation = billing.value?.visit_consultations?.length > 0
  const hasTreatment = billing.value?.visit_treatments?.length > 0
  
  const descriptions = {
    'progress_consultation': 'Konsultasi dengan dokter sedang berlangsung. Pasien sedang dalam proses pemeriksaan.',
    'progress_treatment': 'Treatment sedang dilakukan. Prosedur medis sedang berlangsung.',
    'complete_consultation': hasTreatment ? 'Treatment sedang dilakukan. Prosedur medis sedang berlangsung.' : 'Konsultasi telah selesai. Dokter telah memberikan diagnosis dan rekomendasi.',
    'complete_treatment': 'Treatment telah selesai. Prosedur medis telah berhasil diselesaikan.',
    'open_consultation': 'Konsultasi telah dibuka dan siap untuk dimulai.',
    'open_treatment': 'Treatment telah dibuka dan siap untuk dimulai.',
    'paid': 'Pembayaran telah lunas. Tagihan telah dibayar sepenuhnya.',
    'draft': 'Tagihan masih dalam tahap draft dan belum final.',
    'pending': 'Tagihan menunggu konfirmasi atau approval.',
    'confirmed': hasConsultation ? 'Konsultasi dengan dokter sedang berlangsung. Pasien sedang dalam proses pemeriksaan.' : 'Treatment sedang dilakukan. Prosedur medis sedang berlangsung.',
    'cancelled': 'Tagihan telah dibatalkan dan tidak akan diproses.',
    'refunded': 'Pembayaran telah dikembalikan kepada pelanggan.',
    'forwarded_to_doctor': 'Tagihan telah diteruskan kepada dokter untuk review.',
    'close': 'Pembayaran telah lunas. Tagihan telah dibayar sepenuhnya dan ditutup.',
    'open': hasConsultation ? 'Konsultasi telah dibuka dan siap untuk dimulai.' : 'Treatment telah dibuka dan siap untuk dimulai.'
  }
  return descriptions[status] || 'Status tagihan tidak diketahui.'
}

const getBillingStatusText = () => {
  const status = billing.value?.status
  
  // Check if we have consultation or treatment data to determine current stage
  const hasConsultation = billing.value?.visit_consultations?.length > 0
  const hasTreatment = billing.value?.visit_treatments?.length > 0
  
  const texts = {
    'progress_consultation': 'PROGRESS KONSULTASI',
    'progress_treatment': 'PROGRESS TREATMENT',
    'complete_consultation': hasTreatment ? 'PROGRESS TREATMENT' : 'KONSULTASI SELESAI',
    'complete_treatment': 'TREATMENT SELESAI',
    'open_consultation': 'KONSULTASI TERBUKA',
    'open_treatment': 'TREATMENT TERBUKA',
    'paid': 'LUNAS',
    'draft': 'DRAFT',
    'pending': 'MENUNGGU',
    'confirmed': hasConsultation ? 'PROGRESS KONSULTASI' : 'PROGRESS TREATMENT',
    'cancelled': 'DIBATALKAN',
    'refunded': 'DIKEMBALIKAN',
    'forwarded_to_doctor': 'DITERUSKAN KE DOKTER',
    'close': 'LUNAS',
    'open': hasConsultation ? 'KONSULTASI TERBUKA' : 'TREATMENT TERBUKA'
  }
  return texts[status] || status?.toUpperCase() || 'UNKNOWN'
}

// Format helpers
const formatCurrency = (amount) => {
  if (!amount) return 'Rp 0'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  
  return new Date(dateString).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const calculateTreatmentDuration = (performedAt, completedAt) => {
  if (!performedAt || !completedAt) return '-'
  
  const start = new Date(performedAt)
  const end = new Date(completedAt)
  const diffMs = end - start
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  
  if (diffMinutes < 60) {
    return `${diffMinutes} menit`
  } else {
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    return `${hours} jam ${minutes} menit`
  }
}

// Action handlers
const editBilling = () => {
  router.push({ 
    name: 'transaction-billings-edit-id', 
    params: { id: route.params.id } 
  })
}

const continueTreatmentFromBilling = () => {
  // Navigate to treatment creation page with billing data
  console.log('Continue treatment from billing:', billing.value.id)
  
  router.push({
    name: 'transaction-billings-treatment-create',
    query: {
      billing_id: billing.value.id,
      visit_id: billing.value.visit_id
    }
  })
}

const continueTreatment = (consultation) => {
  // Navigate to treatment creation page with consultation data
  console.log('Continue treatment for consultation:', consultation.id)
  
  router.push({
    name: 'transaction-billings-treatment-create',
    query: {
      consultation_id: consultation.id,
      billing_id: billing.value.id,
      visit_id: billing.value.visit_id
    }
  })
}

const completeBilling = async (consultation) => {
  try {
    // Show confirmation dialog
    confirmDialogTitle.value = 'Selesaikan Billing'
    confirmDialogText.value = 'Apakah Anda yakin ingin menyelesaikan billing ini? Tindakan ini tidak dapat dibatalkan.'
    confirmDialogAction.value = async () => {
      try {
        // TODO: Call API to complete billing
        console.log('Complete billing for consultation:', consultation.id)

        // Show success message
        alert('Billing berhasil diselesaikan.')

        // Reload billing data
        await loadBilling()
      } catch (error) {
        console.error('Error completing billing:', error)
        await showErrorAlert(error, {
          title: 'Gagal Menyelesaikan Billing',
          text: 'Terjadi kesalahan saat menyelesaikan billing. Silakan coba lagi.',
        })
      }
    }
    showConfirmDialog.value = true
  } catch (error) {
    console.error('Error showing confirmation dialog:', error)
  }
}

// Computed property for final amount calculation
const calculateFinalAmount = computed(() => {
  if (!billing.value) return 0
  
  const originalAmount = billing.value.grand_total || 0
  const discount = promoDiscount.value || 0
  const tax = calculatedTax.value || 0
  return Math.max(0, originalAmount - discount + tax)
})

// Handle promo selection
const handlePromoSelection = (promoId) => {
  if (!promoId) {
    selectedPromo.value = null
    promoDiscount.value = 0
    return
  }
  
  const promo = promos.value.find(p => p.id === promoId)
  if (!promo) return
  
  selectedPromo.value = promo
  
  // Calculate discount
  const originalAmount = billing.value?.grand_total || 0
  const minPurchase = parseFloat(promo.min_purchase) || 0
  
  if (originalAmount < minPurchase) {
    promoDiscount.value = 0
    return
  }
  
  if (promo.discount_type === 'percentage') {
    const discountPercent = parseFloat(promo.discount_value) || 0
    promoDiscount.value = (originalAmount * discountPercent) / 100
  } else {
    promoDiscount.value = parseFloat(promo.discount_value) || 0
  }
  
  // Ensure discount doesn't exceed original amount
  promoDiscount.value = Math.min(promoDiscount.value, originalAmount)
}

// Handle tax type selection
const handleTaxTypeSelection = async (taxTypeId) => {
  if (!taxTypeId) {
    selectedTaxType.value = null
    selectedTaxRate.value = null
    taxRates.value = []
    calculatedTax.value = 0
    return
  }
  
  const taxType = taxTypes.value.find(t => t.id === taxTypeId)
  if (!taxType) return
  
  selectedTaxType.value = taxType
  
  // Load tax rates for the selected tax type
  await loadTaxRatesByType(taxTypeId)
  
  // Clear previous tax rate selection
  selectedTaxRate.value = null
  calculatedTax.value = 0
  
  console.log('💰 Tax type selected:', taxType)
}

// Handle tax rate selection
const handleTaxRateSelection = (taxRateId) => {
  if (!taxRateId) {
    selectedTaxRate.value = null
    calculatedTax.value = 0
    return
  }
  
  const taxRate = taxRates.value.find(t => t.id === taxRateId)
  if (!taxRate) return
  
  selectedTaxRate.value = taxRate
  
  // Calculate tax based on amount after promo discount
  const amountAfterPromo = billing.value?.grand_total - promoDiscount.value
  const taxPercentage = parseFloat(taxRate.rate_percentage) || 0
  calculatedTax.value = (amountAfterPromo * taxPercentage) / 100
  
  console.log('💰 Tax calculation:', {
    amountAfterPromo,
    taxPercentage,
    calculatedTax: calculatedTax.value
  })
}

const processPayment = async () => {
  try {
    console.log('🔄 Opening payment dialog for billing:', billing.value.id)
    
    // Load payment methods, promos, and tax types
    await Promise.all([
      loadPaymentMethods(),
      loadPromos(),
      loadTaxTypes()
    ])
    
    // Reset selections
    selectedPaymentMethod.value = null
    selectedPromo.value = null
    selectedTaxType.value = null
    selectedTaxRate.value = null
    taxRates.value = []
    promoDiscount.value = 0
    calculatedTax.value = 0
    finalAmount.value = billing.value?.grand_total || 0
    
    // Show payment dialog
    showPaymentDialog.value = true
  } catch (error) {
    console.error('❌ Error opening payment dialog:', error)
    await showErrorAlert(error, {
      title: 'Gagal Membuka Dialog Pembayaran',
      text: 'Tidak dapat membuka dialog pembayaran. Silakan coba lagi.',
    })
  }
}

const submitPayment = async () => {
  if (!selectedPaymentMethod.value) {
    await showErrorAlert(new Error('Pilih metode pembayaran terlebih dahulu'), {
      title: 'Metode Pembayaran Belum Dipilih',
      text: 'Silakan pilih metode pembayaran sebelum melanjutkan.',
    })
    return
  }

  try {
    processingPayment.value = true
    console.log('🔄 Submitting payment for billing:', billing.value.id)
    
    // Get current Indonesian time
    const now = new Date()
    const indonesianDateTime = now.toLocaleString('id-ID', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    })
    
    const requestBody = {
      payment_method_id: selectedPaymentMethod.value,
      status: 'close',
      paid_at: now.toISOString()
    }
    
    // Add promo data if selected
    if (selectedPromo.value) {
      requestBody.promo_id = selectedPromo.value.id
      requestBody.discount_amount = promoDiscount.value
    }
    
    // Add tax data if selected
    if (selectedTaxRate.value) {
      requestBody.tax_rate_id = selectedTaxRate.value.id
      requestBody.tax_amount = calculatedTax.value
    }
    
    // Update grand total with final calculation
    requestBody.grand_total = calculateFinalAmount.value
    
    console.log('📤 Payment request body:', requestBody)
    console.log('📅 Indonesian format:', indonesianDateTime)
    
    const response = await $api(`/transaction/billings/${billing.value.id}`, {
      method: 'PATCH',
      body: requestBody,
    })
    
    console.log('📥 Payment API Response:', response)
    
    // Update local billing data
    billing.value = { ...billing.value, ...response.data }
    
    // Close dialog
    showPaymentDialog.value = false
    
    await showSuccessAlert({
      title: 'Pembayaran Berhasil',
      text: `Pembayaran berhasil diproses pada ${indonesianDateTime}`,
    })
    
    console.log('✅ Payment processed successfully')
  } catch (error) {
    console.error('❌ Error processing payment:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memproses Pembayaran',
      text: 'Tidak dapat memproses pembayaran. Silakan coba lagi.',
    })
  } finally {
    processingPayment.value = false
  }
}

const printBilling = () => {
  // TODO: Implement printing
  console.log('Print billing:', billing.value.id)
}

const goBack = () => {
  router.push({ name: 'transaction-billings' })
}

const editRecommendation = (recommendation) => {
  // TODO: Navigate to recommendation edit page
  console.log('Edit recommendation:', recommendation.id)

  router.push({
    name: 'crm-recommendations-edit-id',
    params: { id: recommendation.id }
  })
}

onMounted(() => {
  loadBilling()
})
</script>

<style lang="scss" scoped>
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  
  .info-label {
    font-weight: 500;
    color: #666;
  }
  
  .info-value {
    font-weight: 600;
    color: #333;
  }
  
  &.grand-total {
    background: linear-gradient(135deg, #e3f2fd, #bbdefb);
    border: 2px solid #2196f3;
    
    .info-label,
    .info-value {
      font-weight: bold;
      color: #1976d2;
    }
  }
}

.billing-status {
  .v-card {
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .info-grid {
    gap: 0.5rem;
  }
  
  .info-item {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}

// Interactive card styles
.promo-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: rgba(255, 152, 0, 0.3);
  }
}

.payment-method-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &.selected-method {
    border-color: #1976d2;
    background: linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05));
  }
}
</style> 
