import { defineStore } from "pinia";

export interface InterfaceShow {
	overlayDashboard: boolean
	overlaySite: boolean
}

export const useShow = defineStore("show", {
	state: (): InterfaceShow => ({
		overlayDashboard: false,
		overlaySite: false
	}),
	actions: {
		setOverlayDashboard(data: boolean) {
			this.overlayDashboard = data;
		},
		setOverlaySite(data: boolean) {
			this.overlaySite = data;
		},
	},
	getters: {
	},
});
