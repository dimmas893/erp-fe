<script setup>
import 'video.js/dist/video-js.css'
import { VCardItem } from 'vuetify/components'
import { VForm } from 'vuetify/components/VForm'

const courseDetails = ref()
const { data, error } = await useApi('/apps/academy/course-details')
if (error.value)
  console.log(error.value)
else if (data.value)
  courseDetails.value = data.value
const panelStatus = ref(0)

const selectedOptions = ref(['Alabama'])

const states = [
  'Alabama',
  'Alaska',
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

// const refForm = ref<VForm>()
// anatomi
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


// here===============
</script>

<template> 
<VForm ref="refForm" @submit.prevent="() => {}">
  <VCard>
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
            ID: 343405-4343jhj-34jnhfdkf
          </p>
        </div>
      </div>
    </VCardTitle>
    </VCard>
  <VRow>
  
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
              <span class="text-h6 d-inline-block"> Dr. Amanda Putri, Sp.KK</span>
            </div>
          </template>
          <template #append>
            <div class="d-flex gap-4 align-center">
              <VChip
                variant="tonal"
                color="error"
                size="small"
              >
               24 July 2025
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
                    multiple
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
                      multiple
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
                      label="kekuatan Kulit"
                      multiple
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
                  <VCol cols="12" class="justify-end d-flex">
                    <VBtn
                      type="submit"
                      @click="refForm?.validate()"
                    >
                      Submit
                    </VBtn>
                  </VCol>
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
              v-model="selectedOptions"
              :items="states"
              :menu-props="{ maxHeight: '400' }"
              label=""
              multiple
              persistent-hint
              placeholder="Select Treatment"
            />
        </VCardItem>

         <VCardItem
          title="Rekomendasi Product"
          class="pb-6"
        >
           <AppSelect
              v-model="selectedOptions"
              :items="states"
              :menu-props="{ maxHeight: '400' }"
              label=""
              multiple
              persistent-hint
              placeholder="Select Product"
            />
        </VCardItem>
        <VCardItem
          title=""
          class="pb-6"
        >
          <AppTextarea
            label="Saran Perawatan"
            placeholder="........"
          />
       </VCardItem>
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
