<template>
  <VCardText>
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
        @click="$emit('back-to-list')"
      >
        Kembali Ke Daftar
      </VBtn>
    </div>
  </VCardText>
</template>

<script setup>
defineEmits(['back-to-list'])
</script> 
