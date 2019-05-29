(function (global) {

    var document = global.document;

    function ImagePicker(options) {
        options = options || {};
        if (!options.target) throw new Error("target is not a HTMLElement! ");

        this.target = options.target;
        this.url = options.url;
        this.maxLength = Number(options.maxLength) || 9;
        this.onChange = options.onChange;
        this.onUploaded = options.onUploaded;
        this.images = [];

        this.init();
    }

    ImagePicker.prototype = {
        // 初始化，插入dom
        init: function () {
            var imagepicker = this.imagepicker = document.createElement('div');
            imagepicker.classList.add('imagepicker-image-list');

            var picker = this.picker = document.createElement('div');
            picker.classList.add('imagepicker-image-item', 'imagepicker-image-picker');

            var pickerInput = this.pickerInput = document.createElement('input');
            pickerInput.type = 'file';
            pickerInput.accept = 'image/*';
            pickerInput.capture = 'camera';
            pickerInput.addEventListener('change', this.collectImage.bind(this), false);

            picker.appendChild(this.pickerInput);
            imagepicker.appendChild(this.picker);
            if (typeof this.target === 'object') {
                if (typeof this.target.appendChild === 'function') {
                    this.target.appendChild(this.imagepicker);
                } else if (typeof this.target.append === 'function') {
                    this.target.append(this.imagepicker);
                }
            }
        },
        // 检测选择的图片数是否到上限
        maxLengthListener: function () {
            if (this.images.length === this.maxLength) {
                this.picker.setAttribute('hidden', 'hidden');
            } else if (this.images.length < this.maxLength) {
                this.picker.removeAttribute('hidden');
            }
        },
        handleOnChange: function () {
            if (typeof this.onChange === 'function') {
                this.onChange(this.images);
            }
        },
        // 收集选择的图片
        collectImage: function (e) {
            var _this = this;
            var src = e.target.files[0];
            if (src instanceof File) {
                this.images.push(src);

                this.maxLengthListener();
                this.handleOnChange();

                var reader = new FileReader();
                reader.readAsDataURL(src);
                reader.onload = function () {
                    _this.imagepicker.insertBefore(_this.createImageView(this.result), _this.picker);
                }
            }
        },
        // 创建一个图片缩略图预览
        createImageView: function (src) {
            var _this = this;
            var img = document.createElement('img');
            img.src = src;
            var div = document.createElement('div');
            div.classList.add('imagepicker-image-item');
            div.appendChild(img);
            div.addEventListener('click', function (e) {
                var index = [].indexOf.call(_this.imagepicker.children, e.target.parentElement);
                _this.deleteImage(index);
            }, false);
            return div;
        },
        // 删除选择的图片
        deleteImage: function (index) {
            if (confirm('确认要删除此图片吗？')) {
                this.imagepicker.children[index].remove();
                this.images.splice(index, 1);

                this.maxLengthListener();
                this.handleOnChange();
            }
        },
        // 上传已选择的图片
        upload: function (onUploaded) {
            var formData = new FormData();

            // 当前仅上传第一张，应该遍历保存 的图片列表，然后依次上传，再把上传成功的结果以数组的形式传递出去
            formData.append(this.images[0]);

            var xhr = null;
            if (XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }

            xhr.open("post", this.url, true); //设置提交方式，url，异步提交
            xhr.onload = function () {
                var data = xhr.responseText;
                if (onUploaded) this.onUploaded = onUploaded;
                if (typeof this.onUploaded === 'function') {
                    this.onUploaded(data);
                }
            }
            xhr.send(formData);
        },
    }

    global.ImagePicker = ImagePicker;

})(this);