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
            Tagihan #{{ billing.id }}
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
const loading = ref(true)

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

onMounted(fetchBilling)
</script> 
