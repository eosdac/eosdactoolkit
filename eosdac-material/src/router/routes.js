import store from '../store'

function logInCheck (to, from, next) {
  if (!store.getters['account/getAccountName']) {
    next({ path: '' })
  } else {
    next()
  }
}
export default [
  {
    // path: '/:lang',
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/index-loggedout') },
      { path: 'wallet', component: () => import('pages/wallet'), beforeEnter: logInCheck },
      { path: 'settings', component: () => import('pages/settings'), beforeEnter: logInCheck },
      { path: 'dashboard', component: () => import('pages/dashboard'), beforeEnter: logInCheck },
      { path: 'workerproposals', component: () => import('pages/workerproposals'), beforeEnter: logInCheck },
      { path: 'votecustodians', component: () => import('pages/votecustodians'), beforeEnter: logInCheck },
      { path: 'profile/:accountname', component: () => import('pages/profile'), beforeEnter: logInCheck },
      { path: 'constitution', component: () => import('pages/constitution'), beforeEnter: logInCheck },
      { path: 'managecandidateship', component: () => import('pages/registercandidate'), beforeEnter: logInCheck },
      { path: 'loggedout', component: () => import('pages/index-loggedout'), beforeEnter: logInCheck }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
