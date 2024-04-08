import { getDBInstance } from './database';
import { usecatalogueStore } from '../../store/catalogueStore';
import { innerjoin } from './category';
import { loadCredentialData } from './credential';
import { useCredentialStore } from '../../store/credential';



export async function insertCatalogueToDatabase(selecteditem, selectCred, cate_id) {
  try {
    const db = await getDBInstance();
    const catalogueStore = usecatalogueStore();
    const row = await db.execute(`
          INSERT INTO Credential_Store (cs_name, secondary_info)
          VALUES (?, ?)
        `, [catalogueStore.newItem.title, catalogueStore.newItem.desc]);
    catalogueStore.newItem.id = row.lastInsertId;
    selecteditem.value = catalogueStore.newItem
    await insertcred_category(catalogueStore.newItem.id, cate_id);
    await selectCred(catalogueStore.newItem)
    console.log('Catalogue inserted into the database successfully!');
  } catch (error) {
    console.error('Error inserting Catalogue into the database:', error);
  }
};
export async function insertcred_category(lastInsertId, cate_id) {
  try {
    const db = await getDBInstance();
    await db.execute(`
          INSERT INTO Credential_Category ( cs_id, category_id)  
          VALUES (?,?)
      `, [lastInsertId, cate_id])
    await innerjoin();
    console.log('Cred_cate inserted into the database successfully!');

  } catch (error) {
    console.error('Error loading Catalogue into the database:', error);
  }
}
export async function loadcatalogues(id) {
  try {
    const db = await getDBInstance();
    const catalogueStore = usecatalogueStore();
    let result;

    if (id) {
      result = await db.select(`
        SELECT Category.category_name,Credential_Store.cs_name,Credential_Store.secondary_info
        FROM Credential_Category
        INNER JOIN Credential_Store ON  Credential_Category.cs_id=Credential_Store.cs_id
        INNER JOIN Category ON Credential_Category.category_id=Category.category_id
        WHERE Category.category_id = ?
      `, [id]);
    } else {
      result = await db.select(`
        SELECT * FROM Credential_Store
       `);
    }
    const fields = result.map(row => ({
      id: row.cs_id,
      title: row.cs_name,
      desc: row.secondary_info,
    }));
    catalogueStore.catalogueListed = fields
  } catch (error) {
    console.error('Error loading Catalogue into the database:', error);
  }
}
export async function deleteFromDatabase(selectedItem){
  try {
    const db = await getDBInstance();
    const title = "";
    const credentialStore = useCredentialStore();
    const catalogueStore = usecatalogueStore();
    const result = await db.select(`
    SELECT cs_id FROM Credential_Store WHERE cs_name = ? 
    `, [selectedItem]);
    if (result.length === 1) {
      const cs_id = result[0].cs_id;
      catalogueStore.removeId(cs_id);
      await db.execute(`
        DELETE FROM Credential WHERE cs_id = ?;
        DELETE FROM Credential_Category WHERE cs_id = ?;
        DELETE FROM Credential_Store WHERE cs_id = ?;
      `, [cs_id,cs_id,cs_id]);
      console.log('Item deleted successfully!');
      credentialStore.credData.title = title;
      await innerjoin();
      await loadCredentialData();
    } else {
      console.error('Invalid or missing data for selected item.');
    }
  } catch (error) {
    console.error('Error deleting from the database:', error);
  }
}


