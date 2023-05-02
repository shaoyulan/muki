<template>
    <div class="pagination">
        <ul>
            <li
                :class="{ disabled: selectedPageNum == 1 }"
                @click="handlePageChange(1)"
            >
                <a href="javascript:;">
                    <img src="@/assets/pagination/left.svg" alt="" />
                </a>
            </li>
            <li
                :class="{ disabled: selectedPageNum == 1 }"
                @click="handlePageChange(selectedPageNum - 1)"
            >
                <a href="javascript:;">
                    <img src="@/assets/pagination/pre.svg" alt="" />
                </a>
            </li>
            <template v-for="(pageNum, index) in totalPage" :key="index">
                <li
                    class="num"
                    :class="{ active: selectedPageNum == pageNum }"
                    @click="handlePageChange(pageNum)"
                    v-show="endNum - pageNum < perPage && endNum - pageNum >= 0"
                >
                    <a href="javascript:;"> {{ pageNum }} </a>
                </li>
            </template>
            <li
                :class="{ disabled: selectedPageNum == totalPage }"
                @click="handlePageChange(selectedPageNum + 1)"
            >
                <a href="javascript:;">
                    <img src="@/assets/pagination/next.svg" alt="" />
                </a>
            </li>
            <li
                :class="{ disabled: selectedPageNum == totalPage }"
                @click="handlePageChange(totalPage)"
            >
                <a href="javascript:;">
                    <img src="@/assets/pagination/right.svg" alt="" />
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { ref, reactive, computed, watch } from "vue";
export default {
    name: "BasePagination",
    emits: ["pageChange"],
    props: {
        pageInfo: {
            type: Object,
            required: true,
        },
    },
    setup(props, { emit }) {
        const totalPage = computed(() => props.pageInfo.totalPage);
        const perPage = computed(() => props.pageInfo.perPage);
        const MID_NUM = Math.round(perPage / 2);
        const BALANCE_NUM = MID_NUM - 1;
        let selectedPageNum = ref(1);
        let endNum = computed(() => {
            if (totalPage.value <= perPage.value) {
                return totalPage.value;
            }

            if (selectedPageNum.value <= MID_NUM) {
                return perPage.value;
            }else {
                let num = selectedPageNum.value + BALANCE_NUM;

                if(num > totalPage.value) {
                    return totalPage.value;
                }

                return selectedPageNum.value + BALANCE_NUM;
            }
        });

        const handlePageChange = (num) => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
            selectedPageNum.value = num;

            emit("pageChange", num);
        };

        return {
            handlePageChange,
            totalPage,
            selectedPageNum,
            endNum,
            perPage,
        };
    },
};
</script>

<style lang="scss" scoped>
@import "~@/css/mixins";

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 0;

    ul {
        display: flex;
        justify-content: center;
        align-items: center;

        li {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            @include size(36px);
            box-sizing: border-box;

            &:not(.num) {
                width: 26px;

                &:nth-child(2) {
                    margin-right: 5px;
                }

                &:nth-last-child(2) {
                    margin-left: 5px;
                }
            }

            a {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #000;
                font: normal normal bold 13px/17px Microsoft JhengHei;
            }
        }

        .num {
            border-radius: 9px;
            margin: 0 2px;
        }

        .active {
            background: #707070 0% 0% no-repeat padding-box;
            box-shadow: 0px 3px 6px #00000029;
            color: #fff;
            a {
                color: #fff;
            }
        }

        .disabled {
            opacity: 0.5;
            pointer-events: none;
        }
    }
}
</style>

