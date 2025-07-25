<route lang="yaml">
meta:
  layout: default
  navActiveLink: crm-promos
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

    <VCardText v-else-if="promo">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center gap-4">
          <VAvatar
            size="72"
            color="primary"
          >
            <VIcon size="40">
              tabler-tag
            </VIcon>
          </VAvatar>
          <div class="flex-grow-1">
            <h2 class="text-h4 font-weight-bold mb-1">
              {{ promo.name }}
            </h2>
            <div class="d-flex align-center gap-2">
              <VChip
                color="primary"
                size="small"
                variant="outlined"
              >
                {{ promo.code }}
              </VChip>
              <VChip
                :color="promo.is_active ? 'success' : 'error'"
                size="small"
              >
                {{ promo.is_active ? 'Aktif' : 'Nonaktif' }}
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
            :to="{ name: 'crm-promos' }"
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
              Nama Promo
            </div>
            <div class="text-h6 font-weight-medium">
              {{ promo.name }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kode Promo
            </div>
            <div class="text-h6 font-weight-medium">
              {{ promo.code }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tipe Promo
            </div>
            <VChip
              :color="getPromoTypeColor(promo.type)"
              size="small"
              variant="tonal"
            >
              {{ getPromoTypeLabel(promo.type) }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status
            </div>
            <VChip
              :color="promo.is_active ? 'success' : 'error'"
              size="small"
              variant="tonal"
            >
              {{ promo.is_active ? 'Aktif' : 'Nonaktif' }}
            </VChip>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tipe Diskon
            </div>
            <VChip
              :color="getDiscountTypeColor(promo.discount_type)"
              size="small"
              variant="tonal"
            >
              {{ getDiscountTypeLabel(promo.discount_type) }}
            </VChip>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Nilai Diskon
            </div>
            <div class="text-h6 font-weight-medium">
              {{ promo.discount_type === 'percentage' ? `${promo.discount_value}%` : formatCurrency(promo.discount_value) }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Minimal Pembelian
            </div>
            <div class="text-h6 font-weight-medium">
              {{ formatCurrency(promo.min_purchase) }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Penggunaan
            </div>
            <div class="text-h6 font-weight-medium">
              {{ promo.used_count || 0 }} / {{ promo.usage_limit }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Description -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-file-text
        </VIcon>
        Deskripsi
      </h3>
      
      <VRow class="mb-6">
        <VCol cols="12">
          <div class="text-body-1">
            {{ promo.description || 'Tidak ada deskripsi' }}
          </div>
        </VCol>
      </VRow>

      <!-- Date Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-calendar
        </VIcon>
        Periode Promo
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Mulai
            </div>
            <div class="text-h6 font-weight-medium">
              {{ formatDateTime(promo.start_date) }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Berakhir
            </div>
            <div class="text-h6 font-weight-medium">
              {{ formatDateTime(promo.end_date) }}
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
        Informasi Sistem
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Dibuat
            </div>
            <div class="text-h6 font-weight-medium">
              {{ formatDateTime(promo.created_at) }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Terakhir Diupdate
            </div>
            <div class="text-h6 font-weight-medium">
              {{ formatDateTime(promo.updated_at) }}
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>

    <VCardText v-else>
      <div class="text-center py-12">
        <VIcon
          size="64"
          color="error"
          class="mb-4"
        >
          tabler-alert-circle
        </VIcon>
        <h3 class="text-h6 mb-2">
          Promo tidak ditemukan
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Promo yang Anda cari tidak ditemukan atau telah dihapus
        </p>
        <VBtn
          color="primary"
          variant="tonal"
          :to="{ name: 'crm-promos' }"
        >
          Kembali ke Daftar
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert } from '@/utils/errorHandler'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// State
const loading = ref(true)
const promo = ref(null)

// Functions
async function fetchPromo() {
  loading.value = true
  console.log('🔄 Starting fetchPromo...')
  
  try {
    const res = await $api(`/crm/promo-engine/promos/${route.params.id}`, {
      method: 'GET',
    })
    
    console.log('📥 API Response:', res)
    
    promo.value = res.data || res
    console.log('✅ Promo loaded:', promo.value)
  } catch (error) {
    console.error('❌ Error fetching promo:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Promo',
      text: 'Tidak dapat memuat data promo. Silakan coba lagi.',
    })
    promo.value = null
  } finally {
    loading.value = false
    console.log('🏁 fetchPromo completed')
  }
}

function getPromoTypeColor(type) {
  switch (type) {
  case 'voucher': return 'primary'
  case 'discount': return 'success'
  case 'cashback': return 'warning'
  default: return 'secondary'
  }
}

function getPromoTypeLabel(type) {
  switch (type) {
  case 'voucher': return 'Voucher'
  case 'discount': return 'Discount'
  case 'cashback': return 'Cashback'
  default: return type
  }
}

function getDiscountTypeColor(type) {
  switch (type) {
  case 'percentage': return 'primary'
  case 'nominal': return 'success'
  default: return 'secondary'
  }
}

function getDiscountTypeLabel(type) {
  switch (type) {
  case 'percentage': return 'Persentase'
  case 'nominal': return 'Nominal'
  default: return type
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

// Lifecycle
onMounted(() => {
  fetchPromo()
})
</script> 
