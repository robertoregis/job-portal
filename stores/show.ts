import { defineStore } from "pinia";

export interface InterfaceShow {
	overlayDashboard: boolean
	overlaySite: boolean,
	navigation: boolean,
	menu: boolean,
	applyJob: boolean
}

export const useShow = defineStore("show", {
	state: (): InterfaceShow => ({
		overlayDashboard: false,
		overlaySite: false,
		navigation: false,
		menu: false,
		applyJob: false
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
		},
		setApplyJob(data: boolean) {
			this.applyJob = data;
		}
	},
	getters: {
	},
});
