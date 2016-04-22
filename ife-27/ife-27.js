//存放飞船对象的数组
var shipList=[];
//动力系统数组
var powerList=[[3,5,"前进号"],[5,7,"奔腾号"],[8,9,"超越号"]];
//能源系统数组
var energyList=[[2,"劲量型"],[3,"光能型"],[4,"永久型"]];
var commandList=["fly","stop","destroy"];
//重写console.log
window.console.log=function(str,color){
    $("#console").append('<p style="color: '+color+';">'+str+'</p>');
};
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
        degPlus:powerList[powerType][0],
        energyCost:powerList[powerType][1],
        energyPlus:energyList[energyType][0],
        //发射飞船
        sendShip: function () {
            this.energySystem();
            this.rotateSystem();
            $("#track"+track).append("<div class='ship' id='ship"+track+"'><div class='energy'>"+this.nameSystem()+"</div></div>")
        },
        nameSystem:function(){
            return "<span>"+this.id+"号-"+this.energy+"%</span>";
        },
        powerSystem: function (command) {
            if (command == "stop") {
                this.isStop = true;
            } else if (command == "fly") {
                this.isStop = false;
            }
        },
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
        messageSystem: function (obj) {
            if (obj.id == this.id) {
                switch (obj.command) {
                    case "stop":
                        this.powerSystem(obj.command);
                        break;
                    case "fly":
                        this.powerSystem(obj.command);
                        break;
                    case "destroy":
                        this.selfDestroy(obj.command);
                        break;
                    default :
                        return;
                }
            } else {
                return;
            }
        },
        //10进制信息转换器
        adapter:function(message){
            var id=parseInt(message.slice(0,4),2).toString();
            var command=commandList[parseInt(message.slice(4),2).toString()];
            var obj={"id":id,"command":command};
            this.messageSystem(obj);
        },
        selfDestroy: function (command) {
            if (!this.destroy && command == "destroy") {
                this.destroy = true;
                $("#track" + this.id).css({transform: "rotate(0deg)"});
                clearTimeout(this.energyTimeout);
                clearTimeout(this.rotateTimeout);
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
};
//传播介质
function BUS(id,content){
    if(Math.random()<=0.1){
        arguments.callee(id,content);
    }else{
        var message=parseInt(id).toSendMessage(2)+commandList.indexOf(content).toSendMessage(2);
        setTimeout(function(){
            shipList.forEach(function(v){
                v.adapter(message);
            });
        },300);
    }
    // console.log(JSON.stringify(shipList))
};
//转四位二进制数的方法
Number.prototype.toSendMessage=function(num){
    var message=this.toString(num);
    var zeros="";
    for(var i=0;i<4-message.length;i++){
        zeros+="0";
    }
    return zeros+message;
}
//绑定指令事件
$(".button").bind("click",function(){
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
            }else
                console.log("创建失败,轨道上已有飞船！","red");
            $(this).html("destroy");
            break;
        case "destroy":
            BUS(id,"destroy");
            $(this).html("create");
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
