<template>
  <div class="app-container">
    <dictionaries-preLoad></dictionaries-preLoad>
    <div class="header">
      <div class="header-left">
        <div class="prepose"></div>
        <div>
          <img class="companyName" src="@/assets/homepage/font-logo.png" alt="">
          <div class="platformName">智慧社区管控平台</div>
        </div>
        <div class="place">
          <img src="@/assets/homepage/location.png" alt="">
          <div class="placeName">厦门市</div>
        </div>
      </div>
      <div class="header-right">
        <img class="avatarClass" src="@/assets/homepage/avatar.png" alt="">
        <div class="info">
          <div class="name">{{ userInfo.loginName }}</div>
          <div class="role">{{ userInfo.name }}</div>
        </div>
        <div>
          <el-dropdown trigger="click" @command="handleCommand" >
            <span class="el-dropdown-link">
              <img class="menuClass" src="@/assets/homepage/menu.png" alt="">
            </span>
            <el-dropdown-menu slot="dropdown" class="homepage-dropdown">
              <el-dropdown-item command="logout">安全退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="box3d-contain" v-for="(item, index) of menu" :key="item.id">
        <div class="box3d-first" @click="menuClick(item, item.code)" :style="setStyle(index + 1)">
          <div class="inner-container">
            <img class="imgClass" :src="getImage(item.code)">
            <div class="platformCNname">{{item.name}}</div>
            <div class="platformENname">{{baseData[item.code].ENname}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-left"><span class="pre-color">智慧云</span>（厦门）物联网科技有限公司</div>
      <div class="footer-right">©️ AITENSOR ALL RIGHTS RESERVED</div>
    </div>

    <div class="extend">
      <strong>人口预警</strong>
      <div class="inner">
        <div v-for="(item, index) of timeList" :key="index">
          <span>{{item.day}}天未出现</span>
          <!-- <a @click="$router.push({ path: '/dataCenter/application/jurisdictionPerson', query: { index: index } })">{{item.num}}人</a> -->
          <a @click="routerSkip(index)">{{item.num}}人</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCountByDays } from '@/api/jurisdictionPerson'
export default {
  name: "homepage",
  data() {
    return {
      timeList: [],
      baseData: {
        aMarkSix: { ENname: 'REAL DATA', image: 'realData' },
        dataCenter: { ENname: 'ACTUAL COMBAT CENTER', image: 'actualCombatCenter' },
        viewCenter: { ENname: 'DATA CENTER', image: 'dataCenter' },
        bigDataView: { ENname: 'INTEGRATED WINDOW', image: 'integratedCenter' },
        alarmCenter: { ENname: 'POLICE SENTIMENT', image: 'policeSentiment' },
        sysConfig: { ENname: 'SYSTEM SETTINGS', image: 'systemSettings' },
      },
      oddHeight: [180, 184, 196],
      evenHeight: [180, 190, 210]
    };
  },
  computed: {
    ...mapGetters(["userInfo", 'permissionMenus']),
    menu() {
      return this.permissionMenus.slice(1)
    }
  },
  methods: {
    getImage(code) {
      return require('@/assets/homepage/' + this.baseData[code].image + '.png')
    },
    setStyle(index) {
      let length = this.permissionMenus.length
      let center = length / 2
      let rotate = center - index > 0 ? Math.round(center - index) * 5 : Math.floor(center - index) * 5
      // length % 2 为奇数时使用oddHeight 偶数使用evenHeight  因length为数组长度+1  所以奇数在前 
      let height = length % 2 == 0 ? this.oddHeight[Math.round(Math.abs(center - index))] : this.evenHeight[Math.round(Math.abs(center - index)) - 1]
      return { transform: `rotatey(${rotate}deg)`, height: `${height}px`}
    },
    routerSkip(index) {
      window.open(`#/dataCenter/application/jurisdictionPerson?index=${index}`, 'actualCombatCenter')
    },
    handleCommand(command) {
      if (command === 'logout') {
        this.$store.dispatch('logOut').finally(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }
    },
    menuClick(data, name) {
      let obj = null
      let func = (data) => {
        if (data.children.length) {
          func(data.children[0])
        } else {
          obj = data
        }
      }
      func(data)
      window.open(`#${obj.path}`, name)
    },
  },
  mounted() {
    window.name = 'home'
    getCountByDays({ policeAreaCode: this.userInfo.policeAreaCode }).then(res => {
      this.timeList = res.data
    })
  },
  components: {
    dictionariesPreLoad: () => import("@/common/component/DictionariesPreLoad"),
  },
  // destroyed() {
  //   window.name = null
  // }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/modules/homepage.scss";
</style>

