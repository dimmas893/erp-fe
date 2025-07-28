<template>
  <div>
    <!-- Search Cards Section -->
    <VRow class="mb-6">
      <!-- Search by NIK Card -->
      <VCol
        cols="12"
        md="6"
      >
        <VCard class="h-100">
          <VCardTitle class="d-flex align-center gap-2">
            <VIcon color="primary">
              tabler-id-badge-2
            </VIcon>
            <span>Cari Pasien SatuSehat by NIK</span>
          </VCardTitle>
          <VCardText>
            <div class="d-flex justify-center mb-3">
              <VImg :src="satusehatnik" width="200px" height="200px"/>
            </div>
            <VForm
              ref="nikForm"
              @submit.prevent="searchByNIK"
            >
              <VTextField
                v-model="searchNIK"
                label="Masukkan NIK"
                placeholder="3212121007331111"
                :loading="loadingNIK"
                :disabled="loadingNIK"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="tabler-id"
                :rules="nikValidationRules"
                maxlength="16"
                @keyup.enter="searchByNIK"
              />
              <VBtn
                type="submit"
                color="primary"
                :loading="loadingNIK"
                :disabled="!searchNIK || searchNIK.length !== 16"
                block
                class="mt-3"
              >
                <VIcon start>
                  tabler-search
                </VIcon>
                Cari by NIK
              </VBtn>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Search by ID Card -->
      <VCol
        cols="12"
        md="6"
      >
        <VCard class="h-100">
          <VCardTitle class="d-flex align-center gap-2">
            <VIcon color="success">
              tabler-medical-cross
            </VIcon>
            <span>Cari Pasien SatuSehat by ID</span>
          </VCardTitle>
           <div class="d-flex justify-center">
              <VImg :src="satusehatid" width="200px" height="200px"/>
            </div>
          <VCardText>
            <VForm
              ref="idForm"
              @submit.prevent="searchByID"
            >
              <VTextField
                v-model="searchID"
                label="Masukkan ID SatuSehat"
                placeholder="P20394967103"
                :loading="loadingID"
                :disabled="loadingID"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="tabler-hash"
                :rules="idValidationRules"
                @keyup.enter="searchByID"
              />
              <VBtn
                type="submit"
                color="success"
                :loading="loadingID"
                :disabled="!searchID"
                block
                class="mt-3"
              >
                <VIcon start>
                  tabler-search
                </VIcon>
                Cari by ID
              </VBtn>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Search Results Card -->
    <VCard
      v-if="searchResult"
      class="mb-6"
    >
      <VCardTitle class="d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-2">
          <VIcon color="info">
            tabler-user-check
          </VIcon>
          <span>Hasil Pencarian</span>
        </div>
        <VBtn
          variant="text"
          color="error"
          size="small"
          @click="clearSearchResult"
        >
          <VIcon>tabler-x</VIcon>
        </VBtn>
      </VCardTitle>
      <VCardText>
        <VAlert
          v-if="searchResult.error"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ searchResult.error }}
        </VAlert>
        <div v-else-if="searchResult.data">
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <VList>
                <VListItem>
                  <VListItemTitle>ID SatuSehat</VListItemTitle>
                  <VListItemSubtitle>{{ searchResult.data.id || '-' }} 
                    <VBtn
                    size="small"
                    icon="tabler-copy"
                    variant="text"
                    @click="copyToClipboard(searchResult.data.id)"
                    class="ml-2"
                    color="primary"
                  />
                  </VListItemSubtitle>
                  
                </VListItem>
                <VListItem>
                  <VListItemTitle>Nama</VListItemTitle>
                  <VListItemSubtitle>{{ searchResult.data.name || '-' }}</VListItemSubtitle>
                </VListItem>
                <VListItem>
                  <VListItemTitle>NIK</VListItemTitle>
                  <VListItemSubtitle>{{ searchResult.data.nik || '-' }}</VListItemSubtitle>
                </VListItem>
              </VList>
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VList>
                <VListItem>
                  <VListItemTitle>IHS Number</VListItemTitle>
                  <VListItemSubtitle>{{ searchResult.data.ihs_number || '-' }}</VListItemSubtitle>
                </VListItem>
                <VListItem>
                  <VListItemTitle>Status</VListItemTitle>
                  <VListItemSubtitle>
                    <VChip 
                      :color="searchResult.data.active ? 'success' : 'error'" 
                      size="small" 
                      label
                    >
                      {{ searchResult.data.active ? 'Aktif' : 'Tidak Aktif' }}
                    </VChip>
                  </VListItemSubtitle>
                </VListItem>
                <VListItem>
                  <VListItemTitle>Terakhir Update</VListItemTitle>
                  <VListItemSubtitle>{{ formatDateTime(searchResult.data.lastUpdated) }}</VListItemSubtitle>
                </VListItem>
              </VList>
            </VCol>
          </VRow>
        </div>
      </VCardText>
    </VCard>

     <VSnackbar location="bottom end" v-model="copied" color="success" timeout="2000">
        Teks berhasil disalin!
      </VSnackbar>
  </div>
</template>

<script setup>
// Add definePage for navigation
definePage({
  meta: {
    navActiveLink: 'satusehat-pasien',
  },
})

import { $api } from '@/utils/api';
import satusehatid from '@images/logos/satusehat-id.png';
import satusehatnik from '@images/logos/satusehat-nik.png';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const copied = ref(false)

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    copied.value = true
  }).catch(err => {
    console.error('Gagal menyalin:', err)
  })
}
// Debug navigation state
onMounted(() => {
  console.log('🔍 SatuSehat Pasien Page Debug Info:')
  console.log('📍 Current Route:', route)
  console.log('📍 Route Name:', route.name)
  console.log('📍 Route Path:', route.path)
  console.log('📍 Route Matched:', route.matched)
})

// Watch route changes for debugging
watch(() => route.name, (newName, oldName) => {
  console.log(`🔄 Route changed from ${oldName} to ${newName}`)
}, { immediate: true })

// Search functionality state
const searchNIK = ref('')
const searchID = ref('')
const loadingNIK = ref(false)
const loadingID = ref(false)
const searchResult = ref(null)

// Form refs
const nikForm = ref(null)
const idForm = ref(null)

// Form submission states
const nikSubmitted = ref(false)
const idSubmitted = ref(false)

// Validation rules that only activate after submission
const nikValidationRules = computed(() => {
  if (!nikSubmitted.value) return []
  
  return [
    v => !!v || 'NIK wajib diisi',
    v => v.length === 16 || 'NIK harus 16 digit',
  ]
})

const idValidationRules = computed(() => {
  if (!idSubmitted.value) return []
  
  return [
    v => !!v || 'ID SatuSehat wajib diisi',
  ]
})

// Search functions
async function searchByNIK() {
  nikSubmitted.value = true
  
  // Validate form
  const { valid } = await nikForm.value.validate()
  if (!valid) return

  loadingNIK.value = true
  searchResult.value = null

  try {
    const result = await $api(`/satu-sehat/patient-by-nik?nik=${searchNIK.value}`, {
      method: 'GET',
    })
    
    if (result.response_code === 200) {
      searchResult.value = { data: result.data }
    } else {
      searchResult.value = { error: result.response_message || 'Gagal mencari pasien' }
    }
  } catch (error) {
    console.error('Error searching by NIK:', error)
    searchResult.value = { error: 'Terjadi kesalahan saat mencari pasien' }
  } finally {
    loadingNIK.value = false
  }
}

async function searchByID() {
  idSubmitted.value = true
  
  // Validate form
  const { valid } = await idForm.value.validate()
  if (!valid) return

  loadingID.value = true
  searchResult.value = null

  try {
    const result = await $api(`/satu-sehat/patient-by-id/${searchID.value}`, {
      method: 'GET',
    })
    
    if (result.response_code === 200) {
      searchResult.value = { data: result.data }
    } else {
      searchResult.value = { error: result.response_message || 'Gagal mencari pasien' }
    }
  } catch (error) {
    console.error('Error searching by ID:', error)
    searchResult.value = { error: 'Terjadi kesalahan saat mencari pasien' }
  } finally {
    loadingID.value = false
  }
}

function clearSearchResult() {
  searchResult.value = null
  searchNIK.value = ''
  searchID.value = ''

  // Reset form validation states
  nikSubmitted.value = false
  idSubmitted.value = false
  nikForm.value?.resetValidation()
  idForm.value?.resetValidation()
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}
</script>

<style scoped>
.v-table {
  width: 100%;
  border-collapse: collapse;
}

.v-table th, .v-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.v-table th {
  background: #f5f5f5;
}

.text-center {
  text-align: center;
}
</style>
