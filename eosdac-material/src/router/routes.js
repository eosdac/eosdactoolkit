
export default [
  {
    // path: '/:lang',
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', redirect: '/wallet' },
      { path: 'wallet', component: () => import('pages/wallet') },
      { path: 'settings', component: () => import('pages/settings') },
      { path: 'dashboard', component: () => import('pages/dashboard') },
      { path: 'workerproposals', component: () => import('pages/workerproposals') },
      { path: 'votecustodians', component: () => import('pages/votecustodians') },
      { path: 'profile', component: () => import('pages/profile') },
      { path: 'constitution', component: () => import('pages/constitution') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
