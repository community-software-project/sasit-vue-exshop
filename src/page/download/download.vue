 <template>
  <div class="download_page">
        <head-top head-title="下载" go-back='true'></head-top>
        <section class="dowload_container">
          <svg t="1517021027107" class="icon_style" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="34495" xmlns:xlink="http://www.w3.org/1999/xlink" width="160" height="160"><path d="M688 576c9.562 0 18.656 1.562 27.532 3.844C746.124 539.124 768 491.438 768 437.25 768 354.844 702.5 288 621.5 288c-43.75 0-82.75 20.156-109.5 51.532C485 308.156 446 288 402.25 288 321.5 288 256 354.844 256 437.25 256 624 512 736 512 736s28-12.406 65.282-35.376C576.812 696.406 576 692.312 576 688 576 626.25 626.25 576 688 576z" p-id="34496" fill="#db639b"></path><path d="M512 0C229.218 0 0 229.218 0 512s229.218 512 512 512 512-229.218 512-512S794.782 0 512 0zM512 944c-238.594 0-432-193.406-432-432S273.406 80 512 80s432 193.406 432 432S750.594 944 512 944z" p-id="34497" fill="#db639b"></path><path d="M688 608c-44.188 0-80 35.812-80 80s35.812 80 80 80 80-35.812 80-80S732.188 608 688 608zM688 748.812 649.594 704 672 704l0-64 32 0 0 64 22.406 0L688 748.812z" p-id="34498" fill="#db639b"></path></svg>
            <p>下载源信APP</p>
            <div class="determine" @click="download">下载</div>
        </section>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import alertTip from 'src/components/common/alertTip'

    export default {
      data(){
            return{
                system: null,
                showAlert: false,
                alertText: null,
            }
        },
        created(){
            //判断系统
            let u = navigator.userAgent;
            let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
            let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isAndroid) {
                this.system = 'Android';
            } else if (isIOS) {
                this.system = 'IOS';
            } else {
                this.system = 'pc';
            }
        },
        mixins: [],
        components: {
            headTop,
            alertTip,
        },
        props:[],
        methods: {
            download(){
                //如果是ios用户则提示，否则直接下载
                if( this.system == 'IOS'){
                    this.showAlert = true;
                    this.alertText = 'IOS用户请前往AppStore下载'
                }else{
                    try {
                        let elemIF = document.createElement("iframe");
                        elemIF.src = 'http://121.41.76.133/Express/pages/system/app/apk/download/app-debug-es.apk';
                        elemIF.style.display = "none";
                        document.body.appendChild(elemIF);
                    } catch (e) {
                        alert('下载失败')
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .download_page{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #fff;
        z-index: 202;
        padding-top: 1.95rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .dowload_container{
        text-align: center;
        .logo_img{
           border-radius: 1rem;
            margin-top: 1rem;
        }
        p{
            @include sc(.8rem, #666);
            margin-bottom: 1rem;
        }
        .determine{
            background-color: #4cd964;
            @include sc(.7rem, #fff);
            text-align: center;
            margin: 0 .7rem;
            line-height: 1.8rem;
            border-radius: 0.2rem;
            margin-top: 0.5rem;
        }
    }

    .icon_style {
      @include wh(5.9rem, 5.9rem);
      margin-bottom: .2rem;
      margin-top: .3rem;
      fill: #ccc;
    }
</style>
