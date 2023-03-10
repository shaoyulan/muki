/**
 * 上傳功能
 */
const Upload = (function() {

    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    // 載入Uppy預設值
    function loadUppyInitial(uppyInstance, dataArr) {
        var psArr = [];

        dataArr.forEach(dataObj => {

            var uppyFileId = uppyInstance.addFile({
                name: 'initial-' + dataObj.id, // file name
                type: '', // file type
                data: '', // file blob
                meta: {
                    src: dataObj.src,
                    // 後端用id
                    id: dataObj.id,
                    // 預設資料flag
                    onServer: true
                },
                source: 'Local', // optional, determines the source of the file, for example, Instagram.
            })

            const fileFromUppy = uppyInstance.getFile(uppyFileId);

            uppyInstance.setFileState(uppyFileId, {
                progress: {
                    uploadComplete: true,
                    uploadStarted: true
                }
            })

            uppyInstance.emit('upload-success', fileFromUppy, 'success');
        })

        uppyInstance.setOptions({
            autoProceed: true
        })
    }

    // 自行實作ajax上傳
    function customXHRupload(uppyInstance, ajaxUrl, file) {


        toBase64(file).then(function(base64) {


            $.ajax({
                type: "POST",
                data: {
                    base64data: base64
                },
                url: ajaxUrl,
                success: function(response) {

                    // 前端程式
                    var uppyFileId = uppyInstance.addFile({
                        name: file.name, // file name
                        type: file.type, // file type
                        data: file, // file blob
                        meta: {
                            // 預設資料flag
                            onServer: false
                        },
                        source: 'Local', // optional, determines the source of the file, for example, Instagram.
                    })

                    const fileFromUppy = uppyInstance.getFile(uppyFileId);

                    uppyInstance.setFileState(uppyFileId, {
                        progress: {
                            uploadComplete: true,
                            uploadStarted: true
                        }
                    })

                    uppyInstance.emit('upload-success', fileFromUppy, response);
                }
            });
        })


    }

    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    /**
     * @param fileInput input元素
     * @param {Object} setting - 設定
     * @property {Object} setting.uppyConfig - uppy套件設定
     * @property {Array} setting.defaultValues - 預設值陣列
     * @property {Array} setting.ajaxUrl - 預設值陣列
     * @property {Function} setting.onUploadSuccess - 上傳成功回呼
     * @property {Function} setting.onRestrictionErr - 上傳不符合限制回呼
     * @property {Function} setting.onUpload - 上傳開始回呼
     * @property {Function} setting.onComplete - 執行完成回呼
     */
    function init(areaEl, setting) {
        const $areaEl = $(areaEl)
        const fileInput = $(setting.fileInput)[0]

        // 預設值
        const defaultValues = setting.defaultValues || [];
        const defaultConfig = {
            locale: Uppy.locales.zh_TW,
            debug: false,
            autoProceed: false,
            // 限制
            restrictions: {}
        }
        const config = $.extend(true, {}, defaultConfig, setting.uppyConfig || {});
        const uppy = new Uppy.Uppy(config)

        if (config.restrictions.allowedFileTypes) {
            fileInput.accept = config.restrictions.allowedFileTypes.join(',')
        }

        uppy.use(Uppy.XHRUpload, {
            // Ajax 上傳路徑
            endpoint: setting.ajaxUrl,
            formData: true,
            fieldName: 'files[]',
        })

        // 上傳成功
        uppy.on('upload-success', (file, response) => {

            const isDefaultFile = file.meta.onServer

            // 前端程式
            const uppyId = file.id; // 這是套件內部給的ID

            // 自訂參數塞meta
            file.meta.randomId = uuidv4();

            if ('function' == typeof setting.onUploadSuccess) {
                setting.onUploadSuccess(file, response)
            }
        })

        // 前端程式
        uppy.use(Uppy.ProgressBar, {
            target: 'body',
            fixed: true,
            hideAfterFinish: true,
        })

        uppy.on('upload', (data) => {
            if ('function' == typeof setting.onUpload) {
                setting.onUpload(data)
            }
        })

        uppy.on('file-added', () => {
            console.log('added')
        })

        // it’s probably a good idea to clear the `<input>`
        // after the upload or when the file was removed
        // (see https://github.com/transloadit/uppy/issues/2640#issuecomment-731034781)
        uppy.on('file-removed', () => {
            fileInput.value = null
        })

        uppy.on('complete', (result) => {
            fileInput.value = null

            if ('function' == typeof setting.onComplete) {
                setting.onComplete(result)
            }
        })

        uppy.on('restriction-failed', (file, error) => {
            // do some customized logic like showing system notice to users
            if ('function' == typeof setting.onRestrictionErr) {
                setting.onRestrictionErr(error)
            } else {
                console.error('err', error)
            }
        })

        fileInput.addEventListener('change', (event) => {
            const files = Array.from(event.target.files)
            files.forEach((file) => {
                try {
                    customXHRupload(uppy, setting.ajaxUrl, file)
                } catch (err) {
                    if (err.isRestriction) {
                        // handle restrictions
                        if ('function' == typeof setting.onRestrictionErr) {
                            setting.onRestrictionErr(err)
                        } else {
                            console.error('err', err)
                        }
                    } else {
                        // handle other errors
                        console.error('err', err)
                    }
                }
            })
        })


        loadUppyInitial(uppy, defaultValues);

        return {
            uppy,
        }
    }

    return {
        init
    }

})();

/**
 * 使用
 */
const uploader = Upload.init('.img-uploader', {
    fileInput: '.img-uploader input',
    ajaxUrl: "{{ route('ajax.uploadBase64') }}",
    // 預設值
    defaultValues: defaultValues,
    // 套件設定
    uppyConfig: {
        restrictions: {
            maxFileSize: 1024 * 1024 * 2,
        }
    },
    onUpload(data) {
        // store.state.appGlobalSpinnerShow = true;
    },
    onUploadSuccess(file, response) {

        // 上傳成功
        var isOnserver = file.meta.onServer; // 是否是預設值

        var url = isOnserver ? file.meta.src : URL.createObjectURL(file.data);
        var uppyId = file.uppyId; // 套件內部id
        var randomId = file.meta.randomId; // js自行產生的id
        var pic_url = isOnserver ? url : JSON.parse(response);

        // 新增至畫面...
    },
    onRestrictionErr(err) {
        new swal({
            type: 'warning',
            text: err,
            confirmButtonText: '確定',
        })
    },
    onComplete(data) {
        // store.state.appGlobalSpinnerShow = false;
    },
})
