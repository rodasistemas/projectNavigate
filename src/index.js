import React, { Component } from 'react';
import {createAppContainer, createStackNavigator} from 'react-navigation';
import Splash from './screens/Splash';
import Login from './screens/Login';
import RegistroPassageiro from './screens/RegistroPassageiro';
import Mapa from './screens/Mapa';

export default class App extends Component {
  render(){
    return (
      <AppContainer style={{width:'100%',top:-50, height:'100%', backgroundColor:'#000'}}
      ref={nav=>null}
  />
    )
  }
}

const AppStackNavigator = createStackNavigator({
  
  screen: Splash,
  login: Login,
  registro: RegistroPassageiro,
  mapa: Mapa,

},{
  defaultNavigationOptions:{
    headerStyle:{
      display:'none',
    }
  }
}
)

const AppContainer = createAppContainer(AppStackNavigator);