import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import MenuIcon from '../../assets/menuicon.png';


export default class Menu extends Component {
  render() {
    return (
        <TouchableOpacity style={styles.menuIcon} onPress={()=>{}}>
            <Image
                source={MenuIcon}
                style={styles.menuImage}
            ></Image>
        </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
    menuIcon:{
        zIndex: 9,
        position: 'absolute',
        top: 5,
        left: 5,
    },
    menuImage:{
        height: 28,
        width: 28
    }
})
