/**
 * Created by MacBook on 16/4/12.
 */
var shipList = [];
var powerList = [[5, 5, "开拓者"], [9, 7, "探索者"], [4, 8, "征服者"]];
var commandList = [[2, "光能"], [3, "电能"], [4, "核能"]];

window.console.log = function (str, color) {
    $("#console").append('<p style="color:' + color + ';">' + str + '</p>');
};


function spaceShipFactory(track, powerType, energyType) {
    var spaceShip = {
        id: track,
        energy: 100,
        isStop: true,
        destory: false,
        deg: 0,
        energyTimeout: null,
        rotateTimeout: null,
        deliverInterval: null,
        degPlus: powerList[powerType][0],
        energyCost: powerList[powerType][1],
        energyPlus: commandList[energyType][0],

        sendShip: function () {
            this.energySystem();
            this.rotateSystem();
            this.deliverInterval = setInterval(this.deliverSystem.bind(this), 1000);
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
            this.energy += this.energyPlus;
            if (this.energy >= 100) {
                this.energy = 100;
            }
            if (!this.isStop) {
                this.energy -= this.energyCost;
            }
            if (this.energy <= 0) {
                console.log(this.id + "号飞船燃料耗尽,停止飞行!", "red");
                this.energy = 0;
                this.isStop = true;
            }
            $("#ship" + this.id + " .energy").css({width: this.energy + "px"}).html(this.nameSystem());
            this.energyTimeout = setTimeout(this.energySystem.bind(this), 1000);
        },

        rotateSystem: function () {
            if (!this.isStop) {
                this.deg += this.degPlus;
                $("#track" + this.id).css({transform: "rotate(" + this.deg + "deg)"});
            }
            this.rotateTimeout = setTimeout(this.rotateSystem.bind(this), 100);
        },

        messageSystem: function (str) {
            var id = this.adapter(str.slice(0, 4), 1);
            var command = commandList[this.adapter(str.slice(4), 1)];
            if (id == this.id) {
                switch (command) {
                    case "stop":
                        this.powerSystem(command);
                        break;
                    case "fly":
                        this.powerSystem(command);
                        break;
                    case "destory":
                        this.selfDestory(command);
                        break;
                    default:
                        return;
                }
            } else {
                return;
            }
        },

        deliverSystem: function () {
            var str = "";
            str += this.adapter(this.id,2);
            if(this.destory){
                str+=this.adapter(2,2)
            }else if(this.isStop){
                str+=this.adapter(1,2)
            }else {
                str+=this.adapter(0,2)
            }
            str+=this.adapter(this.energy,3);

            BUS(0,str);
        },

        adapter: function (str, type) {
            return adapter(str,type);
        },

        selfDestory: function (command) {
            if(!this.destory&&command=="destory"){
                this.destory=true;
                $("#track"+this.id).css({transform:"rotate(0deg"});
                clearTimeout(this.energyTimeout);
                clearTimeout(this.rotateTimeout);
                clearInterval(this.deliverInterval);
                this.deliverSystem();
                console.log(this.id+"号飞船已被摧毁","red");
                shipList=spaceShip.filter(function (v) {
                    if(v.id==this.id){
                        v=null;
                    }else return true;
                });
                
            }
        }
    }
}

var adapter = function (str, type) {
    if (type == 1) {
        return parseInt(str, 2).toString();
    }
    else if (type == 2) {
        var message = parseInt(str).toString(2);
        var zeros = "";
        for (var i = 0; i < 4 - message.length; i++) {
            zeros += "0";
        }
        return zeros + message;
    } else if (type == 3) {
        var message = parseInt(str).toString(2);
        var zeros = "";
        for (var i = 0; i < 8 - message.length; i++) {
            zeros += "0";
        }
        return zeros + message;
    }
}