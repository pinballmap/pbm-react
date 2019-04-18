import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { 
    StyleSheet,
    Text, 
    View, 
} from 'react-native'
import { Button, ListItem } from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ConfirmationModal } from './'
import { setSelectedActivityFilter } from '../actions'

class FilterRecentActivity extends Component {
    state = { showModal: false }

    setRecentActivityFilter(activity) {
        this.setState({ showModal: false })
        this.props.setSelectedActivityFilter(activity)
    }

    render(){
        const { showModal } = this.state
        const { selectedActivity } = this.props.query
        const { locationTrackingServicesEnabled } = this.props.user

        return(
            <View>
                {showModal && 
                    <ConfirmationModal>
                        <View style={s.header}>
                            <Text style={s.filterTitle}>Filter Recent Activity by Type</Text>
                            <MaterialCommunityIcons 
                                name='close-circle' 
                                size={34} 
                                onPress={() => this.setState({ showModal: false })}
                                style={{position:'absolute',right:-15,top:-15,color:'white'}}
                            />
                        </View>
                        <View>
                            <ListItem
                                title={'New Machines'}
                                titleStyle={{color:'#000e18'}}
                                leftAvatar={<MaterialCommunityIcons name='plus-box' size={28} color='#4e7b57' />}
                                containerStyle={selectedActivity === 'new_lmx' ? {backgroundColor: '#D3ECFF'} : {}}
                                onPress={() => this.setRecentActivityFilter('new_lmx')}
                            />
                            <ListItem
                                title={'New Conditions'}
                                titleStyle={{color:'#000e18'}}
                                leftAvatar={<MaterialCommunityIcons name='comment-text' size={28} color='#458284' />}
                                containerStyle={selectedActivity === 'new_condition' ? {backgroundColor: '#D3ECFF'} : {}}
                                onPress={() => this.setRecentActivityFilter('new_condition')}
                            />
                            <ListItem
                                title={'Removed Machines'}
                                titleStyle={{color:'#000e18'}}
                                leftAvatar={<MaterialCommunityIcons name='minus-box' size={28} color='#854444' />}
                                containerStyle={selectedActivity === 'remove_machine' ? {backgroundColor: '#D3ECFF'} : {}}
                                onPress={() => this.setRecentActivityFilter('remove_machine')}
                            />
                            <ListItem
                                title={'Scores'}
                                titleStyle={{color:'#000e18'}}
                                leftAvatar={<MaterialCommunityIcons name='numeric' size={28} color='#986c31' />}
                                containerStyle={selectedActivity === 'new_msx' ? {backgroundColor: '#D3ECFF'} : {}}
                                onPress={() => this.setRecentActivityFilter('new_msx')}
                            />
                            <ListItem
                                title={'Confirmed Locations'}
                                titleStyle={{color:'#000e18'}}
                                leftAvatar={<MaterialCommunityIcons name='clipboard-check' size={28} color='#7a4f71' />}
                                containerStyle={selectedActivity === 'confirm_location' ? {backgroundColor: '#D3ECFF'} : {}}
                                onPress={() => this.setRecentActivityFilter('confirm_location')}
                            />
                        </View>
                    </ConfirmationModal>
                }
                {locationTrackingServicesEnabled ? 
                    <Button
                        onPress={ () => this.setState({ showModal: true })}
                        containerStyle={{width:60}}
                        title="Filter"
                        accessibilityLabel="Filter"
                        titleStyle={{color: "#1e9dff", fontSize: 16, fontWeight: 'bold'}}
                        clear={true}
                    /> : null
                }
            </View>
        )
    }
}

const s = StyleSheet.create({

    header: {
        backgroundColor: "#6a7d8a", 
        marginTop: -15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: 40,
        paddingTop: 10,
        paddingBottom: 10
    },
    filterTitle: {
        color: "#f5fbff",
        textAlign: "center",
        fontSize: 14,
        fontWeight: 'bold'
    }

})

FilterRecentActivity.propTypes = {
    query: PropTypes.object,
    setSelectedActivityFilter: PropTypes.func,
    user: PropTypes.object, 
}

const mapStateToProps = ({ user, query }) => ({ user, query })
const mapDispatchToProps = (dispatch) => ({
    setSelectedActivityFilter: activity => dispatch(setSelectedActivityFilter(activity))
})
export default connect(mapStateToProps, mapDispatchToProps)(FilterRecentActivity)
