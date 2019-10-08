<template>
  <div class="login-container">
    <!-- <div class="login-logo">
      <div class="box">
        <div class="name">大数据平台</div>
      </div>
    </div> -->
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="name">智慧社区管控平台</div>
      <el-form-item prop="loginName">
        <el-input type="text" v-model="loginForm.loginName" autoComplete="on" :placeholder="$t('login.username')">
          <i slot="prefix" class="user" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password" style="marginBottom: 0">
        <el-input type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" :placeholder="$t('login.password')">
          <i slot="prefix" class="password" />
        </el-input>
      </el-form-item>
      <!-- <div class="forger">
        <span class="txt" @click="onMessage">忘记密码</span>
      </div> -->
      <el-button type="primary" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>
    </el-form>
    <div class="copyright">
      推荐使用谷歌浏览器进行访问：<a href="https://www.google.cn/intl/zh-CN/chrome/" target="_blank">点我下载</a>
      <!-- <p>Copyright &copy; {{year-1}}-{{year}} Xiamen Aitensor artificial intelligence Technology Co.,Ltd.</p> -->
    </div>
    <div class="browser">
      版权所有 &copy; {{year-1}}-{{year}} 厦门汤说人工智能科技有限公司
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5 || value.length > 20) {
        callback(new Error("密码长度为6-20位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        loginName: "",
        password: "",
        loginIp: null
      },
      loginRules: {
        loginName: [
          { required: true, message: "账号不能为空" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符" }
        ],
        password: [
          { required: true, message: "密码不能为空" },
          { min: 6, max: 20, message: "密码长度为6-20位" }
        ]
      },
      place: "",
      year:new Date().getFullYear()
    };
  },
  created() {
    this.getIPs();
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) return;

        this.loginForm.loginName = this.loginForm.loginName.trim();
        this.$store.dispatch("login", this.loginForm).then(() => {
          this.$router.push("/");
        });
      });
    },

    // onMessage() {
    //   this.$notify({
    //     title: "提示",
    //     message: '请联系管理员重置密码！',
    //     type: "info",
    //     duration: 2000
    //   });
    // },

    // 获取电脑IP地址
    getIPs(callback) {
      let _that = this
      var ip_dups = {};
      var RTCPeerConnection = window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;
      var useWebKit = !!window.webkitRTCPeerConnection;

      if (!RTCPeerConnection) {
        var win = iframe.contentWindow;
        RTCPeerConnection = win.RTCPeerConnection ||
          win.mozRTCPeerConnection ||
          win.webkitRTCPeerConnection;
        useWebKit = !!win.webkitRTCPeerConnection;
      }

      var mediaConstraints = {
        optional: [{
          RtpDataChannels: true
        }]
      };

      var servers = {
        iceServers: [{
          urls: "stun:stun.services.mozilla.com"
        }]
      };

      var pc = new RTCPeerConnection(servers, mediaConstraints);

      function handleCandidate(candidate) {
        var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
        var tt = ip_regex.exec(candidate);

        if (tt == null || tt.length < 2) {
          return false;
        }
        var ip_addr = tt[1];
        // console.log(tt, ip_addr, ip_dups[ip_addr], "111")
        if (ip_dups[ip_addr] === undefined)
          _that.loginForm.loginIp = ip_addr;
        ip_dups[ip_addr] = true;
      }

      pc.onicecandidate = function (ice) {
        if (ice.candidate)
          handleCandidate(ice.candidate.candidate);
      };

      pc.createDataChannel("");

      pc.createOffer(function (result) {

        pc.setLocalDescription(result, function () {}, function () {});

      }, function () {});

      setTimeout(function () {
        var lines = pc.localDescription.sdp.split('\n');

        lines.forEach(function (line) {
          if (line.indexOf('a=candidate:') === 0)
            handleCandidate(line);
        });
      }, 1000);
    },
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";

.login-container {
  background: no-repeat center center url(~@/assets/bg.png);
  background-size: 100% 100%;
  @include relative;
  // .login-logo {
  //   position: absolute;
  //   top: 0;
  //   bottom: 0;
  //   left: 50%;
  //   background: no-repeat center center url(~@/assets/login/bg.png);
  //   width: 420px;
  //   transform: translateX(-100%);
  //   .box {
  //     position: absolute;
  //     left: 0;
  //     background: no-repeat top center url(~@/assets/login/logo.png);
  //     width: 100%;
  //     padding: 68px 30px 50px 55px;
  //     @include ct;
  //   }
  //   .name {
  //     text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  //     letter-spacing: 2px;
  //     font-size: 34px;
  //     font-weight: bold;
  //     color: #fff;
  //   }
  //   .place {
  //     line-height: 26px;
  //     font-size: 16px;
  //     color: #ffc600;
  //   }
  //   .svg-icon {
  //     display: inline-block;
  //     height: 26px;
  //     line-height: 26px;
  //     margin-right: 4px;
  //     vertical-align: top;
  //     font-size: 22px;
  //   }
  // }
  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 450px;
    transform: translate(-50%, -50%);
    /deep/ {
      .el-form-item{
        border-width: 2px;
        margin-bottom: 51px;
      }
      .el-form-item__content {
        line-height: 60px;
      }
      .el-form-item.is-success .el-input__inner{
        border:2px solid #2D60C9
      }
    }
    .name{
      height: 46px;
      text-align: center;
      margin-bottom: 57px;
      font-size:38px;
      font-family:AlibabaPuHuiTiM;
      font-weight:500;
      color:rgba(234,235,241,1);
    }
    .user{
      display: inline-block;
      width: 23px;
      height: 25px;;
      background: no-repeat center center url(~@/assets/user.png);
      background-size: 100% 100%;
    }

    .password{
      display: inline-block;
      width: 23px;
      height: 25px;
      background: no-repeat center center url(~@/assets/password.png);
    }
    .el-input {
      // padding-left: 45px;
      /deep/ {
        // .el-input-group__prepend {
        //   height: 50px;
        //   line-height: 48px;
        //   padding: 0 10px;
        // }
        .el-input__prefix{
          height: 60px;
          line-height: 68px;
          padding: 0 19px 0 24px;
        }
        input {
          height: 60px;
          line-height: 60px;
          font-size:25px;
          font-family:AlibabaPuHuiTiL;
          font-weight:300;
          color:rgba(241,237,238,1);
          padding-left: 66px;
          background-color: #191F31 !important;
          border:1px solid rgba(131, 132, 134, 0.45);
        }
        .el-input__inner:-webkit-autofill {
          transition:all 5000s ease-in-out 0s;
        }
      }
    }
    .svg-icon {
      position: relative;
      top: 2px;
      font-size: 23px;
    }
    .show-pwd {
      position: absolute;
      top: 0;
      right: 10px;
      height: 30px;
      line-height: 30px;
      font-size: 20px;
      color: #666;
      user-select: none;
      cursor: pointer;
    }
    .el-button {
      background: #2D60C9;
      width: 100%;
      height: 60px;
      line-height: 60px;
      padding: 0 20px;
      margin-top: 62px;
      border-color: #2D60C9;
      letter-spacing: 4px;
      font-size:27px;
      font-family:AlibabaPuHuiTiR;
      font-weight:400;
      color:rgba(241,237,238,1);
      &:hover {
        background: #0090ff;
        border-color: #0090ff;
      }
    }
  }
  .copyright {
    position: absolute;
    right: 0;
    bottom: 40px;
    left: 0;
    text-align: center;
    font-size:15px;
    font-family:AlibabaPuHuiTiL;
    font-weight:300;
    color:rgba(255,255,255,1);
    p {
      line-height: 30px;
      margin: 0;
      font-size: 12px;
      color: #8cb4d6;
    }
    a {
      border-bottom: 1px solid #2D74F4;
      color: #2D74F4;
    }
  }
  .browser {
    position: absolute;
    right: 0;
    bottom: 20px;
    left: 0;
    text-align: center;
    font-size:15px;
    // font-family:AlibabaPuHuiTiL;
    font-weight:300;
    color:rgba(255,255,255,1);
    opacity:0.76;
  }
  .forger {
    text-align: right;
    color: #8cb4d6;
    margin: 8px 0;
    font-size: 14px;
    .txt {
      cursor: pointer;
    }
  }
}
</style>
