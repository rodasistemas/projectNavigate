import { create } from 'apisauce';
import { AsyncStorage } from 'react-native';

const api = create({
    baseURL: 'https://motoroute-project.herokuapp.com',
});
api.addAsyncRequestTransform(request => async(request)=>{
    const token = await AsyncStorage.getItem('@CodeApi:token');
    
    
    if (token){
       request.headers['Authorization'] = 'Bearer '+token;
       
    }
        
});

api.addResponseTransform(response => {
    
    if(!response.ok) throw response;
});

export default api;