// Days of the week
export const DAYS = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']

// Day labels for display
export const DAY_LABELS = {
  senin: 'Senin',
  selasa: 'Selasa',
  rabu: 'Rabu',
  kamis: 'Kamis',
  jumat: 'Jumat',
  sabtu: 'Sabtu',
  minggu: 'Minggu'
}

// Time options for operational hours
export const TIME_OPTIONS = [
  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
  '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
]

// Form options
export const ACTIVE_OPTIONS = [
  { title: 'Aktif', value: true },
  { title: 'Nonaktif', value: false }
]

export const AUTO_REORDER_OPTIONS = [
  { title: 'Diaktifkan', value: true },
  { title: 'Dinonaktifkan', value: false }
]

export const PRIORITY_OPTIONS = [
  { title: 'LOW', value: 'LOW' },
  { title: 'MEDIUM', value: 'MEDIUM' },
  { title: 'HIGH', value: 'HIGH' }
]

// Default operational hours
export const DEFAULT_OPERATIONAL_HOURS = {
  senin: { open: '08:00', close: '17:00' },
  selasa: { open: '08:00', close: '17:00' },
  rabu: { open: '08:00', close: '17:00' },
  kamis: { open: '08:00', close: '17:00' },
  jumat: { open: '08:00', close: '17:00' },
  sabtu: { open: '08:00', close: '17:00' },
  minggu: 'CLOSED'
} 
 