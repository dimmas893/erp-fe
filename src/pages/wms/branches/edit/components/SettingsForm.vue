<template>
  <VRow>
    <VCol cols="12" md="6">
      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">Maksimal Hari Stok</label>
      <VTextField
        v-model.number="modelValue.settings.max_stock_days"
        type="number"
        variant="outlined"
        :rules="validationRules.max_stock_days"
        required
        hide-details="auto"
      />
    </VCol>
    
    <VCol cols="12" md="6">
      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">Minimal Hari Stok</label>
      <VTextField
        v-model.number="modelValue.settings.min_stock_days"
        type="number"
        variant="outlined"
        :rules="validationRules.min_stock_days"
        required
        hide-details="auto"
      />
    </VCol>
    
    <VCol cols="12" md="6">
      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">Tingkat Prioritas</label>
      <VSelect
        v-model="modelValue.settings.priority_level"
        :items="priorityOptions"
        variant="outlined"
        :rules="validationRules.priority_level"
        required
        hide-details="auto"
      />
    </VCol>
    
    <VCol cols="12" md="6">
      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">Hari Auto Reorder</label>
      <VTextField
        v-model.number="modelValue.settings.auto_reorder_days"
        type="number"
        variant="outlined"
        :rules="validationRules.auto_reorder_days"
        required
        hide-details="auto"
      />
    </VCol>
  </VRow>
</template>

<script setup>
import { PRIORITY_OPTIONS } from '../constants';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  validationRules: {
    type: Object,
    required: true
  }
})

// Options
const priorityOptions = PRIORITY_OPTIONS
</script> 
