import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import {
    Keyboard,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'
import { SearchBar } from '@rneui/base'
import { ThemeContext } from '../theme-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
    Text,
} from '../components'
import countries from '../utils/countries'
import { FlashList } from "@shopify/flash-list"

const FindCountry = ({ navigation, route }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)
    const { previous_screen } = route.params

    const [selectedCountries, setSelectedCountries] = useState(countries)
    const [query, setQuery] = useState('')

    const handleSearch = (search = '') => {
        const formattedQuery = search.toLowerCase()
        setQuery(search)
        setSelectedCountries(countries.filter(o => o.name.toLowerCase().includes(formattedQuery)))
    }

    const _selectCountry = (countryName, countryCode) => {
        navigation.navigate({
            name: previous_screen,
            params: { setCountryName: countryName, setCountryCode: countryCode },
            merge: true,
        })
    }

    const renderRow = ({ item, index }) => (
        <Pressable
            onPress={() => _selectCountry(item.name, item.code)}
        >
            {({ pressed }) => (
                <View style={[{ padding: 8 }, pressed ? { backgroundColor: theme.base4, opacity: 0.8 } : { backgroundColor: index % 2 === 0 ? theme.base1 : theme.base3, opacity: 1 }]}>
                    <Text style={{ fontSize: 18 }}>{item.name}</Text>
                </View>
            )}
        </Pressable>
    )

    const _keyExtractor = country => `${country.code}`
    const keyboardDismissProp = Platform.OS === "ios" ? { keyboardDismissMode: "on-drag" } : { onScrollBeginDrag: Keyboard.dismiss }

    return (
        <>
            <SearchBar
                lightTheme={theme.theme !== 'dark'}
                placeholder='Filter countries...'
                placeholderTextColor={theme.indigo4}
                platform='default'
                searchIcon={<MaterialIcons name='search' size={25} color={theme.indigo4} />}
                clearIcon={<MaterialCommunityIcons name='close-circle' size={20} color={theme.indigo4} />}onPress={() => handleSearch()}
                onChangeText={handleSearch}
                inputStyle={{ color: theme.text, fontFamily: 'regularFont' }}
                value={query}
                inputContainerStyle={s.filterInput}
                containerStyle={{ backgroundColor: theme.base1, borderBottomWidth: 0, borderTopWidth: 0 }}
            />
            <FlashList {...keyboardDismissProp}
                data={selectedCountries}
                estimatedItemSize={41}
                renderItem={renderRow}
                keyExtractor={_keyExtractor}
                contentContainerStyle={{ backgroundColor: theme.base1, paddingBottom: 20 }}
            />
        </>)
}

const getStyles = theme => StyleSheet.create({
    filterInput: {
        height: 35,
        backgroundColor: theme.white,
        borderRadius: 25,
        borderColor: theme.indigo4,
        borderWidth: 1,
        borderBottomWidth: 1,
        marginHorizontal: 10
    },
})

FindCountry.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
}

export default FindCountry
