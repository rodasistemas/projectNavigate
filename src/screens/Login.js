import React, { Component } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    Image, 
    TouchableOpacity, 
    AsyncStorage,
    SafeAreaView,
    Dimensions,
    KeyboardAvoidingView,
    TextInput,
    ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import bgImage from '../images/background.jpg';
import logo from '../images/motoroute.png';
import api from '../services/api';
import loading from '../assets/loading1.gif';
//=========================================================

const {width: WIDTH} = Dimensions.get("window");

export default class Login extends Component {
    constructor(props){
        super()
        this.state = {
            loggedInUser: null,
            showPass: true,
            press: false,
            user: null,
            pass:null,
            click:false,
        }
    }
    showPass = () => {
        if(this.state.press === false){
            this.setState({showPass: false, press: true})
        }else{
            this.setState({showPass: true, press: false})
        }

    }
    setUser = (user) =>{
        this.setState({user});
    }
    setPass = (pass) =>{
        this.setState({pass});
    }
    getLogin = async ()=>{
        this.setState({click:true});
        try{
            const response = await api.post('/auth/authenticate',{
                email: this.state.user,
                password: this.state.pass,
            });
            const {user, token} = response.data;
            await AsyncStorage.multiSet([
                ['@CodeApi:token', token ],
                ['@CodeApi:user', JSON.stringify(user)]
            ]);
            this.setState({loggedInUser: user});
            this.props.navigation.navigate('mapa');
            
        }catch(response){
            alert(response.data.error);
            this.setState({click:false});
        }

        
    }
    async componentDidMount(){
        const token = await AsyncStorage.getItem('@CodeApi:token');
        const user = JSON.parse(await AsyncStorage.getItem('@CodeApi:user'));
        
        if(token && user){
            this.setState({loggedInUser: user});
     
            
        }
        if(user){
            this.setState({user: user.email});
        }
    }
    render() {
        
        return (
            <ImageBackground source={bgImage} style={styles.backgroundContainer}>
                <SafeAreaView style={styles.container}>
                    <View style={styles.container}>
                        <Image style={styles.logo} source={logo}></Image>
                        <Text style={styles.logoText}>MotoRoute Corridas</Text>
                    </View>
                <KeyboardAvoidingView>
                    <View style={styles.form}>
                        <Icon name={'ios-person'} size={28} color={'rgba(255,255,255,0.8)'} style={styles.inputIcon}/>
                        <TextInput style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="rgba(255,255,255,0.7)"
                                    underlineColorAndroid="transparent"
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    returnKeyLabel="Próx"
                                    value={this.state.user}
                                    onChangeText={this.setUser.bind(this)}
                                    autoCorrect={false}/>
                    </View>
                    <View style={styles.form}>
                        <Icon name={'ios-lock'} size={28} color={'rgba(255,255,255,0.8)'} style={styles.inputIcon}/>    
                    
                        <TextInput style={styles.input}
                                    secureTextEntry={this.state.showPass}
                                    placeholder="Digite sua senha"
                                    underlineColorAndroid="transparent"
                                    onChangeText={this.setPass.bind(this)}
                                    placeholderTextColor="rgba(255,255,255,0.8)"/>
                        <TouchableOpacity style={styles.btnEye}
                            onPress={this.showPass.bind(this)}>
                            <Icon name={this.state.press == false ? 'ios-eye':'ios-eye-off'} 
                            size={28} color={'rgba(255,255,255,0.7)'} />
                        </TouchableOpacity>
                    </View>
                    
            </KeyboardAvoidingView>
        </SafeAreaView>
        <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.buttonGreen}
                            onPress={this.getLogin}
                            disabled={this.state.click}
                            >
                                <Text style={styles.textButton}>Entrar</Text> 
                                
                                </TouchableOpacity>
                        <TouchableOpacity
                        style={styles.button}
                        onPress={()=>{this.props.navigation.navigate('registro')}}
                        ><Text style={styles.textButton}>Cadastrar</Text></TouchableOpacity>
                    </View>
        </ImageBackground>
        )
    }

}
const styles = StyleSheet.create({
  
    boxlogo:{
        flex:1,
        backgroundColor: 'rgb(210,100,100)',
        flexDirection: 'column',
        width:'100%',
        height:36,
        left: 0,
        top: 0,
    },
    title:{
        fontSize:14,
        color: 'white',
        textAlign: "center",
        top:12,
    },
    backgroundContainer:{
        flex:1,
        width:null,
        height: null,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        
        alignItems: 'center',
        marginBottom: 30,
        

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
        shadowRadius:10,
        shadowOpacity:0.5,
    },
    form:{
        height: 50,
    },
    input:{
        width: WIDTH - 55,
        height:45,
        borderRadius: 25,
        fontSize: 16,
        paddingLeft: 45,
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginTop:10,
        color: 'white',
    },
    button:{
        height:45,
        borderRadius:25,
        backgroundColor:'rgba(200,210,220,0.5)',
        
        paddingTop: 8,
        flexDirection:'column',
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        

    },
    buttonPurple:{
        height:45,
        borderRadius:25,
        backgroundColor:'rgba(100,110,220,0.5)',
        
        paddingTop: 8,
        flexDirection:'column',
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        

    },
    
    buttonGreen:{
        height:45,
        borderRadius:25,
        backgroundColor:'rgba(10,210,20,0.5)',
        
        paddingTop: 8,
        flexDirection:'column',
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        

    },
    inputIcon:{
        position: 'absolute',
        top: 18,
        left: 12,
        width:28,
    },
    
    buttonContainer:{
        padding: 20,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    textButton:{
        color:'white', 
        fontWeight:'500',
        alignItems: 'center',
        justifyContent: 'center',
        top:-4,
        fontSize:18
    },
    btnEye:{
        position: 'absolute',
        top: 15,
        right: 20,

    
    },
});