<template>
    <div 
        ref="refRoot"
        class="no-data-box" 
        :style="{color: textColor? textColor : ''}"
        v-show="cData.show"
    >
        <slot>
            <template v-if="!variant">
                <div class="no-data-icon" v-if="media">
                    <div class="inner-wrap">
                        <img  src="@/assets/images/icon/no-data-icon.svg" alt="" srcset="">
                    </div>
                </div>
                <div class="no-data-title">
                    {{title}}
                </div>
            </template>
            <template v-else-if="variant == 'mj-group'">
                <img src="@/assets/images/general/mj-group.svg" alt="" srcset="">
            </template>
        </slot>
	</div>
</template>

<script setup >
import { ref, reactive, onMounted, nextTick, watchEffect } from "vue";

    const props = defineProps({
        title: {
            default:'No Data'
        },
        text:{
            default:'目前沒有資料'
        },
        textColor:{
            default:'',
        },
        media:{
            type: Boolean,
            default: true,
        },
        variant: String, // mj-group
        // style
        absCenter: Boolean,
        // 要watch的資料
        watch: Boolean,
        watchData: Array,
    })

    const refRoot = ref(null);

    const cData = reactive({
        show: true
    });

    // 自動watch資料
    if ( props.watch ) {
        watchEffect(()=>{
            if ( Array.isArray(props.watchData) && props.watchData.length ) {
                cData.show = false;
            } else {
                cData.show = true;
            }
        })
    }

    onMounted(()=>{
        if ( props.absCenter ) {

            var refRootParent = refRoot.value.parentElement

            if ( !refRootParent.style.position ) {
                refRootParent.style.position = 'relative'
            }

            refRoot.value.style.position = 'absolute'
            refRoot.value.style.top = '50%';
            refRoot.value.style.left = '50%';
            refRoot.value.style.transform = 'translate(-50%, -50%)';
        }
    })

</script>

<style lang="scss">
@import '@design';

// no-data-box
.no-data-box{
    @include flex(center,center);
    flex-direction: column;
    padding:10px;
    border-radius: 10px;
    color: #8b8b8b;
    .no-data-icon{
        position:relative;
        background: currentColor;
        @include flex(center,center);
        background:none;
        width: 100px;
        max-width: calc(100% - 30px);
        border-radius: 50%;
        margin-left: auto;
        margin-right: auto;
        margin-top: 25px;
        margin-bottom: 15px;
        &:before{
            content:'';
            background: linear-gradient(180deg, #8b8b8b, rgba(#8b8b8b, 0.2));
            width: 100%;
            padding-top: 100%;
            z-index: -1;
            opacity: .2;
            border-radius: 50%;
        }
        .inner-wrap{
            @include absolute(0,0,0,0);
            @include flex(center,center);
            width: 100%;
            height: 100%;
            background: linear-gradient(180deg, #8b8b8b, rgba(#8b8b8b, 0.2));
            margin:auto;
            border-radius: 50%;
        }
        img{
            max-width: 47.53%;
        }
    }
    .no-data-title{
        font-size: 16px;
        font-weight: bold;
        color:currentColor;
        text-align: center;
        margin-bottom: 5px;
        text-transform: uppercase;
    }
    .no-data-des{
        font-size: 16px;
        color:currentColor;
        text-align: center;
    }

    @include media(374.98){
        &:not(.size-sm) {
            .no-data-icon{
                max-width: 140px;
            }
        }
    }

}
</style>
