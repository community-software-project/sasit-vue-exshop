<script src="../../../../node_modules/@xkeshi/vue-barcode/dist/vue-barcode.common.js"></script>
<template>
  <div class="page">
    <head-top head-title="取件码" go-back='true'></head-top>
    <section class="content_container">
      <section class="content" style="text-align: center;">
        <vue-barcode :value="pickupCode" class="qrMain" :options="{ displayValue: false }"></vue-barcode>
        <div class="qart" style="margin: 35px 50px;">
          <div id="qrcode" ref="qrcode" class=""></div>
        </div>
      </section>
    </section>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import headTop from 'src/components/header/head'
  import alertTip from 'src/components/common/alertTip'
  import QRCode from 'qrcodejs2'
  import vueBarcode from '@xkeshi/vue-barcode'
  import http from "../../../global/http-protocol";
  import api from "../../../global/http-api-config";

  export default {
    data() {
      return {
        displayValue: true,
        showAlert: false,
        alertText: null,
        pickupCode: '',
        areaCode:'',
        shopCode:'',
        selectList:'',
      }
    },
    created(){
      this.areaCode = this.$route.query.areaCode;
      this.shopCode = this.$route.query.shopCode;
      this.selectList = this.$route.query.selectList;
    },
    async mounted() {
      await this.getPickupQRCode();
    },
    components: {
      alertTip,
      headTop,
      vueBarcode
    },
    computed: {},
    methods: {
      usePoint() {
        this.showAlert = true;
        this.alertText = '存快递赚积分';
      },
      async getPickupQRCode() {
        let _self = this;
        let areaCode =this.areaCode;
        let shopCode =this.shopCode;
        let areaCodeAndShopCode = areaCode + api.osPlatformSeparator + shopCode+ api.osPlatformSeparator+this.selectList + '/initBarCode';
        let url = api.expressBase + api.pickupCode + api.osPlatformSeparator + areaCodeAndShopCode;
        var res = http.get(url, '', api.headers);
        res.then(async function (res) {
          _self.pickupCode = res.data;
          console.info('areaCodeAndShopCode:' + JSON.stringify(res.data));
          _self.getQart();
        });
      },
      async getQart() {
        let code = document.getElementById("qrcode");
        if(code != null && code != '') {
          let qrcode = new QRCode(code, {
            width: 125,//window.innerWidth*0.66,
            height: 125//window.innerHeight*0.66
          });
          let pickupCode = this.pickupCode;
          if(pickupCode != null && pickupCode != '') {
            qrcode.makeCode(pickupCode);
            var img = document.getElementById("qrcode").children[1];
            img.style.setProperty('width', '100%', 'important');
          }
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/style/mixin';

  .page {
    padding-top: 1.95rem;
    p, span {
      font-family: Helvetica Neue, Tahoma, Arial;
    }
  }

  .content_container {
    padding: .3rem;
    background-color: #dadcdd;
    .content {
      padding: .4rem;
      background-color: #fff;
      border-radius: .15rem;
      .content_header {
        @include fj;
        font-size: .55rem;
        .contetn_description {
          display: flex;
          align-items: center;
          img {
            @include wh(.6rem, .6rem);
            margin-right: .2rem;
          }
          .content_title_style {
            color: $blue;
          }
        }
        .content_title_style {
          color: #666;
        }
      }
      .content_num {
        span:nth-of-type(1) {
          @include sc(1.8rem, #333);
        }
        span:nth-of-type(2) {
          @include sc(.7rem, #333);
        }
      }
      .promit_button {
        @include wh(100%, 2rem);
        @include sc(.8rem, #fff);
        border-radius: 0.15rem;
        line-height: 2rem;
        margin-top: 1rem;
        text-align: center;
        background-color: #fe6d47;
      }
    }
  }

  .deal_detail {
    @include sc(.6rem, #999);
    line-height: 2rem;
    padding-left: .5rem;
  }

  .no_log {
    text-align: center;
    margin-top: 1rem;
    img {
      @include wh(8rem, 5rem);
    }
    p {
      margin-top: .5rem;
      @include sc(.7rem, #666);
    }
    p:nth-of-type(2) {
      @include sc(.5rem, #999);
    }
  }

  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }

  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }

  .qrMain {
    height: 65%;
    width: 85%;
  }

  #qrcode {
    height: 75%;
    width: 90%;
    margin: 0 auto;
    overflow: hidden;
  }

  /*#qrcode > img { width:100%; display:block;}*/
</style>
