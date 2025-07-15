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
  
  return new Date(dateStr).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(fetchProfile)
</script>

<template>
  <div class="profile-container">
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
    
    <VContainer class="py-8">
      <VRow justify="center">
        <VCol
          cols="12"
          md="8"
          lg="6"
        >
          <!-- Header -->
          <div class="text-center mb-8">
            <VAvatar
              size="80"
              color="primary"
              class="mb-4"
            >
              <VIcon size="40">
                tabler-user
              </VIcon>
            </VAvatar>
            <h1 class="text-h4 font-weight-medium mb-2">
              {{ profile?.name || '-' }}
            </h1>
            <p class="text-body-1 text-medium-emphasis">
              {{ profile?.email }}
            </p>
          </div>

          <!-- Content -->
          <VCard
            v-if="profile"
            flat
            border
            class="pa-6"
          >
            <h2 class="text-h5 mb-4">
              Informasi Profil
            </h2>
            
            <VRow>
              <VCol
                cols="12"
                sm="6"
                class="py-2"
              >
                <div class="d-flex align-center mb-2">
                  <VIcon
                    size="18"
                    color="primary"
                    class="me-2"
                  >
                    tabler-id
                  </VIcon>
                  <span class="text-body-2 text-medium-emphasis">User ID</span>
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ profile.id }}
                </div>
              </VCol>
              
              <VCol
                cols="12"
                sm="6"
                class="py-2"
              >
                <div class="d-flex align-center mb-2">
                  <VIcon
                    size="18"
                    color="primary"
                    class="me-2"
                  >
                    tabler-mail
                  </VIcon>
                  <span class="text-body-2 text-medium-emphasis">Email</span>
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ profile.email }}
                </div>
              </VCol>
              
              <VCol
                cols="12"
                sm="6"
                class="py-2"
              >
                <div class="d-flex align-center mb-2">
                  <VIcon
                    size="18"
                    color="primary"
                    class="me-2"
                  >
                    tabler-calendar-plus
                  </VIcon>
                  <span class="text-body-2 text-medium-emphasis">Tanggal Dibuat</span>
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ formatDateTime(profile.createdAt) }}
                </div>
              </VCol>
              
              <VCol
                cols="12"
                sm="6"
                class="py-2"
              >
                <div class="d-flex align-center mb-2">
                  <VIcon
                    size="18"
                    color="primary"
                    class="me-2"
                  >
                    tabler-calendar-event
                  </VIcon>
                  <span class="text-body-2 text-medium-emphasis">Terakhir Update</span>
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ formatDateTime(profile.updatedAt) }}
                </div>
              </VCol>
            </VRow>
          </VCard>
          
          <VAlert
            v-else
            type="error"
            class="mt-6"
          >
            Data profile tidak ditemukan
          </VAlert>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-surface));
}
</style>
