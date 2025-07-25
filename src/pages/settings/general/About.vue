<script setup>
const props = defineProps({
  data: {
    type: null,
    required: true,
  },
})
</script>

<template>
  <VCard class="mb-6">
    <VCardText>
      <p class="text-sm text-disabled">
        ABOUT
      </p>

      <VList class="card-list text-medium-emphasis">
        <VListItem>
          <VListItemTitle>
            <span class="d-flex align-center">
              <VIcon icon="tabler-building"
                size="24"
                class="me-2"
              />
              <div class="text-body-1 font-weight-medium me-2">Company Name:</div>
              <br>
            </span><div class="text-wrap" style="margin-left:30px;">PT Azizu Ray Nuna</div>
          </VListItemTitle>
        </VListItem>
         <VListItem>
          <VListItemTitle>
            <span class="d-flex align-center">
              <VIcon icon="tabler-globe"
                size="24"
                class="me-2"
              />
              <div class="text-body-1 font-weight-medium me-2">Website Title:</div>
              <br>
            </span><div class="text-wrap" style="margin-left:30px;">ERP Clinic AIO</div>
          </VListItemTitle>
        </VListItem>
      </VList>

      <p class="text-sm text-disabled mt-6">
        CONTACTS
      </p>

      <VList class="card-list text-medium-emphasis">
        <VListItem>
          <VListItemTitle>
            <span class="d-flex align-center">
              <VIcon icon="tabler-phone"
                size="24"
                class="me-2"
              />
              <div class="text-body-1 font-weight-medium me-2">Contact:</div>
              <div>12-3232</div>
            </span>
          </VListItemTitle>
          </VListItem>
          <VListItem>
          <VListItemTitle>
            <span class="d-flex align-center">
              <VIcon icon="tabler-mail"
                size="24"
                class="me-2"
              />
              <div class="text-body-1 font-weight-medium me-2">Email:</div>
              <div>sds@mail.ff</div>
            </span>
          </VListItemTitle>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>

  <!-- <VCard>
    <VCardText>
      <p class="text-sm text-disabled">
        OVERVIEW
      </p>

      <VList class="card-list text-medium-emphasis">
        <VListItem
          v-for="item in props.data.overview"
          :key="item.property"
        >
          <VListItemTitle>
            <span class="d-flex align-center">
              <VIcon
                :icon="item.icon"
                size="24"
                class="me-2"
              />
              <div class="text-body-1 font-weight-medium me-2">{{ item.property }}:</div>
              <div>{{ item.value }}</div>
            </span>
          </VListItemTitle>
        </VListItem>
      </VList>
    </VCardText>
  </VCard> -->
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 16px;
}
</style>
