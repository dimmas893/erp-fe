/**
 * CONTOH PENGGUNAAN ERROR HANDLER
 * 
 * File ini menunjukkan berbagai cara menggunakan error handler
 * untuk menangani berbagai jenis error dari API
 */

import {
  extractErrorMessages,
  handleError,
  logError,
  showConfirmDialog,
  showErrorAlert,
  showSuccessAlert,
  showValidationErrorAlert,
} from './errorHandler'

// ========================================
// CONTOH 1: Basic Error Handling
// ========================================
async function basicErrorExample() {
  try {
    const response = await $api('/rme/patients', {
      method: 'POST',
      body: { /* data */ },
    })


    // Success handling
    await showSuccessAlert('Data berhasil disimpan!')
  } catch (error) {
    // Simple error handling
    await showErrorAlert(error)
  }
}

// ========================================
// CONTOH 2: Specific Validation Error
// ========================================
async function validationErrorExample() {
  try {
    const response = await $api('/rme/patients', { method: 'POST', body: {} })
  } catch (error) {
    // Error response example:
    // {
    //   "response_code": 400,
    //   "response_message": "Bad Request Exception", 
    //   "error": ["branch_id must be a UUID", "name is required"]
    // }
    
    const errorData = error.data || error.response?.data || error
    if (errorData.response_code === 400) {
      await showValidationErrorAlert(error, 'Periksa Data Input Anda')
    } else {
      await showErrorAlert(error)
    }
  }
}

// ========================================
// CONTOH 3: Advanced Error Handling
// ========================================
async function advancedErrorExample() {
  try {
    const response = await $api('/rme/patients')
  } catch (error) {
    // Log error for debugging
    logError(error, 'Patient Creation')
    
    // Handle different error types
    const errorData = error.data || error.response?.data || error
    
    switch (errorData.response_code) {
    case 400:
      await showValidationErrorAlert(error, 'Data Tidak Valid')
      break
    case 401:
      await showErrorAlert(error, {
        title: 'Session Expired',
        text: 'Silakan login kembali',
      })

      // Redirect to login
      break
    case 403:
      await showErrorAlert(error, {
        title: 'Akses Ditolak',
        text: 'Anda tidak memiliki permission untuk aksi ini',
      })
      break
    case 404:
      await showErrorAlert(error, {
        title: 'Data Tidak Ditemukan',
        text: 'Data yang Anda cari tidak tersedia',
      })
      break
    default:
      await showErrorAlert(error)
    }
  }
}

// ========================================
// CONTOH 4: Using handleError (All-in-one)
// ========================================
async function allInOneErrorExample() {
  try {
    const response = await $api('/rme/patients')
  } catch (error) {
    // This will log the error AND show alert to user
    await handleError(error, 'Patient Management', {
      title: 'Custom Error Title',
    })
  }
}

// ========================================
// CONTOH 5: Extract Messages Only
// ========================================
async function extractMessagesExample() {
  try {
    const response = await $api('/rme/patients')
  } catch (error) {
    // Just get the error messages without showing alert
    const messages = extractErrorMessages(error)

    console.log('Error messages:', messages)
    
    // Use messages in your own way
    // Example: set to reactive ref for display in component
    // errorMessages.value = messages
  }
}

// ========================================
// CONTOH 6: Confirmation Dialog
// ========================================
async function confirmDialogExample() {
  const result = await showConfirmDialog(
    'Apakah Anda yakin ingin menghapus data pasien ini?',
    'Konfirmasi Hapus',
  )
  
  if (result.isConfirmed) {
    try {
      await $api('/rme/patients/123', { method: 'DELETE' })
      await showSuccessAlert('Data berhasil dihapus')
    } catch (error) {
      await showErrorAlert(error)
    }
  }
}

// ========================================
// CONTOH 7: Custom Success Alert
// ========================================
async function customSuccessExample() {
  try {
    const response = await $api('/rme/patients', { method: 'POST' })
    
    await showSuccessAlert(
      `Pasien berhasil didaftarkan dengan nomor: ${response.data.patient_number}`,
      'Pendaftaran Berhasil!',
      {
        timer: 3000,
        timerProgressBar: true,
      },
    )
  } catch (error) {
    await showErrorAlert(error)
  }
}

// ========================================
// CONTOH 8: Error Types yang Didukung
// ========================================

/* 
ERROR RESPONSE FORMATS YANG DIDUKUNG:

1. Standard Laravel Validation:
{
  "response_code": 422,
  "response_message": "Validation failed",
  "errors": {
    "name": ["The name field is required"],
    "email": ["The email field must be valid"]
  }
}

2. Custom API Format:
{
  "response_code": 400,
  "response_message": "Bad Request",
  "error": ["branch_id must be a UUID", "NIK already exists"]
}

3. Simple Message Format:
{
  "response_code": 500,
  "response_message": "Internal Server Error",
  "message": "Database connection failed"
}

4. Axios Error Format:
{
  status: 400,
  data: {
    error: ["Validation failed"]
  }
}

SEMUA FORMAT INI AKAN DITANGANI SECARA OTOMATIS!
*/

export {
  advancedErrorExample,
  allInOneErrorExample, basicErrorExample, confirmDialogExample,
  customSuccessExample, extractMessagesExample, validationErrorExample,
}

