<template>
  <div>
    <!-- Header Controls -->
    <VCardText class="d-flex flex-wrap gap-4 align-center justify-space-between">
      <h2 class="text-h4 font-weight-bold mb-0">
        {{ title }}
      </h2>
      <div class="d-flex gap-3 align-center flex-wrap">
        <VBtn 
          v-if="showDocumentationButton"
          color="info" 
          variant="tonal" 
          prepend-icon="tabler-help-circle" 
          size="small"
          @click="showDocumentation = !showDocumentation"
        >
          Panduan Filter
        </VBtn>
        <VBtn 
          color="primary" 
          variant="tonal" 
          prepend-icon="tabler-filter" 
          :class="{ 'v-btn--active': showFilters }"
          @click="showFilters = !showFilters"
        >
          Filter
          <VChip
            v-if="activeFiltersCount > 0"
            size="small"
            color="error"
            class="ms-2"
          >
            {{ activeFiltersCount }}
          </VChip>
        </VBtn>
        
        <!-- Custom action buttons slot - moved to the right -->
        <slot name="actions" />
      </div>
    </VCardText>
    
    <!-- Documentation Panel -->
    <VExpandTransition>
      <div v-show="showDocumentation">
        <VDivider />
        <FilterDocumentation />
      </div>
    </VExpandTransition>
    
    <!-- Filter Panel -->
    <VExpandTransition>
      <div v-show="showFilters">
        <VDivider />
        <VCard
          flat
          class="ma-4"
          border
        >
          <VCardText class="pa-6">
            <div class="d-flex align-center mb-4">
              <VIcon
                color="primary"
                class="me-2"
              >
                tabler-adjustments-horizontal
              </VIcon>
              <h3 class="text-h6 mb-0">
                Filter {{ title }}
              </h3>
            </div>
            
            <!-- Filter Items -->
            <div
              v-if="localFilters.length > 0"
              class="mb-6"
            >
              <VRow>
                <VCol 
                  v-for="(filter, index) in localFilters" 
                  :key="index" 
                  cols="12"
                  class="mb-2"
                >
                  <VCard
                    variant="outlined"
                    class="pa-4"
                  >
                    <VRow
                      align="center"
                      no-gutters
                    >
                      <VCol
                        cols="12"
                        sm="3"
                        class="pe-sm-2 mb-3 mb-sm-0"
                      >
                        <VSelect
                          :model-value="filter.search_by"
                          :items="filterFields"
                          item-title="title"
                          item-value="value"
                          label="Field"
                          density="comfortable"
                          variant="outlined"
                          hide-details
                          @update:model-value="updateFilterField(index, 'search_by', $event)"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        sm="3"
                        class="px-sm-2 mb-3 mb-sm-0"
                      >
                        <VSelect
                          :model-value="filter.filter_type"
                          :items="getOperatorsForField(filter.search_by)"
                          item-title="title"
                          item-value="value"
                          label="Operator"
                          density="comfortable"
                          variant="outlined"
                          hide-details
                          @update:model-value="updateFilterField(index, 'filter_type', $event)"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        sm="5"
                        class="px-sm-2 mb-3 mb-sm-0"
                      >
                        <FilterInput 
                          :model-value="filter"
                          :field-config="getFieldConfigForInput(filter.search_by)"
                          @update:model-value="updateFilter(index, $event)"
                          @apply="applyFilters"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        sm="1"
                        class="ps-sm-2 d-flex justify-center justify-sm-end"
                      >
                        <VBtn
                          color="error"
                          variant="text"
                          icon="tabler-trash"
                          size="small"
                          @click="removeFilter(index)"
                        />
                      </VCol>
                    </VRow>
                  </VCard>
                </VCol>
              </VRow>
            </div>
            
            <!-- Empty State -->
            <div
              v-else
              class="text-center py-8 mb-6"
            >
              <VIcon
                size="48"
                color="primary"
                class="mb-3"
              >
                tabler-filter-off
              </VIcon>
              <p class="text-body-1 text-medium-emphasis mb-0">
                Belum ada filter ditambahkan
              </p>
            </div>
            
            <!-- Filter Actions -->
            <div class="d-flex gap-3 flex-wrap mb-6">
              <VBtn 
                color="primary" 
                variant="tonal" 
                prepend-icon="tabler-plus" 
                @click="addFilter"
              >
                Tambah Filter
              </VBtn>
              <VBtn 
                v-if="localFilters.length > 0"
                color="success" 
                prepend-icon="tabler-check" 
                @click="applyFilters"
              >
                Terapkan Filter
              </VBtn>
              <VBtn 
                v-if="localFilters.length > 0 || quickSearch"
                color="warning" 
                variant="outlined" 
                prepend-icon="tabler-refresh" 
                @click="clearFilters"
              >
                Reset Semua
              </VBtn>
            </div>
            
            <!-- Quick Search -->
            <VDivider class="mb-4" />
            <div class="d-flex align-center mb-3">
              <VIcon
                color="primary"
                class="me-2"
              >
                tabler-search
              </VIcon>
              <h4 class="text-h6 mb-0">
                Pencarian Cepat
              </h4>
            </div>
            <VRow align="center">
              <VCol
                cols="12"
                md="8"
              >
                <VTextField
                  v-model="quickSearch"
                  density="comfortable"
                  :placeholder="quickSearchPlaceholder"
                  prepend-inner-icon="tabler-search"
                  variant="outlined"
                  hide-details
                  clearable
                  @keyup.enter="applyQuickSearch"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <VBtn 
                  color="primary" 
                  prepend-icon="tabler-search" 
                  block
                  @click="applyQuickSearch"
                >
                  Cari
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </div>
    </VExpandTransition>
  </div>
</template>

<script setup>
import { getDefaultFilterOperators, getFieldConfig, getOperatorsByFieldType } from '@/utils/filterUtils'
import { computed, ref, watch } from 'vue'
import FilterDocumentation from './FilterDocumentation.vue'
import FilterInput from './FilterInput.vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Data',
  },

  // Fields configuration - can be array of objects or sample data to auto-generate
  fields: {
    type: [Array, Object],
    required: true,
  },

  // Additional field configurations
  fieldConfigs: {
    type: Object,
    default: () => ({}),
  },

  // Custom filter operators (optional)
  customOperators: {
    type: Array,
    default: () => [],
  },

  // Quick search configuration
  quickSearchFields: {
    type: Array,
    default: () => ['name'],
  },
  quickSearchPlaceholder: {
    type: String,
    default: 'Cari data...',
  },

  // Show documentation button
  showDocumentationButton: {
    type: Boolean,
    default: true,
  },

  // Initial filters
  initialFilters: {
    type: Array,
    default: () => [],
  },

  // Initial quick search
  initialQuickSearch: {
    type: String,
    default: '',
  },
})

// Emits
const emit = defineEmits(['apply-filters', 'clear-filters', 'apply-quick-search'])

// State
const quickSearch = ref(props.initialQuickSearch)
const showFilters = ref(false)
const showDocumentation = ref(false)
const localFilters = ref([...props.initialFilters])

// Use computed instead of ref + watcher to prevent circular updates
const filterFields = computed(() => {
  if (Array.isArray(props.fields)) {
    return props.fields
  }
  
  return []
})

const localFieldConfigs = computed(() => {
  return props.fieldConfigs || {}
})

const filterOperators = computed(() => {
  // This is kept for backward compatibility but individual filters use getOperatorsForField
  if (props.customOperators.length > 0) {
    return props.customOperators
  }
  
  return getDefaultFilterOperators()
})

const activeFiltersCount = computed(() => {
  return localFilters.value.filter(f => {
    // For null checks, no value needed - always count as active if selected
    if (['is_null', 'is_not_null'].includes(f.filter_type)) {
      return true
    }

    // For range operators, check if both values are provided
    if (['between', 'not_between'].includes(f.filter_type)) {
      return f.start_value && f.end_value
    }

    // For date range, check if both dates are provided
    if (f.filter_type === 'date_range' || isDateField(f.search_by)) {
      return f.date_from && f.date_to
    }

    // For list operators, check if values_list exists
    if (['in', 'not_in', 'array_overlap'].includes(f.filter_type)) {
      return f.values_list && f.values_list.trim()
    }

    // For other filters, check if search_query exists
    return f.search_query && f.search_query.trim()
  }).length
})

// Functions
function addFilter() {
  const defaultField = filterFields.value[0]?.value || 'name'

  localFilters.value.push({
    search_by: defaultField,
    filter_type: 'like',
    search_query: '',
    date_from: '',
    date_to: '',
    start_value: '',
    end_value: '',
    values_list: '',
  })
}

function removeFilter(index) {
  localFilters.value.splice(index, 1)
  if (localFilters.value.length === 0) {
    applyFilters()
  }
}

function updateFilter(index, updatedFilter) {
  localFilters.value[index] = { ...updatedFilter }
}

function updateFilterField(index, field, value) {
  const oldFilter = { ...localFilters.value[index] }
  
  // If changing the search_by field, reset operator and values
  if (field === 'search_by' && oldFilter.search_by !== value) {
    // Get default operator for the new field
    const fieldConfig = getFieldConfig(value, localFieldConfigs.value)
    const fieldType = fieldConfig?.type || 'text'
    const availableOperators = getOperatorsByFieldType(fieldType)
    const defaultOperator = availableOperators[0]?.value || 'like'
    
    localFilters.value[index] = {
      search_by: value,
      filter_type: defaultOperator,
      search_query: '',
      date_from: '',
      date_to: '',
      start_value: '',
      end_value: '',
      values_list: '',
    }
  } else {
    localFilters.value[index] = {
      ...oldFilter,
      [field]: value,
    }
  }
}

function getOperatorsForField(fieldName) {
  if (props.customOperators.length > 0) {
    return props.customOperators
  }
  
  const fieldConfig = getFieldConfig(fieldName, localFieldConfigs.value)
  const fieldType = fieldConfig?.type || 'text'
  
  return getOperatorsByFieldType(fieldType)
}

function getFieldConfigForInput(fieldName) {
  // Custom function to ensure field config is properly returned
  return getFieldConfig(fieldName, localFieldConfigs.value)
}

function applyFilters() {
  const processedFilters = processFilters(localFilters.value)

  emit('apply-filters', {
    filters: processedFilters,
    quickSearch: quickSearch.value?.trim() || '',
  })
}

function clearFilters() {
  localFilters.value = []
  quickSearch.value = ''
  emit('clear-filters')
}

function applyQuickSearch() {
  emit('apply-quick-search', quickSearch.value?.trim() || '')
}

function processFilters(filters) {
  return filters.filter(f => {
    // For null checks, no value needed
    if (['is_null', 'is_not_null'].includes(f.filter_type)) {
      return true
    }

    // For range operators, check if both values are provided
    if (['between', 'not_between'].includes(f.filter_type)) {
      return f.start_value && f.end_value
    }

    // For date range, check if both dates are provided
    if (f.filter_type === 'date_range' || isDateField(f.search_by)) {
      return f.date_from && f.date_to
    }

    // For list operators, check if values_list exists
    if (['in', 'not_in', 'array_overlap'].includes(f.filter_type)) {
      return f.values_list && f.values_list.trim()
    }

    // For other filters, check if search_query exists
    return f.search_query && f.search_query.trim()
  }).map(f => {
    const filter = {
      search_by: f.search_by,
      filter_type: f.filter_type,
    }
    
    // Handle different input types based on operator
    if (['between', 'not_between'].includes(f.filter_type)) {
      filter.start_value = f.start_value
      filter.end_value = f.end_value
    } else if (f.filter_type === 'date_range' || isDateField(f.search_by)) {
      filter.search_query = `${f.date_from},${f.date_to}`
    } else if (['in', 'not_in', 'array_overlap'].includes(f.filter_type)) {
      filter.values_list = f.values_list.trim()
    } else if (!['is_null', 'is_not_null'].includes(f.filter_type)) {
      filter.search_query = f.search_query.trim()
    }
    
    return filter
  })
}

function isDateField(field) {
  const fieldConfig = getFieldConfig(field, localFieldConfigs.value)
  
  return fieldConfig?.type === 'date' || ['birth_date', 'createdAt', 'updatedAt', 'created_at', 'updated_at'].includes(field)
}

// Watch for external changes
watch(() => props.initialFilters, newFilters => {
  localFilters.value = [...newFilters]
}, { deep: true })

watch(() => props.initialQuickSearch, newValue => {
  quickSearch.value = newValue
})
</script>

<style scoped>
.v-btn--active {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
}
</style> 
