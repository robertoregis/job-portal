import { defineStore } from 'pinia';

export interface InterfaceMenu {
    isShowMenu: boolean,
    isMenuPresentation: boolean
}

export const useMenu = defineStore('menu', {
    state: (): InterfaceMenu => ({
        isShowMenu: false,
        isMenuPresentation: false
    }),
    actions: {
        setIsShowMenu(newValue: boolean) {
            this.isShowMenu = newValue
        },
        setIsMenuPresentation(newValue: boolean) {
            this.isMenuPresentation = newValue
        }
    },
    getters: {
        getIsShowMenu(): boolean {
            return this.isShowMenu
        },
        getIsMenuPresentation(): boolean {
            return this.isMenuPresentation
        }
    }
})