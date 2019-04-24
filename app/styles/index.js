import { Platform } from 'react-native'
import { Constants } from 'expo'

export const headerStyle = {
    backgroundColor:'#f5fbff',
    height: Constants.statusBarHeight > 40 ? 60 : Platform.OS === 'android' ? 56 : Platform.OS === 'ios' ? 44 : null, 
    paddingTop: Constants.statusBarHeight > 40 ? 30 : '',                
}

export const headerTitleStyle = {
    textAlign: 'center',
    flexGrow: 1,
    alignSelf:'center',
}