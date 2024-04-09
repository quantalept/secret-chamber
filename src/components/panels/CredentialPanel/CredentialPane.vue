<template>
  <v-card height="100%" color="primary">
    <v-form class="px-3">
      <v-card-text>
        <v-row>
          <v-col class="mt-7" cols="3" sm="4">
            <v-label>Title :</v-label></v-col>
          <v-col cols="12" sm="3">
            <v-text-field v-model="credentialStore.credData.title" class="mt-4" variant="solo" density="compact"
              :readonly="!isEditing" />
          </v-col>
          <v-spacer></v-spacer>
          <v-btn class="mt-5 " icon @click="toggleEdit()">
            <v-icon>{{ isEditing ? 'mdi-eye' : 'mdi-pencil' }}</v-icon>
          </v-btn>
          <v-btn class="mt-5 md-5 ml-2" icon="mdi-plus" @click="addTextField(), additionClicked = true"></v-btn>
          <v-btn class="mt-5 md-5 ml-2" icon="mdi-heart"></v-btn>
        </v-row>
        <v-divider />
        <div v-for="(field, index) in credentialStore.credData.fields" :key="index" class="creds-view">
          <secret-row :field="field" :is-editing="isEditing" />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn>Cancel</v-btn>
        <v-btn @click="save()">Save</v-btn>
      </v-card-actions>
    </v-form>
    <chips :lastInsertId="selectedCsId"></chips>
  </v-card>
</template>

<script>
import { useCredentialStore } from '../../../store/credential';
import SecretRow from './SecretRow.vue';
import { watchEffect, ref } from 'vue';
import { insertNewfield, saveCredentialToDatabase } from '../../js/credential';
import { loadCredentialData } from '../../js/credential';
import Chips from './Chips.vue';

export default {
  props: {
    selectedCsId: Number,
    selectedCatalogTitle: String,
  },
  components: {
    SecretRow,
    Chips
  },

  setup(props) {
    const credentialStore = useCredentialStore();
    const isEditing = ref(false);
    const additionClicked = ref(false);



    watchEffect(() => {
      credentialStore.credData.title = props.selectedCatalogTitle;
      loadCredentialData(props.selectedCsId);
    });


    const addTextField = async () => {
      credentialStore.addField()
      isEditing.value = true;

    }
    const save = async () => {
      if (additionClicked.value) {
        await insertNewfield(props.selectedCsId)
      } else {
        await saveCredentialToDatabase(props.selectedCsId);
      }
    }

    const toggleEdit = () => {
      isEditing.value = !isEditing.value;
    };

    return {
      credentialStore,
      isFavorite: false,
      toggleEdit,
      isEditing,
      save,
      addTextField,
      additionClicked


    };
  },
};
</script>

<style scoped>
.creds-view {
  margin-top: 20px;
}
</style>
