import React, { useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import {
    Animated,
    StyleSheet,
    Text,
    Pressable,
    View,
} from 'react-native'
import { Icon } from '@rneui/base'
import { ThemeContext } from '../theme-context'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import FavoriteLocation from './FavoriteLocation'

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
    zip,
    saved = false,
}) => {
    const { theme } = useContext(ThemeContext)
    const fadeAnim = useRef(new Animated.Value(1)).current
    const s = getStyles(theme)
    const { name: type, icon, library } = locationType
    const numMachines = machines.length
    const cityState = state ? `${city}, ${state}` : city
    const removeFavorite = (cb) => {
        saved ?
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: true,
            }).start(() => {
                cb()
            }) : cb()
    }
    return (
        <Animated.View style={[s.containerStyle, {opacity: fadeAnim}]}>
            <Pressable
                style={({ pressed }) => [pressed ? s.pressed : s.notPressed]}
                onPress={() => navigation.navigate('LocationDetails', { id })}
            >
                <View style={s.flexi}>
                    <View style={{ zIndex: 10, flex: 1 }}>
                        <View style={s.locationNameContainer}>
                            <Text style={s.locationName}>{locationName}</Text>
                            <FavoriteLocation locationId={id} navigation={navigation} removeFavorite={removeFavorite} />
                        </View>
                        <View style={{ paddingHorizontal: 10, paddingBottom: 5 }}>
                            <Text style={[s.text2, s.marginS]} numberOfLines={1} ellipsizeMode={'tail'}>{`${street}, ${cityState} ${zip}`}</Text>
                            {type || distance ?
                                <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 10 }}>
                                    {type ? <View style={s.vertAlign}><Icon
                                        name={icon}
                                        type={library}
                                        color={theme.colors.text}
                                        size={30}
                                        style={s.icon}
                                    /><Text style={{ marginRight: 12, color: theme.colors.text }}> {type}</Text></View> : null}
                                    {distance ? <View style={s.vertAlign}><MaterialCommunityIcons name='compass-outline' style={s.icon} /><Text style={{ color: theme.colors.text }}> {distance}</Text></View> : null}
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
                                            <Text style={{ fontFamily: 'boldFont', fontSize: 17 }}>{title}</Text>
                                            <Text style={s.text}>{`${info}\n`}</Text>
                                        </Text>
                                    )
                                })
                                }
                                {numMachines > NUM_MACHINES_TO_SHOW ? <Text style={[s.plus, s.italic]}>{`Plus ${numMachines - NUM_MACHINES_TO_SHOW} more!`}</Text> : null}
                            </View>
                        </View>
                    </View>
                </View>
            </Pressable>
        </Animated.View>
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
        color: theme.pink4,
    },
    plus: {
        marginBottom: 10,
        color: theme.text2,
    },
    locationNameContainer: {
        backgroundColor: "#7f7fa0",
        marginBottom: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginTop: -2,
        marginHorizontal: -2,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    locationName: {
        fontFamily: 'boldFont',
        fontSize: 18,
        textAlign: 'center',
        color: "#f5f5ff"
    },
    margin: {
        marginTop: 10,
        marginLeft: 5,
    },
    marginS: {
        marginTop: 3,
        marginLeft: 5
    },
    vertAlign: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text2: {
        color: theme.text2
    },
    text: {
        color: theme.text
    },
    italic: {
        fontFamily: 'regularItalicFont',
    },
    pressed: {
        borderColor: theme.pink2,
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
        color: theme.colors.text,
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
    saved: PropTypes.bool,
    removeFavoriteLocation: PropTypes.func,
}

export default LocationCard