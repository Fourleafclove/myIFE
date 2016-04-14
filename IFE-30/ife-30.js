/**
 * Created by MacBook on 16/4/13.
 */
window.onload = function () {
    var flag = true;
    var arr_name = ["name", "passwd", "passwd_cf", "email", "phone"];
    /*存放提示内容*/
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
        /*绑定事件*/
        regEvent: function (node, event, func) {
            if (node.addEventListener) {
                node.addEventListener(event, func);
            } else if (node.attachEvent) {
                node.attachEvent("on" + event, func);
            } else {
                node["on" + event] = func;
            }
        },
        /*添加提示*/
        addHint: function (name, type) {
            var p = document.getElementById(name).parentNode;
            if (p) p.removeChild(p.lastChild);

            var hint = document.createElement("p");
            hint.className = "hint";
            var input = document.getElementById(name);
            hint.innerText = Hint[type][name];
            input.parentNode.appendChild(hint);
        },
        /*改变边框样式*/
        changeClass: function (name, type) {
            var input = document.getElementById(name);
            input.className = type;
        },
        /*校验数据格式*/
        check: function (name) {
            var value = document.getElementById(name).value.toString();
            var reg = null;
            switch (name) {
                case "passwd_cf":
                    var passwd = document.getElementById("passwd").value.toString();

                    if (value == "") {
                        Operation.addHint(name, "empty");
                        Operation.changeClass(name, "input-error");
                    } else if (passwd == value) {
                        Operation.addHint(name, "success");
                        Operation.changeClass(name, "input-success");
                    } else {
                        Operation.addHint(name, "alert");
                        Operation.changeClass(name, "input-error");
                    }

                    break;
                case "name":
                    reg = /^[a-z0-9_-]{3,16}$/;
                    break;
                case "passwd":
                    reg = /^[a-z0-9_-]{6,12}$/;
                    break;
                case "email":
                    reg = /^([\w.-]+)@([\w.-]+).[a-z]{2,6}$/;
                    break;
                case "phone":
                    reg = /^1[\d]{10}$/;
                    break;
            }
            if (reg !== null) {

                if (value == "") {
                    Operation.addHint(name, "empty");
                    Operation.changeClass(name, "input-error");
                }
                else if (reg.test(value)) {
                    Operation.addHint(name, "success");
                    Operation.changeClass(name, "input-success");
                } else {
                    Operation.addHint(name, "alert");
                    Operation.changeClass(name, "input-error");
                }
            }
        }
    };
    /*事件函数*/
    function inputFn(type, name) {
        if (type == "addTip") {
            return function () {
                Operation.addHint(name, "tip")
            }
        } else if (type == "check") {
            return function () {
                Operation.check(name)
            }
        }
    }

    /*绑定事件*/
    for (var i = 0; i < arr_name.length; i++) {
        var name = arr_name[i].toString();
        var node = document.getElementById(name);

        Operation.regEvent(node, "focus", inputFn("addTip", name));
        Operation.regEvent(node, "blur", inputFn("check", name));
    }

    document.getElementById("submit").onclick = function () {
        flag = true;
        var inputs = document.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].className !== "input-success")
                flag = false;
        }

        if (flag == true) {
            alert("提交成功!");
        } else {
            alert("请检查提交内容!")
        }
    }
}
;