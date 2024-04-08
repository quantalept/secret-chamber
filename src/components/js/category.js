import { getDBInstance } from './database';
import { usecategoriesStore } from '../../store/categoryStore'


export async function insertDefaultcategories() {
  try {
    const db = await getDBInstance();
    const categoriesStore = usecategoriesStore();
    for (const cate of categoriesStore.defaultcateg) {
      const result = await db.select(`
          SELECT * FROM Category 
          WHERE category_name = ? AND category_icon = ?
        `, [cate.title, cate.icon]);
      if (result.length === 0) {
        await db.execute(`
          INSERT INTO Category (category_name, category_icon)
          VALUES (?, ?)
      `, [cate.title, cate.icon]);
        categoriesStore.categories.push(cate)
      }
    }
    console.log('Default categories inserted successfully!');
  } catch (error) {
    console.error('Error inserting default users:', error);
  }
};
export async function insertCategoryToDatabase() {
  try {
    const db = await getDBInstance();
    const categoriesStore = usecategoriesStore();
    await db.execute(`
          INSERT INTO Category (category_name, category_icon)
          VALUES (?, ?)
       `, [categoriesStore.newItem.title, categoriesStore.newItem.icon]);
    console.log('Category inserted into the database successfully!');
  } catch (error) {
    console.error('Error inserting category into the database:', error);
  }
};

export async function loadCategoriesFromDatabase() {
  try {
    const db = await getDBInstance();
    const categoriesStore = usecategoriesStore();
    await innerjoin()
    const rows = await db.select(`
           SELECT * FROM Category
       `);
    const fields = rows.map(row => ({
      id: row.id,
      title: row.category_name,
      icon: row.category_icon
    }));
    categoriesStore.categories = fields;
    await insertDefaultcategories();
    console.log('Categories loaded from the database and default categories added.');
  } catch (error) {
    console.error('Error loading categories from the database:', error);
  }
};
export async function innerjoin() {
  try {
    const db = await getDBInstance();
    const categoriesStore = usecategoriesStore();
    const result = await db.select(`
          SELECT Category.category_name,COUNT(Credential_Store.cs_id) AS Credential_Store_count
          FROM Credential_Category
          INNER JOIN Credential_Store ON  Credential_Category.cs_id=Credential_Store.cs_id
          INNER JOIN Category ON Credential_Category.category_id=Category.category_id
          GROUP BY Category.category_name
        `);
    console.log('Inner Join Result:', result);
    categoriesStore.cate_count = result;
  } catch (error) {
    console.error('Error loading Catalogue into the database:', error);
  }
}
export async function deleteFromDatabase(selectedItem) {
  try {
    const db = await getDBInstance();
    const categoriesStore = usecategoriesStore();
    const result = await db.select(`
    SELECT category_id FROM Category WHERE category_name = ? 
    `, [selectedItem]);
    if (result.length === 1) {
      const id = result[0].category_id;
      categoriesStore.removeCategory(id);
      await db.execute(`
        DELETE FROM Credential_Category WHERE category_id = ?;
        DELETE FROM Category WHERE category_id = ?;
      `, [id,id]);
      console.log('Item deleted successfully!');
      await loadCategoriesFromDatabase();
    } else {
      console.error('Invalid or missing data for selected item.');
    }
  } catch (error) {
    console.error('Error deleting from the database:', error);
  }
}

