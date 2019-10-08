<template>
  <el-row>
    <jurisdiction-menu @change="onMenuChange" :operating="false"/>
    <el-col :span="18" >
      <div class="user-configure">
        <!-- 表单筛选 -->
        <el-form
          class="common-table-form"
          ref="listForm"
          :model="listQuery"
          :inline="true"
          @submit.native.prevent
          size="mini"
        >
          <el-form-item prop="pageNo" class="m0"/>
          <el-form-item prop="pageSize" class="m0"/>
          <el-form-item prop="totalCount" class="m0"/>
          <el-form-item label="关键字" prop="_filter_like_name">
            <el-input
              @keyup.enter.native="onSearch"
              placeholder="姓名/账号"
              v-model="listQuery._filter_like_name"
              clearable
            />
          </el-form-item>
          <el-form-item label="角色" prop="_filter_eq_roleId">
            <el-select v-model="listQuery._filter_eq_roleId" clearable>
              <el-option
                v-for="item in roleData"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="_filter_eq_enable">
            <dict-select dict-name="enable_status" v-model="listQuery._filter_eq_enable" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="onResetForm">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 工具栏 -->
        <div class="common-tool">
          <div class="title">
            {{currentMenuData.areaName}}
            <em v-if="listTableData.totalCount">{{listTableData.totalCount}}</em>
          </div>
          <div class="right">
            <el-button
              class="txt-btn"
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="onItemEdit()"
              v-permission="'FUNC_USER_ADD'"
            >添加</el-button>
            <!-- <el-button
              class="txt-btn"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="onItemDelete"
              v-permission="'FUNC_USER_DELETE'"
            >删除</el-button> -->
          </div>
        </div>

        <!-- 表格模式 S -->
        <el-table
          ref="listTabel"
          :data="listTableData.items"
          height="calc(100% - 136px)"
          v-loading.body="listTableLoading"
          highlight-current-row
          @selection-change="onListChange"
        >
          <el-table-column type="selection" width="50"/>
          <el-table-column prop="login_name" label="账号" align="center" width="100px"/>
          <el-table-column prop="name" label="姓名" align="center" width="120px"/>
          <el-table-column label="性别" align="center" width="60px">
            <template slot-scope="scope">{{sexData[scope.row.sex]}}</template>
          </el-table-column>
          <el-table-column label="角色" align="center">
            <template slot-scope="{row:{roleIds}}">{{getRoles(roleIds)}}</template>
          </el-table-column>
          <el-table-column prop="police_area_name" label="所属辖区" align="center" width="200px" />
          <el-table-column prop="mobile" label="手机号" align="center" width="140px"/>
          <el-table-column prop="status" label="状态" align="center" width="80px">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enable == 1 ? 'primary' : 'danger'" close-transition>
                <span>{{scope.row.enable == 1 ? '启用' : '禁用'}}</span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" width="200" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="onItemEdit(scope.row.id)" v-permission="'FUNC_USER_UPDATE'">编辑</el-button>
              <el-button size="mini" type="primary" @click="onResetPassword(scope.row)" v-permission="'FUNC_PASSWORD_RESET'">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表格模式 E -->
        <el-pagination
          @size-change="onListLimit"
          @current-change="onListPaging"
          :current-page="listQuery.pageNo"
          :page-size="listQuery.pageSize"
          :page-sizes="[15,30,50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="listTableData.totalCount"
        />

        <!-- 编辑用户弹层 S -->
        <el-dialog
          :title="form.id?'编辑用户':'新增用户'"
          class="form-layer"
          :visible.sync="isFormDialog"
          width="400px"
        >
          <el-form :model="form" :rules="rules" ref="form" label-width="70px">
            <el-form-item prop="id" class="m0"/>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入手机号" maxlength="11"/>
            </el-form-item>
            <el-form-item label="账号" prop="loginName">
              <el-input maxlength="20" v-model="form.loginName" placeholder="请输入账号"/>
            </el-form-item>
            <el-form-item label="密码" prop="password" v-if="form.id == null">
              <el-input v-model="form.password" placeholder="密码为空则默认为手机号"/>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名"/>
            </el-form-item>
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入昵称"/>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <dict-select dict-name="comm_sex" v-model="form.sex"/>
            </el-form-item>
            <el-form-item label="角色" prop="roleIds">
              <el-select v-model="form.roleIds" placeholder="请选择" multiple>
                <el-option v-for="item in roleData" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="所属辖区" prop="policeAreaName" >
              <el-input v-model="form.policeAreaName" placeholder="请选择所属辖区"  @focus="addressDialogOpen()" readonly/>
            </el-form-item>
            <el-form-item label="状态" prop="enable">
              <el-radio-group v-model="form.enable">
                <el-radio :label="0">禁用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="登录许可" prop="loginable" class="m0">
              <el-radio-group v-model="form.loginable">
                <el-radio :label="0">禁止</el-radio>
                <el-radio :label="1">允许</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="onSubmit()">确 定</el-button>
            <el-button size="mini" @click="isFormDialog = false">取 消</el-button>
          </div>
        </el-dialog>
        <!-- 编辑用户弹层 E -->
        <!-- 辖区弹窗 -->
        <jurisdiction-menu-dialog ref="addressDialog" @finish="getAddress"></jurisdiction-menu-dialog>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import {
  putResetPassword,
  getUserList,
  postUser,
  deleteUser,
  putUser,
  getUser,
  getAllRole
} from "@/api/userManage";
import { mapGetters } from 'vuex';
import { getDictionary } from "@/api/common";

export default {
  data() {
    return {
      sexData: {},
      roleData: null,
      currentMenuData: {},

      listIds: [],
      listQuery: {
        pageNo: 1,
        pageSize: 15,
        totalCount: null,
        _filter_like_name: null,
        _filter_eq_roleId: null,
        _filter_eq_enable: null,
      },
      listTableData: {},
      listTableLoading: false,

      isFormDialog: false,
      form: {
        id: null,
        loginName: null,
        password: null,
        name: null,
        nickName: null,
        sex: null,
        mobile: null,
        roleIds: [],
        enable: 1,
        loginable: 1,
        policeAreaName: ''
      },
      rules: {
        loginName: [{ required: true, message: "账号不能为空" },{  min: 3, max: 20, message: '长度在 3 到 5 个字符', }],
        name: { required: true, message: "姓名不能为空" },
        mobile: [
          { required: true, message: "手机号不能为空" },
          { min: 11, max: 11, message: "手机号为11位" }
        ],
        roleIds:{required:true,message:"角色不能为空"}
      }
    };
  },
  components: {
    JurisdictionMenuDialog: () => import("@/components/JurisdictionMenuDialog"),
    JurisdictionMenu: () => import("@/components/JurisdictionMenu"),
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {
    let { policeAreaCode, policeAreaId, policeAreaName } = this.userInfo
    this.listQuery._filter_like_policeAreaCode = policeAreaCode
    this.currentMenuData = Object.assign({}, this.currentMenuData, {
      areaName: policeAreaName,
      areaCode: policeAreaCode,
      id: policeAreaId
    })
    this.init();
  },
  methods: {
    init() {
      getDictionary("comm_sex").then(res => {
        let json = {};
        res.data.map(item => {
          json[item.value] = item.label;
        });

        this.sexData = json;
      });
      getAllRole().then(res => {
        this.roleData = res.data;
      });
      this.getTableList();
    },
    // 获取表单数据
    getTableList() {
      this.listTableLoading = true;
      getUserList(this.listQuery)
        .then(res => {
          this.listTableData = res.data;
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
    // 列表参数重置
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.getTableList();
    },
    // 更新列表选中
    onListChange(val) {
      this.listIds = val.map(item => item.id);
    },
    // 批量删除
    onItemDelete() {
      if (!this.listIds.length) {
        this.$notify({
          title: "提示",
          message: "请选择需要删除的数据",
          type: "warning",
          duration: 2000
        });
        return;
      }

      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        confirmButtonClass: "el-button--mini",
        cancelButtonClass: "el-button--mini fr",
        type: "warning"
      }).then(() => {
        deleteUser({
          ids: this.listIds
        }).then(res => {
          let isSuccess = res.status === 200;
          this.$notify({
            title: isSuccess ? "成功" : "失败",
            message: isSuccess ? "删除成功" : res.message,
            type: isSuccess ? "success" : "error",
            duration: 2000
          });

          if (isSuccess) {
            this.onSearch();
          }
        });
      });
    },
    // 重置密码
    onResetPassword(data) {
      console.log(data)
      putResetPassword({ id: data.id, password: "123456" }).then(res => {
        let isSuccess = res.status === 200;

        if (!isSuccess) {
          // 提示处理
          this.$notify({
            title: "失败",
            message: res.message,
            type: "error",
            duration: 2000
          });
          return;
        }

        this.$alert(
          `账号【${data.login_name}】的密码已重置为：123456`,
          "重置密码",
          {
            confirmButtonText: "确定",
            confirmButtonClass: "el-button--mini"
          }
        );
      });
    },

    /* 分页处理 */
    onListPaging(val) {
      this.listQuery.pageNo = val;
      this.listQuery.totalCount = this.listTableData.totalCount;
      this.getTableList();
    },
    onListLimit(val) {
      this.listQuery.pageSize = val;
      this.listQuery.totalCount = this.listTableData.totalCount;
      this.getTableList();
    },
    /* 分页处理 */

    /* 表单处理 */
    // 表单编辑
    onItemEdit(id) {
      this.isFormDialog = true;
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.resetFields();

        if (id) {
          getUser(id).then(res => {
            this.form = res.data;
          });
        } else {
          this.form = Object.assign({}, {
            policeAreaName: this.currentMenuData.areaName,
            policeAreaCode: this.currentMenuData.areaCode,
            policeAreaId: this.currentMenuData.id,
            roleIds: []
          })
        }
      });
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;

        let api = this.form.id ? putUser : postUser;
        let request = null;

        let form = JSON.parse(JSON.stringify(this.form));
        if (!form.password) {
          form.id ? '' : form.password = form.mobile;
        }

        // 通用处理
        eval(`(request = api(${JSON.stringify(form)}))`);
        request.then(res => {
          let isSuccess = res.status === 200;
          // 提示处理
          this.$notify({
            title: isSuccess ? "成功" : "失败",
            message: isSuccess
              ? this.form.id
                ? "修改成功"
                : "新增成功"
              : res.message,
            type: isSuccess ? "success" : "error",
            duration: 2000
          });

          if (isSuccess) {
            this.onSearch();
            this.isFormDialog = false;
          }
        });
      });
    },
    /* 表单处理 */

    //获取角色名
    getRoles(roleIds) {
      return roleIds.map(item => this.roleData.find(it => it.id === item).name).join(',')
    },
    addressDialogOpen() {
      this.$refs.addressDialog.open()
    },
    //获取辖区
    getAddress(data, labelss) {
      this.form = Object.assign({}, this.form, {
        policeAreaId: data.id,
        policeAreaCode: data.areaCode,
        policeAreaName: data.areaName
      })
    },
    // 菜单更新
    onMenuChange(status, data, node) {
      this.$refs.listForm.resetFields()
      this.listQuery._filter_like_policeAreaCode = data.areaCode
      // this.addressName = data.label
      this.currentMenuData = { ...data }
      this.getTableList()
    },
  }
};
</script>
<style lang="scss" scoped>
.el-row,
  .el-col {
    height: 100%;
  }
.user-configure {
  height: 100%;
  .el-table {
    .el-button {
      margin: 2px 0;
    }
  }
  .el-pagination {
    padding: 10px;
  }
}
.form-layer {
  .el-select {
    width: 100%;
  }
}
</style>
