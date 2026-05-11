import { defineStore } from "pinia";
import type { UserInfo } from "@/types/login";

export const useLoginStore = defineStore("login", {
    state: () => ({
        username: "",
        id: null as number | null,
        token: localStorage.getItem('token') || ""
    }),
    getters: {

    },
    actions: {
        setUserInfo(user: UserInfo) {
            console.log(user, 0);
            
            this.username = user.username;
            this.id = user.id;
            this.token = user.token
            localStorage.setItem("token", user.token);
        },
        logout() {
            this.username = "";
            this.id = null;
            this.token = "";
            localStorage.removeItem("token");
        }
    }
})