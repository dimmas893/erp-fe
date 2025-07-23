export default [
  {
    title: 'WMS',
    icon: { icon: 'tabler-package' },
    children: [
      {
        title: 'Cabang',
        to: 'wms-branches',
      },
      {
        title: 'Gudang Regional',
        to: 'wms-regional-warehouses',
      },
      {
        title: 'Kategori Produk',
        to: 'wms-product-categories',
      },
      {
        title: 'Produk',
        to: 'wms-products',
      },
      {
        title: 'Inventori Regional',
        to: 'wms-regional-inventory',
      },
      {
        title: 'Inventori Pusat',
        to: 'wms-central-inventory',
      },
      // You can add more WMS-related menus here
    ],
  },
] 
