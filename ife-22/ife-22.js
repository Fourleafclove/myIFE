/**
 * Created by MacBook on 16/4/11.
 */
(function () {
    var animationList = [];
    var $ = function (id) {
        return document.querySelector(id)
    };
    var timer = null;
    var container = $("#container");
    var preOrder = $("#preOrder");
    var inOrder = $("#inOrder");
    var postOrder = $("#postOrder");
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
        addClass: function (node, className) {
            node.className = className;
        },
        removeClass: function (node) {
            node.className = "";
        }
    };
    var TBT = {
        preOrder: function (node) {
            if (node) {
                animationList.push(node);
                if (node.firstElementChild) {
                    arguments.callee(node.firstElementChild);
                }
                if (node.lastElementChild) {
                    arguments.callee(node.lastElementChild);
                }
            }
        },
        inOrder: function (node) {
            if (node) {
                if (node.firstElementChild) {
                    arguments.callee(node.firstElementChild);
                }
                animationList.push(node);
                if (node.lastElementChild) {
                    arguments.callee(node.lastElementChild);
                }
            }
        },
        postOrder: function (node) {
            if (node) {
                if (node.firstElementChild) {
                    arguments.callee(node.firstElementChild);
                }
                if (node.lastElementChild) {
                    arguments.callee(node.lastElementChild);
                }
                animationList.push(node);
            }
        },
        animate: function () {
            var i = 0;
            Operation.addClass(animationList[i], "active");
            timer = setInterval(function () {
                i++;
                if (i < animationList.length) {
                    Operation.removeClass(animationList[i - 1]);
                    Operation.addClass(animationList[i], "active");
                } else {
                    clearInterval(timer);
                    Operation.removeClass(animationList[i - 1])
                }
            }, 500)
        },
        reset: function () {
            var divs = document.getElementsByTagName("div");
            [].forEach.call(divs, function (e) {
                Operation.removeClass(e)
            })
        }
    };
    Operation.regEvent(preOrder, "click", function () {
        animationList = [];
        clearInterval(timer);
        TBT.reset();
        TBT.preOrder(container);
        TBT.animate();
    });
    Operation.regEvent(inOrder, "click", function () {
        animationList = [];
        clearInterval(timer);
        TBT.reset();
        TBT.inOrder(container);
        TBT.animate();
    });
    Operation.regEvent(postOrder, "click", function () {
        animationList = [];
        clearInterval(timer);
        TBT.reset();
        TBT.postOrder(container);
        TBT.animate();
    });

})();