<template>
    <div>
    	<head-top signin-up='msite'>
    		<!--<router-link :to="'/search/geohash'" class="link_search" slot="search">-->
	    		<!--<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">-->
	    			<!--<circle cx="8" cy="8" r="7" stroke="rgb(255,255,255)" stroke-width="1" fill="none"/>-->
	    			<!--<line x1="14" y1="14" x2="20" y2="20" style="stroke:rgb(255,255,255);stroke-width:2"/>-->
	    		<!--</svg>-->
    		<!--</router-link>-->
			<router-link to="/home" slot="msite-title" class="msite_title">
				<span class="title_text ellipsis">{{msietTitle}}</span>
			</router-link>
    	</head-top>
    	<div class="shop_list_container">
	    	<header class="shop_header">
	    		<svg class="shop_icon">
	    			<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#shop"></use>
	    		</svg>
	    	</header>
	    	<shop-list v-if="hasGetData" :geohash="geohash"></shop-list>
    	</div>
    	<foot-guide></foot-guide>
    </div>
</template>

<script>
import {mapMutations} from 'vuex'
// import {imgBaseUrl} from 'src/config/env'
import headTop from 'src/components/header/head'
import footGuide from 'src/components/footer/footGuide'
import expressList from 'src/components/common/expressList'
import {msiteAdress, msiteFoodTypes, cityGuess} from 'src/service/getData'
import 'src/plugins/swiper.min.js'
import 'src/style/swiper.min.css'

export default {
	data(){
        return {
        	geohash: '', // city页面传递过来的地址geohash
            msietTitle: '请选择地址...', // msiet页面头部标题
            foodTypes: [], // 食品分类列表
            hasGetData: false, //是否已经获取地理位置数据，成功之后再获取商铺列表信息
            imgBaseUrl: 'https://fuss10.elemecdn.com', //图片域名地址
            titleType: [
              [
                {
                  "id": 20,
                  "is_in_serving": true,
                  "description": "我的快递",
                  "title": "我的快递",
                  "link": "eleme://restaurants?filter_key=%7B%22category_schema%22%3A%7B%22category_name%22%3A%22%5Cu751c%5Cu54c1%5Cu996e%5Cu54c1%22%2C%22complex_category_ids%22%3A%5B240%2C241%2C242%5D%2C%22is_show_all_category%22%3Atrue%7D%2C%22restaurant_category_id%22%3A%7B%22id%22%3A239%2C%22name%22%3A%22%5Cu751c%5Cu54c1%5Cu996e%5Cu54c1%22%2C%22sub_categories%22%3A%5B%5D%2C%22image_url%22%3A%22%22%7D%2C%22activities%22%3A%5B%5D%7D&target_name=%E7%94%9C%E5%93%81%E9%A5%AE%E5%93%81&animation_type=1&is_need_mark=0&banner_type=",
                  "image_url": "/2/35/696aa5cf9820adada9b11a3d14bf5jpeg.jpeg",
                  "icon_url": "",
                  "title_color": "",
                  "__v": 0,
                  "routerpage": true
                },
                {
                  "id": 15,
                  "is_in_serving": true,
                  "description": "特供商城",
                  "title": "源信特供",
                  "link": "eleme://restaurants?filter_key=%7B%22category_schema%22%3A%7B%22category_name%22%3A%22%5Cu7f8e%5Cu98df%22%2C%22complex_category_ids%22%3A%5B207%2C220%2C233%2C260%5D%2C%22is_show_all_category%22%3Afalse%7D%2C%22restaurant_category_id%22%3A%7B%22id%22%3A207%2C%22name%22%3A%22%5Cu5feb%5Cu9910%5Cu4fbf%5Cu5f53%22%2C%22sub_categories%22%3A%5B%5D%2C%22image_url%22%3A%22%22%7D%2C%22activities%22%3A%5B%5D%7D&target_name=%E7%BE%8E%E9%A3%9F&animation_type=1&is_need_mark=0&banner_type=",
                  "image_url": "/b/7e/d1890cf73ae6f2adb97caa39de7fcjpeg.jpeg",
                  "icon_url": "",
                  "title_color": "",
                  "__v": 0,
                  "routerpage": false,
                },
                {
                  "id": 225,
                  "is_in_serving": true,
                  "description": "有菜有肉，营养均衡",
                  "title": "商业圈",
                  "link": "eleme://restaurants?filter_key=%7B%22activity_types%22%3A%5B3%5D%2C%22category_schema%22%3A%7B%22category_name%22%3A%22%5Cu7b80%5Cu9910%22%2C%22complex_category_ids%22%3A%5B209%2C212%2C215%2C265%5D%2C%22is_show_all_category%22%3Atrue%7D%2C%22restaurant_category_id%22%3A%7B%22id%22%3A207%2C%22name%22%3A%22%5Cu5feb%5Cu9910%5Cu4fbf%5Cu5f53%22%2C%22sub_categories%22%3A%5B%5D%2C%22image_url%22%3A%22%22%7D%2C%22activities%22%3A%5B%7B%22id%22%3A3%2C%22name%22%3A%22%5Cu4e0b%5Cu5355%5Cu7acb%5Cu51cf%22%2C%22icon_name%22%3A%22%5Cu51cf%22%2C%22icon_color%22%3A%22f07373%22%2C%22is_need_filling%22%3A1%2C%22is_multi_choice%22%3A0%2C%22filter_value%22%3A3%2C%22filter_key%22%3A%22activity_types%22%7D%5D%7D&target_name=%E7%AE%80%E9%A4%90&animation_type=1&is_need_mark=0&banner_type=",
                  "image_url": "/d/38/7bddb07503aea4b711236348e2632jpeg.jpeg",
                  "icon_url": "",
                  "title_color": "",
                  "__v": 0,
                  "routerpage": false,
                },
                {
                  "id": 403297,
                  "is_in_serving": true,
                  "description": "大胆尝鲜，遇见惊喜",
                  "title": "社区服务",
                  "link": "eleme://restaurants?filter_key=%7B%22category_schema%22%3A%7B%22category_name%22%3A%22%5Cu65b0%5Cu5e97%5Cu7279%5Cu60e0%22%2C%22complex_category_ids%22%3A%5B207%2C220%2C233%2C239%2C244%2C248%2C252%2C260%5D%2C%22is_show_all_category%22%3Atrue%7D%2C%22restaurant_category_id%22%3A%7B%22id%22%3A207%2C%22name%22%3A%22%5Cu5feb%5Cu9910%5Cu4fbf%5Cu5f53%22%2C%22sub_categories%22%3A%5B%5D%2C%22image_url%22%3A%22%22%7D%2C%22support_ids%22%3A%5B-1%5D%2C%22activities%22%3A%5B%5D%7D&target_name=%E6%96%B0%E5%BA%97%E7%89%B9%E6%83%A0&animation_type=1&is_need_mark=0&banner_type=",
                  "image_url": "/a/fa/d41b04d520d445dc5de42dae9a384jpeg.jpeg",
                  "icon_url": "",
                  "title_color": "",
                  "__v": 0,
                  "routerpage": false,
                },
                {
                  "id": 92,
                  "is_in_serving": true,
                  "description": "准时必达，超时赔付",
                  "title": "我的钱包",
                  "link": "eleme://restaurants?filter_key=%7B%22support_ids%22%3A%5B9%5D%2C%22activities%22%3A%5B%7B%22id%22%3A9%2C%22name%22%3A%22%5Cu51c6%5Cu65f6%5Cu8fbe%22%2C%22icon_name%22%3A%22%5Cu51c6%22%2C%22icon_color%22%3A%22E8842D%22%2C%22is_need_filling%22%3A0%2C%22is_multi_choice%22%3A1%2C%22filter_value%22%3A9%2C%22filter_key%22%3A%22support_ids%22%2C%22description%22%3A%22%5Cu51c6%5Cu65f6%5Cu8fbe%22%7D%5D%7D&target_name=%E5%87%86%E6%97%B6%E8%BE%BE&animation_type=1&is_need_mark=0&banner_type=",
                  "image_url": "/3/84/8e031bf7b3c036b4ec19edff16e46jpeg.jpeg",
                  "icon_url": "",
                  "title_color": "",
                  "__v": 0,
                  "routerpage": false,
                },
                {
                  "id": 1,
                  "is_in_serving": true,
                  "description": "0元早餐0起送，每天都有新花样。",
                  "title": "预订早餐",
                  "link": "eleme://web?url=https%3A%2F%2Fzaocan.ele.me&target_name=%E9%A2%84%E8%AE%A2%E6%97%A9%E9%A4%90&animation_type=1&is_need_mark=&banner_type=",
                  "image_url": "/d/49/7757ff22e8ab28e7dfa5f7e2c2692jpeg.jpeg",
                  "icon_url": "",
                  "title_color": "",
                  "__v": 0,
                  "routerpage": false,
                },
              ],
              [
                {
                  "id": 288,
                  "is_in_serving": true,
                  "description": "无辣不欢",
                  "title": "川湘菜",
                  "link": "eleme://restaurants?filter_key=%7B%22category_schema%22%3A%7B%22category_name%22%3A%22%5Cu5ddd%5Cu6e58%5Cu83dc%22%2C%22complex_category_ids%22%3A%5B221%5D%2C%22is_show_all_category%22%3Atrue%7D%2C%22restaurant_category_id%22%3A%7B%22id%22%3A220%2C%22name%22%3A%22%5Cu7279%5Cu8272%5Cu83dc%5Cu7cfb%22%2C%22sub_categories%22%3A%5B%5D%2C%22image_url%22%3A%22%22%7D%2C%22activities%22%3A%5B%5D%7D&target_name=%E5%B7%9D%E6%B9%98%E8%8F%9C&animation_type=1&is_need_mark=0&banner_type=",
                  "image_url": "/9/7c/9700836a33e05c2410bda8da59117jpeg.jpeg",
                  "icon_url": "",
                  "title_color": "",
                  "__v": 0,
                  "routerpage": false,
                },
                {
                  "id": 65,
                  "is_in_serving": true,
                  "description": "",
                  "title": "土豪推荐",
                  "link": "eleme://restaurants?filter_key=%7B%22activities%22%3A%5B%7B%22filter_key%22%3A%22tags%22%2C%22filter_value%22%3A0%7D%5D%7D&target_name=%E5%9C%9F%E8%B1%AA%E6%8E%A8%E8%8D%90&animation_type=1&is_need_mark=0&banner_type=",
                  "image_url": "/e/7e/02b72b5e63c127d5bfae57b8e4ab1jpeg.jpeg",
                  "icon_url": "",
                  "title_color": "",
                  "__v": 0,
                  "routerpage": false,
                }
              ]
            ],
        }
    },
    async beforeMount(){
		if (!this.$route.query.geohash) {
			const address = await cityGuess();
			this.geohash = address.latitude + ',' + address.longitude;
		}else{
			this.geohash = this.$route.query.geohash
		}
		//保存geohash 到vuex
		this.SAVE_GEOHASH(this.geohash);
    	//获取位置信息
    	let res = await msiteAdress(this.geohash);
    	this.msietTitle = res.name;
    	// 记录当前经度纬度
    	this.RECORD_ADDRESS(res);

    	this.hasGetData = true;
    },
    mounted(){
        //获取导航食品类型列表
       	msiteFoodTypes(this.geohash).then(res => {
//       		let resLength = res.length;
//       		let resArr = [...res]; // 返回一个新的数组
//       		let foodArr = [];
//    		for (let i = 0, j = 0; i < resLength; i += 8, j++) {
//    			foodArr[j] = resArr.splice(0, 8);
//    		}
//    		console.info('foodArr:'+JSON.stringify(foodArr));
    		this.foodTypes = this.titleType;
        }).then(() => {
        	//初始化swiper
        	new Swiper('.swiper-container', {
		        pagination: '.swiper-pagination',
		        loop: true
		    });
        })
    },
    components: {
    	headTop,
      expressList,
    	footGuide,
    },
    computed: {

    },
    methods: {
    	...mapMutations([
    		'RECORD_ADDRESS', 'SAVE_GEOHASH'
    	]),
    	// 解码url地址，求去restaurant_category_id值
    	getCategoryId(url){
    		let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name',''));
    		if (/restaurant_category_id/gi.test(urlData)) {
    			return JSON.parse(urlData).restaurant_category_id.id
    		}else{
    			return ''
    		}
    	},
      checkPage(type){
    	  if(type == false){
    	    return '/food'
        } else {
    	    return '/expressHomeComponent';
        }
      }
    },
    watch: {

    }
}

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
	.link_search{
		left: .8rem;
		@include wh(.9rem, .9rem);
		@include ct;
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
	.food_types_container{
		display:flex;
		flex-wrap: wrap;
		.link_to_food{
			width: 25%;
			padding: 0.3rem 0rem;
			@include fj(center);
			figure{
				img{
					margin-bottom: 0.3rem;
					@include wh(1.8rem, 1.8rem);
				}
				figcaption{
					text-align: center;
					@include sc(0.55rem, #666);
				}
			}
		}
	}
	.shop_list_container{
		margin-top: .4rem;
		border-top: 0.025rem solid $bc;
		background-color: #fff;
		.shop_header{
			.shop_icon{
				fill: #999;
				margin-left: 0.6rem;
				vertical-align: middle;
				@include wh(0.6rem, 0.6rem);
			}
			.shop_header_title{
				color: #999;
				@include font(0.55rem, 1.6rem);
			}
		}
	}

</style>
