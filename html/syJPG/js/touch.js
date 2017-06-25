
window.slider = {}
;(function(S,window,zepto){//判断设备是否支持touch事件
    S.slidered = {
        touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
        slider:"",

        //事件
        events: {
            index: 0,     //显示元素的索引
            slider: "",     //this为slider对象
            slidlabW: "",     //this为slider对象
            isScroll: false,
            isCnt:false,
            handleEvented: function (event) {
                if (event.type == 'touchstart') {
                    slider.slidered.events.start(event);
                } else if (event.type == 'touchmove') {
                    slider.slidered.events.move(event);
                } else if (event.type == 'touchend') {
                    slider.slidered.events.end(event);
                }
            },
        //滑动开始
        start: function (event) {
            this.slidlabW = $(".slidlab").width();
            this.slider = $(".slider");
            var touch = event.targetTouches[0];     //touches数组对象获得屏幕上所有的touch，取第一个touch
            startPos = {x: touch.pageX, y: touch.pageY, time: +new Date};    //取第一个touch的坐标值
            isScrolling = 0;   //这个参数判断是垂直滚动还是水平滚动
            for(var i= 0,sldLenth = this.slider.length;i<sldLenth;i++){
                if(this.slider[i].style.transform == "translateX(-" + this.slidlabW + "px)" && event.target.parentNode.className !== "slidlab SR-close"){
                    this.index = 0;
                    event.preventDefault();      //阻止触摸事件的默认行为，即阻止滚屏
                    this.isScroll = true;
                    this.isCnt = true;
                    this.slider[i].style.transform = 'translateX(0px)';
                }
            }
            endPos = {x: 0, y: 0};
            this.slider.unbind('touchmove', this, false);
            this.slider.unbind('touchend', this, false);
        },
        //移动
        move: function (event) {
            //当屏幕有多个touch或者页面被缩放过，就不执行move操作
            if (event.targetTouches.length > 1 || event.scale && event.scale !== 1 || this.isScroll == true) return;
            var touch = event.targetTouches[0];
            endPos = {x: touch.pageX - startPos.x, y: touch.pageY - startPos.y};
            isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) && Math.abs(endPos.x) < 10 ? 1 : 0;    //isScrolling为1时，表示纵向滑动，0为横向滑动
            if (isScrolling === 0) {
                event.preventDefault();      //阻止触摸事件的默认行为，即阻止滚屏
                event.currentTarget.className = 'cnt slider';
                if(event.currentTarget.style.transform == 'translateX(0px)' && endPos.x > 0){
                    event.currentTarget.style.transform = 'translateX(0px)';
                    event.currentTarget.style.webkittransform = '-webkit-translateX(0px)';
                }else if(event.currentTarget.style.transform == "translateX(-" + this.slidlabW + "px)" && endPos.x < 0){
                    event.currentTarget.style.transform = "translateX(-" + this.index * this.slidlabW + 'px)';
                    event.currentTarget.style.webkittransform = "-webkit-translateX(-" + this.index * this.slidlabW + 'px)';
                }else{
                    var currentTarget = event.currentTarget;
                    currentTarget = currentTarget.style.webkitTransform;
                    var numEvenLeft = currentTarget.replace(/translateX\(/g,"");
                    numEvenLeft = numEvenLeft.replace(/px\)/,"");
                    if(Number(numEvenLeft) <= 0){
                        var slWepx = -this.index * this.slidlabW + endPos.x;
                        event.currentTarget.style.webkittransform = "-webkit-translateX(" + slWepx + "px)";
                        event.currentTarget.style.transform = "translateX(" + slWepx + "px)";
                    }else{
                        event.currentTarget.style.transform = 'translateX(0px)';
                        event.currentTarget.style.webkittransform = '-webkit-translateX(0px)';
                    }
                }
            } else {
                this.isScroll = true;
            }
        },
        //滑动释放
        end: function (event) {
            var duration = +new Date - startPos.time;    //滑动的持续时间
            if (isScrolling === 0) {    //当为水平滚动时
                if (Number(duration) > 100 && this.isCnt == false) {
                    //判断是左移还是右移，当偏移量大于10时执行
                    if (endPos.x > 10) {
                        if (this.index !== 0) this.index = 0;
                    } else if (endPos.x < -10) {
                        if (this.index !== 1) this.index = 1;
                    }
                }
                this.isCnt = false;
                endPos && (endPos.x = 0);
                event.currentTarget.className = 'cnt slider f-anim';
                event.currentTarget.style.webkittransform = "-webkit-translateX("+ -this.index * this.slidlabW + "px";
                event.currentTarget.style.transform = "translateX("+ -this.index * this.slidlabW + "px";
            }
            //解绑事件
            this.isScroll = false;
            this.slider.unbind('touchmove', this, false);
            this.slider.unbind('touchend', this, false);
        }
    },
        style:function(ListNum){
            var mSlider = $(".centerSection").width();
            $(".slidcont").width(mSlider);
            var slidW = $(".sectCont").eq(ListNum).find(".slidlab").width();
            $(".sectCont").eq(ListNum).find(".cnt").width(mSlider + slidW);
            this.slidlabW = slidW;
        },
        //初始化
        init: function (ListNum) {
            var self = this;     //this指slider对象
            self.style(ListNum);
            self.slider = $(".slider");
            self.slider.bind('touchstart',self.events.handleEvented,false);
            self.slider.bind('touchmove',self.events.handleEvented,false);
            self.slider.bind('touchend',self.events.handleEvented,false);
        }
    }
})(slider,window,Zepto);