<template>
  <div class="d-flex gap-2 mt-6">
    <VSpacer />
    <VBtn
      variant="outlined"
      :disabled="submitting"
      @click="$emit('cancel')"
    >
      Batal
    </VBtn>
    <VBtn
      color="primary"
      :loading="submitting"
      :disabled="!isFormValid"
      @click="$emit('submit')"
    >
      {{ submitting ? 'Menyimpan...' : 'Simpan' }}
    </VBtn>
  </div>
</template>

<script setup>
defineProps({
  submitting: {
    type: Boolean,
    default: false
  },
  isFormValid: {
    type: Boolean,
    default: false
  }
})

defineEmits(['submit', 'cancel'])
</script> 
