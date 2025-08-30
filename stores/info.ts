import { defineStore } from "pinia";

export interface InterfaceInfo {
	info: object;
	user: object;
	profile: object;
	countsNotices: number;
}

export const useInfo = defineStore("info", {
	state: (): InterfaceInfo => ({
		info: {},
		user: {},
		profile: {},
		countsNotices: 0
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
		},
		setCountsNotices(dataCount: number) {
			this.countsNotices = dataCount
		}
	},
	getters: {
	},
});
