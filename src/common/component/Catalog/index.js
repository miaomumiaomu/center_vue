import Catalog from './src/index';
import CatalogPane from './src/pane';

export default {
  install(Vue) {
    Vue.component(Catalog.name, Catalog);
    Vue.component(CatalogPane.name, CatalogPane);
  }
}