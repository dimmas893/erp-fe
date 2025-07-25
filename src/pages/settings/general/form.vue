<script setup>
import logo from '@images/logos/chrome.png';
import { ref, watch } from 'vue';

const loadings = ref(Array(10).fill(false))
const refInputEl = ref(null)
const isDialogVisible = ref(false)
const props = defineProps({
  show: Boolean,
  // pdfUrl: Object
})

const submitForm = async()=>{

}

const changeAvatar = file => {
  const fileReader = new FileReader()
  const { files } = file.target
  if (files && files.length) {
    //  photoFile.value = files[0] 
    // fileReader.readAsDataURL(files[0])
    // fileReader.onload = () => {
    //   if (typeof fileReader.result === 'string') {
    //     accountDataLocal.value.avatarImg = fileReader.result
    //   }
    // }
  }
}

const resetAvatar = () => {
  // getUser() // ambil ulang data asli
}

const emit = defineEmits(['reload','message','update:show'])
watch(() => props.show, (val) => {
    isDialogVisible.value = val
})

watch(isDialogVisible, (val) => {
  emit('update:show', val)
})
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <!-- Dialog Activator -->
    <!-- <template #activator="{ props }">
      <VBtn v-bind="props">
        Open Dialog
      </VBtn>
    </template> -->

    <!-- Dialog Content -->
    <VCard>
      <!-- Toolbar -->
      <div>
        <VToolbar color="primary">
          <VBtn
            icon
            variant="plain"
            @click="isDialogVisible = false"
          >
            <VIcon
              color="white"
              icon="tabler-x"
            />
          </VBtn>

          <VToolbarTitle>General Setting Form</VToolbarTitle>

          <VSpacer />

          <VToolbarItems>
            <VBtn
              variant="text"
              @click="isDialogVisible = false"
            >
              close
            </VBtn>
          </VToolbarItems>
        </VToolbar>
      </div>
       <VCol cols="12">
      <VCard>
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            size="100"
            class="me-6"
            :image="logo"
          />

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-4" >
            <div class="d-flex flex-wrap gap-4">
              <VBtn
                color="primary"
                size="small"
                @click="refInputEl?.click()"
              >
                <VIcon
                  icon="tabler-cloud-upload"
                  class="d-sm-none"
                />
                <span class="d-none d-sm-block">Upload new photo</span>
              </VBtn>

              <input
                ref="refInputEl"
                type="file"
                name="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="changeAvatar"
              >

              <VBtn
                type="reset"
                size="small"
                color="secondary"
                variant="tonal"
                @click="resetAvatar"
              >
                <span class="d-none d-sm-block">Reset</span>
                <VIcon
                  icon="tabler-refresh"
                  class="d-sm-none"
                />
              </VBtn>
            </div>

            <p class="text-body-1 mb-0">
              Allowed JPG or PNG. Max size of 2MB
            </p>
          </form>
        </VCardText>

        <VCardText class="pt-2">
          <!-- 👉 Form -->
          <VForm class="mt-3" @submit.prevent="submitForm">
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                md="6"
                cols="12"
              >
                <AppTextField
                  
                  placeholder="The JohnDoe"
                  label="Brand Name"
                />
              </VCol>


              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  
                  label="Company Name"
                  placeholder="PT Nuna ray nua"
                />
              </VCol>

              <!-- 👉 Organization -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                 
                  label="Location"
                  placeholder="Bussiness Location"
                />
              </VCol>

              <!-- 👉 Phone -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                 
                  label="Website Title"
                  placeholder="Clinic Aio"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                 
                  label="Email"
                  placeholder="Bussiness Mail" type="email"
                />
              </VCol>

              <!-- 👉 Phone -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                 
                  label="Contact"
                  placeholder="021 343 343"
                />
              </VCol>

            

              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex justify-end flex-wrap gap-4"
              >
                <VBtn :loading="loadings[5]" :disabled="loadings[5]" type="submit">
                    Save changes
                 <template #loader>
                    <span class="custom-loader">
                        Loading...
                    </span>
                </template>
                </VBtn>

                <!-- <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  @click.prevent="resetForm"
                >
                  Cancel
                </VBtn> -->
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
     
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}
</style>
