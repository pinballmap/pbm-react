import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { 
    Platform,
    StyleSheet,
    Text, 
    View, 
} from 'react-native'
import { 
    Button, 
    ListItem,
    ThemeContext,
} from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ConfirmationModal from './ConfirmationModal'
import { setSelectedActivityFilter } from '../actions'

const FilterRecentActivity = ({setSelectedActivityFilter, query }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)
    
    const [showModal, setShowModal] = useState(false)

    const setRecentActivityFilter = (activity) => {
        setShowModal(false)
        setSelectedActivityFilter(activity)
    }

    const { selectedActivity } = query

    return(
        <View>
            {showModal && 
                    <ConfirmationModal>
                        <View style={s.header}>
                            <Text style={s.filterTitle}>Filter Recent Activity by Type</Text>
                            <MaterialCommunityIcons 
                                name='close-circle' 
                                size={34} 
                                onPress={() => setShowModal(false)}
                                style={s.xButton}
                            />
                        </View>
                        <View>
                            <ListItem
                                title={'New Machines'}
                                titleStyle={s.titleStyle}
                                leftAvatar={<MaterialCommunityIcons name='plus-box' size={28} color='#25a43e' />}
                                containerStyle={selectedActivity === 'new_lmx' ? s.containerBg : s.containerNotSelected}
                                onPress={() => setRecentActivityFilter('new_lmx')}
                            />
                            <ListItem
                                title={'New Conditions'}
                                titleStyle={s.titleStyle}
                                leftAvatar={<MaterialCommunityIcons name='comment-text' size={28} color='#1e9dff' />}
                                containerStyle={selectedActivity === 'new_condition' ? s.containerBg : s.containerNotSelected}
                                onPress={() => setRecentActivityFilter('new_condition')}
                            />
                            <ListItem
                                title={'Removed Machines'}
                                titleStyle={s.titleStyle}
                                leftAvatar={<MaterialCommunityIcons name='minus-box' size={28} color='#f53240' />}
                                containerStyle={selectedActivity === 'remove_machine' ? s.containerBg : s.containerNotSelected}
                                onPress={() => setRecentActivityFilter('remove_machine')}
                            />
                            <ListItem
                                title={'Scores'}
                                titleStyle={s.titleStyle}
                                leftAvatar={<MaterialCommunityIcons name='numeric' size={28} color='#ee970e' />}
                                containerStyle={selectedActivity === 'new_msx' ? s.containerBg : s.containerNotSelected}
                                onPress={() => setRecentActivityFilter('new_msx')}
                            />
                            <ListItem
                                title={'Confirmed Locations'}
                                titleStyle={s.titleStyle}
                                leftAvatar={<MaterialCommunityIcons name='clipboard-check' size={28} color='#cf4bde' />}
                                containerStyle={selectedActivity === 'confirm_location' ? s.containerBg : s.containerNotSelected}
                                onPress={() => setRecentActivityFilter('confirm_location')}
                            />
                        </View>
                    </ConfirmationModal>
            }
            <Button
                onPress={ () => setShowModal(true)}
                containerStyle={{width:60}}
                title="Filter"
                accessibilityLabel="Filter"
                titleStyle={{color: "#1e9dff", fontSize: 16, fontWeight: Platform.OS === 'ios' ? "600" : "400"}}
                type="clear"
            /> 
        </View>
    )

}

const getStyles = (theme) => StyleSheet.create({
    containerNotSelected: {
        backgroundColor: theme.backgroundColor,
    },
    header: {
        backgroundColor: theme._6a7d8a, 
        marginTop: -15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: 40,
        paddingVertical: 10,
    },
    filterTitle: {
        color: theme._f5fbff,
        textAlign: "center",
        fontSize: 14,
        fontWeight: 'bold'
    },
    xButton: {
        position:'absolute',
        right: Platform.OS === 'ios' ? -15 : 0,
        top: Platform.OS === 'ios' ? -15 : 0,
        color:'white',
    },
    titleStyle: {
        color: theme.pbmText
    },
    containerBg: {
        backgroundColor: theme.buttonColor
    }
})

FilterRecentActivity.propTypes = {
    query: PropTypes.object,
    setSelectedActivityFilter: PropTypes.func,
}

const mapStateToProps = ({ query }) => ({ query })
const mapDispatchToProps = (dispatch) => ({
    setSelectedActivityFilter: activity => dispatch(setSelectedActivityFilter(activity))
})
export default connect(mapStateToProps, mapDispatchToProps)(FilterRecentActivity)
