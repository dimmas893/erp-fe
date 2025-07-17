const emailRouteComponent = () => import('@/pages/apps/email/index.vue')

// 👉 Redirects
export const redirects = [
  // ℹ️ We are redirecting to different pages based on role.
  // NOTE: Role is just for UI purposes. ACL is based on abilities.
  {
    path: '/',
    name: 'index',
    redirect: to => {
      // TODO: Get type from backend
      // const userData = useCookie('userData')
      // const userRole = userData.value?.role
      // if (userRole === 'admin')
      return { name: 'dashboards-crm' }

      // if (userRole === 'client')
      // return { name: 'access-control' }
      
      return { name: 'login', query: to.query }
    },
  },
  {
    path: '/pages/user-profile',
    name: 'pages-user-profile',
    redirect: () => ({ name: 'pages-user-profile-tab', params: { tab: 'profile' } }),
  },
  {
    path: '/pages/account-settings',
    name: 'pages-account-settings',
    redirect: () => ({ name: 'pages-account-settings-tab', params: { tab: 'account' } }),
  },
]
export const routes = [
  // Email filter
  {
    path: '/apps/email/filter/:filter',
    name: 'apps-email-filter',
    component: emailRouteComponent,
    meta: {
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
    },
  },

  // Email label
  {
    path: '/apps/email/label/:label',
    name: 'apps-email-label',
    component: emailRouteComponent,
    meta: {
      // contentClass: 'email-application',
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
    },
  },
  {
    path: '/dashboards/logistics',
    name: 'dashboards-logistics',
    component: () => import('@/pages/apps/logistics/dashboard.vue'),
  },
  {
    path: '/dashboards/academy',
    name: 'dashboards-academy',
    component: () => import('@/pages/apps/academy/dashboard.vue'),
  },
  {
    path: '/apps/ecommerce/dashboard',
    name: 'apps-ecommerce-dashboard',
    component: () => import('@/pages/dashboards/ecommerce.vue'),
  },

  // Profile
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/pages/profile.vue'),
  },
  
  // RME Kunjungan Routes
  {
    path: '/rme/kunjungan',
    name: 'rme-kunjungan',
    component: () => import('@/pages/rme/kunjungan/index.vue'),
  },
  {
    path: '/rme/kunjungan/create',
    name: 'rme-kunjungan-create',
    component: () => import('@/pages/rme/kunjungan/create.vue'),
  },
  {
    path: '/rme/kunjungan/:id',
    name: 'rme-kunjungan-id',
    component: () => import('@/pages/rme/kunjungan/[id].vue'),
  },
  {
    path: '/rme/kunjungan/edit/:id',
    name: 'rme-kunjungan-edit-id',
    component: () => import('@/pages/rme/kunjungan/edit/[id].vue'),
  },
  
  // Transaction Billings Routes
  {
    path: '/transaction/billings',
    name: 'transaction-billings',
    component: () => import('@/pages/transaction/billings/index.vue'),
  },
  {
    path: '/transaction/billings/:id',
    name: 'transaction-billings-id',
    component: () => import('@/pages/transaction/billings/[id].vue'),
  },
    {
    path: '/transaction/billings/edit/:id',
    name: 'transaction-billings-edit-id',
    component: () => import('@/pages/transaction/billings/edit/[id].vue'),
  },
  // Removed consultation route from billings as it doesn't exist
  
  // Transaction Consultations Routes
  {
    path: '/transaction/consultations',
    name: 'transaction-consultations',
    component: () => import('@/pages/transaction/consultations/index.vue'),
  },
  {
    path: '/transaction/consultations/:id',
    name: 'transaction-consultations-id',
    component: () => import('@/pages/transaction/consultations/[id].vue'),
  },
  
  // Transaction Treatments Routes
  {
    path: '/transaction/tindakan',
    name: 'transaction-tindakan',
    component: () => import('@/pages/transaction/tindakan/index.vue'),
  },
  {
    path: '/transaction/tindakan/:id',
    name: 'transaction-tindakan-id',
    component: () => import('@/pages/transaction/tindakan/[id].vue'),
  },
  
  // Transaction Products Routes
  {
    path: '/transaction/produk',
    name: 'transaction-produk',
    component: () => import('@/pages/transaction/produk/index.vue'),
  },
  {
    path: '/transaction/produk/:id',
    name: 'transaction-produk-id',
    component: () => import('@/pages/transaction/produk/[id].vue'),
  },

  // WMS Branches Routes
  {
    path: '/wms/branches',
    name: 'wms-branches',
    component: () => import('@/pages/wms/branches/index.vue'),
  },
  {
    path: '/wms/branches/create',
    name: 'wms-branches-create',
    component: () => import('@/pages/wms/branches/create.vue'),
  },

  // WMS Regional Warehouses Routes
  {
    path: '/wms/regional-warehouses',
    name: 'wms-regional-warehouses',
    component: () => import('@/pages/wms/regional-warehouses/index.vue'),
  },
  {
    path: '/wms/regional-warehouses/create',
    name: 'wms-regional-warehouses-create',
    component: () => import('@/pages/wms/regional-warehouses/create.vue'),
  },
  {
    path: '/wms/regional-warehouses/:id',
    name: 'wms-regional-warehouses-id',
    component: () => import('@/pages/wms/regional-warehouses/[id].vue'),
  },

  // WMS Product Categories Routes
  {
    path: '/wms/product-categories',
    name: 'wms-product-categories',
    component: () => import('@/pages/wms/product-categories/index.vue'),
  },
  {
    path: '/wms/product-categories/create',
    name: 'wms-product-categories-create',
    component: () => import('@/pages/wms/product-categories/create.vue'),
  },
  {
    path: '/wms/product-categories/:id',
    name: 'wms-product-categories-id',
    component: () => import('@/pages/wms/product-categories/[id].vue'),
  },

]
