/**
 * Created by MacBook on 16/4/8.
 */
/**
 * 存储数字*/
var dataArr = [];
/**
 * 渲染*/
$ = function(e){
    return document.querySelector(e);
}
function render() {
    var wrap = $("#wrap");
    var html = '';
    for (var i = 0; i < dataArr.length; i++) {
        html += '<div class="box">' + dataArr[i] + '</div>';
    }
    wrap.innerHTML = html;
    var boxs = document.getElementsByClassName("box");
    for (var j = 0; j < boxs.length; j++) {
        boxs[j].onclick = delet;
    }

}
/*
function leftIn() {
    var value = document.getElementById("input").value;
    dataArr.unshift(value);
    render();
}
function leftOut() {
    dataArr.shift();
    render();
}
function rightIn() {
    var value = document.getElementById("input").value;
    dataArr.push(value);
    render();
}
function rightOut() {
    dataArr.pop();
    render();
}
*/

/**
 * 删除数组指定元素*/
Array.prototype.del = function (n) {
    if (n < 0) {
        return this;
    } else {
        return this.slice(0, n).concat(this.slice(n + 1, this.length));
    }
};
/**
 * 获得子元素在父元素中的索引*/
function getIndex(ele) {
    var children = ele.parentNode.childNodes;
    for (var i = 0; i < children.length; i++) {
        if (children[i] == ele)
            return i;
    }
}
/**
 * 根据获得的索引删除元素*/
function delet() {
    var index = getIndex(this);
    dataArr=dataArr.del(index);
    render();
}
function init() {
 /*   document.getElementById("left-in").onclick = leftIn;
    document.getElementById("left-out").onclick = leftOut;
    document.getElementById("right-in").onclick = rightIn;
    document.getElementById("right-out").onclick = rightOut;*/
    render();
}
init();