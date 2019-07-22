<template>
  <div class="app-login">
    <div class="loginBox">
      <h3 style="text-align:center;margin-bottom:10px;">马拉后台统一登陆</h3>
      <Form ref="formLogin" :model="formLogin" :rules="ruleLogin">
        <Form-item prop="username">
          <Input
            type="text"
            v-model="formLogin.username"
            placeholder="Username"
          >
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </Form-item>
        <Form-item prop="password">
          <Input
            type="password"
            v-model="formLogin.password"
            placeholder="Password"
            @on-enter="handleSubmit('formLogin')"
          >
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </Input>
        </Form-item>
        <Form-item>
          <Button
            style="width:300px"
            type="primary"
            @click="handleSubmit('formLogin')"
            >登录</Button
          >
        </Form-item>
      </Form>
    </div>
    <canvas ref="canvas"></canvas>
  </div>
</template>
<style lang="less" scoped>
.loginBox {
  width: 300px;
  position: absolute;
  left: 40%;
  top: 30%;
}
canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
<script>
export default {
  data() {
    return {
      formLogin: {
        username: "",
        password: ""
      },
      ruleLogin: {
        username: [
          { required: true, message: "请填写用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请填写密码", trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: "密码长度不能小于6位",
            trigger: "blur"
          }
        ]
      }
    };
  }
};
</script>
