import { defineStore } from 'pinia';

export const usecatalogueStore = defineStore('catalogue', {
  state: () => ({
    catalogueListed: [],
    newItem: {
      id: -1,
      title: '',
      desc: '',
    },
   
  }),
  actions: {
    addCatalogueItem() {
      this.catalogueListed.push(this.newItem);
      this.newItem = {id:-1,title:'',desc:''};
    },
    removeId(id) {
      const index = this.catalogueListed.findIndex(item => item.id === id);
        if (index !== -1) {
          this.catalogueListed.splice(index, 1);
        }
    },
    clearCatalogueItem() {      
      this.newItem = {id:-1,title:'',desc:''};
    },
  },
});
