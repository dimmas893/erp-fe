<route lang="yaml">
meta:
  layout: default
  navActiveLink: transaction-billings
</route>

<template>
  <VCard>
    <!-- Breadcrumb Navigation -->
    <VCardText class="pb-0">
      <VBreadcrumbs
        :items="breadcrumbItems"
        divider="tabler-chevron-right"
      >
        <template #title="{ item }">
          <span :class="{ 'text-primary font-weight-medium': item.active }">
            {{ item.title }}
          </span>
        </template>
      </VBreadcrumbs>
    </VCardText>

    <VCardTitle class="d-flex align-center gap-3">
      <VIcon size="24" color="primary">
        tabler-route
      </VIcon>
      <span>Alur Pembuatan Tagihan</span>
    </VCardTitle>

    <VCardText>  
      <div class="process-status">
        <h5 class="text-h6 font-weight-medium mb-4">Status Proses</h5>
        
        <VRow>
          <VCol cols="12" md="3">
            <VCard
              variant="outlined"
              class="text-center pa-4"
              :class="{ 'active-step': currentStep === 'consultation' }"
            >
              <VIcon size="32" color="primary" class="mb-2">
                tabler-message-circle
              </VIcon>
              <h6 class="text-subtitle-1 font-weight-medium mb-1">Konsultasi</h6>
              <p class="text-caption text-medium-emphasis mb-0">
                {{ currentStep === 'consultation' ? 'Sedang Berlangsung' : 'Belum Dimulai' }}
              </p>
            </VCard>
          </VCol>
          
          <VCol cols="12" md="3">
            <VCard
              variant="outlined"
              class="text-center pa-4"
              :class="{ 'active-step': currentStep === 'recommendation' }"
            >
              <VIcon size="32" color="info" class="mb-2">
                tabler-clipboard-list
              </VIcon>
              <h6 class="text-subtitle-1 font-weight-medium mb-1">Rekomendasi</h6>
              <p class="text-caption text-medium-emphasis mb-0">
                {{ currentStep === 'recommendation' ? 'Sedang Berlangsung' : 'Menunggu' }}
              </p>
            </VCard>
          </VCol>
          
          <VCol cols="12" md="3">
            <VCard
              variant="outlined"
              class="text-center pa-4"
              :class="{ 'active-step': currentStep === 'treatment' }"
            >
              <VIcon size="32" color="warning" class="mb-2">
                tabler-stethoscope
              </VIcon>
              <h6 class="text-subtitle-1 font-weight-medium mb-1">Tindakan</h6>
              <p class="text-caption text-medium-emphasis mb-0">
                {{ currentStep === 'treatment' ? 'Sedang Berlangsung' : 'Menunggu' }}
              </p>
            </VCard>
          </VCol>
          
          <VCol cols="12" md="3">
            <VCard
              variant="outlined"
              class="text-center pa-4"
              :class="{ 'active-step': currentStep === 'payment' }"
            >
              <VIcon size="32" color="success" class="mb-2">
                tabler-credit-card
              </VIcon>
              <h6 class="text-subtitle-1 font-weight-medium mb-1">Pembayaran</h6>
              <p class="text-caption text-medium-emphasis mb-0">
                {{ currentStep === 'payment' ? 'Sedang Berlangsung' : 'Menunggu' }}
              </p>
            </VCard>
          </VCol>
        </VRow>
      </div>

      <!-- Quick Actions -->
      <VDivider class="my-6" />
      
      <h5 class="text-h6 font-weight-medium mb-4">Mulai Sekarang</h5>
      
      <VRow>
        <VCol cols="12" md="6">
          <VCard
            variant="outlined"
            class="text-center pa-6 cursor-pointer consultation-card"
            @click="goToConsultation"
          >
            <VIcon size="64" color="primary" class="mb-4">
              tabler-message-circle
            </VIcon>
            <h5 class="text-h5 font-weight-bold mb-3">Konsultasi</h5>
            <p class="text-body-1 text-medium-emphasis mb-4">
              Mulai dengan konsultasi dokter untuk mendapatkan rekomendasi treatment yang tepat
            </p>
            <VBtn
              color="primary"
              size="large"
              prepend-icon="tabler-arrow-right"
            >
              Mulai Konsultasi
            </VBtn>
          </VCard>
        </VCol>
        
        <VCol cols="12" md="6">
          <VCard
            variant="outlined"
            class="text-center pa-6 cursor-pointer treatment-card"
            @click="goToTreatment"
          >
            <VIcon size="64" color="warning" class="mb-4">
              tabler-stethoscope
            </VIcon>
            <h5 class="text-h5 font-weight-bold mb-3">Treatment Langsung</h5>
            <p class="text-body-1 text-medium-emphasis mb-4">
              Langsung melakukan treatment tanpa perlu konsultasi terlebih dahulu
            </p>
            <VBtn
              color="warning"
              size="large"
              prepend-icon="tabler-arrow-right"
            >
              Mulai Treatment
            </VBtn>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep = ref('')

const breadcrumbItems = ref([
  {
    title: 'Dashboard',
    to: { name: 'dashboards-analytics' },
    active: false,
  },
  {
    title: 'Transaction',
    to: { name: 'transaction-billings' },
    active: false,
  },
  {
    title: 'Alur Billing',
    to: { name: 'transaction-billings-flow' },
    active: true,
  },
])

function startConsultation() {
  currentStep.value = 'consultation'
  router.push({ name: 'transaction-billings-consultation-create' })
}

function startDirectTreatment() {
  currentStep.value = 'treatment'
  router.push({ name: 'transaction-billings-treatment-create' })
}

function goToConsultation() {
  currentStep.value = 'consultation'
  router.push({ name: 'transaction-billings-consultation-create' })
}

function goToTreatment() {
  currentStep.value = 'treatment'
  router.push({ name: 'transaction-billings-treatment-create' })
}



// Set initial step based on route
function setCurrentStep() {
  const route = router.currentRoute.value
  if (route.name === 'transaction-billings-consultation-create') {
    currentStep.value = 'consultation'
  } else if (route.name === 'transaction-billings-treatment-create') {
    currentStep.value = 'treatment'
  } else if (route.name === 'transaction-billings-product-create') {
    currentStep.value = 'payment'
  }
}

// Watch for route changes
router.afterEach((to) => {
  if (to.name === 'transaction-billings-consultation-create') {
    currentStep.value = 'consultation'
  } else if (to.name === 'transaction-billings-treatment-create') {
    currentStep.value = 'treatment'
  } else if (to.name === 'transaction-billings-product-create') {
    currentStep.value = 'payment'
  }
})
</script>

<style lang="scss" scoped>
.simple-flow {
  max-width: 800px;
  margin: 0 auto;
}

.flow-step-simple {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  color: white;
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content-simple {
  flex-grow: 1;
}

.option-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;
}

.option-card {
  padding: 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    border-color: #1976d2;
    box-shadow: 0 8px 25px rgba(25, 118, 210, 0.2);
  }
}

.consultation-option:hover {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.05), rgba(25, 118, 210, 0.1));
}

.treatment-option:hover {
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.05), rgba(255, 152, 0, 0.1));
}

.process-info,
.payment-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-weight: 500;
}

.consultation-card,
.treatment-card {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }
}

.consultation-card:hover {
  border-color: #1976d2;
}

.treatment-card:hover {
  border-color: #ff9800;
}

.active-step {
  border: 2px solid #1976d2;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05));
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.2);
}

.process-status {
  .v-card {
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .flow-step-simple {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .option-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .process-info,
  .payment-info {
    gap: 0.5rem;
  }
  
  .info-item {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
}
</style> 
