<script setup>
import girlWithLaptop from '@images/illustrations/laptop-girl.png'
import { ref } from 'vue'

import { useRouter } from 'vue-router'

const router = useRouter()

function goToBilling() {
  router.push('/billing')
}

// Data webinar
const items = ref([
  {
    id: 1,
    title: 'Billing 0000001',
    description: 'skin lifting, laser cauter, fractional laser. ',
    dokter : 'Dokter',
    nameDokter: 'Amanda Smith spd',
    trapis : 'Terapis',
    nameTrapis: 'nelsan jhonson  ',
    duration: 'Sedang Berlangsung',
  },
  {
    id: 2,
    title: 'Billing 0000002',
    description: 'skin lifting, laser cauter, fractional laser.',
    dokter : 'Dokter',
    nameDokter: 'B',
    trapis : 'Terapis',
    nameTrapis: 'A',
    duration: 'Sedang Berlangsung',
  },
  {
    id: 2,
    title: 'Billing 0000003',
    description: 'skin lifting, laser cauter, fractional laser.',
    dokter : 'Dokter',
    nameDokter: 'C',
    trapis : 'Terapis',
    nameTrapis: 'A',
    duration: 'Sedang Berlangsung',
  },
  {
    id: 2,
    title: 'Billing 0000004',
    description: 'skin lifting, laser cauter, fractional laser.',
    dokter : 'Dokter',
    nameDokter: 'D',
    trapis : 'Terapis',
    nameTrapis: 'jhonson',
    duration: 'Sedang Berlangsung',
  },
  {
    id: 2,
    title: 'Billing 0000005',
    description: 'skin lifting, laser cauter, fractional laser, skin lifting, laser cauter, fractional laser, ',
    dokter : 'Terapis',
    nameDokter: 'A',
    trapis : 'Terapis',
    nameTrapis: 'jhonson',
    duration: 'Sedang Berlangsung',
  },
  {
    id: 2,
    title: 'Billing 0000006',
    description: 'skin lifting, laser cauter, fractional laser.',
    dokter : 'Terapis',
    nameDokter: 'B',
    trapis : 'Terapis',
    nameTrapis: 'jhonson',
    duration: 'Sedang Berlangsung',
  },
])
</script>

<template>
  <VRow >
    <VCol
      v-for="(item, index) in items"
      :key="index"
      cols="12"
      sm="6"
      md="4"
      lg="3"
      
    >
      <VCard >
        <VCardText>
          <div class="d-flex justify-center align-start pb-0 px-0 pt-3 mb-2 bg-light-primary rounded">
            <VImg :src="girlWithLaptop" width="145" height="140" />
          </div>

          <div>
            <h5 class="text-h5 mb-2">{{ item.title }}</h5>
            <div class="text-body-2">{{ item.description }}</div>

            <div  class="d-flex  my-4 align-center ">
              <VAvatar color="primary" variant="outline" rounded>
                <VIcon icon="tabler-stethoscope" size="22" />
              </VAvatar>
              
                <div >
                  <h6 class="text-h6">{{ item.dokter }}</h6>
                  <div class="text-sm">{{ item.nameDokter }}</div>
                </div>
            </div>

            <div class="d-flex my-3 align-center ">
              <VAvatar color="primary" variant="outline" rounded>
                <VIcon icon="tabler-user" size="22" />
              </VAvatar>
              
                <div >
                  <h6 class="text-h6">{{ item.trapis }}</h6>
                <div class="text-sm">{{ item.nameTrapis }}</div>
                </div>
            </div>


            
              <div class="d-flex px-7 my-4 ">
                
                <VChip
                color="success "
                >
                <VProgressCircular
                    :size="20"
                    width="3"
                    indeterminate
                    color="success"
                  />
                  <span class=" ms-2">{{ item.duration }}</span>
                </VChip>
              </div>

            <RouterLink :to="`/antrian/product`">
            <VBtn block >Selesai</VBtn>
            </RouterLink>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>


