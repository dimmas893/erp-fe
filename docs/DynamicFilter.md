# Dynamic Filter Component

Komponen filter dinamis yang dapat secara otomatis menggenerate field yang dapat difilter dari response API, dengan operator yang disesuaikan berdasarkan tipe field.

## Fitur Utama

- ✅ **Dynamic Field Generation**: Otomatis extract field dari response API
- ✅ **Dynamic Operators**: Operator yang tersedia disesuaikan dengan tipe field
- ✅ **Custom Field Configuration**: Konfigurasi manual field dan tipe
- ✅ **Quick Search**: Pencarian cepat multi-field
- ✅ **Documentation Panel**: Panel bantuan operator
- ✅ **Responsive Design**: Tampilan responsive untuk mobile dan desktop
- ✅ **Comprehensive Operators**: Mendukung semua jenis operator filter

## Operator per Tipe Field

### Text Fields (`type: 'text'`)
- Sama dengan (=)
- Tidak sama dengan (≠)
- Mengandung (~)
- Mengandung (case insensitive)
- Tidak mengandung (!~)
- Tidak mengandung (case insensitive)
- Dimulai dengan (^)
- Diakhiri dengan ($)
- Kosong (∅)
- Tidak kosong (∃)
- Dalam daftar (∈)
- Tidak dalam daftar (∉)

### Number Fields (`type: 'number'`)
- Sama dengan (=)
- Tidak sama dengan (≠)
- Lebih besar dari (>)
- Lebih besar atau sama dengan (≥)
- Lebih kecil dari (<)
- Lebih kecil atau sama dengan (≤)
- Dalam rentang ([ ])
- Tidak dalam rentang (![ ])
- Kosong (∅)
- Tidak kosong (∃)
- Dalam daftar (∈)
- Tidak dalam daftar (∉)

### Date Fields (`type: 'date'`)
- Sama dengan (=)
- Tidak sama dengan (≠)
- Setelah tanggal (>)
- Setelah atau sama dengan (≥)
- Sebelum tanggal (<)
- Sebelum atau sama dengan (≤)
- Dalam rentang tanggal ([ ])
- Kosong (∅)
- Tidak kosong (∃)

### Select Fields (`type: 'select'`)
- Sama dengan (=)
- Tidak sama dengan (≠)
- Dalam daftar (∈)
- Tidak dalam daftar (∉)
- Kosong (∅)
- Tidak kosong (∃)

### Email Fields (`type: 'email'`)
- Sama dengan (=)
- Tidak sama dengan (≠)
- Mengandung (~)
- Mengandung (case insensitive)
- Tidak mengandung (!~)
- Diakhiri dengan domain ($)
- Kosong (∅)
- Tidak kosong (∃)
- Dalam daftar (∈)
- Tidak dalam daftar (∉)

### Phone Fields (`type: 'tel'`)
- Sama dengan (=)
- Tidak sama dengan (≠)
- Mengandung (~)
- Dimulai dengan (^)
- Diakhiri dengan ($)
- Kosong (∅)
- Tidak kosong (∃)
- Dalam daftar (∈)
- Tidak dalam daftar (∉)

## Field Configuration

```javascript
const fieldConfigs = {
  'patient_number': {
    title: 'No. Pasien',
    type: 'text'
  },
  'nik': {
    title: 'NIK', 
    type: 'text'
  },
  'name': {
    title: 'Nama',
    type: 'text'
  },
  'gender': {
    title: 'Jenis Kelamin',
    type: 'select',
    options: [
      { title: 'Laki-laki', value: 'MALE' },
      { title: 'Perempuan', value: 'FEMALE' }
    ]
  },
  'phone': {
    title: 'Telepon',
    type: 'tel'  // Menggunakan operator khusus telepon
  },
  'email': {
    title: 'Email',
    type: 'email'  // Menggunakan operator khusus email
  },
  'branch_id': {
    title: 'Cabang',
    type: 'select',
    options: [] // Diisi dari API /wms/branches
  },
  'created_at': {
    title: 'Tanggal Dibuat',
    type: 'date'  // Menggunakan operator khusus tanggal
  }
}
```

## Branch Integration

Component sudah terintegrasi dengan API cabang:

```javascript
// Fetching branches
async function fetchBranches() {
  const res = await $api('/wms/branches')
  branchOptions.value = (res.data || []).map(branch => ({
    title: `${branch.name} (${branch.code})`,  // Menampilkan nama + kode
    value: branch.id,
  }))
}

// Configuration
'branch_id': {
  title: 'Cabang',
  type: 'select',
  options: branchOptions.value
}
```

## Dynamic Operator Selection

Ketika user mengubah field, operator akan otomatis disesuaikan:

1. **Field Text/NIK/Nama**: Operator text lengkap (equals, like, starts_with, dll)
2. **Field Email**: Operator khusus email (ends_with untuk domain)
3. **Field Telepon**: Operator khusus telepon (starts_with untuk kode area)
4. **Field Gender/Cabang**: Operator select terbatas (equals, in, null checks)
5. **Field Tanggal**: Operator tanggal (range, before, after)

## Keunggulan Sistem Baru

✅ **Smart Operators**: Operator disesuaikan dengan tipe data
✅ **Better UX**: User tidak bingung dengan operator yang tidak relevan  
✅ **Type Safety**: Input sesuai dengan tipe field (email, tel, date)
✅ **Extensible**: Mudah menambah tipe field dan operator baru
✅ **Validation**: Otomatis validasi input sesuai tipe field

## Operator Reset Logic

Ketika user mengubah field:
1. Field baru dipilih
2. Operator direset ke default untuk tipe field tersebut
3. Semua nilai input dikosongkan
4. User mulai mengisi dengan operator yang relevan

Ini mencegah error dan konfusi dari kombinasi field-operator yang tidak valid. 
