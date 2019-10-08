<template>
  <div class="menu-container">
    <div class="header-container">
      <a href="/#/home" target="home" class="logo">
        <img src="~@/assets/logo.png">
        <div class="place">
          {{cityName}}
        </div>
      </a>
      <div class="right">
        <el-dropdown @command="onCommand" class="user">
          <div class="el-dropdown-link">
            <div class="box">
              <b>{{userInfo ? (userInfo.loginName ? userInfo.loginName : '-') : '-'}}
                <i class="el-icon-caret-bottom"></i>
              </b>
              <p>{{userInfo ? (userInfo.name ? userInfo.name : '-') : '-'}}</p>
            </div>
          </div>
          <el-dropdown-menu slot="dropdown" class="header-dropdown-menu">
            <el-dropdown-item command="password">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">安全退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="sidebar-container">
      <el-menu class="menu" :default-active="$route.path" :default-openeds="openMenu" v-if="permissionMenus">
        <template v-for="item in permissionMenus[menuMode].children">
          <el-submenu :index="item.path" :key="item.name" v-if="item.children.length > 0">
            <template slot="title">
              <svg-icon v-if="item.icon" :icon-class="item.icon" />
              <span>{{item.name}}</span>
            </template>
            <template v-for="child in item.children">
              <el-menu-item :index="child.path" :key="child.name">
                <svg-icon v-if="child.icon" :icon-class="child.icon" />
                <span>{{child.name}}</span>
                <a v-if="newPageFilter.includes(child.code)" :href="'/#' + child.path" :target="child.path" class="url" />
                <router-link v-else :to="child.path" class="url" :target="newPageFilter.includes(child.code)? '_blank' : ''" />
              </el-menu-item>
            </template>
          </el-submenu>
          <el-menu-item v-else :index="item.path" :key="item.name">
            <svg-icon v-if="item.icon" :icon-class="item.icon" />
            <span>{{item.name}}</span>
            <router-link :to="item.path" class="url" :target="newPageFilter.includes(item.code)? '_blank' : '' " />
          </el-menu-item>
        </template>
      </el-menu>
    </div>

    <!-- 修改密码弹窗 -->
    <el-dialog title="修改密码" :visible.sync="isPasswordDialog" width="400px">
      <el-form ref="formPassword" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input v-model="form.oldPwd" type="password" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="form.newPwd" type="password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPass" class="m0">
          <el-input v-model="form.confirmPass" type="password" placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>
        <el-button size="mini" @click="isPasswordDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { newPageFilter } from "@/utils/config";
import { putModifyPassword } from "@/api/login";
import { transparentWatermark } from '@/utils';

export default {
  name: "NavMenu",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.form.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // menuMode: 1, //0:全部  1:实战  2:资源  3:系统
      openMenu: [],
      newPageFilter: newPageFilter,

      isPasswordDialog: false,
      form: {
        oldPwd: null,
        newPwd: null,
        confirmPass: null
      },
      rules: {
        oldPwd: [
          { required: true, message: "旧密码不能为空" },
          { min: 6, max: 20, message: "密码长度为6-20位" }
        ],
        newPwd: [
          { required: true, message: "新密码不能为空" },
          { min: 6, max: 20, message: "密码长度为6-20位" }
        ],
        confirmPass: {
          required: true,
          validator: validatePass
        }
      },

      ip: process.env.NODE_ENV === "development" ? process.env.IP : location.host,
      cityName: ''
    };
  },
  created() {
    if (this.permissionMenus) this.openMenu = this.permissionMenus[this.menuMode].children.map(item => item.path);
  },
  computed: {
    ...mapGetters(["userInfo", "permissionMenus"]),
    menuMode() {
      let url = window.location.hash
      let portrait = url.split('/')[1]
      let _index = 0
      let obj = this.permissionMenus.find((item, index) => {
        if (item.path.includes(portrait)) {
          _index = index
          return true
        }
        return false
      })
      transparentWatermark(this.userInfo.waterMarkImgUrl);//不需要限制条件，除非有菜单的页面也不需要水印
      this.cityName =  obj ? obj.name : '';
      obj ? document.title = obj.name + ' - AiTensor' : ''
      return _index
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logOut").then(() => {
        this.$router.push("/login");
      });
    },
    onCommand(command) {
      if (command === "logout") {
        this.logout();
      }
      if (command === "password") {
        this.isPasswordDialog = true;
        this.$nextTick(() => {
          this.$refs.formPassword && this.$refs.formPassword.resetFields();
        });
      }
    },
    onSubmit() {
      this.$refs.formPassword.validate(async valid => {
        if (!valid) return;

        // 修改密码
        putModifyPassword(this.form).then(res => {
          let isSuccess = res.status === 200;
          // 提示处理
          this.$notify({
            title: isSuccess ? "成功" : "失败",
            message: isSuccess ? "修改成功" : res.message,
            type: isSuccess ? "success" : "error",
            duration: 2000
          });

          if (isSuccess) {
            this.isPasswordDialog = false;
          }
        });
      });
    },
    onSearchChange(data) {
      this.$store.dispatch("globalSearch/setData", data);
      this.$router.push("/globalSearch");
    },
    onChangeMenu(num) {
      this.menuMode = num;
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
