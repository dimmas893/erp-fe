<template>
  <VCardText>
    <VProgressLinear
      indeterminate
      color="primary"
    />
    
    <!-- Loading skeleton -->
    <div class="d-flex align-center gap-4 mb-6">
      <VSkeleton
        type="avatar"
        size="72"
      />
      <div class="flex-grow-1">
        <VSkeleton
          type="heading"
          class="mb-2"
        />
        <VSkeleton
          type="chip"
          width="80"
        />
      </div>
    </div>
    
    <VRow>
      <VCol
        cols="12"
        md="6"
      >
        <VSkeletonLoader type="list-item-two-line@8" />
      </VCol>
      <VCol
        cols="12"
        md="6"
      >
        <VSkeletonLoader type="list-item-two-line@8" />
      </VCol>
    </VRow>
  </VCardText>
</template>

<script setup>
// No props or logic needed for this simple loading component
</script> 
