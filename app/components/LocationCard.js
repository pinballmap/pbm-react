import React, { useContext  } from 'react'
import PropTypes from 'prop-types'
import {
    Platform,
    StyleSheet,
    Text,
    Pressable,
    View,
} from 'react-native'
import { ThemeContext } from '../theme-context'

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
    type,
    zip
}) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    const numMachines = machines.length

    const displayDistance = distance > 99 ? Math.round(distance) : distance.toFixed(1)

    return(
        <Pressable
            style={({ pressed }) => [{},s.containerStyle,pressed ? s.pressed : s.NotPressed]}
            onPress={() => navigation.navigate('LocationDetails', {id, locationName })}
        >
            <View style={s.flexi}>
                <View style={{zIndex: 10,flex:1}}>
                    <View style={s.locationNameContainer}>
                        <Text style={s.locationName}>{locationName}</Text>
                    </View>
                    <View style={{paddingHorizontal:10,paddingBottom:5}}>
                        <Text style={[s.gray,s.marginS]} numberOfLines={1} ellipsizeMode={'tail'}>{`${street}, ${city}, ${state} ${zip}`}</Text>
                        {type || distance ?
                            <Text style={s.marginS}>
                                {type ? <Text style={s.gray}>{type}</Text> : null}
                                {type && distance ? <Text style={s.gray}> • </Text> : null }
                                {distance ? <Text style={[s.gray,s.marginS]}>{displayDistance} mi</Text>: null}
                            </Text> : null
                        }
                        <View style={s.margin}>
                            {machines.slice(0, NUM_MACHINES_TO_SHOW).map(m => {
                                const idx = typeof m === 'string' ? m.lastIndexOf('(') : -1
                                const title = typeof m === 'string' ? m.slice(0, idx) : m.name
                                const info = typeof m === 'string' ? m.slice(idx) : ` (${m.manufacturer}, ${m.year})`
                                const key = typeof m === 'string' ? m : `${m.name}-${m.manufacturer}-${m.year}`
                                return (
                                    <Text key={key} style={s.mName}>
                                        <Text style={{fontWeight: 'bold',fontSize: 17}}>{title}</Text>
                                        <Text>{`${info}\n`}</Text>
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
        shadowColor: theme.shadow
    },
    flexi: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'space-around',
    },
    mName: {
        marginBottom: Platform.OS === 'ios' ? -10 : 0,
        color: theme.text
    },
    plus: {
        marginBottom: 10,
        color: theme.text
    },
    locationNameContainer: {
        backgroundColor: theme.blue1,
        marginBottom: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingVertical: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    locationName: {
        fontWeight: 'bold',
        fontSize: 20,
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
    gray: {
        color: theme.orange7,
    },
    italic: {
        fontStyle: 'italic',
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
        borderWidth: 1,
        shadowColor: 'transparent',
        opacity: 0.8,
        elevation: 0,
    },
    notPressed: {
        borderColor: 'transparent',
        borderWidth: 0,
        shadowColor: theme.shadow,
        opacity: 1.0,
        elevation: 6,
    }
})

LocationCard.propTypes = {
    machines: PropTypes.array,
    type: PropTypes.string,
    zip: PropTypes.string,
    state: PropTypes.string,
    distance: PropTypes.number,
    name: PropTypes.string,
    id: PropTypes.number,
    street: PropTypes.string,
    city: PropTypes.string,
    navigation: PropTypes.object,
}

export default LocationCard
