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
      return { name: 'dashboards-analytics' }

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
    path: '/transaction/billings/flow',
    name: 'transaction-billings-flow',
    component: () => import('@/pages/transaction/billings/flow.vue'),
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
  
  // Transaction Billing Creation Routes
  {
    path: '/transaction/billings/consultation/create',
    name: 'transaction-billings-consultation-create',
    component: () => import('@/pages/transaction/billings_consultation/create.vue'),
  },
  {
    path: '/transaction/billings/treatment/create',
    name: 'transaction-billings-treatment-create',
    component: () => import('@/pages/transaction/billings_treatment/create.vue'),
  },
  {
    path: '/transaction/billings/product/create',
    name: 'transaction-billings-product-create',
    component: () => import('@/pages/transaction/billings_product/create.vue'),
  },
  
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

  // WMS Products Routes
  {
    path: '/wms/products',
    name: 'wms-products',
    component: () => import('@/pages/wms/products/index.vue'),
  },
  {
    path: '/wms/products/create',
    name: 'wms-products-create',
    component: () => import('@/pages/wms/products/create.vue'),
  },
  {
    path: '/wms/products/:id',
    name: 'wms-products-id',
    component: () => import('@/pages/wms/products/[id].vue'),
  },

  // WMS Regional Inventory Routes
  {
    path: '/wms/regional-inventory',
    name: 'wms-regional-inventory',
    component: () => import('@/pages/wms/regional-inventory/index.vue'),
  },
  {
    path: '/wms/regional-inventory/create',
    name: 'wms-regional-inventory-create',
    component: () => import('@/pages/wms/regional-inventory/create.vue'),
  },
  {
    path: '/wms/regional-inventory/:id',
    name: 'wms-regional-inventory-id',
    component: () => import('@/pages/wms/regional-inventory/[id].vue'),
  },

  // WMS Central Inventory Routes
  {
    path: '/wms/central-inventory',
    name: 'wms-central-inventory',
    component: () => import('@/pages/wms/central-inventory/index.vue'),
  },
  {
    path: '/wms/central-inventory/create',
    name: 'wms-central-inventory-create',
    component: () => import('@/pages/wms/central-inventory/create.vue'),
  },
  {
    path: '/wms/central-inventory/:id',
    name: 'wms-central-inventory-id',
    component: () => import('@/pages/wms/central-inventory/[id].vue'),
  },

  // WMS Branch Inventory Routes
  {
    path: '/wms/branch-inventory',
    name: 'wms-branch-inventory',
    component: () => import('@/pages/wms/branch-inventory/index.vue'),
  },
  {
    path: '/wms/branch-inventory/create',
    name: 'wms-branch-inventory-create',
    component: () => import('@/pages/wms/branch-inventory/create.vue'),
  },
  {
    path: '/wms/branch-inventory/:id',
    name: 'wms-branch-inventory-id',
    component: () => import('@/pages/wms/branch-inventory/[id].vue'),
  },

  // HRIS Departments Routes
  {
    path: '/hris/departments',
    name: 'hris-departments',
    component: () => import('@/pages/hris/departments/index.vue'),
  },
  {
    path: '/hris/departments/create',
    name: 'hris-departments-create',
    component: () => import('@/pages/hris/departments/create.vue'),
  },
  {
    path: '/hris/departments/:id',
    name: 'hris-departments-id',
    component: () => import('@/pages/hris/departments/[id].vue'),
  },

  // HRIS Employees Routes
  {
    path: '/hris/employees',
    name: 'hris-employees',
    component: () => import('@/pages/hris/employees/index.vue'),
  },
  {
    path: '/hris/employees/create',
    name: 'hris-employees-create',
    component: () => import('@/pages/hris/employees/create.vue'),
  },
  {
    path: '/hris/employees/:id',
    name: 'hris-employees-id',
    component: () => import('@/pages/hris/employees/[id].vue'),
  },

  // HRIS Leave Types Routes
  {
    path: '/hris/leave-types',
    name: 'hris-leave-types',
    component: () => import('@/pages/hris/leave-types/index.vue'),
  },
  {
    path: '/hris/leave-types/create',
    name: 'hris-leave-types-create',
    component: () => import('@/pages/hris/leave-types/create.vue'),
  },
  {
    path: '/hris/leave-types/:id',
    name: 'hris-leave-types-id',
    component: () => import('@/pages/hris/leave-types/[id].vue'),
  },

  // HRIS Doctors Routes
  {
    path: '/hris/doctors',
    name: 'hris-doctors',
    component: () => import('@/pages/hris/doctors/index.vue'),
  },
  {
    path: '/hris/doctors/create',
    name: 'hris-doctors-create',
    component: () => import('@/pages/hris/doctors/create.vue'),
  },
  {
    path: '/hris/doctors/:id',
    name: 'hris-doctors-id',
    component: () => import('@/pages/hris/doctors/[id].vue'),
  },

  // HRIS Therapists Routes
  {
    path: '/hris/therapists',
    name: 'hris-therapists',
    component: () => import('@/pages/hris/therapists/index.vue'),
  },
  {
    path: '/hris/therapists/create',
    name: 'hris-therapists-create',
    component: () => import('@/pages/hris/therapists/create.vue'),
  },
  {
    path: '/hris/therapists/:id',
    name: 'hris-therapists-id',
    component: () => import('@/pages/hris/therapists/[id].vue'),
  },

  // CRM Promos Routes
  {
    path: '/crm/promos',
    name: 'crm-promos',
    component: () => import('@/pages/crm/promos/index.vue'),
  },
  {
    path: '/crm/promos/create',
    name: 'crm-promos-create',
    component: () => import('@/pages/crm/promos/create.vue'),
  },
  {
    path: '/crm/promos/:id',
    name: 'crm-promos-id',
    component: () => import('@/pages/crm/promos/[id].vue'),
  },

  // CRM Services Routes
  {
    path: '/crm/services',
    name: 'crm-services',
    component: () => import('@/pages/crm/services/index.vue'),
  },
  {
    path: '/crm/services/create',
    name: 'crm-services-create',
    component: () => import('@/pages/crm/services/create.vue'),
  },
  {
    path: '/crm/services/:id',
    name: 'crm-services-id',
    component: () => import('@/pages/crm/services/[id].vue'),
  },

  // Finance Tax Types Routes
  {
    path: '/finance/tax-types',
    name: 'finance-tax-types',
    component: () => import('@/pages/finance/tax-types/index.vue'),
  },
  {
    path: '/finance/tax-types/create',
    name: 'finance-tax-types-create',
    component: () => import('@/pages/finance/tax-types/create.vue'),
  },
  {
    path: '/finance/tax-types/:id',
    name: 'finance-tax-types-id',
    component: () => import('@/pages/finance/tax-types/[id].vue'),
  },
  {
    path: '/finance/tax-types/edit/:id',
    name: 'finance-tax-types-edit-id',
    component: () => import('@/pages/finance/tax-types/edit/[id].vue'),
  },

]
