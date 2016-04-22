
//存放飞船对象的数组
var shipList = [];
//重写console.log
window.console.log = function (str, color) {
    $("#console").append('<p style="color: ' + color + ';">' + str + '</p>');
};
//飞船工厂
function spaceShipFactory(track) {
    var spaceShip = {
        id: track,
        energy: 100,
        isStop: true,
        destroy: false,
        deg: 0,
        energyTimeout: null,
        rotateTimeout: null,
        //发射飞船
        sendShip: function () {
            this.energySystem();
            this.rotateSystem();
            $("#track" + track).append("<div class='ship' id='ship" + track + "'><div class='energy'>" + this.nameSystem() + "</div></div>")
        },
        nameSystem: function () {
            return "<span>" + this.id + "号-" + this.energy + "%</span>";
        },
        powerSystem: function (command) {
            if (command == "stop") {
                this.isStop = true;
            } else if (command == "fly") {
                this.isStop = false;
            }
        },
        energySystem: function () {
            this.energy += 2;
            if (this.energy >= 100)
                this.energy = 100;
            if (!this.isStop) {
                this.energy -= 5;
            }
            if (this.energy <= 0) {
                console.log(this.id + "号飞船耗尽燃料，停止飞行！", "red");
                this.energy = 0;
                this.isStop = true;
            }
            $("#ship" + this.id + " .energy").css({width: "" + this.energy + "px"}).html(this.nameSystem());
            this.energyTimeout = setTimeout(this.energySystem.bind(this), 1000);
        },
        rotateSystem: function () {
            if (!this.isStop) {
                this.deg += 2;
                $("#track" + this.id).css({transform: "rotate(" + this.deg + "deg)"});
            }
            this.rotateTimeout = setTimeout(this.rotateSystem.bind(this), 100);
        },
        messageSystem: function (obj) {
            if (obj.id == this.id) {
                this.powerSystem(obj.command);
            } else {
                return;
            }
        },
        selfDestroy: function (command) {
            if (!this.destroy && command == "destroy") {
                this.destroy = true;
                $("#track" + this.id).css({transform: "rotate(0deg)"});
                clearTimeout(this.energyTimeout);
                clearTimeout(this.rotateTimeout);
                shipList = shipList.filter(function (v) {
                    if (v.id == this.id) {
                        v = null;
                    } else
                        return true;
                });
                $("#ship" + this.id).remove();
            }
            ;
        }
    };
    return spaceShip;
};
//信息发送台
function mediator(id, content) {
    var message = {
        id: id,
        command: content
    };
    if (Math.random() <= 0.3) {
        console.log("信息丢包，发送失败！", "red");
    } else {
        setTimeout(function () {
            shipList.forEach(function (v) {
                v.messageSystem(message);
            });
        }, 1000);
    }
     //console.log(JSON.stringify(shipList))
};
//绑定指令事件
$(".button").bind("click", function () {
    var id = $(this).data("target");
    var content = $(this).html();
    switch (content) {
        case "create":
            if (!$("#ship" + id).html()) {
                var ship = spaceShipFactory(id);
                shipList.push(ship);
                ship.sendShip();
                console.log("飞船发射成功", "green");
            } else
                console.log("创建失败,轨道上已有飞船！", "red");
            $(this).html("destroy");
            break;
        case "destroy":
            mediator(id, "destroy");
            $(this).html("create");
            break;
        case "fly":
            mediator(id, "fly");
            $(this).html("stop");
            break;
        case "stop":
            mediator(id, "stop");
            $(this).html("fly");
            break;
    }
});
