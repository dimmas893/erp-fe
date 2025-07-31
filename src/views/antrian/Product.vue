
<script setup>
import moztu from '@images/logos/brave.png'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const search = ref('')


const items = ref([
    {
        id: 1, name: 'cream iritasi cream iritasi cream iritasi', price: 189900
    },
    {
        id: 2, name: 'cream anti wrinkle', price: 79900
    },
    {
        id: 3, name: 'body scrub', price: 29900
    },
    {
        id: 4, name: 'body whitening', price: 29900
    },
    {
        id: 5, name: 'Brightening Sakura Facial', price: 29900
    },
    {
        id: 6, name: 'Cleansing Milk', price: 29900
    },
    {
        id: 7, name: 'Flower Face Foam', price: 29900
    },
    {
        id: 8, name: 'Olympian Eye Serum', price: 29900
    },
    {
        id: 9, name: 'Olympian Lightening Spectrum ', price: 29900
    },
    {
        id: 1, name: 'cream iritasi', price: 189900
    },
    {
        id: 2, name: 'cream anti wrinkle', price: 79900
    },
    {
        id: 3, name: 'body scrub', price: 29900
    },
    {
        id: 4, name: 'body whitening', price: 29900
    },
    {
        id: 5, name: 'Brightening Sakura Facial', price: 29900
    },
    {
        id: 6, name: 'Cleansing Milk', price: 29900
    },
    {
        id: 7, name: 'Flower Face Foam', price: 29900
    },
    {
        id: 8, name: 'Olympian Eye Serum', price: 29900
    },
    {
        id: 9, name: 'Olympian Lightening Spectrum ', price: 29900
    },
    {
        id: 1, name: 'cream iritasi', price: 189900
    },
    {
        id: 2, name: 'cream anti wrinkle', price: 79900
    },
    {
        id: 3, name: 'body scrub', price: 29900
    },
    {
        id: 4, name: 'body whitening', price: 29900
    },
    {
        id: 5, name: 'Brightening Sakura Facial', price: 29900
    },
    {
        id: 6, name: 'Cleansing Milk', price: 29900
    },
    {
        id: 7, name: 'Flower Face Foam', price: 29900
    },
    {
        id: 8, name: 'Olympian Eye Serum', price: 29900
    },
    {
        id: 9, name: 'Olympian Lightening Spectrum ', price: 29900
    },
    {
        id: 1, name: 'cream iritasi', price: 189900
    },
    {
        id: 2, name: 'cream anti wrinkle', price: 79900
    },
    {
        id: 3, name: 'body scrub', price: 29900
    },
    {
        id: 4, name: 'body whitening', price: 29900
    },
    {
        id: 5, name: 'Brightening Sakura Facial', price: 29900
    },
    {
        id: 6, name: 'Cleansing Milk', price: 29900
    },
    {
        id: 7, name: 'Flower Face Foam', price: 29900
    },
    {
        id: 8, name: 'Olympian Eye Serum', price: 29900
    },
    {
        id: 9, name: 'Olympian Lightening Spectrum ', price: 29900
    },
])


const tret = ref([
  { id: 1, name: 'Basic Facial Basic Facial Basic Facial Basic Facial Basic Facial Basic Facial', price: 189900 },
  { id: 2, name: 'Deep Cleansing Facial', price: 189900 },
  { id: 3, name: 'Acne Facial', price: 189900 },
  { id: 4, name: 'Brightening Facial', price: 189900 },
])

const filteredItems = computed(() => {
  if (!search.value) return items.value

  const keyword = search.value.toLowerCase()

  return items.value.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(keyword)
    )
  )
})


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
        <VCard class=" pa-2 "  >

          <div class="d-flex justify-space-between align-center flex-wrap mx-4 my-2">
            <VCardTitle class="text-h5">
            Product
            </VCardTitle>

            <v-text-field
              v-model="search"
              label="Search..."
              class="my-2"
              prepend-inner-icon="mdi-magnify"
              clearable
              density="comfortable"
              style="max-width: 300px"
            />
          </div>
            <div >
              
                <VRow >
                    <VCol
                    v-for="(item, index) in filteredItems"
                    :key="index.id"
                    v-model:search="search"
                    :items="filteredItems"
                    cols="12"
                    sm="4"
                    md="4"
                    lg="4"
                    >
                    <VCard class="d-flex flex-column h-100">
                      <div class=" mt-5  text-center">
                        <VImg height="60px" :src="moztu" contain />
                      </div>

                      <!-- Judul produk -->
                      <VCardItem class="flex-grow-0">
                        <VCardTitle
                          class="text-wrap "
                          style="font-size: 13px; min-height: 40px;"
                        >
                          {{ item.name }}
                        </VCardTitle>
                      </VCardItem>

                      <!-- Spacer -->
                      <div class="d-flex flex-column flex-grow-1 justify-end px-3">
                        <div class="py-2">
                          <div class="mb-3 ml-2">
                            <span class="font-weight-medium">{{ formatRupiah(item.price) }}</span>
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

        <div>
              <div class="pa-2 pt-5 text-center">
                <VImg height="60px" :src="moztu" contain />
                <VCardTitle class=" text-center text-h6 text-wrap">ABC</VCardTitle>
              </div>
              <VDivider class=" border-dashed" />
            <!--NOTE Data ini menggunakan if jika hanya konsul maka menampilkan harga konsul, dan jika melakukan treatmen maka menampilkan nama treatment dan harga -->
              <!-- if(){ -->
                <VCardTitle class=" text-left text-h6 text-wrap">Treatment</VCardTitle>
                <div style="max-height: 90px;  overflow-y: auto;">
                    <div v-for="(item, index) in tret" :key="index" class="d-flex align-center mb-2">
                        <VIcon icon="tabler-circle" size="10" class="mr-2 ml-5"  />
                        <div class="d-flex justify-space-between align-start flex-grow-1">
                          <span style="font-size: 13px;">{{ item.name }}</span>
                          <span class="mr-10" style="font-size: 13px; white-space: nowrap;">{{formatRupiah (item.price) }}</span>
                        </div>
                    </div>
                </div>
              <!-- } -->
            <VDivider class=" border-dashed" />

            <VDivider class=" border-dashed" />
            <div style="max-height: 280px;  overflow-y: auto;">
                <VTable  style="font-size: 13px;"> 
                    <thead style="position: sticky; top: 0; z-index: 1;">
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
                <tbody>
                    <tr>
                    <td class="pr-1" style="max-width: 55px;"> Total</td>
                    <td  style="max-width: 20px;">{{ totalQty }}</td>
                    <td  style="max-width: 65px;"> {{ formatRupiah(totalAll) }}</td>
                    </tr>
                </tbody>
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
