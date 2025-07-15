<script setup>
const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },

  // Tambahan agar bisa dikontrol dari luar jika ingin menampilkan meta
  showMeta: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:page'])

const updatePage = value => {
  emit('update:page', value)
}
</script>

<template>
  <div>
    <VDivider />
    <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 px-6 py-3">
      <!-- Hapus info meta di sini, biar hanya muncul jika memang ingin -->
      <VPagination
        :model-value="page"
        active-color="primary"
        :length="Math.ceil(totalItems / itemsPerPage)"
        :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalItems / itemsPerPage), 5)"
        @update:model-value="updatePage"
      />
    </div>
  </div>
</template>
