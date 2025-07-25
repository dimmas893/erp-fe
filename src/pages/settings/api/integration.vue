<script setup>
import gateway from '@images/logos/gateway.webp';
import satusehat from '@images/logos/satusehat.jpg';
import shipping from '@images/logos/shipping.png';
import wa from '@images/logos/wa.png';

const isCardDetailsVisible = ref(false)
</script>

<template>
  <VRow>
   

    <!-- 👉 Apple iPhone 11 Pro -->
    <VCol
     sm="12"
     cols="12"
   >
     <VCard>
       <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row">
         <div class="ma-auto pa-5">
           <VImg
             width="137"
             height="176"
             :src="satusehat"
           />
         </div>

         <VDivider :vertical="$vuetify.display.mdAndUp" />

         <div>
           <VCardItem>
             <VCardTitle>Satu Sehat</VCardTitle>
           </VCardItem>

           <VCardText>
               API Key satu sehat yang digunakan untuk mengintegrasikan data pasien secara Real-time terkait rekam medis anatara klinik dan Satu Sehat
           </VCardText>

           <VCardText class="text-subtitle-1">
               <span class="text-muted">Organization ID</span>
               <span class="font-weight-medium"><h4><b>23203-23202-3645Igsdhye5453</b></h4></span>
           </VCardText>
           <VCardText class="text-subtitle-1">
               <span class="text-muted">Client ID</span>
               <span class="font-weight-medium"><h4><b>W$2823645Igsdhye5453</b></h4></span>
           </VCardText>
           <VCardText class="text-subtitle-1">
               <span class="text-muted">Client Secret</span>
               <span class="font-weight-medium"><h4><b>W$2823645Igsdhye5453</b></h4></span>
           </VCardText>

           <VCardActions class="justify-space-between">
             <VBtn>
               <VIcon icon="tabler-pencil" />
               <span class="ms-2">Edit</span>
             </VBtn>

             <IconBtn
               color="secondary"
               icon="tabler-share"
             />
           </VCardActions>
         </div>
       </div>
     </VCard>
   </VCol>
    <VCol
      sm="6"
      cols="12"
    >
      <VCard>
        <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row">
          <div class="ma-auto pa-5">
            <VImg
              width="137"
              height="176"
              :src="wa"
            />
          </div>

          <VDivider :vertical="$vuetify.display.mdAndUp" />

          <div>
            <VCardItem>
              <VCardTitle>Whatsapp Integration</VCardTitle>
            </VCardItem>

            <VCardText>
             Nomor ini akan digunakan untuk mengirimkan notifikasi dari sistem ke user terkait approval ,pembelian , dll dalam penggunaan lingkup ERP dan ekosistemnya
            </VCardText>

            <VCardText class="text-subtitle-1">
              <span class="font-weight-medium"><h4><b>628138834758</b></h4></span>
            </VCardText>

            <VCardActions class="justify-space-between">
              <VBtn>
                <VIcon icon="tabler-pencil" />
                <span class="ms-2">Edit</span>
              </VBtn>

              <IconBtn
                color="secondary"
                icon="tabler-share"
              />
            </VCardActions>
          </div>
        </div>
      </VCard>
    </VCol>


     <VCol
      sm="6"
      cols="12"
    >
      <VCard>
        <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row">
          <div class="ma-auto pa-5">
            <VImg
              width="137"
              height="176"
              :src="gateway"
            />
          </div>

          <VDivider :vertical="$vuetify.display.mdAndUp" />

          <div>
            <VCardItem>
              <VCardTitle>Payment Gateway</VCardTitle>
            </VCardItem>

            <VCardText>
             API Key payment gateway digunkan untuk menghubungkan apps ke metode pembayaran pihak ketiga varian opsi yang lebih banyak dan penggunaan yang lebih efisien
            </VCardText>

            <VCardText class="text-subtitle-1" style="word-break: break-word;">
              <span class="font-weight-medium text-wrap"><h4><b>#$73438!9wdsjsjP023sssf</b></h4></span>
            </VCardText>

            <VCardActions class="justify-space-between">
              <VBtn>
                <VIcon icon="tabler-pencil" />
                <span class="ms-2">Edit</span>
              </VBtn>

              <IconBtn
                color="secondary"
                icon="tabler-share"
              />
            </VCardActions>
          </div>
        </div>
      </VCard>
    </VCol>

     <VCol
      sm="6"
      cols="12"
    >
      <VCard>
        <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row">
          <div class="ma-auto pa-5">
            <VImg
              width="137"
              height="176"
              :src="shipping"
            />
          </div>

          <VDivider :vertical="$vuetify.display.mdAndUp" />

          <div>
            <VCardItem>
              <VCardTitle>Shipping API</VCardTitle>
            </VCardItem>

            <VCardText>
             API Key ini digunakan untuk mendapatkan estimasi biaya dari berbagai jasa pengiriman di indonesia dan internasional
            </VCardText>

            <VCardText class="text-subtitle-1" style="word-break: break-word;">
              <span class="font-weight-medium "><b>$#jshdhsI73843&8uhMowszczcs3447edd</b></span>
            </VCardText>

            <VCardActions class="justify-space-between">
              <VBtn>
                <VIcon icon="tabler-pencil" />
                <span class="ms-2">Edit</span>
              </VBtn>

              <IconBtn
                color="secondary"
                icon="tabler-share"
              />
            </VCardActions>
          </div>
        </div>
      </VCard>
    </VCol>

  </VRow>
</template>

<style lang="scss" scoped>
.avatar-center {
  position: absolute;
  border: 3px solid rgb(var(--v-theme-surface));
  inset-block-start: -2rem;
  inset-inline-start: 1rem;
}

// membership pricing
.member-pricing-bg {
  position: relative;
  background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
}

.membership-pricing {
  sup {
    inset-block-start: 9px;
  }
}

.v-btn {
  transform: none;
}
</style>
