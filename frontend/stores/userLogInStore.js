import { defineStore } from 'pinia'

export const useUserLogInStore = defineStore('UserLogInStore', () => {
  let loginInfo = ref({
    email: "",
    name: "",
    password_confirmation: "",
    password: "",
    roles: 3

  });

  // User OTP Info
  let otp_ref = "";
  let resend_time = "";

  let stage = ref(1);
  let isLoggedIn = ref(false);


  // Forget Password Data
  let forgetInfo = ref({
    email: "",
    token: "",
    password: "",
    password_confirmation: "",
  });
  let forgetStage = ref(1)

  return { stage, isLoggedIn, loginInfo, otp_ref, resend_time, forgetInfo, forgetStage }
})
