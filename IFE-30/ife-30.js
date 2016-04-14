/**
 * Created by MacBook on 16/4/13.
 */
window.onload = function () {
    var flag = false;
    var Hint = {
        tip: {
            name: "必填,3~16位字符",
            passwd: "必填,6~12位数字或字母",
            passwd_cf: "再次输入密码",
            email: "必填,格式为example@123.com",
            phone: "必填,11位数字"
        },
        empty: {
            name: "名称不能为空!",
            passwd: "密码不能为空!",
            passwd_cf: "请再次输入密码!",
            email: "邮箱不能为空!",
            phone: "手机号码不能为空!"
        },
        alert: {
            name: "请输入正确格式名称",
            passwd: "请输入正确格式密码",
            passwd_cf: "两次输入密码不同",
            email: "邮箱格式错误",
            phone: "请输入正确格式手机号"
        },
        success: {
            name: "名称可用",
            passwd: "密码可用",
            passwd_cf: "输入正确",
            email: "邮箱可用",
            phone: "手机号码可用"
        }
    };

    var Operation = {

        regEvent: function (node, event, func) {
            if (node.addEventListener) {
                node.addEventListener(event, func);
            } else if (node.attachEvent) {
                node.attachEvent("on" + event, func);
            } else {
                node["on" + event] = func;
            }
        },

        removeHint: function (name) {
            var p = document.getElementById(name).parentNode;
            if(p) p.removeChild(p.lastChild);
        },
        addHint: function (name, type) {
            Operation.removeHint(name);
            var hint = document.createElement("p");
            hint.className="hint";
            var input = document.getElementById(name);
            hint.innerText = Hint[type][name];
            input.parentNode.appendChild(hint);
        },


        check: function (name) {
            var value = document.getElementById(name).value.toString();
            switch (name){
                case "name":
                    var reg = /^[a-z0-9_-]{3,16}$/;
                    if (reg.test(value)){
                        Operation.addHint(name,"success")
                    }else {
                        Operation.addHint(name,"alert")
                    }
                    break;
                case "passwd":
                case "passwd_cf":
                case "email":
                case "phone":


            }
        }
    };
var name = document.getElementById("name");
    var nameFn = function () {
        Operation.addHint("name","tip")
    }
Operation.regEvent(name,"focus",nameFn);

};