import { reactive, ref } from 'vue'
import { DEFAULT_OPERATIONAL_HOURS } from '../constants'

export function useFormValidation() {
  const editFormRef = ref()
  const isFormValid = ref(false)

  // Form data
  const editData = reactive({
    name: '',
    phone: '',
    email: '',
    address: '',
    photo_url: '',
    max_stock_capacity_m3: 0,
    is_active: true,
    auto_reorder_enabled: true,
    operational_hours: { ...DEFAULT_OPERATIONAL_HOURS },
    settings: {
      max_stock_days: 90,
      min_stock_days: 14,
      priority_level: 'MEDIUM',
      auto_reorder_days: 7
    }
  })

  // Helper function to ensure operational hours structure
  const ensureOperationalHoursStructure = (data) => {
    if (data.operational_hours) {
      // Create a clean operational hours structure
      const cleanOperationalHours = {}
      
      // Define the expected days in order
      const expectedDays = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']
      
      expectedDays.forEach(day => {
        const dayData = data.operational_hours[day]
        
        if (dayData === 'CLOSED') {
          cleanOperationalHours[day] = 'CLOSED'
        } else if (dayData && typeof dayData === 'object' && dayData.open && dayData.close) {
          cleanOperationalHours[day] = {
            open: dayData.open,
            close: dayData.close
          }
        } else {
          // Use default from constants
          cleanOperationalHours[day] = { ...DEFAULT_OPERATIONAL_HOURS[day] }
        }
      })
      
      // Replace the original data with clean structure
      data.operational_hours = cleanOperationalHours
    }
  }

  // Validation rules
  const validationRules = {
    name: [v => !!v || 'Nama cabang harus diisi'],
    phone: [v => !!v || 'Nomor telepon harus diisi'],
    email: [
      v => !!v || 'Email harus diisi',
      v => /.+@.+\..+/.test(v) || 'Format email tidak valid'
    ],
    address: [v => !!v || 'Alamat harus diisi'],
    max_stock_capacity_m3: [
      v => v !== null && v !== undefined || 'Kapasitas maksimal harus diisi',
      v => v > 0 || 'Kapasitas maksimal harus lebih dari 0'
    ],
    is_active: [v => v !== null && v !== undefined || 'Status aktif harus dipilih'],
    auto_reorder_enabled: [v => v !== null && v !== undefined || 'Status auto reorder harus dipilih'],
    // Settings validation rules
    max_stock_days: [v => !!v || 'Maksimal hari stok harus diisi', v => v > 0 || 'Hari harus lebih dari 0'],
    min_stock_days: [v => !!v || 'Minimal hari stok harus diisi', v => v > 0 || 'Hari harus lebih dari 0'],
    priority_level: [v => !!v || 'Tingkat prioritas harus dipilih'],
    auto_reorder_days: [v => !!v || 'Hari auto reorder harus diisi', v => v > 0 || 'Hari harus lebih dari 0']
  }

  return {
    editData,
    validationRules,
    isFormValid,
    editFormRef,
    ensureOperationalHoursStructure
  }
} 
