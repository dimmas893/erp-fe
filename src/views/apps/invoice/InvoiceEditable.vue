<script setup>
import InvoiceProductEdit from './InvoiceProductEdit.vue'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import moztu from '@images/logos/brave.png'
const router = useRouter()


const props = defineProps({
  data: {
    type: null,
    required: true,
  },
})

const emit = defineEmits([
  'push',
  'remove',
])



// const emit = defineEmits(['clear'])

const headers = [
  { text: 'Name', value: 'name' },
  { text: 'Price', value: 'price' },
]

function clearItems() {
  emit('clear')
}

const invoice = ref(props.data.invoice)
const salesperson = ref(props.data.salesperson)
const thanksNote = ref(props.data.thanksNote)
const note = ref(props.data.note)

// 👉 Clients
const clients = ref([])

// 👉 fetchClients
const fetchClients = async () => {
  const { data, error } = await useApi('/apps/invoice/clients')
  if (error.value)
    console.log(error.value)
  else
    clients.value = data.value
}

fetchClients()

// 👉 Add item function
const addItem = () => {
  emit('push', {
    title: 'App Design',
    cost: 24,
    hours: 1,
    description: 'Designed UI kit & app pages.',
  })
}

const removeProduct = id => {
  emit('remove', id)
}

const goBack = () => {
  router.push({ name: 'antrian-billingpageafterkonsul' })
}



</script>

<template>
  <VCard class="pa-6 pa-sm-12">
    <VCardItem class="d-flex py-1 px-1">
      <VCardTitle class="d-flex  gap-">
        <VBtn
          icon="tabler-arrow-left"
          variant="text"
          size="small"
          @click="goBack"
        />
        Back
      </VCardTitle>
      
    </VCardItem>
    <!-- SECTION Header -->
    <div class="d-flex flex-wrap justify-space-between flex-column rounded bg-var-theme-background flex-sm-row gap-6 pa-6 mb-6">
      <!-- 👉 Left Content -->
      <div>
        <div class=" app-logo mb-6">
          <!-- 👉 Logo -->
          <!-- <VImg height="50px" width="20px" :src="moztu" contain /> -->
          <VNodeRenderer :nodes="themeConfig.app.logo" />

          <!-- 👉 Title -->
          <h6 class="app-logo-title">
            <!-- {{ themeConfig.app.title }} -->ABC
          </h6>
        </div>

        <!-- 👉 Address -->
        <p class="text-high-emphasis mb-0 text-wrap">
          Tebet Tim., Kec. Tebet, Kota Jakarta Selatan, 
        </p>
        <p class="text-high-emphasis mb-0 text-wrap">
            Daerah Khusus Ibukota Jakarta 12820
        </p>
        
        <p class="text-high-emphasis mb-0">
          +62 (876) 543 2198
        </p>
      </div>

      <!-- 👉 Right Content -->
      <div class="d-flex flex-column gap-2">
        <!-- 👉 Invoice Id -->
        <div class="d-flex align-start align-sm-center gap-x-4 font-weight-medium text-lg flex-column flex-sm-row">
          <span
            class="text-high-emphasis text-sm-end"
            style="inline-size: 5.625rem ;"
          >Invoice:</span>
          <span>
            <AppTextField
              v-model="invoice.id"
              disabled
              prefix="#"
              style="inline-size: 9.5rem;"
            />
          </span>
        </div>

        <!-- 👉 Issue Date -->
        <!-- <div class="d-flex gap-x-4 align-start align-sm-center flex-column flex-sm-row">
          <span
            class="text-high-emphasis text-sm-end"
            style="inline-size: 5.625rem;"
          >Date Issued:</span>

          <span style="inline-size: 9.5rem;">
            <AppDateTimePicker
              v-model="invoice.issuedDate"
              placeholder="YYYY-MM-DD"
              :config="{ position: 'auto right' }"
            />
          </span>
        </div> -->

        <!-- 👉 Due Date -->
        <div class="d-flex gap-x-4 align-start align-sm-center flex-column flex-sm-row">
          <span
            class="text-high-emphasis text-sm-end"
            style="inline-size: 5.625rem;"
          >Due Date:</span>
          <span style="min-inline-size: 9.5rem;">
            <AppDateTimePicker
              v-model="invoice.dueDate"
              placeholder="YYYY-MM-DD"
              :config="{ position: 'auto right' }"
            />
          </span>
        </div>
      </div>
    </div>
    <!-- !SECTION -->

    
      <VRow>
        <VCol class="text-no-wrap" cols="12" md="8">
          <h6 class="text-h6 mb-4">
            Invoice To:
          </h6>
          <p class="mb-0">
            <!-- {{ invoice.client.name }} -->
              Michel
          </p>
          <p class="mb-0">
            <!-- {{ invoice.client.contact }} -->
              +62875639736937
          </p>
          <p class="mb-0">
            <!-- {{ invoice.client.companyEmail }} -->
              Michel@gmail.com
          </p>
        </VCol>

        <VCol class="py-12 text-no-wrap" cols="12" md="4">
          
            <table >
              <tbody >
                
                <tr >
                  <td class="pe-4">
                  Dokter:
                  </td>
                  <td>Amanda Smith spd</td>
                </tr>
                <tr>
                  <td class="pe-4">
                    trapis:
                  </td>
                  <td>nelsan jhonson  </td>
                </tr>
                
              </tbody>
            </table>
        </VCol>
      </VRow>

    <VDivider class="my-6 border-dashed" />
    <!-- 👉 Add purchased products -->
    <div class="add-products-form">
      isi data  product dan treatmen dari api
    </div>

    <VDivider class="my-6 border-dashed" />

    <!-- 👉 Total Amount -->
    <div class="d-flex justify-space-between flex-wrap flex-column flex-sm-row">
      <div class="mb-6 mb-sm-0">
        <!-- <div class="d-flex align-center mb-4">
          <h6 class="text-h6 me-2">
            Salesperson:
          </h6>
          <AppTextField
            v-model="salesperson"
            style="inline-size: 8rem;"
            placeholder="John Doe"
          />
        </div>

        <AppTextField
          v-model="thanksNote"
          placeholder="Thanks for your business"
        /> -->
      </div>

      <div >
        <table class="w-100">
          <tbody>
            <tr>
              <td class="pe-16">
                Subtotal:
              </td>
              <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                <h6 class="text-h6">
                  $1800
                </h6>
              </td>
            </tr>
            <tr>
              <td class="pe-16">
                Discount:
              </td>
              <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                <h6 class="text-h6">
                  $28
                </h6>
              </td>
            </tr>
            <tr>
              <td class="pe-16">
                Tax:
              </td>
              <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                <h6 class="text-h6">
                  21%
                </h6>
              </td>
            </tr>
          </tbody>
        </table>

        <VDivider class="mt-4 mb-3" />

        <table class="w-100">
          <tbody>
            <tr>
              <td class="pe-16">
                Total:
              </td>
              <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                <h6 class="text-h6">
                  $1690
                </h6>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <VDivider class="my-6 border-dashed" />

    <div>
      <h6 class="text-h6 mb-2">
        Note:
      </h6>
      <VTextarea
        v-model="note"
        placeholder="Write note here..."
        :rows="2"
      />
    </div>
  </VCard>
</template>
