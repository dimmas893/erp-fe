<route lang="yaml">
meta:
  layout: default
  navActiveLink: hris-departments
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

    <VCardText v-else-if="department">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center gap-4">
          <VAvatar
            size="72"
            color="primary"
          >
            <VIcon size="40">
              tabler-building
            </VIcon>
          </VAvatar>
          <div class="flex-grow-1">
            <h2 class="text-h4 font-weight-bold mb-1">
              {{ department.name }}
            </h2>
            <div class="d-flex align-center gap-2">
              <VChip
                color="primary"
                size="small"
                variant="outlined"
              >
                {{ department.code }}
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
            :to="{ name: 'hris-departments' }"
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
        Informasi Departemen
      </h3>
      
      <VRow class="mb-6">
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Nama Departemen
            </div>
            <div class="text-h6 font-weight-medium">
              {{ department.name }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Kode Departemen
            </div>
            <div class="text-h6 font-weight-medium">
              {{ department.code }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Deskripsi
            </div>
            <div class="text-h6 font-weight-medium">
              {{ department.description || '-' }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Manager
            </div>
            <div v-if="department.manager" class="d-flex align-center gap-2">
              <VChip
                color="primary"
                size="small"
                variant="tonal"
              >
                {{ department.manager.name }}
              </VChip>
              <span class="text-h6 font-weight-medium">{{ department.manager.email }}</span>
            </div>
            <div v-else-if="department.manager_id" class="text-h6 font-weight-medium">
              Manager ID: {{ department.manager_id }}
            </div>
            <div v-else class="text-h6 font-weight-medium text-medium-emphasis">
              -
            </div>
          </div>
          

        </VCol>
        
        <VCol
          cols="12"
          md="6"
        >
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Dibuat
            </div>
            <div class="text-h6 font-weight-medium">
              {{ formatDateTime(department.created_at) }}
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-medium-emphasis mb-1">
              Tanggal Diperbarui
            </div>
            <div class="text-h6 font-weight-medium">
              {{ formatDateTime(department.updated_at) }}
            </div>
          </div>
        </VCol>
      </VRow>

      <!-- Action Buttons -->
      <VDivider class="my-6" />
      <div class="d-flex gap-3 justify-end">
        <VBtn
          variant="outlined"
          color="secondary"
          :to="{ name: 'hris-departments' }"
        >
          Kembali ke Daftar
        </VBtn>
      </div>
    </VCardText>

    <!-- Error State -->
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
          Departemen tidak ditemukan
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Departemen yang Anda cari tidak ditemukan atau telah dihapus.
        </p>
        <VBtn
          color="primary"
          variant="tonal"
          :to="{ name: 'hris-departments' }"
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
const department = ref(null)

// Functions
async function fetchDepartment() {
  loading.value = true
  
  try {
    console.log('🔄 Fetching department with ID:', route.params.id)
    
    const res = await $api(`/hris/departments/${route.params.id}`, {
      method: 'GET',
    })
    
    console.log('📥 API Response:', res)
    
    if (res.data) {
      department.value = res.data
    } else {
      department.value = null
    }
    
    console.log('✅ Department loaded:', department.value)
  } catch (error) {
    console.error('❌ Error fetching department:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Departemen',
      text: 'Tidak dapat memuat data departemen. Silakan coba lagi.',
    })
    department.value = null
  } finally {
    loading.value = false
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

// Initialize
onMounted(() => {
  console.log('🚀 Component onMounted triggered')
  fetchDepartment()
})
</script>

<style scoped>
.v-card-text {
  padding: 24px;
}

.v-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.text-medium-emphasis {
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.font-weight-medium {
  font-weight: 500;
}

.font-weight-bold {
  font-weight: 700;
}
</style> 
