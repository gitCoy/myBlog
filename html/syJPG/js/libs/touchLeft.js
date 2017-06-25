;(function(window, undefined){
    var ADSupportsTouches = ("createTouch" in document) || ('ontouchstart' in window) || 0,
        doc=document.documentElement || document.getElementsByTagName('html')[0],
        ADSupportsTransition = ("WebkitTransition" in doc.style)
            || ("MsTransition" in doc.style)
            || ("MozTransition" in doc.style)
            || ("OTransition" in doc.style)
            || ("transition" in doc.style)
            || 0,
        ADStartEvent = ADSupportsTouches ? "touchstart" : "mousedown",
        ADMoveEvent = ADSupportsTouches ? "touchmove" : "mousemove",
        ADEndEvent = ADSupportsTouches ? "touchend" : "mouseup",
        Leftslider=function(opt){
            this.opt=this.parse_args(opt);
            this.container=this.$(this.opt.id);
            try{
                if(this.container.nodeName.toLowerCase()=='ul'){
                    this.element=this.container;
                    this.container=this.element.parentNode;
                }else{
                    this.element=this.container.getElementsByTagName('ul')[0];
                }
                if(typeof this.element==='undefined')throw new Error('Can\'t find "ul"');
                for(var i=0;i<this.instance.length;i++){
                    if(this.instance[i]==this.container) throw new Error('An instance is running');
                }
                this.instance.push(this.container);
                this.init();
            }catch(e){
                this.status=-1;
                this.errorInfo=e.message;
            }
        };
    Leftslider.prototype = {
    //判断设备是否支持touch事件
    touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    slider: $('.slider'),

    //事件
    events: {
        index: 0,     //显示元素的索引
        slider: $(".slider"),     //this为slider对象
        slidlabW: $(".slidlab").width(),     //this为slider对象
        isScroll: false,
        isCnt:false,
        handleEvented: function (event) {
            var self = this;     //this指events对象
            if (event.type == 'touchstart') {
                self.start(event, self);
            } else if (event.type == 'touchmove') {
                self.move(event);
            } else if (event.type == 'touchend') {
                self.end(event);
            }
        },
        //滑动开始
        start: function (event) {
            var touch = event.targetTouches[0];     //touches数组对象获得屏幕上所有的touch，取第一个touch
            startPos = {x: touch.pageX, y: touch.pageY, time: +new Date};    //取第一个touch的坐标值
            isScrolling = 0;   //这个参数判断是垂直滚动还是水平滚动
            for(var i=0;i<this.slider.length;i++){
                if(this.slider[i].style.transform == "translateX(-" + this.slidlabW + "px)" && event.target.className !== "aRight"){
                    this.index = 0;
                    event.preventDefault();      //阻止触摸事件的默认行为，即阻止滚屏
                    this.isScroll = true;
                    this.isCnt = true;
                    this.slider[i].style.transform = 'translateX(0px)';
                }
            }
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
                event.currentTarget.className = 'cnt';
                if(event.currentTarget.style.transform == 'translateX(0px)' && endPos.x > 0){
                    event.currentTarget.style.transform = 'translateX(0px)';
                }else if(event.currentTarget.style.transform == "translateX(-" + this.slidlabW + "px)" && endPos.x < 0){
                    event.currentTarget.style.transform = "translateX(-" + this.index * this.slidlabW + 'px)';
                }else{
                    var numEvenLeft = event.currentTarget.style.transform.replace(/translateX\(/g,"");
                    numEvenLeft = numEvenLeft.replace(/px\)/,"");
                    if(Number(numEvenLeft) <= 0){
                        var slWepx = -this.index * this.slidlabW + endPos.x;
                        event.currentTarget.style.transform = "translateX(" + slWepx + "px)";
                    }else{
                        event.currentTarget.style.transform = 'translateX(0px)';
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
                endPos.x = 0;
                event.currentTarget.className = 'cnt f-anim';
                event.currentTarget.style.transform = "translateX(" + -this.index * this.slidlabW + "px";
            }
            //解绑事件
            this.isScroll = false;
            this.slider.unbind('touchmove', this, false);
            this.slider.unbind('touchend', this, false);
        },
        style:function(){
            var mSlider = $(".centerSection").width();
            $(".slidcont").width(mSlider);
            var slidlabWid = $(".slidlab").width();
            $(".slider").width(mSlider + slidlabWid);
        }
    },

    //初始化
    init: function () {
        var self = this;     //this指slider对象
        self.events.style();
        this.addListener(self.slider,ADStartEvent,this.bind(this.handleEvented,this),false);
        this.addListener(self.slider,ADMoveEvent,this.bind(this.handleEvented,this),false);
        this.addListener(self.slider,ADEndEvent,this.bind(this.handleEvented,this),false);
        //addEventListener第二个参数可以传一个对象，会调用该对象的handleEvent属性
    }
};

    window.Leftslider=Leftslider;
})(window, undefined);