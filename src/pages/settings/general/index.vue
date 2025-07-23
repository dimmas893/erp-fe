<script setup>
import bg from '@images/banner/banner.png';
import logo from '@images/logos/chrome.png';
import { ref } from 'vue';
import About from './About.vue';
import FormData from './form.vue';
import ActivityTimeline from './imago.vue';

const showDialog = ref(false)
const seeForm = ()=>{
    showDialog.value = true
    // pdfUrl.value = filePdf
}

</script>

<template>
   <FormData v-model:show="showDialog" />
  <div>
    <!-- <UserProfileHeader /> -->

   <VCard>
    <VImg
      :src="bg"
      min-height="125"
      max-height="250"
      cover
    />

    <VCardText class="d-flex align-bottom flex-sm-row flex-column justify-center gap-x-6">
      <div class="d-flex h-0">
        <VAvatar
          rounded
          size="130"
          :image="logo"
          class="user-profile-avatar mx-auto"
        />
      </div>

      <div class="user-profile-info w-100 mt-16 pt-6 pt-sm-0 mt-sm-0">
        <h4 class="text-h4 text-center text-sm-start font-weight-medium mb-2">
          Jasperskin
        </h4>

        <div class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-5">
          <div class="d-flex flex-wrap justify-center justify-sm-start flex-grow-1 gap-6">
            <!-- <span class="d-flex gap-x-2 align-center">
              <VIcon
                size="24"
                icon="tabler-palette"
              />
              <div class="text-body-1 font-weight-medium">
               dsd
              </div>
            </span> -->

            <span class="d-flex gap-x-2 align-center">
              <VIcon
                size="24"
                icon="tabler-map-pin"
              />
              <div class="text-body-1 font-weight-medium">
                Indonesia
              </div>
            </span>

            <span class="d-flex gap-x-2 align-center">
              <VIcon
                size="24"
                icon="tabler-calendar"
              />
              <div class="text-body-1 font-weight-medium">
               01-01-2000
              </div>
            </span>
          </div>

          <VBtn prepend-icon="tabler-pencil" @click="seeForm()">
            Edit
          </VBtn>
        </div>
      </div>
    </VCardText>
  </VCard>
  </div>

  <VRow class="mt-4">
    <VCol
      md="4"
      cols="12"
    >
      <About/>
    </VCol>

    <VCol
      cols="12"
      md="8"
    >
      <VRow>
        <VCol cols="12">
          <ActivityTimeline />
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>

<style lang="scss">
.user-profile-avatar {
  border: 5px solid rgb(var(--v-theme-surface));
  background-color: rgb(var(--v-theme-surface)) !important;
  inset-block-start: -3rem;

  .v-img__img {
    border-radius: 0.125rem;
  }
}
</style>

