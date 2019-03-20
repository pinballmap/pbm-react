import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { Text, View } from 'react-native'
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
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text>Filter Recent Activity by Type</Text>
                            <MaterialCommunityIcons name='close-circle' size={28} onPress={() => this.setState({ showModal: false })}/>
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
                    </ ConfirmationModal>
                }
                {locationTrackingServicesEnabled ? 
                    <Button
                        onPress={ () => this.setState({ showModal: true })}
                        containerStyle={{width:60}}
                        title="Filter"
                        accessibilityLabel="Filter"
                        titleStyle={{color: "#6a7d8a", fontSize: 16, fontWeight: 'bold'}}
                        clear={true}
                    /> : null
                }
            </View>
        )
    }
}

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
