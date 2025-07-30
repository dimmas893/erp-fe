import Swal from 'sweetalert2'

/**
 * Extract error messages from API response
 * @param {Object} error - Error object from API
 * @returns {Array} Array of error messages
 */
export function extractErrorMessages(error) {
  const messages = []
  
  try {
    // Check if error has data property (from $api)
    const errorData = error.data || error.response?.data || error
    
    // Handle different error structures
    if (errorData.error) {
      if (Array.isArray(errorData.error)) {
        // Handle array of errors: ["branch_id must be a UUID"]
        messages.push(...errorData.error)
      } else if (typeof errorData.error === 'string') {
        // Handle string error
        messages.push(errorData.error)
      } else if (typeof errorData.error === 'object') {
        // Handle object error (validation errors)
        Object.entries(errorData.error).forEach(([field, fieldErrors]) => {
          if (Array.isArray(fieldErrors)) {
            fieldErrors.forEach(msg => messages.push(`${field}: ${msg}`))
          } else {
            messages.push(`${field}: ${fieldErrors}`)
          }
        })
      }
    }
    
    // Handle errors property
    if (errorData.errors) {
      if (Array.isArray(errorData.errors)) {
        messages.push(...errorData.errors)
      } else if (typeof errorData.errors === 'object') {
        Object.entries(errorData.errors).forEach(([field, fieldErrors]) => {
          if (Array.isArray(fieldErrors)) {
            fieldErrors.forEach(msg => messages.push(`${field}: ${msg}`))
          } else {
            messages.push(`${field}: ${fieldErrors}`)
          }
        })
      }
    }
    
    // Handle message property
    if (errorData.message && !messages.length) {
      messages.push(errorData.message)
    }
    
    // Handle response_message property
    if (errorData.response_message && !messages.length) {
      messages.push(errorData.response_message)
    }
    
    // If no specific error messages found, use generic message
    if (messages.length === 0) {
      if (errorData.response_code) {
        messages.push(`Error ${errorData.response_code}: ${errorData.response_message || 'Terjadi kesalahan'}`)
      } else {
        messages.push('Terjadi kesalahan yang tidak diketahui')
      }
    }
    
  } catch (e) {
    console.error('Error parsing error response:', e)
    messages.push('Terjadi kesalahan dalam memproses respons error')
  }
  
  return messages
}

/**
 * Format error messages for display
 * @param {Array} messages - Array of error messages
 * @returns {String} Formatted HTML string
 */
export function formatErrorMessages(messages) {
  if (messages.length === 1) {
    return messages[0]
  }
  
  return `<ul style="text-align: left; margin: 0; padding-left: 20px;">
    ${messages.map(msg => `<li>${msg}</li>`).join('')}
  </ul>`
}

/**
 * Get error title based on response code
 * @param {Object} error - Error object
 * @returns {String} Error title
 */
export function getErrorTitle(error) {
  const errorData = error.data || error.response?.data || error
  const responseCode = errorData.response_code || error.status || error.code
  
  switch (responseCode) {
  case 400:
    return 'Data Tidak Valid'
  case 401:
    return 'Tidak Diotorisasi'
  case 403:
    return 'Akses Ditolak'
  case 404:
    return 'Data Tidak Ditemukan'
  case 422:
    return 'Validasi Gagal'
  case 500:
    return 'Kesalahan Server'
  default:
    return 'Terjadi Kesalahan'
  }
}

/**
 * Show error alert using SweetAlert2
 * @param {Object} error - Error object from API
 * @param {Object} options - Additional options for SweetAlert2
 */
export async function showErrorAlert(error, options = {}) {
  const messages = extractErrorMessages(error)
  const title = getErrorTitle(error)
  const formattedMessage = formatErrorMessages(messages)
  
  const defaultOptions = {
    icon: 'error',
    title: title,
    html: formattedMessage,
    confirmButtonText: 'OK',
    allowOutsideClick: false,
    customClass: {
      popup: 'error-popup',
      title: 'error-title',
      htmlContainer: 'error-content',
    },
  }
  
  const swalOptions = { ...defaultOptions, ...options }
  
  return await Swal.fire(swalOptions)
}

/**
 * Show validation error alert specifically for form validation
 * @param {Object} error - Error object from API
 * @param {String} customTitle - Custom title for validation errors
 */
export async function showValidationErrorAlert(error, customTitle = 'Periksa Data Anda') {
  const messages = extractErrorMessages(error)
  const formattedMessage = formatErrorMessages(messages)
  
  return await Swal.fire({
    icon: 'warning',
    title: customTitle,
    html: formattedMessage,
    confirmButtonText: 'Perbaiki Data',
    allowOutsideClick: false,
    customClass: {
      popup: 'validation-error-popup',
      confirmButton: 'swal2-confirm-validation',
    },
  })
}

/**
 * Show success alert
 * @param {String} message - Success message
 * @param {String} title - Success title
 * @param {Object} options - Additional options
 */
export async function showSuccessAlert(message, title = 'Berhasil!', options = {}) {
  const defaultOptions = {
    icon: 'success',
    title: title,
    text: message,
    confirmButtonText: 'OK',
    allowOutsideClick: false,
  }
  
  const swalOptions = { ...defaultOptions, ...options }
  
  return await Swal.fire(swalOptions)
}

/**
 * Show confirmation dialog
 * @param {String} message - Confirmation message
 * @param {String} title - Confirmation title
 * @param {Object} options - Additional options
 */
export async function showConfirmDialog(message, title = 'Konfirmasi', options = {}) {
  const defaultOptions = {
    icon: 'question',
    title: title,
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
    reverseButtons: true,
    allowOutsideClick: false,
  }
  
  const swalOptions = { ...defaultOptions, ...options }
  
  return await Swal.fire(swalOptions)
}

/**
 * Simple console logging with structured error information
 * @param {Object} error - Error object
 * @param {String} context - Context where error occurred
 */
export function logError(error, context = 'Unknown') {
  const errorData = error.data || error.response?.data || error
  
  console.group(`🚨 Error in ${context}`)
  console.error('Full error object:', error)
  console.error('Error data:', errorData)
  console.error('Error messages:', extractErrorMessages(error))
  console.groupEnd()
}

/**
 * Handle error with both logging and user notification
 * @param {Object} error - Error object from API
 * @param {String} context - Context where error occurred
 * @param {Object} alertOptions - Options for alert dialog
 */
export async function handleError(error, context = 'API Call', alertOptions = {}) {
  // Log error for debugging
  logError(error, context)
  
  // Show error to user
  return await showErrorAlert(error, alertOptions)
}

/**
 * Show coming soon alert
 * @param {String} featureName - Name of the feature that's coming soon
 * @param {Object} options - Additional options for SweetAlert2
 */
export async function showComingSoonAlert(featureName, options = {}) {
  const defaultOptions = {
    icon: 'info',
    title: 'Coming Soon',
    text: `Fitur ${featureName} akan segera hadir.`,
    confirmButtonText: 'OK',
    allowOutsideClick: false,
    customClass: {
      popup: 'coming-soon-popup',
      title: 'coming-soon-title',
      confirmButton: 'swal2-confirm-coming-soon',
    },
  }
  
  const swalOptions = { ...defaultOptions, ...options }
  
  return await Swal.fire(swalOptions)
}

/**
 * Show coming soon alert with custom message
 * @param {String} title - Custom title (default: 'Coming Soon')
 * @param {String} message - Custom message
 * @param {Object} options - Additional options for SweetAlert2
 */
export async function showCustomComingSoonAlert(title = 'Coming Soon', message, options = {}) {
  const defaultOptions = {
    icon: 'info',
    title: title,
    text: message,
    confirmButtonText: 'OK',
    allowOutsideClick: false,
    customClass: {
      popup: 'coming-soon-popup',
      title: 'coming-soon-title',
      confirmButton: 'swal2-confirm-coming-soon',
    },
  }
  
  const swalOptions = { ...defaultOptions, ...options }
  
  return await Swal.fire(swalOptions)
} 
