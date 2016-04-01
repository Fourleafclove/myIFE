/**
 * Created by MacBook on 16/3/30.
 */
/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var city = document.getElementById("aqi-city-input").value;
    var value = document.getElementById("aqi-value-input").value;

    city = city.replace(/\s/g, "");
    value = value.replace(/\s/g, "");

    var cityRE = /^[\u4e00-\u9fa5]{2,}$/;
    var valueRE = /^[1-9][0-9]*$/;

    var cityTag = cityRE.test(city);
    var valueTag = valueRE.test(value);
    if (!cityTag) {
        alert("请输入正确城市名称!");
    }
    if (!valueTag) {
        alert("请输入正确的空气质量!")
    }
    if (cityTag && valueTag) {
        aqiData[city] = value;
    }

}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var $table = document.getElementById("aqi-table");
    $table.innerHTML = "<td>城市</td><td>空气质量</td><td>操作</td>";
    for (var property in aqiData) {
        var city = property;
        var value = aqiData[property];
        var teg = document.createElement("tr");
        teg.innerHTML = "<td>" + city + "</td><td>" + value + "</td><td><button class='d-btn'>删除</button></td>"
        $table.appendChild(teg);
    }
    var btn = document.getElementsByClassName("d-btn");
    for (var i = 0; i < btn.length; i++) {
        btn[i].onclick=delBtnHandle;
    }

}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {


    var delCity =this.parentNode.parentNode.firstChild.textContent;
   delete aqiData[delCity];
    renderAqiList();
}

function init() {

    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数

    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    document.getElementById("add-btn").onclick = addBtnHandle;


}

init();
