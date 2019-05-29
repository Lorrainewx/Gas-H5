
function getOpenID(callback) {

    // 本地测试时加上此段代码，保存自己的openid到本地
    // var openid = 'oK72cwvuC1JplA7FzXpyNH8HwG4E';
    // localStorage.setItem('openid', openid);
    // if (typeof callback === 'function') callback(openid);
    // return;


    var openid = localStorage.getItem('openid');
    // 检查本地有没有保存openid 数据，如果有直接执行回调
    if (openid) {
        if (typeof callback === 'function') callback(openid);
        return;
    }

    var code = getParam('code');
    var code2 = getQueryString('code');
    console.log('第一种方法获取到的code: ', code);
    console.log('第二种方法获取到的code: ', code2);
    console.log('是否一致: ', code === code2);
    // 检查有没有从url获取到code 如果没有获取code 就前往获取code
    if (!code) {
        if (confirm('前往获取权限!')) {
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0109eb04e15728f9&redirect_uri=https%3a%2f%2fxlbj.wxxinquranqi.online%2fh5%2fequipment-bind.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
        }
        return;
    }

    ajax.request('/alarmWechatBind/alarmWechatBindInfo/selectByOpenId', {
        data: {
            code: code
        },
        type: 'post',
        success: function (res) {
            var openid = res.data.openid;

            if (res.code === '0' && openid) {

                window.localStorage.setItem('openid', openid);
                if (typeof callback === 'function') callback(openid);

            } else {
                if (confirm('获取openid失败，点击确认重新获取')) {
                    getOpenID()
                }
            }
        }
    })
}

function getIsOldUser(){
    return window.localStorage.getItem('user-old');
}

function setIsOldUser(){
    window.localStorage.setItem('user-old', 'true');
}

function getParam(paramName) {
    paramValue = "", isFound = !1;
    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
        arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;
        while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
    }
    return paramValue == "" && (paramValue = null), paramValue
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r) return unescape(r[2]);
    return null;
}

// 获取时间段，从现在到指定天数后
function getTime(day) {

    function fm(n) {
        n = n + '';
        return n[1] ? n : '0' + n;
    }

    var time = new Date();

    var eYear = time.getFullYear();
    var eMonth = fm(time.getMonth() + 1);
    var eDate = fm(time.getDate());

    var Hour = fm(time.getHours());
    var Minutes = fm(time.getMinutes());
    var Seconds = fm(time.getSeconds());

    time = new Date(time.getTime() + 1000 * 60 * 60 * 24 * day);

    var sYear = time.getFullYear();
    var sMonth = fm(time.getMonth() + 1);
    var sDate = fm(time.getDate());

    return {
        end: eYear + '-' + eMonth + '-' + eDate + ' ' + Hour + ':' + Minutes + ':' + Seconds,
        start: sYear + '-' + sMonth + '-' + sDate + ' ' + Hour + ':' + Minutes + ':' + Seconds
    }
}

// 设备详情的图表配置
function chart(target, data) {

    var chartFontSize = 7;
    var x = data.x || [];
    var y = data.y || [];

    echarts.init(target).setOption({
        tooltip: {
            trigger: 'axis',
            formatter: '日期：{b}<br />浓度：<i class="icon icon-dot" status="success"></i>{c}%LEL'
        },
        grid: {
            top: '30px',
            left: '10px',
            right: '40px',
            bottom: '12px',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                name: '日期',
                nameTextStyle: {
                    color: '#333',
                    fontSize: chartFontSize
                },
                // boundaryGap : false,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#333',
                        fontSize: chartFontSize
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                data: x
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '浓度',
                nameTextStyle: {
                    color: '#333',
                    fontSize: chartFontSize
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#333',
                        fontSize: chartFontSize
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    lineStyle: {
                        color: '#eee',
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#eee',
                        width: 1
                    }
                },
            }
        ],
        series: [
            {
                type: 'line',
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    color: '#63d796',
                },
                itemStyle: {
                    normal: {
                        color: '#63d796',
                        borderColor: '#63d796'
                    }
                },
                areaStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0.4, color: '#63d79666' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#fff' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                    }
                },
                data: y
            }
        ]
    });
}