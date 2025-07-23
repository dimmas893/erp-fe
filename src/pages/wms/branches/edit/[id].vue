<route lang="yaml">
meta:
  layout: default
  navActiveLink: wms-branches
</route>

<template>
  <VCard>
    <!-- Loading State -->
    <LoadingState v-if="loading" />
    
    <!-- Error State -->
    <ErrorState 
      v-else-if="!loading && !branch"
      @back-to-list="navigateToList"
    />
    
    <!-- Edit Form -->
    <VCardText v-else-if="branch">
      <!-- Header -->
      <BranchEditHeader 
        :branch="branch"
        @back="navigateToDetail"
      />

      <!-- Edit Form -->
      <VDivider class="my-6" />
      <h3 class="text-h6 font-weight-medium mb-4">
        <VIcon class="me-2">tabler-edit</VIcon>
        Form Edit Cabang
      </h3>
      
      <VForm
        ref="editFormRef"
        v-model="isFormValid"
        @submit.prevent="handleSubmit"
      >
        <!-- Basic Information -->
        <BasicInformationForm 
          v-model="editData"
          :validation-rules="validationRules"
            />

        <!-- Operational Hours -->
        <VDivider class="my-6" />
        <h3 class="text-h6 font-weight-medium mb-4">
          <VIcon class="me-2">tabler-clock</VIcon>
          Jam Operasional
        </h3>
        
        <OperationalHoursForm 
          v-model="editData.operational_hours"
        />
        
        <!-- Settings -->
        <VDivider class="my-6" />
        <h3 class="text-h6 font-weight-medium mb-4">
          <VIcon class="me-2">tabler-settings</VIcon>
          Pengaturan Lanjutan
        </h3>
              
        <SettingsForm 
          v-model="editData"
          :validation-rules="validationRules"
                />
        
        <!-- Submit Buttons -->
        <FormActions 
          :submitting="submitting"
          :is-form-valid="isFormValid"
          @submit="handleSubmit"
          @cancel="navigateToDetail"
        />
      </VForm>
    </VCardText>
  </VCard>
</template>

<script setup>
import { showErrorAlert, showSuccessAlert } from '@/utils/errorHandler'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Components
import BasicInformationForm from './components/BasicInformationForm.vue'
import BranchEditHeader from './components/BranchEditHeader.vue'
import ErrorState from './components/ErrorState.vue'
import FormActions from './components/FormActions.vue'
import LoadingState from './components/LoadingState.vue'
import OperationalHoursForm from './components/OperationalHoursForm.vue'
import SettingsForm from './components/SettingsForm.vue'

// Composables
import { useBranchEdit } from './composables/useBranchEdit'
import { useFormValidation } from './composables/useFormValidation'

// Constants
import { DEFAULT_OPERATIONAL_HOURS } from './constants'

// Route & Router
const route = useRoute()
const router = useRouter()

// Composables
const { 
  branch, 
  loading, 
  fetchBranch, 
  updateBranch 
} = useBranchEdit(route.params.id)

const { 
  editData, 
  validationRules, 
  isFormValid, 
  editFormRef,
  ensureOperationalHoursStructure
} = useFormValidation()

// Form state
const submitting = ref(false)

// Methods
const handleSubmit = async () => {
  if (!editFormRef.value?.validate()) return

  submitting.value = true
  
  try {
    // Clean and structure operational hours data before sending
    const cleanData = { ...editData }
    
    // Ensure operational hours have correct structure without duplication
    if (cleanData.operational_hours) {
      const cleanOperationalHours = {}
      
      // Define the expected days in order
      const expectedDays = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']
      
      expectedDays.forEach(day => {
        const dayData = cleanData.operational_hours[day]
        
        if (dayData === 'CLOSED') {
          cleanOperationalHours[day] = 'CLOSED'
        } else if (dayData && typeof dayData === 'object' && dayData.open && dayData.close) {
          cleanOperationalHours[day] = {
            open: dayData.open,
            close: dayData.close
      }
    } else {
          // Default to CLOSED if data is invalid
          cleanOperationalHours[day] = 'CLOSED'
    }
      })
      
      // Ensure we only have the expected days, no duplicates
      cleanData.operational_hours = cleanOperationalHours
      
      // Validate the final structure
      const hasAllDays = expectedDays.every(day => cleanOperationalHours.hasOwnProperty(day))
      const hasNoExtraDays = Object.keys(cleanOperationalHours).every(day => expectedDays.includes(day))
      
      if (!hasAllDays || !hasNoExtraDays) {
        throw new Error('Invalid operational hours structure')
      }
    }
    
    // Ensure settings data is properly structured
    if (cleanData.settings) {
      cleanData.settings = {
        max_stock_days: parseInt(cleanData.settings.max_stock_days) || 90,
        min_stock_days: parseInt(cleanData.settings.min_stock_days) || 14,
        priority_level: cleanData.settings.priority_level || 'MEDIUM',
        auto_reorder_days: parseInt(cleanData.settings.auto_reorder_days) || 7
      }
    }
    
    await updateBranch(cleanData)
      await showSuccessAlert({
        title: 'Berhasil',
        text: 'Cabang berhasil diperbarui',
      })
    navigateToDetail()
  } catch (error) {
    await showErrorAlert(error, {
      title: 'Gagal Memperbarui Cabang',
      text: 'Tidak dapat memperbarui cabang. Silakan coba lagi.',
    })
  } finally {
    submitting.value = false
  }
}

const navigateToDetail = () => {
  router.push({ 
    name: 'wms-branches-id', 
    params: { id: route.params.id } 
  })
}

const navigateToList = () => {
  router.push({ name: 'wms-branches' })
}

// Lifecycle
onMounted(async () => {
  await fetchBranch()
  
  if (branch.value) {
    // Merge branch data with default form data, but be careful with operational_hours
    const { operational_hours, ...otherData } = branch.value
    
    // Merge other data first
    Object.assign(editData, otherData)
    
    // Handle operational hours separately to prevent duplication
    if (operational_hours) {
      // Create a clean copy of operational hours
      editData.operational_hours = { ...operational_hours }
      // Ensure clean structure without duplication
      ensureOperationalHoursStructure(editData)
    } else {
      // If no operational hours from API, use defaults
      editData.operational_hours = { ...DEFAULT_OPERATIONAL_HOURS }
    }
  }
})
</script> 
