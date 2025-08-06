import { defineStore } from "pinia";

export interface InterfaceInfo {
	info: object;
	user: object;
}

export const useInfo = defineStore("info", {
	state: (): InterfaceInfo => ({
		info: {},
		user: {}
	}),
	actions: {
		setInfo(dataInfo: object) {
			this.info = dataInfo;
		},
		setUser(dataUser: object) {
			this.user = dataUser;
		},
	},
	getters: {
	},
});
