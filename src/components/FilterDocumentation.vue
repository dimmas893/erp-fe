<template>
  <VCard flat class="ma-4" border>
    <VCardText class="pa-6">
      <div class="d-flex align-center mb-4">
        <VIcon color="info" class="me-2">tabler-book</VIcon>
        <h3 class="text-h6 mb-0">Panduan Penggunaan Filter</h3>
      </div>
      
      <VRow>
        <!-- Equality Operators -->
        <VCol cols="12" md="6" class="mb-4">
          <VCard variant="outlined" class="pa-4">
            <h4 class="text-subtitle-1 mb-3 d-flex align-center">
              <VIcon color="primary" class="me-2">tabler-equal</VIcon>
              Pencarian Tepat
            </h4>
            <VList density="compact">
              <VListItem>
                <VListItemTitle><strong>Sama persis dengan (=)</strong></VListItemTitle>
                <VListItemSubtitle>Cari data yang sama persis dengan yang Anda ketik</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: "Jakarta" akan mencari yang benar-benar "Jakarta"</em></VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle><strong>Tidak sama dengan (≠)</strong></VListItemTitle>
                <VListItemSubtitle>Cari data yang berbeda dari yang Anda ketik</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: "Jakarta" akan mencari selain Jakarta</em></VListItemSubtitle>
              </VListItem>
            </VList>
          </VCard>
        </VCol>
        
        <!-- Text Search -->
        <VCol cols="12" md="6" class="mb-4">
          <VCard variant="outlined" class="pa-4">
            <h4 class="text-subtitle-1 mb-3 d-flex align-center">
              <VIcon color="success" class="me-2">tabler-search</VIcon>
              Pencarian Teks
            </h4>
            <VList density="compact">
              <VListItem>
                <VListItemTitle><strong>Mengandung kata (~)</strong></VListItemTitle>
                <VListItemSubtitle>Cari data yang di dalamnya ada kata yang Anda ketik</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: "Ahmad" akan menemukan "Ahmad Santoso"</em></VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle><strong>Mengandung kata (huruf besar/kecil bebas)</strong></VListItemTitle>
                <VListItemSubtitle>Sama seperti di atas, tapi tidak peduli huruf besar atau kecil</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: "ahmad" juga akan menemukan "AHMAD Santoso"</em></VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle><strong>Tidak mengandung kata (!~)</strong></VListItemTitle>
                <VListItemSubtitle>Cari data yang tidak mengandung kata yang Anda ketik</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: "Ahmad" akan mencari semua kecuali yang ada kata "Ahmad"</em></VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle><strong>Dimulai dengan (^)</strong></VListItemTitle>
                <VListItemSubtitle>Cari data yang dimulai dengan kata yang Anda ketik</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: "Dr" akan menemukan "Dr. Ahmad"</em></VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle><strong>Diakhiri dengan ($)</strong></VListItemTitle>
                <VListItemSubtitle>Cari data yang diakhiri dengan kata yang Anda ketik</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: "com" akan menemukan "ahmad@gmail.com"</em></VListItemSubtitle>
              </VListItem>
            </VList>
          </VCard>
        </VCol>
        
        <!-- Comparison -->
        <VCol cols="12" md="6" class="mb-4">
          <VCard variant="outlined" class="pa-4">
            <h4 class="text-subtitle-1 mb-3 d-flex align-center">
              <VIcon color="warning" class="me-2">tabler-math-symbols</VIcon>
              Perbandingan Angka/Tanggal
            </h4>
            <VList density="compact">
              <VListItem>
                <VListItemTitle><strong>Lebih besar dari (>)</strong></VListItemTitle>
                <VListItemSubtitle>Cari angka atau tanggal yang lebih besar/baru</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: Umur > 25 atau tanggal setelah 2023-01-01</em></VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle><strong>Lebih kecil dari (<)</strong></VListItemTitle>
                <VListItemSubtitle>Cari angka atau tanggal yang lebih kecil/lama</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: Umur < 30 atau tanggal sebelum 2023-12-31</em></VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle><strong>Lebih besar atau sama (≥)</strong></VListItemTitle>
                <VListItemSubtitle>Sama seperti di atas, tapi termasuk nilai yang sama</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: Umur ≥ 25 akan termasuk yang umur 25</em></VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle><strong>Lebih kecil atau sama (≤)</strong></VListItemTitle>
                <VListItemSubtitle>Sama seperti di atas, tapi termasuk nilai yang sama</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: Umur ≤ 65 akan termasuk yang umur 65</em></VListItemSubtitle>
              </VListItem>
            </VList>
          </VCard>
        </VCol>
        
        <!-- Range -->
        <VCol cols="12" md="6" class="mb-4">
          <VCard variant="outlined" class="pa-4">
            <h4 class="text-subtitle-1 mb-3 d-flex align-center">
              <VIcon color="purple" class="me-2">tabler-arrows-horizontal</VIcon>
              Rentang Nilai
            </h4>
            <VList density="compact">
              <VListItem>
                <VListItemTitle><strong>Dalam rentang tertentu ([ ])</strong></VListItemTitle>
                <VListItemSubtitle>Cari data yang nilainya di antara dua angka</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: Umur antara 20-30 tahun</em></VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle><strong>Di luar rentang (![ ])</strong></VListItemTitle>
                <VListItemSubtitle>Cari data yang nilainya di luar rentang yang ditentukan</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: Umur di luar 20-30 tahun (kurang dari 20 atau lebih dari 30)</em></VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle><strong>Rentang tanggal</strong></VListItemTitle>
                <VListItemSubtitle>Pilih tanggal mulai dan tanggal akhir</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: Pasien yang daftar dari 1 Januari sampai 31 Maret 2023</em></VListItemSubtitle>
              </VListItem>
            </VList>
          </VCard>
        </VCol>
        
        <!-- List -->
        <VCol cols="12" md="6" class="mb-4">
          <VCard variant="outlined" class="pa-4">
            <h4 class="text-subtitle-1 mb-3 d-flex align-center">
              <VIcon color="cyan" class="me-2">tabler-list</VIcon>
              Pencarian dengan Daftar
            </h4>
            <VList density="compact">
              <VListItem>
                <VListItemTitle><strong>Ada dalam daftar (∈)</strong></VListItemTitle>
                <VListItemSubtitle>Cari data yang ada dalam daftar yang Anda buat</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: Kota Jakarta, Bandung, Surabaya</em></VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle><strong>Tidak ada dalam daftar (∉)</strong></VListItemTitle>
                <VListItemSubtitle>Cari data yang tidak ada dalam daftar yang Anda buat</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: Selain Jakarta, Bandung, Surabaya</em></VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle><strong>Cara menulis:</strong></VListItemTitle>
                <VListItemSubtitle class="text-info">Pisahkan dengan koma: Jakarta, Bandung, Surabaya</VListItemSubtitle>
              </VListItem>
            </VList>
          </VCard>
        </VCol>
        
        <!-- Null Checks -->
        <VCol cols="12" md="6" class="mb-4">
          <VCard variant="outlined" class="pa-4">
            <h4 class="text-subtitle-1 mb-3 d-flex align-center">
              <VIcon color="grey" class="me-2">tabler-circle-dashed</VIcon>
              Data Kosong/Berisi
            </h4>
            <VList density="compact">
              <VListItem>
                <VListItemTitle><strong>Data kosong (∅)</strong></VListItemTitle>
                <VListItemSubtitle>Cari data yang tidak diisi atau kosong</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: Pasien yang alamatnya belum diisi</em></VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle><strong>Data sudah diisi (∃)</strong></VListItemTitle>
                <VListItemSubtitle>Cari data yang sudah diisi (tidak kosong)</VListItemSubtitle>
                <VListItemSubtitle class="text-success mt-1"><em>Contoh: Pasien yang alamatnya sudah diisi</em></VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle><strong>Catatan:</strong></VListItemTitle>
                <VListItemSubtitle class="text-warning">Tidak perlu mengisi nilai apa-apa</VListItemSubtitle>
              </VListItem>
            </VList>
          </VCard>
        </VCol>
      </VRow>
      
      <!-- Tips -->
      <VDivider class="my-4" />
      <VAlert type="info" variant="tonal" class="mb-0">
        <VIcon start>tabler-lightbulb</VIcon>
        <strong>Cara Menggunakan:</strong>
        <ul class="mt-2 mb-0">
          <li><strong>Pencarian Cepat:</strong> Langsung ketik nama, NIK, nomor telepon, atau email di kotak pencarian</li>
          <li><strong>Gabungkan Filter:</strong> Bisa pakai beberapa filter sekaligus untuk hasil lebih tepat</li>
          <li><strong>Huruf Besar/Kecil:</strong> Beberapa pencarian tidak peduli huruf besar atau kecil</li>
          <li><strong>Daftar Nilai:</strong> Pisahkan dengan koma. Contoh: Jakarta, Bandung, Surabaya</li>
          <li><strong>Tanggal:</strong> Akan muncul kalender untuk memilih tanggal</li>
          <li><strong>Rentang Angka:</strong> Isi angka awal dan angka akhir (contoh: umur 20 sampai 30)</li>
          <li><strong>Data Kosong:</strong> Untuk mencari data yang belum diisi, tidak perlu mengetik apa-apa</li>
        </ul>
      </VAlert>
    </VCardText>
  </VCard>
</template>

<script setup>
// This is a purely presentational component, no props or logic needed
</script> 
