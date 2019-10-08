const getters = {
  cachedViews: state => state.tagsView.cachedViews,
  permissionMenus: state => state.user.permissionMenus,
  userInfo: state => state.user.userInfo,
  token: state => state.user.token,
  elements:state => state.user.elements,
  permissionRouters: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
}
export default getters