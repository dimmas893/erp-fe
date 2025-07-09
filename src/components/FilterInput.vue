<template>
  <div>
    <!-- Text Input for most operators -->
    <VTextField
      v-if="shouldShowTextInput"
      :model-value="localFilter.search_query"
      :label="getInputLabel(localFilter.filter_type)"
      :type="getInputType()"
      density="comfortable"
      variant="outlined"
      hide-details
      @update:model-value="updateField('search_query', $event)"
      @keyup.enter="$emit('apply')"
    />
    
    <!-- Range Input (between/not_between) -->
    <div v-else-if="isRangeInput">
      <VRow no-gutters>
        <VCol cols="6" class="pe-1">
          <VTextField
            :model-value="localFilter.start_value"
            label="Nilai Awal"
            :type="getInputType()"
            density="comfortable"
            variant="outlined"
            hide-details
            @update:model-value="updateField('start_value', $event)"
          />
        </VCol>
        <VCol cols="6" class="ps-1">
          <VTextField
            :model-value="localFilter.end_value"
            label="Nilai Akhir"
            :type="getInputType()"
            density="comfortable"
            variant="outlined"
            hide-details
            @update:model-value="updateField('end_value', $event)"
          />
        </VCol>
      </VRow>
    </div>
    
    <!-- Date Range Picker -->
    <div v-else-if="isDateRangeInput">
      <VRow no-gutters>
        <VCol cols="6" class="pe-1">
          <VTextField
            :model-value="localFilter.date_from"
            label="Dari Tanggal"
            type="date"
            density="comfortable"
            variant="outlined"
            hide-details
            @update:model-value="updateField('date_from', $event)"
          />
        </VCol>
        <VCol cols="6" class="ps-1">
          <VTextField
            :model-value="localFilter.date_to"
            label="Sampai Tanggal"
            type="date"
            density="comfortable"
            variant="outlined"
            hide-details
            @update:model-value="updateField('date_to', $event)"
          />
        </VCol>
      </VRow>
    </div>
    
    <!-- Comma Separated List (in/not_in/array_overlap) -->
    <VTextField
      v-else-if="isListInput"
      :model-value="localFilter.values_list"
      label="Daftar nilai (pisah dengan koma)"
      placeholder="contoh: nilai1, nilai2, nilai3"
      density="comfortable"
      variant="outlined"
      hide-details
      @update:model-value="updateField('values_list', $event)"
      @keyup.enter="$emit('apply')"
    />
    
    <!-- Select Input for predefined options -->
    <VSelect
      v-else-if="isSelectInput"
      :model-value="localFilter.search_query"
      :items="getSelectItems()"
      item-title="title"
      item-value="value"
      :label="getSelectLabel()"
      density="comfortable"
      variant="outlined"
      hide-details
      @update:model-value="updateField('search_query', $event)"
    />
    
    <!-- No Input for null checks -->
    <VCard v-else-if="isNullCheck" variant="outlined" class="pa-3">
      <div class="text-center text-medium-emphasis">
        <VIcon class="mb-2">tabler-info-circle</VIcon>
        <div class="text-caption">
          Operator ini tidak memerlukan nilai input
        </div>
      </div>
    </VCard>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  fieldConfig: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'apply'])

// Local state
const localFilter = ref({ ...props.modelValue })

// Computed
const shouldShowTextInput = computed(() => {
  return !isRangeInput.value && 
         !isDateRangeInput.value && 
         !isListInput.value && 
         !isSelectInput.value && 
         !isNullCheck.value
})

const isRangeInput = computed(() => {
  return ['between', 'not_between'].includes(localFilter.value.filter_type)
})

const isDateRangeInput = computed(() => {
  return localFilter.value.filter_type === 'date_range' || 
         (props.fieldConfig?.type === 'date' && !isRangeInput.value)
})

const isListInput = computed(() => {
  return ['in', 'not_in', 'array_overlap'].includes(localFilter.value.filter_type)
})

const isSelectInput = computed(() => {
  return (props.fieldConfig?.options && props.fieldConfig.options.length > 0) || 
         ['gender', 'consent_status', 'is_active'].includes(localFilter.value.search_by)
})

const isNullCheck = computed(() => {
  return ['is_null', 'is_not_null'].includes(localFilter.value.filter_type)
})

// Functions
function getInputType() {
  if (props.fieldConfig?.type === 'number' || isNumericField(localFilter.value.search_by)) {
    return 'number'
  }
  if (props.fieldConfig?.type === 'email') {
    return 'email'
  }
  if (props.fieldConfig?.type === 'tel') {
    return 'tel'
  }
  return 'text'
}

function getInputLabel(operator) {
  switch (operator) {
    case 'between': return 'Nilai Awal'
    case 'not_between': return 'Nilai Awal'
    case 'in': return 'Daftar nilai (pisah dengan koma)'
    case 'not_in': return 'Daftar nilai (pisah dengan koma)'
    case 'array_overlap': return 'Daftar nilai (pisah dengan koma)'
    default: return 'Nilai'
  }
}

function getSelectItems() {
  // Use custom options if provided
  if (props.fieldConfig?.options && props.fieldConfig.options.length > 0) {
    return props.fieldConfig.options
  }
  
  // Default options for common fields
  switch (localFilter.value.search_by) {
    case 'branch_id':
      return props.fieldConfig?.options || []
    case 'is_active':
      return [
        { title: 'Aktif', value: 'true' },
        { title: 'Nonaktif', value: 'false' }
      ]
    case 'consent_status':
      return [
        { title: 'Diberikan', value: 'GIVEN' },
        { title: 'Menunggu', value: 'PENDING' },
        { title: 'Ditolak', value: 'DENIED' }
      ]
    case 'gender':
      return [
        { title: 'Laki-laki', value: 'MALE' },
        { title: 'Perempuan', value: 'FEMALE' }
      ]
    default:
      return []
  }
}

function getSelectLabel() {
  switch (localFilter.value.search_by) {
    case 'branch_id': return 'Pilih Cabang'
    case 'is_active': return 'Status'
    case 'consent_status': return 'Status Persetujuan'
    case 'gender': return 'Jenis Kelamin'
    default: return props.fieldConfig?.label || 'Pilih nilai'
  }
}

function isNumericField(field) {
  return props.fieldConfig?.type === 'number' || 
         ['age', 'patient_number', 'phone', 'id'].includes(field)
}

function updateField(field, value) {
  localFilter.value = {
    ...localFilter.value,
    [field]: value
  }
  // Emit directly instead of using watcher
  emit('update:modelValue', localFilter.value)
}

// Watch for changes from parent only (no circular update)
watch(() => props.modelValue, (newValue) => {
  localFilter.value = { ...newValue }
}, { deep: true })
</script> 
