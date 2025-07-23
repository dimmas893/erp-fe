<script setup>
defineOptions({
  name: 'AppCombobox',
  inheritAttrs: false,
})

const elementId = computed(() => {
  const attrs = useAttrs()
  const _elementIdToken = attrs.id || attrs.label
  
  return _elementIdToken ? `app-combobox-${ _elementIdToken }-${ Math.random().toString(36).slice(2, 7) }` : undefined
})

const label = computed(() => useAttrs().label)
</script>

<template>
  <div
    class="app-combobox flex-grow-1"
    :class="$attrs.class"
  >
    <VLabel
      v-if="label"
      :for="elementId"
      class="mb-1 text-body-2"
      :text="label"
    />
    <VCombobox
      v-bind="{
        ...Object.fromEntries(Object.entries($attrs).filter(([k]) => k !== 'label')),
        class: null,
        variant: 'outlined',
        id: elementId,
        menuProps: {
          contentClass: [
            'app-inner-list',
            'app-combobox__content',
            'v-combobox__content',
            $attrs.multiple !== undefined ? 'v-list-select-multiple' : '',
          ],
        },
      }"
      :placeholder="$attrs.placeholder"
      :clearable="$attrs.multiple ? Array.isArray($attrs.modelValue) && $attrs.modelValue.length > 0 : !!$attrs.modelValue"
    >
      <template
        v-for="(_, name) in $slots"
        #[name]="slotProps"
      >
        <slot
          :name="name"
          v-bind="slotProps || {}"
        />
      </template>
    </VCombobox>
  </div>
</template>
