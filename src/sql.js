import React from 'react';
import { View, Button } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import LocalConfig from '../LocalConfig';
global.db = SQLite.openDatabase(
  {
    name: 'test1.db',
    location: 'default',
    createFromLocation: '~test1.db',
    //version: 2.0
  },
  suss => {
    null;
  },
  error => {
    null;
  },
);
export default class App extends React.Component {
  constructor() {
    super();
    SQLite.DEBUG = true;
  }
  async componentDidMount() {
    await this.CreateTable();
    await this.deleteitempromoall();
    await this.insertpromo();
    await this.addItem();
    await this.SelectQuery();
    await this.getCount();
    await this.deleteitem();
    await this.updateqty();
    await this.updatepromo();
    await this.deleteitempromo();
    await this.getpromousedusers();
    await this.getpromo();
    await this.addaddons();
  }
  ExecuteQuery = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.transaction(trans => {
        trans.executeSql(
          sql,
          params,
          (trans, results) => {
            resolve(results);
          },
          error => {
            reject(error);
          },
        );
      });
    });
  async CreateTable() {
    let details = await this.ExecuteQuery(
      'CREATE TABLE if not EXISTS details (id INTEGER PRIMARY KEY AUTOINCREMENT, item_id TEXT, category TEXT, item_name TEXT, price TEXT, qty TEXT, image TEXT, wholecat TEXT, addons_id TEXT, addonsName TEXT, addons_price TEXT, variant_id TEXT, variantName TEXT, variant_price TEXT, radioid TEXT, radioprice TEXT, varid TEXT, varprice TEXT, total TEXT, remarks TEXT, type TEXT, freeid TEXT, free_item_data TEXT)',
      [],
    );
    let promo = await this.ExecuteQuery(
      "CREATE TABLE if not EXISTS promo ( id INTEGER PRIMARY KEY ,promo_id INTEGER,promo_code TEXT,discount_pa TEXT,usage_limit_user TEXT,used_users TEXT,promo_type TEXT)",
      [],
    );
    await this.ExecuteQuery(
      "CREATE TABLE if not EXISTS free (id INTEGER PRIMARY KEY AUTOINCREMENT , item_name TEXT, item_id TEXT, free_for_id TEXT, free_for_name TEXT, max_free_qty TEXT, min_item_qty TEXT, notes TEXT, qty TEXT, freeid TEXT, adding_by TEXT)",
      [],
    );
  }
  //variant_id TEXT,variantName TEXT,variant_price TEXT             //radioid TEXT,radioprice radioid TEXT,radioprice TEXT,varid TEXT,varprice TEXT
  async addItemaddon(
    itm_id,
    cat,
    name,
    price,
    qty,
    image,
    wholecat,
    addonid,
    addname,
    addprice,
    variantid,
    variantName,
    variantprice,
    radioid,
    radioprice,
    varid,
    varprice,
    total,
    remark,
    item
  ) {
    // single insert query
    let query =
      "INSERT INTO details (item_id,category,item_name, price, qty, image,wholecat,addons_id,addonsName,addons_price,variant_id,variantName,variant_price,radioid,radioprice,varid,varprice,total,remarks,free_item_data)VALUES ('" +
      itm_id +
      "','" +
      cat +
      "','" +
      name +
      "','" +
      price +
      "','" +
      qty +
      "','" +
      image +
      "','" +
      wholecat +
      "','" +
      addonid +
      "','" +
      addname +
      "','" +
      addprice +
      "','" +
      variantid +
      "','" +
      variantName +
      "','" +
      variantprice +
      "','" +
      radioid +
      "','" +
      radioprice +
      "','" +
      varid +
      "','" +
      varprice +
      "','" +
      total +
      "','" +
      remark +
      "','" +
      JSON.stringify(item.coupon) +
      "')";
    return await this.ExecuteQuery(query, []).then(async addItemaddon => {
      if (item.coupon?.active == 1) {
        await this.checkFree({ catId: item.free_category })
        this.getItem(item.id).then(mainItemRes => {
          let todalQty = 0
          for (let i = 0; i < mainItemRes.rows.length; ++i) {
            todalQty += parseFloat(mainItemRes.rows.item(i).qty)
          }
          this.getFreeProductWithMainProductID({ free_for_id: item.id }).then(async res => {
            // +1 for we gonna add free product.
            if (
              res.rows.length + 1 <= item.coupon?.max_free_prdt_qty &&
              todalQty <= item.coupon?.max_main_prdt_qty &&
              todalQty % parseFloat(item.coupon?.max_main_prdt_qty) == 0
            ) {
              this.addFreeNormalItem({
                item_name: item.coupon?.free_prdct_menu_name,
                item_id: item.coupon?.free_prdct,
                qty: item.coupon?.free_prdct_qty,
                notes: '',
                free_for_id: item.id,
                free_for_name: item.menu_name,
                max_free_qty: item.coupon?.max_free_prdt_qty,
                min_item_qty: item.coupon?.max_main_prdt_qty,
                manItemIterstId: addItemaddon.insertId
              }).then(addFreeNormalItem => {
                this.updateFeeIdOfDetails({ detailsId: addItemaddon.insertId, freeId: addFreeNormalItem.insertId })
              }).then(res => null)
            }
          })
        })
      }
      return addItemaddon;
    });
    // multiple insert of users
  }
  async updateQtyFreeProduct({ id, qty }) {
    const query = `UPDATE free SET qty='${qty}' WHERE id='${id}';`
    console.log(`console ~ file: sql.js:172 ~ App ~ updateQtyFreeProduct ~ query:\n____: `, query)
    return await this.ExecuteQuery(query, []);

  }
  async getAllFreeProduct() {
    const query = `SELECT * FROM free;`
    return await this.ExecuteQuery(query, []);
  }
  async getAllFreeProductWithMainCategory({ main_category }) {
    const query = `SELECT * FROM free WHERE main_category=${main_category};`
    return await this.ExecuteQuery(query, []);
  }
  async getFreeProductWithMainProductID({ free_for_id }) {
    const query = `SELECT * FROM free WHERE free_for_id='${free_for_id}';`
    console.log({ getFreeProductWithMainProductID: query });
    return await this.ExecuteQuery(query, []);
  }
  async getFreeProductWithMainSqlID({ id }) {
    const query = `SELECT * FROM free WHERE id='${id}';`
    return await this.ExecuteQuery(query, []);
  }
  async deleteFreeProductWithItemId({ itemId }) {
    const query = `DELETE FROM free WHERE \`free_for_id\` = '${itemId}'`
    return await this.ExecuteQuery(query, []);
  }
  async deleteFreeProductWithCatId({ main_category }) {
    const query = `DELETE FROM free WHERE \`main_category\` = '${main_category}'`
    return await this.ExecuteQuery(query, []);
  }
  async deleteFreeProductWithId({ id }) {
    const query = `DELETE FROM free WHERE \`id\` = '${id}'`;
    console.log(query);
    return await this.ExecuteQuery(query, []);

  }
  async addFreeNormalItem({ item_name, qty, item_id, free_for_id, free_for_name, max_free_qty, min_item_qty, notes, manItemIterstId, adding_by, main_category }) {
    let query = `INSERT INTO free (item_name, qty, item_id, free_for_id, free_for_name, max_free_qty, min_item_qty, notes, freeid, adding_by, main_category) VALUES ('${item_name}', '${qty}', '${item_id}', '${free_for_id}', '${free_for_name}', '${max_free_qty}', '${min_item_qty}', ${notes ? notes : 'NULL'}, '${manItemIterstId}', ${adding_by}, ${main_category})`;
    console.log(`console ~ file: sql.js:205 ~ App ~ addFreeNormalItem ~ query:\n____: `, query)
    return await this.ExecuteQuery(query, []);

  }
  async checkFree({ catId }) {
    this.getAllDetailsWithCategory({
      category: catId
    }).then(async res => {
      if (res.rows.length <= 0) await this.ExecuteQuery('DELETE FROM free').then(res => console.log("deteted table: free"));
    })
  }
  async updateFeeIdOfDetails({ detailsId, freeId }) {
    const query = `UPDATE details SET freeid = ${freeId} WHERE id = ${detailsId};`
    return await this.ExecuteQuery(query, []);
  }
  async addItem(itm_id, cat, name, price, qty, image, wholecat, total, remark, item) {
    console.log("addItem here")
    let query =
      "INSERT INTO details (item_id,category,item_name, price, qty, image,wholecat,total,remarks,addons_price,variant_price,free_item_data)VALUES ('" +
      itm_id +
      "','" +
      cat +
      "','" +
      name +
      "','" +
      price +
      "','" +
      qty +
      "','" +
      image +
      "','" +
      wholecat +
      "','" +
      total +
      "','" +
      remark +
      "','0','0','" + JSON.stringify(item.coupon) + "')";

    const coupon = item.coupon;
    // const coupon = require('./Res/coupon.json');
    let freeAddedId = null;
    if (item.category == item.free_category && coupon?.active == 1) {
      this.checkFree({ catId: item.category })
      this.getAllFreeProductWithMainCategory({ main_category: item.category }).then(async getAllFreeProductWithMainCategory => {
        let updatingQty = 0;
        await this.getAllDetailsWithCategory({
          category: item.category
        }).then(items => {
          for (let i = 0; i < items.rows.length; ++i) {
            if (!isNaN(parseFloat(items.rows.item(i).qty)))
              updatingQty += parseFloat(items.rows.item(i).qty)
          }
        })
        console.log(
          updatingQty <= parseFloat(coupon.max_free_prdt_qty) ,
          updatingQty % parseFloat(coupon.max_main_prdt_qty) == 0 ,
          getAllFreeProductWithMainCategory.rows.length <= 0
        )
        if (
          updatingQty <= parseFloat(coupon.max_free_prdt_qty) &&
          updatingQty % parseFloat(coupon.max_main_prdt_qty) == 0 &&
          getAllFreeProductWithMainCategory.rows.length <= 0
        )
          await this.addFreeNormalItem({
            item_name: coupon?.free_prdct_menu_name,
            item_id: coupon?.free_prdct,
            qty: coupon?.free_prdct_qty,
            notes: '',
            free_for_id: item.id,
            free_for_name: item.menu_name,
            max_free_qty: coupon?.max_free_prdt_qty,
            min_item_qty: coupon?.max_main_prdt_qty,
            main_category: item.category,
            adding_by: coupon?.free_prdct_qty,
          }).then(addFreeNormalItem => {
            freeAddedId = addFreeNormalItem.insertId
          })
        else if (getAllFreeProductWithMainCategory.rows.length > 0) {
          const BUY_QTY = parseFloat(item.coupon?.max_main_prdt_qty) || parseFloat(getAllFreeProductWithMainCategory.rows.item(0).min_item_qty)
          const GET_QTY = parseFloat(item.coupon?.free_prdct_qty) || parseFloat(getAllFreeProductWithMainCategory.rows.item(0).adding_by)
          const MAX_FREE_QTY = parseFloat(item.coupon?.max_free_prdt_qty) || parseFloat(getAllFreeProductWithMainCategory.rows.item(0).max_free_qty)
          // let updateQtyTo = (updatingQty / max_main_prdt_qty) * addingBy;

          let qualifyingQty = Math.floor(updatingQty / BUY_QTY);
          let freeQty = Math.min(qualifyingQty * GET_QTY, MAX_FREE_QTY);

          await this.updateQtyFreeProduct({
            id: getAllFreeProductWithMainCategory.rows.item(0).id,
            qty: freeQty
          })
        }
      })
    }
    return await this.ExecuteQuery(query, [])
      .then(async addItem => {
        await this.updateFeeIdOfDetails({ detailsId: addItem.insertId, freeId: freeAddedId })
        return addItem
      })
  }
  async insertpromo(promoid, promocode, amt, usage, used_users, type) {
    // single insert query
    let query =
      "INSERT INTO promo (promo_id ,promo_code ,discount_pa ,usage_limit_user ,used_users ,promo_type )VALUES ('" +
      promoid +
      "','" +
      promocode +
      "','" +
      amt +
      "','" +
      usage +
      "','" +
      used_users +
      "','" +
      type +
      "')";
    return await this.ExecuteQuery(query, []);
    // multiple insert of users
  }
  async updateqty(qty, tot, id, remark, item) {
    const query = "UPDATE details SET qty='" +
      qty +
      "',total='" +
      tot +
      "' WHERE  item_id='" +
      id +
      "' "
    return await this.ExecuteQuery(query, []).then(updateqty => {
      console.log("updateqty", query)
      if (item.coupon?.active == 1 || item.freeid != null) {
        this.getItem(item.id).then(mainItemRes => {
          let todalQty = 0
          for (let i = 0; i < mainItemRes.rows.length; ++i) {
            todalQty += parseFloat(mainItemRes.rows.item(i).qty)
          }
          this.getFreeProductWithMainProductID({ free_for_id: item.id }).then(async res => {
            let freeQty = 0
            for (let i = 0; i < res.rows.length; ++i) {
              freeQty += parseFloat(res.rows.item(i).qty)
            }
            if (parseFloat(qty) < parseFloat(item.coupon?.max_main_prdt_qty || res.rows.item(0).min_item_qty) && res.rows.length > 0) this.deleteFreeProductWithItemId({ itemId: item.id }).then(del => console.log("deleted for 1", res.rows.item(0).free_for_name))
            // +1 for we gonna add free product.
            else if (
              freeQty + parseFloat(item.coupon?.free_prdct_qty) <= item.coupon?.max_free_prdt_qty &&
              todalQty <= item.coupon?.max_main_prdt_qty &&
              res.rows.length <= 0 &&
              todalQty % parseFloat(item.coupon?.max_main_prdt_qty) == 0) {
              this.addFreeNormalItem({
                item_name: item.coupon?.free_prdct_menu_name,
                item_id: item.coupon?.free_prdct,
                qty: item.coupon?.free_prdct_qty,
                notes: '',
                free_for_id: item.id,
                free_for_name: item.menu_name,
                max_free_qty: item.coupon?.max_free_prdt_qty,
                min_item_qty: item.coupon?.max_main_prdt_qty,
                manItemIterstId: item.sqlid,
                adding_by: item.coupon?.free_prdct_qty
              }).then(addFreeNormalItem => this.updateFeeIdOfDetails({ detailsId: id, freeId: addFreeNormalItem.insertId })).then(res => console.log("inserted New"))

            }
            if (res.rows.length > 0) {
              // console.log({
              //   1: (freeQty <= res.rows?.item(0)?.max_free_qty),
              //   2: (qty >= 0 && qty >= res.rows?.item(0)?.min_item_qty),
              //   3: ((todalQty % parseFloat(res.rows?.item(0)?.min_item_qty) == 0))
              // })
              if (
                (freeQty <= item.coupon?.max_free_prdt_qty || freeQty <= res.rows?.item(0)?.max_free_qty) &&
                (qty >= 0 && qty >= res.rows?.item(0)?.min_item_qty) &&
                ((todalQty % parseFloat(item.coupon?.max_main_prdt_qty) == 0) || (todalQty % parseFloat(res.rows?.item(0)?.min_item_qty) == 0)) &&
                (res.rows.length <= 0)
              ) {
                let updatingQty = parseFloat(qty);
                let max_main_prdt_qty = parseFloat(item.coupon?.max_main_prdt_qty) || parseFloat(res.rows.item(0).min_item_qty)
                let addingBy = parseFloat(item.coupon?.free_prdct_qty) || parseFloat(res.rows.item(0).adding_by)
                let updateQtyTo = (updatingQty / max_main_prdt_qty) * addingBy;
                // console.log("console ~ file: sql.js:377 ~ App ~ this.getFreeProductWithMainProductID ~ updateQtyTo:", updateQtyTo)
                this.updateQtyFreeProduct({ id: res.rows.item(0).id, qty: updateQtyTo }).then(updateQtyFreeProduct => null)
              }
            }
          })
        })
      }
      return updateqty;
    });
  }
  async updateqty1(qty, tot, id, remark, item) {
    const query = "UPDATE details SET qty='" + qty + "',total='" + tot + "' WHERE  id='" + id + "' ";
    console.log("updateqty1", query)
    // const coupon = require("./Res/coupon.json")
    const coupon = item.coupon === undefined ? JSON.parse(item.free_item_data) : item.coupon;
    if (coupon?.active == 1) {
      await this.checkFree({ catId: item.category })
      await this.getAllFreeProductWithMainCategory({ main_category: item.category }).then(async getAllFreeProductWithMainCategory => {
        let updatingQty = parseFloat(qty);
        await this.getAllDetailsWithCategory({
          category: item.category
        }).then(items => {
          for (let i = 0; i < items.rows.length; ++i) {
            console.log("cat qty", items.rows.item(i).item_name, parseFloat(items.rows.item(i).qty))
            if (!isNaN(parseFloat(items.rows.item(i).qty)) && items.rows.item(i).id != id)
              updatingQty += parseFloat(items.rows.item(i).qty)
          }
        })
        if (
          updatingQty % parseFloat(coupon.max_main_prdt_qty) == 0 &&
          getAllFreeProductWithMainCategory.rows.length <= 0
        ) {
          await this.addFreeNormalItem({
            item_name: coupon?.free_prdct_menu_name,
            item_id: coupon?.free_prdct,
            qty: coupon?.free_prdct_qty,
            notes: '',
            free_for_id: item.coupon === undefined ? item.sqlid : item.id,
            free_for_name: item.menu_name,
            max_free_qty: coupon?.max_free_prdt_qty,
            min_item_qty: coupon?.max_main_prdt_qty,
            main_category: item.category,
            adding_by: coupon?.free_prdct_qty
          }).then(async addFreeNormalItem => {
            await this.updateFeeIdOfDetails({ detailsId: id, freeId: addFreeNormalItem.insertId })
          })
        } else if (getAllFreeProductWithMainCategory.rows.length > 0) {
          const BUY_QTY = parseFloat(item.coupon?.max_main_prdt_qty) || parseFloat(getAllFreeProductWithMainCategory.rows.item(0).min_item_qty)
          const GET_QTY = parseFloat(item.coupon?.free_prdct_qty) || parseFloat(getAllFreeProductWithMainCategory.rows.item(0).adding_by)
          const MAX_FREE_QTY = parseFloat(item.coupon?.max_free_prdt_qty) || parseFloat(getAllFreeProductWithMainCategory.rows.item(0).max_free_qty)
          // let updateQtyTo = (updatingQty / max_main_prdt_qty) * addingBy;

          let qualifyingQty = Math.floor(updatingQty / BUY_QTY);
          let freeQty = Math.min(qualifyingQty * GET_QTY, MAX_FREE_QTY);

          await this.updateQtyFreeProduct({
            id: getAllFreeProductWithMainCategory.rows.item(0).id,
            qty: freeQty
          })

        }
      })
    }
    return await this.ExecuteQuery(query, [])
  }
  async updatepromo(used_users, promoid) {
    return await this.ExecuteQuery(
      "UPDATE promo SET used_users='" +
      used_users +
      "' WHERE  promo_id='" +
      promoid +
      "'",
    );
  }
  async addaddons(addonid, addname, addprice, tot, id) {
    return new Promise((resolve, reject) => {
      let query =
        "UPDATE details SET addons_id='" +
        addonid +
        "',addonsName='" +
        addname +
        "',addons_price='" +
        addprice +
        "',total='" +
        tot +
        "' WHERE  id='" +
        id +
        "'";
      let addaddons = this.ExecuteQuery(query, [])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  } //variant_id,variantName,variant_price
  //radioid TEXT,radioprice TEXT,varid TEXT,varprice TEXT
  async variant(varid, varname, varprice, varid1, varprice1, tot, id) {
    return new Promise((resolve, reject) => {
      let query =
        "UPDATE details SET variant_id='" +
        varid +
        "',variantName='" +
        varname +
        "',variant_price='" +
        varprice +
        "',varid='" +
        varid1 +
        "',varprice='" +
        varprice1 +
        "',total='" +
        tot +
        "' WHERE  id='" +
        id +
        "'";
      let variant = this.ExecuteQuery(query, [])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  async radio(varid, varprice, radioid, radioprice, tot, id) {
    return new Promise((resolve, reject) => {
      let query =
        "UPDATE details SET variant_id='" +
        varid +
        "',variant_price='" +
        varprice +
        "',radioid='" +
        radioid +
        "',radioprice='" +
        radioprice +
        "',total='" +
        tot +
        "' WHERE  id='" +
        id +
        "'";
      let radio = this.ExecuteQuery(query, [])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  /*
    Delete Query Example
  */
  async deleteitem(id) {
    console.log("deleteitem");
    this.getItem1(id).then(async getItem1 => {
      for (let i = 0; i < getItem1.rows.length; i++) {
        await this.deleteFreeProductWithItemId({ itemId: getItem1.rows.item(i).item_id }).then(res => console.log("deleted_1"))
      }
    })
    return await this.ExecuteQuery(
      "DELETE FROM details  WHERE  item_id='" + id + "' ",
    ).then(deleteitem => null);
  }
  async deleteitem1(id, remark) {
    this.getItem1(id).then(async getItem1 => {
      for (let i = 0; i < getItem1.rows.length; i++) {
        // console.log(getItem1.rows.item(i));
        await this.deleteFreeProductWithId({ id: getItem1.rows.item(i).freeid }).then(res => console.log("deleted_2"))
      }
    })
    console.log("deleteitem1");
    return await this.ExecuteQuery(
      "DELETE FROM details  WHERE  id='" +
      id +
      "' and remarks='" +
      remark +
      "'",
    ).then(deleteitem1 => null);
  }
  async deleteitem2(id) {
    this.getItem1(id).then(async getItem1 => {
      for (let i = 0; i < getItem1.rows.length; i++) {
        // console.log(getItem1.rows.item(i));
        // console.log(getItem1.rows.item(i).freeid);
        await this.deleteFreeProductWithId({ id: getItem1.rows.item(i).freeid }).then(res => console.log("deleted_2"))
      }
    })
    this.getAllFreeProduct().then(getAllFreeProduct => {
      let temp = []
      for (let i = 0; i < getAllFreeProduct.rows.length; i++) {
        temp.push(getAllFreeProduct.rows.item(i))
      }
    })
    return new Promise((resolve, reject) => {
      let query = "DELETE FROM details  WHERE  id='" + id + "' ";
      console.log(query);
      let getAllItem = this.ExecuteQuery(query, [])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  async deleteitempromoall() {
    return await this.ExecuteQuery('DELETE FROM promo');
  }
  async deleteitempromo(id) {
    let deleteitempromo = await this.ExecuteQuery(
      "DELETE FROM promo  WHERE  promo_id='" + id + "'",
    );
  }
  async deleteallrows() {
    await this.ExecuteQuery('DELETE FROM details').then(res => console.log("deteted table: details"));
    await this.ExecuteQuery('DELETE FROM free').then(res => console.log("deteted table: free"));
  }
  async SelectQuery() {
    let selectQuery = await this.ExecuteQuery('SELECT * FROM details', []);
    var rows = selectQuery.rows;
    for (let i = 0; i < rows.length; i++) {
      var item = rows.item(i);
    }
  }
  async getAllItem() {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM  details';
      let getAllItem = this.ExecuteQuery(query, [])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  async getAllItem1() {
    return new Promise((resolve, reject) => {
      let query = 'SELECT SUM(total) FROM details';
      let getAllItem1 = this.ExecuteQuery(query, [])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  async getItem(item_id) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM  details  WHERE  item_id='" + item_id + "'";
      let getItem = this.ExecuteQuery(query, [])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  async getItem1(id) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM details  WHERE  id='" + id + "'";
      let getItem1 = this.ExecuteQuery(query, [])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  async getAllDetailsWithCategory({ category }) {
    const query = `SELECT * FROM details WHERE category='${category}'`;
    console.log(`console ~ file: sql.js:633 ~ App ~ getAllDetailsWithCategory ~ query:\n____: `, query)
    return await this.ExecuteQuery(query, []);
  }
  async getpromo(promoid) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM  promo  WHERE  promo_id='" + promoid + "'";
      let getpromo = this.ExecuteQuery(query, [])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  async getpromousedusers(promoid) {
    return new Promise((resolve, reject) => {
      let query =
        "SELECT used_users FROM  promo  WHERE  promo_id='" + promoid + "'";
      let getpromousedusers = this.ExecuteQuery(query, [])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  async getCount() {
    let getCount = await this.ExecuteQuery(
      'SELECT COUNT(id) as count FROM  details',
      [],
    );
    var rows = getCount.rows;
    for (let i = 0; i < rows.length; i++) {
      var item = rows.item(i);
    }
  }
  async getcountitem(id) {
    return new Promise((resolve, reject) => {
      let query =
        "SELECT COUNT(id) as count FROM  details  WHERE  item_id='" + id + "'";
      let getcountitem = this.ExecuteQuery(query, [])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  async showdatabase() {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM 'details'`;
      this.ExecuteQuery(query, [])
        .then(res => {
          resolve(res);
          var temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button
          onPress={() => {
            this.deleteallrows();
          }}
          title="Dalete"
          color="#841584"
        />
      </View>
    );
  }
}
