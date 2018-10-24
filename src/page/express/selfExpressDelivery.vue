<template>
  <div class="">
    <head-top head-title="库存查询" goBack="true"></head-top>
    <div class="shop_list_container">
      <router-link :to="{path: '#'}" v-for="item in expressList" tag='li' class="shop_li">
        <section>
          <!--<img :src="staticImgUrl + icon" class="shop_img">-->
          <img src="../../images/icons/package-await.png" class="shop_img">
        </section>
        <hgroup class="shop_right">
          <header class="shop_detail_header">
            <span class="expressNo">{{item.EXPRESS_SERVICE_NAME}} {{item.LOGISTICS}}</span>
            <ul class="shop_detail_ul">
              <li class="supports">{{item.OPERA_TIME}}</li>
            </ul>
          </header>
          <h5 class="rating_order_num">
            <section class="rating_order_num_left">
              <section class="order_section">
                <span class="supports"
                      style="font-size: 14px; margin-left: -8px;">{{item.RECIPIENT_NAME}} [{{item.SERVICE_SHOP_NAME}}]</span>
              </section>
            </section>
            <section class="rating_order_num_right">
              <span class="delivery_style delivery_left" v-if="item.delivery_mode">{{item.delivery_mode.text}}</span>
            </section>
          </h5>
        </hgroup>
      </router-link>
      <p v-if="touchend" class="empty_data">没有更多了</p>
      <aside class="return_top" @click="backTop" v-if="showBackStatus">
        <svg class="back_top_svg">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
        </svg>
      </aside>
      <div ref="abc" style="background-color: red;"></div>
    </div>
    <foot-guide></foot-guide>
  </div>
</template>

<script>
  import headTop from '../../components/header/head';
  import {mapState, mapMutations} from 'vuex';
  import footGuide from '../../components/footer/footGuide';
  import {imgBaseUrl, staticImgUrl} from 'src/config/env';
  import {showBack, animate} from 'src/config/mUtils';
  import http from "../../global/http-protocol";
  import api from "../../global/http-api-config";
  import {getStore} from '../../config/mUtils';

  export default {
    data() {
      return {
        offset: 0, // 批次加载店铺列表，每次加载20个 limit = 20
        shopListArr: [], // 店铺列表数据
        preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
        showBackStatus: false, //显示返回顶部按钮
        touchend: false, //没有更多数据
        imgBaseUrl,
        staticImgUrl,
        phoneNumber: null,
        expressList: [],
        icon: 'flat-icons.com/square/128/package-icon.png',
        msietTitle: '我的投递',
        providerId: '',
        shopCode: '',
      }
    },
    mounted() {
//    console.info('express:'+JSON.stringify(this.phoneNumber))
//      this.getHandleExpressDelivery()
    },
    created() {
//      this.providerId = this.$route.query.providerId;
      this.shopCode = this.$route.query.shopCode;
      this.phoneNumber = getStore('phoneNumber');
      this.getHandleExpressDelivery()
    },
    components: {
      headTop,
      footGuide,
    },
    props: ['restaurantCategoryId', 'restaurantCategoryIds', 'sortByType', 'deliveryMode', 'supportIds', 'confirmSelect', 'geohash'],
    computed: {
      ...mapState([
        'customerInfo',
      ]),
    },
    updated() {
      // console.log(this.supportIds, this.sortByType)
    },
    methods: {
      ...mapMutations([
        'SAVE_AVANDER'
      ]),
      async getHandleExpressDelivery() {
        let _self = this;
        let url = api.expressBase + api.express + api.osPlatformSeparator + _self.phoneNumber + api.osPlatformSeparator + _self.shopCode + "/selfHandleExpressDelivery";
        var res = http.get(url, '', api.headers);
        res.then(async function (res) {
          console.info('express:' + JSON.stringify(res.data));
          _self.expressList = res.data;
//          if (_self.expressList.length < 18) {
//            _self.touchend = true;
//          }
        });
      },
      //到达底部加载更多数据
      async loaderMore() {
        if (this.touchend) {
          return
        }
        //防止重复请求
        if (this.preventRepeatReuqest) {
          return
        }
        this.preventRepeatReuqest = true;

        //数据的定位加20位
        this.offset += 20;
//			let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId);
//			this.shopListArr = [...this.shopListArr, ...res];
        //当获取数据小于20，说明没有更多数据，不需要再次请求数据
        if (res.length < 20) {
          this.touchend = true;
          return
        }
        this.preventRepeatReuqest = false;
      },
      //返回顶部
      backTop() {
        animate(document.body, {scrollTop: '0'}, 400, 'ease-out');
      },
    },
    watch: {
      '$route'(to, from) {
        console.log(this.$route.path);
        this.getHandleExpressDelivery();
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../style/mixin';

  .shop_list_container {
    margin-top: 1.95rem;
    border-top: 0.025rem solid $bc;
    background-color: #fff;
  }

  .shop_li {
    display: flex;
    border-bottom: 0.025rem solid #f1f1f1;
    padding: 0.7rem 0.4rem;
  }

  .shop_img {
    @include wh(1.5rem, 1.5rem);
    display: block;
    margin-right: 0.4rem;
  }

  .list_back_li {
    height: 4.85rem;
    .list_back_svg {
      @include wh(100%, 100%)
    }
  }

  .shop_right {
    flex: auto;
    .shop_detail_header {
      @include fj;
      align-items: center;
      .shop_title {
        width: 8.5rem;
        color: #333;
        padding-top: .01rem;
        @include font(0.65rem, 0.65rem, 'PingFangSC-Regular');
        font-weight: 700;
      }
      .premium::before {
        /*content: '品牌';*/
        display: inline-block;
        font-size: 0.3rem;
        line-height: .5rem;
        color: #333;
        background-color: #ffd930;
        padding: 0 0.1rem;
        border-radius: 0.1rem;
        margin-right: 0.2rem;
      }
      .shop_detail_ul {
        display: flex;
        transform: scale(.8);
        margin-right: -0.3rem;
        .supports {
          @include sc(0.5rem, #999);
          border: 0.025rem solid #f1f1f1;
          padding: 0 0.04rem;
          border-radius: 0.08rem;
          margin-left: 0.05rem;
        }
      }
    }
    .rating_order_num {
      @include fj(space-between);
      height: 0.6rem;
      margin-top: 0.06rem;
      .rating_order_num_left {
        @include fj(flex-start);
        .rating_section {
          display: flex;
          .rating_num {
            @include sc(0.4rem, #ff6000);
            margin: 0 0.2rem;
          }
        }
        .order_section {
          transform: scale(.8);
          margin-left: -0.2rem;
          @include sc(0.4rem, #666);
        }
      }
      .rating_order_num_right {
        display: flex;
        align-items: center;
        transform: scale(.7);
        min-width: 5rem;
        justify-content: flex-end;
        margin-right: -0.8rem;
        .delivery_style {
          font-size: 0.4rem;
          padding: 0.04rem 0.08rem 0;
          border-radius: 0.08rem;
          margin-left: 0.08rem;
          border: 1px;
        }
        .delivery_left {
          color: #fff;
          background-color: $blue;
          border: 0.025rem solid $blue;
        }
        .delivery_right {
          color: $blue;
          border: 0.025rem solid $blue;
        }
      }
    }
    .fee_distance {
      margin-top: 0.52rem;
      @include fj;
      @include sc(0.5rem, #333);
      .fee {
        transform: scale(.9);
        @include sc(0.5rem, #666);
      }
      .distance_time {
        transform: scale(.9);
        span {
          color: #999;
        }
        .order_time {
          color: $blue;
        }
        .segmentation {
          color: #ccc;
        }
      }
    }
  }

  .loader_more {
    @include font(0.6rem, 3);
    text-align: center;
    color: #999;
  }

  .empty_data {
    @include sc(0.5rem, #666);
    text-align: center;
    line-height: 2rem;
  }

  .return_top {
    position: fixed;
    bottom: 3rem;
    right: 1rem;
    .back_top_svg {
      @include wh(2rem, 2rem);
    }
  }

  .expressNo {
    font-size: 12px;
    font-weight: 900;
  }

  .msite_title {
    @include center;
    width: 50%;
    color: #fff;
    text-align: center;
    margin-left: -0.5rem;
    .title_text {
      @include sc(0.8rem, #fff);
      text-align: center;
      display: block;
    }
  }

  .msite_nav {
    padding-top: 2.1rem;
    background-color: #fff;
    border-bottom: 0.025rem solid $bc;
    height: 10.6rem;
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
</style>
