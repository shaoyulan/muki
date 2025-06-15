<template>
    <div class="text-editor-block" ref="refRoot">
        <slot />
    </div>
</template>

<script setup >
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';

    const props = defineProps({
        // 照片檢視
        imageViewer: {
            type: Boolean,
            default: true
        }
    })

    var refRoot = ref(null)

    // 檢查外部連結
    function checkExternalLink(){

        $(refRoot.value).find('[href]').each(function(idx, link){
            var url = $(link).attr('href');
            // 開啟瀏覽器
            $(link).attr('href', 'javascript:;').addClass('external').click(function(){
                _open_window(url)
            });
        })
    }

    // 照片檢視
    function enableImageViewer(){

        if ( enableImageViewer.gallery ) {
            enableImageViewer.gallery.destroy();
        }

        const gallery = new Viewer(refRoot.value, {
            zIndex: 5000,
            navbar: false,
            toolbar: false,
            transition: false
        });

        enableImageViewer.gallery = gallery
    }

    onMounted(()=>{

        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        var observer = new MutationObserver(function(mutations, observer) {
            checkExternalLink()
            enableImageViewer()
        });

        // define what element should be observed by the observer
        // and what types of mutations trigger the callback
        // 不需要另外處理memory leak，本元件銷毀後observer會自動被GC
        // @see https://stackoverflow.com/a/50821419/20237601
        observer.observe(refRoot.value, {
            childList: true,
        });

        checkExternalLink()

        if ( props.imageViewer ) {
            enableImageViewer();
        }

    })

</script>

<style lang="scss">
@import "~@design";

.text-editor-block{

}

</style>
