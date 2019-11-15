import React, { PropTypes } from 'react';
import { View, Text,TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container:{
      flex:1,
      alignItems: 'center',
      alignContent: 'center',
      position:'relative',
      backgroundColor: '#FFF',
    },
    searchBox:{
      width:'90%',
      borderWidth:1,
      borderRadius:5,
      marginTop:30,
      backgroundColor:'rgba(255,255,255,0.7)',
  
    },
    containerList:{
        flex:1,
      flexDirection:'row',
      height: 56,
      width:'100%',
      zIndex:2,
      
      
      
  
  },
  containerDisabled:{
    display:'none',
  },
  containerItem:{
      flexDirection:'row',
      borderWidth:0,
      padding:2,
      borderBottomColor:'#DDD',
      borderBottomWidth:1,
      width:'100%',
      alignSelf:'stretch',
      flex:1,
      
      
  
  },
  textItem:{
      paddingLeft:20,
      paddingRight:20,
      fontSize: 16,
      width:'100%',
      alignSelf:'stretch',
      flex:1,
  
  }
  });


const RenderItem = (item, callback) => {
    
    const styleContainer = [styles.containerList];
    return (
            <View style={styles.container} key={Math.random()}>
                <TouchableOpacity
                    onPress={()=>{callback(item, item.value); styleContainer.push(styles.containerDisabled)}}>
                    <View style={styles.containerItem}>
                        <Text
                            style={styles.textItem}>{item.label}</Text>
                    </View>
                </TouchableOpacity>
            </View>
    )
}

export { RenderItem };