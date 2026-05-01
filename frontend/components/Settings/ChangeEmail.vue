<template>
  <section>
    <form class="mb-8" @submit.prevent="updateEmail">
      <InputsBaseInput
        label="New email"
        type="email"
        :required="true"
        v-model="email"
      />
      <InputsBaseInput
        :is-password-show="true"
        label="Current Password"
        type="password"
        :required="true"
        v-model="password"
      />

      <div class="flex justify-between mt-4">
        <!-- <button
          type="button"
          class="bg-gray-300 text-gray-700 py-2 px-4 rounded-md shadow-xs hover:bg-gray-400 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button> -->
        <button
          :disabled="isDisable"
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
  let email = ref("");
  let password = ref("");
  let isDisable = ref(false);

  const updateEmail = async () => {
    isDisable.value = true;
    try {
      const endpoint = "/user/email-update";
      let payload = {
        email: email.value,
        password: password.value,
      };
      const { data } = await callAuthnAxios(endpoint, payload);

      alert(data.message);
      email.value = "";
      password.value = "";
    } catch (err) {
      isDisable.value = false;
      console.log(err);
    }
  };
</script>
