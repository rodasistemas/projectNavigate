/*
// Componente Mapa Passageiro
*/

// IMPORTS
import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  AsyncStorage,
  Image,
  
} from "react-native";
import MapView, { Polyline, Marker, AnimatedRegion } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import Search from "../Autocomplete";
import {
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall,
  Back
} from "./styles";
import api from "../../services/api";

import markerImage from "../../assets/marker.png";
import markerMoto from "../../assets/motorcycle-icon.png";
import { getPixelSize, toTime } from "../../utils";
import Details from "../Details";
import BackImage from "../../assets/back.png";
//import MenuBtn from "../Menu/";
import MarkPointer from "../MarkPointer";
import AwaitMoto from "../Awaitmoto";
import AwayMoto from "../Awaymoto";

window.navigator.userAgent = "react-native";
import io from "socket.io-client/dist/socket.io";


//Class Map
export default class Map extends Component {
  // Constructor e os states
  constructor(props) {
    super(props);

    this.socket = io("https://motoroute-project.herokuapp.com", {
      //timeout: 10000,
      jsonp: false,
      transports: ['websocket'],
      autoConnect: true,
      agent: '-',
      pfx: '-',
    });
    this.state = {
      region: null,
      destination: null,
      searchGeo: null,
      geoData: null,
      estilo: null,
      loggedInUser: null,
      placeholder: null,
      textDestino: null,
      routes: null,
      duration: null,
      origem: {
        latitude: null,
        longitude: null
      },
      coords: null,
      markPointShow: null,
      product: 1,
      markPoint: [],
      awaitMoto: false,
      awayMoto: false,
      awayCoords: null,
      textButton: "SOLICITAR MOTO",
      rotaId: null,
      freedrivers: [],
      distances: null,
      piloto_id: null,
      pilotoAway: null, 
      piloto:null,
      motoChegou: false,
    };

    this.wpOptions = {
      enableHighAccuracy: true,
      timeout: 6000,
      maximumAge: 0
    };
    this.watchPosition = null;
  }

  // Assim que o componente for montado
  async componentDidMount() {
    
    
    
    await this.getCurrentPosition();
   
    const user = JSON.parse(await AsyncStorage.getItem("@CodeApi:user"));

    this.setState({ loggedInUser: user });
    this.setState({ placeholder: "Para onde, " + user.name + "?" });

    this.socket.on("getClientPosition", () => {
      this.getCurrentPosition();
    });

    this.socket.on("showDriverPosition", driverposition => {
     // console.log("Driver Position", driverposition);
    });

    this.socket.on("showFreeDrivers", freedrivers => {
      //console.log("ShowFreeDrivers", freedrivers);
      this.setState({ freedrivers });
    });
    this.socket.on("motoChegou", dados => {
      console.log("Moto Chegou", dados);
      this.setState({ motoChegou:true });
      this.props.showNotification('MotoRoute Corridas','Sua moto chegou e está te aguardando.');
    });
    this.socket.on("driverLocation", driverlocation => {
      this.setState({ pilotoAway: driverlocation });
      
      //console.log("Driver Location", driverlocation);
    });
    
    // RESPOSTA DO PILOTO
    this.socket.on("driverResponse", async driverResponse => {
      console.log("Driver Response", driverResponse);
      const { user_id, response_user, route_id, awayCoords } = driverResponse;
      // Verifica se é o piloto e a rota
      if (this.state.rotaId === route_id && this.state.piloto_id === user_id) {
        if (response_user === "C") {
          // Aceitou a Corrida
          console.log("O Usuario " + user_id + " aceitou a Corrida");
          this.setState({ awaitMoto: false, awayMoto: true, awayCoords });
          const piloto = await this.getUser(user_id);
          try{
            const updaterota = await api.post('products/updateroute/',{
              dados:{
                id: route_id,
                data:{
                  piloto_id: user_id,
                  status:'P'
                }
              }
            })
          }catch(response){
            console.log('Erro ao Atualizar Rota',response.data.error);
          }
          console.log("Dados Piloto",this.state.piloto);
          try {
            await api.post("products/delfreedriver/", { dados: { user_id } });
          } catch (err) {
            console.log("Erro ao deletar Freedriver", err.data.error);
          }
          
        } else {
          // Cancelou a Corrida
          console.log("O Usuario " + user_id + " cancelou a Corrida");
          this.getMinDriver();
        }
      }
    });
    setInterval(() => {
      //console.log("Call Freedriver");
      this.socket.emit("getFreeDrivers");
    }, 1000);
  }

  componentWillUnmount() {
    // RESPOSTA DO PILOTO
    console.log('Background');
    this.socket.on("driverResponse", async driverResponse => {
      console.log("Driver Response", driverResponse);
      const { user_id, response_user, route_id, awayCoords } = driverResponse;
      // Verifica se é o piloto e a rota
      if (this.state.rotaId === route_id && this.state.piloto_id === user_id) {
        if (response_user === "C") {
          // Aceitou a Corrida
          console.log("O Usuario " + user_id + " aceitou a Corrida");
          const piloto = await this.getUser(user_id);

          //Atualiza a Tabela de Rotas
          try{
            const updaterota = await api.post('products/updateroute/',{
              dados:{
                id: route_id,
                data:{
                  piloto_id: user_id,
                  status:'P'
                }
              }
            })
          }catch(response){
            console.log('Erro ao Atualizar Rota',response.data.error);
          }

          try {
            await api.post("products/delfreedriver/", { dados: { user_id } });
          } catch (err) {
            console.log("Erro ao deletar Freedriver", err.data.error);
          }
          this.setState({ awaitMoto: false, awayMoto: true, awayCoords });
        } else {
          // Cancelou a Corrida
          console.log("O Usuario " + user_id + " cancelou a Corrida");
          this.getMinDriver();
        }
      }
    });
    this.socket.on("motoChegou", dados => {
      console.log("Moto Chegou", dados);
      this.setState({ motoChegou:true });
      this.props.showNotification('MotoRoute Corridas','Sua moto chegou e está te aguardando.');
    });
  }
  // Funções
  getUser = async(dados)=>{
    // Pega o Piloto pelo código
    const data = {id: dados};
    try{
      const response = await api.post("products/showuser/",{dados:{data}});
      this.setState({piloto: response.data});
      
    }
    catch(response){
      console.log("Erro ao pegar Piloto", response.data.error);
    }
  };
  


  getFreeDriver = async () => {
    const { region, freedrivers, rotaId } = this.state;
    const distances = [];
    const corigin = region.longitude + "," + region.latitude;
    const fd = freedrivers.map(async freedriver => {
      let cdestination = freedriver.longitude + "," + freedriver.latitude;
      let dados = {
        origin: corigin,
        destination: cdestination
      };
      if (rotaId !== null) {
        try {
          await api
            .post("maps/rota/", {
              dados: dados
            })
            .then(async data => {
              const { routes } = data.data;
              //console.log("Fez uma rota", routes);
              // let tempo = this.toTime(routes[0].legs[0].duration);

              if (routes[0].legs[0].duration > 0) {
                let tempo = routes[0].legs[0].duration;
                console.log("RotaId", rotaId);

                let vvv = {
                  user_id: freedriver.user_id,
                  distance: tempo,
                  route_id: rotaId
                };
                distances.push(tempo);
                const routedriver = await api
                  .post("products/addroutedriver/", {
                    dados: vvv
                  })
                  .then(response => {
                    console.log(response.data);
                  });
              }

              console.log("Distances", distances);
              this.setState({ distances });
            });
        } catch (response) {
          console.log("Error GetFreeDriver", response.data.error);
        }
      }
    });

    if (distances.length > 0) {
      this.setState({ distances });
    }
    const result = await this.getMinDriver();
    if (result) {
      // setTimeout(this.getFreeDriver,1000);
      console.log("Distancias", result);
    }

    
    return fd;
  };
  getMinDriver = async () => {
    // Pega o primeiro da lista ordenado pelo menor tempo
    try {
      if (this.state.rotaId !== null) {
        const menor = await api
          .post("products/routedrivermin", {
            dados: { route_id: this.state.rotaId, response_user: "A" }
          })
          .then(result => {
            if (result.data) {
              console.log("Emite chamada ao piloto", result.data);
              this.socket.emit("setDriver", {
                user_id: result.data.user_id,
                route_id: this.state.rotaId
              });
              this.setState({
                piloto_id: result.data.user_id
              });
              // Acho que aqui precisa ter um contador que pode ser cancelado no socket
              // counterSocket
            }
          });
      }
    } catch (response) {
      console.log(response.data.error);
    }
  };
  getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
  };

  
  wpSuccess = async position => {
    let longitude = position.coords.longitude;
    let latitude = position.coords.latitude;
    try {
      const geocd = await api.post("maps/geocode/", {
        dados: latitude + "," + longitude
      });
      const origem = geocd.data[0];
      origem.heading = position.coords.heading;
      this.setState({
        region: {
          latitude,
          longitude,
          latitudeDelta: 0.0143,
          longitudeDelta: 0.0134
        },
        origem
      });
      console.log("Origem", this.state.origem);
      this.socket.emit("clientLocation", {
        ...this.state.region,
        socketID: this.socket.id,
        user: this.state.loggedInUser
      });
      console.log("Checando Corrida");
      await this.checkCorrida();
    } catch (response) {
      if (
        response.data.error == "Token Invalid" ||
        response.data.error == "No Token Provided"
      ) {
        AsyncStorage.removeItem("@CodeApi:token");
        this.props.navigation.navigate("login");
      }
      console.log(response.data.error);
    }
  };
  wpError = () => {};
  getCurrentPosition = async () => {
    //console.log("OPT", this.wpOptions);
    this.watchPosition = Geolocation.watchPosition(
      this.wpSuccess,
      this.wpError,
      this.wpOptions
    );
  };
  checkCorrida = async () => {
    console.log("Checando a Corrida", this.state.loggedInUser);
    try {
      const openroute = await api.post("products/openroute/", {
        dados: { id: this.state.loggedInUser.id }
      });
      const data = openroute.data[0];
      this.setState({ product: data.product_id, rotaId: data.id });
      const latitude = parseFloat(data.destino_latitude, 10);
      const longitude = parseFloat(data.destino_longitude, 10);
      if (data.status == "A") {
        this.setState({ awaitMoto: true, textButton: "AGUARDANDO MOTO" });
        this.getMinDriver();
      }
      if (data.status == "P") {
        // Pega os dados do Piloto
        try{
          const piloto = this.getUser(data.piloto_id).then((retorno)=>{
            console.log('Piloto',this.state.piloto);
            
          })
        }catch(response){
          console.log("Erro ao pegar os dados do Piloto",response.data.error);
        }
        this.setState({ awayMoto: true, awaitMoto:false});
        
      }
      
      this.setState({
        destination: {
          latitude,
          longitude,
          title: "Destino",
          coords: null
        },
        estilo: true,
        textDestino: "Destino"
      });

      const { region } = this.state;

      const corigin = region.longitude + "," + region.latitude;
      const cdestination = longitude + "," + latitude;

      const dados = {
        origin: corigin,
        destination: cdestination
      };

      this.socket.emit("getFreeDrivers");

      // let dd = await api.post("maps/rota/", { dds });
      // console.log("Freedriver ", dd);

      try {
        const rsps = await api.post("maps/rota/", {
          dados: dados
        });
        const { routes } = rsps.data;
        let coord = routes[0].geometry.coordinates;
        let coords = coord.map((point, index) => ({
          longitude: point[0],
          latitude: point[1]
        }));
        this.setState({ coords: coords, routes });
        this.setState({ duration: toTime(routes[0].legs[0].duration) });
      } catch (response) {
        if (
          response.data.error == "Token Invalid" ||
          response.data.error == "No Token Provided"
        ) {
          AsyncStorage.removeItem("@CodeApi:token");
        }
        console.log(response.data.error);
      }
    } catch (response) {
      if (
        response.data.error == "Token Invalid" ||
        response.data.error == "No Token Provided"
      ) {
        AsyncStorage.removeItem("@CodeApi:token");
      }
      console.log(response.data.error);
    }
  };

  handleBack = () => {
    this.setState({ destination: null, coords: null });
  };
  handleCancelBtn = async () => {
    this.setState({
      destination: null,
      coords: null,
      awaitMoto: false,
      textButton: "SOLICITAR MOTO"
    });
    try {
      const { rotaId } = this.state;
      const dados = {
        id: rotaId,
        data: { status: "C" }
      };
      console.log("Cancelando a Corrida");
      this.setState({ rotaId: null });
      try {
        const delroute = await api.post("products/delroutedriver/", { dados });
      } catch (response) {
        console.log("Erro", response.data.error);
      }

      console.log("Cancelou", dados);
      const response = await api.post("products/updateroute/", { dados });
    } catch (response) {
      if (
        response.data.error == "Token Invalid" ||
        response.data.error == "No Token Provided"
      ) {
        AsyncStorage.removeItem("@CodeApi:token");
        this.props.navigation.navigate("login");
      }
      console.log(response.data.error);
    }
  };
  getSearch = search => {
    const { origem } = this.state;
    search = search + " " + origem.city;
    this.setState({
      searchGeo: search,
      estilo: null,
      textDestino: null
    });
    this.getAutocomplete();
  };
  getAutocomplete = async () => {
    const { searchGeo } = this.state;
    try {
      const response = await api.post("/maps/autocomplete", {
        dados: searchGeo
      });
      if (response.data) {
        this.setState({ geoData: response.data });
      }
    } catch (err) {
      if (
        response.data.error == "Token Invalid" ||
        response.data.error == "No Token Provided"
      ) {
        this.props.navigation.navigate("login");
      }
      console.log(err.data.error);
    }
  };
  onMapPress = async e => {
    this.setState({ destination: null, coords: null });
    this.setState({
      markPointShow: true,
      markPoint: e.nativeEvent.coordinate
    });
  };

  handleLocationSelected = async (item, value) => {
    const values = value.split(",");
    const latitude = parseFloat(values[0], 10);
    const longitude = parseFloat(values[1], 10);
    this.setState({
      destination: {
        latitude,
        longitude,
        title: item.label,
        coords: null
      },
      estilo: true,
      textDestino: item.label
    });
    const { origem } = this.state;
    const corigin = origem.longitude + "," + origem.latitude;
    const cdestination = longitude + "," + latitude;
    const dados = {
      origin: corigin,
      destination: cdestination
    };
    try {
      const response = await api.post("maps/rota/", {
        dados: dados
      });
      const { routes } = response.data;
      let coord = routes[0].geometry.coordinates;
      let coords = coord.map((point, index) => ({
        longitude: point[0],
        latitude: point[1]
      }));
      this.setState({ coords: coords, routes });
      this.setState({ duration: toTime(routes[0].legs[0].duration) });
    } catch (response) {
      if (
        response.data.error == "Token Invalid" ||
        response.data.error == "No Token Provided"
      ) {
      }
      console.log(response.data.error);
    }
  };
  hideAlert = () => {
    this.setState({
      markPointShow: null,
      markPoint: []
    });
  };
  handleAlert = async () => {
    const { longitude, latitude } = this.state.markPoint;
    this.hideAlert();
    const response = await api.post("maps/geocode/", {
      dados: latitude + "," + longitude
    });

    this.setState({
      destination: {
        latitude,
        longitude,
        title: response.data[0].streetName,
        coords: null
      },
      estilo: true,
      textDestino: response.data[0].streetName
    });
    const { origem } = this.state;
    const corigin = origem.longitude + "," + origem.latitude;
    const cdestination = longitude + "," + latitude;
    const dados = {
      origin: corigin,
      destination: cdestination
    };
    try {
      const response = await api.post("maps/rota/", {
        dados: dados
      });
      const { routes } = response.data;
      let coord = routes[0].geometry.coordinates;
      let coords = coord.map((point, index) => ({
        longitude: point[0],
        latitude: point[1]
      }));
      this.setState({ coords: coords, routes });
      this.setState({ duration: toTime(routes[0].legs[0].duration) });
    } catch (response) {
      if (
        response.data.error == "Token Invalid" ||
        response.data.error == "No Token Provided"
      ) {
      }
      console.log(response.data.error);
    }
  };
  handleBtnSolicitar = async () => {
    const { origem, destination, loggedInUser, product } = this.state;
    const dados = {
      origem_latitude: origem.latitude,
      origem_longitude: origem.longitude,
      destino_latitude: destination.latitude,
      destino_longitude: destination.longitude,
      user_id: loggedInUser.id,
      product_id: product
    };
    const response = await api.post("/products/add", { dados: dados });

    if (response.data > 0) {
      this.setState({
        awaitMoto: true,
        textButton: "AGUARDANDO MOTO",
        rotaId: response.data
      });

      this.socket.emit("getFreeDrivers");
      this.getFreeDriver();
      this.getMinDriver();

      // console.log("FreeDrivers", this.state.freedrivers);
    }
  };
  handleProductCheck = product => {
    this.setState({
      product: product
    });
  };
  onRegionChange(region) {
    //console.log("Region Mudou");
    this.setState({ region });
    this.socket.emit("getFreeDrivers");
    //this.getFreeDriver();
  }
  // Converts from degrees to radians.
  toRadians = degrees => {
    return (degrees * Math.PI) / 180;
  };

  // Converts from radians to degrees.
  toDegrees = radians => {
    return (radians * 180) / Math.PI;
  };

  bearing = (startLat, startLng, destLat, destLng) => {
    startLat = this.toRadians(startLat);
    startLng = this.toRadians(startLng);
    destLat = this.toRadians(destLat);
    destLng = this.toRadians(destLng);

    y = Math.sin(destLng - startLng) * Math.cos(destLat);
    x =
      Math.cos(startLat) * Math.sin(destLat) -
      Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    brng = Math.atan2(y, x);
    brng = this.toDegrees(brng);
    return (brng + 360) % 360;
  };

  bannerError = err => {
    console.log("Banner error", err);
  };
  // Renderizando o Componente
  render() {
    const { region, destination, coords, origem, awayCoords } = this.state;

    return (
      <View style={{ flex: 1 }}>
        {this.state.awaitMoto && (
          <AwaitMoto handlerCancelBtn={this.handleCancelBtn} />
        )}
        {this.state.awayMoto && (
          <AwayMoto 
            handlerCancelBtn={this.handleCancelBtn} 
            motoChegou={this.state.motoChegou} 
            handlerCallBtn={this.state.piloto}
            product={this.state.product}
            />
        )}
        {this.state.markPointShow && (
          <MarkPointer
            onHandleAlert={this.handleAlert}
            onHideAlert={this.hideAlert}
          />
        )}
        <MapView
          style={{ flex: 1 }}
          initialRegion={region}
          showsUserLocation
          loadingEnabled
          ref={el => (this.mapView = el)}
          onPress={this.onMapPress.bind(this)}
          onRegionChange={this.onRegionChange.bind(this)}
        >
          {this.state.pilotoAway && (
            <Marker.Animated
              coordinate={{
                longitude: parseFloat(this.state.pilotoAway.longitude, 10),
                latitude: parseFloat(this.state.pilotoAway.latitude, 10)
              }}
              flat
              style={{
                transform: [
                  {
                    rotate: `${this.bearing(
                      parseFloat(this.state.pilotoAway.latitude, 10),
                      parseFloat(this.state.pilotoAway.longitude, 10),
                      parseFloat(origem.latitude, 10),
                      parseFloat(origem.longitude, 10)
                    )}deg`
                  }
                ]
              }}
              anchor={{ x: 0, y: 0 }}
              image={markerMoto}
              pointerEvents={"none"}
            >
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.5)",
                  padding: 2,
                  marginTop: 28,
                  marginLeft: -10,
                  borderRadius: 12
                }}
              >
                <Text>{this.state.pilotoAway.user_id}</Text>
              </View>
            </Marker.Animated>
          )}
          {this.state.freedrivers.map((freedriver, index) => (
            <Marker.Animated
              key={index}
              coordinate={{
                longitude: parseFloat(freedriver.longitude, 10),
                latitude: parseFloat(freedriver.latitude, 10)
              }}
              flat
              style={{
                transform: [
                  {
                    rotate: `${freedriver.heading}deg`
                  }
                ]
              }}
              anchor={{ x: 0, y: 0 }}
              image={markerMoto}
              pointerEvents={"none"}
            >
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.5)",
                  padding: 2,
                  marginTop: 28,
                  marginLeft: -10,
                  borderRadius: 12
                }}
              >
                <Text>{freedriver.user_id}</Text>
              </View>
            </Marker.Animated>
          ))}
          {awayCoords && (
            <Fragment>
              <Polyline
                coordinates={awayCoords}
                strokeColor="blue"
                strokeWidth={3}
                onLayout={result => {
                  console.log("Fit");
                  this.mapView.fitToCoordinates(awayCoords, {
                    edgePadding: {
                      right: getPixelSize(50),
                      top: getPixelSize(50),
                      left: getPixelSize(50),
                      bottom: getPixelSize(350)
                    }
                  });
                }}
              />
            </Fragment>
          )}
          {coords && (
            <Fragment>
              <Polyline
                coordinates={coords}
                strokeColor="red"
                strokeWidth={3}
                onLayout={result => {
                  console.log("Fit");
                  this.mapView.fitToCoordinates(coords, {
                    edgePadding: {
                      right: getPixelSize(50),
                      top: getPixelSize(50),
                      left: getPixelSize(50),
                      bottom: getPixelSize(350)
                    }
                  });
                }}
              />

              <Marker
                coordinate={destination}
                anchor={{ x: 0, y: 0 }}
                image={markerImage}
              >
                <LocationBox>
                  <LocationTimeBox>
                    <LocationTimeTextSmall>></LocationTimeTextSmall>
                    <LocationTimeTextSmall>></LocationTimeTextSmall>
                  </LocationTimeBox>
                  <LocationText>{destination.title}</LocationText>
                </LocationBox>
              </Marker>
              <Marker
                coordinate={{
                  longitude: parseFloat(origem.longitude, 10),
                  latitude: parseFloat(origem.latitude, 10)
                }}
                anchor={{ x: 0, y: 0 }}
              >
                <LocationBox>
                  <LocationTimeBox>
                    <LocationTimeTextSmall>Aproximado</LocationTimeTextSmall>
                    <LocationTimeText>{this.state.duration}</LocationTimeText>
                  </LocationTimeBox>
                  <LocationText>{this.state.origem.streetName}</LocationText>
                </LocationBox>
              </Marker>
            </Fragment>
          )}
        </MapView>
        {destination ? (
          <Fragment>
            <Back onPress={this.handleBack}>
              <Image source={BackImage} />
            </Back>
            {!this.state.awayMoto && (
              <Details
                handleBtnSolicitar={this.handleBtnSolicitar}
                handleProductCheck={this.handleProductCheck}
                handleTextButton={this.state.textButton}
                productId={this.state.product}
              />
            )}
          </Fragment>
        ) : (
          <Fragment>
            {!this.state.awayMoto && (
              <Search
                onLocationSelected={this.handleLocationSelected}
                onTextChange={this.getSearch}
                placeholder={this.state.placeholder}
                estilo={this.state.estilo}
                geoData={this.state.geoData}
                textDestino={this.state.textDestino}
              />
            )}
          </Fragment>
        )}
      </View>
    );
  }
}


