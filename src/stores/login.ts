import { defineStore } from "pinia";
import type { UserInfo } from "@/types/login";

export const useLoginStore = defineStore("login", {
    state: () => ({
        username: "",
        id: localStorage.getItem('id') || null,
        token: localStorage.getItem('token') || ""
    }),
    getters: {

    },
    actions: {
        setUserInfo(user: UserInfo) {
            this.username = user.username;
            this.id = user.id;
            this.token = user.token;
            localStorage.setItem("id", user.id);
            localStorage.setItem("token", user.token);
        },
        logout() {
            this.username = "";
            this.id = null;
            this.token = "";
            localStorage.removeItem("token");
            localStorage.removeItem("id");
        }
    },
    persist: true
})