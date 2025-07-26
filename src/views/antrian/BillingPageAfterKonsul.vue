
<script setup>
import InvoiceEditable from '@/views/apps/invoice/InvoiceEditable.vue'
import InvoiceSendInvoiceDrawer from '@/views/apps/invoice/InvoiceSendInvoiceDrawer.vue'
import { ref } from 'vue'
import moztu from '@images/logos/brave.png'
import { useRouter } from 'vue-router'

const router = useRouter()



const items = ref([
    {
        id: 1, name: 'Basic Facial', price: 189900
    },
    {
        id: 2, name: 'Deep Cleansing Facial', price: 79900
    },
    {
        id: 3, name: 'Acne Facial', price: 29900
    },
    {
        id: 4, name: 'Brightening Facial', price: 29900
    },
    {
        id: 5, name: 'Anti-Aging Facial', price: 29900
    },
    {
        id: 6, name: 'Microdermabrasion', price: 29900
    },
    {
        id: 7, name: 'Chemical Peeling', price: 29900
    },
    {
        id: 8, name: 'Laser Treatment', price: 29900
    },
    {
        id: 9, name: 'IPL (Intense Pulsed Light)', price: 29900
    },
])



const tret = ref([
  { id: 1, name: 'Basic Facial' },
  { id: 2, name: 'Deep Cleansing Facial' },
  { id: 3, name: 'Acne Facial' },
  { id: 4, name: 'Brightening Facial' },
])


        const cartItems  = ref([])

        function addToCart(item) {
        const existing = cartItems.value.find(i => i.id === item.id)
        
            cartItems.value.push({
            ...item,
            quantity: 1,
            totalPrice: item.price,
            })
        }

        function removeItem(index) {
        cartItems.value.splice(index, 1)
        }

        // const totalQty = computed(() => cartItems.value.reduce((sum, item) => sum + item.quantity, 0))
        const totalAll = computed(() => cartItems.value.reduce((sum, item) => sum + item.totalPrice, 0))

    function formatRupiah(value) {
        if (!value) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    }
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      md="7"
    >
        <VCard class=" pa-12 py-6"  >

            <VCardTitle class="text-h5 py-5">
            TREATMENT
            </VCardTitle>
            
            <div style="max-height: 550px; overflow-y: auto;">

                <VRow >
                    <VCol
                    v-for="(item, index) in items"
                    :key="index"
                    cols="12"
                    sm="4"
                    md="6"
                    lg="12"
                    >
                    <VCard class=" flex-column" >
                        <VRow>
                            <VCol cols="12" md="9">
                                <VCardItem>
                                    <VCardTitle class="text-wrap">{{ item.name }}</VCardTitle>
                                </VCardItem>
                            </VCol>
                            <VCol  cols="12" md="3" class="py-10">
                                <div class="flex-grow-1 ">

                                    <VBtn @click="addToCart(item)" k>
                                        <VIcon icon="tabler-plus" size="30" />
                                        <!-- <span class="ms-2">+</span> -->
                                    </VBtn>
                                </div>
                            </VCol>
                        </VRow>
                    </VCard>
                    
                    </VCol>
                </VRow>
            </div>
        </VCard>
    </VCol>

    <VCol 
        cols="12"
        md="5"
    >
      <div class="course-content">
        <VCard style="height: 670px; " >

        <div  >
            <div class="pa-2 pt-5 text-center">
                <VImg height="60px" :src="moztu" contain />
                <VCardTitle class=" text-center text-h6 text-wrap">ABC</VCardTitle>
            </div>

            <VDivider class=" border-dashed" />
            <!-- if(){ -->
                <VCardTitle class=" text-left text-h6 text-wrap">Rekomendasi Dokter</VCardTitle>
                <div style="max-height: 90px;  overflow-y: auto;">
                    <div                 v-for="(item, index) in tret" :key="index" class="d-flex align-center mb-2">
                        <VIcon icon="tabler-circle" size="10" class="mr-2 ml-5"  />
                        <span>{{ item.name }}</span>
                    </div>
                </div>
            <!-- } -->
            <VDivider class=" border-dashed" />
            <VTable >
                <thead >
                        <tr>
                            <th style="max-width: 100px;">Item</th>
                            <th class="text-center">Price</th>
                            <th><VIcon icon="tabler-trash" size="20" /></th>
                        </tr>
                    </thead>
            </VTable>
            <div style="max-height: 230px;  overflow-y: auto;">
                <VTable  > 
                    <!-- <thead >
                        <tr>
                            <th>Item</th>
                            <th>Price</th>
                            <th><VIcon icon="tabler-trash" size="20" /></th>
                        </tr>
                    </thead> -->
                    <tbody >
                        <tr v-for="item in cartItems" :key="item.id">
                            <td style="max-width: 120px;">{{ item.name }}</td>
                            <td style="max-width: 70px;">{{ formatRupiah(item.price) }}</td>
                            <td>
                                <VBtn color="error" icon  @click="removeItem(cartItems.indexOf(item))" size="30">
                                <VIcon icon="tabler-trash" size="20" />
                                </VBtn>
                            </td>
                        </tr>
                    </tbody>
                </VTable>
            </div>
            <VDivider class="mt-2 border-dashed" />
            <VTable >
                
                <thead>
                    <tr>
                    <th  style="max-width: 100px;" > Total</th>
                    
                    <th style="max-width: 100px;"> {{ formatRupiah(totalAll) }}</th>
                    </tr>
                </thead>
            </VTable>
            <!-- <VDivider class=" border-dashed" /> -->
        </div>
        <div class="mx-5 pt-2">
            <!-- <VBtn class="ml-90" @click="" block>
            <span class="ms-2">Bayar</span> -->
        <!-- </VBtn> -->
        <RouterLink :to="`/antrian/billing`">
        <VBtn block >Bayar</VBtn>
        </RouterLink>
        </div>

    </VCard>
      </div>
    </VCol>
  </VRow>
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


<style scoped>
.truncate-text {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
</style>
