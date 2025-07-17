<route lang="yaml">
meta:
  layout: default
  navActiveLink: wms-regional-inventory
</route>

<template>
  <VCard>
    <VCardTitle class="d-flex align-center justify-space-between">
      <div>
        <h3 class="text-h5 mb-1">
          Detail Inventori Regional
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-0">
          Informasi lengkap inventori regional
        </p>
      </div>
      <VBtn
        variant="tonal"
        color="secondary"
        :to="{ name: 'wms-regional-inventory' }"
        prepend-icon="tabler-arrow-left"
      >
        Kembali
      </VBtn>
    </VCardTitle>

    <VDivider />

    <VCardText v-if="loading">
      <div class="d-flex justify-center py-8">
        <VProgressCircular
          indeterminate
          color="primary"
        />
      </div>
    </VCardText>

    <VCardText v-else-if="inventoryItem">
      <VRow>
                <!-- Product Information -->
        <VCol cols="12" md="6">
          <VCard variant="outlined" class="mb-4">
            <VCardTitle class="text-h6">
              <VIcon icon="tabler-package" class="me-2" />
              Informasi Produk
            </VCardTitle>
            <VCardText>
              <div class="d-flex flex-column gap-2">
                <div>
                  <span class="text-medium-emphasis">SKU:</span>
                  <span class="font-weight-medium ms-2">{{ inventoryItem.product?.sku || '-' }}</span>
                </div>
                <div>
                  <span class="text-medium-emphasis">Nama Produk:</span>
                  <span class="font-weight-medium ms-2">{{ inventoryItem.product?.name || '-' }}</span>
                </div>
                <div>
                  <span class="text-medium-emphasis">Status Produk:</span>
                  <VChip
                    v-if="inventoryItem.product"
                    :color="inventoryItem.product.is_active ? 'success' : 'error'"
                    size="small"
                    label
                    class="ms-2"
                  >
                    {{ inventoryItem.product.is_active ? 'Aktif' : 'Nonaktif' }}
                  </VChip>
                  <span v-else class="text-medium-emphasis ms-2">-</span>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Regional Warehouse Information -->
        <VCol cols="12" md="6">
          <VCard variant="outlined" class="mb-4">
            <VCardTitle class="text-h6">
              <VIcon icon="tabler-building" class="me-2" />
              Informasi Regional Warehouse
            </VCardTitle>
            <VCardText>
              <div class="d-flex flex-column gap-2">
                <div>
                  <span class="text-medium-emphasis">Nama Warehouse:</span>
                  <span class="font-weight-medium ms-2">
                    {{ inventoryItem.regional_warehouse?.name || inventoryItem.regional_warehouse_id || '-' }}
                  </span>
                </div>
                <div>
                  <span class="text-medium-emphasis">Kode Warehouse:</span>
                  <span class="font-weight-medium ms-2">
                    {{ inventoryItem.regional_warehouse?.code || '-' }}
                  </span>
                </div>
                <div>
                  <span class="text-medium-emphasis">Region:</span>
                  <span class="font-weight-medium ms-2">
                    {{ inventoryItem.regional_warehouse?.region || '-' }}
                  </span>
                </div>
                <div>
                  <span class="text-medium-emphasis">ID Inventori:</span>
                  <span class="font-weight-medium ms-2">{{ inventoryItem.id || '-' }}</span>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Stock Information -->
        <VCol cols="12" md="6">
          <VCard variant="outlined" class="mb-4">
            <VCardTitle class="text-h6">
              <VIcon icon="tabler-box" class="me-2" />
              Informasi Stok
            </VCardTitle>
            <VCardText>
              <div class="d-flex flex-column gap-3">
                <div class="d-flex justify-space-between align-center">
                  <span class="text-medium-emphasis">Stok Saat Ini:</span>
                  <span class="font-weight-medium text-h6">{{ inventoryItem.current_stock || 0 }}</span>
                </div>
                <div class="d-flex justify-space-between align-center">
                  <span class="text-medium-emphasis">Stok Terpesan:</span>
                  <span class="font-weight-medium text-warning text-h6">{{ inventoryItem.reserved_stock || 0 }}</span>
                </div>
                <VDivider />
                <div class="d-flex justify-space-between align-center">
                  <span class="text-medium-emphasis">Stok Tersedia:</span>
                  <span class="font-weight-medium text-success text-h6">
                    {{ (inventoryItem.current_stock || 0) - (inventoryItem.reserved_stock || 0) }}
                  </span>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Stock Levels -->
        <VCol cols="12" md="6">
          <VCard variant="outlined" class="mb-4">
            <VCardTitle class="text-h6">
              <VIcon icon="tabler-gauge" class="me-2" />
              Level Stok
            </VCardTitle>
            <VCardText>
              <div class="d-flex flex-column gap-3">
                <div class="d-flex justify-space-between align-center">
                  <span class="text-medium-emphasis">Level Minimum:</span>
                  <span class="font-weight-medium">{{ inventoryItem.min_stock_level || 0 }}</span>
                </div>
                <div class="d-flex justify-space-between align-center">
                  <span class="text-medium-emphasis">Level Maksimum:</span>
                  <span class="font-weight-medium">{{ inventoryItem.max_stock_level || 0 }}</span>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Timestamps -->
        <VCol cols="12" md="6">
          <VCard variant="outlined" class="mb-4">
            <VCardTitle class="text-h6">
              <VIcon icon="tabler-clock" class="me-2" />
              Informasi Waktu
            </VCardTitle>
            <VCardText>
              <div class="d-flex flex-column gap-3">
                <div class="d-flex justify-space-between align-center">
                  <span class="text-medium-emphasis">Dibuat Pada:</span>
                  <span class="font-weight-medium">
                    {{ inventoryItem.created_at ? formatDateTime(inventoryItem.created_at) : '-' }}
                  </span>
                </div>
                <div class="d-flex justify-space-between align-center">
                  <span class="text-medium-emphasis">Diperbarui Pada:</span>
                  <span class="font-weight-medium">
                    {{ inventoryItem.updated_at ? formatDateTime(inventoryItem.updated_at) : '-' }}
                  </span>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Action Buttons -->
      <VRow class="mt-6">
        <VCol cols="12" class="d-flex gap-3">
          <VBtn
            color="primary"
            :to="{ name: 'wms-regional-inventory-create' }"
            prepend-icon="tabler-plus"
          >
            Tambah Inventori Baru
          </VBtn>
          <VBtn
            variant="outlined"
            color="secondary"
            :to="{ name: 'wms-regional-inventory' }"
          >
            Kembali ke Daftar
          </VBtn>
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
          Data tidak ditemukan
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Inventori regional yang Anda cari tidak ditemukan
        </p>
        <VBtn
          color="primary"
          variant="tonal"
          :to="{ name: 'wms-regional-inventory' }"
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
const loading = ref(true)
const inventoryItem = ref(null)

// Functions
async function fetchInventoryItem() {
  loading.value = true
  try {
    const res = await $api(`/wms/regional-inventory/${route.params.id}`)
    inventoryItem.value = res.data
    console.log('📥 Inventory item loaded:', inventoryItem.value)
    
    // Fetch regional warehouse details if not already included
    if (inventoryItem.value && inventoryItem.value.regional_warehouse_id && !inventoryItem.value.regional_warehouse) {
      console.log('🔄 Fetching regional warehouse details...')
      await fetchRegionalWarehouseDetails()
    }
  } catch (error) {
    console.error('❌ Error fetching inventory item:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Inventori',
      text: 'Tidak dapat memuat data inventori regional. Silakan coba lagi.',
    })
    inventoryItem.value = null
  } finally {
    loading.value = false
  }
}

async function fetchRegionalWarehouseDetails() {
  try {
    if (!inventoryItem.value?.regional_warehouse_id) {
      console.log('⚠️ No regional warehouse ID found')
      return
    }
    
    console.log('🔄 Fetching warehouse details for:', inventoryItem.value.regional_warehouse_id)
    
    const res = await $api(`/wms/regional-warehouses/${inventoryItem.value.regional_warehouse_id}`)
    inventoryItem.value.regional_warehouse = res.data
    console.log('✅ Warehouse details loaded:', res.data)
  } catch (error) {
    console.error('❌ Error fetching regional warehouse details:', error)
    inventoryItem.value.regional_warehouse = null
  }
}

function formatCurrency(amount) {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('id-ID')
}



// Initialize data
onMounted(() => {
  fetchInventoryItem()
})
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}
</style> 
