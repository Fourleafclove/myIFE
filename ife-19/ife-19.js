/**
 * Created by MacBook on 16/4/8.
 */
/**
 * 存储数字*/
var dataArr = [];
/**
 * 随机数据*/
function randomData(){
    dataArr = [];
    for(var i = 0;i<30;i++){
    dataArr.push(Math.random()*90+10);
    }
    render();
}
/**
 * 渲染*/
function render() {
    var wrap = document.getElementById("wrap");
    var html = '';
    for (var i = 0; i < dataArr.length; i++) {
        html += '<div class="box" style="height:' + dataArr[i] * 5 + 'px; "></div>';
    }
    wrap.innerHTML = html;
    var boxs = document.getElementsByClassName("box");
    for (var j = 0; j < boxs.length; j++) {
        boxs[j].onclick = delet;
    }

}
/**
 * 入队
 * */
function leftIn() {
    var value = document.getElementById("input").value;
    var valStr = value.toString();
    if (dataArr.length >= 60) {
        alert("数量达到上限!")
    } else if (!(/(^[1-9][0-9]$)|(^100$)/.test(valStr))) {
        alert("请输入10~100的整数!");
    } else {
        dataArr.unshift(value);
        render();

    }
}

function rightIn() {
    var value = document.getElementById("input").value;
    var valStr = value.toString();
    if (dataArr.length >= 60) {
        alert("数量达到上限!")
    } else if (!(/(^[1-9][0-9]$)|(^100$)/.test(valStr))) {
        alert("请输入10~100的整数!");
    } else {
        dataArr.push(value);
        render();
    }
}
/**
 * 出队*/
function leftOut() {
    dataArr.shift();
    render();
}
function rightOut() {
    dataArr.pop();
    render();
}

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
    dataArr = dataArr.del(index);
    render();
}
/**
 * 冒泡排序*/
function bubbleSort() {
    var len = dataArr.length,
        i = 0, j = 0, temp, clear = null;
    clear = setInterval(run, 20);

    function run() {
        if(i < len ){
            if(j < len - i -1) {
                if(dataArr[j] > dataArr[j+1]) {
                    temp = dataArr[j];
                    dataArr[j] = dataArr[j+1];
                    dataArr[j+1] = temp;
                   render();
                }
                j++;
                return;
            } else {
                j = 0;
            }
            i++;
        } else {
            clearInterval(clear);
        }

    }
}

function addEvent() {

    document.getElementById("left-in").onclick = leftIn;
    document.getElementById("left-out").onclick = leftOut;
    document.getElementById("right-in").onclick = rightIn;
    document.getElementById("right-out").onclick = rightOut;
    document.getElementById("btn-sort").onclick = bubbleSort;
    document.getElementById("random").onclick = randomData;
}
function init() {
    addEvent();
    render();
}
init();