import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { HeaderBackButton } from 'react-navigation'
import { Text, View } from 'react-native'

class EditLocationDetails extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#260204" onPress={() => navigation.goBack(null)} />,
            title: <Text>{navigation.getParam('name')}</Text>,
        }
    }

    render(){
        return(
            <View>
                <Text>Edit Location Screen</Text>
            </View>
        )
    }
}

// EditLocationDetails.propTypes = {

// }

const mapStateToProps = ({ location }) => ({ location })
export default connect(mapStateToProps)(EditLocationDetails)