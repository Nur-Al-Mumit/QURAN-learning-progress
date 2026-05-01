import { defineStore } from "pinia";

export const useStudentAuthStore = defineStore(
  "StudentAuth",
  () => {
    let signIn = ref({
      email: "",
      password: "",
      otp_ref: "",
      resend_time: "",
    });

    let signUp = ref({
      email: "",
      name: "",
      password_confirmation: "",
      password: "",
      otp_ref: "",
      resend_time: "",
    });

    let forgetPassword = ref({
      email: "",
      token: "",
      password: "",
      password_confirmation: "",
    });

    // Stages for SignIn, SignUp and Forget Password
    let signInStage = ref(1);
    let signUpStage = ref(1);
    let forgetPasswordStage = ref(1);

    return {
      signIn,
      signUp,
      signInStage,
      signUpStage,
      forgetPassword,
      forgetPasswordStage,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.cookies(),
    },
  }
);
