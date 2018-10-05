import store from '../store'

const Guards = {
  logInCheck (to, from, next) {
    if (!store.getters['account/getAccountName']) {
      next({ path: '' })
    } else {
      next()
    }
  },
  custodianCheck (to, from, next) {
    let roles = store.getters['account/getMemberRoles'];
    if (!roles.custodian) {
      next({ path: '' })
    } else {
      next()
    }
  }
};
export default [
  {
    // path: '/:lang',
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/index-loggedout') },
      { path: 'wallet', component: () => import('pages/wallet'), beforeEnter: Guards.logInCheck },
      { path: 'settings', component: () => import('pages/settings'), beforeEnter: Guards.logInCheck },
      { path: 'dashboard', component: () => import('pages/dashboard'), beforeEnter: Guards.logInCheck },
      { path: 'workerproposals', component: () => import('pages/workerproposals'), beforeEnter: Guards.logInCheck },
      { path: 'votecustodians', component: () => import('pages/votecustodians'), beforeEnter: Guards.logInCheck },
      { path: 'profile/:accountname', component: () => import('pages/profile'), beforeEnter: Guards.logInCheck },
      { path: 'constitution', component: () => import('pages/constitution'), beforeEnter: Guards.logInCheck },
      { path: 'managecandidateship', component: () => import('pages/registercandidate'), beforeEnter: Guards.logInCheck },
      { path: 'loggedout', component: () => import('pages/index-loggedout'), beforeEnter: Guards.logInCheck },
      { path: 'custodiandashboard', component: () => import('pages/custodian-dashboard'), beforeEnter: Guards.custodianCheck }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
