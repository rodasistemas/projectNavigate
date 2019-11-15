import React, { 
    Component 
} from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    Image, 
    TouchableOpacity, 
    StatusBar, 
    SafeAreaView,
    Keyboard,
    Dimensions,
    KeyboardAvoidingView,
    TextInput,
    Button,
    ImageBackground,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import bgImage from '../images/background.jpg';
import logo from '../images/motoroute.png';
import api from '../services/api';


const {width: WIDTH} = Dimensions.get("window");
export default class RegistroPassageiro extends Component {
    constructor(){
        super()
        this.state = {
            showPass: true,
            press: false,
            nome: null,
            email: null,
            password: null,
            phone: null,
            error: true,
            userType: 1,

        }
    }
    setNome = (nome)=>{
        this.setState({nome});
    }
    setEmail = (email)=>{
        this.setState({email});
    }
    setPhone = (phone)=>{
        this.setState({phone});
    }
    setPassword = (password)=>{
        this.setState({password});
    }
    showPass = () =>{
        if(this.state.press === false){
            this.setState({showPass: false, press: true})
        }else{
            this.setState({showPass: true, press: false})
        }

    }
    saveUser = async()=>{
        if(
            !this.state.nome || 
            !this.state.phone || 
            !this.state.email ||
            !this.state.password
            
            ){
                alert("Todos os campos são obrigatórios.")
            }else{
                try{
                    const response = await api.post('/auth/register',{
                        name: this.state.nome,
                        phone: this.state.phone,
                        email: this.state.email,
                        password: this.state.password,
                        userType: this.state.userType
                    });
                    alert('Registro concluído com sucesso!');
                    this.props.navigation.navigate('login');
                }catch(response){
                    alert('Erro ao concluir o Registro. '+response.data.error);
                }
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
                                    placeholder="Nome"
                                    placeholderTextColor="rgba(255,255,255,0.7)"
                                    underlineColorAndroid="transparent"
                                    returnKeyType="next"
                                    returnKeyLabel="Próx"
                                    enablesReturnKeyAutomatically
                                    onChangeText = {this.setNome.bind(this)}
                                    autoCorrect={false}/>
                </View>
                <View style={styles.form}>
                        <Icon name={'ios-call'} size={28} color={'rgba(255,255,255,0.8)'} style={styles.inputIcon}/>
                        <TextInput style={styles.input}
                                    placeholder="Telefone"
                                    keyboardType="phone-pad"
                                    placeholderTextColor="rgba(255,255,255,0.7)"
                                    underlineColorAndroid="transparent"
                                    returnKeyType="next"
                                    enablesReturnKeyAutomatically
                                    returnKeyLabel="Próx"
                                    onChangeText = {this.setPhone.bind(this)}
                                    autoCorrect={false}/>
                </View>
                <View style={styles.form}>
                        <Icon name={'ios-mail'} size={28} color={'rgba(255,255,255,0.8)'} style={styles.inputIcon}/>
                        <TextInput style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="rgba(255,255,255,0.7)"
                                    underlineColorAndroid="transparent"
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    returnKeyLabel="Próx"
                                    onChangeText = {this.setEmail.bind(this)}
                                    autoCapitalize="none"
                                    enablesReturnKeyAutomatically
                                    autoCorrect={false}/>
                </View>
                <View style={styles.form}>
                        <Icon name={'ios-lock'} size={28} color={'rgba(255,255,255,0.8)'} style={styles.inputIcon}/>    
                    
                        <TextInput style={styles.input}
                                    secureTextEntry={this.state.showPass}
                                    placeholder="Digite sua senha"
                                    underlineColorAndroid="transparent"
                                    onChangeText = {this.setPassword.bind(this)}
                                    placeholderTextColor="rgba(255,255,255,0.8)"/>
                        <TouchableOpacity style={styles.btnEye}
                            onPress={this.showPass.bind(this)}>
                            <Icon name={this.state.press == false ? 'ios-eye':'ios-eye-off'} 
                            size={28} color={'rgba(255,255,255,0.7)'} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.form}>
                        <Icon name={'ios-lock'} size={28} color={'rgba(255,255,255,0.8)'} style={styles.inputIcon}/>    
                    
                        <TextInput style={styles.input}
                                    secureTextEntry={this.state.showPass}
                                    placeholder="Digite sua senha novamente"
                                    underlineColorAndroid="transparent"
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
                            onPress={this.saveUser}
                            ><Text style={styles.textButton}>Salvar</Text></TouchableOpacity>
                        <TouchableOpacity
                        style={styles.buttonPurple}
                        onPress={()=>{this.props.navigation.navigate('login')}}
                        ><Text style={styles.textButton}>Cancelar</Text></TouchableOpacity>
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
        color: 'white',
        fontWeight: '500',
        fontSize: 20,
        marginTop:10,
        opacity:0.5,
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
        backgroundColor:'rgba(200,200,200,0.5)',
        
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