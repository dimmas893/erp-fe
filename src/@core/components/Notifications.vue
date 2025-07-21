<script setup>
import { $api } from '@/utils/api'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

const props = defineProps({
  notifications: {
    type: Array,
    required: false,
    default: () => [],
  },
  badgeProps: {
    type: Object,
    required: false,
    default: undefined,
  },
  location: {
    type: null,
    required: false,
    default: 'bottom end',
  },
})

const emit = defineEmits([
  'read',
  'unread',
  'remove',
  'click:notification',
])

// Reactive data for billing notifications
const billingNotifications = ref([])
const loading = ref(false)
const error = ref(null)

// Fetch billing data and transform to notifications
const fetchBillingNotifications = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await $api('/transaction/billings/paginated', {
      method: 'POST',
      body: {
        page: 1,
        per_page: 10,
        sort_by: 'created_at',
        filters: [
          {
            search_by: 'status',
            filter_type: 'in',
            values_list: 'complete_consultation,complete_treatment,open_treatment,open_consultation'
          }
        ],
        sort_order: 'desc'
      }
    })

    if (response.data) {
      billingNotifications.value = response.data.map(billing => ({
        id: billing.id,
        title: `Billing ${billing.billing_number}`,
        subtitle: `Status: ${billing.status} | Total: Rp ${formatCurrency(billing.grand_total)}`,
        time: formatDate(billing.created_at),
        isSeen: false,
        color: getStatusColor(billing.status),
        icon: 'tabler-receipt',
        billing: billing // Keep original billing data for reference
      }))
    }
  } catch (err) {
    console.error('Error fetching billing notifications:', err)
    error.value = 'Failed to load notifications'
  } finally {
    loading.value = false
  }
}

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID').format(parseFloat(amount))
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = (now - date) / (1000 * 60 * 60)
  
  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`
  } else {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }
}

const getStatusColor = (status) => {
  const statusColors = {
    'confirmed': 'success',
    'pending': 'warning',
    'forwarded_to_doctor': 'info',
    'paid': 'primary',
    'cancelled': 'error'
  }
  return statusColors[status] || 'primary'
}

const avatarText = (text) => {
  if (!text) return ''
  return text.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)
}

// Use only billing notifications
const allNotifications = computed(() => {
  return billingNotifications.value
})

const isAllMarkRead = computed(() => {
  return allNotifications.value.some(item => item.isSeen === false)
})

const markAllReadOrUnread = () => {
  const allNotificationsIds = allNotifications.value.map(item => item.id)
  if (!isAllMarkRead.value)
    emit('unread', allNotificationsIds)
  else
    emit('read', allNotificationsIds)
}

const totalUnseenNotifications = computed(() => {
  return allNotifications.value.filter(item => item.isSeen === false).length
})

const toggleReadUnread = (isSeen, Id) => {
  if (isSeen)
    emit('unread', [Id])
  else
    emit('read', [Id])
}

// Fetch notifications on component mount
onMounted(() => {
  fetchBillingNotifications()
})
</script>

<template>
  <IconBtn id="notification-btn">
    <VBadge
      v-bind="props.badgeProps"
      :model-value="allNotifications.some(n => !n.isSeen)"
      color="error"
      dot
      offset-x="2"
      offset-y="3"
    >
      <VIcon icon="tabler-bell" />
    </VBadge>

    <VMenu
      activator="parent"
      width="380px"
      :location="props.location"
      offset="12px"
      :close-on-content-click="false"
    >
      <VCard class="d-flex flex-column">
        <!-- 👉 Header -->
        <VCardItem class="notification-section">
          <VCardTitle class="text-h6">
            Notifications
          </VCardTitle>

          <template #append>
            <VChip
              v-show="allNotifications.some(n => !n.isSeen)"
              size="small"
              color="primary"
              class="me-2"
            >
              {{ totalUnseenNotifications }} New
            </VChip>
            <IconBtn
              v-show="allNotifications.length"
              size="34"
              @click="markAllReadOrUnread"
            >
              <VIcon
                size="20"
                color="high-emphasis"
                :icon="!isAllMarkRead ? 'tabler-mail' : 'tabler-mail-opened' "
              />

              <VTooltip
                activator="parent"
                location="start"
              >
                {{ !isAllMarkRead ? 'Mark all as unread' : 'Mark all as read' }}
              </VTooltip>
            </IconBtn>
          </template>
        </VCardItem>

        <VDivider />

        <!-- 👉 Loading state -->
        <div v-if="loading" class="pa-4 text-center">
          <VProgressCircular indeterminate color="primary" />
          <p class="text-sm text-medium-emphasis mt-2">Loading notifications...</p>
        </div>

        <!-- 👉 Error state -->
        <div v-else-if="error" class="pa-4 text-center">
          <VIcon icon="tabler-alert-circle" color="error" size="24" />
          <p class="text-sm text-error mt-2">{{ error }}</p>
          <VBtn size="small" color="primary" @click="fetchBillingNotifications" class="mt-2">
            Retry
          </VBtn>
        </div>

        <!-- 👉 Notifications list -->
        <PerfectScrollbar
          v-else
          :options="{ wheelPropagation: false }"
          style="max-block-size: 23.75rem;"
        >
          <VList class="notification-list rounded-0 py-0">
            <template
              v-for="(notification, index) in allNotifications"
              :key="notification.id"
            >
              <VDivider v-if="index > 0" />
              <VListItem
                link
                lines="one"
                min-height="66px"
                class="list-item-hover-class"
                @click="$emit('click:notification', notification)"
              >
                <!-- Slot: Prepend -->
                <!-- Handles Avatar: Image, Icon, Text -->
                <div class="d-flex align-start gap-3">
                  <VAvatar
                    :color="notification.color && !notification.img ? notification.color : undefined"
                    :variant="notification.img ? undefined : 'tonal' "
                  >
                    <span v-if="notification.text">{{ avatarText(notification.text) }}</span>
                    <VImg
                      v-if="notification.img"
                      :src="notification.img"
                    />
                    <VIcon
                      v-if="notification.icon"
                      :icon="notification.icon"
                    />
                  </VAvatar>

                  <div>
                    <p class="text-sm font-weight-medium mb-1">
                      {{ notification.title }}
                    </p>
                    <p
                      class="text-body-2 mb-2"
                      style=" letter-spacing: 0.4px !important; line-height: 18px;"
                    >
                      {{ notification.subtitle }}
                    </p>
                    <p
                      class="text-sm text-disabled mb-0"
                      style=" letter-spacing: 0.4px !important; line-height: 18px;"
                    >
                      {{ notification.time }}
                    </p>
                  </div>
                  <VSpacer />

                  <div class="d-flex flex-column align-end">
                    <VIcon
                      size="10"
                      icon="tabler-circle-filled"
                      :color="!notification.isSeen ? 'primary' : '#a8aaae'"
                      :class="`${notification.isSeen ? 'visible-in-hover' : ''}`"
                      class="mb-2"
                      @click.stop="toggleReadUnread(notification.isSeen, notification.id)"
                    />

                    <VIcon
                      size="20"
                      icon="tabler-x"
                      class="visible-in-hover"
                      @click="$emit('remove', notification.id)"
                    />
                  </div>
                </div>
              </VListItem>
            </template>

            <VListItem
              v-show="!allNotifications.length"
              class="text-center text-medium-emphasis"
              style="block-size: 56px;"
            >
              <VListItemTitle>No Notification Found!</VListItemTitle>
            </VListItem>
          </VList>
        </PerfectScrollbar>

        <VDivider />

        <!-- 👉 Footer -->
        <VCardText
          v-show="allNotifications.length"
          class="pa-4"
        >
          <VBtn
            block
            size="small"
          >
            View All Notifications
          </VBtn>
        </VCardText>
      </VCard>
    </VMenu>
  </IconBtn>
</template>

<style lang="scss">
.notification-section {
  padding-block: 0.75rem;
  padding-inline: 1rem;
}

.list-item-hover-class {
  .visible-in-hover {
    display: none;
  }

  &:hover {
    .visible-in-hover {
      display: block;
    }
  }
}

.notification-list.v-list {
  .v-list-item {
    border-radius: 0 !important;
    margin: 0 !important;
    padding-block: 0.75rem !important;
  }
}

// Badge Style Override for Notification Badge
.notification-badge {
  .v-badge__badge {
    /* stylelint-disable-next-line liberty/use-logical-spec */
    min-width: 18px;
    padding: 0;
    block-size: 18px;
  }
}
</style>
