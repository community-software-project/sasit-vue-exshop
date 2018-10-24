<template>
  <header id='head_top'>
    <slot name='logo'></slot>
    <slot name='search'></slot>
    <section class="head_goback" v-if="goBack" @click="$router.go(-1)">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:2"/>
      </svg>
    </section>
    <router-link :to="customerInfo ? '/profile':'/login'" v-if='signinUp' class="head_login">
      <svg class="user_avatar" v-if="customerInfo">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#user"></use>
      </svg>
      <span class="login_span" v-else>登录||注册</span>
    </router-link>
    <section class="title_head ellipsis" v-if="headTitle">
      <span class="title_text">{{headTitle}}</span>
    </section>
    <slot name="edit"></slot>
    <slot name="msite-title"></slot>
    <slot name="changecity"></slot>
    <slot name="changeLogin"></slot>
  </header>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import {getStore} from '../../config/mUtils';
  import http from "../../global/http-protocol";
  import api from "../../global/http-api-config";

  export default {
    data() {
      return {
        customerInfo: null,
        phoneNumber:null,
        expressList:[],
      }
    },
    created() {
      let _self = this;
      let phoneNumber = getStore('phoneNumber');
      _self.phoneNumber = phoneNumber;
      if (phoneNumber) {
        let url = api.expressBase + api.customers + api.osPlatformSeparator + phoneNumber + api.osPlatformSeparator + 'isExist';
        var res = http.get(url, '', api.headers);
        res.then(async function (res) {
//          console.info('head:'+JSON.stringify(res))
          if(res.data.COUNT == 1){
            _self.customerInfo = res.data.CUSTOMER_INFO
          }
        });
      }
    },
    mounted() {
//      this.getExpressList()
    },
    props: ['signinUp', 'headTitle', 'goBack'],
    computed: {
      ...mapState([]),
    },
    methods: {
      ...mapActions([]),
      getExpressList(){
        let _self = this
        let url = api.expressBase + api.express + api.osPlatformSeparator + _self.phoneNumber
        var res = http.get(url, '', api.headers);
        res.then(async function (res) {
          _self.expressList = res.data;
          console.info('express:'+JSON.stringify(res))
        });
      },
    },

  }

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';

  #head_top {
    background-color: $blue;
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    @include wh(100%, 1.95rem);
  }

  .head_goback {
    left: 0.4rem;
    @include wh(0.6rem, 1rem);
    line-height: 2.2rem;
    margin-left: .4rem;
  }

  .head_login {
    right: 0.55rem;
    @include sc(0.65rem, #fff);
    @include ct;
    .login_span {
      color: #fff;
    }
    .user_avatar {
      fill: #fff;
      @include wh(.8rem, .8rem);
    }
  }

  .title_head {
    @include center;
    width: 50%;
    color: #fff;
    text-align: center;
    .title_text {
      @include sc(0.8rem, #fff);
      text-align: center;
      font-weight: bold;
    }
  }
</style>
