/**
 * Generate filter fields from sample data or predefined configuration
 * @param {Object|Array} fieldsOrSampleData - Either field configuration array or sample data object
 * @param {Object} fieldConfigs - Additional field configurations
 * @returns {Array} Array of field objects for the filter dropdown
 */
export function generateFilterFields(fieldsOrSampleData, fieldConfigs = {}) {
  // If it's already an array of field configurations, return as is
  if (Array.isArray(fieldsOrSampleData)) {
    return fieldsOrSampleData
  }

  // Generate fields from sample data object
  const fields = []
  const sampleData = fieldsOrSampleData

  for (const [key, value] of Object.entries(sampleData)) {
    // Skip certain internal fields
    if (['__v', '_id'].includes(key)) continue

    const fieldConfig = fieldConfigs[key] || {}
    const title = fieldConfig.title || generateFieldTitle(key)
    
    fields.push({
      title,
      value: key,
      type: fieldConfig.type || inferFieldType(key, value),
      ...fieldConfig,
    })
  }

  return fields.sort((a, b) => a.title.localeCompare(b.title))
}

/**
 * Generate a human-readable title from field key
 * @param {string} key - Field key
 * @returns {string} Human-readable title
 */
function generateFieldTitle(key) {
  // Handle common patterns
  const titleMap = {
    // Basic info
    'id': 'ID',
    'name': 'Nama',
    'email': 'Email',
    'phone': 'Telepon',
    'address': 'Alamat',
    'nik': 'NIK',
    'gender': 'Jenis Kelamin',
    
    // Dates
    'birth_date': 'Tanggal Lahir',
    'created_at': 'Tanggal Dibuat',
    'updated_at': 'Tanggal Update',
    'createdAt': 'Tanggal Dibuat',
    'updatedAt': 'Tanggal Update',
    
    // Patient specific
    'patient_number': 'No. Pasien',
    'medical_history': 'Riwayat Medis',
    'allergies': 'Alergi',
    'current_medications': 'Obat Saat Ini',
    'emergency_contact': 'Kontak Darurat',
    'consent_status': 'Status Persetujuan',
    'is_active': 'Status Aktif',
    
    // Common patterns
    'status': 'Status',
    'type': 'Tipe',
    'category': 'Kategori',
    'description': 'Deskripsi',
  }

  if (titleMap[key]) {
    return titleMap[key]
  }

  // Convert snake_case and camelCase to Title Case
  return key
    .replace(/([A-Z])/g, ' $1') // Split camelCase
    .replace(/_/g, ' ') // Replace underscores with spaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim()
}

/**
 * Infer field type from key and sample value
 * @param {string} key - Field key
 * @param {any} value - Sample value
 * @returns {string} Inferred field type
 */
function inferFieldType(key, value) {
  // Check key patterns first
  if (key.includes('email')) return 'email'
  if (key.includes('phone') || key.includes('telepon')) return 'tel'
  if (key.includes('date') || key.includes('_at') || key.includes('At')) return 'date'
  if (key.includes('age') || key.includes('umur')) return 'number'
  if (key === 'gender' || key === 'jenis_kelamin') return 'select'
  if (key.includes('status')) return 'select'
  if (key.includes('is_') || key.includes('has_')) return 'boolean'

  // Check value type
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  if (value instanceof Date) return 'date'
  if (typeof value === 'string') {
    // Check string patterns
    if (value.includes('@')) return 'email'
    if (/^\d+$/.test(value)) return 'number'
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'date'
  }

  return 'text'
}

/**
 * Get default filter operators
 * @returns {Array} Array of filter operator objects
 */
export function getDefaultFilterOperators() {
  return [
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
}

/**
 * Get field configuration
 * @param {string} fieldName - Field name
 * @param {Object} fieldConfigs - Field configurations
 * @returns {Object} Field configuration
 */
export function getFieldConfig(fieldName, fieldConfigs = {}) {
  return fieldConfigs[fieldName] || {}
}

/**
 * Generate field configurations for common data types
 * @param {Object} sampleData - Sample data object
 * @returns {Object} Field configurations
 */
export function generateFieldConfigs(sampleData) {
  const configs = {}

  for (const [key, value] of Object.entries(sampleData)) {
    const type = inferFieldType(key, value)

    configs[key] = {
      type,
      title: generateFieldTitle(key),
    }

    // Add specific configurations for certain field types
    if (key === 'gender') {
      configs[key].options = [
        { title: 'Laki-laki', value: 'MALE' },
        { title: 'Perempuan', value: 'FEMALE' },
      ]
    }

    if (key === 'consent_status') {
      configs[key].options = [
        { title: 'Diberikan', value: 'GIVEN' },
        { title: 'Menunggu', value: 'PENDING' },
        { title: 'Ditolak', value: 'DENIED' },
      ]
    }

    if (key === 'is_active') {
      configs[key].options = [
        { title: 'Aktif', value: 'true' },
        { title: 'Nonaktif', value: 'false' },
      ]
    }
  }

  return configs
}

/**
 * Create a dynamic filter configuration from an API response
 * @param {Object} apiResponse - API response containing data
 * @param {Object} customConfigs - Custom field configurations
 * @returns {Object} Dynamic filter configuration
 */
export function createDynamicFilterConfig(apiResponse, customConfigs = {}) {
  // Get sample data from the first item in the response
  let sampleData = {}
  
  if (apiResponse?.data && Array.isArray(apiResponse.data) && apiResponse.data.length > 0) {
    sampleData = apiResponse.data[0]
  } else if (apiResponse?.data && typeof apiResponse.data === 'object') {
    sampleData = apiResponse.data
  }

  // Flatten nested objects for filtering (like emergency_contact)
  const flattenedData = flattenObject(sampleData)
  
  return {
    fields: generateFilterFields(flattenedData, customConfigs),
    fieldConfigs: { ...generateFieldConfigs(flattenedData), ...customConfigs },
  }
}

/**
 * Flatten nested objects for filtering
 * @param {Object} obj - Object to flatten
 * @param {string} prefix - Prefix for nested keys
 * @returns {Object} Flattened object
 */
function flattenObject(obj, prefix = '') {
  const flattened = {}
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      // Recursively flatten nested objects
      Object.assign(flattened, flattenObject(value, newKey))
    } else {
      flattened[newKey] = value
    }
  }
  
  return flattened
}

/**
 * Check if a field is a date field
 * @param {string} fieldName - Field name
 * @param {Object} fieldConfigs - Field configurations
 * @returns {boolean} True if field is a date field
 */
export function isDateField(fieldName, fieldConfigs = {}) {
  const config = getFieldConfig(fieldName, fieldConfigs)
  
  return config?.type === 'date' || 
         ['birth_date', 'createdAt', 'updatedAt', 'created_at', 'updated_at'].includes(fieldName)
}

/**
 * Check if a field is a numeric field
 * @param {string} fieldName - Field name
 * @param {Object} fieldConfigs - Field configurations
 * @returns {boolean} True if field is numeric
 */
export function isNumericField(fieldName, fieldConfigs = {}) {
  const config = getFieldConfig(fieldName, fieldConfigs)
  
  return config?.type === 'number' || 
         ['age', 'patient_number', 'phone', 'id'].includes(fieldName)
} 

/**
 * Get available operators based on field type
 * @param {string} fieldType - Field type (text, number, date, select, email, tel)
 * @returns {Array} Array of available operators for the field type
 */
export function getOperatorsByFieldType(fieldType) {
  // Custom operator sets for each type
  const operatorGroups = {
    text: [
      { title: 'Mengandung (~)', value: 'like' },
    ],
    email: [
      { title: 'Mengandung (~)', value: 'like' },
    ],
    tel: [
      { title: 'Mengandung (~)', value: 'like' },
    ],
    number: [
      { title: 'Sama dengan (=)', value: 'equal' },
    ],
    integer: [
      { title: 'Sama dengan (=)', value: 'equal' },
    ],
    decimal: [
      { title: 'Sama dengan (=)', value: 'equal' },
    ],
    select: [
      { title: 'Sama dengan (=)', value: 'equal' },
    ],
    date: [
      { title: 'Antara (range)', value: 'date_range' },
    ],
  }


  // Return operators for the specified field type, fallback to text if not found
  return operatorGroups[fieldType] || operatorGroups.text
} 
