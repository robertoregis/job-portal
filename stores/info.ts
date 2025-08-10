import { defineStore } from "pinia";

export interface InterfaceInfo {
	info: object;
	user: object;
	profile: object;
}

export const useInfo = defineStore("info", {
	state: (): InterfaceInfo => ({
		info: {},
		user: {},
		profile: {},
	}),
	actions: {
		setInfo(dataInfo: object) {
			this.info = dataInfo;
		},
		setUser(dataUser: object) {
			this.user = dataUser;
		},
		setProfile(dataProfile: object) {
			this.profile = dataProfile
		}
	},
	getters: {
	},
});
