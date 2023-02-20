import { createStore } from 'vuex';
// 声明接口
export interface State {
    count: number
}
// 创建store实例
const store = createStore({
    state () {
        return {
            count: 0
        };
    },
    mutations: {
        // 更改count
        changeAddoneCount(state:State) {
            state.count++;
        },
        changeTenCount(state:State,valueNum) {
            state.count=valueNum;
        },
    }
});
export default store;