<template>
  <VRow>
    <VCol cols="12" md="6">
      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">Nama Cabang</label>
      <VTextField
        v-model="modelValue.name"
        variant="outlined"
        :rules="validationRules.name"
        required
        hide-details="auto"
      />
    </VCol>
    
    <VCol cols="12" md="6">
      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">Telepon</label>
      <VTextField
        v-model="modelValue.phone"
        variant="outlined"
        :rules="validationRules.phone"
        required
        hide-details="auto"
      />
    </VCol>
    
    <VCol cols="12" md="6">
      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">Email</label>
      <VTextField
        v-model="modelValue.email"
        type="email"
        variant="outlined"
        :rules="validationRules.email"
        required
        hide-details="auto"
      />
    </VCol>
    
    <VCol cols="12" md="6">
      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">URL Foto</label>
      <VTextField
        v-model="modelValue.photo_url"
        variant="outlined"
        hide-details="auto"
      />
    </VCol>
    
    <VCol cols="12">
      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">Alamat</label>
      <VTextarea
        v-model="modelValue.address"
        variant="outlined"
        :rules="validationRules.address"
        required
        hide-details="auto"
        rows="3"
      />
    </VCol>
    
    <VCol cols="12" md="6">
      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">Kapasitas Maksimal (m³)</label>
      <VTextField
        v-model.number="modelValue.max_stock_capacity_m3"
        type="number"
        variant="outlined"
        :rules="validationRules.max_stock_capacity_m3"
        required
        hide-details="auto"
      />
    </VCol>
    
    <VCol cols="12" md="6">
      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">Status Aktif</label>
      <VSelect
        v-model="modelValue.is_active"
        :items="activeOptions"
        variant="outlined"
        :rules="validationRules.is_active"
        required
        hide-details="auto"
      />
    </VCol>
    
    <VCol cols="12" md="6">
      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">Auto Reorder</label>
      <VSelect
        v-model="modelValue.auto_reorder_enabled"
        :items="autoReorderOptions"
        variant="outlined"
        :rules="validationRules.auto_reorder_enabled"
        required
        hide-details="auto"
      />
    </VCol>
  </VRow>
</template>

<script setup>

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

import { ACTIVE_OPTIONS, AUTO_REORDER_OPTIONS } from '../constants'

// Options
const activeOptions = ACTIVE_OPTIONS
const autoReorderOptions = AUTO_REORDER_OPTIONS
</script> 
