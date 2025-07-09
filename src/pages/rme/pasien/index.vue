<template>
  <VCard>
    <VCardText class="d-flex flex-wrap gap-4 align-center justify-space-between">
      <h2 class="text-h4 font-weight-bold mb-0">Data Pasien</h2>
      <div class="d-flex gap-3 align-center flex-wrap">
        <VBtn 
          color="info" 
          variant="tonal" 
          prepend-icon="tabler-help-circle" 
          @click="showDocumentation = !showDocumentation"
          size="small"
        >
          Panduan Filter
        </VBtn>
        <VBtn 
          color="primary" 
          variant="tonal" 
          prepend-icon="tabler-filter" 
          @click="showFilters = !showFilters"
          :class="{ 'v-btn--active': showFilters }"
        >
          Filter
          <VChip v-if="activeFiltersCount > 0" size="small" color="error" class="ms-2">
            {{ activeFiltersCount }}
          </VChip>
        </VBtn>
      </div>
    </VCardText>
    
    <!-- Documentation Panel -->
    <VExpandTransition>
      <div v-show="showDocumentation">
        <VDivider />
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
                      <VListItemSubtitle class="text-success mt-1"><em>Contoh: Umur ≤ 30 akan termasuk yang umur 30</em></VListItemSubtitle>
                    </VListItem>
                  </VList>
                </VCard>
              </VCol>
              
              <!-- Range -->
              <VCol cols="12" md="6" class="mb-4">
                <VCard variant="outlined" class="pa-4">
                  <h4 class="text-subtitle-1 mb-3 d-flex align-center">
                    <VIcon color="purple" class="me-2">tabler-brackets-contain</VIcon>
                    Pencarian Rentang
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
      </div>
    </VExpandTransition>
    
    <!-- Filter Panel -->
    <VExpandTransition>
      <div v-show="showFilters">
        <VDivider />
        <VCard flat class="ma-4" border>
          <VCardText class="pa-6">
            <div class="d-flex align-center mb-4">
              <VIcon color="primary" class="me-2">tabler-adjustments-horizontal</VIcon>
              <h3 class="text-h6 mb-0">Filter Data Pasien</h3>
            </div>
            
            <!-- Filter Items -->
            <div v-if="filters.length > 0" class="mb-6">
              <VRow>
                <VCol 
                  v-for="(filter, index) in filters" 
                  :key="index" 
                  cols="12"
                  class="mb-2"
                >
                  <VCard variant="outlined" class="pa-4">
                    <VRow align="center" no-gutters>
                      <VCol cols="12" sm="3" class="pe-sm-2 mb-3 mb-sm-0">
                        <VSelect
                          v-model="filter.search_by"
                          :items="filterFields"
                          item-title="title"
                          item-value="value"
                          label="Field"
                          density="comfortable"
                          variant="outlined"
                          hide-details
                        />
                      </VCol>
                      <VCol cols="12" sm="3" class="px-sm-2 mb-3 mb-sm-0">
                        <VSelect
                          v-model="filter.filter_type"
                          :items="filterOperators"
                          item-title="title"
                          item-value="value"
                          label="Operator"
                          density="comfortable"
                          variant="outlined"
                          hide-details
                        />
                      </VCol>
                      <VCol cols="12" sm="5" class="px-sm-2 mb-3 mb-sm-0">
                         <!-- Text Input for most operators -->
                         <VTextField
                           v-if="!['date_range', 'between', 'not_between', 'in', 'not_in', 'array_overlap', 'is_null', 'is_not_null', 'is_active', 'consent_status', 'gender'].includes(filter.filter_type) && !isDateField(filter.search_by)"
                           v-model="filter.search_query"
                           :label="getInputLabel(filter.filter_type)"
                           density="comfortable"
                           variant="outlined"
                           hide-details
                           @keyup.enter="applyFilters"
                         />
                         
                         <!-- Range Input (between/not_between) -->
                         <div v-else-if="['between', 'not_between'].includes(filter.filter_type)">
                           <VRow no-gutters>
                             <VCol cols="6" class="pe-1">
                               <VTextField
                                 v-model="filter.start_value"
                                 label="Nilai Awal"
                                 :type="isNumericField(filter.search_by) ? 'number' : 'text'"
                                 density="comfortable"
                                 variant="outlined"
                                 hide-details
                               />
                             </VCol>
                             <VCol cols="6" class="ps-1">
                               <VTextField
                                 v-model="filter.end_value"
                                 label="Nilai Akhir"
                                 :type="isNumericField(filter.search_by) ? 'number' : 'text'"
                                 density="comfortable"
                                 variant="outlined"
                                 hide-details
                               />
                             </VCol>
                           </VRow>
                         </div>
                         
                         <!-- Date Range Picker -->
                         <div v-else-if="filter.filter_type === 'date_range' || isDateField(filter.search_by)">
                           <VRow no-gutters>
                             <VCol cols="6" class="pe-1">
                               <VTextField
                                 v-model="filter.date_from"
                                 label="Dari Tanggal"
                                 type="date"
                                 density="comfortable"
                                 variant="outlined"
                                 hide-details
                               />
                             </VCol>
                             <VCol cols="6" class="ps-1">
                               <VTextField
                                 v-model="filter.date_to"
                                 label="Sampai Tanggal"
                                 type="date"
                                 density="comfortable"
                                 variant="outlined"
                                 hide-details
                               />
                             </VCol>
                           </VRow>
                         </div>
                         
                         <!-- Comma Separated List (in/not_in/array_overlap) -->
                         <VTextField
                           v-else-if="['in', 'not_in', 'array_overlap'].includes(filter.filter_type)"
                           v-model="filter.values_list"
                           label="Daftar nilai (pisah dengan koma)"
                           placeholder="contoh: nilai1, nilai2, nilai3"
                           density="comfortable"
                           variant="outlined"
                           hide-details
                           @keyup.enter="applyFilters"
                         />
                         
                         <!-- Boolean Select for is_active -->
                         <VSelect
                           v-else-if="filter.search_by === 'is_active'"
                           v-model="filter.search_query"
                           :items="[
                             { title: 'Aktif', value: 'true' },
                             { title: 'Nonaktif', value: 'false' }
                           ]"
                           item-title="title"
                           item-value="value"
                           label="Status"
                           density="comfortable"
                           variant="outlined"
                           hide-details
                         />
                         
                         <!-- Consent Status Select -->
                         <VSelect
                           v-else-if="filter.search_by === 'consent_status'"
                           v-model="filter.search_query"
                           :items="[
                             { title: 'Diberikan', value: 'GIVEN' },
                             { title: 'Menunggu', value: 'PENDING' },
                             { title: 'Ditolak', value: 'DENIED' }
                           ]"
                           item-title="title"
                           item-value="value"
                           label="Status Persetujuan"
                           density="comfortable"
                           variant="outlined"
                           hide-details
                         />
                         
                         <!-- Gender Select -->
                         <VSelect
                           v-else-if="filter.search_by === 'gender'"
                           v-model="filter.search_query"
                           :items="[
                             { title: 'Laki-laki', value: 'MALE' },
                             { title: 'Perempuan', value: 'FEMALE' }
                           ]"
                           item-title="title"
                           item-value="value"
                           label="Jenis Kelamin"
                           density="comfortable"
                           variant="outlined"
                           hide-details
                         />
                         
                         <!-- No Input for null checks -->
                         <VCard v-else-if="['is_null', 'is_not_null'].includes(filter.filter_type)" variant="outlined" class="pa-3">
                           <div class="text-center text-medium-emphasis">
                             <VIcon class="mb-2">tabler-info-circle</VIcon>
                             <div class="text-caption">
                               Operator ini tidak memerlukan nilai input
                             </div>
                           </div>
                         </VCard>
                       </VCol>
                      <VCol cols="12" sm="1" class="ps-sm-2 d-flex justify-center justify-sm-end">
                        <VBtn
                          color="error"
                          variant="text"
                          icon="tabler-trash"
                          size="small"
                          @click="removeFilter(index)"
                        />
                      </VCol>
                    </VRow>
                  </VCard>
                </VCol>
              </VRow>
            </div>
            
            <!-- Empty State -->
            <div v-else class="text-center py-8 mb-6">
              <VIcon size="48" color="primary" class="mb-3">tabler-filter-off</VIcon>
              <p class="text-body-1 text-medium-emphasis mb-0">Belum ada filter ditambahkan</p>
            </div>
            
            <!-- Filter Actions -->
            <div class="d-flex gap-3 flex-wrap mb-6">
              <VBtn 
                color="primary" 
                variant="tonal" 
                prepend-icon="tabler-plus" 
                @click="addFilter"
              >
                Tambah Filter
              </VBtn>
              <VBtn 
                v-if="filters.length > 0"
                color="success" 
                prepend-icon="tabler-check" 
                @click="applyFilters"
              >
                Terapkan Filter
              </VBtn>
              <VBtn 
                v-if="filters.length > 0 || quickSearch"
                color="warning" 
                variant="outlined" 
                prepend-icon="tabler-refresh" 
                @click="clearFilters"
              >
                Reset Semua
              </VBtn>
            </div>
            
            <!-- Quick Search -->
            <VDivider class="mb-4" />
            <div class="d-flex align-center mb-3">
              <VIcon color="primary" class="me-2">tabler-search</VIcon>
              <h4 class="text-h6 mb-0">Pencarian Cepat</h4>
            </div>
            <VRow align="center">
              <VCol cols="12" md="8">
                <VTextField
                  v-model="quickSearch"
                  density="comfortable"
                  placeholder="Cari nama, NIK, telepon, atau email..."
                  prepend-inner-icon="tabler-search"
                  variant="outlined"
                  hide-details
                  @keyup.enter="applyQuickSearch"
                  clearable
                />
              </VCol>
              <VCol cols="12" md="4">
                <VBtn 
                  color="primary" 
                  @click="applyQuickSearch" 
                  prepend-icon="tabler-search"
                  block
                >
                  Cari
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </div>
    </VExpandTransition>
    
    <VDivider />
    <VDataTableServer
      :headers="headers"
      :items="patients"
      :items-length="totalPatients"
      :loading="loading"
      :items-per-page="itemsPerPage"
      :page="page"
      :sort-by="[{ key: sortBy, order: orderBy }]"
      class="text-no-wrap"
      @update:options="onUpdateOptions"
    >
      <template #item.no="{ index }">
        {{ (itemsPerPage * (page - 1)) + index + 1 }}
      </template>
      <template #item.name="{ item }">
        <RouterLink :to="`/rme/pasien/${item.id}`" class="text-primary text-decoration-underline font-weight-medium">
          {{ item.name }}
        </RouterLink>
      </template>
      <template #item.birth_date="{ item }">
        {{ formatDate(item.birth_date) }}
      </template>
      <template #item.created_at="{ item }">
        {{ formatDateTime(item.created_at) }}
      </template>
      <template #item.is_active="{ item }">
        <VChip :color="item.is_active ? 'success' : 'error'" size="small" label>
          {{ item.is_active ? 'Aktif' : 'Nonaktif' }}
        </VChip>
      </template>
      <template #item.consent_status="{ item }">
        <VChip :color="getConsentColor(item.consent_status)" size="small" label>
          {{ item.consent_status }}
        </VChip>
      </template>
      <template #item.emergency_contact="{ item }">
        <div v-if="item.emergency_contact">
          <div class="font-weight-medium">{{ item.emergency_contact.name }}</div>
          <div class="text-body-2">{{ item.emergency_contact.phone }}</div>
          <div class="text-caption text-medium-emphasis">{{ item.emergency_contact.relationship }}</div>
        </div>
        <div v-else class="text-medium-emphasis">-</div>
      </template>
      <template #loading>
        <VSkeletonLoader
          class="mx-auto"
          type="table-row@10"
        />
      </template>
      <template #no-data>
        <div class="text-center py-12">
          <VIcon size="64" color="primary" class="mb-4">tabler-users</VIcon>
          <h3 class="text-h6 mb-2">Tidak ada data ditemukan</h3>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Coba ubah filter atau kriteria pencarian Anda
          </p>
          <VBtn color="primary" variant="tonal" @click="clearFilters">
            Reset Filter
          </VBtn>
        </div>
      </template>
      <template #bottom>
        <div class="d-flex align-center justify-space-between flex-wrap gap-3 pa-4">
          <div class="d-flex align-center gap-2">
            <span class="text-body-2 text-medium-emphasis">Tampilkan:</span>
            <VSelect
              v-model="itemsPerPage"
              :items="perPageOptions"
              item-title="title"
              item-value="value"
              density="compact"
              variant="outlined"
              hide-details
              style="min-width: 80px; max-width: 100px;"
            />
            <span class="text-body-2 text-medium-emphasis">per halaman</span>
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{ paginationMeta({ page: page, itemsPerPage: itemsPerPage }, totalPatients) }}
          </div>
          <TablePagination
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :total-items="totalPatients"
            :items-per-page-options="perPageOptions"
            hide-details
            :show-meta="false"
          />
        </div>
      </template>
    </VDataTableServer>
  </VCard>
</template>

<script setup>
import TablePagination from '@/@core/components/TablePagination.vue'
import { $api } from '@/utils/api'
import { paginationMeta } from '@/utils/paginationMeta'
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

// State
const quickSearch = ref('')
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref('createdAt')
const orderBy = ref('desc')
const loading = ref(false)
const showFilters = ref(false)
const showDocumentation = ref(false)

const patients = ref([])
const totalPatients = ref(0)

// Filters
const filters = ref([])

// Filter Options
const filterFields = [
  { title: 'Nama', value: 'name' },
  { title: 'NIK', value: 'nik' },
  { title: 'No. Pasien', value: 'patient_number' },
  { title: 'Email', value: 'email' },
  { title: 'Telepon', value: 'phone' },
  { title: 'Gender', value: 'gender' },
  { title: 'Alamat', value: 'address' },
  { title: 'Status Persetujuan', value: 'consent_status' },
  { title: 'Status Aktif', value: 'is_active' },
  { title: 'Tanggal Dibuat', value: 'createdAt' },
  { title: 'Tanggal Update', value: 'updatedAt' },
]

const filterOperators = [
  // Equality Operators
  { title: 'Sama dengan (=)', value: 'equal' },
  { title: 'Tidak sama dengan (≠)', value: 'not_equal' },
  
  // Text Search Operators
  { title: 'Mengandung (~)', value: 'like' },
  { title: 'Mengandung (case insensitive)', value: 'ilike' },
  { title: 'Tidak mengandung (!~)', value: 'not_like' },
  { title: 'Tidak mengandung (case insensitive)', value: 'not_ilike' },
  { title: 'Dimulai dengan (^)', value: 'starts_with' },
  { title: 'Diakhiri dengan ($)', value: 'ends_with' },
  { title: 'Berisi substring', value: 'contains' },
  { title: 'Berisi substring (case insensitive)', value: 'icontains' },
  
  // Comparison Operators
  { title: 'Lebih besar dari (>)', value: 'greater_than' },
  { title: 'Lebih besar atau sama dengan (≥)', value: 'greater_equal' },
  { title: 'Lebih kecil dari (<)', value: 'less_than' },
  { title: 'Lebih kecil atau sama dengan (≤)', value: 'less_equal' },
  
  // Range Operators
  { title: 'Dalam rentang ([ ])', value: 'between' },
  { title: 'Tidak dalam rentang (![ ])', value: 'not_between' },
  { title: 'Dalam rentang tanggal ([ ])', value: 'date_range' },
  
  // Array/List Operators
  { title: 'Dalam daftar (∈)', value: 'in' },
  { title: 'Tidak dalam daftar (∉)', value: 'not_in' },
  { title: 'Array overlap (&&)', value: 'array_overlap' },
  
  // Null Checks
  { title: 'Kosong (∅)', value: 'is_null' },
  { title: 'Tidak kosong (∃)', value: 'is_not_null' },
  
  // Advanced Text Search
  { title: 'Regex pattern (.*)', value: 'regexp' },
  { title: 'Regex pattern (case insensitive)', value: 'iregexp' },
  
  // JSON Operators (for JSONB fields)
  { title: 'JSON mengandung (@>)', value: 'json_contains' },
  { title: 'JSON terkandung dalam (<@)', value: 'json_contained' },
  { title: 'JSON extract path (->)', value: 'json_extract' },
  { title: 'JSON extract text (->>)', value: 'json_extract_text' },
  
  // Array Operators
  { title: 'Array mengandung (@>)', value: 'array_contains' },
  { title: 'Array overlap (&&)', value: 'array_overlap' },
]

const perPageOptions = [
  { value: 5, title: '5' },
  { value: 10, title: '10' },
  { value: 15, title: '15' },
  { value: 20, title: '20' },
  { value: -1, title: 'All' },
]

const headers = [
  { title: 'No', key: 'no', sortable: false },
  { title: 'Nama', key: 'name' },
  { title: 'NIK', key: 'nik' },
  { title: 'Tgl Lahir', key: 'birth_date' },
  { title: 'Gender', key: 'gender' },
  { title: 'Telepon', key: 'phone' },
  { title: 'Email', key: 'email' },
  { title: 'Alamat', key: 'address' },
  { title: 'Emergency Contact', key: 'emergency_contact', sortable: false },
  { title: 'Status Persetujuan', key: 'consent_status' },
  { title: 'Aktif', key: 'is_active', sortable: false },
  { title: 'Tanggal Input', key: 'created_at' },
]

// Computed
const activeFiltersCount = computed(() => {
  return filters.value.filter(f => {
    // For null checks, no value needed - always count as active if selected
    if (['is_null', 'is_not_null'].includes(f.filter_type)) {
      return true
    }
    // For range operators, check if both values are provided
    if (['between', 'not_between'].includes(f.filter_type)) {
      return f.start_value && f.end_value
    }
    // For date range, check if both dates are provided
    if (f.filter_type === 'date_range' || isDateField(f.search_by)) {
      return f.date_from && f.date_to
    }
    // For list operators, check if values_list exists
    if (['in', 'not_in', 'array_overlap'].includes(f.filter_type)) {
      return f.values_list && f.values_list.trim()
    }
    // For other filters, check if search_query exists
    return f.search_query && f.search_query.trim()
  }).length
})

// Functions
async function fetchPatients() {
  loading.value = true
  try {
    const requestBody = {
      page: page.value,
      per_page: itemsPerPage.value === -1 ? 1000 : itemsPerPage.value,
      sort_by: sortBy.value,
      sort_order: orderBy.value,
    }

    // Process and add filters if any
    const activeFilters = filters.value.filter(f => {
      // For null checks, no value needed
      if (['is_null', 'is_not_null'].includes(f.filter_type)) {
        return true
      }
      // For range operators, check if both values are provided
      if (['between', 'not_between'].includes(f.filter_type)) {
        return f.start_value && f.end_value
      }
      // For date range, check if both dates are provided
      if (f.filter_type === 'date_range' || isDateField(f.search_by)) {
        return f.date_from && f.date_to
      }
      // For list operators, check if values_list exists
      if (['in', 'not_in', 'array_overlap'].includes(f.filter_type)) {
        return f.values_list && f.values_list.trim()
      }
      // For other filters, check if search_query exists
      return f.search_query && f.search_query.trim()
    }).map(f => {
      const filter = {
        search_by: f.search_by,
        filter_type: f.filter_type
      }
      
      // Handle different input types based on operator
      if (['between', 'not_between'].includes(f.filter_type)) {
        filter.start_value = f.start_value
        filter.end_value = f.end_value
      } else if (f.filter_type === 'date_range' || isDateField(f.search_by)) {
        filter.search_query = `${f.date_from},${f.date_to}`
      } else if (['in', 'not_in', 'array_overlap'].includes(f.filter_type)) {
        filter.values_list = f.values_list.trim()
      } else if (!['is_null', 'is_not_null'].includes(f.filter_type)) {
        filter.search_query = f.search_query.trim()
      }
      
      return filter
    })

    if (activeFilters.length > 0) {
      requestBody.filters = activeFilters
    }

    // Add quick search if exists
    if (quickSearch.value?.trim()) {
      if (!requestBody.filters) requestBody.filters = []
      requestBody.filters.push({
        search_by: 'name',
        filter_type: 'like',
        search_query: quickSearch.value.trim()
      })
    }

    const res = await $api('/rme/patients/paginated', {
      method: 'POST',
      body: requestBody,
    })
    
    patients.value = res.data || []
    totalPatients.value = res.meta?.total || 0
  } catch (error) {
    console.error('Error fetching patients:', error)
    patients.value = []
    totalPatients.value = 0
  } finally {
    loading.value = false
  }
}

function addFilter() {
  filters.value.push({
    search_by: 'name',
    filter_type: 'like',
    search_query: '',
    date_from: '',
    date_to: '',
    start_value: '',
    end_value: '',
    values_list: ''
  })
}

function removeFilter(index) {
  filters.value.splice(index, 1)
  if (filters.value.length === 0) {
    applyFilters()
  }
}

function applyFilters() {
  page.value = 1
  fetchPatients()
}

function clearFilters() {
  filters.value = []
  quickSearch.value = ''
  page.value = 1
  fetchPatients()
}

function applyQuickSearch() {
  page.value = 1
  fetchPatients()
}

function onUpdateOptions(options) {
  if (options.page !== page.value) page.value = options.page
  if (options.itemsPerPage !== itemsPerPage.value) itemsPerPage.value = options.itemsPerPage
  
  // Handle sorting
  if (options.sortBy && options.sortBy.length > 0) {
    const sortItem = options.sortBy[0]
    sortBy.value = sortItem.key
    orderBy.value = sortItem.order
    fetchPatients()
  }
}

function getConsentColor(status) {
  switch (status) {
    case 'GIVEN': return 'success'
    case 'PENDING': return 'warning'
    case 'DENIED': return 'error'
    default: return 'secondary'
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID')
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('id-ID')
}

function isDateField(field) {
  return ['birth_date', 'createdAt', 'updatedAt'].includes(field)
}

function isNumericField(field) {
  return ['age', 'patient_number', 'phone'].includes(field)
}

function getInputLabel(operator) {
  switch (operator) {
    case 'between': return 'Nilai Awal';
    case 'not_between': return 'Nilai Awal';
    case 'in': return 'Daftar nilai (pisah dengan koma)';
    case 'not_in': return 'Daftar nilai (pisah dengan koma)';
    case 'array_overlap': return 'Daftar nilai (pisah dengan koma)';
    default: return 'Nilai';
  }
}

// Watchers
watch([page, itemsPerPage], () => {
  fetchPatients()
})

// Initialize
fetchPatients()
</script>

<style scoped>
.v-btn--active {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
}

.v-table {
  width: 100%;
  border-collapse: collapse;
}

.v-table th, .v-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.v-table th {
  background: #f5f5f5;
}

.text-center {
  text-align: center;
}
</style> 
