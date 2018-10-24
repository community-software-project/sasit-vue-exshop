<template>
  <div class="">
    <head-top head-title="首页" goBack="true"></head-top>
    <!--{{selectList}}-->
    <div class="shop_list_container">
      <ul v-load-more="loaderMore" v-if="expressList.length" type="1">
        <router-link :to="{path: '#', query:{}}" v-for="item in expressList" tag='li' :key="item.ID" class="shop_li">
          <section>
            <mu-checkbox :nativeValue="String(item.ID)" v-model="selectList" class="demo-checkbox" style="margin: 2px 2px;" labelLeft/>
            <!--<img src="../../images/icons/package-icon.png" class="shop_img">-->
          </section>
          <hgroup class="shop_right">
            <header class="shop_detail_header">
              <span class="expressNo">
                {{item.EXPRESS_SERVICE_NAME}} {{item.LOGISTICS}}
              </span>
              <ul class="shop_detail_ul">
                <li class="supports">{{item.OPERA_TIME}}</li>
              </ul>
            </header>
            <h5 class="rating_order_num">
              <section class="rating_order_num_left">
                <section class="order_section">
                  <span class="supports" style="font-size: 14px; margin-left: -8px;">{{item.RECIPIENT_NAME}} [{{item.SERVICE_SHOP_NAME}}]</span>
                </section>
              </section>
              <section class="rating_order_num_right">
                <span class="delivery_style delivery_left" v-if="item.delivery_mode">{{item.delivery_mode.text}}</span>
              </section>
            </h5>
          </hgroup>
        </router-link>
      </ul>
      <!--<ul v-else class="">-->
        <!--<li class="list_back_li">-->
          <!--&lt;!&ndash;<img src="../../images/shopback.svg" class="list_back_svg">&ndash;&gt;-->
          <!--<p class="empty_data">您没有新包裹...</p>-->
        <!--</li>-->
      <!--</ul>-->
      <p v-if="touchend" class="empty_data">没有更多了</p>
      <aside class="return_top" @click="backTop" v-if="showBackStatus">
        <svg class="back_top_svg">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
        </svg>
      </aside>
      <div ref="abc" style="background-color: red;"></div>
      <transition name="loading">
        <loading v-show="showLoading"></loading>
      </transition>
      <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet" :overlay="false">
        <mu-list @itemClick="closeBottomSheet" style="height: 105px; background: #e2edc9; overflow: scroll;">
          <mu-sub-header>提示</mu-sub-header>
          <mu-list-item title="出示取件码" style="text-align: center;"></mu-list-item>
        </mu-list>
      </mu-bottom-sheet>
    </div>
    <foot-guide></foot-guide>
  </div>
</template>

<script>
  import headTop from '../../components/header/head';
  import {mapState,mapMutations} from 'vuex';
//import {shopList} from 'src/service/getData'
  import footGuide from '../../components/footer/footGuide';
  import {imgBaseUrl,staticImgUrl} from 'src/config/env';
  import {showBack, animate} from 'src/config/mUtils';
  import {loadMore, getImgPath} from './mixin';
  import loading from './loading';
  import ratingStar from './ratingStar';
  import http from "../../global/http-protocol";
  import api from "../../global/http-api-config";
  import {getStore} from '../../config/mUtils';

export default {
	data(){
		return {
      bottomSheet: false,
			offset: 0, // 批次加载店铺列表，每次加载20个 limit = 20
			shopListArr:[], // 店铺列表数据
			preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
			showBackStatus: false, //显示返回顶部按钮
			showLoading: true, //显示加载动画
			touchend: false, //没有更多数据
			imgBaseUrl,
      staticImgUrl,
//      customerInfo: null,
      phoneNumber:null,
      expressList:[],
      icon: 'kearone/platecons/128/package-zip-or-something-like-this-icon.png',
      msietTitle:'主页',
      selectList: [],
      areaCode:'',
      shopCode:'',
		}
	},
	mounted(){
//    console.info('express:'+JSON.stringify(this.phoneNumber))
	  this.getExpressList()
//		this.initData();
	},
  created(){
    this.phoneNumber = getStore('phoneNumber');
  },
	components: {
    headTop,
		loading,
    footGuide,
	},
	props: ['restaurantCategoryId', 'restaurantCategoryIds', 'sortByType', 'deliveryMode', 'supportIds', 'confirmSelect', 'geohash'],
	mixins: [loadMore, getImgPath],
  computed: {
    ...mapState([
      'customerInfo',
    ]),
  },
	updated(){
		// console.log(this.supportIds, this.sortByType)
	},
	methods: {
    ...mapMutations([
      'SAVE_AVANDER'
    ]),
    closeBottomSheet (line) {
      this.bottomSheet = false;
      if(this.selectList.length != 0) {
        this.showQRCodePage();
      }
    },
    showQRCodePage(){
//      alert(this.selectList);
      this.$router.push({path: '/pickupQRCode', query:{areaCode: this.areaCode, shopCode: this.shopCode, selectList: this.selectList.join(',')}})
    },
    openSheetButton(){
//      console.info(1);
      this.openBottomSheet();
    },
    closeBottomSheetByNone (line) {
      this.bottomSheet = false;
    },
    openBottomSheet () {
      this.bottomSheet = true
    },
    async getExpressList(){
      let _self = this;
      let phoneNumber = getStore('phoneNumber');
      if(phoneNumber != null && phoneNumber.length > 0){
        let url = api.expressBase + api.express + api.osPlatformSeparator + phoneNumber
        var res = http.get(url, '', api.headers);
        res.then(async function (res) {
          _self.expressList = res.data;
          _self.areaCode = _self.expressList[0].AREA_CODE;
          _self.shopCode = _self.expressList[0].SERVICE_SHOP_CODE;
          if (_self.expressList.length < 18) {
            _self.touchend = true;
          }
          _self.showLoading = false;
        });
      } else {
        _self.showLoading = false;
      }

    },
		async initData(){
		  let _self = this;
//      console.info(JSON.stringify(_self.customerInfo))
		  if(_self.customerInfo){
        let url = api.expressBase+api.express+api.osPlatformSeparator+_self.phoneNumber;
        var res = http.get(url, '', api.headers);
        res.then(async function (res) {
          console.info('exp:'+JSON.stringify(res))
          _self.expressList = res.data;
        });
      }
			if (_self.expressList.length < 18) {
				this.touchend = true;
			}
			_self.showLoading = false;
//			this.hideLoading();
			//开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
//			showBack(status => {
//				this.showBackStatus = status;
//			});
//			console.info(JSON.stringify(_self.shopListArr));
		},
		//到达底部加载更多数据
		async loaderMore(){
			if (this.touchend) {
				return
			}
			//防止重复请求
			if (this.preventRepeatReuqest) {
				return
			}
			this.showLoading = true;
			this.preventRepeatReuqest = true;

			//数据的定位加20位
			this.offset += 20;
//			let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId);
			this.hideLoading();
//			this.shopListArr = [...this.shopListArr, ...res];
			//当获取数据小于20，说明没有更多数据，不需要再次请求数据
			if (res.length < 20) {
				this.touchend = true;
				return
			}
			this.preventRepeatReuqest = false;
		},
		//返回顶部
		backTop(){
			animate(document.body, {scrollTop: '0'}, 400,'ease-out');
		},
		//开发环境与编译环境loading隐藏方式不同
		hideLoading(){
			this.showLoading = false;
		},
	},
  watch: {
    '$route' (to, from) {
      console.log(this.$route.path);
//      this.getExpressList();
      window.location.reload();

    },
    selectList: function (value) {
      console.log(value);
      let _self = this;
      if (_self.selectList.length == 0) {
        _self.bottomSheet = false;
      } else {
        _self.bottomSheet =true;
      }
    }
  },
}
</script>

<style lang="scss" scoped>
	@import '../../style/mixin';
  .shop_list_container{
    margin-top: 1.95rem;
    border-top: 0.025rem solid $bc;
    background-color: #fff;
  }
	.shop_li{
		display: flex;
		border-bottom: 0.025rem solid #f1f1f1;
		padding: 0.7rem 0.4rem;
	}
	.shop_img{
		@include wh(1.5rem, 1.5rem);
		display: block;
		margin-right: 0.4rem;
	}
	.list_back_li{
		height: 4.85rem;
		.list_back_svg{
			@include wh(100%, 100%)
		}
	}
	.shop_right{
		flex: auto;
		.shop_detail_header{
			@include fj;
			align-items: center;
			.shop_title{
				width: 8.5rem;
				color: #333;
				padding-top: .01rem;
				@include font(0.65rem, 0.65rem, 'PingFangSC-Regular');
				font-weight: 700;
			}
			.premium::before{
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
			.shop_detail_ul{
				display: flex;
				transform: scale(.8);
				margin-right: -0.3rem;
				.supports{
					@include sc(0.5rem, #999);
					border: 0.025rem solid #f1f1f1;
					padding: 0 0.04rem;
					border-radius: 0.08rem;
					margin-left: 0.05rem;
				}
			}
		}
		.rating_order_num{
			@include fj(space-between);
			height: 0.6rem;
			margin-top: 0.06rem;
			.rating_order_num_left{
				@include fj(flex-start);
				.rating_section{
					display: flex;
					.rating_num{
						@include sc(0.4rem, #ff6000);
						margin: 0 0.2rem;
					}
				}
				.order_section{
					transform: scale(.8);
					margin-left: -0.2rem;
					@include sc(0.4rem, #666);
				}
			}
			.rating_order_num_right{
				display: flex;
				align-items: center;
				transform: scale(.7);
				min-width: 5rem;
				justify-content: flex-end;
				margin-right: -0.8rem;
				.delivery_style{
					font-size: 0.4rem;
					padding: 0.04rem 0.08rem 0;
					border-radius: 0.08rem;
					margin-left: 0.08rem;
					border: 1px;
				}
				.delivery_left{
					color: #fff;
					background-color: $blue;
					border: 0.025rem solid $blue;
				}
				.delivery_right{
					color: $blue;
					border: 0.025rem solid $blue;
				}
			}
		}
		.fee_distance{
			margin-top: 0.52rem;
			@include fj;
			@include sc(0.5rem, #333);
			.fee{
				transform: scale(.9);
				@include sc(0.5rem, #666);
			}
			.distance_time{
				transform: scale(.9);
				span{
					color: #999;
				}
				.order_time{
					color: $blue;
				}
				.segmentation{
					color: #ccc;
				}
			}
		}
	}
	.loader_more{
		@include font(0.6rem, 3);
		text-align: center;
	    color: #999;
	}
	.empty_data{
		@include sc(0.5rem, #666);
		text-align: center;
		line-height: 2rem;
	}
	.return_top{
		position: fixed;
		bottom: 3rem;
		right: 1rem;
		.back_top_svg{
			@include wh(2rem, 2rem);
		}
	}
	.loading-enter-active, .loading-leave-active {
		transition: opacity 1s
	}
	.loading-enter, .loading-leave-active {
		opacity: 0
	}
  .expressNo {
    font-size: 12px;
    font-weight: 900;
  }
  .msite_title{
    @include center;
    width: 50%;
    color: #fff;
    text-align: center;
    margin-left: -0.5rem;
    .title_text{
      @include sc(0.8rem, #fff);
      text-align: center;
      display: block;
    }
  }
  .msite_nav{
    padding-top: 2.1rem;
    background-color: #fff;
    border-bottom: 0.025rem solid $bc;
    height: 10.6rem;
    .swiper-container{
      @include wh(100%, auto);
      padding-bottom: 0.6rem;
      .swiper-pagination{
        bottom: 0.2rem;
      }
    }
    .fl_back{
      @include wh(100%, 100%);
    }
  }
</style>
