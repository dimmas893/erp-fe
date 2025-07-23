<route lang="yaml">
meta:
  layout: default
  navActiveLink: transaction-billings
</route>

<script setup>
import { requiredValidator } from '@/@core/utils/validators'
import { $api } from '@/utils/api'
import { showErrorAlert, showSuccessAlert } from '@/utils/errorHandler'
import { useRouter } from 'vue-router'
import { VForm } from 'vuetify/components/VForm'

// Initialize router
const router = useRouter()

// Form data structure for consultation
const formData = ref({
  visit_id: '',
  service_id: '',
  total_amount: '',
  discount_amount: '',
  tax_amount: '',
  grand_total: '',
  status: 'open_consultation', // Static status for consultation
  doctor_id: '',
  consultation_fee: '',
  consultation_start_time: '',
})

// Form validation
const refForm = ref()
const isLoading = ref(false)

// Status is now static for consultation creation

// Data for dropdowns
const visits = ref([])
const doctors = ref([])
const services = ref([])
const schedules = ref([])
const loadingVisits = ref(false)
const loadingDoctors = ref(false)
const loadingServices = ref(false)
const loadingSchedules = ref(false)

// Selected visit data
const selectedVisit = ref(null)
const selectedDoctor = ref(null)
const selectedService = ref(null)
const selectedDate = ref('')
const availableTimeSlots = ref([])
const selectedTimeSlot = ref(null)
// Status is static, no need for selectedStatus

// onMounted: load initial data
onMounted(async () => {
  await Promise.all([
    loadVisits(),
    loadServices()
  ])
  
  // Set today's date as default
  const today = new Date()
  const todayString = today.toISOString().split('T')[0]
  selectedDate.value = todayString
  
  // Status is static 'open_consultation'
  
  // Clear consultation start time initially - will be set when time slot is selected
  formData.value.consultation_start_time = ''
})



// Watch visit selection
watch(() => selectedVisit.value, async newVal => {
  console.log('Visit selection changed to:', newVal)
  console.log('Visit selection type:', typeof newVal)
  console.log('Visit selection value:', newVal)
  
  if (newVal) {
    await onVisitSelected(newVal)
  } else {
    // Clear doctor selection when visit is cleared
    formData.value.doctor_id = ''
    formData.value.visit_id = ''
    doctors.value = []
  }
})

// Watch service selection
watch(() => selectedService.value, newVal => {
  console.log('Service selection changed to:', newVal)
  if (newVal) {
    const serviceData = typeof newVal === 'object' ? newVal.data : services.value.find(s => s.value === newVal)?.data
    console.log('Found service data:', serviceData)
    
    if (serviceData) {
      formData.value.service_id = typeof newVal === 'object' ? newVal.value : newVal
      console.log('Set service_id:', formData.value.service_id)
    }
  } else {
    formData.value.service_id = ''
  }
})

// Watch consultation start time to reload schedules when date changes
watch(() => formData.value.consultation_start_time, async newVal => {
  console.log('Consultation start time changed to:', newVal)
  if (newVal && formData.value.doctor_id) {
    const consultationDate = newVal.split('T')[0]
    await loadDoctorSchedules(formData.value.doctor_id, consultationDate)
  }
})

// Watch selected date to check availability
watch(() => selectedDate.value, async newVal => {
  console.log('Selected date changed to:', newVal)
  if (newVal && formData.value.doctor_id) {
    await loadDoctorSchedules(formData.value.doctor_id, newVal)
  }
})

// Status is static, no need for status watcher



// Watch doctor selection to auto-fill consultation fee and load schedules
watch(() => selectedDoctor.value, async newVal => {
  console.log('Doctor selection changed to:', newVal)
  if (newVal) {
    // Handle both object and value
    const doctorData = typeof newVal === 'object' ? newVal.data : doctors.value.find(d => d.value === newVal)?.data
    console.log('Found doctor data:', doctorData)
    
    if (doctorData && doctorData.consultation_fee) {
      formData.value.consultation_fee = doctorData.consultation_fee
      formData.value.total_amount = parseFloat(doctorData.consultation_fee).toFixed(2)
      formData.value.doctor_id = typeof newVal === 'object' ? newVal.value : newVal
      calculateGrandTotal()
      console.log('Auto-filled consultation fee:', doctorData.consultation_fee)
    }
    
    // Load schedules for selected doctor using date from consultation start time
    if (formData.value.consultation_start_time) {
      const consultationDate = formData.value.consultation_start_time.split('T')[0]
      await loadDoctorSchedules(formData.value.doctor_id, consultationDate)
    }
  } else {
    formData.value.doctor_id = ''
    formData.value.consultation_fee = ''
    schedules.value = []
  }
})



// Fetch doctors for selected branch
const loadDoctors = async branchId => {
  console.log('loadDoctors called with branchId:', branchId)
  console.log('branchId type:', typeof branchId)
  console.log('branchId value:', branchId)
  
  if (!branchId) {
    console.log('No branchId provided, clearing doctors')
    doctors.value = []
    return
  }
  
  try {
    loadingDoctors.value = true
    const apiUrl = `/hris/doctors/branch/${branchId}`
    console.log('Making API call to:', apiUrl)

    const response = await $api(apiUrl, {
      method: 'GET',
    })

    console.log('Doctors API response:', response)

    if (response.data && Array.isArray(response.data)) {
      if (response.data.length === 0) {
        console.warn('No doctors found for branch_id:', branchId)
        // Try to load all doctors as fallback
        console.log('Trying to load all doctors as fallback...')
        await loadAllDoctors()
      } else {
    doctors.value = response.data.map(doctor => ({
          title: `${doctor.name} - ${doctor.specialization}`,
      value: doctor.id,
          data: doctor, // Store full doctor data
        }))
        
        // Set selectedDoctor if there's a doctor_id from visit
        if (formData.value.doctor_id) {
          const doctorToSelect = doctors.value.find(d => d.value === formData.value.doctor_id)
          if (doctorToSelect) {
            selectedDoctor.value = doctorToSelect
            console.log('Auto-selected doctor:', doctorToSelect.title)
          }
        }
        
        console.log('Processed doctors:', doctors.value)
      }
    } else {
      console.error('Invalid response format:', response)
      doctors.value = []
    }
  } catch (error) {
    console.error('Error loading doctors:', error)
    console.error('Error details:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    })
    
    // Check if it's a 404 or no data found
    if (error.response?.status === 404 || error.message?.includes('not found')) {
      console.log('No doctors found for branch, trying to load all doctors...')
      await loadAllDoctors()
    } else {
      doctors.value = []
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Dokter',
      text: 'Tidak dapat memuat daftar dokter. Silakan refresh halaman.',
    })
    }
  } finally {
    loadingDoctors.value = false
  }
}

// Fallback function to load all doctors
const loadAllDoctors = async () => {
  try {
    console.log('Loading all doctors as fallback...')
    const response = await $api('/hris/doctors', {
      method: 'GET',
    })

    console.log('All doctors API response:', response)

    if (response.data && Array.isArray(response.data)) {
      doctors.value = response.data.map(doctor => ({
        title: `${doctor.name} - ${doctor.specialization}`,
        value: doctor.id,
        data: doctor, // Store full doctor data
      }))
      
      // Set selectedDoctor if there's a doctor_id from visit
      if (formData.value.doctor_id) {
        const doctorToSelect = doctors.value.find(d => d.value === formData.value.doctor_id)
        if (doctorToSelect) {
          selectedDoctor.value = doctorToSelect
          console.log('Auto-selected doctor from all doctors:', doctorToSelect.title)
        }
      }
      
      console.log('Processed all doctors:', doctors.value)
    }
  } catch (error) {
    console.error('Error loading all doctors:', error)
    doctors.value = []
  }
}

// Load services
const loadServices = async () => {
  try {
    loadingServices.value = true
    console.log('Loading services...')

    const response = await $api('/crm/services', {
      method: 'GET',
    })

    console.log('Services API response:', response)

    if (response.data && Array.isArray(response.data)) {
      services.value = response.data
        .filter(service => service.service_type === 'CONSULTATION' && service.is_active)
        .map(service => ({
          title: `${service.name} - ${service.description}`,
          value: service.id,
          data: service, // Store full service data
        }))
      
      console.log('Processed services:', services.value)
    }
  } catch (error) {
    console.error('Error loading services:', error)
    await showErrorAlert(error, {
      title: 'Gagal Memuat Data Layanan',
      text: 'Tidak dapat memuat daftar layanan. Silakan refresh halaman.',
    })
  } finally {
    loadingServices.value = false
  }
}

// Load doctor schedules
const loadDoctorSchedules = async (doctorId, date) => {
  try {
    loadingSchedules.value = true
    console.log('Loading schedules for doctor:', doctorId, 'date:', date)

    const response = await $api('/crm/doctor-schedules/check-available', {
      method: 'POST',
      body: {
        doctor_id: doctorId,
        date: date
      }
    })

    console.log('Schedules API response:', response)

    if (response.data && Array.isArray(response.data)) {
      schedules.value = response.data
      
      // Extract available time slots from all schedules
      availableTimeSlots.value = []
      schedules.value.forEach(schedule => {
        if (schedule.available_time_slots && schedule.available_slots > 0) {
          schedule.available_time_slots.forEach(slot => {
            availableTimeSlots.value.push({
              ...slot,
              schedule_id: schedule.id,
              doctor_name: schedule.doctor_name,
              day: schedule.day
            })
          })
        }
      })
      
      console.log('Available time slots:', availableTimeSlots.value)
      console.log('Processed schedules:', schedules.value)
    } else {
      schedules.value = []
      availableTimeSlots.value = []
    }
  } catch (error) {
    console.error('Error loading schedules:', error)
    schedules.value = []
    availableTimeSlots.value = []
    await showErrorAlert(error, {
      title: 'Gagal Memuat Jadwal Dokter',
      text: 'Tidak dapat memuat jadwal dokter. Silakan coba lagi.',
    })
  } finally {
    loadingSchedules.value = false
  }
}



// Fetch all visits
const loadVisits = async () => {
  try {
    loadingVisits.value = true

    const response = await $api('/rme/patient-visits', {
      method: 'GET',
    })

    console.log('Visits API response:', response)

    // Collect unique branch_ids for debugging
    const uniqueBranchIds = new Set()
    
    visits.value = (response.data || []).map(visit => {
      console.log('Processing visit:', {
        id: visit.id,
        id_type: typeof visit.id,
        visit_number: visit.visit_number,
        branch_id: visit.branch_id,
        patient: visit.patient?.name
      })
      uniqueBranchIds.add(visit.branch_id)
      return {
        title: `${visit.patient?.name} - ${visit.visit_number}`,
        value: visit.id,
        data: visit, // Store full visit data for auto-fill
      }
    })
    
    console.log('Unique branch_ids in visits:', Array.from(uniqueBranchIds))
    console.log('Processed visits count:', visits.value.length)
    console.log('Sample processed visit:', visits.value[0])
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

// Auto-fill form when visit is selected
const onVisitSelected = async visitObject => {
  console.log('onVisitSelected called with visitObject:', visitObject)
  
  // Since we're using return-object, visitObject should be the full object
  if (!visitObject || typeof visitObject !== 'object') {
    console.error('Invalid visit object:', visitObject)
    return
  }
  
  const visit = visitObject.data
  console.log('Found visit data:', visit)
  
  if (visit) {
    // Auto-fill form data from visit
    formData.value.visit_id = visit.id
    formData.value.doctor_id = visit.doctor_id
    console.log('Set visit_id from visit:', visit.id)
    console.log('Set doctor_id from visit:', visit.doctor_id)
    
    // Set selectedDoctor to null initially, will be set after doctors are loaded
    selectedDoctor.value = null
    
    // Set consultation start time to current time
    formData.value.consultation_start_time = new Date().toISOString()
    
    // Load doctors for this visit's branch_id
    console.log('Loading doctors for branch_id:', visit.branch_id)
    console.log('Visit details:', {
      id: visit.id,
      visit_number: visit.visit_number,
      branch_id: visit.branch_id,
      doctor_id: visit.doctor_id,
      patient_name: visit.patient?.name
    })
    
    await loadDoctors(visit.branch_id)
    
    // Auto-calculate amounts based on consultation fee
    if (formData.value.consultation_fee) {
      formData.value.total_amount = parseFloat(formData.value.consultation_fee).toFixed(2)
      calculateGrandTotal()
    }
  } else {
    console.error('Visit data not found in object:', visitObject)
  }
}

// Validation rules
const amountValidator = value => {
  if (!value) return 'Jumlah wajib diisi'
  if (isNaN(value) || parseFloat(value) < 0) return 'Jumlah harus berupa angka positif'
  
  return true
}

// Time slot validator
const timeSlotValidator = value => {
  if (!value) return 'Waktu mulai konsultasi wajib diisi'
  
  if (!selectedTimeSlot.value) return 'Pilih slot waktu terlebih dahulu'
  
  const selectedDateTime = new Date(value)
  
  // Get the time from the datetime input
  const selectedTime = selectedDateTime.toTimeString().split(' ')[0].substring(0, 5)
  
  // Parse the time slot boundaries
  const startTime = selectedTimeSlot.value.start_time
  const endTime = selectedTimeSlot.value.end_time
  
  // Check if selected time is within the slot range
  if (selectedTime < startTime || selectedTime >= endTime) {
    return `Waktu harus berada dalam rentang ${startTime} - ${endTime}`
  }
  
  return true
}

// Format currency helper
const formatCurrency = (amount) => {
  if (!amount) return 'Rp 0'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}



const calculateGrandTotal = () => {
  const totalAmount = parseFloat(formData.value.total_amount) || 0
  const discountAmount = parseFloat(formData.value.discount_amount) || 0
  const taxAmount = parseFloat(formData.value.tax_amount) || 0
  
  // Calculate grand total: total - discount + tax
  const grandTotal = totalAmount - discountAmount + taxAmount
  formData.value.grand_total = grandTotal.toFixed(2)
  
  console.log('💰 Calculated grand total:', {
    totalAmount,
    discountAmount,
    taxAmount,
    grandTotal: formData.value.grand_total
  })
}

// Watch for changes in amounts to auto-calculate grand total
watch([
  () => formData.value.total_amount,
  () => formData.value.discount_amount,
  () => formData.value.tax_amount,
], () => {
  calculateGrandTotal()
})

// Fetch consultation services
const loadConsultationServices = async () => {
  try {
    loadingConsultationServices.value = true
    const response = await $api('/crm/services', { method: 'GET' })
    consultationServices.value = (response.data || []).filter(s => s.service_type === 'CONSULTATION' && s.is_active).map(s => ({
      title: s.name,
      value: s.id,
      raw: s
    }))
  } catch (error) {
    await showErrorAlert(error, {
      title: 'Gagal Memuat Jenis Konsultasi',
      text: 'Tidak dapat memuat daftar jenis konsultasi. Silakan refresh halaman.'
    })
  } finally {
    loadingConsultationServices.value = false
  }
}

// Submit form
const submitForm = async () => {
  const { valid } = await refForm.value.validate()
  
  if (!valid) return

  try {
    isLoading.value = true

    // Prepare data for the new API endpoint
    const submitData = {
      visit_id: formData.value.visit_id,
      service_id: formData.value.service_id,
      total_amount: parseFloat(formData.value.total_amount) || 0,
      discount_amount: parseFloat(formData.value.discount_amount) || 0,
      tax_amount: parseFloat(formData.value.tax_amount) || 0,
      grand_total: parseFloat(formData.value.grand_total) || 0,
      status: formData.value.status,
      doctor_id: formData.value.doctor_id,
      consultation_fee: parseFloat(formData.value.consultation_fee) || 0,
      consultation_start_time: formData.value.consultation_start_time,
    }
    
    console.log('🔍 Debug submit data:')
    console.log('visit_id:', formData.value.visit_id)
    console.log('visit_id type:', typeof formData.value.visit_id)
    console.log('Selected visit object:', selectedVisit.value)
    console.log('All form data:', formData.value)
    
    console.log('📤 Final billing submit data:', submitData)
    console.log('📤 API call to /transaction/billings/with-consultation with body:', JSON.stringify(submitData, null, 2))
    
    const response = await $api('/transaction/billings/with-consultation', {
      method: 'POST',
      body: submitData,
    })

    await showSuccessAlert(
      `Tagihan konsultasi berhasil dibuat dengan ID: ${response.data.billing.id}`,
      'Berhasil!',
    )

    // Redirect to billing detail page
    await router.push({ 
      name: 'transaction-billings-id', 
      params: { id: response.data.billing.id } 
    })
    
  } catch (error) {
    console.error('Error creating billing:', error)
    await showErrorAlert(error)
  } finally {
    isLoading.value = false
  }
}

// Reset form
const resetForm = () => {
  refForm.value?.reset()
  formData.value = {
    patient_id: '',
    visit_id: '',
    promo_id: '',
    payment_method_id: '',
    total_amount: '',
    discount_amount: '',
    tax_amount: '',
    grand_total: '',
    status: '',
  }
  selectedDoctor.value = ''
  selectedBranch.value = ''
  selectedConsultationService.value = ''
  consultationFee.value = ''
  selectedPromo.value = null
}

// Select time slot
const selectTimeSlot = (timeSlot) => {
  console.log('Selected time slot:', timeSlot)
  selectedTimeSlot.value = timeSlot
  
  // Set default consultation start time to the beginning of the selected slot
  const selectedDateTime = `${selectedDate.value}T${timeSlot.start_time}`
  formData.value.consultation_start_time = selectedDateTime
  
  console.log('Set default consultation start time:', formData.value.consultation_start_time)
}

// Get minimum datetime for the input field
const getMinDateTime = () => {
  if (!selectedTimeSlot.value || !selectedDate.value) return ''
  
  return `${selectedDate.value}T${selectedTimeSlot.value.start_time}`
}

// Get maximum datetime for the input field
const getMaxDateTime = () => {
  if (!selectedTimeSlot.value || !selectedDate.value) return ''
  
  return `${selectedDate.value}T${selectedTimeSlot.value.end_time}`
}

// Cancel and go back
const goBack = () => {
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
        Tambah Tagihan Konsultasi
      </VCardTitle>
      <VCardSubtitle>
        Lengkapi data tagihan konsultasi untuk membuat tagihan baru
      </VCardSubtitle>
    </VCardItem>

    <VCardText>
      <VForm
        ref="refForm"
        @submit.prevent="submitForm"
        validate-on="submit"
      >
        <VRow>
          <!-- Visit Selection -->
          <VCol
            cols="12"
            md="6"
          >
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Kunjungan *
            </label>
            <AppCombobox
              v-model="selectedVisit"
              placeholder="Pilih kunjungan..."
              :items="visits"
              :loading="loadingVisits"
              :rules="[requiredValidator]"
              required
              clearable
              hide-details="auto"
              return-object
            />
          </VCol>

          <!-- Doctor Selection -->
          <VCol  
            cols="12"
            md="6"
          >
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Dokter *
            </label>
            <AppCombobox
              v-model="selectedDoctor"
              placeholder="Pilih dokter..."
              :items="doctors"
              :loading="loadingDoctors"
              :rules="[requiredValidator]"
              required
              clearable
              hide-details="auto"
              return-object
            />
          </VCol>

          <!-- Service Selection -->
          <VCol  
            cols="12"
            md="6"
          >
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Layanan *
            </label>
            <AppCombobox
              v-model="selectedService"
              placeholder="Pilih layanan..."
              :items="services"
              :loading="loadingServices"
              :rules="[requiredValidator]"
              required
              clearable
              hide-details="auto"
              return-object
            />
          </VCol>



          <!-- Consultation Fee -->
          <VCol 
            cols="12"
            md="6"
          >
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Biaya Konsultasi *
            </label>
            <VTextField
              v-model="formData.consultation_fee"
              placeholder="Masukkan biaya konsultasi..."
              type="number"
              variant="outlined"
              :rules="[requiredValidator, amountValidator]"
              required
              hide-details="auto"
              prepend-inner-icon="tabler-currency-dollar"
            />
          </VCol>
          

        </VRow>

        <!-- Date Selection -->
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Tanggal Konsultasi *
            </label>
            <VTextField
              v-model="selectedDate"
              placeholder="Pilih tanggal..."
              type="date"
              variant="outlined"
              :rules="[requiredValidator]"
              required
              hide-details="auto"
              prepend-inner-icon="tabler-calendar"
              :min="new Date().toISOString().split('T')[0]"
            />
            <div class="text-caption text-medium-emphasis mt-1">
              <VIcon size="14" class="mr-1">
                tabler-info-circle
              </VIcon>
              Pilih tanggal untuk melihat jadwal tersedia
            </div>
          </VCol>
        </VRow>

        <!-- Doctor Schedule Section -->
        <VRow v-if="schedules.length > 0">
          <VCol cols="12">
            <VCard variant="outlined" class="pa-4">
              <VCardTitle class="text-h6 mb-4">
                <VIcon start color="primary">
                  tabler-calendar-time
                </VIcon>
                Jadwal Tersedia Dokter
              </VCardTitle>
              
              <VRow>
                <VCol 
                  v-for="schedule in schedules" 
                  :key="schedule.id" 
                  cols="12" 
                  md="6"
                >
                  <VCard variant="outlined" class="pa-4">
                    <div class="d-flex align-center gap-3 mb-3">
                      <VIcon size="24" color="primary">
                        tabler-user-md
                      </VIcon>
                      <div>
                        <h6 class="text-subtitle-1 font-weight-bold mb-1">
                          {{ schedule.doctor_name }}
                        </h6>
                        <p class="text-caption text-medium-emphasis mb-0">
                          {{ schedule.day }} • {{ schedule.start_time }} - {{ schedule.end_time }}
                        </p>
                      </div>
                    </div>
                    
                    <VDivider class="my-3" />
                    
                    <div class="d-flex justify-space-between align-center mb-2">
                      <span class="text-body-2">Slot Tersedia:</span>
                      <VChip 
                        :color="schedule.available_slots > 0 ? 'success' : 'error'"
                        size="small"
                      >
                        {{ schedule.available_slots }} / {{ schedule.max_appointments }}
                      </VChip>
                    </div>
                    
                    <div class="d-flex justify-space-between align-center mb-2">
                      <span class="text-body-2">Durasi:</span>
                      <span class="text-body-1 font-weight-medium">
                        {{ schedule.duration_hours }} jam
                      </span>
                    </div>
                    
                    <div v-if="schedule.break_start_time && schedule.break_end_time" class="d-flex justify-space-between align-center mb-2">
                      <span class="text-body-2">Istirahat:</span>
                      <span class="text-body-1 font-weight-medium">
                        {{ schedule.break_start_time }} - {{ schedule.break_end_time }}
                      </span>
                    </div>
                    
                    <VDivider class="my-3" />
                    
                    <div class="mb-3">
                      <h6 class="text-subtitle-2 font-weight-medium mb-2">Slot Waktu Tersedia:</h6>
                      <div class="d-flex flex-wrap gap-2">
                        <VChip
                          v-for="timeSlot in schedule.available_time_slots"
                          :key="`${timeSlot.start_time}-${timeSlot.end_time}`"
                          color="primary"
                          variant="outlined"
                          size="small"
                        >
                          {{ timeSlot.start_time }} - {{ timeSlot.end_time }}
                        </VChip>
                      </div>
                    </div>
                    
                    <div v-if="schedule.notes" class="mt-3 pa-3 bg-info-lighten-5 rounded">
                      <div class="d-flex align-center gap-2">
                        <VIcon size="16" color="info">
                          tabler-info-circle
                        </VIcon>
                        <span class="text-caption text-info">
                          {{ schedule.notes }}
                        </span>
                      </div>
                    </div>
                  </VCard>
                </VCol>
              </VRow>
            </VCard>
          </VCol>
        </VRow>

        <!-- Available Time Slots -->
        <VRow v-if="availableTimeSlots.length > 0">
          <VCol cols="12">
            <VCard variant="outlined" class="pa-4">
              <VCardTitle class="text-h6 mb-4">
                <VIcon start color="success">
                  tabler-clock-check
                </VIcon>
                Slot Waktu Tersedia
              </VCardTitle>
              
        <VRow>
                <VCol 
                  v-for="timeSlot in availableTimeSlots" 
                  :key="`${timeSlot.schedule_id}-${timeSlot.start_time}-${timeSlot.end_time}`" 
                  cols="12" 
                  md="4"
                >
                  <VCard 
                    variant="outlined" 
                    class="pa-3 time-slot-card"
                    :class="{ 'selected-time-slot': selectedTimeSlot === timeSlot }"
                    @click="selectTimeSlot(timeSlot)"
                  >
                    <div class="d-flex align-center gap-3">
                      <VIcon size="24" color="primary">
                        tabler-clock
                      </VIcon>
                      <div class="flex-grow-1">
                        <h6 class="text-subtitle-1 font-weight-bold mb-1">
                          {{ timeSlot.start_time }} - {{ timeSlot.end_time }}
                        </h6>
                        <p class="text-caption text-medium-emphasis mb-0">
                          {{ timeSlot.day }} • {{ timeSlot.doctor_name }}
                        </p>
                      </div>
                      <VBtn
                        icon="tabler-check"
                        color="primary"
                        variant="text"
                        size="small"
                        v-if="selectedTimeSlot === timeSlot"
                      />
                    </div>
                  </VCard>
                </VCol>
              </VRow>
            </VCard>
          </VCol>
        </VRow>

        <!-- Consultation Start Time (Manual input within selected time slot) -->
        <VRow v-if="selectedTimeSlot">
          <VCol
            cols="12"
            md="6"
          >
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
              Waktu Mulai Konsultasi *
            </label>
            <VTextField
              v-model="formData.consultation_start_time"
              :placeholder="`Pilih waktu antara ${selectedTimeSlot.start_time} - ${selectedTimeSlot.end_time}`"
              type="datetime-local"
              variant="outlined"
              :rules="[requiredValidator, timeSlotValidator]"
              required
              hide-details="auto"
              prepend-inner-icon="tabler-clock"
              :min="getMinDateTime()"
              :max="getMaxDateTime()"
            />
            <div class="text-caption text-info mt-1">
              <VIcon size="14" class="mr-1">
                tabler-info-circle
              </VIcon>
              Pilih waktu dalam rentang: {{ selectedTimeSlot.start_time }} - {{ selectedTimeSlot.end_time }}
            </div>
          </VCol>
        </VRow>

        <!-- Financial Information -->
        <VRow>
          <VCol cols="12">
            <VCard variant="outlined" class="pa-4">
              <VCardTitle class="text-h6 mb-4">
                <VIcon start color="primary">
                  tabler-calculator
                </VIcon>
                Informasi Keuangan
              </VCardTitle>
              <VRow>
                <VCol cols="12" md="3">
                  <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                    Total Amount *
                  </label>
                  <VTextField
                    v-model="formData.total_amount"
                    placeholder="Masukkan total amount..."
                    type="number"
                    variant="outlined"
                    :rules="[requiredValidator, amountValidator]"
                    required
                    hide-details="auto"
                    prepend-inner-icon="tabler-currency-dollar"
                  />
                </VCol>
                <VCol cols="12" md="3">
                  <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                    Discount Amount
                  </label>
                  <VTextField
                    v-model="formData.discount_amount"
                    placeholder="Masukkan discount amount..."
                    type="number"
                    variant="outlined"
                    :rules="[amountValidator]"
                    hide-details="auto"
                    prepend-inner-icon="tabler-percentage"
                  />
                </VCol>
                <VCol cols="12" md="3">
                  <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                    Tax Amount
                  </label>
                  <VTextField
                    v-model="formData.tax_amount"
                    placeholder="Masukkan tax amount..."
                    type="number"
                    variant="outlined"
                    :rules="[amountValidator]"
                    hide-details="auto"
                    prepend-inner-icon="tabler-receipt-tax"
                  />
                </VCol>
                <VCol cols="12" md="3">
                  <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                    Grand Total *
                  </label>
                  <VTextField
                    v-model="formData.grand_total"
                    placeholder="Masukkan grand total..."
                    type="number"
                    variant="outlined"
                    :rules="[requiredValidator, amountValidator]"
                    required
                    hide-details="auto"
                    prepend-inner-icon="tabler-calculator"
                  />
                </VCol>
              </VRow>
            </VCard>
          </VCol>
        </VRow>
        
        <!-- Status is static 'open_consultation' -->
        
        <div class="d-flex justify-end mt-4">
          <VBtn
            type="submit"
            :loading="isLoading"
            :disabled="isLoading"
            color="primary"
          >
            <VIcon start icon="tabler-device-floppy" />
            Buat Tagihan Konsultasi
          </VBtn>
        </div>
      </VForm>
    </VCardText>
  </VCard>
</template> 

<style lang="scss" scoped>
.time-slot-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: rgba(25, 118, 210, 0.3);
  }
  
  &.selected-time-slot {
    border-color: #1976d2;
    background: linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05));
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
  }
}
</style> 
