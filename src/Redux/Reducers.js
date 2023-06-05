import ActionTypes from "./ActionTypes";
import sqlservice from "../sql";
const sql = new sqlservice();
export const Reducers = (state = {}, action) => {
  const getTotelQtyPrice = (state = []) => {
    let [price, items] = [0, 0];
    for (let catIndex = 0; catIndex < state.length; catIndex++) {
      for (
        let itemIndex = 0;
        itemIndex < state[catIndex].data.length;
        itemIndex++
      ) {
        if (state[catIndex].data[itemIndex].qty > 0) {
          price +=
            parseFloat(state[catIndex].data[itemIndex].qty) *
            parseFloat(state[catIndex].data[itemIndex].price);
          items += parseFloat(state[catIndex].data[itemIndex].qty);
        }
      }
    }
    return { price, items };
  };
  switch (action.type) {
    case ActionTypes.addAllItems: {
      state.items = action.payload;
      sql.getAllItem().then((res) => {
        for (let sqlIndex = 0; sqlIndex < res.rows.length; sqlIndex++) {
          for (let catIndex = 0; catIndex < state.items.length; catIndex++) {
            for (
              let itemIndex = 0;
              itemIndex < state.items[catIndex].data.length;
              itemIndex++
            ) {
              if (
                state.items[catIndex].data[itemIndex].id ==
                res.rows.item(sqlIndex).item_id
              ) {
                state.items[catIndex].data[itemIndex].sqlid =
                  res.rows.item(sqlIndex).id;
                state.items[catIndex].data[itemIndex].qty =
                  parseFloat(state.items[catIndex].data[itemIndex].qty) +
                  parseFloat(res.rows.item(sqlIndex).qty);
              }
            }
          }
        }
        state.TotelPrice = getTotelQtyPrice(state.items);
      });
      return state;
    }
    case ActionTypes.changeLogin: {
      state.isLogin = action.payload;
    }
    case ActionTypes.updateItems: {
      state.TotelPrice = getTotelQtyPrice(state.items);
      return state;
    }
    case ActionTypes.reduxAddaddonsItem: {
      let item = action.payload.item;
      // action.payload.addonsSeleted.CheckBoxes.name.toString() != "" ? "," : "" +
      sql
        .addItemaddon(
          action.payload.item.id, //    itm_id,
          action.payload.item.category, //    cat,
          action.payload.item.menu_name, //    name,
          parseFloat(action.payload.price), //    price,
          // parseFloat(action.payload.item.qty), // itm_qty,
          action.payload.item.menu_image, //    image,
          action.payload.item.wholecat, //    wholecat,
          action.payload.addonsSeleted.ingrediant.id.toString(), //    addonid,
          action.payload.addonsSeleted.ingrediant.name.toString(), //    addname,
          action.payload.addonsSeleted.ingrediant.price.toString(), //    addprice,
          action.payload.addonsSeleted.CheckBoxes.id.toString(), //    variantid,
          action.payload.addonsSeleted.CheckBoxes.name.toString() +
            (action.payload.addonsSeleted.CheckBoxes.name.toString() != ""
              ? ","
              : "") +
            action.payload.addonsSeleted.radioButton.name.toString(), //    variantName,
          action.payload.addonsSeleted.CheckBoxes.price.toString(), //    variantprice,
          action.payload.addonsSeleted.radioButton.id.toString(), //    radioid,
          action.payload.addonsSeleted.radioButton.price.toString(), //    radioprice,
          "", //    varid,
          "", //    varprice,
          parseFloat(action.payload.price) * parseFloat(action.payload.qty), //    total,
          "", //    remark,
          action.payload.item //    item
        )
        .then((res) => {
          state.items[action.payload.catIndex].data[
            action.payload.itemIndex
          ].sqlid = res.insertId;
        });
      state.items[action.payload.catIndex].data[action.payload.itemIndex].qty =
        parseFloat(
          state.items[action.payload.catIndex].data[action.payload.itemIndex]
            .qty
        ) + parseFloat(action.payload.qty);
      state.TotelPrice = getTotelQtyPrice(state.items);
      return state;
    }
    case ActionTypes.addItem:
      var item = action.payload[4];
      if (action.payload[5] == "add") {
        sql
          .addItem(
            item.id, //itm_id
            item.category, // cat
            item.menu_name, // name
            action.payload[3], // price
            action.payload[2], // qty
            item.menu_image, // image
            item.wholecat, // wholecat
            action.payload[3] * action.payload[2], // total
            item.remark, // remark
            item
          )
          .then((res) => {
            state.items[action.payload[0]].data[action.payload[1]].sqlid =
              res.insertId;
          });
      } else if (action.payload[5] == "update") {
        // qty, tot, id, remark
        sql.getItem1(item.sqlid).then((res) => {
          var qty;
          for (let sqlIndex = 0; sqlIndex < res.rows.length; sqlIndex++) {
            if (res.rows.item(sqlIndex).wholecat == 2) {
              qty = parseFloat(res.rows.item(sqlIndex).qty) + 0.25;
            } else if (res.rows.item(sqlIndex).wholecat == 3) {
              qty = action.payload[2];
            } else {
              qty = parseFloat(res.rows.item(sqlIndex).qty) + 1;
            }
          }
          state.items[action.payload[0]].data[action.payload[1]].qty = qty;
          sql.updateqty1(qty, qty * action.payload[3], item.sqlid, "", item);
        });
      }
      state.items[action.payload[0]].data[action.payload[1]].qty =
        action.payload[2];
      state.TotelPrice = getTotelQtyPrice(state.items);
      return state;
    case ActionTypes.removeItem:
      item = action.payload[4];
      sql
        .updateqty1(
          action.payload[2],
          action.payload[2] * action.payload[3],
          item.sqlid,
          "",
          item
        )
        .then((res) => {});
      state.items[action.payload[0]].data[action.payload[1]].qty =
        action.payload[2];
      state.TotelPrice = getTotelQtyPrice(state.items);
      return state;
    case ActionTypes.deleteItem:
      item = action.payload[4];
      sql.deleteitem2(item.sqlid).then((res) => {});
      state.items[action.payload[0]].data[action.payload[1]].qty = 0;
      state.TotelPrice = getTotelQtyPrice(state.items);
      return state;
    case ActionTypes.removefromsql:
      for (let catIndex = 0; catIndex < state.items.length; catIndex++) {
        for (
          let itemIndex = 0;
          itemIndex < state.items[catIndex].data.length;
          itemIndex++
        ) {
          if (
            state.items[catIndex].data[itemIndex].id ==
            res.rows.item(sqlIndex).item_id
          ) {
            state.items[catIndex].data[itemIndex].qty =
              res.rows.item(sqlIndex).qty;
          }
        }
      }
      state.TotelPrice = getTotelQtyPrice(state.items);
      return state;
    default:
      state.TotelPrice = getTotelQtyPrice(state.items);
      return state;
  }
};
