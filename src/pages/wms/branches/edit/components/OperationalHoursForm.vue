<template>
  <VRow>
    <VCol
      v-for="day in days"
      :key="day"
      cols="12"
      md="6"
      lg="4"
    >
      <VCard variant="outlined" class="pa-4">
        <div class="d-flex align-center justify-space-between mb-3">
          <h4 class="text-h6 font-weight-medium">
            {{ getDayLabel(day) }}
          </h4>
          <div class="d-flex gap-1">
            <VBtn
              v-if="isDayClosed(day)"
              size="small"
              color="success"
              variant="tonal"
              @click="setDayOpen(day)"
            >
              Buka
            </VBtn>
            <VBtn
              v-else
              size="small"
              color="error"
              variant="tonal"
              @click="setDayClosed(day)"
            >
              Tutup
            </VBtn>
          </div>
        </div>
        
        <div v-if="isDayClosed(day)" class="text-center py-4">
          <VIcon size="24" color="error" class="mb-2">
            tabler-x-circle
          </VIcon>
          <div class="text-body-2 text-medium-emphasis">
            Tutup
          </div>
        </div>
        
        <div v-else-if="getDayHours(day)" class="d-flex gap-2 align-end">
          <div class="flex-grow-1">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">Buka</label>
            <VSelect
              v-model="getDayHours(day).open"
              :items="timeOptions"
              variant="outlined"
              density="compact"
              hide-details="auto"
            />
          </div>
          <div class="flex-grow-1">
            <label class="text-subtitle-2 font-weight-medium mb-2 d-block">Tutup</label>
            <VSelect
              v-model="getDayHours(day).close"
              :items="timeOptions"
              variant="outlined"
              density="compact"
              hide-details="auto"
            />
          </div>
        </div>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { DAYS, DAY_LABELS, TIME_OPTIONS } from '../constants'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

// Constants
const days = DAYS
const timeOptions = TIME_OPTIONS

// Methods
const getDayLabel = (day) => {
  return DAY_LABELS[day] || day
}

const getDayHours = (day) => {
  const dayData = props.modelValue[day]
  if (dayData && typeof dayData === 'object' && dayData.open && dayData.close) {
    return dayData
  }
  return null
}

const setDayClosed = (day) => {
  props.modelValue[day] = 'CLOSED'
}

const setDayOpen = (day) => {
  props.modelValue[day] = { open: '08:00', close: '17:00' }
}

const isDayClosed = (day) => {
  return props.modelValue[day] === 'CLOSED'
}
</script> 
 