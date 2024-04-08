<template>
    <div class="itemd">
        <v-row>
            <v-col cols="6">
                <v-select 
                v-model="selectedItem" 
                :items="filteredItems" 
                label="Select/Change Category" 
                chips 
                
                solo-filled
                density="compact">
                </v-select>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import { ref, computed, watchEffect } from 'vue';
import { usecategoriesStore } from '../../../store/categoryStore';
import { insertcred_category } from '../../js/credentialStore';
import { getDBInstance } from '../../js/database';
import { useCredentialStore } from '../../../store/credential';

export default {
    props:{
        lastInsertId:Number
    },

    setup(props, { emit }) {
        const store = usecategoriesStore();
        const csid = props.lastInsertId;
        const selectedItem = ref([]);
        const credentialStore = useCredentialStore();

        const filteredItems = computed(() => {
            const items = store.categories;
            return items.filter(item => !selectedItem.value.includes(item));
        });


        const CateId = async (item) => {
            try {
                const db = await getDBInstance();
                const results = await db.select(`
                 SELECT category_id FROM Category WHERE category_name = ?;  
                   `,[item]);
                const cate_id = results[0].category_id;
                console.log(results)
                await insertcred_category(csid, cate_id);
            } catch (error) {
                console.error("Error retrieving cs_id from the database:", error);
            }
        };
        const loadcatalogues = async () => {
        
                const id = props.lastInsertId;
                const db = await getDBInstance();
                const result = await db.select(`
                SELECT Category.category_name
                FROM Credential_Category
                INNER JOIN Credential_Store ON  Credential_Category.cs_id=Credential_Store.cs_id
                INNER JOIN Category ON Credential_Category.category_id=Category.category_id
                WHERE Credential_Store.cs_id = ?;
            `, [id]);

                if (result.length > 0) {
                    const displayTitle = result[0].category_name;
                    selectedItem.value = displayTitle;
                }
            

        }
        watchEffect(() => {
      loadcatalogues();
    });
    watchEffect(() => {
      console.log("Selected Item:", selectedItem.value);
      if (selectedItem.value) {
        try {
          CateId(selectedItem); 
          console.log("Inserted item into database:", selectedItem.value);
        } catch (error) {
          console.error("Error inserting item into database:", error);
        }
      }
    });

        return {
            selectedItem,
            filteredItems,
            sharedCate
        };
    }
};
</script>
<style scoped>
.itemd {
    margin-left: 30vh;
}
</style>