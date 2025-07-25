<route lang="yaml">
meta:
  layout: default
  navActiveLink: wms-branches
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

    <VCardText v-else-if="!loading && !branch">
      <!-- Error State -->
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
          Cabang yang Anda cari tidak ditemukan atau telah dihapus
        </p>
        <VBtn
          color="primary"
          variant="tonal"
          :to="{ name: 'wms-branches' }"
        >
          Kembali Ke Daftar
        </VBtn>
      </div>
    </VCardText>

    <VCardText v-else-if="branch">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center gap-4">
          <VAvatar
            size="72"
            color="primary"
          >
            <VIcon size="40">
              tabler-building-store
            </VIcon>
          </VAvatar>
          <div class="flex-grow-1">
            <h2 class="text-h4 font-weight-bold mb-1">
              {{ branch.name }}
            </h2>
            <div class="d-flex align-center gap-2">
              <VChip
                color="primary"
                size="small"
                variant="outlined"
              >
                {{ branch.code }}
              </VChip>
              <VChip
                :color="branch.is_active ? 'success' : 'error'"
                size="small"
              >
                {{ branch.is_active ? 'Aktif' : 'Nonaktif' }}
              </VChip>
              <VChip
                color="info"
                size="small"
                variant="tonal"
              >
                {{ branch.type }}
              </VChip>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="d-flex gap-2">
          <VBtn
            color="primary"
            prepend-icon="tabler-edit"
            :to="{ name: 'wms-branches-edit-id', params: { id: route.params.id } }"
          >
            Edit
          </VBtn>
          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="tabler-arrow-left"
            :to="{ name: 'wms-branches' }"
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
              Nama Cabang
            </div>
            <div class="text-h6 font-weight-medium">
              {{ branch.name }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kode Cabang
            </div>
            <div class="text-h6 font-weight-medium">
              {{ branch.code }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tipe Cabang
            </div>
            <div class="text-h6 font-weight-medium">
              {{ branch.type }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Telepon
            </div>
            <div class="text-h6 font-weight-medium">
              {{ branch.phone || '-' }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Email
            </div>
            <div class="text-h6 font-weight-medium">
              {{ branch.email || '-' }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kapasitas Maksimal
            </div>
            <div class="text-h6 font-weight-medium">
              {{ branch.max_stock_capacity_m3 }} m³
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Status Aktif
            </div>
            <div class="text-h6 font-weight-medium">
              <VChip
                :color="branch.is_active ? 'success' : 'error'"
                size="small"
              >
                {{ branch.is_active ? 'Aktif' : 'Nonaktif' }}
              </VChip>
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Auto Reorder
            </div>
            <div class="text-h6 font-weight-medium">
              <VChip
                :color="branch.auto_reorder_enabled ? 'success' : 'warning'"
                size="small"
              >
                {{ branch.auto_reorder_enabled ? 'Diaktifkan' : 'Dinonaktifkan' }}
              </VChip>
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Address -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-map-pin
        </VIcon>
        Alamat
      </h3>
      
      <VRow class="mb-6">
        <VCol cols="12">
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Alamat Lengkap
            </div>
            <div class="text-body-1">
              {{ branch.address || '-' }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Contact Information -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-users
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
              Gudang Regional
            </div>
            <div class="text-body-1">
              {{ regionalWarehouseName || '-' }}
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Manager
            </div>
            <div class="text-body-1">
              {{ managerName || '-' }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Operational Hours -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-clock
        </VIcon>
        Jam Operasional
      </h3>
      
      <VRow class="mb-6">
        <VCol
          v-for="(hours, day) in branch.operational_hours"
          :key="day"
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              {{ getDayLabel(day) }}
            </div>
            <div class="text-body-1">
              <span v-if="hours === 'CLOSED'" class="text-error">
                Tutup
              </span>
              <span v-else>
                {{ hours.open }} - {{ hours.close }}
              </span>
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Settings -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-settings
        </VIcon>
        Pengaturan
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Maksimal Hari Stok
            </div>
            <div class="text-body-1">
              {{ branch.settings?.max_stock_days || '-' }} hari
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Minimal Hari Stok
            </div>
            <div class="text-body-1">
              {{ branch.settings?.min_stock_days || '-' }} hari
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tingkat Prioritas
            </div>
            <div class="text-body-1">
              <VChip
                :color="getPriorityColor(branch.settings?.priority_level)"
                size="small"
              >
                {{ branch.settings?.priority_level || '-' }}
              </VChip>
            </div>
          </div>
        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Hari Auto Reorder
            </div>
            <div class="text-body-1">
              {{ branch.settings?.auto_reorder_days || '-' }} hari
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
              {{ branch.created_at ? formatDateTime(branch.created_at) : '-' }}
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
              {{ branch.updated_at ? formatDateTime(branch.updated_at) : '-' }}
            </div>
          </div>
        </VCol>
      </VRow>
      <!-- Inventory Summary -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">
          tabler-package
        </VIcon>
        Ringkasan Inventori
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="3"
        >
          <VCard
            variant="outlined"
            class="text-center pa-4"
          >
            <VIcon
              size="32"
              color="primary"
              class="mb-2"
            >
              tabler-boxes
            </VIcon>
            <div class="text-h5 font-weight-bold mb-1">
              {{ inventorySummary.totalProducts || 0 }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Total Produk
            </div>
          </VCard>
        </VCol>
        
        <VCol
          cols="12"
          md="3"
        >
          <VCard
            variant="outlined"
            class="text-center pa-4"
          >
            <VIcon
              size="32"
              color="success"
              class="mb-2"
            >
              tabler-check
            </VIcon>
            <div class="text-h5 font-weight-bold mb-1">
              {{ inventorySummary.inStock || 0 }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Stok Tersedia
            </div>
          </VCard>
        </VCol>
        
        <VCol
          cols="12"
          md="3"
        >
          <VCard
            variant="outlined"
            class="text-center pa-4"
          >
            <VIcon
              size="32"
              color="warning"
              class="mb-2"
            >
              tabler-alert-triangle
            </VIcon>
            <div class="text-h5 font-weight-bold mb-1">
              {{ inventorySummary.lowStock || 0 }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Stok Menipis
            </div>
          </VCard>
        </VCol>
        
        <VCol
          cols="12"
          md="3"
        >
          <VCard
            variant="outlined"
            class="text-center pa-4"
          >
            <VIcon
              size="32"
              color="error"
              class="mb-2"
            >
              tabler-x
            </VIcon>
            <div class="text-h5 font-weight-bold mb-1">
              {{ inventorySummary.outOfStock || 0 }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Stok Habis
            </div>
          </VCard>
        </VCol>
      </VRow>

      <!-- Inventory List -->
      <VDivider class="my-6" />
      <div class="d-flex align-center justify-space-between mb-4">
        <h3 class="text-h6 font-weight-medium">
          <VIcon class="me-2">
            tabler-list
          </VIcon>
          Daftar Inventori
        </h3>
        <div class="d-flex gap-2">
          <VBtn
            color="primary"
            variant="tonal"
            size="small"
            prepend-icon="tabler-plus"
            @click="openAddInventoryDialog"
          >
            Tambah Inventori
          </VBtn>
          <VBtn
            color="primary"
            variant="tonal"
            size="small"
            prepend-icon="tabler-refresh"
            :loading="inventoryLoading"
            @click="fetchInventory"
          >
            Refresh
          </VBtn>
        </div>
      </div>
      
      <VCard
        v-if="inventoryLoading"
        variant="outlined"
        class="pa-4"
      >
        <div class="text-center">
          <VProgressCircular
            indeterminate
            color="primary"
            class="mb-2"
          />
          <div class="text-body-2 text-medium-emphasis">
            Memuat data inventori...
          </div>
        </div>
      </VCard>
      
      <VCard
        v-else-if="!inventoryData.length"
        variant="outlined"
        class="pa-4"
      >
        <div class="text-center">
          <VIcon
            size="48"
            color="grey"
            class="mb-2"
          >
            tabler-package-off
          </VIcon>
          <div class="text-h6 mb-1">
            Tidak ada data inventori
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Belum ada produk yang terdaftar di inventori cabang ini
          </div>
        </div>
      </VCard>
      
      <VCard
        v-else
        variant="outlined"
      >
        <VTable>
          <thead>
            <tr>
              <th>Produk</th>
              <th>SKU</th>
              <th>Stok Saat Ini</th>
              <th>Stok Terpesan</th>
              <th>Stok Minimum</th>
              <th>Stok Maksimum</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in inventoryData"
              :key="item.id"
            >
              <td>
                <div class="d-flex align-center">
                  <div>
                    <div class="font-weight-medium">
                      {{ item.product?.name || '-' }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ formatCurrency(item.avg_cost) }}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <VChip
                  size="small"
                  variant="outlined"
                >
                  {{ item.product?.sku || '-' }}
                </VChip>
              </td>
              <td>
                <span class="font-weight-medium">
                  {{ item.current_stock }}
                </span>
              </td>
              <td>
                <span class="text-medium-emphasis">
                  {{ item.reserved_stock }}
                </span>
              </td>
              <td>
                <span class="text-medium-emphasis">
                  {{ item.min_stock_level }}
                </span>
              </td>
              <td>
                <span class="text-medium-emphasis">
                  {{ item.max_stock_level }}
                </span>
              </td>
              <td>
                <VChip
                  :color="getStockStatusColor(item)"
                  size="small"
                >
                  {{ getStockStatusText(item) }}
                </VChip>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCardText>
  </VCard>

  <!-- Add Inventory Dialog -->
  <VDialog
    v-model="showAddInventoryDialog"
    max-width="800px"
    persistent
  >
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between pa-4">
        <div class="d-flex align-center gap-3">
          <VIcon
            size="28"
            color="primary"
          >
            tabler-package
          </VIcon>
          <div>
            <h2 class="text-h5 mb-1">
              Tambah Inventori Cabang
            </h2>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Tambahkan inventori baru untuk {{ branch?.name }}
            </p>
          </div>
        </div>
        <VBtn
          icon
          variant="text"
          size="small"
          @click="closeAddInventoryDialog"
        >
          <VIcon>tabler-x</VIcon>
        </VBtn>
      </VCardTitle>

      <VDivider />

      <VCardText class="pa-4">
        <VForm ref="inventoryFormRef" v-model="isInventoryFormValid">
          <VRow>
            <!-- Product Selection -->
            <VCol cols="12">
              <h3 class="text-h6 mb-4">
                Pilih Produk
              </h3>
            </VCol>

            <VCol cols="12">
              <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                Produk
              </label>
              <VAutocomplete
                v-model="inventoryFormData.product_id"
                :items="productsWithDisplayName"
                item-title="displayName"
                item-value="id"
                placeholder="Cari dan pilih produk..."
                variant="outlined"
                :rules="[v => !!v || 'Produk harus dipilih']"
                :loading="loadingProducts"
                :error-messages="inventoryErrors.product_id"
                required
                hide-details
                clearable
                filterable
                :filter="customFilter"
                @update:model-value="handleInventoryProductChange"
              >
                <template #item="{ props, item }">
                  <VListItem v-bind="props">
                    <template #prepend>
                      <VIcon size="20" color="primary">
                        tabler-package
                      </VIcon>
                    </template>
                    <VListItemTitle>
                      {{ item.raw.name }}
                    </VListItemTitle>
                    <VListItemSubtitle>
                      {{ item.raw.sku }}
                    </VListItemSubtitle>
                  </VListItem>
                </template>
              </VAutocomplete>
            </VCol>

            <!-- Stock Information -->
            <VCol cols="12" class="mt-6">
              <h3 class="text-h6 mb-4">
                Informasi Stok
              </h3>
            </VCol>

            <VCol cols="12" md="6">
              <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                Stok Saat Ini
              </label>
              <VTextField
                v-model.number="inventoryFormData.current_stock"
                type="number"
                placeholder="0"
                variant="outlined"
                min="0"
                :rules="[
                  v => v !== null && v !== undefined || 'Stok saat ini harus diisi',
                  v => v >= 0 || 'Stok tidak boleh negatif'
                ]"
                required
                hide-details
                :error-messages="inventoryErrors.current_stock"
              />
            </VCol>

            <VCol cols="12" md="6">
              <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                Stok Terpesan
              </label>
              <VTextField
                v-model.number="inventoryFormData.reserved_stock"
                type="number"
                placeholder="0"
                variant="outlined"
                min="0"
                :rules="[
                  v => v === null || v === undefined || v >= 0 || 'Stok terpesan tidak boleh negatif'
                ]"
                hide-details
                :error-messages="inventoryErrors.reserved_stock"
              />
            </VCol>

            <VCol cols="12" md="6">
              <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                Level Stok Minimum
              </label>
              <VTextField
                v-model.number="inventoryFormData.min_stock_level"
                type="number"
                placeholder="0"
                variant="outlined"
                min="0"
                :rules="[
                  v => v === null || v === undefined || v >= 0 || 'Level stok minimum tidak boleh negatif'
                ]"
                hide-details
                :error-messages="inventoryErrors.min_stock_level"
              />
            </VCol>

            <VCol cols="12" md="6">
              <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                Level Stok Maksimum
              </label>
              <VTextField
                v-model.number="inventoryFormData.max_stock_level"
                type="number"
                placeholder="0"
                variant="outlined"
                min="0"
                :rules="[
                  v => v === null || v === undefined || v >= 0 || 'Level stok maksimum tidak boleh negatif',
                  v => {
                    if (v !== null && v !== undefined && inventoryFormData.min_stock_level !== null && inventoryFormData.min_stock_level !== undefined) {
                      return v >= inventoryFormData.min_stock_level || 'Level stok maksimum harus lebih besar dari minimum'
                    }
                    return true
                  }
                ]"
                hide-details
                :error-messages="inventoryErrors.max_stock_level"
              />
            </VCol>

            <!-- Action Buttons -->
            <VCol cols="12" class="mt-6">
              <div class="d-flex gap-3 justify-end">
                <VBtn
                  variant="outlined"
                  color="secondary"
                  @click="closeAddInventoryDialog"
                >
                  Batal
                </VBtn>
                <VBtn
                  color="primary"
                  :loading="addingInventory"
                  :disabled="!isInventoryFormValid"
                  @click="handleAddInventory"
                >
                  Simpan Inventori
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert, showSuccessAlert } from '@/utils/errorHandler'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Route
const route = useRoute()

// Data
const branch = ref(null)
const loading = ref(false)
const regionalWarehouseName = ref('')
const managerName = ref('')
const inventoryData = ref([])
const inventoryLoading = ref(false)
const inventorySummary = ref({
  totalProducts: 0,
  inStock: 0,
  lowStock: 0,
  outOfStock: 0
})

// Add Inventory Dialog Data
const showAddInventoryDialog = ref(false)
const inventoryFormRef = ref()
const isInventoryFormValid = ref(false)
const addingInventory = ref(false)
const loadingProducts = ref(false)
const products = ref([])
const inventoryErrors = ref({})

// Inventory Form Data
const inventoryFormData = ref({
  product_id: null,
  current_stock: 0,
  reserved_stock: 0,
  min_stock_level: null,
  max_stock_level: null,
})

// Methods
const fetchBranch = async () => {
  loading.value = true
  
  try {
    const res = await $api(`/wms/branches/${route.params.id}`, {
      method: 'GET',
    })
    
    if (res && res.response_code === 200 && res.data) {
      branch.value = res.data
      
      // Fetch regional warehouse name if exists
      if (branch.value.regional_warehouse_id) {
        await fetchRegionalWarehouseName(branch.value.regional_warehouse_id)
      }
      
      // Fetch manager name if exists
      if (branch.value.manager_id) {
        await fetchManagerName(branch.value.manager_id)
      }
      
      // Fetch inventory data
      await fetchInventory()
    } else {
      branch.value = null
    }
  } catch (error) {
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Cabang',
      text: 'Tidak dapat memuat data cabang. Silakan coba lagi.',
    })
    branch.value = null
  } finally {
    loading.value = false
  }
}

const fetchRegionalWarehouseName = async (warehouseId) => {
  try {
    const res = await $api('/wms/regional-warehouses', {
      method: 'GET',
    })
    
    if (res && res.response_code === 200) {
      const warehouse = res.data.find(w => w.id === warehouseId)
      if (warehouse) {
        regionalWarehouseName.value = `${warehouse.name} (${warehouse.code})`
      } else {
        regionalWarehouseName.value = 'Warehouse tidak ditemukan'
      }
    }
  } catch (error) {
    regionalWarehouseName.value = 'Gagal memuat nama warehouse'
  }
}

const fetchManagerName = async (managerId) => {
  try {
    const res = await $api('/hris/employees', {
      method: 'GET',
    })
    
    if (res && res.response_code === 200) {
      const manager = res.data.find(m => m.id === managerId)
      if (manager) {
        managerName.value = `${manager.name} (${manager.email})`
      } else {
        managerName.value = 'Manager tidak ditemukan'
      }
    }
  } catch (error) {
    managerName.value = 'Gagal memuat nama manager'
  }
}

const fetchInventory = async () => {
  if (!branch.value?.id) return
  
  inventoryLoading.value = true
  
  try {
    const res = await $api('/wms/branch-inventory/paginated', {
      method: 'POST',
      body: {
        page: 1,
        per_page: 10, // Get more items to show comprehensive data
        sort_by: 'createdAt',
        sort_order: 'desc',
        filters: [
          {
            search_by: 'branch_id',
            filter_type: 'equal',
            search_query: branch.value.id
          }
        ]
      }
    })
    
    if (res && res.response_code === 200 && res.data) {
      inventoryData.value = res.data
      calculateInventorySummary()
    } else {
      inventoryData.value = []
      inventorySummary.value = {
        totalProducts: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0
      }
    }
  } catch (error) {
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Inventori',
      text: 'Tidak dapat memuat data inventori cabang. Silakan coba lagi.',
    })
    inventoryData.value = []
  } finally {
    inventoryLoading.value = false
  }
}

const calculateInventorySummary = () => {
  const data = inventoryData.value
  
  inventorySummary.value = {
    totalProducts: data.length,
    inStock: data.filter(item => item.current_stock > item.min_stock_level).length,
    lowStock: data.filter(item => 
      item.current_stock <= item.min_stock_level && item.current_stock > 0
    ).length,
    outOfStock: data.filter(item => item.current_stock === 0).length
  }
}

const getStockStatusColor = (item) => {
  if (item.current_stock === 0) return 'error'
  if (item.current_stock <= item.min_stock_level) return 'warning'
  return 'success'
}

const getStockStatusText = (item) => {
  if (item.current_stock === 0) return 'Habis'
  if (item.current_stock <= item.min_stock_level) return 'Menipis'
  return 'Tersedia'
}

const formatCurrency = (amount) => {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

// Computed properties
const productsWithDisplayName = computed(() => {
  return products.value.map(product => ({
    ...product,
    displayName: `${product.sku} - ${product.name}`,
  }))
})

// Dialog Management Functions
const openAddInventoryDialog = async () => {
  showAddInventoryDialog.value = true
  resetInventoryForm()
  await fetchProducts()
}

const closeAddInventoryDialog = () => {
  showAddInventoryDialog.value = false
  resetInventoryForm()
}

const resetInventoryForm = () => {
  inventoryFormData.value = {
    product_id: null,
    current_stock: 0,
    reserved_stock: 0,
    min_stock_level: null,
    max_stock_level: null,
  }
  inventoryErrors.value = {}
  if (inventoryFormRef.value) {
    inventoryFormRef.value.resetValidation()
  }
}

const handleInventoryProductChange = () => {
  inventoryErrors.value = {}
}

const customFilter = (item, queryText, itemText) => {
  const text = itemText.toLowerCase()
  const query = queryText.toLowerCase()
  
  // Search by SKU, name, or display name
  return text.includes(query) || 
         item.raw.sku.toLowerCase().includes(query) ||
         item.raw.name.toLowerCase().includes(query)
}

const fetchProducts = async () => {
  loadingProducts.value = true
  try {
    const res = await $api('/wms/products')
    products.value = res.data || []
  } catch (error) {
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Produk',
      text: 'Tidak dapat memuat data produk. Silakan coba lagi.',
    })
  } finally {
    loadingProducts.value = false
  }
}

const handleAddInventory = async () => {
  if (!inventoryFormRef.value?.validate()) {
    return
  }

  addingInventory.value = true
  inventoryErrors.value = {}

  try {
    // Prepare the request body
    const requestBody = {
      branch_id: branch.value.id,
      product_id: inventoryFormData.value.product_id,
      current_stock: inventoryFormData.value.current_stock,
    }

    // Add optional fields if they have values
    if (inventoryFormData.value.reserved_stock !== null && inventoryFormData.value.reserved_stock !== undefined) {
      requestBody.reserved_stock = inventoryFormData.value.reserved_stock
    }
    if (inventoryFormData.value.min_stock_level !== null && inventoryFormData.value.min_stock_level !== undefined) {
      requestBody.min_stock_level = inventoryFormData.value.min_stock_level
    }
    if (inventoryFormData.value.max_stock_level !== null && inventoryFormData.value.max_stock_level !== undefined) {
      requestBody.max_stock_level = inventoryFormData.value.max_stock_level
    }

    const res = await $api('/wms/branch-inventory', {
      method: 'POST',
      body: requestBody,
    })

    await showSuccessAlert({
      title: 'Berhasil',
      text: 'Inventori cabang berhasil ditambahkan',
    })

    // Close dialog and refresh inventory data after a short delay
    setTimeout(() => {
      closeAddInventoryDialog()
      fetchInventory()
    }, 1000)
  } catch (error) {
    // Handle validation errors
    if (error.response?.data?.errors) {
      inventoryErrors.value = error.response.data.errors
    } else {
      await showErrorAlert(error, {
        title: 'Gagal Menambahkan Inventori',
        text: 'Tidak dapat menambahkan inventori cabang. Silakan coba lagi.',
      })
    }
  } finally {
    addingInventory.value = false
  }
}

const getDayLabel = (day) => {
  const dayLabels = {
    monday: 'Senin',
    tuesday: 'Selasa',
    wednesday: 'Rabu',
    thursday: 'Kamis',
    friday: 'Jumat',
    saturday: 'Sabtu',
    sunday: 'Minggu'
  }
  return dayLabels[day] || day
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'HIGH':
      return 'error'
    case 'MEDIUM':
      return 'warning'
    case 'LOW':
      return 'success'
    default:
      return 'default'
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

// Lifecycle
onMounted(async () => {
  // Add CSS for high z-index alert
  const style = document.createElement('style')
  style.textContent = `
    .swal2-container {
      z-index: 9999 !important;
    }
    .swal2-popup {
      z-index: 9999 !important;
    }
    .swal2-backdrop-show {
      z-index: 9998 !important;
    }
  `
  document.head.appendChild(style)
  
  // Fetch branch data
  await fetchBranch()
})
</script> 
