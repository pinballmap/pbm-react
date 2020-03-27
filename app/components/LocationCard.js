import React, { useContext  } from 'react'
import PropTypes from 'prop-types'
import { 
    Platform,
    StyleSheet,
    Text, 
    TouchableOpacity, 
    View, 
} from 'react-native'
import { Card } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
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

    return(
        <Card containerStyle={s.containerStyle}>
            <TouchableOpacity onPress={() => navigation.navigate('LocationDetails', {id, locationName })}>
                <View style={s.flexi}>
                    <View style={{width: '100%',zIndex: 10}}>
                        <View style={s.locationNameContainer}>
                            <Text style={s.locationName}>{locationName}</Text>
                        </View>
                        <Text style={[s.gray,s.marginS]} numberOfLines={1} ellipsizeMode={'tail'}>{`${street}, ${city}, ${state} ${zip}`}</Text>                           
                        {type || distance ? 
                            <Text style={s.marginS}>
                                {type ? <Text style={s.gray}>{type}</Text> : null}
                                {type && distance ? <Text style={s.gray}> • </Text> : null }
                                {distance ? <Text style={[s.gray,s.marginS]}>{distance.toFixed(2)} mi</Text>: null}
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
                                        <Text style={{fontWeight: 'bold',fontSize: 15}}>{title}</Text>
                                        <Text>{`${info}\n`}</Text>
                                    </Text>
                                )})
                            }
                            {numMachines > NUM_MACHINES_TO_SHOW ? <Text style={[s.plus,s.italic]}>{`Plus ${numMachines - NUM_MACHINES_TO_SHOW} more!`}</Text> : null}
                        </View>
                    </View>
                    <Ionicons style={s.iconStyle} name="ios-arrow-dropright-circle"/>
                </View>
            </TouchableOpacity>
        </Card>
    )

}

const getStyles = (theme) => StyleSheet.create({
    containerStyle: {
        borderRadius: 5,
        marginBottom: 8,
        marginTop: 8,
        borderColor: theme.borderColor,
        backgroundColor: theme._fff
    },
    flexi: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        alignContent: 'space-around',
        marginBottom: -5
    },
    mName: {
        marginBottom: Platform.OS === 'ios' ? -10 : 0,
        color: theme.machineName
    },
    plus: {
        marginBottom: 10,
        color: theme.pbmText
    },
    locationNameContainer: {
        width: '100%',
        backgroundColor: theme.buttonColor,
        marginBottom: 5,
        padding: 5,
    },
    locationName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: theme.pbmText
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
        color: theme.buttonTextColor,
    },
    italic: {
        fontStyle: 'italic',
    },
    iconStyle: {
        fontSize: 32,
        color: theme._eee,
        marginRight: 0,
        position: "absolute",
        right: 0,
        zIndex: 5
    },
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
