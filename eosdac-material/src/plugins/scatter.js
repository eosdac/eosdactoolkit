// import something here
let scatter = null

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$scatter = scatter
}

export { scatter }
