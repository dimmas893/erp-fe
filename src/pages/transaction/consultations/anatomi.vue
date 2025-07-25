<template>
  <VCard class="pa-4">
    <h4 class="mb-4">ANATOMI WAJAH</h4>

    <VRow>
        <VCol cols="6">
            <div
      class="position-relative"
      ref="imageContainer"
      @click="addPoint"
    >
      <!-- Gambar anatomi -->
      <img
        src="@images/anatomi.png"
        alt="Anatomi Wajah"
        class="w-100"
        ref="imageRef"
      />

      <!-- Pin-poin di atas gambar -->
      <div
        v-for="(point, index) in points"
        :key="point.id"
        class="position-absolute d-flex align-center justify-center rounded-circle bg-primary text-white"
        :style="{
          top: `${point.y}%`,
          left: `${point.x}%`,
          width: '32px',
          height: '32px',
          transform: 'translate(-50%, -50%)',
        }"
      >
        {{ index + 1 }}
      </div>
    </div>
        </VCol>
        <VCol cols="6">
            <div v-for="(point, index) in points" :key="point.id" class="mt-6">
            <VCard class="pa-4 mb-4">
                <div class="d-flex justify-space-between">
                <div class="font-weight-bold">Titik {{ index + 1 }}</div>
                <VBtn icon @click="removePoint(index)">
                    <VIcon>tabler-trash</VIcon>
                </VBtn>
                </div>

                <VTextField
                v-model="point.bagian"
                label="Bagian tubuh..."
                :rules="[requiredRule]"
                class="mt-3"
                />
                <VTextField
                v-model="point.catatan"
                label="Catatan..."
                />

                <VAlert
                v-if="!point.bagian"
                type="error"
                class="mt-2"
                dense
                >
                Data titik ini wajib diisi
                </VAlert>
            </VCard>
            </div>
        </VCol>
    </VRow>    

    <!-- Form input per titik -->
    
  </VCard>
</template>

<script setup>
import { ref } from 'vue'
import { VAlert, VBtn, VCard, VIcon, VTextField } from 'vuetify/components'

const points = ref([])

const imageRef = ref(null)
const imageContainer = ref(null)

const requiredRule = v => !!v || 'Wajib diisi'

// Fungsi menambahkan titik dari klik
function addPoint(event) {
  const rect = imageContainer.value.getBoundingClientRect()

  const offsetX = event.clientX - rect.left
  const offsetY = event.clientY - rect.top

  const percentX = (offsetX / rect.width) * 100
  const percentY = (offsetY / rect.height) * 100

  points.value.push({
    id: Date.now(),
    x: percentX,
    y: percentY,
    bagian: '',
    catatan: '',
  })
}

// Hapus titik
const removePoint = index => {
  points.value.splice(index, 1)
}
</script>

<style scoped>
.position-relative {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.position-absolute {
  position: absolute;
  cursor: pointer;
  font-size: 14px;
}
</style>
