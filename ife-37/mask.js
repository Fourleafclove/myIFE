/**
 * Created by MacBook on 16/4/13.
 */
(function (w,d) {
    var unique,dragFn,drogFn,moveFn,closeFn,maskFn;
    var Layer = function (text) {
        this.text= text;
        this.dragFlag=false;
        this.startX=0;
        this.startY=0
    };
    Layer.prototype={
        init:function(){
            var that = this;
            this.wrap = d.createElement('div');
            this.dialog= d.createElement("div");
            this.mask= d.createElement("div");
            this.dialogT= d.createElement("div");
            this.dialogC= d.createElement("div");
            this.closeBtn= d.createElement("button");

            this.wrap.className="wrap";
            this.dialog.className="dialog";
            this.mask.className = "mask";
            this.dialogT.className = "dialogT";
            this.dialogC.className = "dialogC";
            this.closeBtn.className = "closeBtn";
            this.closeBtn.innerHTML = "确定";

            this.dialogC.appendChild(this.closeBtn);
            this.dialog.appendChild(this.dialogT);
            this.dialog.appendChild(this.dialogC);
            this.wrap.appendChild(this.mask);
            this.wrap.appendChild(this.dialog);

            this.dialogT.addEventListener("mousedown",dragFn= function (event) {
                that.dragFlag=true;
                that.startX= event.pageX;
                that.startY= event.pageY;
                that.left = parseInt(w.getComputedStyle(that.dialog, null)['left']);
                that.top = parseInt(w.getComputedStyle(that.dialog, null)['top']);
            });
            this.dialogT.addEventListener("mouseup",drogFn= function () {
                that.dragFlag=false;
            });
            this.dialog.addEventListener("mousemove",moveFn=function(event){
                that.onDrag(event,that);
            });

            this.mask.addEventListener("click",maskFn= function () {
                that.close(that)
            });

            this.closeBtn.addEventListener("click",closeFn= function () {
                that.close(that)
            });
            d.getElementsByTagName('BODY')[0].appendChild(this.wrap);
        },
        pop: function () {
            var that = this;
            this.init();
            this.dialogT.innerHTML=this.text;
        }
        ,
        close: function (that) {
            d.getElementsByTagName("body")[0].removeChild(that.wrap);
            this.dialogT.removeEventListener("mousedown",dragFn);
            this.dialogT.removeEventListener("mouseup",drogFn);
            this.dialog.removeEventListener("mousemove",moveFn);
            this.mask.removeEventListener("mousedown",maskFn);
            this.closeBtn.removeEventListener("mousedown",closeFn);
        },

        onDrag: function (event,that) {
            if (that.dragFlag){
                that.dialog.style.left = (event.pageX - that.startX + that.left) + 'px';
                that.dialog.style.top = (event.pageY - that.startY + that.top) + 'px';
            }
        }
    }

    var POP={
        pop: function (text) {
            var layer = new Layer(text);
                layer.pop();

        }
    }
    window["POP"] = POP;
})(window,document);