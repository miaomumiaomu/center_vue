<template>
  <div class="app-container">
    <catalog v-model="catalogName" width="243px" height="100%">
      <div class="catalog-menu-pre" slot="catalog-menu-pre">
        <img src="@/assets/no-image.png" alt="">
        <div>
          <span>李姗姗</span>
        </div>
        <p>350312199209212212</p>
      </div>
      <catalog-pane label="基础信息" name="basics">
        <div class="heading"><span></span>基础信息</div>
        <div class="inner-content">
          <el-row :gutter="40">
            <el-col :span="8"> <span>姓ㅤㅤ名:</span> <p>王小明</p> </el-col>
            <el-col :span="8"> <span>性ㅤㅤ别:</span> <p>男</p> </el-col>
            <el-col :span="8"> <span>民ㅤㅤ族:</span> <p>汉</p> </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="8"> <span>证件类型:</span> <p>王小明</p> </el-col>
            <el-col :span="8"> <span>证件号码:</span> <p>男</p> </el-col>
            <el-col :span="8"> <span>出生日期:</span> <p>汉</p> </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="8"> <span>籍ㅤㅤ贯:</span> <p>王小明</p> </el-col>
            <el-col :span="8"> <span>手机号码:</span> <p>男</p> </el-col>
            <el-col :span="8"> <span>联系电话:</span> <p>汉</p> </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="8"> <span>管理类别:</span> <p>王小明</p> </el-col>
            <el-col :span="8"> <span>分离标识:</span> <p>男</p> </el-col>
            <el-col :span="8"> <span>人员标签:</span> <p>汉</p> </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="8"> <span>证件地址:</span> <p>福建省厦门市思明区望海路43号202汤说人工只能</p> </el-col>
            <el-col :span="8"> <span>实际地址:</span> <p>福建省厦门市思明区望海路43号202汤说</p> </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="8"> <span>人像照片:</span>
            <div class="img-class">
              <img src="@/assets/no-image.png" alt="">
              <img src="@/assets/no-image.png" alt="">
              <img src="@/assets/no-image.png" alt="">
              <img src="@/assets/no-image.png" alt="">
              <img src="@/assets/no-image.png" alt="">
            </div>
            </el-col>
            <el-col :span="8"> <span>备ㅤㅤ注:</span> <p>男</p> </el-col>
          </el-row>
        </div>
      </catalog-pane>
      <catalog-pane label="活动轨迹" name="track">
        <div class="heading"><span></span>活动轨迹</div>
        <div class="inner-content"></div>
      </catalog-pane>
      <catalog-pane label="同行人员" name="follow">
        <div class="heading"><span></span>同行人员</div>
        <div class="inner-content"></div>
      </catalog-pane>
      <catalog-pane label="居住信息" name="living">
        <div class="heading"><span></span>居住信息</div>
        <div class="inner-header">
          <span class="totol-count">共20条数据</span>
          <span class="history">查看历史居住信息</span>
        </div>
        <div class="inner-content">
          <HouseCard :list="list"></HouseCard>
        </div>
      </catalog-pane>
      <catalog-pane label="单位信息" name="company">
        <div class="heading"><span></span>单位信息</div>
        <div class="inner-header">
          <span class="totol-count">共20条数据</span>
          <span class="history">查看历史居住信息</span>
        </div>
        <div class="inner-content">
          <CompanyCard :list="list"></CompanyCard>
        </div>
      </catalog-pane>
      <catalog-pane label="车辆信息" name="car">
        aaaa
      </catalog-pane>
    </catalog>
  </div>
</template>

<script>
export default {
  components: {
    HouseCard: () => import("./house-card"),
    CompanyCard: () => import("./company-card"),
  },
  computed: {
  },
  data() {
    return {
      catalogName: 'basics',
      list: [
        {name: '测试', fullName: '福建厦门市思明区软件园二期望海路43号楼', personType: '业主', time: '2018-12-12', manageLevel: 1, supervisoryLevel: 1},
        {name: '测试', fullName: '福建厦门市思明区软件园二期望海路43号楼', personType: '业主', time: '2018-12-12', manageLevel: 2, supervisoryLevel: 2},
        {name: '测试', fullName: '福建厦门市思明区软件园二期望海路43号楼', personType: '业主', time: '2018-12-12', manageLevel: 3, supervisoryLevel: 3},
      ]
    }
  },
  methods: {
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
  .catalog-menu-pre {
    display: inline-block;
    width:207px;
    height:271px;
    background:rgba(25,37,61,1);
    border-radius:2px;
    border:1px solid rgba(59,76,110,1);
    margin-bottom: 30px;
    padding-top: 17px;
    padding-left: 29px;
    img {
      width: 149px;
      height: 181px;
      margin-bottom: 6px;
    }
    span {
      font-size:22px;
      color:rgba(205,211,224,1);
      line-height:30px;
    }
    p {
      font-size:15px;
      color:rgba(226,233,238,0.733);
      line-height:21px;
    }
  }

  .heading {
    position: relative;
    color:rgba(139,167,207,1);
    font-size: 16px;
    font-weight: bold;
    span {
      border-left: 4px solid #10A0FF;
      margin-right: 7px;
    }
    &:before {
      position: absolute;
      left: 100px;
      right: 0px;
      top: 9px;
      background: #eff1f4;
      height: 1px;
      content: "";
    }
  }

  .inner-header {
    display: flex;
    justify-content: space-between;
    padding-top: 5px;
    padding-left: 12px;
    .totol-count {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255,255,255,0.85);
      line-height: 20px;
    }
    .history {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255,255,255,0.45);
      line-height: 20px;
    }
  }
  .inner-content {
    padding-left: 12px;
    padding-top: 20px;
    padding-bottom: 60px;
    color: #8BA7CF;
    font-size:16px;
    .el-row {
      margin-bottom: 15px;
      .el-col {
        display: flex;
      }
    }
    span {
      margin-right: 20px;
      width: 70px;
    }
    p {
      display: inline-block;
      width: 290px;
    }
    .img-class {
      width: 318px;
      img {
        width: 60px;
        height: 60px;
      }
    }
  }

  /deep/ .catalog-content {
    border-left: 4px solid #14192A !important;
    padding: 50px 60px 60px 50px;
  }
}
</style>
