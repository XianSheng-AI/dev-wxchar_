// pages/components/mytree/mytree.js
const app=getApp();
Component({
  properties: {
    model: Object,
  },
  data: {
    open: false,
    isBranch: false,
  },

  methods: {
    toggle: function (e,val) {
      if (this.data.isBranch) {
        this.setData({
          open: !this.data.open,
        })
      }
    },
    setText(e){
      let item = e.currentTarget.dataset.item
      getApp().globalData.areaSelect
      app.globalData.areaSelect=item;
      this.triggerEvent('myevent', item, { bubbles: false });
      this.toggle(e,'0');
    },

    tapItem: function (e) {
      var itemid = e.currentTarget.dataset.itemid;
      this.triggerEvent('tapitem', { itemid: itemid }, { bubbles: true, composed: true });
    },
    childevent(e){
      let item = e.detail;
      this.triggerEvent('myevent', item, { bubbles: false });
    }
    
  },

  ready: function (e) {
    this.setData({
      isBranch: Boolean(this.data.model.childMenus && this.data.model.childMenus.length),
    });
  },
})

