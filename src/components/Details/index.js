import React, { Component } from 'react';
import { 
  Container, 
  ContainerColumn, 
  ContainerColumnItem, 
  Checked,
  TypeTitle, 
  TypeDescription, 
  TypeImage, 
  TypeSpace,
  RequestButton, 
  RequestButtonText } from './styles';
import corrida from '../../assets/uberx.png';
import encomenda from '../../assets/entrega.png';
import api from '../../services/api';



export default class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      checked: 1,
    };
  }
  loadProduct = async () =>{
    const response = await api.get('/products/test');
    if(response.data){
      this.setState({products: response.data});
      return response.data;
    }
    
    
  };
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
  async componentDidMount(){
    this.loadProduct();
  }
  
    
  render() {
    const {handleBtnSolicitar, handleProductCheck, handleTextButton, productId} = this.props;
    {this.state.checked = productId};
    return (
      <Container>
        <ContainerColumn>
          { this.state.products.map(product => (
              
              <ContainerColumnItem key={product.id} onPress={()=>{this.setState(
                {
                  checked: product.id,
                }
              );
              handleProductCheck(product.id)
              }}>
                {this.state.checked == product.id ?
                <Checked></Checked>
                :
                <TypeSpace></TypeSpace>
                } 
                <TypeTitle>{product.product}</TypeTitle>
                <TypeDescription>{product.description}</TypeDescription>
                {product.icon == 'corrida' ? (
                  <TypeImage source={corrida} />
                ) :(<TypeImage source={encomenda} />)}
                
                <TypeDescription>R$ {this.formatMoney(product.value,2,',','.')}</TypeDescription>
              </ContainerColumnItem>
            
          ))}
        </ContainerColumn>
          <RequestButton
            onPress={handleBtnSolicitar}>
                <RequestButtonText>{handleTextButton}</RequestButtonText>
          </RequestButton>
    </Container>
    );
  }
}
