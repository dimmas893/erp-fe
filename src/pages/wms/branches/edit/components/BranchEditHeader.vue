<template>
  <div class="d-flex align-center justify-space-between mb-6">
    <div class="d-flex align-center gap-4">
      <VAvatar
        size="72"
        color="primary"
      >
        <VIcon size="40">
          tabler-edit
        </VIcon>
      </VAvatar>
      <div class="flex-grow-1">
        <h2 class="text-h4 font-weight-bold mb-1">
          Edit Cabang
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
        variant="outlined"
        color="secondary"
        prepend-icon="tabler-arrow-left"
        @click="$emit('back')"
      >
        Kembali
      </VBtn>
    </div>
  </div>
</template>

<script setup>
defineProps({
  branch: {
    type: Object,
    required: true
  }
})

defineEmits(['back'])
</script> 
