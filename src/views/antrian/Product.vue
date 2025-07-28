
<script setup>
import moztu from '@images/logos/brave.png'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()



const items = ref([
    {
        id: 1, name: 'Apple iPhone 11 Pro', price: 189900
    },
    {
        id: 2, name: 'Samsung Galaxy S22', price: 79900
    },
    {
        id: 3, name: 'Xiaomi Redmi Note 11', price: 29900
    },
    {
        id: 4, name: 'Xiaomi Redmi Note 11', price: 29900
    },
    {
        id: 5, name: 'Xiaomi Redmi Note 11', price: 29900
    },
    {
        id: 6, name: 'Xiaomi Redmi Note 11', price: 29900
    },
    {
        id: 7, name: 'Xiaomi Redmi Note 11', price: 29900
    },
    {
        id: 8, name: 'Xiaomi Redmi Note 11', price: 29900
    },
    {
        id: 9, name: 'Xiaomi Redmi Note 11', price: 29900
    },
])

const product = ref([
      {
        id: 1, name: 'Apple iPhone 11 Pro', price: 189900
    },
    {
        id: 2, name: 'Samsung Galaxy S22', price: 79900
    },
    {
        id: 3, name: 'Xiaomi Redmi Note 11', price: 29900
    },
    {
        id: 4, name: 'Xiaomi Redmi Note 11', price: 29900
    },
])


        const cartItems  = ref([])

        function addToCart(item) {
        const existing = cartItems.value.find(i => i.id === item.id)
        if (existing) {
            existing.quantity += 1
            existing.totalPrice = existing.price * existing.quantity
        } else {
            cartItems.value.push({
            ...item,
            quantity: 1,
            totalPrice: item.price,
            })
        }
        }

        function removeItem(index) {
        cartItems.value.splice(index, 1)
        }

        const totalQty = computed(() => cartItems.value.reduce((sum, item) => sum + item.quantity, 0))
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
        <VCard class=" pa-2 py-5"  >

            <VCardTitle class="text-h5">
            Product
            </VCardTitle>
            <div style="max-height: 600px; overflow-y: auto;">

                <VRow >
                    <VCol
                    v-for="(item, index) in items"
                    :key="index"
                    cols="12"
                    sm="4"
                    md="4"
                    lg="4"
                    >
                    <VCard class=" d-flex flex-column" >
                        <div class="pa-2 text-center">
                            <VImg height="60px" :src="moztu" contain />
                        </div>

                        <VCardItem>
                            <VCardTitle class="text-wrap" style="font-size: 13px;">{{ item.name }}</VCardTitle>
                        </VCardItem>
                        <div class="flex-grow-1 d-flex flex-column px-3">

                            <!-- Bagian bawah harga + tombol -->
                            <div class="mt-auto py-2 ">
                            <div class="mb-3 ml-2">
                                <span class="font-weight-medium"> {{ formatRupiah(item.price) }}</span>
                            </div>

                            <VBtn @click="addToCart(item)" block size="small">
                                <VIcon icon="tabler-shopping-cart-plus" />
                                <span class="ms-2">Add</span>
                            </VBtn>
                            </div>
                        </div>
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
            <div class="pa-2 py-10 text-center">
                <VImg height="60px" :src="moztu" contain />
                <VCardTitle class=" text-center text-h6 text-wrap">ABC</VCardTitle>
            </div>
            <!-- <VCardTitle class="mt-4 text-center text-h6">Cart Items</VCardTitle> -->
            <!-- <VCardTitle class=" text-h6"> -->
            <!-- <div class=" text-h6 px-6" >
                <tr  class=" text-left">
                    <th>Cabang :</th>
                    <th class="px-6">Jakarta</th>
                </tr>
                <tr class=" text-left">
                    <th >Kasir :</th>
                    <th class="px-6">rosidah</th>
                </tr>

                <tr >
                    <th>Tanggal :</th>
                    <th class="px-6">08-01-2025</th>
                    <th class="px-1">10:30:11</th>
                </tr>
            </div>
            <VCardTitle class=" text-center text-h6 text-wrap"> Tebet Tim., Kec. Tebet, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12820</VCardTitle> -->

            <VDivider class=" border-dashed" />
            <div style="max-height: 350px;  overflow-y: auto;">
                <VTable  style="font-size: 13px;"> 
                    <thead >
                        <tr>
                            <th>Item</th>
                            <!-- <th>Qty</th> -->
                            <th>Price</th>
                            <th>Total</th>
                            <th><VIcon icon="tabler-trash" size="20" /></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in cartItems" :key="item.id">
                            <td style="max-width: 150px;">{{ item.quantity }}x{{ item.name }}</td>
                            <!-- <td style="max-width: 50px;"></td> -->
                            <td>{{ formatRupiah(item.price) }}</td>
                            <td>{{formatRupiah (item.totalPrice) }}</td>
                            <td>
                                <VBtn color="error" icon  @click="removeItem(cartItems.indexOf(item))" size="30">
                                <VIcon icon="tabler-trash" size="20" />
                                </VBtn>
                            </td>
                        </tr>
                    </tbody>
                </VTable>
            </div>
            <VDivider class="mt-3 border-dashed" />
            <VTable >
                <thead>
                    <tr>
                    <th class="pr-1" style="max-width: 35px;"> Total</th>
                    <th  style="max-width: 50px;">{{ totalQty }}</th>
                    <th  style="max-width: 45px;"> {{ formatRupiah(totalAll) }}</th>
                    </tr>
                </thead>
            </VTable>
            <VDivider class=" border-dashed" />
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
