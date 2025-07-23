export default [
  {
    title: 'HRIS',
    icon: { icon: 'tabler-users-group' },
    children: [
      {
        title: 'Departemen',
        to: 'hris-departments',
      },
      {
        title: 'Karyawan',
        to: 'hris-employees',
      },
      {
        title: 'Jenis Cuti',
        to: 'hris-leave-types',
      },
      {
        title: 'Dokter',
        to: 'hris-doctors',
      },
      {
        title: 'Terapis',
        to: 'hris-therapists',
      },
      // You can add more HRIS-related menus here
    ],
  },
] 
