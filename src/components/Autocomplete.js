import React, { Component } from 'react';
import { View, TextInput,Text, FlatList, StyleSheet, Platform} from 'react-native';
import {RenderItem} from './Autocomplete/RenderItem';

class Autocomplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayList:true,
    };

    
  }
  render() {
    const { onLocationSelected, onTextChange, estilo, geoData, placeholder, textDestino } = this.props;
    return (
      <View style={styles.container}>
        <TextInput
            style={styles.searchBox}
            placeholder={placeholder}
            onChangeText={onTextChange}
            value={textDestino}
            
            />
            <View style={estilo ? styles.containerDisabled : styles.containerList}>
        <FlatList
            data={geoData}
            
            renderItem={({item})=>RenderItem(item, onLocationSelected)}
            
        />
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    
    
    position:'absolute',
    top:10,
    left:32,
    
    width:'80%',
    zIndex:1,
    
    
    
    
    
  },
 
  searchBox:{
    width:'100%',
    borderWidth:0,
    borderRadius:0,
    marginTop:0,
    marginLeft:10,
    fontSize:16,
    fontWeight:'600',
    backgroundColor: 'rgba(255,255,255,0.7)'

  },
  containerList:{
    flex:1,
    marginTop:0,
    padding:2,
    zIndex:1,
    width:'90%',
    
    
    
    
    

},
containerDisabled:{
  display:'none',
},
containerItem:{
    flex:1,
    borderBottomWidth:1,
    marginBottom:5,
    padding:2,
    justifyContent:'center',
    alignSelf: 'stretch',
    

},
textItem:{
    paddingLeft:20,
    paddingRight:20,
    fontSize: 16,

}
});

export default Autocomplete;