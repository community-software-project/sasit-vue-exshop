<template>
    <div class="restContainer">
        <head-top head-title="重置密码" goBack="true"></head-top>
        <form class="restForm">
            <section class="input_container">
                <input type="text" placeholder="请输入新密码" name="newPassWord" v-model="newPassWord">
            </section>
            <section class="input_container">
                <input type="text" placeholder="请确认密码" name="confirmPassWord" v-model="confirmPassWord">
            </section>
            <!--<section class="input_container captcha_code_container">-->
                <!--<input type="text" placeholder="验证码" name="mobileCode" maxlength="6" v-model="mobileCode">-->
                <!--<div class="img_change_img">-->
                    <!--<img v-show="captchaCodeImg" :src="captchaCodeImg">-->
                    <!--<div class="change_img" @click="getCaptchaCode">-->
                        <!--<p>看不清</p>-->
                        <!--<p>换一张</p>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</section>-->
        </form>
        <div class="login_container" @click="initializeButton">确认修改</div>
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import alertTip from 'src/components/common/alertTip'
    import {mobileCode, checkExsis, sendMobile, changePassword} from 'src/service/getData'
    import http from "../../global/http-protocol";
    import api from "../../global/http-api-config";

    export default {
        data(){
            return {
                phoneNumber: null, //电话号码
                oldPassWord: null,
                newPassWord: null, //新密码
                rightPhoneNumber: false, //输入的手机号码是否符合要求
                confirmPassWord: null, //确认密码
                captchaCodeImg: null, //验证码地址
                mobileCode: null, //短信验证码
                computedTime: 0, //倒数记时
                showAlert: false, //显示提示组件
                alertText: null, //提示的内容
                accountType: 'mobile',//注册方式
                captchaCodeImg: null,
            }
        },
        components: {
            headTop,
            alertTip,
        },
        created(){
//          this.getCaptchaCode();
          this.phoneNumber = this.$route.query.phoneNumber;
        },
        methods: {
            //判断输入的电话号码
            inputPhone(){
                if(/.+/gi.test(this.phoneNumber)){
                    this.rightPhoneNumber = true;
                }else{
                    this.rightPhoneNumber = false;
                }
            },
            //获取验证吗
            async getVerifyCode(){
                if (this.rightPhoneNumber) {
                    this.computedTime = 30;
                    //倒计时
                    this.timer = setInterval(() => {
                        this.computedTime --;
                        if (this.computedTime == 0) {
                            clearInterval(this.timer)
                        }
                    }, 1000)
                    //判断用户是否存在
                    let res = await checkExsis(this.phoneNumber, this.accountType);
                    //判断返回的信息是否正确，用户是否注册
                    if (res.message) {
                        this.showAlert = true;
                        this.alertText = res.message;
                        return
                    }else if(!res.is_exists) {
                        this.showAlert = true;
                        this.alertText = '您输入的手机号尚未绑定';
                        return
                    }
                    //获取验证信息
//                    let getCode = await mobileCode(this.phoneNumber);
//                    if (getCode.message) {
//                        this.showAlert = true;
//                        this.alertText = getCode.message;
//                        return
//                    }
//                    this.validate_token = getCode.validate_token;
                }
            },
          //验证码
//             async getCaptchaCode(){
//                let res = await getcaptchas();
//                this.captchaCodeImg = res.code;
//            },
            //初始化密码
            async initializeButton(){
               let _self = this;
                if(!_self.newPassWord){
                  _self.showAlert = true;
                  _self.alertText = '请输入新密码';
                    return
                }else if(!_self.confirmPassWord){
                  _self.showAlert = true;
                  _self.alertText = '请输确认密码';
                    return
                }else if(_self.newPassWord !== _self.confirmPassWord){
                  _self.showAlert = true;
                  _self.alertText = '两次输入的密码不一致';
                    return
                }
//                else if(!_self.mobileCode){
//                  _self.showAlert = true;
//                  _self.alertText = '请输验证码';
//                    return
//                }

              let url = api.expressBase+api.customers+api.osPlatformSeparator+_self.phoneNumber+api.osPlatformSeparator+'initialize';
              let slat = 3;
              let Base64 = require('js-base64').Base64;
              let base64code = Base64.encode(_self.confirmPassWord);
              let pd = _self.handleStr(base64code,slat);
              let password = _self.arrayToStr(pd);
              let data = {
                "password" : password
              }
              var res = http.put(url, data, api.headers);
              res.then(async function (res) {
                if(res.data.TAG == true){
                  _self.routeToLogin();
                } else {
                  _self.showAlert = true;
                  _self.alertText = res.data.MSG ;
                }
              });
            },
            closeTip(){
                this.showAlert = false;
            },
          routeToLogin(){
            this.$router.push('/login');
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
        }
    }

</script>

<style lang="scss" scoped>
    @import '../../../src/style/mixin';

    .restContainer{
        padding-top: 1.95rem;
    }
    .restForm{
        background-color: #fff;
        margin-top: .6rem;
        .input_container{
            display: flex;
            justify-content: space-between;
            padding: .6rem .8rem;
            border-bottom: 1px solid #f1f1f1;
            input{
                @include sc(.7rem, #666);
            }
            button{
                @include sc(.65rem, #fff);
                font-family: Helvetica Neue,Tahoma,Arial;
                padding: .28rem .4rem;
                border: 1px;
                border-radius: 0.15rem;
            }
            .right_phone_number{
                background-color: #4cd964;
            }
        }
        .phone_number{
            padding: .3rem .8rem;
        }
        .captcha_code_container{
            height: 2.2rem;
            .img_change_img{
                display: flex;
                align-items: center;
                img{
                    @include wh(3.5rem, 1.5rem);
                    margin-right: .2rem;
                }
                .change_img{
                    display: flex;
                    flex-direction: 'column';
                    flex-wrap: wrap;
                    width: 2rem;
                    justify-content: center;
                    p{
                        @include sc(.55rem, #666);
                    }
                    p:nth-of-type(2){
                        color: #3b95e9;
                        margin-top: .2rem;
                    }
                }
            }
        }
    }
    .captcha_code_container{
        height: 2.2rem;
        .img_change_img{
            display: flex;
            align-items: center;
            img{
                @include wh(3.5rem, 1.5rem);
                margin-right: .2rem;
            }
            .change_img{
                display: flex;
                flex-direction: 'column';
                flex-wrap: wrap;
                width: 2rem;
                justify-content: center;
                p{
                    @include sc(.55rem, #666);
                }
                p:nth-of-type(2){
                    color: #3b95e9;
                    margin-top: .2rem;
                }
            }
        }
    }
    .login_container{
        margin: 1rem .5rem;
        @include sc(.7rem, #fff);
        background-color: #4cd964;
        padding: .5rem 0;
        border: 1px;
        border-radius: 0.15rem;
        text-align: center;
    }
</style>
