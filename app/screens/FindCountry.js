import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import {
    Keyboard,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'
import { SearchBar } from 'react-native-elements'
import { ThemeContext } from '../theme-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FlatList } from 'react-native-gesture-handler'
import {
    HeaderBackButton,
    Text,
} from '../components'
import countries from '../utils/countries'

const FindCountry = ({ navigation }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    const [selectedCountries, setSelectedCountries] = useState(countries)
    const [query, setQuery] = useState('')

    const handleSearch = (search = '') => {
        const formattedQuery = search.toLowerCase()
        const countries = selectedCountries.filter(o => o.name.toLowerCase().includes(formattedQuery))
        setQuery(search)
        setSelectedCountries(countries)
    }

    const _selectCountry = (countryName, countryCode) => {
        navigation.getParam('setSelected')(countryName, countryCode)
        navigation.goBack()
    }

    const renderRow = ({ item, index}) => (
        <Pressable
            onPress={() => _selectCountry(item.name, item.code)}
        >
            {({ pressed }) => (
                <View style={[{padding: 8}, pressed ? {backgroundColor: theme.base3,opacity: 0.8} : {backgroundColor: index % 2 === 0 ? theme.base1 : theme.base3,opacity: 1}]}>
                    <Text style={{fontSize: 18}}>{item.name}</Text>
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
                clearIcon={<MaterialCommunityIcons name='close-circle' size={20} color={theme.indigo4} onPress={() => handleSearch()} />}
                onChangeText={handleSearch}
                inputStyle={{color:theme.text}}
                value={query}
                inputContainerStyle={s.filterInput}
                containerStyle={{backgroundColor:theme.base1,borderBottomWidth:0,borderTopWidth:0}}
            />
            <FlatList {...keyboardDismissProp}
                data={selectedCountries}
                renderItem={renderRow}
                keyExtractor={_keyExtractor}
                style={{backgroundColor:theme.base1}}
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

FindCountry.navigationOptions = ({ navigation, theme }) => ({
    headerLeft: () => <HeaderBackButton navigation={navigation} />,
    title: 'Select Country',
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#1d1c1d' : '#f5f5ff',
        borderBottomWidth: 0,
        elevation: 0,
        shadowColor: 'transparent'
    },
    headerTitleStyle: {
        textAlign: 'center',
        fontFamily: 'boldFont',
    },
    headerTintColor: theme === 'dark' ? '#fee7f5' : '#616182',
    gestureEnabled: true
})

FindCountry.propTypes = {
    navigation: PropTypes.object,
}

export default FindCountry
