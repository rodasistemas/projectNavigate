import React, { Component, Fragment } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import loading from "../../assets/loading.gif";
import call from "react-native-phone-call";
import api from "../../services/api";

export default class Awaymoto extends Component {
  constructor(props){
    super(props);
    this.state = {
      produto: null,
    }
    
  }
  async componentDidMount(){
    //console.log('Teste de Props', this.props.product);
    const produto = await api.post('products/getproduct',{dados:{id:this.props.product}}).then((resposta)=>{
      this.setState({produto: resposta.data});
    });
  }
  callBtn(data) {
    const args = {
      number: data[0].phone, // String value with the number to call
      prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call
    };
    console.log("Liga pro Piloto", data);
    call(args).catch(console.error);
  }
  formatMoney = (number, decPlaces, decSep, thouSep) => {
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
    decSep = typeof decSep === "undefined" ? "." : decSep;
    thouSep = typeof thouSep === "undefined" ? "," : thouSep;
    var sign = number < 0 ? "-" : "";
    var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
    var j = (j = i.length) > 3 ? j % 3 : 0;
    
    return sign +
      (j ? i.substr(0, j) + thouSep : "") +
      i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
      (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
    }
  render() {
    const { handlerCancelBtn, motoChegou, handlerCallBtn, product } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.boxFooter}>
          {motoChegou ? (
            <Fragment>
              <Text style={styles.textInfo}>Sua moto chegou!</Text>
              {this.state.produto && (<Text>Valor à pagar: R$ {this.formatMoney(this.state.produto.value,2,',','.')}</Text>)}
              <Image style={styles.loading} source={loading} />
              <View style={styles.buttonContainer}>
              <TouchableOpacity
                  style={styles.buttonCall2}
                  onPress={() => {
                    
                  }}
                >
                  <Icon name={"ios-checkmark-circle"} size={64} color={"#28a708"} />
                  <Text style={styles.textButton}>Iniciar a Corrida</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonCall2}
                  onPress={() => {
                    
                  }}
                >
                  <Icon name={"ios-close-circle"} size={64} color={"#7b091e"} />
                  <Text style={styles.textButton}>Cancelar a Corrida</Text>
                </TouchableOpacity>
              </View>
              
            </Fragment>
          ) : (
            <Fragment>
              <Text style={styles.textInfo}>Moto está à Caminho</Text>
              {this.state.produto && (<Text>Valor à pagar: R$ {this.formatMoney(this.state.produto.value,2,',','.')}</Text>)}
              
              <Image style={styles.loading} source={loading} />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.buttonCall}
                  onPress={() => {
                    this.callBtn(handlerCallBtn);
                  }}
                >
                  <Icon name={"ios-call"} size={64} color={"#7b091e"} />
                  <Text style={styles.textButton}>Ligar para o Piloto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonCall} onPress={() => {}}>
                  <Icon name={"ios-chatboxes"} size={64} color={"#7b091e"} />
                  <Text style={styles.textButton}>Enviar Mensagem</Text>
                </TouchableOpacity>
              </View>
            </Fragment>
          )}
        </View>
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
    backgroundColor: "rgba(0,0,0,0)",
    alignContent: "center",
    alignItems: "center",
    top: 0,
    left: 0,
    zIndex: 100
  },
  textInfo: {
    fontSize: 20,
    color: "#000",
    textAlign: "center"
  },
  loading: {
    width: 100,
    height: 100,
    overlayColor: "transparent",
    borderRadius: 50,
    borderWidth: 1
  },
  buttonContainer: {
    backgroundColor: "#FFF",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { x: 0, y: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#DDD",
    alignItems: "center",
    alignContent: "center",
    padding: 20,
    flexDirection: "row"
  },
  button: {
    backgroundColor: "#220000",
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    alignSelf: "stretch",
    marginTop: 10
  },
  buttonCall: {
    width: "45%",
    height: 100,
    shadowColor: "#000",
    shadowOffset: { x: 0, y: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#DDD",
    alignItems: "center",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFF",
    margin: 10,
    padding:10
  },
  buttonCall2: {
    width: "45%",
    height: 100,
    shadowColor: "#000",
    shadowOffset: { x: 0, y: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#DDD",
    alignItems: "center",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFF",
    margin: 10,
    padding:10
  },
  textButton: {
    fontSize: 14,
    color: "#000",
    textShadowColor: "rgba(255,255,255,0.5)",
    elevation: 2
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18
  },
  boxFooter: {
    position: "absolute",
    alignContent: "center",
    alignItems: "center",
    height: 300,
    bottom: 0,
    backgroundColor: "#FFF",
    width: "100%",
    zIndex: 10000000
  }
});
