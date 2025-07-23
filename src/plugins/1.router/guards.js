
export const setupGuards = router => {
  // 👉 router.beforeEach
  // Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
  router.beforeEach(to => {
    // Jika route public, lanjutkan
    if (to.meta.public) return

    // Cek hanya pakai accessToken
    const hasToken = !!useCookie('accessToken').value

    // Jika tidak punya token dan bukan di halaman login, redirect ke login
    if (!hasToken && to.name !== 'login') {
      return {
        name: 'login',
        query: {
          ...to.query,
          to: to.fullPath !== '/' ? to.path : undefined,
        },
      }
    }

    // Jika sudah punya token dan mau ke login, redirect ke dashboard
    if (hasToken && to.name === 'login') {
      return { name: 'dashboards-analytics' }
    }

    // Selain itu, lanjutkan
    return
  })
}
