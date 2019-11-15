import React, { Component } from "react";

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default class MarkPointer extends Component {
  render() {
    const { onHandleAlert, onHideAlert } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.containerAlert}>
          <Text style={styles.textStyleBlack}>Deseja marcar o destino aqui?</Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={styles.btn} onPress={onHandleAlert}>
            <Text style={styles.textStyle}>Marcar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onHideAlert} style={styles.btnCancel}>
              <Text style={styles.textStyle}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.8)"
  },
  containerAlert: {
    width: 260,
    height: 100,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 10
  },
  btn: {
    flexDirection: "column",
    
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 2,
    backgroundColor: "#202646",
    borderRadius: 3,
    width: "50%",
    elevation: 3,
    
  },
  btnCancel: {
    flexDirection: "column",
    
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 2,
    backgroundColor: "#FF0000",
    borderRadius: 3,
    width: "50%",
    elevation: 3,
    
  },
  textStyleBlack: {
    fontSize: 20,
    color: "#000",
    textAlign: "center"
  },
  textStyle: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center"
  },

  buttonStyle: {
    padding: 10,
    backgroundColor: "#202646",
    borderRadius: 5
  }
});
