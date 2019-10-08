<template>
  <div class="faceAdress">
    <el-dialog title="居住信息" :visible.sync="dialogVisible" width="1000px">
      <!-- 表格模式 S -->
      <el-table ref="listTabel" :data="houseData" height="calc(70vh - 255px)" v-loading.body="listTableLoading" width="100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="swiper-box">
              <swiper class="swiper" ref="swiper" :options="swiperOption">
                <swiper-slide v-for="(item,index) in scope.row.otherPersons" :key="index">
                  <div class="lib">
                    <div>{{item.userType | commonFilter('label_type')}}</div>
                  </div>
                  <img-show class="pic" width="90px" height="90px" txt="暂无头像" :img-src="item.identityImgPath">
                    <div class="mask" v-if="item.name">{{item.name}}</div>
                  </img-show>
                </swiper-slide>
              </swiper>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="序号" align="left" type="index" width="60" />
        <el-table-column label="所属小区" align="center" prop="communityName" />
        <el-table-column prop="houseFullName" label="房屋名称" align="center" />
        <el-table-column width="180" prop="houseArea" align="center" label="房屋信息(m^2)" />
        <el-table-column width="180" prop="usertype" align="center" label="身份" >
          <template slot-scope="scope"> 
            <div>{{scope.row.userType | commonFilter('label_type')}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button size="mini" @click="dialogVisible = false">关闭</el-button>
      </div>
      <!-- 页码 -->
      <!-- <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page.sync="listQuery.pageNo" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" /> -->
    </el-dialog>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  name: 'faceAdress',
  components: {
    swiper,
    swiperSlide,
  },
  props: {
    houseData: Array,
  },
  data() {
    return {
      //数据加载状态
      listTableLoading: false,
      dialogVisible: false,
      listQuery: {
      pageNo: 1, //页码
      pageSize: 15, //页数
      },
      listTableData: {
        total: 3,
      },
      swiperOption: {
        slidesPerView: "auto",
        spaceBetween: 5,
        freeMode: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      },
    };
  },
  methods: {
    open() {
      this.dialogVisible = true
    }
  }
};
</script>
<style lang="scss" scoped>
  .faceAdress {
    margin-top: 20px;
    border-bottom: 1px solid #ddd;
    background: #E9F0F4;
    .title{
      &::before{
        position: absolute;
        top: 66%;
        left: 17px;
        background: #0fa0ff;
        width: 4px;
        height: 19px;
        margin-top: -8px;
        content: "";
      }
      position: relative;
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 20px;
      padding-left: 27px;
      padding-top: 11px;
    }
  }
  .el-table{
    background: #E9F0F4;
    height: 100%;
  }
  .bg {
    background: #E9F0F4;
  }
  .swiper-box {
    position: relative;
    // padding: 10px 30px;
    border-radius: 8px;
    .swiper-button-next,
    .swiper-button-prev {
      background-size: 12px 20px;
      width: 12px;
      height: 20px;
      margin-top: -10px;
    }
    .swiper-pagination {
      bottom: 0;
      line-height: 10px;
    }
    .w0 {
      width: 0 !important;
      background: #000 !important;
    }
    .swiper-slide {
      float: left;
      width: auto;
    }
  }
  .lib {
    position: absolute;
    padding: 4px 0px 0 6px;
    width: 50px;
    height: 27px;
    color: #fff;
    font-size: 14px;
    background: linear-gradient(-63deg, transparent 15px, #10A0FF 0);
    text-align: left;
    z-index: 99;
  }
  .pic {
    position: relative;
    display: block;
    width: 220px;
    height: 198px;
    overflow: hidden;
  }
  .mask {
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    line-height: 18px;
    padding: 0 4px;
    font-size: 12px;
    color: #fff;
    bottom: 0;
    width: 100%;
    font-size: 14px;
    height: 18px;
  }
</style>