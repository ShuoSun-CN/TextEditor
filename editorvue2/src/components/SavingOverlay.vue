<template>
  <div class="saving-overlay">
    <div class="overlay-content">
      <div v-if="isSaving" class="spinner">
       <svg t="1723298091344" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6983" data-spm-anchor-id="a313x.search_index.0.i8.67363a81rfHDpt" width="22" height="22"><path d="M546.45 266.24a133.34 133.34 0 0 1-133.12-133.12C413.257 59.758 473.088 0 546.377 0c73.436 0 133.12 59.758 133.12 133.12 0 73.435-59.684 133.12-133.12 133.12zM263.022 372.078A121.783 121.783 0 0 1 141.385 250.44c0-67.072 54.565-121.636 121.637-121.636A121.783 121.783 0 0 1 384.585 250.44c0 67.072-54.491 121.637-121.563 121.637z m-120.467 275.09a107.374 107.374 0 0 1 0-214.528 107.374 107.374 0 0 1 0 214.528z m120.467 272.603a91.063 91.063 0 0 1-90.99-90.916c0.073-50.25 40.74-90.917 90.99-90.99a91.063 91.063 0 0 1 0 181.906zM546.377 1024a79.506 79.506 0 0 1 0-158.866 79.506 79.506 0 0 1 0 158.866z m287.744-134.29a64.22 64.22 0 0 1 0-128.22 64.22 64.22 0 0 1 0 128.22z m117.833-296.668a52.663 52.663 0 1 1 0.147-105.325 52.663 52.663 0 0 1-0.147 105.325zM793.307 254.391a40.814 40.814 0 1 0 81.628-0.073 40.814 40.814 0 0 0-81.628 0z" fill="#134263" p-id="6984"></path></svg>
      </div>
      <div v-else class="success-icon">
      <svg t="1723296154948" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5625" width="24" height="24"><path d="M437.76 714.752l-155.648-141.824L376.832 512l60.928 108.032s115.712-216.576 284.16-284.16c0 0-20.992 53.248-13.312 141.824-0.512 0.512-130.56 37.376-270.848 237.056m74.24 182.784c-212.992 0-385.536-172.032-385.536-385.024s172.032-385.536 385.024-385.536c60.416 0 120.32 14.336 174.08 41.472 19.968 4.608 32.768 24.064 28.16 44.032-4.608 19.968-24.064 32.768-44.032 28.16-4.608-1.024-8.704-2.56-12.288-5.12l-0.512 1.024C504.832 156.672 316.928 215.04 237.568 367.104c-79.872 152.064-21.504 339.968 130.56 419.328 152.064 79.872 339.968 21.504 419.328-130.56 50.688-96.768 47.104-212.48-9.728-305.664h0.512c-13.312-15.36-11.776-38.912 3.584-52.224 15.36-13.312 38.912-11.776 52.224 3.584 2.048 2.56 4.096 5.12 5.12 8.192l0.512-0.512c112.128 180.736 55.808 418.304-124.928 530.432a383.6416 383.6416 0 0 1-202.752 57.856" fill="#305a8d" p-id="5626"></path></svg>
    </div>
      <p v-if="isSaving">正在自动保存</p>
      <p v-else>自动保存成功</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SavingOverlay',
  props: {
    isSaving: {
      type: Boolean,
      default: true
    },
    saveSuccess: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.saving-overlay {
  position: fixed;
  left: 130px;
  padding: 5px;
  margin-top: 10px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.overlay-content {
  display: flex;
  align-items: center;
}

.spinner, .success-icon {
  width: 22px;
  height: 22px;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.overlay-content p {
  font-size: 14px;
  color: #333;
  margin-left: 10px;
}

.overlay-content p:last-child {
  color: #8a8a8a;
}
</style>
