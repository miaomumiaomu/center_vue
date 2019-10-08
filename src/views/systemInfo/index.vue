<template>
  <div class="app-container">
    <div class="wrapper">
      <div class="img-wrap">
        <img src="/static/encrype/system-logo.png" alt="">
      </div>
      <div>
        <h3>卫兵系列</h3>
        <h2>公安多维融合管控平台</h2>
        <ul>
          <li>
            <label>版本</label>:
            <span>{{version}}</span>
          </li>
          <li>
            <label>序列号</label>:
            <span>{{systemInfo.serial}}</span>
          </li>
          <li>
            <label>授权时间</label>:
            <span>{{systemInfo.activateDate}} 至 {{systemInfo.activateExpireDate}}</span>
          </li>
          <li>
            <label>系统状态</label>:
            <span :style="{color: '#BC523C'}">{{getStatus}}</span>
          </li>
        </ul>
        <p class="tips">请点击<a href="javascript:;" @click="handleActive"><svg-icon class-name="active-icon" icon-class="active"/>激活</a>按钮，并按照步骤进行激活</p>
      </div>
    </div>
    <!-- 激活对话框 -->
    <active-model :is-open.sync="isFormDialog" />
  </div>
</template>

<script>
import { authStatus } from "@/api/system";
import { getParameterCacheValue } from "@/api/basisConfig/parameterConfig";
import { mapState } from "vuex";
export default {
  name: "systemInfo",
  components: {
    ActiveModel: () => import("./components/ActiveModel"),
  },
  data() {
    return {
      isFormDialog: false,
      version: ''
    };
  },
  created() {
    // 获取版本号
    getParameterCacheValue('Version').then(res => {
      const { data } = res.data;
      this.version = data;
    });
  },
  computed: {
    ...mapState({
      systemInfo: state => state.user.systemInfo
    }),
    getStatus() {
      let result = '';
      const { status } = this.systemInfo;
      switch(status) {
        case 0:
          result = '正常';
          break;
        case 1:
          result = '未激活';
          break;
        case 2:
          result = '授权过期';
          break;
        case 3:
          result = '找不到';
          break;
        case 4:
          result = '授权信息异常';
          break;
        case 5:
          result = '未知错误';
          break;
      }
      return result;
    }
  },
  methods: {
    handleActive() {
      this.isFormDialog = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
  // @media screen and (max-width:1500px){
  //    height: 106%;
  // }
  display: flex;
  justify-content: center;
  align-items: center;
  .wrapper {
    display: flex;
    div.img-wrap {
      width: 180px;
      display: flex;
      align-items: center;
      > img {
        width: 130px;
      }
    }
    h2 {
      font-size: 28px;
    }
    h3 {
      font-size: 20px;
      font-weight: normal;
      margin-bottom: 4px;
    }
    ul {
      padding-top: 16px;
      padding-bottom: 8px;
      li {
        margin-bottom: 10px;
        label {
          width: 78px;
          display: inline-block;
          text-align: justify;
          line-height: 0;
          font-size: 15px;
          font-weight: normal;
        }
        label:after {
          content: '';
          width: 100%;
          display: inline-block;
        }
        span {
          margin-left: 8px;
          font-size: 15px;
        }
      }
      li:last-of-type {
        margin-bottom: 0;
        span {
          font-size: 18px;
          font-weight: bold;
        }
      }
    }
    .tips {
      font-size: 12px;
      color: #BC523C;
      margin-bottom: 2px;
      a {
        color: #1296db;
        .active-icon {
          font-size: 12px;
        }
      }
    }
  }
}
</style>