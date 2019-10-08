<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="headImage" id="headImage">
      <div class="titileImage">
        <img src="~@/assets/face-portrait.png" id="titImg" alt="">
      </div>  
      <div class="search" id="search">
        <el-input placeholder="姓名/证件号" v-model="listQuery.keywords" class="input-with-select" @keyup.enter.native="onSearch" />
        <span class="inCarema">
          <div class="prepend" v-show="image">  
            <img :src="image">
            <div class="close" @click="onEmpty">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <el-upload class="upload" action="" accept=".jpeg,.jpg,.png,.bmp" :auto-upload="false" :show-file-list="false" :on-change="onUpload">
            <i class="el-icon-picture"></i>
          </el-upload>
          <el-button icon="el-icon-search" type="primary" class="serBtn" @click="onSearch">查询</el-button>
        </span>
      </div>
    </div>

    <!-- 表格模式 S -->
    <div class="card-bottom">
      <div class="flex" v-if="flag">
        <div class="searchRes">
          <template v-if="!image">
            <el-button v-for="(item, index) in typeList" :key="index"
            :class="{ focusOn: selectType === item.type }" @click="selectType = item.type">
              <span style="padding-right: 3px">{{ item.name }}</span>
              <span>{{ item.value }}</span>
            </el-button>
          </template>

          <el-button v-else class="focusOn">
            <span style="padding-right: 3px">人员</span>
            <span>{{ person.length }}</span>
          </el-button>
        </div>
        <div class="searchInfo">点击查看详情</div>
      </div>
      <div class="card-list">
        <Person :list="person" v-if="selectType === 'person'"></Person>
        <House :list="house" v-if="selectType === 'house'"></House>
        <Company :list="company" v-if="selectType === 'company'"></Company>
        <Car :list="car" v-if="selectType === 'car'"></Car>
      </div>
    </div>
  </div>
</template>
<script>
import { getAllList } from "@/api/facePortrait";
import { postImageSearch } from "@/api/common";
import { mapState } from "vuex";

export default {
  components: {
    Person: () => import("./person"),
    House: () => import("./house"),
    Company: () => import("./company"),
    Car: () => import("./car"),
  },
  data: () => ({
    listQuery: {
      keywords: "", //关键字
      doHighlighter: false,
      top: 40,
    },
    imgListQuery: {
      keyword: "", //关键字
      imgBase64: '', // 图片BASE64
      // threshold: 0.6, //阀值
      top: 40,  //搜索结果条数
    },
    image: '',
    flag: false,

    selectType: 'person',
    typeList: [
      {name: '人员', value: 0, type: 'person'},
      {name: '房屋', value: 0, type: 'house'},
      {name: '单位', value: 0, type: 'company'},
      {name: '车辆', value: 0, type: 'car'},
    ],
    person: [],
    house: [],
    company: [],
    car: []
  }),
  watch: {
  },
  computed: {
    ...mapState({
      faceLibraryData: state => state.commonData.faceLibraryData
    })
  },
  created() {
    this.$store.dispatch("commonData/getFaceLibraryData");
  },
  methods: {
    //查询
    onSearch() {
      this.flag = true
      if (!this.image) {
        getAllList(this.listQuery).then(res => {
          let count = res.data.searchCountMap
          let data = res.data.indexContentMap
          this.typeList.forEach(item => {
            item.value = 0
            if (count[item.type]) {
              item.value = count[item.type]
            }
          })
          for(let key in data) {
            data[key].forEach(item => {
              Object.assign(item, JSON.parse(item.data))
            })
          }
          this.person = data.person ? data.person : []
          this.house = data.house ? data.house : []
          this.company = data.company ? data.company : []
          this.car = data.car ? data.car : []
        })
      } else {
        this.imgListQuery.keyword = this.listQuery.keywords
        postImageSearch({ ...this.imgListQuery, imgBase64: this.image.split(',')[1] }).then(res => {
          let isSuccess = res.status === 200;
          // 错误处理
          if (!isSuccess) {
            this.$notify({ title: "失败",message: res.message, type: "error", duration: 2000 })
            return
          }
          // 成功处理
          if (res.data.data.length < 1) {
            this.$notify({ title: "提示", message: "抱歉，没能找到匹配的人员", type: "warning", duration: 2000 })
          }
          this.person = res.data.data
        })
      }
    },

    onUpload(file) {
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.addEventListener("load", () => {
        this.image = reader.result;
      });
    },
    onEmpty() {
      this.image = "";
    },

  }
};
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  .headImage {
    margin-top: 95px;
    transition: all .5s linear;
    .titileImage {
      text-align: center;
      margin-bottom: 30px;
      #titImg {
        width: 267px;
        height: 58px;
        transition: all .5s linear;
      }
    }
    .search {
      margin: 0 auto;
      width: 58%;
      display: flex;
      position: relative;
      transition: all .5s linear;
      .serchCheckBox {
        line-height: 35px;
        margin-left: 10px;
      }
    }
  }

  .card-bottom{
    flex: 1;
    display: flex;
    flex-direction: column;
    .flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 58%;
      margin: 10px auto;
      .searchRes {
        color: #666;
        font-size: 18px;
        .el-button {
          background: rgba(32, 44, 64, 1);
          border: 1px solid rgba(53, 66, 94, 1);
          border-color: rgba(53, 66, 94, 1);
          color: rgba(107, 133, 166, 1);
          margin-right: 12px;
        }
        .el-button:hover, .el-button:focus {
          color: rgba(226, 233, 238, 1);
          border-color: rgba(4, 101, 193, 0.3);
          background-color: rgba(44, 95, 198, 0.3);
        }
        .el-button--medium {
          padding: 8px 12px;
          font-size: 13px;
          border-radius: 0px;
        }
        .el-button + .el-button {
          margin-left: 0px;
        }
        .focusOn {
          color: #E2E9EE;
          border:1px solid rgba(4,101,193,0.3);
          background:rgba(44,95,198,0.3);
        }
      }
      .searchInfo {
        color: #999;
        font-size: 14px;
      }
    }
  }
  .card-list {
    flex: 1;
    padding-bottom: 10px;
    overflow: auto;
    margin: 0 auto;
    width: 58%;
    .item {
      float: left;
      margin: 10px 0 0 16px;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      border: 1px solid transparent;
    }
  }
  .inCarema {
    position: relative;
    z-index: 100;
    .upload{
      position: absolute;
      right: 110%;
      top: 27%
    }
  }
  .serBtn {
    margin-left: 5px;
  }
  .prepend,
  .append {
    position: absolute;
    top: 10%;
    z-index: 9;
  }
  .append {
    right: 6px;
    cursor: pointer;
    i {
      display: inline-block;
      vertical-align: top;
      color: #878c8f;
    }
  }
  .prepend {
    right: 140%;
    background: #fafbfd;
    overflow: hidden;
    border: 1px solid #e1e4e6;
    img {
      float: left;
      width: 1.7em;
      height: 1.7em;
    }
    .close {
      height: 1em;
      margin-left: 1.7em;
      cursor: pointer;
      i {
        position: relative;
        top: 50%;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        color: #878c8f;
        transform: translateY(-50%);
      }
    }
  }
}
</style>