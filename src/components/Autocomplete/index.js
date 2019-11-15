import React, { Component } from 'react';
import { View, TextInput,Text, FlatList, StyleSheet, Platform } from 'react-native';
import api from '../services/api';
import {RenderItem} from './Autocomplete/RenderItem';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchGeo: null,
      geoData:null,
      displayList:true,
      
    };
    
  }
  
  // onSelected = (label, item) =>{
  //   console.log(label, item);
  //   this.setState({displayList:false});
  // }
  getSearch = (search)=>{
    
    this.setState({searchGeo:search});
    this.getAutocomplete();
  }
  getAutocomplete = async () =>{
    const {searchGeo} = this.state;
    try{
      
      const response = await api.post('/maps/autocomplete',{dados:searchGeo});
      if(response.data){
        this.setState({geoData: response.data});
        console.log(this.state.geoData);
      }
      
      
    }catch(err){
      console.log(err.data.error)
    }
  }
  render() {
    const { onLocationSelected } = this.props;
    const {geoData} = this.state;
    const containerList = styles.containerList;
    if(!!this.state.displayList){
      containerList = styles.containerDisabled;
    }
    return (
      <View style={containerList}>
        <TextInput
            style={styles.searchBox}
            placeholder="Pra onde?"
            onChangeText={this.getSearch.bind(this)}
            />
            <View style={containerList}>
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
    alignItems: 'center',
    alignContent: 'center',
    
  },
  searchBox:{
    width:'90%',
    borderWidth:1,
    borderRadius:5,
    marginTop:30,

  },
  containerList:{
    flex:1,
    marginTop:1,
    padding:2,
    zIndex:1,
    width:'90%',
    height:0,
    display:'flex',
    
    
    

},
containerDisabled:{
  display:'none',
},
containerItem:{
    flex:1,
    borderBottomWidth:1,
    marginBottom:5,
    padding:2,
    

},
textItem:{
    paddingLeft:20,
    paddingRight:20,
    fontSize: 16,

}
});

export default index;