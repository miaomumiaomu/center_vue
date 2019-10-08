<template>
  <el-dialog title="系统激活" class="active-model body0" :visible.sync="isFormDialog" width="430px">
    <div class="wrapper">
      <p>如果没有激活码，请提供下列密钥给相关技术人员进行生成</p>
      <section>{{code}}</section>
      <div class="btn-group">
        <el-button @click="onCopy">复制</el-button>
        <el-button @click="onExport">导出</el-button>
      </div>
    </div>
    <div class="wrapper" :style="{ borderTop: '1px solid gray' }">
      <p>如果已有激活码，请直接在文本框输入并点击激活</p>
      <el-input placeholder="请输入激活码" v-model="activeCode">
        <el-button slot="append" @click="onSubmit">激活</el-button>
      </el-input>
    </div>
  </el-dialog>
</template>

<script>
import { getAuthData, activateAuth } from "@/api/system";
export default {
  props: {
    isOpen: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      isFormDialog: false,
      code: '',
      activeCode: ''
    };
  },
  watch: {
    isOpen(val) {
      this.isFormDialog = val;
    },
    isFormDialog(val) {
      if (val) {
        getAuthData().then(res => {
          const { code, data, message } = res.data;
          if (code == 0) {
            this.code = data;
          } else {
            this.$message.error(message);
          }
        });
      }
      this.$emit("update:isOpen", val);
    }
  },
  methods: {
    // 复制激活码操作
    onCopy() {
      let input = document.createElement('input');
      input.setAttribute('readonly', 'readonly');
      input.setAttribute('value', this.code);
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, 9999);
      document.execCommand('Copy');
      document.body.removeChild(input);
    },
    // 导出激活码操作
    onExport() {
      // 创建下载对象和点击元素
      let urlObject = window.URL || window.webkitURL || window;
      let export_blob = new Blob([this.code]);
      let save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
      save_link.href = urlObject.createObjectURL(export_blob);
      save_link.download = '激活码.txt';
      // 派遣点击监听
      let ev = document.createEvent("MouseEvents");
      ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      save_link.dispatchEvent(ev);
    },
    onSubmit() {
      const { activeCode = '' } = this;
      activateAuth({ license: activeCode }).then(res => {
        const { code, message } = res.data;
        if (code == 0) {
          this.$message({
            message: '激活成功，请重新登录',
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.$store.dispatch("logOut").then(() => {
                this.$router.push("/login");
              });
            }
          });
        } else {
          this.$message.error(message);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.active-model {
  /deep/ {
    .el-dialog__body {
      padding-bottom: 10px;
    }
  }
  .wrapper {
    padding: 20px 0;
    margin: 0 30px;
    p {
      font-size: 14px;
      color: gray;
      margin-bottom: 12px;
    }
    section {
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      word-wrap: break-word;
      word-break: break-all;
    }
    .btn-group {
      padding-top: 12px;
      padding-bottom: 10px;
      text-align: right;
    }
  }
}
</style>