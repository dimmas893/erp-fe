import { $api } from '@/utils/api'
import { showErrorAlert } from '@/utils/errorHandler'
import { ref } from 'vue'

export function useBranchEdit(branchId) {
  const branch = ref(null)
  const loading = ref(false)

  const fetchBranch = async () => {
    loading.value = true
    
    try {
      const res = await $api(`/wms/branches/${branchId}`, {
        method: 'GET',
      })
      
      if (res && res.response_code === 200 && res.data) {
        branch.value = res.data
      } else {
        branch.value = null
      }
    } catch (error) {
      await showErrorAlert(error, {
        title: 'Gagal Memuat Data Cabang',
        text: 'Tidak dapat memuat data cabang. Silakan coba lagi.',
      })
      branch.value = null
    } finally {
      loading.value = false
    }
  }

  const updateBranch = async (branchData) => {
    const res = await $api(`/wms/branches/${branchId}`, {
      method: 'PATCH',
      body: branchData,
    })
    
    if (!res || res.response_code !== 200) {
      throw new Error('Failed to update branch')
    }
    
    return res
  }

  return {
    branch,
    loading,
    fetchBranch,
    updateBranch
  }
} 
 