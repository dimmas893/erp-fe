<route lang="yaml">
meta:
  layout: default
  navActiveLink: transaction-billings
</route>

<script setup>
import { requiredValidator } from '@/@core/utils/validators'
import { $api } from '@/utils/api'
import { showErrorAlert, showSuccessAlert, showValidationErrorAlert } from '@/utils/errorHandler'
import { useRoute, useRouter } from 'vue-router'
import { VForm } from 'vuetify/components/VForm'

// Initialize router and route
const router = useRouter()
const route = useRoute()

// Form data structure based on API
const formData = ref({
  patient_id: '',
  visit_id: '',
  promo_id: '',
  payment_method_id: '',
  total_amount: '',
  discount_amount: '',
  tax_amount: '',
  grand_total: '',
  status: 'draft',
})

// Form validation
const refForm = ref()
const isLoading = ref(false)
const isLoadingBilling = ref(true)

// Options
const statusOptions = [
  { title: 'Draft', value: 'draft' },
  { title: 'Unpaid', value: 'unpaid' },
  { title: 'Paid', value: 'paid' },
]

// Data for dropdowns
const patients = ref([])
const visits = ref([])
const promos = ref([])
const paymentMethods = ref([])

const loadingPatients = ref(false)
const loadingVisits = ref(false)
const loadingPromos = ref(false)
const loadingPaymentMethods = ref(false)

// Billing data
const billing = ref(null)

// Load data on mount
onMounted(async () => {
  await Promise.all([
    loadPatients(),
    loadVisits(),
    loadPromos(),
    loadPaymentMethods(),
    loadBilling(),
  ])
})

const loadPatients = async () => {
  try {
    loadingPatients.value = true

    const response = await $api('/rme/patients/paginated', {
      method: 'POST',
      body: {
        page: 1,
        per_page: 1000,
        sort_by: 'name',
        sort_order: 'asc',
      },
    })

    patients.value = response.data.map(patient => ({
      title: `${patient.name} (${patient.patient_number})`,
      value: patient.id,
    }))
  } catch (error) {
    console.error('Error loading patients:', error)
    await showErrorAlert(error, { 
      title: 'Gagal Memuat Data Pasien',
      text: 'Tidak dapat memuat daftar pasien. Silakan refresh halaman.',
    })
  } finally {
    loadingPatients.value = false
  }
}

const loadVisits = async () => {
  try {
    loadingVisits.value = true

    const response = await $api('/rme/visits/paginated', {
      method: 'POST',
      body: {
        page: 1,
        per_page: 1000,
        sort_by: 'created_at',
        sort_order: 'desc',
      },
    })

    visits.value = response.data.map(visit => ({
      title: `Kunjungan ${visit.id} - ${visit.patient?.name || 'Unknown'}`,
      value: visit.id,
    }))
  } catch (error) {
    console.error('Error loading visits:', error)
    await showErrorAlert(error, { 
      title: 'Gagal Memuat Data Kunjungan',
      text: 'Tidak dapat memuat daftar kunjungan. Silakan refresh halaman.',
    })
  } finally {
    loadingVisits.value = false
  }
}

const loadPromos = async () => {
  try {
    loadingPromos.value = true

    const response = await $api('/promo-engine/promos')

    promos.value = response.data.map(promo => ({
      title: `${promo.description} (${promo.code})`,
      value: promo.id,
    }))
  } catch (error) {
    console.error('Error loading promos:', error)
    await showErrorAlert(error, { 
      title: 'Gagal Memuat Data Promo',
      text: 'Tidak dapat memuat daftar promo. Silakan refresh halaman.',
    })
  } finally {
    loadingPromos.value = false
  }
}

const loadPaymentMethods = async () => {
  try {
    loadingPaymentMethods.value = true

    const response = await $api('/transaction/payment-methods')

    paymentMethods.value = response.data.map(method => ({
      title: method.name,
      value: method.id,
    }))
  } catch (error) {
    console.error('Error loading payment methods:', error)
    await showErrorAlert(error, { 
      title: 'Gagal Memuat Data Metode Pembayaran',
      text: 'Tidak dapat memuat daftar metode pembayaran. Silakan refresh halaman.',
    })
  } finally {
    loadingPaymentMethods.value = false
  }
}

const loadBilling = async () => {
  try {
    isLoadingBilling.value = true

    const response = await $api(`/transaction/billings/${route.params.id}`)

    billing.value = response.data
    
    // Populate form with existing data
    formData.value = {
      patient_id: billing.value.patient_id || '',
      visit_id: billing.value.visit_id || '',
      promo_id: billing.value.promo_id || '',
      payment_method_id: billing.value.payment_method_id || '',
      total_amount: billing.value.total_amount || '',
      discount_amount: billing.value.discount_amount || '',
      tax_amount: billing.value.tax_amount || '',
      grand_total: billing.value.grand_total || '',
      status: billing.value.status || 'draft',
    }
  } catch (error) {
    console.error('Error loading billing:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Tagihan',
      text: 'Tidak dapat memuat data tagihan. Silakan coba lagi.',
    })
    router.push({ name: 'transaction-billings' })
  } finally {
    isLoadingBilling.value = false
  }
}

// Validation rules
const amountValidator = value => {
  if (!value) return 'Jumlah wajib diisi'
  if (isNaN(value) || parseFloat(value) < 0) return 'Jumlah harus berupa angka positif'
  
  return true
}

const calculateGrandTotal = () => {
  const total = parseFloat(formData.value.total_amount) || 0
  const discount = parseFloat(formData.value.discount_amount) || 0
  const tax = parseFloat(formData.value.tax_amount) || 0
  
  formData.value.grand_total = (total - discount + tax).toFixed(2)
}

// Watch for changes in amounts to auto-calculate grand total
watch([
  () => formData.value.total_amount,
  () => formData.value.discount_amount,
  () => formData.value.tax_amount,
], () => {
  calculateGrandTotal()
})

// Submit form with PATCH method
const submitForm = async () => {
  const { valid } = await refForm.value.validate()
  
  if (!valid) return

  try {
    isLoading.value = true
    
    // Prepare data for API
    const submitData = {
      ...formData.value,
      total_amount: parseFloat(formData.value.total_amount),
      discount_amount: parseFloat(formData.value.discount_amount),
      tax_amount: parseFloat(formData.value.tax_amount),
      grand_total: parseFloat(formData.value.grand_total),
    }
    
    const response = await $api(`/transaction/billings/${route.params.id}`, {
      method: 'PATCH',
      body: submitData,
    })

    await showSuccessAlert(
      'Data tagihan berhasil diperbarui!',
      'Berhasil!',
    )

    // Redirect to billing detail page
    await router.push({ name: 'transaction-billings-id', params: { id: route.params.id } })
    
  } catch (error) {
    console.error('Error updating billing:', error)
    
    // Check if it's a validation error (400 status)
    const errorData = error.data || error.response?.data || error
    if (errorData.response_code === 400 || error.status === 400) {
      await showValidationErrorAlert(error, 'Data Tidak Valid')
    } else {
      await showErrorAlert(error)
    }
  } finally {
    isLoading.value = false
  }
}

// Cancel and go back
const goBack = () => {
  router.push({ name: 'transaction-billings-id', params: { id: route.params.id } })
}

const goToList = () => {
  router.push({ name: 'transaction-billings' })
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="d-flex align-center gap-2">
        <VBtn
          icon="tabler-arrow-left"
          variant="text"
          size="small"
          @click="goBack"
        />
        Edit Tagihan
      </VCardTitle>
      <VCardSubtitle>
        Perbarui data tagihan yang sudah ada
      </VCardSubtitle>
    </VCardItem>

    <VProgressLinear
      v-if="isLoadingBilling"
      indeterminate
      color="primary"
    />

    <VCardText v-if="isLoadingBilling">
      <!-- Loading skeleton -->
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VSkeletonLoader type="list-item-two-line@6" />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VSkeletonLoader type="list-item-two-line@6" />
        </VCol>
      </VRow>
    </VCardText>

    <VCardText v-else>
      <VForm
        ref="refForm"
        @submit.prevent="submitForm"
      >
        <VRow>
          <!-- Data Tagihan -->
          <VCol cols="12">
            <h6 class="text-h6 font-weight-medium mb-4">
              Data Tagihan
            </h6>
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppSelect
              v-model="formData.patient_id"
              label="Pasien"
              placeholder="Pilih pasien"
              :items="patients"
              :loading="loadingPatients"
              :rules="[requiredValidator]"
              required
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppSelect
              v-model="formData.visit_id"
              label="Kunjungan"
              placeholder="Pilih kunjungan"
              :items="visits"
              :loading="loadingVisits"
              :rules="[requiredValidator]"
              required
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppSelect
              v-model="formData.promo_id"
              label="Promo"
              placeholder="Pilih promo (opsional)"
              :items="promos"
              :loading="loadingPromos"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppSelect
              v-model="formData.payment_method_id"
              label="Metode Pembayaran"
              placeholder="Pilih metode pembayaran"
              :items="paymentMethods"
              :loading="loadingPaymentMethods"
              :rules="[requiredValidator]"
              required
            />
          </VCol>

          <!-- Informasi Keuangan -->
          <VCol cols="12">
            <VDivider class="my-4" />
            <h6 class="text-h6 font-weight-medium mb-4">
              Informasi Keuangan
            </h6>
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="formData.total_amount"
              label="Total Amount"
              placeholder="Masukkan total amount"
              :rules="[amountValidator]"
              type="number"
              required
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="formData.discount_amount"
              label="Discount Amount"
              placeholder="Masukkan discount amount"
              :rules="[amountValidator]"
              type="number"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="formData.tax_amount"
              label="Tax Amount"
              placeholder="Masukkan tax amount"
              :rules="[amountValidator]"
              type="number"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="formData.grand_total"
              label="Grand Total"
              placeholder="Grand total akan dihitung otomatis"
              readonly
              variant="outlined"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppSelect
              v-model="formData.status"
              label="Status"
              placeholder="Pilih status"
              :items="statusOptions"
              :rules="[requiredValidator]"
              required
            />
          </VCol>

          <!-- Action Buttons -->
          <VCol cols="12">
            <div class="d-flex gap-4 mt-6">
              <VBtn
                type="submit"
                :loading="isLoading"
                :disabled="isLoading"
              >
                <VIcon
                  start
                  icon="tabler-device-floppy"
                />
                Simpan Perubahan
              </VBtn>

              <VBtn
                color="secondary"
                variant="tonal"
                :disabled="isLoading"
                @click="goBack"
              >
                <VIcon
                  start
                  icon="tabler-arrow-left"
                />
                Kembali
              </VBtn>

              <VBtn
                color="error"
                variant="outlined"
                :disabled="isLoading"
                @click="goToList"
              >
                <VIcon
                  start
                  icon="tabler-x"
                />
                Batal
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template> 
