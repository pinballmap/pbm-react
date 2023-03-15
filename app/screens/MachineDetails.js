import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Dimensions,
    Image,
    Keyboard,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ThemeContext } from '../theme-context'
import { EvilIcons } from '@expo/vector-icons'
import {
    addMachineCondition,
    addMachineScore,
    removeMachineFromLocation
} from '../actions/location_actions'
import {
    formatInputNumWithCommas,
    formatNumWithCommas,
    removeCommasFromNum
} from '../utils/utilityFunctions'
import {
    ActivityIndicator,
    PbmButton,
    RemoveMachineModal,
    RemoveMachine,
    Screen,
    Text,
    WarningButton,
} from '../components'
import * as WebBrowser from 'expo-web-browser'
import Constants from 'expo-constants'

const moment = require('moment')

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

class MachineDetails extends Component {
    state = {
        showAddConditionModal: false,
        conditionText: '',
        showAddScoreModal: false,
        score: '',
        showRemoveMachineModal: false,
        isLoadingImage: false,
        imageLoaded: false,
    }

    cancelAddCondition = () => this.setState({ showAddConditionModal: false, conditionText: '' })

    cancelAddScore = () => this.setState({ showAddScoreModal: false, score: '' })

    addCondition = (lmx) => {
        this.props.addMachineCondition(this.state.conditionText, lmx)
        this.setState({
            showAddConditionModal: false,
            conditionText: '',
        })
    }

    addScore = (lmx) => {
        this.props.addMachineScore(removeCommasFromNum(this.state.score), lmx)
        this.setState({ showAddScoreModal: false, score: '' })
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: ({ navigation }) => <RemoveMachine navigation={navigation} />
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.curLmx && !this.props.location.curLmx)
            this.props.navigation.goBack()
    }

    render() {
        const { curLmx, location } = this.props.location

        if (!curLmx) {
            return (
                <ActivityIndicator />
            )
        }

        const { id: userId, loggedIn } = this.props.user
        const { opdb_id, opdb_img, opdb_img_height, opdb_img_width, ipdb_link, name: machineName } = this.props.machineDetails
        const pintipsUrl = opdb_id && `http://pintips.net/opdb/${opdb_id}`
        const ipdbUrl = ipdb_link ?? `http://ipdb.org/search.pl?name=${encodeURIComponent(machineName)};qh=checked;searchtype=advanced`
        const opdb_resized = opdb_img_width - (deviceWidth - 48)
        const opdb_img_height_calc = (deviceWidth - 48) * (opdb_img_height / opdb_img_width)
        const opdbImgHeight = opdb_resized > 0 ? opdb_img_height_calc : opdb_img_height
        const opdbImgWidth = opdb_resized > 0 ? deviceWidth - 48 : opdb_img_width

        const operator = location.operator_id && this.props.operators.operators.find(operator => operator.id === location.operator_id)
        const operatorHasEmail = operator && operator.operator_has_email ? operator.operator_has_email : false

        const mostRecentComments = curLmx.machine_conditions.length > 0 ? curLmx.machine_conditions.slice(0, 5) : undefined
        const scores = curLmx.machine_score_xrefs.sort((a, b) => (a.score > b.score) ? -1 : ((b.score > a.score) ? 1 : 0)).slice(0, 10)
        const { score: userHighScore } = curLmx.machine_score_xrefs.filter(score => score.user_id === userId).reduce((prev, current) => (prev.score > current.score) ? prev : current, -1)
        const keyboardDismissProp = Platform.OS === "ios" ? { keyboardDismissMode: "on-drag" } : { onScrollBeginDrag: Keyboard.dismiss }
        const { isLoadingImage, imageLoaded } = this.state

        return (
            <ThemeContext.Consumer>
                {({ theme }) => {
                    const s = getStyles(theme)
                    return (
                        <Screen>
                            <Modal
                                animationType="slide"
                                transparent={false}
                                visible={this.state.showAddConditionModal}
                                onRequestClose={() => { }}
                            >
                                <Pressable onPress={() => { Keyboard.dismiss() }}>
                                    <KeyboardAwareScrollView {...keyboardDismissProp} enableResetScrollToCoords={false} keyboardShouldPersistTaps="handled" style={s.backgroundColor}>
                                        <View style={s.verticalAlign}>
                                            <Text style={s.modalTitle}>Comment on <Text style={s.modalPurple2}>{machineName}</Text> at <Text style={s.modalPurple}>{location.name}</Text></Text>
                                            <TextInput
                                                multiline={true}
                                                numberOfLines={4}
                                                underlineColorAndroid='transparent'
                                                onChangeText={conditionText => this.setState({ conditionText })}
                                                style={[{ padding: 5, height: 100 }, s.textInput, s.radius10]}
                                                placeholder={"Leave a comment! And please don't comment saying a machine is gone. Just remove it!"}
                                                placeholderTextColor={theme.indigo4}
                                                textAlignVertical='top'
                                            />
                                            {!!location.operator_id && operatorHasEmail &&
                                                <Text style={s.modalSubText}>This operator has elected to be notified about machine comments. Please be descriptive about machine issues and also considerate of the time and effort needed to maintain machines!</Text>
                                            }
                                            <Text style={[s.modalSubText,s.purple,s.margin8]}><Text style={s.bold}>Operators:</Text> if you've fixed an issue, please leave a comment saying so. But please do not comment simply to "whitewash" people's comments that bother you.</Text>
                                            <PbmButton
                                                title={'Add Condition'}
                                                disabled={this.state.conditionText.length === 0}
                                                onPress={() => this.addCondition(curLmx.id)}
                                            />
                                            <WarningButton
                                                title={'Cancel'}
                                                onPress={this.cancelAddCondition}
                                            />
                                        </View>
                                    </KeyboardAwareScrollView>
                                </Pressable>
                            </Modal>
                            <Modal
                                animationType="slide"
                                transparent={false}
                                visible={this.state.showAddScoreModal}
                                onRequestClose={() => { }}
                            >
                                <Pressable onPress={() => { Keyboard.dismiss() }}>
                                    <KeyboardAwareScrollView {...keyboardDismissProp} enableResetScrollToCoords={false} keyboardShouldPersistTaps="handled" style={s.backgroundColor}>
                                        <View style={s.verticalAlign}>
                                            <Text style={s.modalTitle}>Add your high score to <Text style={s.modalPurple2}>{machineName}</Text> at <Text style={s.modalPurple}>{location.name}</Text></Text>
                                            <TextInput
                                                style={[{ height: 40, textAlign: 'center' }, s.textInput, s.radius10]}
                                                keyboardType='numeric'
                                                underlineColorAndroid='transparent'
                                                onChangeText={score => this.setState({ score })}
                                                defaultValue={formatInputNumWithCommas(this.state.score)}
                                                returnKeyType="done"
                                                placeholder={'123...'}
                                                placeholderTextColor={theme.indigo4}
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                            />
                                            <PbmButton
                                                title={'Add Score'}
                                                disabled={this.state.score.length === 0}
                                                onPress={() => this.addScore(curLmx.id)}
                                            />
                                            <WarningButton
                                                title={'Cancel'}
                                                onPress={this.cancelAddScore}
                                            />
                                        </View>
                                    </KeyboardAwareScrollView>
                                </Pressable>
                            </Modal>
                            {this.state.showRemoveMachineModal && <RemoveMachineModal closeModal={() => this.setState({ showRemoveMachineModal: false })} />}
                            <ScrollView style={{ marginBottom: 20}}>
                                <View style={s.machineNameContainer}>
                                    <Text style={s.machineName}>{machineName}</Text>
                                    <Text style={s.locationName}>{location.name}</Text>
                                </View>
                                <View style={s.addedContainer}>
                                    <Text style={s.addedText}>{`Added: ${moment(curLmx.created_at).format('MMM DD, YYYY')}`}</Text>
                                    {curLmx.created_at != curLmx.updated_at ? <Text style={s.addedText}>{`Last updated: ${moment(curLmx.updated_at).format('MMM DD, YYYY')}`}</Text> : ''}
                                </View>
                                {!!opdb_img &&
                                    <View style={{ alignItems: "center" }}>
                                        <View style={[s.imageContainer, { width: opdbImgWidth + 8 }]}>
                                            <Image
                                                style={[{ width: opdbImgWidth, height: opdbImgHeight, resizeMode: 'cover', borderRadius: 10 }, isLoadingImage && { display: "none" }]}
                                                source={{ uri: opdb_img }}
                                                onLoadStart={() => !imageLoaded && this.setState({ isLoadingImage: true })}
                                                onLoadEnd={() => this.setState({ imageLoaded: true, isLoadingImage: false })}
                                            />
                                            {isLoadingImage && <ActivityIndicator />}
                                        </View>
                                    </View>
                                }
                                <View style={s.containerStyle}>
                                    <View style={s.locationNameContainer}>
                                        <Text style={s.sectionTitle}>Machine Comments</Text>
                                    </View>
                                    {mostRecentComments ?
                                        mostRecentComments.map(commentObj => {
                                            const { comment, created_at, username } = commentObj
                                            return <View
                                                style={[s.listContainerStyle, s.hr]}
                                                key={commentObj.id}>
                                                <Text style={[{ marginRight: 5 }, s.conditionText]}>
                                                    {`"${comment}"`}
                                                </Text>
                                                <Text style={[s.subtitleStyle, s.subtitleMargin]}>
                                                    {`${moment(created_at).format('MMM DD, YYYY')} ${username ? `by ` : ''}`}
                                                    {!!username && <Text style={[s.subtitleStyle,s.username]}>{username}</Text>}
                                                </Text>
                                            </View>
                                        }) :
                                        <Text style={s.noneYet}>No machine comments yet</Text>
                                    }
                                    <PbmButton
                                        title={'Add a New Comment'}
                                        onPress={loggedIn ?
                                            () => this.setState({ showAddConditionModal: true }) :
                                            () => this.props.navigation.navigate('Login')}
                                    />
                                    {!!location.operator_id &&
                                        operatorHasEmail &&
                                        <View style={[s.operatorEmail, s.operatorHasEmail]}>
                                            <Text style={s.operatorComments}>This operator receives machine comments!</Text>
                                        </View>
                                    }
                                    {!!location.operator_id &&
                                        !operatorHasEmail &&
                                        <View style={[s.operatorEmail, s.operatorNotEmail]}>
                                            <Text style={s.operatorComments}>This operator does not receive machine comments</Text>
                                        </View>
                                    }
                                </View>
                                <View style={s.containerStyle}>
                                    <View style={s.locationNameContainer}>
                                        <Text style={s.sectionTitle}>High Scores</Text>
                                    </View>
                                    {!!userHighScore &&
                                        <View>
                                            <Text style={s.userScoreTitle}>{`Your personal best on this machine is`}</Text>
                                            <Text style={s.userHighScore}>{formatNumWithCommas(userHighScore)}</Text>
                                        </View>
                                    }
                                    {scores.length > 0 ?
                                        scores.map(scoreObj => {
                                            const { id, score, created_at, username } = scoreObj

                                            return (
                                                <View
                                                    style={[s.listContainerStyle, s.hr]}
                                                    key={id}>
                                                    <Text style={s.scoreText}>
                                                        {formatNumWithCommas(score)}
                                                    </Text>
                                                    <Text style={[s.subtitleStyle, s.subtitleMargin]}>
                                                        {`${moment(created_at).format('MMM DD, YYYY')} by `}<Text style={[s.subtitleStyle,s.username]}>{`${username}`}</Text>
                                                    </Text>
                                                </View>)
                                        })
                                        : <Text style={s.noneYet}>No scores yet</Text>
                                    }
                                    <PbmButton
                                        title={'Add Your Score'}
                                        onPress={loggedIn ?
                                            () => this.setState({ showAddScoreModal: true }) :
                                            () => this.props.navigation.navigate('Login')
                                        }
                                    />
                                </View>
                                {!!pintipsUrl &&
                                    <View style={[s.externalLinkContainer,s.marginB15]}>
                                        <Text style={s.externalLink} onPress={() => WebBrowser.openBrowserAsync(pintipsUrl)}>View playing tips on PinTips</Text><EvilIcons name='external-link' style={s.externalIcon} />
                                    </View>
                                }
                                <View style={s.externalLinkContainer}>
                                    <Text style={s.externalLink} onPress={() => WebBrowser.openBrowserAsync(ipdbUrl)}>View on IPDB</Text><EvilIcons name='external-link' style={s.externalIcon} />
                                </View>
                                <WarningButton
                                    title={'Remove Machine'}
                                    onPress={loggedIn ?
                                        () => this.setState({ showRemoveMachineModal: true }) :
                                        () => this.props.navigation.navigate('Login')
                                    }
                                />
                            </ScrollView>
                        </Screen>
                    )
                }}
            </ThemeContext.Consumer>
        )
    }
}

const getStyles = theme => StyleSheet.create({
    backgroundColor: {
        backgroundColor: theme.base1
    },
    machineName: {
        textAlign: 'center',
        fontFamily: 'blackFont',
        fontSize: 24,
        color: theme.pink1
    },
    locationName: {
        marginTop: 5,
        textAlign: 'center',
        fontSize: 20,
        color: theme.text3,
        fontFamily: 'regularBoldFont'
    },
    machineNameContainer: {
        marginBottom: 5,
        marginHorizontal: 38,
        borderWidth: 0,
        paddingVertical: 5,
        textAlign: 'center',
        marginTop: Platform.OS === 'android' ? Constants.statusBarHeight + 6 : Constants.statusBarHeight + 1
    },
    addedContainer: {
        marginTop: 5,
        marginBottom: 10,
    },
    addedText: {
        textAlign: 'center',
        fontSize: 16,
        color: theme.text3,
        fontFamily: 'regularFont'
    },
    externalLink: {
        fontSize: 16,
        fontFamily: 'regularBoldFont',
        color: theme.purple2,
        textAlign: 'center',
    },
    externalLinkContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    externalIcon: {
        fontSize: 24,
        color: theme.text2,
    },
    marginB15: {
        marginBottom: 15
    },
    margin40: {
        marginHorizontal: 40,
        marginVertical: 15,
    },
    conditionText: {
        color: theme.text2,
        fontSize: 16,
        marginTop: 5
    },
    scoreText: {
        color: theme.text2,
        fontSize: 18,
        marginTop: 5,
        fontFamily: 'regularFont',
    },
    noneYet: {
        textAlign: 'center',
        paddingHorizontal: 15,
        color: theme.text3,
        paddingVertical: 5,
        fontFamily: 'regularFont',
        fontSize: 16
    },
    textInput: {
        backgroundColor: theme.white,
        borderColor: theme.indigo4,
        color: theme.text,
        borderWidth: 1,
        marginBottom: 10,
        marginHorizontal: 30,
        fontFamily: 'regularFont',
        fontSize: 16
    },
    radius10: {
        borderRadius: 10
    },
    userScoreTitle: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 5,
        color: theme.pink1,
        fontFamily: 'regularBoldFont',
        fontSize: 16
    },
    userHighScore: {
        textAlign: 'center',
        fontSize: 20,
        paddingBottom: 15,
        color: theme.purple,
        fontFamily: 'regularBoldFont'
    },
    verticalAlign: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: deviceHeight,
    },
    modalTitle: {
        textAlign: 'center',
        marginBottom: 10,
        marginHorizontal: 40,
        fontSize: 18,
        fontFamily: 'boldFont'
    },
    modalPurple: {
        color: theme.theme == 'dark' ? theme.purple2 : theme.purple,
        fontSize: 18,
        fontFamily: 'blackFont'
    },
    modalPurple2: {
        color: theme.theme == 'dark' ? theme.purple : theme.purple2,
        fontSize: 18,
        fontFamily: 'blackFont'
    },
    modalSubText: {
        marginHorizontal: 40,
        fontSize: 14,
        fontFamily: 'regularFont'
    },
    bold: {
        fontFamily: 'boldFont'
    },
    purple: {
        color: theme.purple
    },
    margin8: {
        marginVertical: 8
    },
    subtitleStyle: {
        paddingTop: 3,
        fontSize: 14,
        color: theme.text3,
        fontFamily: 'regularBoldFont'
    },
    subtitleMargin: {
        marginTop: 5,
        marginHorizontal: 0,
        fontSize: 14
    },
    username: {
        color: theme.pink1
    },
    listContainerStyle: {
        backgroundColor: theme.white,
        marginHorizontal: 15,
        paddingTop: 5,
        paddingBottom: 10
    },
    hr: {
        borderBottomWidth: 1,
        borderBottomColor: theme.indigo4
    },
    containerStyle: {
        borderRadius: 15,
        marginBottom: 20,
        marginTop: 0,
        marginHorizontal: 20,
        borderWidth: 0,
        backgroundColor: theme.white,
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 6,
    },
    locationNameContainer: {
        paddingVertical: 0,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'blackFont',
        textAlign: 'center',
        marginVertical: 10,
        color: theme.purple,
        opacity: 0.9
    },
    imageContainer: {
        marginBottom: 20,
        marginHorizontal: 20,
        borderWidth: 4,
        borderColor: '#e7b9f1',
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center"
    },
    operatorEmail: {
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        paddingVertical: 10
    },
    operatorHasEmail: {
        backgroundColor: theme.base4,
    },
    operatorNotEmail: {
        backgroundColor: theme.base3,
    },
    operatorComments: {
        textAlign: 'center',
        color: theme.text2,
        fontFamily: 'regularFont'
    }
})

MachineDetails.propTypes = {
    location: PropTypes.object,
    addMachineCondition: PropTypes.func,
    addMachineScore: PropTypes.func,
    operators: PropTypes.object,
    navigation: PropTypes.object,
    user: PropTypes.object,
    machineDetails: PropTypes.object,
    removeMachineFromLocation: PropTypes.func,
}

const mapStateToProps = ({ location, operators, user, machines }) => {
    const machineDetails = location.curLmx ? machines.machines.find(m => m.id === location.curLmx.machine_id) : {}
    return ({ location, operators, user, machineDetails })
}
const mapDispatchToProps = (dispatch) => ({
    addMachineCondition: (condition, lmx) => dispatch(addMachineCondition(condition, lmx)),
    addMachineScore: (score, lmx) => dispatch(addMachineScore(score, lmx)),
    removeMachineFromLocation: (lmx) => dispatch(removeMachineFromLocation(lmx))
})
export default connect(mapStateToProps, mapDispatchToProps)(MachineDetails)
