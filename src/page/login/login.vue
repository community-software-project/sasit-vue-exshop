<template>
  <div class="loginContainer">
    <head-top :head-title="loginWay? '登录':'密码登录'" goBack="true">
      <!-- <div slot="changeLogin" class="change_login" @click="changeLoginWay">{{loginWay? "密码登录":"短信登录"}}</div> -->
    </head-top>
    <form class="loginForm" v-if="loginWay">
      <section class="input_container phone_number">
        <input type="text" placeholder="账号密码随便输入" name="phone" maxlength="11" v-model="phoneNumber">
        <button @click.prevent="getVerifyCode" :class="{right_phone_number:rightPhoneNumber}" v-show="!computedTime">
          获取验证码
        </button>
        <button @click.prevent v-show="computedTime">已发送({{computedTime}}s)</button>
      </section>
      <section class="input_container">
        <input type="text" placeholder="验证码" name="mobileCode" maxlength="6" v-model="mobileCode">
      </section>
    </form>
    <form class="loginForm" v-else>
      <section class="input_container">
        <input type="text" placeholder="手机号码" v-model.lazy="userAccount">
      </section>
      <!--<section class="input_container">-->
      <!--<router-link :to='{path: "/confirmOrder/remark", query: {id: 1, sig: 1}}' class="">-->
      <!--<span STYLE="font-size: 16px; color: #7b7b7b;">所属区域</span>-->
      <!--</router-link>-->
      <!--</section>-->
      <section class="input_container">
        <input v-if="!showPassword" type="password" placeholder="密码" v-model="passWord">
        <input v-else type="text" placeholder="密码" v-model="passWord">
        <div class="button_switch" :class="{change_to_text: showPassword}">
          <div class="circel_button" :class="{trans_to_right: showPassword}" @click="changePassWordType"></div>
          <span>ABC</span>
          <span>...</span>
        </div>
      </section>
      <!--<section class="input_container captcha_code_container">-->
        <!--<input type="text" placeholder="验证码" maxlength="4" v-model="codeNumber">-->
        <!--<div class="img_change_img">-->
          <!--<img v-show="captchaCodeImg" :src="captchaCodeImg">-->
          <!--<div class="change_img" @click="getCaptchaCode">-->
            <!--<p>看不清</p>-->
            <!--<p>换一张</p>-->
          <!--</div>-->
        <!--</div>-->
      <!--</section>-->
    </form>
    <p class="login_tips">
      温馨提示：未注册过的账号，登录时将自动注册
    </p>
    <div class="login_container" @click="mobileLogin">登 录</div>
    <router-link to="/forget" class="to_forget" v-if="!loginWay">重置密码？</router-link>
    <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
  </div>
</template>

<script>
  import headTop from '../../components/header/head';
  import alertTip from '../../components/common/alertTip';
  import {localapi, proapi, imgBaseUrl} from 'src/config/env';
  import {mapState, mapMutations} from 'vuex';
  import {mobileCode, checkExsis, sendLogin, accountLogin} from '../../service/getData';
  import http from "../../global/http-protocol";
  import api from "../../global/http-api-config";
  import {setStore} from '../../config/mUtils';

  export default {
    data() {
      return {
        loginWay: false, //登录方式，默认短信登录
        showPassword: false, // 是否显示密码
        phoneNumber: null, //电话号码
        mobileCode: null, //短信验证码
        validate_token: null, //获取短信时返回的验证值，登录时需要
        computedTime: 0, //倒数记时
        userInfo: null, //获取到的用户信息
        customerInfo: null,
        userAccount: null, //用户名
        passWord: null, //密码
        captchaCodeImg: null, //验证码地址
        codeNumber: null, //验证码
        showAlert: false, //显示提示组件
        alertText: null, //提示的内容

      }
    },
    created() {
//      this.getCaptchaCode();
    },
    components: {
      headTop,
      alertTip,
    },
    computed: {
      //判断手机号码
      rightPhoneNumber: function () {
        return /^1\d{10}$/gi.test(this.phoneNumber)
      }
    },
    methods: {
      ...mapMutations([
        'RECORD_USERINFO',
        'RECORD_CUSTOMER_INFO',
      ]),
      //改变登录方式
      changeLoginWay() {
        this.loginWay = !this.loginWay;
      },
      //是否显示密码
      changePassWordType() {
        this.showPassword = !this.showPassword;
      },
      //获取验证吗，线上环境使用固定的图片，生产环境使用真实的验证码
//      async getCaptchaCode() {
//        let res = await getcaptchas();
//        this.captchaCodeImg = res.code;
//      },
      //获取短信验证码
      async getVerifyCode() {
        if (this.rightPhoneNumber) {
          this.computedTime = 30;
          this.timer = setInterval(() => {
            this.computedTime--;
            if (this.computedTime == 0) {
              clearInterval(this.timer)
            }
          }, 1000)
          //判读用户是否存在
          let exsis = await checkExsis(this.phoneNumber, 'mobile');
          if (exsis.message) {
            this.showAlert = true;
            this.alertText = exsis.message;
            return
          } else if (!exsis.is_exists) {
            this.showAlert = true;
            this.alertText = '您输入的手机号尚未绑定';
            return
          }
          //发送短信验证码
          let res = await mobileCode(this.phoneNumber);
          if (res.message) {
            this.showAlert = true;
            this.alertText = res.message;
            return
          }
          this.validate_token = res.validate_token;
        }
      },
      //发送登录信息
      async mobileLogin() {
        if (this.loginWay) {
          if (!this.rightPhoneNumber) {
            this.showAlert = true;
            this.alertText = '手机号码不正确';
            return;
          } else if (!(/^\d{6}$/gi.test(this.mobileCode))) {
            this.showAlert = true;
            this.alertText = '短信验证码不正确';
            return;
          }
          //手机号登录
//          this.userInfo = await sendLogin(this.mobileCode, this.phoneNumber, this.validate_token);
//          await this.checkCustomers(this.phoneNumber);
        } else {
          if (!this.userAccount) {
            this.showAlert = true;
            this.alertText = '请输入手机号';
            return
          } else if (!this.passWord) {
            this.showAlert = true;
            this.alertText = '请输入密码';
            return
          }
//          else if (!this.codeNumber) {
//            this.showAlert = true;
//            this.alertText = '请输入验证码';
//            return
//          }
          //用户名登录
//          this.userInfo = await accountLogin(this.userAccount, this.passWord, this.codeNumber);
          await this.checkCustomers(this.userAccount,this.passWord);
        }
      },
      async checkCustomers(phoneNumber,passWord){
        let _self = this;
        let enPassWord = _self.encodePassWord(passWord);
        let url = api.expressBase+api.customers+api.osPlatformSeparator+
          phoneNumber+api.osPlatformSeparator+
          enPassWord+api.osPlatformSeparator+'isExistByPermission';
        var res = http.get(url, '', api.headers);
        res.then(async function (res) {
          let count = res.data.COUNT;
          let isCustomerExist = res.data.IS_CUSTOMER_EXIST;
          let loginFrequency = res.data.LOGIN_FREQUENCY;
//          console.info(JSON.stringify(res.data.CUSTOMER_INFO));
          if(!isCustomerExist){
            let data = _self.getLoginData(passWord);
            let url = api.expressBase+api.customers;
            let addRes = await http.post(url, data, api.headers);
            if(addRes.status == 201 || addRes.status ==200) {
              setStore("phoneNumber",phoneNumber)
              _self.RECORD_CUSTOMER_INFO(addRes.data);
              _self.selectServiceArea(isCustomerExist);
            } else {
              this.showAlert = true;
              this.alertText = '服务器忙，请稍后再试';
              return;
            }
          } else if(isCustomerExist && loginFrequency == 0){
            _self.RECORD_CUSTOMER_INFO(res.data.CUSTOMER_INFO);
            let url = api.expressBase+api.customers+api.osPlatformSeparator+phoneNumber+api.osPlatformSeparator+'initialize';
            let slat = 3;
            let Base64 = require('js-base64').Base64;
            let base64code = Base64.encode(passWord);
            let pd = _self.handleStr(base64code,slat);
            let password = _self.arrayToStr(pd);
            let data = {
              "password" : password
            }
            var res = http.put(url, data, api.headers);
            res.then(async function (initializeRes) {
              if(initializeRes.data.TAG == true){
                setStore("phoneNumber",phoneNumber)
                let tempShopCode = res.data.CUSTOMER_INFO.SERVICE_SHOP_CODE;
                if(tempShopCode == ''){
                  _self.selectServiceArea(isCustomerExist);
                } else {
                  _self.$router.go(-1);
                }
              } else {
                _self.showAlert = true;
                _self.alertText = initializeRes.data.MSG ;
              }
            });
          } else if(isCustomerExist && loginFrequency > 0){
            if(res.data.PERMISSION){
              let tempShopCode = res.data.CUSTOMER_INFO.SERVICE_SHOP_CODE;
              if(tempShopCode == ''){
                _self.selectServiceArea(isCustomerExist);
              } else {
                setStore("phoneNumber",phoneNumber)
                _self.RECORD_CUSTOMER_INFO(res.data.CUSTOMER_INFO);
                _self.$router.go(-1);
              }
            } else {
              _self.showAlert = true;
              _self.alertText = '密码错误';
            }
          }

        });
      },
      getLoginData(passWord){
        let slat = 3;
        let Base64 = require('js-base64').Base64;
        var base64code = Base64.encode(passWord);
        var pd = this.handleStr(base64code,slat);
        var password = this.arrayToStr(pd);
        let loginData = {
          "name" : this.userAccount,
          "password" : password,
          "phoneNumber" : this.userAccount,
        }
//        console.info('getLoginData:'+password)
        return loginData;
      },
      encodePassWord(passWord){
        let slat = 3;
        let Base64 = require('js-base64').Base64;
        var base64code = Base64.encode(passWord);
        var pd = this.handleStr(base64code,slat);
        var password = this.arrayToStr(pd);
        console.info('encodePassWord:'+password)
        return password;
      },
      selectServiceArea(isCustomerExist){
//        this.SAVE_QUESTION({title, detail: this.questionDetail[index]});
//        this.$router.push('/selectServiceArea');
        this.$router.push({path:'/selectServiceArea', query:{isCustomerExist:isCustomerExist}})
      },
      initializeCustomerPassword(){
        this.$router.push({path:'/initializePassword', query:{phoneNumber:this.userAccount}})
      },
      closeTip(){
        this.showAlert = false;
      },
      handleStr(str, slat) {
        let _self = this;
        if (str) {
          var _mv = _self.getModulo(str, slat);
          var subArray;
          if (_mv == 0) {
            subArray = _self.setArrayPart(str, slat);
          } else {
            var strLength = str.length;
            var mod = str.slice(-_mv);
            var main = str.slice(0, strLength - _mv);
            subArray = _self.setArrayPart(main, slat);
            subArray.push(mod);
          }
        }
        return subArray;
      },
      setArrayPart(_l_str, slat) {
        let _self = this;
        var strLength = _l_str.length;
        var _ptl = strLength / slat;
        var subArray = new Array();
        for (var a = 0; a < slat; ++a) {
          var st = _self.reverseStr(_l_str.substr(_ptl * a, _ptl));
          subArray.push(st);
        }
        return subArray;
      },
      reverseStr(str) {
        if (str) {
          return str.split("").reverse().join("");
        }
      },
      getModulo(str, slat) {
        var strLength = str.length;
        return strLength % slat;
      },
      arrayToStr(arrayObj){
        if(typeof(arrayObj) == "object") {
          var objStr = '';
          for(var a = 0; a < arrayObj.length ; ++a){
            objStr += arrayObj[a];
          }
          return objStr;
        } else {
          return arrayObj;
        }
      },
    },

  }

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';

  .loginContainer {
    padding-top: 1.95rem;
    p, span, input {
      font-family: Helvetica Neue, Tahoma, Arial;
    }
  }

  .change_login {
    position: absolute;
    @include ct;
    right: 0.75rem;
    @include sc(.7rem, #fff);
  }

  .loginForm {
    background-color: #fff;
    margin-top: .6rem;
    .input_container {
      display: flex;
      justify-content: space-between;
      padding: .6rem .8rem;
      border-bottom: 1px solid #f1f1f1;
      input {
        @include sc(.7rem, #666);
      }
      button {
        @include sc(.65rem, #fff);
        font-family: Helvetica Neue, Tahoma, Arial;
        padding: .28rem .4rem;
        border: 1px;
        border-radius: 0.15rem;
      }
      .right_phone_number {
        background-color: #4cd964;
      }
    }
    .phone_number {
      padding: .3rem .8rem;
    }
    .captcha_code_container {
      height: 2.2rem;
      .img_change_img {
        display: flex;
        align-items: center;
        img {
          @include wh(3.5rem, 1.5rem);
          margin-right: .2rem;
        }
        .change_img {
          display: flex;
          flex-direction: 'column';
          flex-wrap: wrap;
          width: 2rem;
          justify-content: center;
          p {
            @include sc(.55rem, #666);
          }
          p:nth-of-type(2) {
            color: #3b95e9;
            margin-top: .2rem;
          }
        }
      }
    }
  }

  .login_tips {
    @include sc(.5rem, red);
    padding: .4rem .6rem;
    line-height: .5rem;
    a {
      color: #3b95e9;
    }
  }

  .login_container {
    margin: 0 .5rem 1rem;
    @include sc(.7rem, #fff);
    background-color: #4cd964;
    padding: .5rem 0;
    border: 1px;
    border-radius: 0.15rem;
    text-align: center;
  }

  .button_switch {
    background-color: #c7ccc2;
    display: flex;
    justify-content: center;
    @include wh(2rem, .7rem);
    padding: 0 .2rem;
    border: 1px;
    border-radius: 0.5rem;
    position: relative;
    .circel_button {
      transition: all .3s;
      position: absolute;
      top: -0.2rem;
      z-index: 1;
      left: -0.3rem;
      @include wh(1.01rem, 1.01rem);
      box-shadow: 0 0.026667rem 0.053333rem 0 rgba(0, 0, 0, .1);
      background-color: #f1f1f1;
      border-radius: 50%;
    }
    .trans_to_right {
      transform: translateX(1.3rem);
    }
    span {
      @include sc(.45rem, #fff);
      transform: translateY(.05rem);
      line-height: .6rem;
    }
    span:nth-of-type(2) {
      transform: translateY(-.08rem);
    }
  }

  .change_to_text {
    background-color: #4cd964;
  }

  .to_forget {
    float: right;
    @include sc(.6rem, #3b95e9);
    margin-right: .3rem;
  }

  .sort_container {
    background-color: #fff;
    border-bottom: 0.025rem solid #f1f1f1;
    position: fixed;
    top: 1.95rem;
    right: 0;
    width: 100%;
    display: flex;
    z-index: 13;
    box-sizing: border-box;
    .sort_item {
      @include sc(0.55rem, #444);
      @include wh(33.3%, 1.6rem);
      text-align: center;
      line-height: 1rem;
      .sort_item_container {
        @include wh(100%, 100%);
        position: relative;
        z-index: 14;
        background-color: #fff;
        box-sizing: border-box;
        padding-top: .3rem;
        .sort_item_border {
          height: 1rem;
          border-right: 0.025rem solid $bc;
        }
      }
      .sort_icon {
        vertical-align: middle;
        transition: all .3s;
        fill: #666;
      }

    }
    .choose_type {
      .sort_item_container {

        .category_title {
          color: $blue;
        }
        .sort_icon {
          transform: rotate(180deg);
          fill: $blue;
        }
      }
    }
    .showlist-enter-active, .showlist-leave-active {
      transition: all .3s;
      transform: translateY(0);
    }
    .showlist-enter, .showlist-leave-active {
      opacity: 0;
      transform: translateY(-100%);
    }
    .sort_detail_type {
      width: 100%;
      position: absolute;
      display: flex;
      top: 1.6rem;
      left: 0;
      border-top: 0.025rem solid $bc;
      background-color: #fff;
    }
    .category_container {
      .category_left {
        flex: 1;
        background-color: #f1f1f1;
        height: 16rem;
        overflow-y: auto;
        span {
          @include sc(0.5rem, #666);
          line-height: 1.8rem;
        }
        .category_left_li {
          @include fj;
          padding: 0 0.5rem;
          .category_icon {
            @include wh(.8rem, .8rem);
            vertical-align: middle;
            margin-right: .2rem;
          }
          .category_count {
            background-color: #ccc;
            @include sc(.4rem, #fff);
            padding: 0 .1rem;
            border: 0.025rem solid #ccc;
            border-radius: 0.8rem;
            vertical-align: middle;
            margin-right: 0.25rem;
          }
          .category_arrow {
            vertical-align: middle;
          }
        }
        .category_active {
          background-color: #fff;
        }
      }
      .category_right {
        flex: 1;
        background-color: #fff;
        padding-left: 0.5rem;
        height: 16rem;
        overflow-y: auto;
        .category_right_li {
          @include fj;
          height: 1.8rem;
          line-height: 1.8rem;
          padding-right: 0.5rem;
          border-bottom: 0.025rem solid $bc;
          span {
            color: #666;
          }
        }
        .category_right_choosed {
          span {
            color: $blue;
          }
        }
      }
    }
    .sort_list_container {
      width: 100%;
      .sort_list_li {
        height: 2.5rem;
        display: flex;
        align-items: center;
        svg {
          @include wh(0.7rem, 0.7rem);
          margin: 0 .3rem 0 .8rem;
        }
        p {
          line-height: 2.5rem;
          flex: auto;
          text-align: left;
          text-indent: 0.25rem;
          border-bottom: 0.025rem solid $bc;
          @include fj;
          align-items: center;
          span {
            color: #666;
          }
        }
        .sort_select {
          span {
            color: $blue;
          }
        }
      }
    }
    .filter_container {
      flex-direction: column;
      align-items: flex-start;
      min-height: 10.6rem;
      background-color: #f1f1f1;
      .filter_header_style {
        @include sc(0.4rem, #333);
        line-height: 1.5rem;
        height: 1.5rem;
        text-align: left;
        padding-left: .5rem;
        background-color: #fff;
      }
      .filter_ul {
        display: flex;
        flex-wrap: wrap;
        padding: 0 0.5rem;
        background-color: #fff;
        .filter_li {
          display: flex;
          align-items: center;
          border: 0.025rem solid #eee;
          @include wh(4.7rem, 1.4rem);
          margin-right: 0.25rem;
          border-radius: 0.125rem;
          padding: 0 0.25rem;
          margin-bottom: 0.25rem;
          svg {
            @include wh(.8rem, .8rem);
            margin-right: 0.125rem;
          }
          span {
            @include sc(0.4rem, #333);
          }
          .filter_icon {
            @include wh(3.0rem, .8rem);
            font-size: 0.5rem;
            border: 0.025rem solid $bc;
            border-radius: 0.15rem;
            margin-right: 0.25rem;
            line-height: .8rem;
            text-align: center;
          }
          .activity_svg {
            margin-right: .25rem;
          }
          .selected_filter {
            color: $blue;
          }
        }
      }
      .confirm_filter {
        display: flex;
        background-color: #f1f1f1;
        width: 100%;
        padding: .3rem .2rem;
        .filter_button_style {
          @include wh(100%, 1.8rem);
          font-size: 0.8rem;
          line-height: 1.8rem;
          border-radius: 0.2rem;
        }
        .clear_all {
          background-color: #fff;
          margin-right: .5rem;
          border: 0.025rem solid #fff;
        }
        .confirm_select {
          background-color: #56d176;
          color: #fff;
          border: 0.025rem solid #56d176;
          span {
            color: #fff;
          }
        }
      }
    }
  }

  .showcover-enter-active, .showcover-leave-active {
    transition: opacity .3s
  }

  .showcover-enter, .showcover-leave-active {
    opacity: 0
  }

  .back_cover {
    position: fixed;
    @include wh(100%, 100%);
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.3);
  }
</style>
