//存放飞船对象的数组
var shipList=[];
//动力系统数组
var powerList=[[3,5,"前进号"],[5,7,"奔腾号"],[8,9,"超越号"]];
//能源系统数组
var energyList=[[2,"劲量型"],[3,"光能型"],[4,"永久型"]];
//发送指令数组
var commandList=["fly","stop","destroy"];
//重写console.log
window.console.log=function(str,color){
    $("#console").append('<p style="color: '+color+';">'+str+'</p>');
};
//拖动
function addDrag(div) {

    div.onmousedown = function (e) {
        var event = e || window.event;
        var disL = event.clientX - div.offsetLeft;
        var disT = event.clientY - div.offsetTop;
        var maxL = document.documentElement.clientWidth - div.offsetWidth;
        var maxT = document.documentElement.clientHeight - div.offsetHeight;

        document.onmousemove = function (e) {
            var event = e || window.event;
            var disX = event.clientX - disL;
            var disY = event.clientY - disT;

            if (disX < 0) {
                disX = 0
            }
            if (disY < 0) {
                disY = 0
            }
            if (disX > maxL) {
                disX = maxL
            }
            if (disY > maxT) {
                disY = maxT
            }

            div.style.left = disX + "px";
            div.style.top = disY + "px";
        };
        div.onmouseup = function () {
            document.onmousemove = null;
        }
    }
}
//飞船工厂

function spaceShipFactory(track,powerType,energyType) {
    var spaceShip = {
        id: track,
        energy: 100,
        isStop: true,
        destroy: false,
        deg: 0,
        energyTimeout:null,
        rotateTimeout:null,
        deliverInterval:null,
        degPlus:powerList[powerType][0],
        energyCost:powerList[powerType][1],
        energyPlus:energyList[energyType][0],
        //发射飞船
        sendShip: function () {
            this.energySystem();
            this.rotateSystem();
            this.deliverInterval=setInterval(this.deliverSystem.bind(this),1000);
            $("#track"+track).append("<div class='ship' id='ship"+track+"'><div class='energy'>"+this.nameSystem()+"</div></div>")
        },
        //命名系统,
        nameSystem:function(){
            return "<span>"+this.id+"号-"+this.energy+"%</span>";
        },
        //动力系统
        powerSystem: function (command) {
            if (command == "stop") {
                this.isStop = true;
            } else if (command == "fly") {
                this.isStop = false;
            }
        },
        //能源系统
        energySystem: function () {
            this.energy += this.energyPlus;
            if (this.energy >= 100)
                this.energy = 100;
            if (!this.isStop) {
                this.energy -= this.energyCost;
            }
            if (this.energy <= 0) {
                console.log(this.id+"号飞船耗尽燃料，停止飞行！","red");
                this.energy = 0;
                this.isStop = true;
            }
            $("#ship"+this.id+" .energy").css({width:""+this.energy+"px"}).html(this.nameSystem());
            this.energyTimeout=setTimeout(this.energySystem.bind(this), 1000);
        },
        rotateSystem:function(){
            if(!this.isStop) {
                this.deg+=this.degPlus;
                $("#track" + this.id).css({transform: "rotate(" + this.deg + "deg)"});
            }
            this.rotateTimeout=setTimeout(this.rotateSystem.bind(this), 100);
        },
        //接受信息的系统
        messageSystem: function (str) {
            var id=this.adapter(str.slice(0,4),1);
            var command=commandList[this.adapter(str.slice(4),1)];
            if (id == this.id) {
                switch (command) {
                    case "stop":
                        this.powerSystem(command);
                        break;
                    case "fly":
                        this.powerSystem(command);
                        break;
                    case "destroy":
                        this.selfDestroy(command);
                        break;
                    default :
                        return;
                }
            } else {
                return;
            }
        },
        //发送信息的系统
        deliverSystem:function(){
            var str="";
            str+=this.adapter(this.id,2);
            if(this.destroy)
                str+=this.adapter(2,2);
            else if(this.isStop)
                str+=this.adapter(1,2);
            else
                str+=this.adapter(0,2);
            str+=this.adapter(this.energy,3);
            BUS(0,str);
        },
        //进制信息转换器
        adapter:function(str,type){
            return adapter(str,type);
        },
        //自毁系统
        selfDestroy: function (command) {
            if (!this.destroy && command == "destroy") {
                this.destroy = true;
                $("#track" + this.id).css({transform: "rotate(0deg)"});
                clearTimeout(this.energyTimeout);
                clearTimeout(this.rotateTimeout);
                clearInterval(this.deliverInterval);
                this.deliverSystem();
                console.log(this.id+"号飞船已被摧毁","red");
                shipList = shipList.filter(function (v) {
                    if(v.id==this.id) {
                        v=null;
                    }else
                        return true;
                });
                $("#ship"+this.id).remove();
            };
        }
    };
    return spaceShip;
}
var Planet={
    //信号接收器
    acceptSystem:function(message){
        var tr=$("#s"+message.shipID+"");
        tr.find("td:eq(1)").html(commandList[message.shipStatus]);
        tr.find("td:eq(2)").html(message.shipEnergy);
        this.DC.push(message);
    },
    //数据中心
    DC:[],
    //控制中心
    controlCenter:function(){
        //绑定指令事件
        $(".button").on("click",function(){
            var id=$(this).data("target");
            var content=$(this).html();
            var powerType=$("input[name=power]:checked").val();
            var energyType=$("input[name=energy]:checked").val();
            switch (content){
                case "create":
                    if(!$("#ship"+id).html()) {
                        var ship = spaceShipFactory(id,powerType,energyType);
                        shipList.push(ship);
                        ship.sendShip();
                        console.log("飞船发射成功","green");
                    }else{
                        console.log("创建失败,轨道上已有飞船！","red");

                    }
                    $(this).html("destroy");
                    break;
                case "destroy":
                    BUS(id,"destroy");
                    $(this).html("create");
                    $(this).parent().next().find("button").html("fly");
                    break;
                case "fly":
                    BUS(id,"fly");
                    $(this).html("stop");
                    break;
                case "stop":
                    BUS(id,"stop");
                    $(this).html("fly");
                    break;
            }
        });
    }
};
//进制信息转换器
var adapter=function(str,type){
    //2进制转10进制
    if(type==1){
        return parseInt(str,2).toString();
    }
    //10进制转四位二进制
    else if(type==2){
        var message=parseInt(str).toString(2);
        var zeros="";
        for(var i=0;i<4-message.length;i++){
            zeros+="0";
        }
        return zeros+message;
    }
    //10进制转八位二进制
    else if(type==3){
        var message=parseInt(str).toString(2);
        var zeros="";
        for(var i=0;i<8-message.length;i++){
            zeros+="0";
        }
        return zeros+message;
    }
};
//传播介质
function BUS(id,content){
    if (Math.random() <= 0.1) {
        arguments.callee(id, content);
    } else {
        //接收信息
        if(!id){
            var message={shipID:0,shipStatus:"",shipEnergy:""};
            message.shipID=adapter(content.slice(0,4),1);
            message.shipStatus=adapter(content.slice(4,8),1);
            message.shipEnergy=adapter(content.slice(8),1);
            Planet.acceptSystem(message);
             //console.log(JSON.stringify(message))
        }
        //传递信息
        else {
            var message = adapter(id,2) + adapter(commandList.indexOf(content),2);
            setTimeout(function () {
                shipList.forEach(function (v) {
                    v.messageSystem(message);
                });
            }, 300);
        }
    }
};
Planet.controlCenter();
addDrag(document.getElementById("screen"));
addDrag(document.getElementById("table"));

