import React, { useContext  } from 'react'
import PropTypes from 'prop-types'
import {
    StyleSheet,
    Text,
    Pressable,
    View,
} from 'react-native'
import { Icon } from 'react-native-elements'
import { ThemeContext } from '../theme-context'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const NUM_MACHINES_TO_SHOW = 5

const LocationCard = ({
    distance,
    id,
    machines = [],
    name: locationName,
    navigation,
    state,
    street,
    city,
    locationType,
    zip
}) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)
    const { name: type, icon, library } = locationType
    const numMachines = machines.length
    return(
        <Pressable
            style={({ pressed }) => [{},s.containerStyle,pressed ? s.pressed : s.notPressed]}
            onPress={() => navigation.navigate('LocationDetails', {id, locationName })}
        >
            <View style={s.flexi}>
                <View style={{zIndex: 10,flex:1}}>
                    <View style={s.locationNameContainer}>
                        <Text style={s.locationName}>{locationName}</Text>
                    </View>
                    <View style={{paddingHorizontal:10,paddingBottom:5}}>
                        <Text style={[s.text2,s.marginS]} numberOfLines={1} ellipsizeMode={'tail'}>{`${street}, ${city}, ${state} ${zip}`}</Text>
                        {type || distance ?
                            <View style={{flexDirection: 'row',marginTop:4,marginLeft:5}}>
                                {type ? <View style={s.vertAlign}><Icon
                                    name={icon}
                                    type={library}
                                    color={theme.indigo4}
                                    size={30}
                                    style={s.icon}
                                /><Text style={[s.text3,s.marginH]}> {type}</Text></View> : null}
                                {distance ? <View style={s.vertAlign}><MaterialCommunityIcons name='compass-outline' style={s.icon} /><Text style={s.text3}> {distance}</Text></View> : null}
                            </View> : null
                        }
                        <View style={s.margin}>
                            {machines.slice(0, NUM_MACHINES_TO_SHOW).map(m => {
                                const idx = typeof m === 'string' ? m.lastIndexOf('(') : -1
                                const title = typeof m === 'string' ? m.slice(0, idx) : m.name
                                const info = typeof m === 'string' ? m.slice(idx) : ` (${m.manufacturer}, ${m.year})`
                                const key = typeof m === 'string' ? m : `${m.name}-${m.manufacturer}-${m.year}`
                                return (
                                    <Text key={key} style={s.mName}>
                                        <Text style={{fontFamily: 'boldFont',fontSize: 17}}>{title}</Text>
                                        <Text style={s.text2}>{`${info}\n`}</Text>
                                    </Text>
                                )})
                            }
                            {numMachines > NUM_MACHINES_TO_SHOW ? <Text style={[s.plus,s.italic]}>{`Plus ${numMachines - NUM_MACHINES_TO_SHOW} more!`}</Text> : null}
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    )

}

const getStyles = (theme) => StyleSheet.create({
    containerStyle: {
        borderRadius: 15,
        marginBottom: 12,
        marginTop: 12,
        marginRight: 20,
        marginLeft: 20,
        backgroundColor: theme.white,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 6,
        shadowColor: theme.shadow,
    },
    flexi: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'space-around',
    },
    mName: {
        marginBottom: -10,
        color: theme.text
    },
    plus: {
        marginBottom: 10,
        color: theme.text2
    },
    locationNameContainer: {
        backgroundColor: theme.blue1,
        marginBottom: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingVertical: 10,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: -2,
        marginHorizontal: -2,
    },
    locationName: {
        fontFamily: 'boldFont',
        fontSize: 18,
        textAlign: 'center',
        color: theme.text
    },
    margin: {
        marginTop: 10,
        marginLeft: 5,
    },
    marginS: {
        marginTop: 3,
        marginLeft: 5
    },
    marginH: {
        marginRight: 12,
    },
    vertAlign: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text2: {
        color: theme.text2
    },
    text3: {
        color: theme.text3,
    },
    italic: {
        fontFamily: 'regularItalicFont',
    },
    iconStyle: {
        fontSize: 32,
        color: theme.white,
        marginRight: 0,
        position: "absolute",
        right: 0,
        zIndex: 5
    },
    pressed: {
        borderColor: theme.blue1,
        borderWidth: 2,
        shadowColor: 'transparent',
        opacity: 0.8,
        elevation: 0,
    },
    notPressed: {
        borderColor: 'transparent',
        borderWidth: 2,
        shadowColor: theme.shadow,
        opacity: 1.0,
        elevation: 6,
    },
    icon: {
        fontSize: 20,
        color: theme.indigo4,
        opacity: 0.8,
        marginRight: 1
    },
})

LocationCard.propTypes = {
    machines: PropTypes.array,
    locationType: PropTypes.object,

    type: PropTypes.string,
    zip: PropTypes.string,
    state: PropTypes.string,
    distance: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.number,
    street: PropTypes.string,
    city: PropTypes.string,
    navigation: PropTypes.object,
}

export default LocationCard
