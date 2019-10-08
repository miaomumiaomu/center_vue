<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4" class="task-border-right">
        <div class="header">
          <strong>布控任务</strong>
          <div class="pull-right">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-plus"></i>添加任务
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command='0'>正向布控</el-dropdown-item>
                <el-dropdown-item :command='1'>反向布控</el-dropdown-item>
                <el-dropdown-item :command='2'>特征布控</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <!-- 表单筛选 -->
        <div class="common-table-form">
          <div class="f-block" @keyup.enter="onSearch">
          <el-input placeholder="任务名/任务编号" size="mini" v-model="listQuery._filter_like_keyword" clearable @clear="onSearch">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          </div>
          <div class="f-block" :style="{ lineHeight: '26px' }">
            <el-checkbox-group v-model="listQuery._filter_in_status_intarr" @change="onSearch">
              <el-checkbox v-for="item in stateOption" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <ul class="task-list" @scroll="onScrollToPage">
          <li v-for="item in listTableData.rows" :class="currentTask.id === item.id ? 'choose-item' : ''" @click="onItemDetails(item)" :key="item.id">
            <el-row>
              <el-col :span="16">
                <div class="item-header">
                  <el-tag class="task-tag" type="info" size="mini" :color="onJudgeColor(item.status)" :style="{ color: '#fff', fontSize: '12px' }">{{item.status}}</el-tag>
                  <span>{{item.name}}</span>
                </div>
                <p>编号：{{item.code}}</p>
              </el-col>
              <el-col class="aside-info" :span="8">
                <el-badge v-if="item.unHandleCnt" :value="item.unHandleCnt" />
              </el-col>
            </el-row>
            <el-dropdown @command="onItemEdit(item.id)">
              <span class="el-dropdown-link">
                <i class="el-icon-more" :style="{color: '#2e2e2e'}"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>编辑</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>
        <div class="footer">
          <el-tooltip popper-class="today-tip" placement="top" effect="light" :open-delay="200" v-if="overviewData" :disabled="overviewDisabled">
            <el-button class="txt-btn" size="mini" type="text" icon="el-icon-date">工作概览</el-button>
            <div slot="content">
              <div class="tooltip-item">
                <div class="tit">
                  <span>布控任务</span>
                  <label>{{overviewData.monitorCnt}}</label>
                </div>
                <div class="txt">
                  <span>在控</span>
                  <label>{{overviewData.monitorOnCnt}}</label>
                </div>
                <div class="txt">
                  <span>撤控</span>
                  <label>{{overviewData.monitorOffCnt}}</label>
                </div>
              </div>
              <div class="tooltip-item">
                <div class="tit">
                  <span>预警消息</span>
                  <label>{{overviewData.alarmCnt}}</label>
                </div>
                <div class="txt">
                  <span>今日预警</span>
                  <label :style="{ color: '#EA4423' }">{{overviewData.alarmTodayCnt}}</label>
                </div>
                <div class="txt">
                  <span>未处理</span>
                  <label :style="{ color: '#EA4423' }">{{overviewData.alarmUnHandleCnt}}</label>
                </div>
              </div>
            </div>
          </el-tooltip>
        </div>
      </el-col>
      <el-col :span="20">
        <!-- 任务详情 -->
        <task-details ref="taskDetails" :id="taskDetailsId" @awaken="onItemEdit(taskDetailsId)" @onUpdate="handleUpdate" :cameraList="cameraList" />
      </el-col>
    </el-row>

    <!-- 编辑表单 -->
    <task-form ref="taskForm" :is-open.sync="isFormDialog" :id="taskFormId" :category="taskFormType" @complete="getTableList(1)" :cameraList="cameraList" />
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getOverview, getMonitorTaskList } from "@/api/faceMonitor";
import { getMapMarker } from "@/api/dataViews";

export default {
  name: "faceMonitor",
  components: {
    TaskForm: () => import("./components/TaskForm"),
    TaskDetails: () => import("./components/TaskDetails")
  },
  data: () => ({
    personId: '',
    listQuery: {
      pageNo: 1,
      pageSize: 15,
      totalCount: null,
      _filter_in_status_intarr: [],
      _filter_like_keyword: null,
      _filter_eq_communityId: null
    },
    cameraList: [],   // 摄像头布控列表
    currentTask: {},  // 当前选中任务
    stateOption: [{ id: 1, name: "在控" }, { id: 0, name: '撤控' }, { id: 2, name: '过期' }],
    listTableData: {},
    listTableLoading: false,

    overviewData: null,
    overviewDisabled: false,

    taskFormId: null,
    taskFormType: 0,  // 布控类型：正向0、反向1、特征2
    isFormDialog: false,

    taskDetailsId: null,
  }),
  created() {
    // document.title = '实战中心 - AiTensor'
    const { id } = this.$store.getters.userInfo;
    this.personId = id;
    this.init();
  },
  activated() {
    this.overviewDisabled = false;
  },
  deactivated() {
    this.overviewDisabled = true;
  },
  computed: {
    ...mapState({
      userInfo: state=> state.user.userInfo,
    })
  },
  methods: {
    init() {
      getOverview(this.personId).then(res => {
        this.overviewData = res.data;
      });
      
      if (this.$route.query.type=="on") {
        this.listQuery._filter_eq_status = 1;
      }
      this.getTableList();
      // 获取人脸摄像头分布列表
      getMapMarker().then(res => {
        let result = res.data.filter(item => (item.type === 1 && item.deviceCameraType === 1));
        this.cameraList = result;
      });
    },
    getTableList(page) {
      this.listTableLoading = true;
      const searchQuery = Object.assign({}, this.listQuery);
      const { _filter_in_status_intarr = [] } = searchQuery;
      searchQuery._filter_in_status_intarr = _filter_in_status_intarr.join(',');
      searchQuery._filter_eq_leaderId = this.personId;
      if (page) searchQuery.pageNo = page;
      getMonitorTaskList(searchQuery)
        .then(res => {
          if (searchQuery.pageNo > 1) {
            const oldList = this.listTableData.rows || [];
            let newList = res.data.rows.slice();
            res.data.rows = [...oldList, ...newList];
          }
          this.listTableData = res.data;
          // 刷新详情区域
          if (Object.keys(this.currentTask).length > 0) {
            let targetId = this.taskDetailsId;
            let reData = res.data.rows.find(item => (item.id === targetId));
            if (reData) {
              this.taskDetailsId = null;
              this.currentTask = reData;
              this.$nextTick(() => {
                this.taskDetailsId = targetId;
              })
            }
          }
        })
        .finally(() => {
          this.listTableLoading = false;
        });
    },
    // 查询
    onSearch() {
      this.listQuery = Object.assign(this.listQuery, {
        pageNo: 1,
        pageSize: 15,
        totalCount: null
      });
      this.getTableList();
    },
    // 处理颜色渲染
    onJudgeColor(status) {
      let result = '';
      if (status === '在控') {
        result = '#D61766';
      } else if (status === '撤控') {
        result = '#278AEF';
      } else {
        result = '#8EA5BC';
      }
      return result;
    },
    // 滚动分页
    onScrollToPage(e) {
      const taskListElem = e.currentTarget;
      const listHeight = taskListElem.clientHeight;
      if (taskListElem.scrollHeight - taskListElem.scrollTop <= listHeight) {
        if (this.listTableData.total > this.listTableData.rows.length) {
          const { pageNo } = this.listQuery;
          this.onListPaging(pageNo + 1);
        }
      }
    },
    // 分页处理
    onListPaging(val) {
      this.listQuery.pageNo = val;
      this.listQuery.totalCount = this.listTableData.total;
      this.getTableList();
    },
    handleCommand(com) {
      this.onItemAdd(com);
    },
    // 任务添加
    onItemAdd(type) {
      this.taskFormType = type;
      this.taskFormId = null;
      this.$nextTick(() => {
        this.isFormDialog = true;
      });
    },
    // 任务编辑
    onItemEdit(id) {
      this.taskFormId = id || null;
      this.$nextTick(() => {
        this.isFormDialog = true;
      });
    },
    handleUpdate() {
      this.getTableList();
      this.onItemDetails({ id: this.taskDetailsId });
    },
    // 任务详情
    onItemDetails(data) {
      this.taskDetailsId = data.id || null;
      this.currentTask = data;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  height: 100%;
  // @media screen and (max-width:1500px){
  //    height: 106%;
  // }
  .task-border-right {
    border-right: 1px solid gainsboro;
  }
  .td-box {
    padding: 5px 0;
  }
  .common-table-form {
    border-bottom: 1px solid gainsboro;
  }
  .el-pagination {
    padding: 10px;
  }
}
.tooltip-item {
  padding: 4px 4px;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  &:last-child {
    margin-bottom: 0;
  }
  .tit {
    overflow: hidden;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    label {
      float: right;
      font-size: 18px;
      color: #0fa0ff;
    }
  }
  .txt {
    width: 100%;
    overflow: hidden;
    margin-bottom: 10px;
    span {
      color: gray;
    }
    label {
      float: right;
      color: #0fa0ff;
      text-decoration: underline;
    }
  }
}
.header {
  padding: 12px;
  padding-bottom: 0;
  overflow: hidden;
  strong {
    font-size: 18px;
  }
  .pull-right {
    float: right;
    line-height: 20px;
    cursor: pointer;
  }
}
/deep/ {
  .el-form-item__content {
    display: block;
  }
  .el-form-item__label {
    float: left;
  }
  .f-block {
    .el-checkbox-group {
      text-align: center;
      .el-checkbox {
        margin-left: 0;
        .el-checkbox__label {
          padding-left: 5px;
        }
      }
      .el-checkbox:first-of-type {
        float: left;
      }
      .el-checkbox:last-of-type {
        float: right;
      }
    }
  }
  .el-dropdown-link {
    color: #0fa0ff;
  }
}
.f-block {
  display: block;
}
.btn-wrap {
  width: 45%;
  text-align: center;
}
.search-btn {
  width: 80px;
}
.task-list {
  height: calc(100vh - 258px);
  overflow-y: auto;
  li {
    position: relative;
    border-bottom: 1px solid gainsboro;
    padding: 8px;
    cursor: pointer;
    div.item-header {
      width: 100%;
      white-space: nowrap;
      padding-bottom: 8px;
      vertical-align: middle;
      span {
        display: inline-block;
        max-width: calc(100% - 50px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        color: #2e2e2e;
        vertical-align: middle;
      }
      .task-tag {
        font-size: 14px;
        vertical-align: middle;
      }
    }
    p {
      color: #2e2e2e;
      font-size: 14px;
    }
    .aside-info {
      padding-top: 20px;
      text-align: center;
    }
    .el-dropdown {
      display: none;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: rotate(90deg) translateX(-50%);
      font-size: 14px;
      color: #2e2e2e;
    }
  }
  li:last-of-type {
    border-bottom: none;
  }
  li:hover {
    background-color: gainsboro;
    .el-dropdown {
      display: inherit;
    }
  }
}
.footer {
  text-align: center;
  .txt-btn {
    color: #3f4041;
  }
}
.choose-item {
  background-color: gainsboro;
}
</style>