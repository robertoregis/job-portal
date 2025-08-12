import { defineStore } from "pinia";

export interface InterfaceShow {
	overlayDashboard: boolean
	overlaySite: boolean
	navigation: boolean,
	menu: boolean
}

export const useShow = defineStore("show", {
	state: (): InterfaceShow => ({
		overlayDashboard: false,
		overlaySite: false,
		navigation: false,
		menu: false
	}),
	actions: {
		setOverlayDashboard(data: boolean) {
			this.overlayDashboard = data;
		},
		setOverlaySite(data: boolean) {
			this.overlaySite = data;
		},
		setNavigation(data: boolean) {
			this.navigation = data;
		},
		setMenu(data: boolean) {
			this.menu = data;
		}
	},
	getters: {
	},
});
