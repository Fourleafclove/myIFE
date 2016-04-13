/**
 * Created by MacBook on 16/4/13.
 */
(function () {

    var Hint = {
        tip: {
            name: "必填,6~10",
            passwd: "",
            passwd_cf: "",
            email: "",
            phone: ""
        },
        alert: {
            name: "",
            passwd: "",
            passwd_cf: "",
            email: "",
            phone: ""
        },
        success: {
            name: "",
            passwd: "",
            passwd_cf: "",
            email: "",
            phone: ""
        }
    };
    var Operation={
        regEvent: function (node, event, func) {
            if (node.addEventListener) {
                node.addEventListener(event, func);
            } else if (node.attachEvent) {
                node.attachEvent("on" + event, func);
            } else {
                node["on" + event] = func;
            }
        },
        insertAfter: function (node) {
            
        }
        ,
        addHint: function (name, type) {
            var hint = document.createElement("p");
            hint.innerText=Hint.type.id;
            hint.addClass("name");

            var input=document.getElementById("name");

            
        },
        removeHint:function(name){

        }

    }

})();