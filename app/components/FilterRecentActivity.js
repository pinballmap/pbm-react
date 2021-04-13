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
    Avatar,
    Button,
    ListItem,
} from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ConfirmationModal from './ConfirmationModal'
import { setSelectedActivityFilter } from '../actions'
import { ThemeContext } from '../theme-context'

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
                            <Text style={s.filterTitle}>Filter Recent Activity</Text>
                            <MaterialCommunityIcons
                                name='close-circle'
                                size={34}
                                onPress={() => setShowModal(false)}
                                style={s.xButton}
                            />
                        </View>
                        <View>
                            <ListItem
                                containerStyle={selectedActivity === 'new_lmx' ? s.containerBg : s.containerNotSelected}
                                onPress={() => setRecentActivityFilter('new_lmx')}>
                                <Avatar>
                                    {<MaterialCommunityIcons name='plus-box' size={32} color='#58a467' />}
                                </Avatar>
                                <ListItem.Content>
                                    <ListItem.Title style={s.titleStyle}>
                                        <Text>{'New Machines'}</Text>
                                    </ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                            <ListItem
                                containerStyle={selectedActivity === 'new_condition' ? s.containerBg : s.containerNotSelected}
                                onPress={() => setRecentActivityFilter('new_condition')}>
                                <Avatar>
                                    {<MaterialCommunityIcons name='comment-text' size={32} color='#6cbffe' />}
                                </Avatar>
                                <ListItem.Content>
                                    <ListItem.Title style={s.titleStyle}>
                                        <Text>{'New Conditions'}</Text>
                                    </ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                            <ListItem
                                containerStyle={selectedActivity === 'remove_machine' ? s.containerBg : s.containerNotSelected}
                                onPress={() => setRecentActivityFilter('remove_machine')}>
                                <Avatar>
                                    {<MaterialCommunityIcons name='minus-box' size={32} color='#f56f79' />}
                                </Avatar>
                                <ListItem.Content>
                                    <ListItem.Title style={s.titleStyle}>
                                        <Text>{'Removed Machines'}</Text>
                                    </ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                            <ListItem
                                containerStyle={selectedActivity === 'new_msx' ? s.containerBg : s.containerNotSelected}
                                onPress={() => setRecentActivityFilter('new_msx')}>
                                <Avatar>
                                    {<MaterialCommunityIcons name='numeric' size={32} color='#eeb152' />}
                                </Avatar>
                                <ListItem.Content>
                                    <ListItem.Title style={s.titleStyle}>
                                        <Text>{'Scores'}</Text>
                                    </ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                            <ListItem
                                containerStyle={selectedActivity === 'confirm_location' ? s.containerBg : s.containerNotSelected}
                                onPress={() => setRecentActivityFilter('confirm_location')}>
                                <Avatar>
                                    {<MaterialCommunityIcons name='clipboard-check' size={32} color='#d473df' />}
                                </Avatar>
                                <ListItem.Content>
                                    <ListItem.Title style={s.titleStyle}>
                                        <Text>{'Confirmed Locations'}</Text>
                                    </ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        </View>
                    </ConfirmationModal>
            }
            <Button
                onPress={ () => setShowModal(true)}
                containerStyle={{width:60}}
                title="Filter"
                accessibilityLabel="Filter"
                titleStyle={{color: theme.blue2, fontSize: 16, fontWeight: Platform.OS === 'ios' ? "600" : "400"}}
                type="clear"
            />
        </View>
    )

}

const getStyles = (theme) => StyleSheet.create({
    containerNotSelected: {
        backgroundColor: theme.neutral,
    },
    header: {
        backgroundColor: theme.blue1,
        marginTop: -15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: 40,
        paddingVertical: 10,
    },
    filterTitle: {
        color: theme.orange8,
        textAlign: "center",
        fontSize: 16,
        fontWeight: 'bold'
    },
    xButton: {
        position: 'absolute',
        right: -15,
        top: -15,
        color: theme.red2,
    },
    titleStyle: {
        color: theme.text
    },
    containerBg: {
        backgroundColor: theme.blue2
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
