<template>
  <div class="profile_page">
    <head-top go-back='true' :head-title="profiletitle"></head-top>
    <section class="profile-body">
      <section class="profile-number">
        <router-link :to="id ? '/profile/info' : '/login'" class="profile-link">
          <img src="../../images/icons/users-icon.png" class="privateImage" v-if="id">
          <img src="../../images/icons/unknown-users-icon.png" class="privateImage" v-else>
          <div class="user-info">
            <p>{{username}}</p>
            <p>
              <span class="user-icon">
                  <svg class="icon-mobile" fill="#fff">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mobile"></use>
                  </svg>
              </span>
              <span class="icon-mobile-number">{{phoneNumber}}</span>
              <span class="icon-mobile-number">{{shopName}}</span>
            </p>
          </div>
          <span class="arrow">
              <svg class="arrow-svg" fill="#fff">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
          </span>
        </router-link>
      </section>
      <section class="info-data">
        <ul class="clear">
          <router-link to="/expressList" tag="li" class="info-data-link">
            <span class="info-data-top"><b>{{expressCount}}</b>个</span>
            <span class="info-data-bottom">我的快递</span>
          </router-link>
          <router-link to="/points" tag="li" class="info-data-link">
            <span class="info-data-top"><b>{{pointNumber}}</b>分</span>
            <span class="info-data-bottom">我的积分</span>
          </router-link>
        </ul>
      </section>
      <section class="profile-1reTe">
        <nav class="msite_nav" v-if="shopCode != '' && shopCode != null && shopCode != undefined && providerContactsTag == true">
          <div class="swiper-container" v-if="menuItem.length">
            <div class="swiper-wrapper">
              <div style="margin: -15px 0px;" class="swiper-slide food_types_container">
                <router-link v-for="(item, index) in menuItem" :key="index" :to="{path: item.link, query: {shopCode:shopCode, areaCode: areaCode, providerId: providerId}}" class="link_to_food">
                  <figure>
                    <img :src="imgBaseUrl + item.image_url">
                    <figcaption style="margin: 0px -8px;">{{item.title}}</figcaption>
                  </figure>
                </router-link>
              </div>
            </div>
            <div class="swiper-pagination"></div>
          </div>
          <img src="../../images/fl.svg" class="fl_back animation_opactiy" v-else>
        </nav>
        <nav class="msite_nav" v-if="storesEmployeeTag == true">
          <div class="swiper-container" v-if="staffMemberMenuItem.length">
            <div class="swiper-wrapper">
              <div style="margin: -15px 0px;" class="swiper-slide food_types_container">
                <router-link v-for="(item, index) in staffMemberMenuItem" :key="index" :to="{path: item.link, query: {shopCode:shopCode, areaCode: areaCode}}" class="link_to_food">
                  <figure>
                    <img :src="imgBaseUrl + item.image_url">
                    <figcaption style="margin: 0px -8px;">{{item.title}}</figcaption>
                  </figure>
                </router-link>
              </div>
            </div>
            <div class="swiper-pagination"></div>
          </div>
          <img src="../../images/fl.svg" class="fl_back animation_opactiy" v-else>
        </nav>
      </section>
    </section>
    <foot-guide></foot-guide>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import headTop from 'src/components/header/head'
  import footGuide from 'src/components/footer/footGuide'
  import {mapState, mapMutations} from 'vuex'
  import {imgBaseUrl,staticImgUrl} from 'src/config/env'
  import {getImgPath} from 'src/components/common/mixin'
  import http from "../../global/http-protocol";
  import api from "../../global/http-api-config";
  import {getStore} from '../../config/mUtils';

  export default {
    data() {
      return {
        profiletitle: '我的',
        id:null,
        username: '登录/注册',//用户名
        resetname: '',
        shopCode: '',
        areaCode: '',
        shopName: '',
        phoneNumber: '暂无绑定手机号',//电话号码
        balance: 0,            //我的余额
        expressCount: 0,      //优惠券个数
        pointNumber: 0,       //积分数
        avatar: '/blackvariant/button-ui-system-folders-drives/128/Users-icon.png',//头像地址
        imgBaseUrl,
        staticImgUrl,
        menuItem: [
          {
            "id": 1,
            "description": "快递入库",
            "title": "快递入库",
            "link": "/addExpress",
            "image_url": "rockettheme/ecommerce/128/delivery-box-icon.png",
            "icon_url": "",
            "routerpage": true
          },{
            "id": 2,
            "description": "库存查询",
            "title": "库存查询",
            "link": "/selfExpressDelivery",
            "image_url": "osullivanluke/orb-os-x/128/Mission-Control-icon.png",
            "icon_url": "",
            "routerpage": true
          },{
            "id": 3,
            "description": "寄件查询",
            "title": "寄件查询",
            "link": "/sendExpressInventory",
            "image_url": "gakuseisean/aire/128/Search-Images-icon.png",
            "icon_url": "",
            "routerpage": true
          },{
            "id": 4,
            "description": "付款结算",
            "title": "付款结算",
            "link": "#",
            "image_url": "custom-icon-design/pretty-office-3/128/payment-card-icon.png",
            "icon_url": "",
            "routerpage": true
          }
        ],
        staffMemberMenuItem: [
          {
            "id": 11,
            "description": "我要入库",
            "title": "我要入库",
            "link": "/addExpressByStaff",
            "image_url": "rockettheme/ecommerce/128/delivery-box-icon.png",
            "icon_url": "",
            "routerpage": true
          },{
            "id": 12,
            "description": "寄件收件",
            "title": "寄件收件",
            "link": "/recordSendExpress",
            "image_url": "icons8/ios7/128/Messaging-Sent-icon.png",
            "icon_url": "",
            "routerpage": true
          },{
            "id": 13,
            "description": "扫码出库",
            "title": "扫码出库",
            "link": "/deliveryExpress",
            "image_url": "designcontest/ecommerce-business/256/bar-code-icon.png",
            "icon_url": "",
            "routerpage": true
          },{
            "id": 14,
            "description": "快递盘点",
            "title": "快递盘点",
            "link": "#",
            "image_url": "custom-icon-design/flatastic-4/128/Inventory-maintenance-icon.png",
            "icon_url": "",
            "routerpage": true
          },
        ],
        isCustomerExist:null,
        providerContactsTag: false,
        storesEmployeeTag:false,
        providerId: '',
      }
    },
    mounted() {
//      if(!this.isCustomerExist && this.isCustomerExist != undefined){
//        this.updateCustomerShopInfo();
//      }
      this.customersExpressCount();
    },
    async created(){
      this.phoneNumber = getStore('phoneNumber');
      await this.initProfilePage();
      if(this.$route.query.shopCode){
        this.shopName = this.$route.query.shopName;
        this.shopCode = this.$route.query.shopCode;
        this.areaCode = this.$route.query.areaCode;
        this.isCustomerExist = this.$route.query.isCustomerExist;
        await this.updateCustomerShopInfo();
      }
      if(!this.shopCode){
        await this.checkShopCode();
      }
//      if(this.shopCode == undefined || this.shopCode == ''){
//        if(this.customerInfo){
//          this.shopCode = this.customerInfo.SERVICE_SHOP_CODE;
//          this.shopName = this.customerInfo.SERVICE_SHOP_NAME;
////          this.providerId = this.customerInfo.PROVIDER_ID;
//        }
//      }

    },
    mixins: [getImgPath],
    components: {
      headTop,
      footGuide,
    },
    computed: {
      ...mapState([
        'userInfo',
        'customerInfo',
      ]),
      //后台会返回两种头像地址格式，分别处理

    },
    methods: {
      ...mapMutations([
        'SAVE_AVANDER',
        'RECORD_USERINFO',
        'RECORD_CUSTOMER_INFO',
      ]),
      async isProviderContacts(){
        let _self = this;
        let url = await api.expressBase + api.customers + api.osPlatformSeparator + getStore('phoneNumber') + api.osPlatformSeparator + _self.shopCode+'/isProviderContacts'
        var res = http.get(url, '', api.headers);
        res.then(async function (res) {
//          console.info('isp:'+JSON.stringify(res))
          _self.providerContactsTag = res.data.TAG;
          if(res.data.CONTACTS){
            if(res.data.CONTACTS.length != 0){
              _self.providerId = res.data.CONTACTS[0].PROVIDER_ID;
            }
          }
        });
      },
      async checkShopCode(){
        let phoneNumber = getStore('phoneNumber');
        if(phoneNumber){
          let _self = this;
          let url = await api.expressBase + api.customers + api.osPlatformSeparator + getStore('phoneNumber')+ api.osPlatformSeparator+ 'checkShopCode'
//          console.info(url);
          var res = http.get(url, '', api.headers);
          res.then(async function (res) {
//          console.info('checkShopCode:'+JSON.stringify(res))
            let shopCode = res.data.SERVICE_SHOP_CODE;
            let areaCode = res.data.AREA_CODE;
            if(shopCode == null || shopCode == ''){
              _self.selectServiceArea(_self.isCustomerExist);
            }
          });
        }

      },
      async updateCustomerShopInfo(){
        let _self = this;
        let url = api.expressBase+api.customers+api.osPlatformSeparator+getStore('phoneNumber');
        let data = {
          "serviceShopCode" : _self.shopCode,
          "serviceShopName" : _self.shopName,
          "areaCode" : _self.areaCode
        }
        var res = http.put(url, data, api.headers);
        res.then(async function (res) {
//          console.info('updateCustomerShopInfo:'+JSON.stringify(res));
          _self.isCustomerExist = false;
        });
      },
      customersExpressCount(){
        let _self = this;
        let url = api.expressBase+api.express+api.osPlatformSeparator+getStore('phoneNumber')+api.osPlatformSeparator+'expressCount';
        var res = http.get(url, '', api.headers);
        res.then(function (res) {
//          console.info('customersExpressCount:'+JSON.stringify(res));
          _self.expressCount = res.data;
        });

      },
      async isStoresEmployee(){
        let _self = this;
        let url = await api.expressBase + api.customers + api.osPlatformSeparator + getStore('phoneNumber') + api.osPlatformSeparator + _self.shopCode+'/isStoresEmployee'
        var res = http.get(url, '', api.headers);
        res.then(async function (res) {
//          console.info('isStoresEmployee:'+JSON.stringify(res))
          _self.storesEmployeeTag = res.data.TAG
        });
      },
      async initProfilePage() {
        let _self = this;
        let phoneNumber = getStore('phoneNumber');
        if (phoneNumber) {
          let url = await api.expressBase+api.customers+api.osPlatformSeparator+phoneNumber;
          var res = http.get(url, '', api.headers);
          res.then(async function (res) {
            let obj = res.data;
            _self.username = obj.NAME;
            _self.shopName = obj.SERVICE_SHOP_NAME;
            _self.shopCode = obj.SERVICE_SHOP_CODE;
            _self.areaCode = obj.AREA_CODE;
            _self.balance = 9.07;
//            _self.count = obj.LOGIN_FREQUENCY;
//            _self.phoneNumber= phoneNumber;
            _self.id = obj.ID;
            if(_self.shopCode){
              _self.isProviderContacts();
              _self.isStoresEmployee();
            }
          });
        } else {
          _self.username = '登录/注册'
          _self.phoneNumber= '暂无绑定手机号'
          _self.shopName = ''
          _self.balance = '0.00'
          _self.expressCount = '0'
          _self.pointNumber = '0'
          _self.id = null
        }
      },
      selectServiceArea(isCustomerExist){
        let phoneNumber = getStore('phoneNumber');
        if(phoneNumber){
          isCustomerExist = true;
        }
        this.$router.push({path:'/selectServiceArea', query:{isCustomerExist:isCustomerExist}})
      },
    },
    watch: {
      '$route' (to, from) {
        console.log(this.$route.path)
        this.initProfilePage()
      }
    },
  }

</script>

<style lang="scss" scoped>
  /*@import 'src/style/mixin';*/
  @import '../../style/mixin';

  .profile_page {
    p, span {
      font-family: Helvetica Neue, Tahoma, Arial;
    }
  }

  .profile-number {
    padding-top: 1.95rem;
    .profile-link {
      display: block;
      display: flex;
      box-align: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      background: $blue;
      padding: .666667rem .6rem;
      .privateImage {
        display: inline-block;
        @include wh(2.5rem, 2.5rem);
        border-radius: 50%;
        vertical-align: middle;
        .privateImage-svg {
          background: $fc;
          border-radius: 50%;
          @include wh(2.5rem, 2.5rem);
        }
      }
      .user-info {
        margin-left: .48rem;
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        p {
          font-weight: 700;
          @include sc(.8rem, $fc);
          .user-icon {
            @include wh(0.5rem, 0.75rem);
            display: inline-block;
            vertical-align: middle;
            line-height: 0.75rem;
            .icon-mobile {
              @include wh(100%, 100%);
            }
          }
          .icon-mobile-number {
            display: inline-block;
            @include sc(.57333rem, $fc);

          }
        }

      }
      .arrow {
        @include wh(.46667rem, .98rem);
        display: inline-block;
        svg {
          @include wh(100%, 100%);
        }
      }
    }
  }

  .info-data {
    width: 100%;
    background: $fc;
    box-sizing: border-box;
    ul {
      .info-data-link {
        float: left;
        width: 49.99%;
        display: inline-block;
        border-right: 1px solid #f1f1f1;
        span {
          display: block;
          width: 100%;
          text-align: center;
        }
        .info-data-top {
          @include sc(.55rem, #333);
          padding: .853333rem 0 .453333rem;
          b {
            display: inline-block;
            @include sc(1.2rem, #f90);
            font-weight: 700;
            line-height: 1rem;
            font-family: Helvetica Neue, Tahoma;
          }
        }
        .info-data-bottom {
          @include sc(.57333rem, #666);
          font-weight: 400;
          padding-bottom: .453333rem;

        }
      }
      .info-data-link:nth-of-type(2) {
        .info-data-top {
          b {
            color: #ff5f3e;
          }
        }

      }
      .info-data-link:nth-of-type(3) {
        border: 0;
        .info-data-top {
          b {
            color: #6ac20b;
          }
        }
      }
    }
  }

  .profile-1reTe {
    margin-top: .4rem;
    background: $fc;
    .myorder {
      padding-left: 1.6rem;
      display: flex;
      align-items: center;
      aside {
        @include wh(.7rem, .7rem);
        margin-left: -.866667rem;
        margin-right: .266667rem;
        display: flex;
        align-items: center;
        svg {
          @include wh(100%, 100%);
        }
      }
      .myorder-div {
        width: 100%;
        border-bottom: 1px solid #f1f1f1;
        padding: .433333rem .266667rem .433333rem 0;
        @include sc(.7rem, #333);
        display: flex;
        justify-content: space-between;
        span {
          display: block;
        }
        .myorder-divsvg {
          @include wh(.46667rem, .466667rem);
          svg {
            @include wh(100%, 100%);
          }
        }
      }
    }
    .myorder:nth-of-type(3) .myorder-div {
      border: 0;
    }
  }

  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }

  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }

  .msite_nav {
    padding-top: 1.6rem;
    background-color: #fff;
    border-bottom: 0.025rem solid $bc;
    height: 5.6rem;
    .swiper-container {
      @include wh(100%, auto);
      padding-bottom: 0.6rem;
      .swiper-pagination {
        bottom: 0.2rem;
      }
    }
    .fl_back {
      @include wh(100%, 100%);
    }
  }

  .food_types_container {
    display: flex;
    flex-wrap: wrap;
    .link_to_food {
      width: 25%;
      padding: 0.3rem 0rem;
      @include fj(center);
      figure {
        img {
          margin-bottom: 0.3rem;
          @include wh(1.8rem, 1.8rem);
        }
        figcaption {
          text-align: center;
          @include sc(0.55rem, #666);
        }
      }
    }
  }
  .profile-body{
    background: #f3f3f3;
  }
</style>
