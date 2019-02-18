import store from '../store'

const Guards = {
  logInCheck (to, from, next) {
    if (!store.getters['account/getAccountName']) {
      if(!store.getters['account/getImported']) alert('Please login.');
      next({ path: '' })
    } else {
      next()
    }
  },
  custodianCheck (to, from, next) {
    let roles = store.getters['account/getMemberRoles'];
    if (!roles.custodian) {
      next({path: ''})
    } else {
      next();
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
      { path: 'wallet', component: () => import('pages/wallet'), beforeEnter: Guards.logInCheck},
      { path: 'settings', component: () => import('pages/settings'), beforeEnter: Guards.logInCheck },
      { path: 'credits', component: () => import('pages/credits')},
      { path: 'dashboard', component: () => import('pages/dashboard'), beforeEnter: Guards.logInCheck },
      { path: 'workerproposals', component: () => import('pages/workerproposals'), beforeEnter: Guards.logInCheck },
      { path: 'votecustodians', component: () => import('pages/votecustodians') },
      { path: 'profile/:accountname', component: () => import('pages/profile') },
      { path: 'constitution', component: () => import('pages/constitution') },
      { path: 'managecandidateship', component: () => import('pages/registercandidate'), beforeEnter: Guards.logInCheck },
      { path: 'loggedout', component: () => import('pages/index-loggedout')},
      { path: 'custodiandashboard', component: () => import('pages/custodian-dashboard'), beforeEnter: Guards.custodianCheck },
      { path: 'msigproposals', component: () => import('pages/custodians/msigproposals'), beforeEnter: Guards.custodianCheck },
      { path: 'claimpay', component: () => import('pages/custodians/claimpay'), beforeEnter: Guards.custodianCheck },
      { path: 'notallowed', component: () => import('pages/notallowed')},
      { path: 'verify/:token', component: () => import('pages/verify_token')}
    ]
  },
//   {path: '/custodians',
//   component: () => import('layouts/default'),
//   children: [
//     { path: 'proposals', component: () => import('pages/custodians/proposals'), beforeEnter: Guards.custodianCheck },

//   ]
// },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
