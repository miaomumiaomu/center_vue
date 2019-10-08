<template>
  <div class="face-track-analysis">
    <!-- 表单筛选 -->
    <div class="form">
      <div class="title">落脚点分析</div>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="isPictureDialog=true">选择分析对象</el-button>
    </div>

    <!-- 地图 -->
    <div class="main">
      <div ref="map" class="map"></div>

      <div class="map-form" v-if="currentUser">
        <div class="current-user">
          <img-show class="pic" width="48px" height="48px" text="暂无头像" :img-src="currentUser.identityImgPath" />
          <div class="name">
            {{currentUser.name}}
            <face-category-list :data="faceLibraryData" :type="0" :chosen="currentUser.personTags?currentUser.personTags.split(','):[]" />
          </div>
          <div class="identity">{{currentUser.identityNo}}</div>
        </div>
        <el-form size="mini" :model="listQuery" label-width="36px">
          <el-form-item label="时间" prop="beginTime">
            <el-date-picker v-model="listQuery.beginTime" value-format="yyyyMMdd" type="date" placeholder="请选择开始时间" :picker-options="pickerOptions()" :clearable="false" />
          </el-form-item>
          <el-form-item label="至" prop="endTime">
            <el-date-picker v-model="listQuery.endTime" value-format="yyyyMMdd" type="date" placeholder="请选择结束时间" :picker-options="pickerOptions()" :clearable="false" />
          </el-form-item>
          <el-button type="success" @click="onSubmit">深度分析</el-button>
        </el-form>
      </div>
    </div>

    <!-- 地图弹窗 -->
    <div class="map-layer" ref="mapLayer">
      <template v-if="detailsData">
        <div class="title">落脚点分析</div>
        <div class="address">地点名称：{{detailsData.addr}}</div>
        <div class="pie-box">
          <pie-chart width="100%" height="200px" :data="detailsData.pieChart" :key="markerId" />
          <div class="txt">抓拍时间分布</div>
        </div>
        <div class="line-box">
          <line-chart width="100%" height="200px" :data="detailsData.lineChart" :key="markerId" />
          <div class="txt">近七日抓拍次数</div>
        </div>
      </template>
    </div>

    <!-- 以图搜图 - 弹窗 -->
    <picture-layer :is-open.sync="isPictureDialog" @complete="personnelConfirm" />
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getFootholdList, getFootholdDetails } from "@/api/foothold";
import { createMap } from "@/utils/";
import { getPersonInfo } from "@/api/faceUser/faceInfo";

export default {
  name: "foothold",
  components: {
    PieChart: () => import("./components/PieChart"),
    LineChart: () => import("./components/LineChart")
  },
  data() {
    return {
      currentUser: null,
      listQuery: {
        personIds: null,
        beginTime: this.moment().subtract(1, "M").format("YYYYMMDD"),
        endTime: this.moment().format("YYYYMMDD")
      },
      isPictureDialog: false,
      cMap: null,
      markerId: null,
      detailsData: null,
      markerList: [],
      heatmapData: []
    };
  },
  watch: {
    $route() {
      if (window.location.hash.split("?")[0] === '#/application/foothold' && window.location.hash.split("?")[1]) {
        if(window.location.hash.split("?")[1].split('=')[0] === 'personId') {
          this.$router.push("/_empty");
          this.$router.go(-1);
        }
      }
    },
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData
    }),
    heatmapMax() {
      if (this.heatmapData.length) {
        return Math.max(...this.heatmapData.map(item => item.count));
      } else {
        return 0;
      }
    }
  },
  created() {
    this.JumpQuery()
  },
  mounted() {
    this.initMap();
    this.createHeatmap();
  },
  activated() {
    this.JumpQuery()
  },
  methods: {
    JumpQuery() {
      if (Object.keys(this.$route.query).length > 0) {
        this.personnelConfirmJump(this.$route.query.personId)
      }
      else if(this.$route.params.data){
        this.personnelConfirm(this.$route.params.data);
      }
    },
    initMap() {
      const mapElement = this.$refs.map;
      this.cMap = createMap(mapElement, false);
    },
    pickerOptions() {
      let _this = this;
      let json = {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              picker.$emit("pick", _this.moment().subtract(7, "d")._d);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              picker.$emit("pick", _this.moment().subtract(1, "M")._d);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              picker.$emit("pick", _this.moment().subtract(3, "M")._d);
            }
          }
        ]
      };
      return json;
    },
    createHeatmap() {
      var popupElement = this.$refs.mapLayer;
      this.markerList = [];
      this.heatmapData.forEach(item => {
        let size = 20;
        let radius = size + (item.count / this.heatmapMax) * size;
        let fillOpacity = item.count / this.heatmapMax < 0.6 ? 0.6 : item.count / this.heatmapMax;
        let circle = L.circle([item.lat, item.lng], { color: "red", stroke: false, fillColor: "#f03", fillOpacity, radius }).addTo(this.cMap);
        // 绑定弹窗
        circle.bindPopup(popupElement, {
          maxWidth: 800,
          offset: L.point(0, -10)
        });
        circle.on("popupopen", () => {
          setTimeout(() => {
            this.onClickMarker(item);
          }, 50);
        });
        this.markerList.push(circle);
      });
      // 监听弹层关闭事件
      this.cMap.on("popupclose", () => {
        this.detailsData = null;
      });
      // 重新定位中心坐标
      if (this.heatmapData.length) {
        let group = L.featureGroup(this.markerList);
        this.cMap.fitBounds(group.getBounds());
      }
    },
    /**
     * 点击展示详情
     */
    onClickMarker(item) {
      this.detailsData = {};
      // 接口调用处理
      const _listQuery = this.formatListQuery();
      const params = { ..._listQuery, communityId: item.communityId };
      getFootholdDetails(params).then(res => {
        if (res.status === 200) {
          this.detailsData = res.data;
          this.detailsData.addr = item.communityName;
          this.detailsData.lineChart = {
            name: "抓拍数",
            time: res.data.sevenDayStatic.map(item => item.day),
            data: res.data.sevenDayStatic.map(item => item.count)
          }
          this.detailsData.pieChart = {
            name: "抓拍数",
            data: res.data.hourStatic
          }
        }
      });
    },
    //人员直接跳转
    personnelConfirmJump(id) {
      this.listQuery.personIds = [id];
      getPersonInfo(id).then( res => {
        const { age, images=[], identityNo, id, name, libraryNums, sex } = res.data
        this.currentUser = { age: age, identityImgPath: images[0].imgPath, identityNo: identityNo, name: name, personId: id, sex: sex }
        this.$nextTick(() => {
          this.onSubmit();
        });
      })
    },

    // 弹窗-->开始分析
    personnelConfirm(arr) {
      this.currentUser = arr[0];
      this.listQuery.personIds = arr.map(item => item.personId);
      this.$nextTick(() => {
        this.onSubmit();
      });
    },
    // 落脚点分析
    onSubmit() {
      // 空数据过滤
      if (!this.listQuery.personIds) {
        this.$notify({
          title: "提示",
          message: "请先选择一个人员",
          type: "warning",
          duration: 2000
        });
        return;
      }
      // 空数据过滤
      if (!this.listQuery.beginTime && !this.listQuery.endTime) {
        this.$notify({
          title: "提示",
          message: "起始时间不能为空",
          type: "warning",
          duration: 2000
        });
        return;
      }
      // 清理地图
      this.cMap.remove();
      this.initMap();
      // 接口调用处理
      getFootholdList(this.formatListQuery()).then(res => {
        if (res.status == 200) {
          this.heatmapData = res.data;
          this.$nextTick(() => {
            this.createHeatmap();
          })
        }
      });
    },
    formatListQuery() {
      let _listQuery = JSON.parse(JSON.stringify(this.listQuery));
      _listQuery.beginTime += '000000';
      _listQuery.endTime += '235959';
      return _listQuery;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/modules/foothold.scss";
</style>