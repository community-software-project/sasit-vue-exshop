/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */

let baseUrl = '';
let routerMode = 'history';
let imgBaseUrl;
let staticImgUrl='http://icons.iconarchive.com/icons/';


if (process.env.NODE_ENV == 'development') {
    imgBaseUrl = 'http://icons.iconarchive.com/icons/';

}else if(process.env.NODE_ENV == 'production'){
	// baseUrl = 'http://cangdu.org:8001';
    imgBaseUrl = 'http://icons.iconarchive.com/icons/';
}

export {
	baseUrl,
	routerMode,
	imgBaseUrl,
  staticImgUrl
}
