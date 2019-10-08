<template>
  <el-dialog :visible.sync="isLabelDialog" width="850px" class="body0" title="同行记录" append-to-body>
    <div class="main">
      <!-- 表单筛选 -->
      <el-form class="common-table-form" ref="listForm" size="mini" :model="listQuery" :inline="true" @keyup.enter.native="onSearch" >
        <!-- <el-form-item prop="_filter_eq_keyword" label="关键字">
          <el-input @keyup.enter.native="onSearch" placeholder="车牌号/姓名" v-model="listQuery._filter_eq_keyword" />
        </el-form-item> -->
        <el-form-item label="时间" prop="_filter_ge_collectTime_date">
          <el-date-picker v-model="listQuery._filter_ge_collectTime_date" value-format="yyyyMMddHHmmss" type="datetime" placeholder="请选择开始时间" :picker-options="singlePickerOptions()" />
        </el-form-item>
        <el-form-item label="" prop="_filter_le_collectTime_date">
          <el-date-picker v-model="listQuery._filter_le_collectTime_date" value-format="yyyyMMddHHmmss" type="datetime" placeholder="请选择结束时间" :picker-options="singlePickerOptions(listQuery._filter_ge_beginTime)" />
        </el-form-item>
        <!-- <el-form-item prop="_filter_eq_libraryNum" label="人脸库"> -->
      <!-- <face-library-select v-model="listQuery._filter_eq_libraryNum" class="nowrap" placeholder="全部" @input="onSearch" /> -->
      <!--  multiple collapse-tags -->
      <!-- </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onResetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格模式 S -->
      <el-table
        ref="listTabel"
        :data="listTableData.rows"
        height="calc(100vh - 355px)"
        v-loading.body="listTableLoading"
        highlight-current-row
      >
        <el-table-column label="序号" align="center" type="index" width="50"/>
        <el-table-column label="同行人员" align="center" min-width="80">
          <template slot-scope="scope">
            <div class="picBox" v-for="item in scope.row.passRecords" :key="item.personId">
              <el-tooltip placement="bottom" effect="light">
                <div>
                  <img-show
                    class="pic"
                    width="48px"
                    height="48px"
                    text="暂无照片"
                    :img-src="item.personId"
                  />
                  <div class="mask">{{item.personName}}</div>
                </div>
                <div slot="content">{{item.personName}}</div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" prop="togetherCount" label="同行人数"/>
        <el-table-column align="center" label="抓拍设备">
          <template slot-scope="scope">
            <camera-video :mode="0" :deviceCode="scope.row.deviceCode" :deviceName="scope.row.deviceName" :onLine="scope.row.onLine" :chanDpid="scope.row.chanDpid" />
          </template>
        </el-table-column>
        <el-table-column prop="collectTime" width="150" align="center" label="最后抓拍时间"/>
        <el-table-column fixed="right" width="130" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="onDetails(scope.row.passRecords,scope.row.isReqVideo)"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格模式 E -->
       <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page.sync="listQuery.pageNo" :page-sizes="[15,30,50]" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />
    </div>
    <TogetherDetail :is-open.sync="isDetailDialog" :data="togetherDetail"></TogetherDetail>
  </el-dialog>
</template>
<script>
import { getTravelTogethers } from "@/api/faceUser/faceTogether";
import data from '../../views/svg-icons/generateIconsView';
import { singlePickerOptions } from "@/utils";
import { postChanList, getCheckOnline, getReqVideo } from "@/api/video";

export default {
  components: {
    TogetherDetail: () => import("./TogetherDetail")
  },
  props: {
    id: null,
    form: null,
    isOpen: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      isLabelDialog: false,
      isDetailDialog: false,
      listSelect: [],
      listTableData: {},
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        _filter_ge_collectTime_date: null,
        _filter_le_collectTime_date: null,
        _filter_all_personIds_longarr: null
      },
      listTableLoading: false,
      togetherDetail:null,
      
      singlePickerOptions: singlePickerOptions,

      // 视频
      chanListData: [],
    };
  },
  watch: {
    isOpen(val) {
      this.isLabelDialog = val;
    },
    isLabelDialog(val) {
      if (val) {
        this.listQuery._filter_all_personIds_longarr = this.id;
        this.id && this.getTableList();
      }
      this.$emit("update:isOpen", val);
    }
  },
  created() {
    postChanList([]).then(res => {
      this.chanListData = res.data;
    })
  },
  methods: {
    onSearch() {
      this.listQuery = Object.assign(this.listQuery, {
        pageNo: 1,
        pageSize: 15
      });
      this.getTableList();
    },
    onDetails(data,isReqVideo) {
      isReqVideo && data.forEach(item => {
        this.$set(item,"isReqVideo",isReqVideo);
      });
      this.togetherDetail=data;
      this.$nextTick(() => {
        this.isDetailDialog = true;
      });
    },
    // 获取表格数据
    getTableList() {
      this.listTableLoading = true;
      getTravelTogethers(this.listQuery)
        .then(res => {
          this.listTableData = res.data;

          if (this.listTableData) {
            this.listTableData.rows.forEach(item => {

              this.chanListData && this.chanListData.forEach(element => {
                if (element.deviceCode == item.deviceCode) {
                  this.$set(item, 'isReqVideo', true);
                  this.$set(item, 'chanDpid', element.chanDpid);
                  getCheckOnline(element.chanDpid).then(res => {
                    if (res.data.state == 1) {
                      this.$set(item, 'onLine', true);
                    };
                  })
                }
              });
            });

          }
        })
        .finally(() => {
          this.listTableLoading = false;
        });
    },
    // 列表参数重置
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.getTableList();
    },
    //分页处理
    onListPaging(val) {
      this.listQuery.pageNo = val;
      this.listQuery.totalCount = this.listTableData.total;
      this.getTableList();
    },
    onListLimit(val) {
      this.listQuery.pageSize = val;
      this.listQuery.totalCount = this.listTableData.total;
      this.getTableList();
    }
  }
};
</script>
<style lang="scss" scoped>
.el-table {
  .picBox {
    position: relative;
    display: inline-block;
    width: 48px;
    margin-left: 10px;
  }

  .pic {
    display: inline-block;
    overflow: hidden;
    border-radius: 4px;
    vertical-align: top;
  }
}
.mask {
  position: absolute;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 48px;
  display: inline-block;
  line-height: 14px;
  color: #fff;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.el-pagination {
  padding: 10px;
}
</style>