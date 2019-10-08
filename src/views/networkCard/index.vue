<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" v-if="nameList.length">
      <el-form-item label="网卡" prop="name">
        <el-select v-model="form.name" @change="onNameChange">
          <el-option v-for="(item,index) in nameList" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模式" prop="method">
        <el-radio v-model="form.method" label="static">静态</el-radio>
        <el-radio v-model="form.method" label="dhcp">DHCP</el-radio>
        <el-radio v-model="form.method" label="loopback">LOOPBACK</el-radio>
      </el-form-item>
      <el-form-item label="MAC地址" prop="mac">
        <el-input v-model="form.mac" readonly />
      </el-form-item>
      <el-form-item label="IPV4地址" prop="ipv4">
        <el-input v-model="form.ipv4" :readonly="form.model=='dhcp'" />
      </el-form-item>
      <el-form-item label="子网掩码" prop="mask">
        <el-input v-model="form.mask" :readonly="form.model=='dhcp'" />
      </el-form-item>
      <el-form-item label="默认网关" prop="gateway">
        <el-input v-model="form.gateway" :readonly="form.model=='dhcp'" />
      </el-form-item>
      <el-form-item label="首选DNS" prop="dns">
        <el-input v-model="form.dns" />
      </el-form-item>
      <el-form-item label="备用DNS" prop="dns2">
        <el-input v-model="form.dns2" />
      </el-form-item>
      <el-form-item label="是否开机自启动" prop="is_auto">
        <el-switch v-model="form.is_auto" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" v-permission="'commonMan:btn_update_network_card'">保 存</el-button>
      </el-form-item>
    </el-form>
    <div class="tip" v-else>未查询到网卡信息</div>
  </div>
</template>
<script>
import { formValidate } from "@/utils";
import { getNetworkCardList, postNetworkCard } from "@/api/networkCard";

export default {
  name: "networkCard",
  data: () => ({
    form: {
      name: null,
      ipv4: null,
      method: "static",
      mac: null,
      mask: null,
      gateway: null,
      dns: null,
      dns2: null,
      is_auto: true
    },
    rules: {
      ipv4: { validator: formValidate.ip },
      mask: { validator: formValidate.ip },
      gateway: { validator: formValidate.ip },
      dns: { validator: formValidate.ip },
      dns2: { validator: formValidate.ip }
    },

    listData: [],
    nameList: [],
    currentIndex: 0
  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      getNetworkCardList().then(res => {
        if (res.status == 200) {
          const result = res.data || {};
          this.listData = result.data;
          this.nameList = this.listData.map(item => item.name);
          const form = this.listData[this.currentIndex];
          this.form = { ...form, is_auto: Boolean(form.is_auto) };
        }
      });
    },
    onNameChange(val) {
      this.currentIndex = this.nameList.indexOf(val);
      const form = this.listData[this.currentIndex];
      this.form = { ...form, is_auto: Boolean(form.is_auto) };
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return false;

        this.$confirm(`修改网卡信息将会重启服务器，是否继续？`, "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          confirmButtonClass: "el-button--mini",
          cancelButtonClass: "el-button--mini fr",
          type: "warning"
        }).then(() => {
          postNetworkCard(this.form).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "保存成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            if (isSuccess) {
              this.init();
            }
          });
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  height: 100%;
  overflow: auto;
  .el-select {
    width: 100%;
  }
  .el-form {
    width: 500px;
    margin: 30px auto;
  }
  .tip {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 600px;
    height: 30px;
    line-height: 30px;
    margin: -15px 0 0 -300px;
    text-align: center;
    font-size: 16px;
    color: #666;
  }
}
</style>
