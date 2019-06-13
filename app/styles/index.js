import { Platform, Dimensions } from 'react-native'
import { Constants } from 'expo'

let deviceWidth = Dimensions.get('window').width

export const headerStyle = {
    backgroundColor:'#f5fbff',
    height: Platform.OS === 'ios' ? 44 : 56, 
}

export const headerTitleStyle = {
    textAlign: 'center',
    flexGrow: 1,
    alignSelf:'center',
    width: Platform.OS === 'ios' ? deviceWidth - 100 : null
}