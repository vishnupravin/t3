import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, TextInput, Dimensions } from 'react-native';
import { Button, IconButton, Colors } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
function Item({ item, props }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.listItem}>
        <View style={{ alignItems: 'baseline', flex: 1, marginBottom: '1.5%', padding: '2%' }}>
          <View flexDirection='row'>
            <Text style={{ fontWeight: "bold", color: '#414d59', fontSize: 15, }}>No of items:{`${item.assigned_to}`}</Text>
            <Text style={{ fontWeight: "bold", color: '#414d59', fontSize: 15, marginLeft: '30%' }}>OrderNo:{`${item.assigned_to}`}</Text>
          </View>
          <Text style={{ fontWeight: "bold", color: '#414d59', fontSize: 15 }}>Date:{item.created_date}</Text>
          {/* item.created_date */}
          <Text style={{ fontWeight: "bold", color: '#414d59', fontSize: 15 }}>Order Amount:Rs.{`${item.longitude}`}</Text>
          <View flexDirection='row'>
            <Text style={{ fontWeight: "bold", color: '#414d59', fontSize: 15 }}>Order Status:Payment Failed</Text>
            <Button icon="close" color={Colors.red500} style={{ marginLeft: '20%', }} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
export default class History extends React.Component {
  state = {
    loading: false,
    data: [],
    page: 1,
    seed: 1,
    error: null,
    query: '',
    fullData: []
  }
  componentDidMount() {
    this.makeRemoteRequest()
  }
  makeRemoteRequest = async () => {
    const user = await AsyncStorage.getItem('userid')
    const { page } = this.state
    const url = `https://falconsquare.in/danam2/index.php/Api/lead/152`
    this.setState({ loading: true })
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          fullData: res.results
        })
      })
      .catch(error => {
        this.setState({ error, loading: false })
      })
  }
  contains = ({ company_name }, query) => {
    if (
      company_name.includes(query)
    ) {
      return true
    }
    return false
  }
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={{ flex: 1 }}
          data={this.state.data}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}
const theme = {
  colors: {
    primary: '#284b63',
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  listItem: {
    margin: '1%',
    padding: '2.5%',
    backgroundColor: '#ffff',
    width: "90%",
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#f2f2f2',
    shadowColor: '#f4f4f4',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.41,
    elevation: 5,
  },
});