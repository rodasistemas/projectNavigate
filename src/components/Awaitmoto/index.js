import React, { Component } from "react";

import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import loading from "../../assets/loading.gif";

export default class Awaitmoto extends Component {
  render() {
      const {handlerCancelBtn} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.textInfo}>Buscando Moto</Text>
        <View style={styles.loading}>
          <Image style={styles.loadingImage} source={loading} />
        </View>
        <TouchableOpacity 
            style={styles.button}
            onPress={handlerCancelBtn}
            >
            <Text style={styles.btnText}>
                CANCELAR A CORRIDA
            </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignContent: "center",
    alignItems: "center",
    top: 0,
    left: 0,
    zIndex: 100
  },
  textInfo: {
    fontSize: 20,
    color: "#ffffff",
    textAlign: "center"
  },
  loading: {
    width: 160,
    height: 160,
    overlayColor: "transparent",
    borderRadius: 80,
    borderWidth: 2,
    borderColor: '#FFF',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor:'#FFF',
  
  },
  loadingImage:{
    width:100,
    height:100,
    marginTop:30,
  },
  button:{
    backgroundColor: '#220000',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    alignSelf: 'stretch',
    marginTop: 10, 
  },
  btnText:{
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  }
});
