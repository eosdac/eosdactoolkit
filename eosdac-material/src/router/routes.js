
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', redirect: '/wallet' },
      { path: 'wallet', component: () => import('pages/wallet') },
      { path: 'settings', component: () => import('pages/settings') },
      { path: 'test', component: () => import('pages/test') },
      { path: 'dashboard', component: () => import('pages/dashboard') },
      { path: 'custodians', component: () => import('pages/custodians') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
