<script setup>
import imagoDark from '@images/pages/auth-v2-login-illustration-dark.png';
import imago from '@images/pages/auth-v2-login-illustration-light.png';
</script>

<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon
          icon="tabler-chart-bar"
          size="24"
          class="me-2"
        />
      </template>

      <VCardTitle>Front Page Image/Info</VCardTitle>
    </VCardItem>

    <VCardText>
      Light<VImg :src="imago" width="100%" height="200px"/>
    </VCardText>
     <VCardText>
      Dark<VImg :src="imagoDark" width="100%" height="200px"/>
    </VCardText>
  </VCard>
</template>
