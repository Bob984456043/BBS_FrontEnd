<template>
<div class="header">
  <!-- 顶部导航栏-->
  <div class="header-wrap">
    <div class="logo">TOP</div>
    <ul class="top-right">
      <li>
        <router-link to="/">首页</router-link>
      </li>
      <li v-if="usrStatus">
        <router-link to="/publish">发布</router-link>
      </li>
      <li v-if="usrStatus"><a href="javascript:void(0)">{{this.usrStatus.username}} 你好!</a></li>
      <li v-if="usrStatus"><a @click="exit" href="javascript:void(0)">退出登陆</a></li>
      <li v-else><a @click="login" href="javascript:void(0)">登陆</a></li>
      <li v-if="!usrStatus"><a @click="register" href="javascript:void(0)">注册</a></li>
    </ul>
  </div>
  <!--控制显示登陆注册-->
  <div id="usercontrol" class="user-control">
    <div class="back-shadow"></div>
    <div class="animated bounceInDown info-box">
      <div class="upper">
        <span>登陆/注册</span>
        <a href="javascript:void(0)" @click="closeBox">ㄨ</a>
      </div>
      <div class="middle">
        <div>
          <span>用户名</span>
          <input type="text" v-model="username">
        </div>

        <div>
          <span>密码</span>
          <input type="text" v-model="password">
        </div>

        <div id="register-toggle" class="register-toggle" style="display: none">
          <span>邮箱</span>
          <input type="text" v-model="email">
        </div>

        <button id="loginbtn" type="button" @click="dologin">登陆</button>
        <button id="registerbtn" type="button" @click="dosignup">注册</button>
      </div>
    </div>

  </div>

</div>
</template>

<script>
import config from "../assets/config"
import animate from 'animate.css'
export default {
  name: "header",
  data() {
    return {
      test: '',
      usrStatus: {},
      password: '',
      username: '',
      email: '',
    }
  },
  methods: {
    login() {
      const usercontrol = document.getElementById('usercontrol');
      usercontrol.style.display = 'block';
      document.getElementById('loginbtn').style.display = 'block'
      document.getElementById('registerbtn').style.display = 'none'
    },
    register() {
      const usercontrol = document.getElementById('usercontrol');
      usercontrol.style.display = 'block';
      const toggle = document.getElementById('register-toggle');
      toggle.style.display = 'block'
      document.getElementById('loginbtn').style.display = 'none'
      document.getElementById('registerbtn').style.display = 'block'
    },
    closeBox() {
      const a = document.getElementById('usercontrol');
      a.style.display = 'none';
      const toggle = document.getElementById('register-toggle');
      toggle.style.display = 'none'
    },
    exit() {
      this.usrStatus = 0;
      localStorage.clear('userdata');
      this.$router.push({
        path: "/",
        query: {
          t: Date.now(),
        },
      });
    },
    getUsrStatus() {
      this.usrStatus = JSON.parse(localStorage.getItem('userdata'))
    },
    dologin() {
      if (this.username == '' || this.password == '')
        alert('请输入用户名和密码！')
      else
        this.$axios.post(config.ajaxUrl + 'blog/user/login', {
          username: this.username,
          password: this.password
        })
        .then((res) => {
          if (res.status == 200) {
            localStorage.setItem('userdata', JSON.stringify(res.data));
            // 跳转到首页
            this.$router.push({
              path: "/",
              query: {
                t: Date.now(),
              },
            });
            // 关闭登录框
            this.closeBox()
            this.getUsrStatus()
            this.username = '';
            this.password = '';
          } else {
            alert('用户名或密码错误')
          }
        })
        .catch((err) => {
          console.log('err')
        })
    },

    dosignup() {
      if (this.password == '' || this.username == '' || this.email == '')
        alert('请补全信息')
      else
        this.$axios.post(config.ajaxUrl + 'blog/user/register', {
          username: this.username,
          password: this.password,
          email: this.email
        })
        .then((res) => {
          localStorage.setItem('userdata', JSON.stringify(res.data));
          // 跳转到首页
          this.$router.push({
            path: "/",
            query: {
              t: Date.now(),
            },
          });
          // 关闭登录框
          this.closeBox();
          this.username = ''
          this.password = ''
          this.email = ''
          alert("注册成功")
        })
        .catch((err) => {
          console.log('err')
        })

    },

  },
  created() {
    this.getUsrStatus()
  },
}
</script>

<style lang="scss" scoped>
.header {
  z-index: 700;
  position: relative;
  width: 100%;
  background: #ffffff;
  border-bottom: 1px lightgray solid;

  .header-wrap {
    position: relative;
    margin: 0 auto;
    width: 800px;
    height: 80px;
  }

  .logo {
    position: absolute;
    top: 25px;
    left: 0px;
    font-family: Helvetica;
    font-size: 30px;
    background: -webkit-linear-gradient(to right, #67B26F, #4ca2cd);
    /* Safari 5.1 - 6.0 */
    background: linear-gradient(to right, #67B26F, #4ca2cd);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

ul {
  position: absolute;
  top: 13px;
  right: 14px;
  /*display: inline-block;*/
  background: -webkit-linear-gradient(to right, #67B26F, #4ca2cd);
  background: linear-gradient(to right, #67B26F, #4ca2cd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-left: 20px;

  li {
    list-style: none;
    display: inline;
    margin-left: 15px;
    /*    不能有position：relative*/
    /*    不能有inline-block*/
  }

  a {
    font-size: 20px;
    text-decoration: none;
    font-family: 微软雅黑;
  }

  /*为了颜色渐变 与下面的动态下划线不兼容（只有firefox兼容）*/
  /*a::after{*/
  /*    content: '';*/
  /*    width: 10px;*/
  /*    height: 10px;!*设置伪元素的高度，这里是下划线的粗细*!*/
  /*    position: absolute;*/
  /*    top: 100%;!* 放置底部 *!*/
  /*    left: 0; !* 放置底部 *!*/
  /*    background:-webkit-linear-gradient(to right,#67B26F,#4ca2cd);*/
  /*    background:linear-gradient(to right,#67B26F,#4ca2cd);*/
  /*    !*设置动画  *!*/
  /*    transform: scale(0); !* 未hover时不可见 *!*/
  /*    transition:all .45s;*/
  /*    transform-origin: center;*/
  /*}*/
  /*a:hover::after{*/
  /*    transform: scale(1);*/
  /*}*/
}

.user-control {
  height: 100%;
  position: relative;
  z-index: 800;
  display: none; //初始display为none
}

.back-shadow {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  background: #000000;
  opacity: 0.3;
  width: 100%;
  height: 100%;
}

.info-box {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  background: #fff;
  position: fixed;
  width: 400px;
  height: 300px;
  top: 50%;
  left: 50%;
  margin-left: -180px;
  margin-top: -150px;
  z-index: 99999999999;
  border-radius: 10px;
}

.upper {
  background: #77b289;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 10%;
  color: white;

  span {
    position: absolute;
    top: 8px;
    left: 40%;
    font-family: Arial;
    color: white;
    font-size: 18px;
  }

  a {
    font-size: 18px;
    position: absolute;
    top: 8px;
    right: 8px;
    font-family: Arial;
    color: white;
    text-decoration: none;
  }
}

.middle {
  width: 320px;
  padding: 10px;
  margin: 0 auto;

  div {
    width: 300px;
    margin: 0 auto;

    span {
      display: block;
      margin-bottom: 6px;
      margin-top: 6px;
    }

    input {
      width: 290px;
    }
  }

  button {
    margin-left: 90px;
    width: 130px;
    height: 30px;
    margin-top: 20px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    text-align: center;
    background: #8ab5ed;
    color: whitesmoke;
    border: none;
  }

}
</style>
