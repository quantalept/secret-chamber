<template>
  <v-dialog v-bind:visible="dialog" max-width="500">
    <v-card>
      <v-card-text>
        <v-text-field v-model="catalogueStore.newItem.title" label="Title" :rules="validateExistence"></v-text-field>
        <div style="margin-top:15px;"></div>
        <v-text-field v-model="catalogueStore.newItem.desc" label="Description"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-row justify="center" class="mb-3 mt-3">
          <v-btn variant="text" @click="cancel">Cancel</v-btn>
          <v-btn variant="text" @click="addNewItem" :disabled="isButtonDisabled">Add Item</v-btn>
        </v-row>
    </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent,ref,computed } from 'vue';
import { usecatalogueStore } from '../../../store/catalogueStore';

export default defineComponent({
  props: {
      dialog: Boolean,
      validateExistence:Array,      
    },
  setup(props, { emit }) {
    const catalogueStore = usecatalogueStore();
    const  cancel =() =>{
      emit('cancel');        
      };
    const  addNewItem =() =>{
      emit('add-item');        
      };
    const isButtonDisabled =  computed(() =>
      catalogueStore.newItem.title.trim().length === 0);
    
    return {
      catalogueStore,
      addNewItem,
      cancel,
      isButtonDisabled,
    };
  },
});
</script>
<style scoped>
.error-message {
    color: red;
    margin-top: 5px;
    margin-left: 10px;
  }
</style>
