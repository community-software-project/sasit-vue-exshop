<template>
  <div>
    <head-top signin-up='home'>
      <span slot='logo' class="head_logo"  @click="reload">sasit.cc</span>
    </head-top>
    <nav class="city_nav">
      <div class="city_tip">
        <span>请在社区列表中选择</span>
      </div>
    </nav>
    <section id="hot_city_container">
      <h4 class="city_title">热门社区</h4>
      <ul class="citylistul clear groupcity_name_container">
        <router-link  tag="li" v-for="item in hotShop" :to="{path:'/profile', query:{shopName:item.SHOP_LIST[0].NAME, shopCode:item.SHOP_LIST[0].SHOP_CODE, isCustomerExist:isCustomerExist}}" :key="item.SHOP_LIST[0].SHOP_CODE">
          {{item.SHOP_LIST[0].NAME}}
        </router-link>
      </ul>
    </section>
    <section class="group_city_container">
      <ul class="letter_classify">
        <li v-for="(value, index) in areaShopArray" :key="value.AREA.CODE"  class="letter_classify_li">
          <h4 class="city_title">{{value.AREA.NAME}}
            <span v-if="index == 0">（按区域排序）</span>
          </h4>
          <ul class="groupcity_name_container citylistul clear">
            <router-link  tag="li" v-for="item in value.SHOP_LIST" :to="{path:'/profile', query:{shopName:item.NAME, shopCode:item.SHOP_CODE, isCustomerExist:isCustomerExist, areaCode:value.AREA.CODE}}" :key="item.SHOP_CODE" class="ellipsis">
              {{item.NAME}}
            </router-link>
          </ul>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import headTop from '../../../components/header/head'
  import http from "../../../global/http-protocol";
  import api from "../../../global/http-api-config";

  export default {
    data(){
      return{
        hotShop: [],
        areaShopArray: [],
        isCustomerExist:true,
      }
    },
    mounted(){
    },
    created(){
      this.getPopularCommunity();
      this.getOrganizationInfo();
      this.isCustomerExist = this.$route.query.isCustomerExist;
    },
    computed: {
//      ...mapGetters(['localpath'])
    },
    components:{
      headTop
    },
    methods:{
      //点击图标刷新页面
      reload(){
        window.location.reload();
      },
      getOrganizationInfo(){
        let _self = this;
        let url = api.expressBase+api.organizations;
        var res = http.get(url, '', api.headers);
        res.then(function (res) {
//          console.info(JSON.stringify(res.data.length));
//          console.info(JSON.stringify(res));
          _self.areaShopArray = res.data;
        });
      },
      getPopularCommunity(){
        let _self = this;
        let url = api.expressBase+api.organizations+'/popularCommunity';
        var res = http.get(url, '', api.headers);
        res.then(function (res) {
//          console.info(JSON.stringify(res.data.length));
//          console.info(JSON.stringify(res));
          _self.hotShop = res.data;
        });
      }
    },
  }

</script>

<style lang="scss" scoped>
  @import '../../../style/mixin';
  .head_logo{
    left: 0.4rem;
    font-weight: 400;
    @include sc(0.7rem, #fff);
    @include wh(2.3rem, 0.7rem);
    @include ct;
  }
  .city_nav{
    padding-top: 2.35rem;
    border-top: 1px solid $bc;
    background-color: #fff;
    margin-bottom: 0.4rem;
    .city_tip{
      @include fj;
      line-height: 1.45rem;
      padding: 0 0.45rem;
      span:nth-of-type(1){
        @include sc(0.55rem, #666);
      }
      span:nth-of-type(2){
        font-weight: 900;
        @include sc(0.475rem, #9f9f9f);
      }

    }
    .guess_city{
      @include fj;
      align-items: center;
      height: 1.8rem;
      padding: 0 0.45rem;
      border-top: 1px solid $bc;
      border-bottom: 2px solid $bc;
      @include font(0.75rem, 1.8rem);
      span:nth-of-type(1){
        color: $blue;
      }
      .arrow_right{
        @include wh(.6rem, .6rem);
        fill: #999;
      }
    }
  }
  #hot_city_container{
    background-color: #fff;
    margin-bottom: 0.4rem;
  }
  .citylistul{
    li{
      float: left;
      text-align: center;
      color: $blue;
      border-bottom: 0.025rem solid $bc;
      border-right: 0.025rem solid $bc;
      @include wh(25%, 1.75rem);
      @include font(0.6rem, 1.75rem);
    }
    li:nth-of-type(4n){
      border-right: none;
    }
  }
  .city_title{
    color: #666;
    font-weight: 400;
    text-indent: 0.45rem;
    border-top: 2px solid $bc;
    border-bottom: 1px solid $bc;
    @include font(0.55rem, 1.45rem, "Helvetica Neue");
    span{
      @include sc(0.475rem, #999);
    }
  }

  .letter_classify_li{
    margin-bottom: 0.4rem;
    background-color: #fff;
    border-bottom: 1px solid $bc;
    .groupcity_name_container{
      li{
        color: #666;
      }
    }
  }
</style>
