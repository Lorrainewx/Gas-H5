// 请求方法
(function(global){

    // 后端接口地址
    var cors = 'https://xlbj.wxxinquranqi.online/clientServer';

    var $ = global.jQuery;

    function AJAX (){
        // 请求个数，个数为0时，关闭加载提示
        this.reqcount = 0;
        // 分页参数
        this.pageNumber = 0;
        this.pageSize = 10;
        // 搜索参数
        this.params = {};
        // 列表是否加载完毕
        this.loadOver = false;
    }
    AJAX.prototype.showLoading = function (){
        if(!!$('#loading').length){
            $('#loading').removeAttr('hidden');
        } else {
            $('#root').append('<div id="loading" class="loading"><div><i></i><i></i><i></i></div></div>');
        }
    };
    AJAX.prototype.hideLoading = function (){
        $('#loading').attr('hidden', 'hidden');
    };
    AJAX.prototype.check = function(requestBody){
        requestBody = requestBody || {};
        requestBody.title = requestBody.title || '';
        requestBody.data = requestBody.data || {};
        return requestBody;
    }
    AJAX.prototype.search = function(params){
        this.reset();
        for(var key in params){
            this.params[key] = params[key];
        }
    }
    AJAX.prototype.reset = function(){
        this.pageNumber = 0;
        this.params = {};
        this.loadOver = false;
    }
    AJAX.prototype.next = function(url, requestBody){
        if(this.loadOver) return;
        requestBody = this.check(requestBody);
        this.pageNumber++;

        requestBody.data['pageNumber'] = this.pageNumber;
        requestBody.data['pageSize'] = this.pageSize;

        for(var key in this.params) {
            requestBody.data[key] = this.params[key];
        }

        this.request(url, requestBody, true);
    }
    AJAX.prototype.request = function (url, requestBody, noCheck) {
        if(!noCheck) requestBody = this.check(requestBody);
        var self = this;

        var defaultRequest = {
            success: console.log,
            error: function(e){
                console.error(e);
                alert(requestBody.title + '请求失败，点击确认刷新重试~');
            }
        };
    
        defaultRequest = $.extend(defaultRequest, requestBody);
        
        defaultRequest.beforeSend = function(){
            self.reqcount += 1;
            self.showLoading();
            if(typeof requestBody.beforeSend === 'function') requestBody.beforeSend();
        }
        defaultRequest.complete = function(){
            self.reqcount -= 1;
            if(self.reqcount === 0){
                setTimeout(self.hideLoading, 500);
            }
            if(typeof requestBody.complete === 'function') requestBody.complete();
        }
    
        $.ajax(
            /^http/.test(url) ? url : cors + url,
            defaultRequest
        );
    }

    global.ajax = new AJAX();

})(this);