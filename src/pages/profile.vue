<template>
  <div class="profile-fullpage-wrapper px-2 px-md-8 py-8">
    <VOverlay
      :model-value="loading"
      class="z-10"
      persistent
    >
      <VProgressCircular
        indeterminate
        size="48"
        color="primary"
      />
    </VOverlay>
    <div class="d-flex align-center gap-4 mb-6">
      <VAvatar
        size="72"
        color="primary"
      >
        <VIcon size="40">
          tabler-user
        </VIcon>
      </VAvatar>
      <div>
        <h2 class="text-h4 font-weight-bold mb-1 mb-sm-0">
          {{ profile?.name || '-' }}
        </h2>
        <div class="text-medium-emphasis">
          {{ profile?.email }}
        </div>
      </div>
    </div>
    <VRow
      v-if="profile"
      class="mb-2"
    >
      <VCol
        cols="12"
        md="6"
      >
        <div class="text-medium-emphasis mb-1">
          User ID
        </div>
        <div class="mb-3 text-h6">
          {{ profile.id }}
        </div>
        <div class="text-medium-emphasis mb-1">
          Email
        </div>
        <div class="mb-3">
          {{ profile.email }}
        </div>
        <div class="text-medium-emphasis mb-1">
          Tanggal Dibuat
        </div>
        <div class="mb-3">
          {{ formatDateTime(profile.createdAt) }}
        </div>
        <div class="text-medium-emphasis mb-1">
          Terakhir Update
        </div>
        <div class="mb-3">
          {{ formatDateTime(profile.updatedAt) }}
        </div>
      </VCol>
    </VRow>
    <VAlert
      v-else
      type="error"
      class="ma-6"
    >
      Data profile tidak ditemukan.
    </VAlert>
  </div>
</template>

<script setup>
import { $api } from '@/utils/api'
import { onMounted, ref } from 'vue'

const profile = ref(null)
const loading = ref(true)

async function fetchProfile() {
  loading.value = true
  try {
    const res = await $api('/auth/profile')

    profile.value = res.data
  } catch (e) {
    profile.value = null
  } finally {
    loading.value = false
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleString('id-ID')
}

onMounted(fetchProfile)
</script>

<style scoped>
.profile-fullpage-wrapper {
  max-width: 600px;
  margin: 0 auto;
}
</style> 
