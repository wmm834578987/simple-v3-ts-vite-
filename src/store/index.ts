import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
    state: () => {
        return {
            searchVal: "",
            tagVal: "",
            currentImg: {}
        }
    },
    // actions: {
    // },

})
