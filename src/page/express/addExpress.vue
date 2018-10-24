<template>
  <div class="expressFormContainer">
    <head-top head-title="快递入库" goBack="true">
    </head-top>
    <form class="loginForm">
      <section class="input_container">
        <input type="text" placeholder="快递单号" v-model="expressNumber">
        <div>
          <img id="scanIcon" @click="doScanQR" src="../../images/barcode-scan.png">
        </div>
      </section>
      <section class="input_container provider-line">
        <input type="text" placeholder="快递服务商" v-model="expressProvider" disabled="disabled" class="provider-line">
      </section>
      <section class="input_container">
        <input type="text" placeholder="手机号码" v-model="userAccount" @keyup="getCustomersByPhoneTail(userAccount)">
      </section>
      <section class="input_container">
        <input type="text" placeholder="收件人姓名" v-model="userName">
      </section>
    </form>
    <div class="radioDiv">
      <table width="100%" height="100%">
        <tr>
          <td>
            <radio name="robot" value="S" label="S" v-model="radioValue" v-on:input="getExpressExpressLocation">上层
            </radio>
          </td>
          <td>
            <radio name="robot" value="X" label="X" v-model="radioValue" v-on:input="getExpressExpressLocation">下层
            </radio>
          </td>
          <td>
            <radio name="robot" value="H" label="H" v-model="radioValue" v-on:input="getExpressExpressLocation">信件
            </radio>
          </td>
          <td>
            <radio name="robot" value="Q" label="Q" v-model="radioValue" v-on:input="getExpressExpressLocation">异形
            </radio>
          </td>
        </tr>
        <tr>
          <td>
            <radio name="robot" value="Y" label="Y" v-model="radioValue" v-on:input="getExpressExpressLocation">特大硬包
            </radio>
          </td>
          <td>
            <radio name="robot" value="R" label="R" v-model="radioValue" v-on:input="getExpressExpressLocation">特大软包
            </radio>
          </td>
          <td colspan="2">
            <radio name="robot" value="D" label="D" v-model="radioValue" v-on:input="getExpressExpressLocation">
              地面(超大包裹)
            </radio>
          </td>
        </tr>
        <tr>
          <td colspan="4"><h3 class="location-hs">{{expressLocation}}</h3></td>
        </tr>
      </table>
    </div>
    <div class="express_container" @click="inExpress">入 库</div>
    <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    <ul class="uls">
      <li v-for="(item, index) in expressInfo" :key="item.LOGISTICS" class="letter_classify_li">
        {{item.RECIPIENT_NAME}} {{item.HIDDEN_PART_PHONE_NUMBER}} {{item.HIDDEN_PART_LOGISTICS}} {{item.EXPRESS_PROVIDER}} {{item.EXPRESS_lOCATION}}
      </li>
    </ul>
    <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
      <mu-list @itemClick="closeBottomSheet" style="height: 255px;overflow: scroll;">
        <mu-sub-header>
          请选择联系人
        </mu-sub-header>
        <mu-list-item v-for="item in customerOptions" :title="item.displayTitle" :value="item"/>
      </mu-list>
    </mu-bottom-sheet>

  </div>

</template>

<script>
  import headTop from '../../components/header/head';
  import alertTip from '../../components/common/alertTip';
  import {localapi, proapi, imgBaseUrl} from 'src/config/env';
  import {mapState, mapMutations} from 'vuex';
  import http from "../../global/http-protocol";
  import api from "../../global/http-api-config";
  import {getStore} from '../../config/mUtils';

  export default {
    data() {
      return {
        customerOptions:[],
        recipientPhone:'',
        bottomSheet: false,
        shopCode: '',
        expressInfo: [],
        userName: '',
        radioValue: '',
        expressLocation: '请选择货位',
        loginWay: false, //登录方式，默认短信登录H
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
        expressNumber: '',
        contactsObj: {},
        providerId: '',
        expressProvider: '',
        areaCode: '',

      }
    },
    created() {
      window.resultQRCode = this.resultQRCode;
      this.shopCode = this.$route.query.shopCode;
      this.phoneNumber = getStore('phoneNumber');
      this.isProviderContacts();
    },
    components: {
      headTop,
      alertTip,
    },
    computed: {
      //判断手机号码
//      rightPhoneNumber: function () {
//        return /^1\d{10}$/gi.test(this.phoneNumber)
//      }
    },
    methods: {
      closeBottomSheet (line) {
        this.bottomSheet = false;
        if(line != 'overlay') {
          this.userAccount = line.value.PHONE_NUMBER;
          this.userName =line.value.NAME;
        }
      },
      closeBottomSheetByNone (line) {
        this.bottomSheet = false;
      },
      openBottomSheet () {
        this.bottomSheet = true
      },
      //发送登录信息
      async inExpress() {
        let _self = this;
        let tag = this.checkInputForm();
        if (tag) {
          let expObj = {
            RECIPIENT_NAME: this.userName,
            PHONE_NUMBER: this.userAccount,
            HIDDEN_PART_PHONE_NUMBER: this.hiddenPartUserAccount(this.userAccount),
            LOGISTICS: this.expressNumber,
            HIDDEN_PART_LOGISTICS: this.hiddenPartLogistics(this.expressNumber),
            EXPRESS_PROVIDER: this.expressProvider,
            EXPRESS_lOCATION: this.expressLocation
          }
          let postData = {
            "recipientName": _self.userName,
            "phoneNumber": _self.userAccount,
            "logistics": _self.expressNumber,
            "expressServiceId": _self.providerId,
            "expressLocation": _self.expressLocation,
            "serviceShopCode": _self.shopCode,
            "areaCode": _self.areaCode,
            "operator": _self.phoneNumber,
          }
          let url = api.expressBase + api.express
          var res = http.post(url, postData, api.headers);
          res.then(async function (res) {
            console.info('post express:' + JSON.stringify(res))
            _self.expressInfo.push(expObj);
            _self.clearInExpressForm();
          });
        }
      },
      async getExpressExpressLocation() {
        let _self = this;
        let url = api.expressBase + api.express + api.osPlatformSeparator + _self.radioValue + api.osPlatformSeparator + this.shopCode
        var res = http.get(url, '', api.headers);
        res.then(async function (res) {
//          console.info('location:'+JSON.stringify(res))
          _self.expressLocation = res.data
        });
      },
      async isProviderContacts() {
        let _self = this;
        let url = await api.expressBase + api.customers + api.osPlatformSeparator + _self.phoneNumber + api.osPlatformSeparator + this.shopCode + '/isProviderContacts'
        var res = http.get(url, '', api.headers);
//        console.info(url+':'+JSON.stringify(res))
        res.then(async function (res) {
//          console.info('isProviderContacts:'+JSON.stringify(res))
          let tag = res.data.TAG;
          if (tag) {
            let cs = res.data.CONTACTS[0];
            _self.contactsObj = cs;
            _self.providerId = cs.PROVIDER_ID;
            _self.expressProvider = cs.PROVIDER_NAME;
            _self.areaCode = cs.AREA_CODE;
          }
        });
      },
      clearInExpressForm() {
        this.userName = '';
        this.userAccount = '';
        this.expressNumber = '';
//        this.expressProvider = '';
        this.radioValue = '';
        this.expressLocation = '';
      },
      doScanQR() {
        MyStoresJS.scanQR();
      },
      resultQRCode(msg) {
//        alert("扫码结果：" + msg);
        this.expressNumber = msg;
      },
      hiddenPartLogistics(expressNumber) {
        return '*' + expressNumber.substring(expressNumber.length - 4, expressNumber.length)
      },
      hiddenPartUserAccount(userAccount) {
        return userAccount.substring(0, 3) + '*' + userAccount.substring(7, 11)
      },
      getCustomersByPhoneTail(userAccount) {
        let _self = this;
        if (userAccount && userAccount.length == 4) {
          let shopCode = _self.shopCode;
          let url = api.expressBase + api.customers + api.osPlatformSeparator +
            userAccount + api.osPlatformSeparator +
            shopCode + api.osPlatformSeparator + 'tail'
          var res = http.get(url, '', api.headers);
          res.then(async function (res) {
//            console.info('getCustomersByPhoneTail:' + JSON.stringify(res))
            if (res.status == 200 && res.data.length != 0) {
              _self.openBottomSheet();
              _self.customerOptions = res.data;
//              let displayHandle = res.data;
              for(let i=0;i<_self.customerOptions.length;++i){
                let itemPhoneNumber = _self.customerOptions[i].PHONE_NUMBER;
                let itemName = _self.customerOptions[i].NAME
                let one = itemPhoneNumber.substring(0,3);
                let two = itemPhoneNumber.substring(3,7);
                let three = itemPhoneNumber.substring(7,11);
                _self.customerOptions[i]['displayTitle'] = one+'-'+two+'-'+three+'，'+itemName;
              }

            }
          });
        } else if (userAccount && userAccount.length > 4) {
          _self.closeBottomSheetByNone();
        } else if (userAccount && userAccount.length < 4) {
          _self.closeBottomSheetByNone();
        }
      },
      checkInputForm() {
        let _self = this;
        if (_self.expressNumber == '') {
          this.showAlert = true;
          this.alertText = '请输入快递单号';
          return false;
        }
        if (_self.expressProvider == '') {
          this.showAlert = true;
          this.alertText = '您输入服务商';
          return false;
        }
        if (_self.userAccount == null) {
          this.showAlert = true;
          this.alertText = '请输入手机号码';
          return false;
        }
        if (_self.userName == '') {
          this.showAlert = true;
          this.alertText = '请输入收件人姓名';
          return false;
        }
        if (_self.expressLocation == '' || _self.expressLocation == '请选择货位') {
          this.showAlert = true;
          this.alertText = '请选择货位';
          return false;
        }
        return true;
      },
      closeTip() {
        this.showAlert = false;
      },
    },

  }

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';

  .expressFormContainer {
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

  .express_container {
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
    @include wh(2rem, .733rem);
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

  table, td, th {
    border-spacing: 3px 8px;
    /*width: 99%*/
  }

  td, th {
    font-size: 12px;
  }

  @media (max-width: 1000px) {
    td {
      font-size: 28px;
    }
    #scanIcon {
      height: 36px;
      width: 38px;
    }
  }

  @media (max-width: 900px) {
    td {
      font-size: 22px;
    }
    #scanIcon {
      height: 34px;
      width: 38px;
    }
  }

  @media (max-width: 800px) {
    td {
      font-size: 20px;
    }
    #scanIcon {
      height: 32px;
      width: 34px;
    }
  }

  @media (max-width: 600px) {
    td {
      font-size: 18px;
    }
    #scanIcon {
      height: 28px;
      width: 30px;
    }
  }

  @media (max-width: 400px) {
    td {
      font-size: 14px;
    }
    #scanIcon {
      height: 24px;
      width: 26px;
    }
  }

  @media (max-width: 300px) {
    td {
      font-size: 12px;
    }
    #scanIcon {
      height: 20px;
      width: 22px;
    }
  }

  .radioDiv {
    margin: 5px 8px;
  }

  .uls {
    font-size: 12px;
    margin: 0px 10px;
  }

  .uls li {
    border: 1px solid #f1f1f1;
    background: #f7f7f7;
    padding: 4px 6px;
    width: 99%;
    font-size: 13px;
  }

  .location-hs {
    text-align: center;
    color: #f43bd5;
    font-weight: 900;
  }

  .provider-line {
    background: #f6f6f6;
  }
</style>
