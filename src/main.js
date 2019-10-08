import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Element from 'element-ui'
import '@/styles/index.scss' // global css
import 'vue-croppa/dist/vue-croppa.css'
require('vue-video-player/src/custom-theme.css')
// 自定义主题
import './styles/element-variables.scss';
import './styles/dark-theme.scss';
import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control

import Echarts from "echarts";
window.echarts = Echarts;

import Croppa from 'vue-croppa'
import VideoPlayer from 'vue-video-player'
import Catalog from '@/common/component/Catalog'
import Permission from '@/common/component/Permission'

import AudioButton from '@/common/component/AudioButton'
import CommunitiesSelect from '@/common/component/CommunitiesSelect'
import CarLibrarySelect from '@/common/component/CarLibrarySelect'
import CameraVideo from '@/common/component/CameraVideo'
import CirqueChart from '@/common/component/Charts/CirqueChart'
import DictSelect from '@/common/component/DictSelect'
import DeviceSelect from '@/common/component/DeviceSelect'
import DrawMapArea from '@/common/component/DrawMapArea'
import DatePicker from '@/common/component/DatePicker'
import DeviceState from '@/common/component/DeviceState'
import FaceCategoryList from '@/common/component/FaceCategoryList'
import FaceLibrarySelect from '@/common/component/FaceLibrarySelect'
import ImgShow from '@/common/component/ImgShow'
import IdentityImage from '@/common/component/IdentityImage'
import MapLocation from '@/common/component/MapLocation'
import MapRegionDraw from '@/common/component/MapRegionDraw'
import ModuleTabs from '@/common/component/ModuleTabs'
import MsgSelect from '@/common/component/msgSelect'
import PictureViewer from '@/common/component/PictureViewer'
import PictureList from '@/common/component/PictureList'
import PictureLayer from '@/common/component/PictureLayer'
import PictureSearch2 from '@/common/component/PictureSearch2'
import RaceSelect from '@/common/component/RaceSelect'
import SuspensionMenu from '@/common/component/SuspensionMenu'
import VideoButton from '@/common/component/VideoButton'
import VideoPlay from '@/common/component/VideoPlay'
import CityPicker from '@/common/component/CityPicker'
import ParkingLotSelect from '@/common/component/ParkingLotSelect'
import CascaderSelect from '@/common/component/CascaderSelect'
import PersonSelect from '@/common/component/PersonSelect'
import noImage from '@/common/component/NoImage'
import MultipleChoiceTag from '@/common/component/MultipleChoiceTag'

Vue.component('audio-button', AudioButton);
Vue.component('car-library-select', CarLibrarySelect);
Vue.component('cirque-chart', CirqueChart);
Vue.component('camera-video',CameraVideo);
Vue.component('communities-select', CommunitiesSelect);
Vue.component('dict-select', DictSelect);
Vue.component('device-select', DeviceSelect);
Vue.component('draw-map-area', DrawMapArea);
Vue.component('device-state',DeviceState);
Vue.component('date-picker', DatePicker)
Vue.component('face-category-list', FaceCategoryList);
Vue.component('face-library-select', FaceLibrarySelect);
Vue.component('img-show', ImgShow);
Vue.component('identity-image', IdentityImage);
Vue.component('module-tabs', ModuleTabs);
Vue.component('map-location', MapLocation);
Vue.component('map-region-draw', MapRegionDraw);
Vue.component('msg-select', MsgSelect);
Vue.component('picture-list', PictureList);
Vue.component('picture-layer', PictureLayer);
Vue.component('picture-viewer', PictureViewer);
Vue.component('picture-search2', PictureSearch2);
Vue.component('race-select', RaceSelect);
Vue.component('suspension-menu', SuspensionMenu);
Vue.component('video-play',VideoPlay);
Vue.component('video-button', VideoButton);
Vue.component('city-picker', CityPicker);
Vue.component('parkingLot-select', ParkingLotSelect);
Vue.component('cascader-select', CascaderSelect);
Vue.component('person-select', PersonSelect);
Vue.component('no-image', noImage);
Vue.component('multiple-choice-tag', MultipleChoiceTag);


Vue.use(VideoPlayer);
Vue.use(Croppa);
Vue.use(Catalog);
Vue.use(Permission);
Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// 配置全局过滤器
import * as filters from './filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false;

// 自定义localstorage
import AiStore from '@/utils/store';
Vue['AiStore'] = AiStore;
Vue.prototype['AiStore'] = AiStore;

// 全局参数
import moment from "moment";
import 'moment/locale/zh-cn';
import { colorBrightness } from "@/utils";
Vue.prototype.colorBrightness = colorBrightness;
Vue.prototype.moment = moment;
Vue.prototype.$iconConfig = {icon: L.icon({iconUrl: require('@/assets/location.png'), iconSize: [42, 42], iconAnchor: [21, 42]})};

new Vue({
  el: "#app",
  router,
  store,
  i18n,
  template: "<App/>",
  components: { App }
})