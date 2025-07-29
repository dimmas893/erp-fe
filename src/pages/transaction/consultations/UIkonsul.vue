<script setup>
import { $api } from '@/utils/api'
import { showErrorAlert } from '@/utils/errorHandler'
import 'video.js/dist/video-js.css'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { VCardItem } from 'vuetify/components'
import { VForm } from 'vuetify/components/VForm'

const route = useRoute()
const billingId = computed(() => route.query.billing_id)
const billingData = ref(null)
const loadingBilling = ref(false)
const treatments = ref([])
const products = ref([])
const loadingTreatments = ref(false)
const loadingProducts = ref(false)
const progressingConsultation = ref(false)
const completingConsultation = ref(false)

// Fetch billing data when component mounts
onMounted(async () => {
  if (billingId.value) {
    await Promise.all([
      fetchBillingData(),
      fetchTreatments(),
      fetchProducts()
    ])
  }
})

async function fetchBillingData() {
  loadingBilling.value = true
  try {
    const res = await $api(`/rme/visit-consultations/billing/${billingId.value}`, {
      method: 'GET',
    })
    billingData.value = res.data[0] // Get first consultation from array
    console.log('Consultation data loaded:', billingData.value)
    
    // Load abnormalities data if consultation ID exists
    if (billingData.value?.id) {
      await fetchAbnormalitiesData()
    }
  } catch (error) {
    console.error('Error fetching consultation data:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Konsultasi',
      text: 'Tidak dapat memuat data konsultasi. Silakan coba lagi.',
    })
  } finally {
    loadingBilling.value = false
  }
}

async function fetchAbnormalitiesData() {
  try {
    const res = await $api(`/rme/visit-consultations/${billingData.value.id}`, {
      method: 'GET',
    })
    
    // If abnormalities data exists, populate the points
    if (res.data?.visit_consultation_abnormalities && res.data.visit_consultation_abnormalities.length > 0) {
      points.value = res.data.visit_consultation_abnormalities.map((abnormality, index) => ({
        id: Date.now() + index,
        x: abnormality.x_coordinate,
        y: abnormality.y_coordinate,
        bagian: abnormality.body_part,
        catatan: abnormality.notes,
      }))
      console.log('Abnormalities data loaded:', points.value)
    }
    
    // If recommendations data exists, populate the selections
    if (res.data?.visit_recommendation_details && res.data.visit_recommendation_details.length > 0) {
      const treatmentIds = res.data.visit_recommendation_details
        .filter(rec => rec.item_type === 'TREATMENT')
        .map(rec => rec.item_id)
      const productIds = res.data.visit_recommendation_details
        .filter(rec => rec.item_type === 'PRODUCT')
        .map(rec => rec.item_id)
      
      selectedTreatments.value = treatmentIds
      selectedProducts.value = productIds
      console.log('Recommendations data loaded:', { treatments: treatmentIds, products: productIds })
    }
  } catch (error) {
    console.error('Error fetching abnormalities data:', error)
    // Don't show error alert for this as it's optional data
  }
}

async function fetchTreatments() {
  loadingTreatments.value = true
  try {
    const res = await $api('/crm/treatments', {
      method: 'GET',
    })
    treatments.value = res.data || []
    console.log('Treatments loaded:', treatments.value.length)
  } catch (error) {
    console.error('Error fetching treatments:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Treatment',
      text: 'Tidak dapat memuat data treatment. Silakan coba lagi.',
    })
  } finally {
    loadingTreatments.value = false
  }
}

async function fetchProducts() {
  loadingProducts.value = true
  try {
    const res = await $api('/wms/products', {
      method: 'GET',
    })
    products.value = res.data || []
    console.log('Products loaded:', products.value.length)
  } catch (error) {
    console.error('Error fetching products:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Product',
      text: 'Tidak dapat memuat data product. Silakan coba lagi.',
    })
  } finally {
    loadingProducts.value = false
  }
}
const panelStatus = ref(0)

const selectedTreatments = ref([])
const selectedProducts = ref([])
const careRecommendation = ref('')

const treatmentOptions = computed(() => {
  return treatments.value.map(treatment => ({
    title: `${treatment.name} (${treatment.code})`,
    value: treatment.id
  }))
})

const productOptions = computed(() => {
  return products.value.map(product => ({
    title: `${product.name} (${product.sku})`,
    value: product.id
  }))
})

const states = [
  'PRP Treatment',
  'Laser Co2',
  'American Samoa',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District of Columbia',
  'Federated States of Micronesia',
  'Florida',
  'Georgia',
  'Guam',
]

const jenisOption = [
  {
    id: 1,
    nama_jenis:'Normal',
  },
  {
    id: 2,
    nama_jenis:'Kering',
  },
]

const kepekaanOption = [
  {
    id: 1,
    nama_kepekaan:'I',
  },
  {
    id: 2,
    nama_kepekaan:'II',
  },
]

const warnaOption = [
  {
    id: 1,
    nama_warna:'Merata',
  },
  {
    id: 2,
    nama_warna:'Tidak Merata',
  },
]

const kelembabanOption = [
  {
    id: 1,
    nama_lembab:'Rendah',
  },
  {
    id: 2,
    nama_lembab:'Sedang',
  },
]

const kekuatanOption = [
  {
    id: 1,
    nama_kekuatan:'Rendah',
  },
  {
    id: 2,
    nama_kekuatan:'Sedang',
  },
]

// konsultasi
const kesehatan = ref('')
const kontra = ref('')
const gayaHidup = ref('')
const perawatan = ref('')

//analisa
const jenisKulit = ref(null)
const kepekaan = ref(null)
const warnaKulit = ref(null)
const kelembabanKulit = ref(null)
const kekuatanKulit = ref(null)

// Watch for billing data changes and populate form fields
watch(billingData, (newData) => {
  if (newData) {
    kesehatan.value = newData.health || ''
    kontra.value = newData.contraindications || ''
    gayaHidup.value = newData.lifestyle || ''
    perawatan.value = newData.skincare_routine || ''
    careRecommendation.value = newData.care_recommendation || ''
    
    // Helper function to get ID from string value
    const getIdFromString = (stringValue, options) => {
      if (!stringValue) return null
      const option = options.find(opt => 
        opt.nama_jenis === stringValue || 
        opt.nama_kepekaan === stringValue || 
        opt.nama_warna === stringValue || 
        opt.nama_lembab === stringValue || 
        opt.nama_kekuatan === stringValue
      )
      return option ? option.id : null
    }
    
    // Set skin analysis data
    jenisKulit.value = getIdFromString(newData.skin_type, jenisOption)
    kepekaan.value = getIdFromString(newData.skin_sensitivity, kepekaanOption)
    warnaKulit.value = getIdFromString(newData.skin_tone, warnaOption)
    kelembabanKulit.value = getIdFromString(newData.skin_moisture, kelembabanOption)
    kekuatanKulit.value = getIdFromString(newData.skin_strength, kekuatanOption)
    
    // Load recommendations if they exist
    if (newData.visit_recommendation_details && newData.visit_recommendation_details.length > 0) {
      const treatmentIds = newData.visit_recommendation_details
        .filter(rec => rec.item_type === 'TREATMENT')
        .map(rec => rec.item_id)
      const productIds = newData.visit_recommendation_details
        .filter(rec => rec.item_type === 'PRODUCT')
        .map(rec => rec.item_id)
      
      selectedTreatments.value = treatmentIds
      selectedProducts.value = productIds
      console.log('Recommendations loaded from watch:', { treatments: treatmentIds, products: productIds })
    }
  }
}, { immediate: true })

// const refForm = ref<VForm>()
// anatomi
const points = ref([])

const imageRef = ref(null)
const imageContainer = ref(null)

const requiredRule = v => !!v || 'Wajib diisi'

// Form submission
async function submitForm() {
  try {
    // Helper function to get string value from ID
    const getStringValue = (id, options) => {
      if (!id) return null
      const option = options.find(opt => opt.id === id)
      return option ? option.nama_jenis || option.nama_kepekaan || option.nama_warna || option.nama_lembab || option.nama_kekuatan : null
    }

    const requestBody = {
      doctor_id: billingData.value?.doctor_id || 1,
      billing_id: billingId.value,
      consultation_notes: "Updated consultation notes",
      health: kesehatan.value,
      contraindications: kontra.value,
      lifestyle: gayaHidup.value,
      skincare_routine: perawatan.value,
      skin_type: getStringValue(jenisKulit.value, jenisOption),
      skin_sensitivity: getStringValue(kepekaan.value, kepekaanOption),
      skin_tone: getStringValue(warnaKulit.value, warnaOption),
      skin_moisture: getStringValue(kelembabanKulit.value, kelembabanOption),
      skin_strength: getStringValue(kekuatanKulit.value, kekuatanOption),
      care_recommendation: careRecommendation.value || "Patient should follow a daily skincare routine including gentle cleansing, moisturizing, and sun protection. Avoid direct sun exposure and use recommended products as directed.",
      abnormalities: points.value.map(point => ({
        x_coordinate: point.x,
        y_coordinate: point.y,
        body_part: point.bagian,
        notes: point.catatan
      })),
      rekomendasi_details: [
        ...selectedTreatments.value.map(treatmentId => ({
          doctor_id: billingData.value?.doctor_id || 1,
          item_type: "TREATMENT",
          item_id: treatmentId,
          is_active: true
        })),
        ...selectedProducts.value.map(productId => ({
          doctor_id: billingData.value?.doctor_id || 1,
          item_type: "PRODUCT",
          item_id: productId,
          is_active: true
        }))
      ]
    }

    console.log('Submitting consultation data:', requestBody)
    
    const res = await $api(`/rme/visit-consultations/${billingData.value.id}`, {
      method: 'PATCH',
      body: requestBody,
    })
    
    console.log('Consultation updated successfully:', res)
    await showComingSoonAlert('Submit Konsultasi')
    
  } catch (error) {
    console.error('Error updating consultation:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memperbarui Konsultasi',
      text: 'Tidak dapat memperbarui data konsultasi. Silakan coba lagi.',
    })
  }
}

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

// Progress consultation
async function progressConsultation() {
  if (!billingData.value) return

  progressingConsultation.value = true
  console.log('🔄 Starting progressConsultation...')

  try {
    await showComingSoonAlert('Progress Konsultasi')

    console.log('✅ Consultation progress alert shown')
  } catch (error) {
    console.error('❌ Error showing progress alert:', error)
  } finally {
    progressingConsultation.value = false
    console.log('🏁 progressConsultation completed')
  }
}

// Complete consultation
async function completeConsultation() {
  if (!billingData.value) return

  completingConsultation.value = true
  console.log('🔄 Starting completeConsultation...')

  try {
    await showComingSoonAlert('Selesai Konsultasi')

    console.log('✅ Consultation complete alert shown')
  } catch (error) {
    console.error('❌ Error showing complete alert:', error)
  } finally {
    completingConsultation.value = false
    console.log('🏁 completeConsultation completed')
  }
}
</script>

<template> 
  <VForm ref="refForm" @submit.prevent="() => {}">
  <VCard v-if="loadingBilling">
    <VCardText class="text-center py-12">
      <VProgressCircular
        indeterminate
        color="primary"
        size="64"
      />
      <p class="mt-4">Memuat data billing...</p>
    </VCardText>
  </VCard>
  
  <VCard v-else-if="billingData">
    <VCardTitle class="d-flex align-center justify-space-between pa-4">
      <div class="d-flex align-center gap-3">
        <VIcon
          size="28"
          color="primary"
        >
          tabler-stethoscope
        </VIcon>
        <div>
          <h2 class="text-h5 mb-1">
            Konsultasi Dokter
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Billing: {{ billingData?.billing?.billing_number }}
          </p>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Visit: {{ billingData?.visit?.visit_number }}
          </p>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Doctor: {{ billingData?.doctor?.name }}
          </p>
        </div>
      </div>
      <div class="d-flex gap-2">
        <VBtn v-if="billingData && !billingData.completed_at" color="warning" prepend-icon="tabler-player-play" :loading="progressingConsultation"
          @click="progressConsultation">
          Progress
        </VBtn>
        <VBtn v-if="billingData && !billingData.completed_at" color="success" prepend-icon="tabler-check" :loading="completingConsultation"
          @click="completeConsultation">
          Selesai
        </VBtn>
      </div>
    </VCardTitle>
    </VCard>
  
  <VRow v-if="billingData">
  
    <VCol class="mt-2"
      cols="12"
      md="8"
    >
      <VCard>
        <VCardItem
          title="Konsultasi dan Analisa Kulit Wajah"
          class="pb-6"
        >
          <template #subtitle>
            <div class="text-body-1">
              <span class="text-h6 d-inline-block"> {{ billingData?.doctor?.name || 'Loading...' }}</span>
            </div>
          </template>
          <template #append>
            <div class="d-flex gap-4 align-center">
              <VChip
                variant="tonal"
                color="error"
                size="small"
              >
               {{ billingData?.created_at ? new Date(billingData.created_at).toLocaleDateString('id-ID') : 'Loading...' }}
              </VChip>
              
            </div>
          </template>
        </VCardItem>
        <VCardText>
          <VCard
            flat
            border
          >
            <h4 class="mx-3 mt-2">Konsultasi</h4>
            <VCardText>
             
                <VRow>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <AppTextField
                      v-model="kesehatan"
                      label="Data Kesehatan"
                      placeholder="ex:Tidak memiliki riwayat alergi"
                      :rules="[requiredValidator]"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <AppTextField
                      v-model="kontra"
                      label="Kontra Indikasi Perawatan"
                      placeholder="ex:Tidak ada"
                      :rules="[requiredValidator]"
                    />
                  </VCol>

                   <VCol
                    cols="12"
                    md="6"
                  >
                    <AppTextField
                      v-model="gayaHidup"
                      label="Gaya Hidup"
                      placeholder="ex:Sering terpapar sinar matahari"
                      :rules="[requiredValidator]"
                    />
                  </VCol>

                   <VCol
                    cols="12"
                    md="6"
                  >
                    <AppTextField
                      v-model="perawatan"
                      label="Perawatan Harian"
                      placeholder="ex:facewash, sunscreen, pelembab"
                      :rules="[requiredValidator]"
                    />
                  </VCol>
                </VRow>
             
            </VCardText>
             <h4 class="mx-3 mt-2">Analisa Kulit Wajah</h4>
            <VCardText>
             
                <VRow>
                  <VCol
                    cols="12"
                    md="6"
                  >
                     <AppSelect
                      v-model="jenisKulit"
                      :items="jenisOption" item-title="nama_jenis" item-value="id"
                      :menu-props="{ maxHeight: '400' }"
                      label="Jenis Kulit"
                      persistent-hint
                      placeholder="Select Skin Type"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                     <AppSelect
                      v-model="kepekaan"
                      :items="kepekaanOption" item-title="nama_kepekaan" item-value="id"
                      :menu-props="{ maxHeight: '400' }"
                      label="Kepekaan UV"
                      persistent-hint
                      placeholder="Select UV Sensitivity"
                    />
                  </VCol>

                   <VCol
                    cols="12"
                    md="6"
                  >
                    <AppSelect
                    v-model="warnaKulit"
                    :items="warnaOption" item-title="nama_warna" item-value="id"
                    :menu-props="{ maxHeight: '400' }"
                    label="Warna Kulit"
                    persistent-hint
                    placeholder="Select Skin Color"
                  />
                  </VCol>

                   <VCol
                    cols="12"
                    md="6"
                  >
                     <AppSelect
                      v-model="kelembabanKulit"
                      :items="kelembabanOption" item-title="nama_lembab" item-value="id"
                      :menu-props="{ maxHeight: '400' }"
                      label="Kelembaban Kulit"
                      persistent-hint
                      placeholder="Select Skin Moisture"
                  />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                     <AppSelect
                      v-model="kekuatanKulit"
                      :items="kekuatanOption" item-title="nama_kekuatan" item-value="id"
                      :menu-props="{ maxHeight: '400' }"
                      label="Kekuatan Kulit"
                      persistent-hint
                      placeholder="Select Skin Strength"
                  />
                  </VCol>

                   
                  <VRow cols="12">
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
                      <VSheet
                        class="overflow-y-auto"
                        max-height="500"
                        rounded
                        elevation="1"
                      >
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
                            <VTextField class="mt-2"
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
                      </VSheet>
                    </VCol>
                    </VRow>
                </VRow>
             
            </VCardText>
          </VCard>
        </VCardText>
      </VCard>
    </VCol>

    <VCol class="mt-2"
      cols="12"
      md="4"
    > 
    <div class="course-content">
      <VCard>
        <VCardItem
          title="Rekomendasi Treatment"
          class="pb-6"
        >
           <AppSelect
              v-model="selectedTreatments"
              :items="treatmentOptions"
              :menu-props="{ maxHeight: '400' }"
              label=""
              multiple
              persistent-hint
              placeholder="Select Treatment"
              :loading="loadingTreatments"
            />
        </VCardItem>

         <VCardItem
          title="Rekomendasi Product"
          class="pb-6"
        >
           <AppSelect
              v-model="selectedProducts"
              :items="productOptions"
              :menu-props="{ maxHeight: '400' }"
              label=""
              multiple
              persistent-hint
              placeholder="Select Product"
              :loading="loadingProducts"
            />
        </VCardItem>
        <VCardItem
          title="Saran Perawatan"
          class="pb-6"
        >
          <AppTextarea
            v-model="careRecommendation"
            label="Saran Perawatan"
            placeholder="Masukkan saran perawatan untuk pasien..."
            rows="4"
          />
       </VCardItem>
         <VCol cols="12" class="w-full justify-end d-flex">
            <VBtn
                type="submit"
                @click="submitForm"
                :loading="loadingBilling"
            >
              Submit
            </VBtn>
          </VCol>
      </VCard>
    </div>
  
    </VCol>
  
   
  </VRow>
  </VForm>  
</template>

<style lang="scss" scoped>
.course-content {
  position: sticky;
  inset-block: 4rem 0;
}

.card-list {
  --v-card-list-gap: 16px;
}
</style>

<style lang="scss">
@use "@layouts/styles/mixins" as layoutsMixins;

body .v-layout .v-application__wrap {
  .course-content {
    .v-expansion-panels {
      border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
      border-radius: 6px;

      .v-expansion-panel {
        &--active {
          .v-expansion-panel-title--active {
            border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

            .v-expansion-panel-title__overlay {
              opacity: var(--v-hover-opacity) !important;
            }
          }
        }

        .v-expansion-panel-title {
          .v-expansion-panel-title__overlay {
            background-color: rgba(var(--v-theme-on-surface));
            opacity: var(--v-hover-opacity) !important;
          }

          &:hover {
            .v-expansion-panel-title__overlay {
              opacity: var(--v-hover-opacity) !important;
            }
          }

          &__icon {
            .v-icon {
              block-size: 1.5rem !important;
              color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
              font-size: 1.5rem !important;
              inline-size: 1.5rem !important;

              @include layoutsMixins.rtl {
                transform: scaleX(-1);
              }
            }
          }
        }

        .v-expansion-panel-text {
          &__wrapper {
            padding-block: 1rem;
            padding-inline: 0.75rem;
          }
        }
      }
    }
  }

  .card-list {
    .v-list-item__prepend {
      .v-list-item__spacer {
        inline-size: 8px !important;
      }
    }
  }
}
</style>
