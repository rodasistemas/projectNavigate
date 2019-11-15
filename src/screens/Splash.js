import React, { Component, Fragment } from 'react';
import { 
    StyleSheet, 
    Text, 
    View,
    ImageBackground,
    Image,
    AsyncStorage,
} from 'react-native';
import VersionNumber from 'react-native-version-number';
import bgImage from '../images/background.jpg';
import logo from '../images/motoroute.png';

export default class Splash extends Component {
    constructor(props){
        super();
        this.state={
            version:'1.0.0'
        }
        
            
        
    }
    async componentDidMount(){
        this.setState({
            version: VersionNumber.appVersion
        });
        const token = await AsyncStorage.getItem('@CodeApi:token');
        const user = JSON.parse(await AsyncStorage.getItem('@CodeApi:user'));
        
        if(token && user){
            this.setState({loggedInUser: user});
            if(user.userType == 1){
                setTimeout(()=>{this.props.navigation.navigate('mapa')},3000);
            }else{
                setTimeout(()=>{this.props.navigation.navigate('piloto')},3000);
            }
            
        }else{
            setTimeout(()=>{this.props.navigation.navigate("login")},3000);
        }
        
    }
    render(){
        return(
            <Fragment>
            <ImageBackground source={bgImage} style={styles.backgroundContainer}>
                <View style={styles.container}>
                    <Image style={styles.logo} source={logo}></Image>
                    <Text style={styles.logoText}>MotoRoute Corridas</Text>
                </View>
            </ImageBackground>
            <View style={styles.footer}>
                <Text style={styles.footerText}>v{this.state.version}</Text>
            </View>
            </Fragment>
        )
    }
};

const styles = StyleSheet.create({
    backgroundContainer:{
        flex:1,
        width:null,
        height: null,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        
        alignItems: 'center',
        

    },
    logo:{
        width:120,
        height:120,
    },
    logoText:{
        color: '#000',
        fontWeight: '900',
        fontSize: 22,
        marginTop:10,
        elevation:3,
        shadowColor:'#000',
        shadowOpacity:0.5,
        shadowRadius:10,
    },
    footer:{
        position:"absolute",
        bottom: 0,
        width:'100%',
        height: 20

    },
    footerText:{
        color:'#FFF',
        textShadowColor:'rgba(0,0,0,0.5)',
        elevation:3
    }

});