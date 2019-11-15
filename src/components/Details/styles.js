import styled from 'styled-components/native';

export const Container = styled.View`
    background: #FFF;
    height: 300px;
    width:100%;
    position: absolute;
    bottom: 0;
    shadow-color: #000;
    shadow-offset: 0 0;
    shadow-opacity: 0.2;
    shadow-radius: 10;
    elevation:3;
    border: 1px solid #DDD;
    align-items: center;
    padding:20px;
    

` ;

export const ContainerColumn = styled.View`
    width:100%;
    flexDirection: row;
    alignItems: center;
    alignContent: center;
    padding:5px;
    margin: auto;
`;
export const Checked = styled.View`
    width:100%;
    position: absolute;
    height:30px;
    zIndex:10;
    top:1px;
    background-color: rgba(50,255,50,0.3);
`;
export const ContainerColumnItem = styled.TouchableOpacity`
    flexDirection: column;
    width: 45%;
    border: 1px solid #CCC;
    margin:7px;
    padding:3px;
    alignItems: center;
    alignContent: center;
`;
export const TypeSpace = styled.Text`
    font-size:10px;
`;
export const TypeTitle = styled.Text`
    font-size: 20px;
    color: #222;
    alignItems: center;
    alignContent: center;
`;
export const TypeDescription = styled.Text`
    color:#666;
    font-size: 14px;
    alignItems: center;
    alignContent: center;
    
`;
export const TypeImage = styled.Image`
    height: 80px;
    margin: 10px 0;
    
`;
export const RequestButton = styled.TouchableOpacity`
    background: #222;
    justify-content:center;
    align-items: center;
    height: 44px;
    align-self: stretch;
    margin-top: 10px;
    
`;
export const RequestButtonText = styled.Text`
    color: #FFF;
    font-weight: bold;
    font-size: 18px;
`;