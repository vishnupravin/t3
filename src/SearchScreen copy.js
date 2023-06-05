import React, { Component, useState } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TextInput,
  Image,
  ListItem,
  TouchableHighlight,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  processColor,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { Avatar } from '@ui-kitten/components';
import { BlurView } from '@react-native-community/blur';
import { Button, Switch, TouchableRipple, RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sqlservice from './sql';
import { Grayscale } from 'react-native-color-matrix-image-filters';
import CheckBox from '@react-native-community/checkbox';
import IconBadge from 'react-native-icon-badge';
import LocalConfig from '../LocalConfig';
const BASE_URL = `${LocalConfig.API_URL}admin/images/menu_item_icon/`;
let sql;
class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      shouldShow: true,
      total: '',
      items: [],
      item_count: 0,
      d: [],
      data5: [],
      addon: [],
      addonitem: [],
      checked1: false,
      check: false,
      itemname: [],
      total1: '',
      items12: [],
      modalVisible1: false,
      items1: [],
      subtotal: [],
      length: [],
      carddet: [],
      bid: '',
      temp_id: [],
      temp_name: [],
      temp_price: [],
      modal1: false,
      showMore: false,
      variant: [],
      variantid: [],
      variantname: [],
      variantprice: [],
      radioid: [],
      radioname: [],
      radioprice: [],
      checked2: false,
      espstatus: false,
    };
    sql = new sqlservice();
    this.refreshScreen = this.refreshScreen.bind(this);
  }
  refreshScreen() {
    this.setState(() => {
      this.componentDidMount();
    });
  }
  async addItem2(item) {
    var temp1 = [];
    var temp2 = [];
    var temp3 = [];
    var t = this.state.variantid.toString();
    var k = this.state.radioid.toString();
    temp1.push(t + ',' + k);
    var s = this.state.variantname.toString();
    var n = this.state.radioname.toString();
    temp2.push(s + ',' + n);
    var sn = this.state.variantprice.toString();
    var tk = this.state.radioprice.toString();
    if (sn.length > 0 || tk.length > 0) {
      if (sn.length > 0 && tk.length > 0) {
        temp3.push(sn + ',' + tk);
      } else {
        if (sn.length > 0) {
          temp3.push(sn);
        } else {
          temp3.push(tk);
        }
      }
    } else {
      temp3 = [];
    }
    var string = this.state.temp_id.toString();
    if (item.wholecat == 2) {
      var qty = 0.25;
    } else {
      var qty = 1;
    }
    item.qty = parseFloat(item.qty) + qty;
    const reducer = (previousValue, currentValue) =>
      parseInt(previousValue) + parseInt(currentValue);
    var string2 = this.state.temp_price.toString();
    var vas = temp3.toString();
    const temp = string2.split(',');
    const vat = vas.split(',');
    var price1 = vat.reduce(reducer);
    var price = temp.reduce(reducer);
    if (price > 0) {
      price = price;
    } else {
      price = 0;
    }
    if (price1 > 0) {
      price1 = price1;
    } else {
      price1 = 0;
    }
    var t = parseFloat(item.price) + parseFloat(price) + parseFloat(price1);
    var tot = parseFloat(t) * qty;
    sql
      .addItemaddon(
        item.id,
        item.category,
        item.menu_name,
        item.price,
        qty,
        item.menu_image,
        item.wholecat,
        this.state.temp_id,
        this.state.temp_name,
        this.state.temp_price,
        temp1,
        temp2,
        temp3,
        this.state.radioid,
        this.state.radioprice,
        this.state.variantid,
        this.state.variantprice,
        tot,
        item.remark,
        item
      )
      .then(res1 => {
        this.setState({
          qty1: qty,
        });
      })
      .catch(err => { });
    this.setState({
      modalVisible1: false,
      temp_id: [],
      temp_name: [],
      temp_price: [],
      checked1: [],
      checked2: [],
      radioid: [],
      radioprice: [],
      variantid: [],
      variant_name: [],
      variant_price: [],
      radioname: [],
    });
    this.count();
    this.itemamount();
  }
  async addItem(id, item) {
    fetch(
      `${LocalConfig.API_URL}admin/api/ingredientsnew.php?category=` +
      item.category +
      '&&menu_id=' +
      item.id,
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.ingre.length > 0 || responseJson.variant.length > 0) {
          var tt;
          var temp = [];
          var temp1 = [];
          var temp2 = [];
          responseJson.arrayvariant.map(
            item => (
              (tt = item.id),
              temp.push(item.id),
              temp1.push(item.name),
              temp2.push(item.price)
            ),
          );
          this.setState({ radioid: temp, radioname: temp1, radioprice: temp2 });
          this.setState({
            addon: responseJson.ingre,
            addonitem: item,
            modalVisible1: true,
            variant: responseJson.variant,
          });
        } else {
          if (item.wholecat == 2) {
            var qty = parseInt(item.qty) + 0.25;
            item.qty = qty;
            var tot = parseFloat(item.price) * 0.5;
            console.log(
              item.id,
              item.category,
              item.menu_name,
              item.price,
              qty,
              item.menu_image,
              item.wholecat,
              tot,
              item.remark,
              item
            )
            sql
              .addItem(
                item.id,
                item.category,
                item.menu_name,
                item.price,
                qty,
                item.menu_image,
                item.wholecat,
                tot,
                item.remark,
                item
              )
              .then(res1 => {
                this.setState({
                  qty1: qty,
                });
              })
              .catch(err => {
                //
              });
            this.count();
            this.itemamount();
          } else {
            //0.25
            var qty = parseInt(item.qty) + 1;
            //
            item.qty = qty;
            var tot = parseFloat(item.price) * qty;
            //
            sql
              .addItem(
                item.id,
                item.category,
                item.menu_name,
                item.price,
                qty,
                item.menu_image,
                item.wholecat,
                tot,
                item.remark,
                item
              )
              .then(res1 => {
                this.setState({
                  qty1: qty,
                });
              })
              .catch(err => {
                //
              });
            this.count();
            this.itemamount();
          }
        }
      });
  }
  delete(item) {
    sql
      .deleteitem(item.id, item.remark)
      .then(res => { })
      .catch(res => {
        alert(JSON.stringify(res));
      });
    item.qty = 0;
    this.count();
    this.itemamount();
  }
  ShowHideTextComponentView = () => {
    if (this.state.status == true) {
      this.setState({ status: false });
    } else {
      this.setState({ status: false });
    }
  };
  addPlusItem(id, item) {
    fetch(
      `${LocalConfig.API_URL}admin/api/ingredientsnew.php?category=` +
      item.category +
      '&&menu_id=' +
      item.id,
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.ingre.length > 0 || responseJson.variant.length > 0) {
          var tt;
          var temp = [];
          var temp1 = [];
          var temp2 = [];
          responseJson.arrayvariant.map(
            item => (
              temp.push(item.id), temp1.push(item.name), temp2.push(item.price)
            ),
          );
          this.setState({ radioid: temp, radioname: temp1, radioprice: temp2 });
          this.setState({
            addon: responseJson.ingre,
            addonitem: item,
            modal1: true,
            variant: responseJson.variant,
          });
        } else {
          // var qty = parseInt(item.qty) + 1;
          // var tot = parseFloat(item.price) * qty;
          // item.qty = parseInt(item.qty) + 1;
          // sql.updateqty(qty, tot, id).then((res) => {
          // }).catch((res) => {
          //   alert(JSON.stringify(res))
          // })
          // this.itemamount()
          if (item.wholecat == 2) {
            var qty = parseFloat(item.qty) + 0.25;
            var tot = parseFloat(item.price) * qty;
            item.qty = parseFloat(item.qty) + 0.25;
            sql
              .updateqty(qty, tot, id, "", item)
              .then(res => { })
              .catch(res => {
                //
                //alert(JSON.stringify(res))
              });
            this.itemamount();
          } else {
            var qty = parseInt(item.qty) + 1;
            var tot = parseFloat(item.price) * qty;
            item.qty = parseInt(item.qty) + 1;
            sql
              .updateqty(qty, tot, id, "", item)
              .then(res => { })
              .catch(res => {
                //
                //alert(JSON.stringify(res))
              });
            this.count();
            this.itemamount();
          }
        }
      });
  }
  addPlusItem3(item) {
    sql.getItem1(item.sqlid).then(res => {
      // this.View1();
      // this.initviews1();
      // this.itemamount()
      if (item.wholecat == 2) {
        var qty = parseFloat(res.rows.item(0).qty) + 0.25;
        var prces = res.rows.item(0).addons_price.split(',');
        var prces1 = res.rows.item(0).variant_price.split(',');
        var prc1 = 0;
        var prc = 0;
        for (let i = 0; i < prces.length; i++) {
          if (prces[i]) {
            prc = prc + parseFloat(prces[i]);
          } else {
            prc = prc + 0;
          }
        }
        for (let i = 0; i < prces1.length; i++) {
          if (prces1[i]) {
            prc1 = prc1 + parseFloat(prces1[i]);
          } else {
            prc1 = prc1 + 0;
          }
        }
        var t = parseFloat(item.price) + parseFloat(prc) + parseFloat(prc1);
        var tot = parseFloat(t) * qty;
        item.qty = parseFloat(item.qty) + 0.5;
        sql
          .updateqty1(qty, tot, item.sqlid, "", item)
          .then(res => { })
          .catch(res => {
            //
            //alert(JSON.stringify(res))
          });
        this.count();
        this.itemamount();
        this.View();
        this.getid();
        this.View1();
      } else {
        // var qty = item.qty + 1
        console.log(res.rows.item(0))
        var qty = parseInt(res.rows.item(0).qty) + 1;
        var prces = res.rows.item(0).addons_price.split(',');
        var prces1 = res.rows.item(0).variant_price.split(',');
        var prc1 = 0;
        var prc = 0;
        for (let i = 0; i < prces.length; i++) {
          if (prces[i]) {
            prc = prc + parseFloat(prces[i]);
          } else {
            prc = prc + 0;
          }
        }
        for (let i = 0; i < prces1.length; i++) {
          if (prces1[i]) {
            prc1 = prc1 + parseFloat(prces1[i]);
          } else {
            prc1 = prc1 + 0;
          }
        }
        var t = parseFloat(item.price) + parseFloat(prc) + parseFloat(prc1);
        var tot = parseFloat(t) * qty;
        item.qty = parseInt(item.qty) + 1;
        console.log({ qty, tot, id: item.sqlid, remark: "", item: "item" });
        sql
          .updateqty1(qty, tot, item.sqlid, "", item)
          .then(res => { })
          .catch(res => {
            //
            //alert(JSON.stringify(res))
          });
        // this.count();
        // this.itemamount()
        // this.View();
        // this.getid();
        // this.View1();
        this.View1();
        this.initviews1();
        this.itemamount();
      }
    });
  }
  setshouldShowVisible(visible) {
    this.setState({ shouldShowVisible: visible });
  }
  setshouldShow(visible) {
    this.setState({ shouldShow: visible });
  }
  componentDidMount() {
    this.View();
    this.getid();
    this.View1();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.View();
      this.View1();
      this.setState({ d: [] });
      this.setState({ value: '' });
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  getid = async () => {
    try {
      const key3 = await AsyncStorage.getItem('branch_id');
      this.setState({ bid: key3 });
    } catch (error) { }
  };
  View = async () => {
    const key3 = await AsyncStorage.getItem('branch_id');
    this.setState({
      espstatus: (await AsyncStorage.getItem('espstatus')) == 'true',
    });
    fetch(`${LocalConfig.API_URL}admin/api/search.php?branch=` + key3)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          data: responseJson.sub_category,
        });
        this.initviews1();
        this.View1();
      });
  };
  View1() {
    sql
      .getAllItem()
      .then(results => {
        var temp = [];
        var carddet1 = [];
        var sum = 0;
        var data = results.rows.length;
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i)),
            (sum = parseFloat(sum) + parseFloat(results.rows.item(i).total)),
            carddet1.push({
              ItemId: results.rows.item(i).item_id,
              ItemName: results.rows.item(i).item_name,
              ItemQty: results.rows.item(i).qty,
              ItemAmt: results.rows.item(i).price,
              ItemTotalPrice: results.rows.item(i).total,
              size: results.rows.item(i).remarks,
            });
        this.setState({
          items1: temp,
          subtotal: sum,
          length: data,
          carddet: carddet1,
        });
        if (results.row.length``) {
        }
      })
      .catch(res => { });
  }
  initviews1() {
    this.state.data.map(element => {
      sql.getAllItem().then(res => {
        var ite = [];
        ite = res.rows;
        element.qty = 0;
        for (let i = 0; i < res.rows.length; i++) {
          if (element.id == res.rows.item(i).item_id) {
            element.sqlid = res.rows.item(i).id;
            element.qty =
              parseFloat(element.qty) + parseFloat(res.rows.item(i).qty);
          }
        }
      });
    });
  }
  count() {
    sql
      .getCount()
      .then(res => {
        if (res.rows.item().count) {
          this.state.item_count = res.rows.item().count;
        } else {
          this.state.item_count = 0;
        }
      })
      .catch(err => { });
  }
  addMinusItem(id, item) {
    sql.getcountitem(id).then(result => {
      if (result.rows.item(0).count > 1) {
        // this.showalert()
        alert(
          'The item has multiple customizations added. Proceed to cart to remove items.',
        );
      }
      // else {
      //   var qty = parseInt(item.qty) - 1;
      //   var tot = parseFloat(item.price) * qty;
      //   if (qty == 0) {
      //     sql.deleteitem(id).then((res) => { }).catch((res) => { alert(JSON.stringify(res)) })
      //     this.count();
      //   } else {
      //     sql.updateqty(qty, tot, id).then((res) => {
      //     }).catch((res) => {
      //       alert(JSON.stringify(res))
      //     })
      //   }
      //   item.qty = parseInt(item.qty) - 1;
      //   this.itemamount()
      // }
      else if (item.wholecat == 1) {
        var qty = parseInt(item.qty) - 1;
        this.setState({ qty: parseInt(item.qty) - 1 });
        var tot = parseFloat(item.price) * qty;
        if (qty == 0) {
          sql
            .deleteitem(id)
            .then(res => { })
            .catch(res => {
              alert(JSON.stringify(res));
            });
          this.itemamount();
        } else {
          sql
            .updateqty(qty, tot, id, "", item)
            .then(res => { })
            .catch(res => {
              //
              //  alert(JSON.stringify(res))
            });
        }
        item.qty = parseInt(item.qty) - 1;
        this.itemamount();
      } else {
        var qty = parseFloat(item.qty) - 0.25;
        this.setState({ qty: parseInt(item.qty) - 0.25 });
        var tot = parseFloat(item.price) * qty;
        if (qty == 0) {
          sql
            .deleteitem(id)
            .then(res => { })
            .catch(res => {
              alert(JSON.stringify(res));
            });
          this.itemamount();
        } else {
          sql
            .updateqty(qty, tot, id, "", item)
            .then(res => { })
            .catch(res => {
              //;sdsd
              //  alert(JSON.stringify(res))
            });
        }
        item.qty = parseFloat(item.qty) - 0.5;
        this.itemamount();
      }
    });
  }
  itemamount() {
    this.state.total = 0;
    sql.getAllItem().then(res => {
      for (let i = 0; i < res.rows.length; i++) {
        //this.total=parseFloat(this.total)+parseFloat(res.rows.item(i).total);
        var qty = res.rows.item(i).qty;
        //var remark=res.rows.item(i).remarks;
        var id = res.rows.item(i).id;
        var prces = res.rows.item(i).addons_price.split(',');
        var prces1 = res.rows.item(i).variant_price.split(',');
        var prc = 0;
        for (let i = 0; i < prces.length; i++) {
          if (prces[i]) {
            prc = prc + parseFloat(prces[i]);
          } else {
            prc = prc + 0;
          }
        }
        var prc1 = 0;
        for (let i = 0; i < prces1.length; i++) {
          if (prces1[i]) {
            prc1 = prc1 + parseFloat(prces1[i]);
          } else {
            prc1 = prc1 + 0;
          }
        }
        var t =
          parseFloat(res.rows.item(i).price) +
          parseFloat(prc) +
          parseFloat(prc1);
        var tot = parseFloat(qty) * parseFloat(t);
        this.state.total = parseFloat(this.state.total) + tot;
        sql
          .updateqty1(qty, tot, id, "", res.rows.item(i))
          .then(res => { })
          .catch(res => {
            alert(JSON.stringify(res));
          });
      }
    });
  }
  async deleteitems() {
    sql.deleteallrows().then(res => { });
  }
  check() {
    var temp = [];
    temp = this.state.itemname;
    temp.map(item => {
      if (this.state.check === true) {
        sql.getItem(item.menu_id).then(res => {
          if (res.rows.item(0).addons_id == null) {
            var wtot =
              parseFloat(res.rows.item(0).total) + parseFloat(item.price);
            sql
              .addaddons(
                item.id,
                item.item_name,
                item.price,
                wtot,
                item.menu_id,
              )
              .then(res => {
                this.totalcal(item.menu_id);
                this.updateite(item.menu_id);
              })
              .catch(err => {
                alert(JSON.stringify(err));
              });
          } else {
            var addid = res.rows.item(0).addons_id + ',' + item.id;
            var addname = res.rows.item(0).addonsName + ',' + item.item_name;
            var addprce = res.rows.item(0).addons_price + ',' + item.price;
            var tot =
              parseFloat(res.rows.item(0).total) + parseFloat(item.price);
            sql
              .addaddons(addid, addname, addprce, tot, item.menu_id)
              .then(res => {
                this.totalcal(item.menu_id);
                this.updateite(item.menu_id);
              })
              .catch(err => {
                alert(JSON.stringify(err));
              });
          }
        });
      } else {
        //this.maketoast(val.menu_id);
        sql
          .getItem(item.menu_id)
          .then(res => {
            // var ids=(res.rows.item(0).addons_id).split(",");
            var addid = this.removeitem(res.rows.item(0).addons_id, item.id);
            var addname = this.removeitem(
              res.rows.item(0).addonsName,
              item.item_name,
            );
            var addprice = this.removeitem(
              res.rows.item(0).addons_price,
              item.price,
            );
            var tot =
              parseFloat(res.rows.item(0).total) - parseFloat(item.price);
            sql
              .addaddons(addid, addname, addprice, tot, item.menu_id)
              .then(res => {
                this.totalcal(item.menu_id);
                this.updateite(item.menu_id);
              })
              .catch(err => {
                alert(JSON.stringify(err));
              });
          })
          .catch(err => { });
      }
    });
  }
  totalcal(menu_id) {
    sql
      .getItem(menu_id)
      .then(res => {
        //this.total=res.rows.item(0).total;
        var qty = res.rows.item(0).qty;
        var remark = res.rows.item(0).remarks;
        var id = res.rows.item(0).item_id;
        var prces = res.rows.item(0).addons_price.split(',');
        var prces1 = res.rows.item(0).variant_price.split(',');
        var prc1 = 0;
        var prc = 0;
        for (let i = 0; i < prces.length; i++) {
          if (prces[i]) {
            prc = prc + parseFloat(prces[i]);
          } else {
            prc = prc + 0;
          }
          //alert(prces[i]);
        }
        for (let i = 0; i < prces1.length; i++) {
          if (prces1[i]) {
            prc1 = prc1 + parseFloat(prces1[i]);
          } else {
            prc1 = prc1 + 0;
          }
        }
        var tot =
          parseFloat(qty) * parseFloat(res.rows.item(0).price) +
          parseFloat(prc) +
          parseFloat(prc1);
        this.state.total1 = tot;
        sql
          .updateqty(qty, tot, id, remark, res.rows.item(0))
          .then(res => { })
          .catch(res => {
            alert(JSON.stringify(res));
          });
      })
      .catch(res => {
        //alert(JSON.stringify(res))
      });
  }
  updateite(id) {
    sql.getItem(id).then(res => {
      if (res.rows.item(0).addonsName == null) {
        this.state.items12 = 'None';
      } else {
        this.state.items12 = res.rows.item(0).addonsName;
      }
      // this.View1()
    });
  }
  removeitem(arr, elem) {
    var ids = arr.split(',');
    // alert(arr);
    var res = [];
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] == elem) {
      } else {
        res.push(ids[i]);
      }
    }
    //alert(JSON.stringify(res))
    return res.join(',');
  }
  removeitem1(arr, elem) {
    var ids = arr.split(',');
    // alert(arr);
    var data = ids.indexOf(elem);
    var res = [];
    for (let i = 0; i < ids.length; i++) {
      if (i == data) {
      } else {
        res.push(ids[i]);
      }
    }
    //alert(JSON.stringify(res))
    return res.join(',');
  }
  changeEvent = (ev, index, item) => {
    var text = item.id;
    let tmp_solution = { ...this.state.checked1 };
    let temp = [];
    let temp1 = [];
    let temp2 = [];
    let temp3 = [];
    let temp4 = [];
    let temp5 = [];
    if (tmp_solution[item.id]) {
      tmp_solution[item.id] = false;
    } else {
      tmp_solution[item.id] = true;
    }
    if (tmp_solution[item.id] === true) {
      temp.push(item.id);
      temp2.push(item.item_name);
      temp3.push(item.price);

      if (this.state.temp_id.length == 0) {
        this.setState({ temp_id: temp });
        this.setState({ temp_name: temp2 });
        this.setState({ temp_price: temp3 });
        // this.state.itemname=temp
        // this.state.check=true
      } else {
        var string = this.state.temp_id.toString();
        var string1 = this.state.temp_name.toString();
        var string2 = this.state.temp_price.toString();
        temp1.push(string + ',' + item.id);
        temp4.push(string1 + ',' + item.item_name);
        temp5.push(string2 + ',' + item.price);
        this.setState({ temp_id: temp1 });
        this.setState({ temp_name: temp4 });
        this.setState({ temp_price: temp5 });
      }
    } else {
      //temp.push(item)
      // this.state.itemname=temp
      // this.state.check=false
      //  var temp2=[];
      var string = this.state.temp_id.toString();
      var string1 = this.state.temp_name.toString();
      var string2 = this.state.temp_price.toString();

      var ln = string.split(',');
      var ln1 = string1.split(',');
      var ln2 = string2.split(',');
      //var ln1=this.state.temp

      //   var res=[];
      //var newList = this.state.list.splice(index, 1);
      for (let i = 0; i < ln.length; i++) {
        if (ln[i] == item.id) {
          ln.splice(i, 1);
          ln1.splice(i, 1);
          ln2.splice(i, 1);

          // temp2.push(test)
          this.setState({ temp_id: ln });
          this.setState({ temp_name: ln1 });
          this.setState({ temp_price: ln2 });

          //     const index = ln.indexOf(ln[i]);

          // if (index !== -1) {
          //  var list= ln.splice(index, 1);

          //var newList = this.state.temp.splice(this.state.temp.indexOf(ln[i]), 0);
          //   this.setState({temp:newList})
        } else {
        }
      }
      //return res.join(",");;
    }
    // this.check();
    this.setState({ checked1: tmp_solution });
  };
  setModalVisible1 = visible => {
    this.setState({ modalVisible1: visible });
  };
  callingre() {
    this.setState({
      modalVisible1: true,
    });
  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.4,
          marginLeft: '5%',
          width: '90%',
          backgroundColor: '#d7d9d7',
        }}
      />
    );
  };
  onClickAddCart(data) {
    const itemcart = {
      food: data,
      quantity: 1,
      price: data.price,
    };
    AsyncStorage.getItem('CartScreen')
      .then(dataCartScreen => {
        if (dataCartScreen !== null) {
          // We have data!!
          const CartScreen = JSON.parse(dataCartScreen);
          CartScreen.push(itemcart);
          AsyncStorage.setItem('CartScreen', JSON.stringify(CartScreen));
        } else {
          const CartScreen = [];
          CartScreen.push(itemcart);
          AsyncStorage.setItem('CartScreen', JSON.stringify(CartScreen));
        }
        alert('Add Cart');
      })
      .catch(err => {
        alert(err);
      });
  }
  searchItems = text => {
    let newData = this.state.data.filter(item => {
      const itemData = `${item.menu_name.toUpperCase()}`;
      const textData = text.toUpperCase();
      if (text.length > 0) {
        return itemData.indexOf(textData) > -1;
      }
    });
    this.setState({
      d: newData,
      value: text,
    });
  };
  theme = {
    colors: {
      primary: LocalConfig.COLOR.UI_COLOR,
    },
  };
  changeEvent1 = item => {
    var text = item.id;
    let tmp_solution = { ...this.state.checked2 };
    let temp = [];
    let temp1 = [];
    let temp2 = [];
    let temp3 = [];
    let temp4 = [];
    let temp5 = [];
    if (tmp_solution[item.id]) {
      tmp_solution[item.id] = false;
    } else {
      tmp_solution[item.id] = true;
    }
    if (tmp_solution[item.id] === true) {
      temp.push(item.id);
      temp2.push(item.variant_name);
      temp3.push(item.price);

      if (this.state.variantid.length == 0) {
        this.setState({ variantid: temp });
        this.setState({ variantname: temp2 });
        this.setState({ variantprice: temp3 });
        // this.state.itemname=temp
        // this.state.check=true
      } else {
        var string = this.state.variantid.toString();
        var string1 = this.state.variantname.toString();
        var string2 = this.state.variantprice.toString();
        temp1.push(string + ',' + item.id);
        temp4.push(string1 + ',' + item.variant_name);
        temp5.push(string2 + ',' + item.price);
        this.setState({ variantid: temp1 });
        this.setState({ variantname: temp4 });
        this.setState({ variantprice: temp5 });
      }
    } else {
      //temp.push(item)
      // this.state.itemname=temp
      // this.state.check=false
      //  var temp2=[];
      var string = this.state.variantid.toString();
      var string1 = this.state.variantname.toString();
      var string2 = this.state.variantprice.toString();

      var ln = string.split(',');
      var ln1 = string1.split(',');
      var ln2 = string2.split(',');
      //var ln1=this.state.temp

      //   var res=[];
      //var newList = this.state.list.splice(index, 1);
      for (let i = 0; i < ln.length; i++) {
        if (ln[i] == item.id) {
          ln.splice(i, 1);
          ln1.splice(i, 1);
          ln2.splice(i, 1);

          // temp2.push(test)
          this.setState({ variantid: ln });
          this.setState({ variantname: ln1 });
          this.setState({ variantprice: ln2 });

          //     const index = ln.indexOf(ln[i]);

          // if (index !== -1) {
          //  var list= ln.splice(index, 1);

          //var newList = this.state.temp.splice(this.state.temp.indexOf(ln[i]), 0);
          //   this.setState({temp:newList})
        } else {
        }
      }
      //return res.join(",");;
    }
    // this.check();
    this.setState({ checked2: tmp_solution });
  };
  showMore = item => {
    var text = item.id;

    let tmp_solution = { ...this.state.showMore };
    let temp = [];
    if (tmp_solution[item.id]) {
      tmp_solution[item.id] = false;
    } else {
      tmp_solution[item.id] = true;
    }
    // this.check();
    this.setState({ showMore: tmp_solution });
  };
  radio(index, data) {
    this.state.radioid[index] = data.id;
    this.state.radioname[index] = data.variant_name;
    this.state.radioprice[index] = data.price;
    this.setState({ modalVisible1: true });
  }
  renderHeader = () => {
    return (
      <Searchbar
        style={{
          marginTop: '5%',
          margin: '5%',
          fontFamily: 'verdanab',
          backgroundColor: LocalConfig.COLOR.UI_COLOR,
          shadowColor: LocalConfig.COLOR.WHITE,
          color: LocalConfig.COLOR.WHITE,
        }}
        selectionColor={LocalConfig.COLOR.BLACK}
        placeholder="Search"
        placeholderTextColor={LocalConfig.COLOR.BLACK_LIGHT}
        iconColor={LocalConfig.COLOR.BLACK}
        theme={this.theme}
        onChangeText={text => this.searchItems(text)}
        value={this.state.value}
      />
    );
  };
  render() {
    const { entity } = this.props;
    const { modalVisible1 } = this.state;
    const reducer = (previousValue, currentValue) =>
      parseInt(previousValue) + parseInt(currentValue);
    var string2 = this.state.temp_price.toString();
    const temp = string2.split(',');
    var price = temp.reduce(reducer);
    //var t=(this.state.temp_name).toString();
    var s = this.state.variantname.toString();
    var name = this.state.temp_name.toString();
    if (string2.length > 0) {
      price = price;
    } else {
      price = 0;
    }
    //const price1=0
    var varprc = this.state.variantprice.toString();
    const temp12 = varprc.split(',');
    var price1 = temp12.reduce(reducer);
    if (varprc.length > 0) {
      price1 = price1;
    } else {
      price1 = 0;
    }
    var radprc = this.state.radioprice.toString();
    const temp13 = radprc.split(',');
    var price2 = temp13.reduce(reducer);
    if (radprc.length > 0) {
      price2 = price2;
    } else {
      price2 = 0;
    }
    return (
      <View
        style={{
          flex: 1,
          padding: 2,
          width: '100%',
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: LocalConfig.COLOR.BLACK,
        }}>
        <FlatList
          data={this.state.d}
          renderItem={({ item, i }) => (
            <View key={i} style={styles.item1}>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.item3}>
                  {item.food_type == 1 ? (
                    <IconBadge
                      MainElement={
                        <Icon
                          name="square-outline"
                          style={{ marginLeft: '10%' }}
                          color="#006400"
                          size={20}
                        />
                      }
                      BadgeElement={
                        <Icon
                          name="ellipse-sharp"
                          style={{ marginLeft: '0%', marginTop: '-12%' }}
                          color="#006400"
                          size={10}
                        />
                      }
                      IconBadgeStyle={{
                        width: 20,
                        height: 30,
                        marginRight: '74.9%',
                        marginTop: '-1%',
                        backgroundColor: 'transparent',
                      }}
                    //  Hidden={number==0}
                    />
                  ) : item.food_type == 2 ? (
                    <IconBadge
                      MainElement={
                        <Icon
                          name="square-outline"
                          style={{ marginLeft: '10%' }}
                          color={LocalConfig.COLOR.UI_COLOR_LITE}
                          size={20}
                        />
                      }
                      BadgeElement={
                        <Icon
                          name="ellipse-sharp"
                          style={{ marginLeft: '0%', marginTop: '-12%' }}
                          color={LocalConfig.COLOR.UI_COLOR_LITE}
                          size={10}
                        />
                      }
                      IconBadgeStyle={{
                        width: 20,
                        height: 30,
                        marginRight: '74.9%',
                        marginTop: '-1%',
                        backgroundColor: 'transparent',
                      }}
                    //  Hidden={number==0}
                    />
                  ) : (
                    <Image
                      source={{ uri: 'https://www.w3.org/2000/svg' }}
                      style={styles.itemPhoto2}
                      resizeMode="cover"
                    />
                  )}
                  <Text style={styles.itemText1}>{item.menu_name}</Text>
                  <Text style={styles.itemText2}>
                    {!this.state.espstatus && `\u20B9 ${item.price}`}
                  </Text>
                  {item.description.length > 50 ? (
                    this.state.showMore[item.id] ? (
                      <TouchableOpacity onPress={() => this.showMore(item)}>
                        <Text style={styles.itemText3}>
                          {item.description}
                          <Text style={{ color: LocalConfig.COLOR.WHITE, fontSize: 12 }}>
                            {' '}
                            .Show less
                          </Text>
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => this.showMore(item)}>
                        <Text style={styles.itemText3}>
                          {`${item.description.slice(0, 50)}... `}
                          <Text style={{ color: LocalConfig.COLOR.WHITE }}>Show more</Text>
                        </Text>
                      </TouchableOpacity>
                    )
                  ) : (
                    <Text style={styles.itemText3}>{item.description}</Text>
                  )}
                </View>
                {item.menu_image.length > 0 && (
                  <View style={styles.item}>
                    {item.status == 0 ? (
                      <Grayscale>
                        <Image
                          source={{
                            uri: BASE_URL + item.menu_image,
                          }}
                          style={{
                            width: 120,
                            height: 80,
                            borderRadius: 5,
                            marginTop: 2,
                            marginLeft: 2,
                          }}
                          resizeMode="cover"
                        />
                      </Grayscale>
                    ) : (
                      <Image
                        source={{
                          uri: BASE_URL + item.menu_image,
                        }}
                        style={{
                          width: '88%',
                          height: 105,
                          borderRadius: 5,
                          marginTop: '2%',
                        }}
                        resizeMode="cover"
                      />
                    )}
                    <View
                      style={{
                        marginTop: '-10%',
                        marginLeft: '13%',
                        backgroundColor: LocalConfig.COLOR.UI_COLOR,
                        width: 90,
                        borderRadius: 3,
                        shadowColor: LocalConfig.COLOR.WHITE,
                        elevation: 3,
                        marginBottom: '0%',
                      }}>
                      {item.status == 0 ? (
                        item.timing_state == 0 ? (
                          <Button
                            title="Add"
                            name="ios-add-circle"
                            color="#ffffff"
                            style={{ height: 35, marginTop: '-8%' }}>
                            {' '}
                            <Text
                              style={{
                                color: LocalConfig.COLOR.BLACK,
                                marginTop: '0%',
                                fontSize: 12,
                                fontFamily: 'Proxima Nova Bold',
                              }}>
                              sold
                            </Text>
                          </Button>
                        ) : (
                          <TouchableOpacity>
                            <Text
                              style={{
                                color: LocalConfig.COLOR.BLACK,
                                marginLeft: '8%',
                                fontSize: 11,
                                fontFamily: 'Proxima Nova Bold',
                                marginBottom: '4%',
                                textAlign: 'center'
                              }}>
                              Next available at {item.start}
                            </Text>
                          </TouchableOpacity>
                        )
                      ) : (
                        item.qty == 0 && (
                          <TouchableOpacity
                            onPress={() => {
                              this.addItem(item.id, item);
                              this.refreshScreen();
                            }}>
                            <Text
                              style={{
                                color: LocalConfig.COLOR.BLACK,
                                marginTop: '7%',
                                marginBottom: '7%',
                                marginLeft: '35%',
                                fontSize: 12,
                                fontFamily: 'Proxima Nova Bold',
                              }}>
                              ADD
                            </Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: '0%',
                        marginLeft: '13%',
                        backgroundColor: LocalConfig.COLOR.UI_COLOR,
                        width: 90,
                        borderRadius: 3,
                        shadowColor: LocalConfig.COLOR.WHITE,
                        elevation: 3,
                        marginBottom: '3%',
                      }}>
                      {item.qty > 0 && (
                        <TouchableOpacity
                          style={{ marginLeft: '5%' }}
                          onPress={() => {
                            this.addMinusItem(item.id, item);
                            this.refreshScreen(false);
                          }}>
                          <MaterialIcons
                            style={{ marginTop: '10%', marginRight: '2%' }}
                            name="remove"
                            size={20}
                            color={LocalConfig.COLOR.BLACK}
                          />
                        </TouchableOpacity>
                      )}
                      {item.qty > 0 && (
                        <Text
                          style={{
                            color: LocalConfig.COLOR.BLACK,
                            fontSize: 15,
                            marginTop: '5%',
                            marginLeft: '15%',
                            fontFamily: 'Proxima Nova Bold',
                            width: '24%',
                          }}>
                          {item.qty}
                        </Text>
                      )}
                      {item.qty > 0 && (
                        <TouchableOpacity
                          onPress={() => {
                            this.addPlusItem(item.id, item);
                            this.refreshScreen(false);
                          }}>
                          <MaterialIcons
                            style={{
                              marginTop: '8%',
                              marginRight: '10%',
                              marginBottom: '16%',
                            }}
                            name="add"
                            size={20}
                            color={LocalConfig.COLOR.BLACK}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    {item.ingrecount > 0 && <Text style={{ color: LocalConfig.COLOR.UI_COLOR, textAlign: 'center' }}>Customized</Text>}
                  </View>
                )}
                {item.menu_image.length == 0 && (
                  <View>
                    <View
                      style={{
                        marginTop: '20%',
                        marginLeft: '18%',
                        backgroundColor: LocalConfig.COLOR.UI_COLOR,
                        width: 90,
                        borderRadius: 3,
                        shadowColor: LocalConfig.COLOR.WHITE,
                        elevation: 3,
                      }}>
                      {item.status == 0 ? (
                        item.timing_state == 0 ? (
                          <TouchableOpacity>
                            <Text
                              style={{
                                color: LocalConfig.COLOR.BLACK,
                                marginTop: '7%',
                                marginBottom: '7%',
                                marginLeft: '30%',
                                fontSize: 12,
                                fontFamily: 'Proxima Nova Bold',
                              }}>
                              SOLD
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity>
                            <Text
                              style={{
                                color: LocalConfig.COLOR.BLACK,
                                marginLeft: '8%',
                                fontSize: 11,
                                fontFamily: 'Proxima Nova Bold',
                                marginBottom: '4%',
                              }}>
                              Next available at {item.start}
                            </Text>
                          </TouchableOpacity>
                        )
                      ) : (
                        item.qty == 0 && (
                          <TouchableOpacity
                            onPress={() => {
                              this.addItem(item.id, item);
                              this.refreshScreen();
                            }}>
                            <Text
                              style={{
                                color: LocalConfig.COLOR.BLACK,
                                marginTop: '7%',
                                marginBottom: '7%',
                                marginLeft: '35%',
                                fontSize: 12,
                                fontFamily: 'Proxima Nova Bold',
                              }}>
                              ADD
                            </Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                    {item.status == 1 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: '0%',
                          marginLeft: '18%',
                          backgroundColor: LocalConfig.COLOR.BLACK,
                          width: 90,
                          borderRadius: 3,
                          shadowColor: LocalConfig.COLOR.WHITE,
                          elevation: 3,
                          marginBottom: '0%',
                        }}>
                        {item.qty > 0 && (
                          <TouchableOpacity
                            style={{ marginLeft: '5%' }}
                            onPress={() => {
                              this.addMinusItem(item.id, item);
                              this.refreshScreen(false);
                            }}>
                            <MaterialIcons
                              style={{ marginTop: '10%', marginRight: '2%' }}
                              name="remove"
                              size={20}
                              color={LocalConfig.COLOR.UI_COLOR}
                            />
                          </TouchableOpacity>
                        )}
                        {item.qty > 0 && (
                          <Text
                            style={{
                              color: LocalConfig.COLOR.UI_COLOR,
                              fontSize: 15,
                              marginTop: '5%',
                              marginLeft: '15%',
                              fontFamily: 'Proxima Nova Bold',
                              width: '24%',
                            }}>
                            {item.qty}
                          </Text>
                        )}
                        {item.qty > 0 && (
                          <TouchableOpacity
                            onPress={() => {
                              this.addPlusItem(item.id, item);
                              this.refreshScreen(false);
                            }}>
                            <MaterialIcons
                              style={{
                                marginTop: '8%',
                                marginRight: '10%',
                                marginBottom: '16%',
                              }}
                              name="add"
                              size={20}
                              color={LocalConfig.COLOR.UI_COLOR}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          )}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
        <Modal
          style={{
            width: '100%',
            marginLeft: '0%',
            marginBottom: '0%',
            marginTop: '0%',
          }}
          animationType="slide"
          transparent={true}
          key={this.state.id}
          visible={modalVisible1}
          onBackdropPress={() => {
            this.setModalVisible1(!modalVisible1);
            this.setState({
              checked1: [],
              temp_id: [],
              temp_name: [],
              temp_price: [],
              mo: 0,
              checked2: [],
              radioid: [],
              radioprice: [],
              variantid: [],
              variant_name: [],
              variant_price: [],
              radioname: [],
            });
          }}>
          <BlurView
            style={styles.absolute}
            blurType="dark"
            blurAmount={6}
            reducedTransparencyFallbackColor="white"
          />
          <View
            style={{
              //  height: '98%',
              marginTop: 'auto',
              backgroundColor: LocalConfig.COLOR.BLACK,
              borderRadius: 20,
            }}>
            <View style={{ flexDirection: 'column' }}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: LocalConfig.COLOR.UI_COLOR,
                  marginBottom: '2%',
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                }}>
                <View style={{ width: '90%' }}>
                  <Text
                    style={{
                      color: LocalConfig.COLOR.BLACK,
                      fontSize: 14,
                      fontFamily: 'verdanab',
                      marginLeft: '25%',
                      textTransform: 'capitalize',
                      padding: '5%',
                      letterSpacing: 0.3,
                    }}>
                    {this.state.addonitem.menu_name}{' '}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.setModalVisible1(!modalVisible1);
                    this.setState({
                      checked1: [],
                      temp_id: [],
                      temp_name: [],
                      temp_price: [],
                      mo: 0,
                      checked2: [],
                      radioid: [],
                      radioprice: [],
                      variantid: [],
                      variant_name: [],
                      variant_price: [],
                      radioname: [],
                    });
                  }}>
                  <View
                    style={{
                      color: '#2b2d42',
                      fontSize: 15,
                      marginTop: '20%',
                    }}>
                    <MaterialIcons name="close" size={25} color={LocalConfig.COLOR.BLACK} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                borderBottomColor: '#dee2e6',
                borderBottomWidth: 0.5,
                marginTop: '-2%',
                marginBottom: '3%',
              }}
            />
            <ScrollView>
              {this.state.addon.map((item, index) => (
                <View key={index}>
                  <View flexDirection="row" marginLeft="5%">
                    <CheckBox
                      value={this.state.checked1[item.id]}
                      onValueChange={ev => this.changeEvent(ev, index, item)}
                      key={index}
                      tintColors={{
                        true: LocalConfig.COLOR.UI_COLOR,
                        false: LocalConfig.COLOR.UI_COLOR,
                      }}
                    />
                    <View flexDirection="row">
                      <Text
                        style={{
                          marginTop: '3%',
                          fontFamily: 'Proxima Nova Font',
                          width: '60%',
                          marginLeft: '5%',
                          color: LocalConfig.COLOR.WHITE,
                        }}>
                        {item.item_name} {item.price != "0" ? `\u20B9${item.price}` : null}
                      </Text>
                      {item.price == '0' && (
                        <Text
                          style={{
                            marginTop: '3%',
                            fontFamily: 'Proxima Nova Font',
                            marginLeft: '10%',
                            color: LocalConfig.COLOR.WHITE,
                          }}></Text>
                      )}
                      {item.price !== '0' && (
                        <Text
                          style={{
                            marginTop: '3%',
                            fontFamily: 'Proxima Nova Font',
                            marginLeft: '10%',
                            color: LocalConfig.COLOR.WHITE,
                          }}></Text>
                      )}
                    </View>
                  </View>
                  <View
                    style={{
                      borderBottomColor: '#e6e6e6',
                      borderBottomWidth: 0.6,
                      marginTop: '1%',
                    }}
                  />
                </View>
              ))}
              {this.state.variant.map((item1, index) => (
                <View key={index}>
                  <Text
                    style={{
                      color: LocalConfig.COLOR.WHITE,
                      fontSize: 14,
                      fontFamily: 'verdanab',
                      marginLeft: '6%',
                      textTransform: 'capitalize',
                    }}>
                    {item1.heading}
                  </Text>
                  {item1.data.map(data => (
                    <View key={data.id}>
                      {item1.status == 0 ? (
                        <View flexDirection="row" marginLeft="5%">
                          <CheckBox
                            value={this.state.checked2[data.id]}
                            onValueChange={ev => this.changeEvent1(data)}
                            key={index}
                            tintColors={{
                              true: LocalConfig.COLOR.UI_COLOR,
                              false: LocalConfig.COLOR.UI_COLOR,
                            }}
                          />
                          <TouchableOpacity
                            onPress={ev => this.changeEvent1(data)}
                          >
                            <View flexDirection="row">
                              <Text
                                style={{
                                  marginTop: '3%',
                                  fontFamily: 'Proxima Nova Font',
                                  width: '60%',
                                  marginLeft: '5%',
                                  color: LocalConfig.COLOR.WHITE,
                                }}>
                                {data.variant_name} {data.price != "0" && `\u20B9${data.price}`}
                              </Text>
                              {data.price == '0' && (
                                <Text
                                  style={{
                                    marginTop: '3%',
                                    fontFamily: 'Proxima Nova Font',
                                    marginLeft: '10%',
                                    color: LocalConfig.COLOR.WHITE,
                                  }}></Text>
                              )}
                              {data.price !== '0' && (
                                <Text
                                  style={{
                                    marginTop: '3%',
                                    fontFamily: 'Proxima Nova Font',
                                    marginLeft: '10%',
                                    color: LocalConfig.COLOR.WHITE,
                                  }}></Text>
                              )}
                            </View>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <RadioButton.Group
                          onValueChange={() => this.radio(index, data)}
                          value={this.state.radioid[index]}>
                          <RadioButton.Item
                            label={data.variant_name}
                            label1={data.price}
                            value={data.id}
                            uncheckedColor={LocalConfig.COLOR.UI_COLOR}
                            color={LocalConfig.COLOR.UI_COLOR}
                            labelStyle={{
                              fontSize: 14.5,
                              fontFamily: 'Proxima Nova Font',
                              color: LocalConfig.COLOR.WHITE,
                            }}
                          />
                        </RadioButton.Group>
                      )}
                      <View
                        style={{
                          borderBottomColor: '#e6e6e6',
                          borderBottomWidth: 0.6,
                          marginTop: '1%',
                        }}
                      />
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
            <View
              style={{
                left: 0,
                width: '100%',
              }}>
              <View
                style={{
                  borderBottomColor: '#cccccc',
                  marginTop: '2%',
                  width: '100%',
                }}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: LocalConfig.COLOR.UI_COLOR,
                  width: '100%',
                  borderRadius: 0,
                }}
                onPress={() => this.addItem2(this.state.addonitem)}>
                <View flexDirection="row" style={{ marginTop: '2.5%' }}>
                  <Text
                    style={{
                      color: LocalConfig.COLOR.BLACK,
                      width: '70%',
                      marginLeft: '5%',
                      fontFamily: 'Proxima Nova Bold',
                    }}>
                    Item total{' '}
                    {parseFloat(this.state.addonitem.price) +
                      parseFloat(price) +
                      parseFloat(price1) +
                      parseFloat(price2)}
                  </Text>
                  <Text
                    style={{
                      color: LocalConfig.COLOR.BLACK,
                      alignSelf: 'flex-end',
                      fontFamily: 'Proxima Nova Bold',
                      marginBottom: '2.5%',
                    }}>
                    ADD ITEM
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          style={{ width: '100%', marginLeft: '0%', marginBottom: '-1%' }}
          animationType="slide"
          transparent={true}
          visible={this.state.modal1}
          onBackdropPress={() => this.setState({ modal1: false })}>
          <BlurView
            style={styles.absolute}
            blurType="dark"
            blurAmount={6}
            reducedTransparencyFallbackColor="white"
          />
          <View
            style={{
              height: '27%',
              marginTop: 'auto',
              backgroundColor: LocalConfig.COLOR.BLACK,
              borderRadius: 20,
            }}>
            <View style={{ flexDirection: 'column' }}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: LocalConfig.COLOR.UI_COLOR,
                  marginBottom: '2%',
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                }}>
                <View style={{ width: '90%' }}>
                  <Text
                    style={{
                      color: LocalConfig.COLOR.BLACK,
                      fontSize: 14,
                      fontFamily: 'verdanab',
                      textTransform: 'capitalize',
                      padding: '5%',
                      letterSpacing: 0.3,
                    }}>
                    {this.state.addonitem.menu_name}{' '}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ modal1: false });
                  }}>
                  <View
                    style={{
                      color: '#2b2d42',
                      fontSize: 15,
                      marginTop: '20%',
                    }}>
                    <MaterialIcons name="close" size={25} color={LocalConfig.COLOR.BLACK} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                borderBottomColor: '#dee2e6',
                borderBottomWidth: 0.5,
                marginTop: '-2%',
                marginBottom: '3%',
              }}
            />
            <Text
              style={{
                color: LocalConfig.COLOR.WHITE,
                fontFamily: 'ProximaBold',
                marginLeft: '3%',
                marginTop: '3%',
                fontSize: 15,
              }}>
              Your Previous Customization
            </Text>
            <Text
              style={{
                color: '#808080',
                fontFamily: 'Proxima Nova Font',
                marginLeft: '3%',
                marginTop: '1%',
                fontSize: 13,
                textTransform: 'capitalize',
              }}>
              curried farfalle Pasta, Mushroom delitto -Personal Pizza
            </Text>
            <View flexDirection="row">
              <Button
                style={{
                  marginTop: '5%',
                  marginLeft: '3%',
                  width: '45%',
                  marginRight: '5%',
                  elevation: 0,
                }}
                mode="outlined"
                color={LocalConfig.COLOR.UI_COLOR}
                onPress={() => {
                  this.setState({ modalVisible1: true, modal1: false });
                }}>
                <Text
                  style={{
                    color: LocalConfig.COLOR.UI_COLOR,
                    fontSize: 13,
                    fontFamily: 'verdanab',
                  }}>
                  I'LL CHOOSE
                </Text>
              </Button>
              <Button
                style={{
                  marginTop: '5%',
                  width: '45%',
                  marginRight: '5%',
                  elevation: 0,
                }}
                mode="contained"
                color={LocalConfig.COLOR.UI_COLOR}
                onPress={() => {
                  console.log(this.state.addonitem)
                  this.addPlusItem3(this.state.addonitem);
                  this.setState({ modal1: false });
                }}>
                <Text
                  style={{ color: LocalConfig.COLOR.BLACK, fontSize: 13, fontFamily: 'verdanab' }}>
                  REPEAT
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
        {this.state.length > 0 && (
          <TouchableOpacity
            style={{
              paddingVertical: '4%',
              marginLeft: '-2%',
              backgroundColor: LocalConfig.COLOR.UI_COLOR,
              justifyContent: 'space-around',
              width: '103%',
              top: 2,
              flexDirection: 'row',
            }}
            onPress={() => this.props.navigation.navigate('CartScreen')}>
            <Text style={{ color: LocalConfig.COLOR.BLACK, fontFamily: 'verdanab' }}>
              {!this.state.espstatus &&
                `Total Items : ${this.state.length} |${'\u20B9'} ${this.state.subtotal
                }`}
            </Text>
            <Text style={{ color: LocalConfig.COLOR.BLACK, fontFamily: 'verdanab' }}>
              View Cart
            </Text>
            {/* <Icon name="ios-cart-sharp" style={{marginLeft:'87%',marginTop:'-5%'}}  color= '#ffffff' size={15}  /> */}
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
export default SearchScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  item4: {
    width: '70%',
    // is 50% of container width
  },
  textStyle: {
    margin: '5%',
    fontSize: 15,
    fontWeight: 'normal',
    textAlign: 'center',
    color: '#38b000',
  },
  separator: {
    height: 20,
  },
  container1: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  itemPhoto3: {
    width: '94%',
    height: 240,
    marginLeft: '3%',
    marginRight: '3%',
    marginTop: '3%',
    borderRadius: 3,
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#2b2d42',
    marginTop: '4%',
    marginLeft: '4%',
  },
  item: {
    marginLeft: '3%',
    marginBottom: '2%',
  },
  itemPhoto: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginTop: 5,
  },
  itemPhoto1: {
    width: '88%',
    height: 105,
    borderRadius: 5,
    marginTop: '2%',
  },
  itemPhoto2: {
    width: '10%',
    height: 15,
    marginTop: '3%',
    marginLeft: '10%',
    marginBottom: '2%',
  },
  item1: {},
  itemText: {
    color: LocalConfig.COLOR.BLACK,
    marginTop: 5,
    textAlign: 'center',
    fontSize: 12,
    width: '60%',
    left: '10%',
    fontFamily: 'Proxima Nova Font',
  },
  itemText1: {
    textTransform: 'capitalize',
    color: LocalConfig.COLOR.WHITE,
    fontFamily: 'Proxima Nova Bold',
    marginLeft: '10%',
    fontSize: 15,
  },
  itemText2: {
    color: '#696969',
    marginTop: '2%',
    marginBottom: '3%',
    marginLeft: '10%',
    fontFamily: 'Proxima Nova Font',
  },
  itemText3: {
    fontFamily: 'Proxima Nova Font',
    color: '#bcbcbc',
    marginTop: '1%',
    marginLeft: '10%',
    fontSize: 12,
    fontSize: 12,
    marginBottom: '3%',
    fontFamily: 'Proxima Nova Font',
  },
  item3: {
    width: '61%', // is 50% of container width
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start', // if you want to fill rows left to right
  },
});
