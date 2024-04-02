<template>
  <v-list>
    <v-list-subheader>ALL VAULTS</v-list-subheader>
    <v-list-item v-for="(vault, i) in allVaults" :key="i" :value="vault" @click="selectVault(vault)"
      :class="{ vaultselected: isSelected(vault.text) }">
      <template #prepend>
        <v-icon :icon="vault.icon"></v-icon>
      </template>
      <template v-slot:append>
        <v-badge color="grey" :content="menuCount(vault.text)" inline></v-badge>
      </template>
      <v-list-item-title>
        {{ vault.text }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  data() {
    return {
      vaultSelected: "",
      allVaults: [
        { text: "All Items", icon: "mdi-format-list-bulleted-type" },
        { text: "Favorites", icon: "mdi-heart" },
        { text: "Frequently Used", icon: "mdi-star" },
      ],
      items: [],
      fav: [],
      freq: []
    };
  },
  methods: {
    selectVault(vault) {
      this.vaultSelected = vault.text;
      this.$emit('vault-selected', vault.text);
    },
    isSelected(clickedvault) {
      return clickedvault === this.vaultSelected;
    },

    menuCount(menuName) {
      if (menuName === "All Items") {
        return this.items.length;
      } else if (menuName === "Favorites") {
        return this.fav.length;
      } else if (menuName === "Frequently Used") {
        // Add your new menu count calculation method here
        return this.freq.length;
      }
      return 0;
    },
  }
};
</script>
<style scoped>
.v-list {
  background-color: #f5f5f5;
  border: 2px;
  margin-top: 0px;
}

.v-list-subheader {
  color: black;
  font-size: 18px;
  background-color: #e5e4e2;
  font-weight: bold;
  justify-content: center;
}

.vaultselected {
  font-weight: bold;
  color: rgb(49, 49, 204);
}
</style>
