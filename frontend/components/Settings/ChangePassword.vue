<template>
  <section>
    <form @submit.prevent="changePassword">
      <h1 class="text-center font-bold text-xl my-5">Change Your Password</h1>

      <InputsBaseInput
        :is-password-show="true"
        :required="true"
        type="password"
        label="Re-enter your current password"
        v-model="oldPassword"
      />
      <InputsBaseInput
        :is-password-show="true"
        :required="true"
        type="password"
        label="New Password"
        v-model="newPassword"
      />
      <InputsBaseInput
        :is-password-show="true"
        :required="true"
        type="password"
        label="Re-enter New Password"
        v-model="passwordConfirmation"
      />

      <div class="flex justify-between mt-4">
        <!-- <button
          type="button"
          class="bg-gray-300 text-gray-700 py-2 px-4 rounded-md shadow-xs hover:bg-gray-400 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button> -->
        <button
          type="submit"
          class="bg-black text-white py-2 px-4 rounded-md shadow-xs hover:bg-gray-700 base-trans"
        >
          Save
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
  let oldPassword = ref("");
  let newPassword = ref("");
  let passwordConfirmation = ref("");
  let isDisable = ref(false);

  const changePassword = async () => {
    isDisable.value = true;
    try {
      const endpoint = "/user/password-reset";
      let payload = {
        old_password: oldPassword.value,
        password: newPassword.value,
        password_confirmation: passwordConfirmation.value,
      };
      const { data } = await callAuthnAxios(endpoint, payload);

      alert(data.message);
      oldPassword.value = "";
      newPassword.value = "";
      passwordConfirmation.value = "";
    } catch (err) {
      isDisable.value = false;
      console.log(err);
    }
  };
</script>
