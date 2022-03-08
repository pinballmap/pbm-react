import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Dimensions,
    Keyboard,
    Linking,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
    Button,
} from 'react-native-elements'
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
    HeaderBackButton,
    PbmButton,
    RemoveMachine,
    RemoveMachineModal,
    Screen,
    Text,
    WarningButton,
}  from '../components'

const moment = require('moment')

let deviceHeight = Dimensions.get('window').height

class MachineDetails extends Component {
    state = {
        showAddConditionModal: false,
        conditionText: '',
        showAddScoreModal: false,
        score: '',
        showRemoveMachineModal: false,
    }

    static navigationOptions = ({ navigation, theme }) => {
        return {
            headerLeft: () => <HeaderBackButton navigation={navigation} />,
            headerRight: () => <RemoveMachine navigation={navigation} />,
            title: null,
            headerStyle: {
                backgroundColor: theme === 'dark' ? '#1d1c1d' : '#f5f5ff',
                borderBottomWidth: 0,
                elevation: 0,
                shadowColor: 'transparent'
            },
            headerTintColor: theme === 'dark' ? '#fee7f5' : '#616182',
            gestureEnabled: true
        }
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
        const { ipdb_link } = this.props.machineDetails
        const { opdb_id } = this.props.machineDetails
        const pintipsUrl = opdb_id ?
            `http://pintips.net/opdb/${opdb_id}` :
            ``
        const operator = location.operator_id && this.props.operators.operators.find(operator => operator.id === location.operator_id)
        const operatorHasEmail = operator && operator.operator_has_email ? operator.operator_has_email : false
        const mostRecentComments = curLmx.machine_conditions.length > 0 ? curLmx.machine_conditions.slice(0, 5) : undefined
        const scores = curLmx.machine_score_xrefs.sort((a,b) => (a.score > b.score) ? -1 : ((b.score > a.score) ? 1 : 0)).slice(0, 10)
        const { score: userHighScore } = curLmx.machine_score_xrefs.filter(score => score.user_id === userId).reduce((prev, current) => (prev.score > current.score) ? prev : current, -1)
        const { name: machineName } = this.props.machineDetails
        const keyboardDismissProp = Platform.OS === "ios" ? { keyboardDismissMode: "on-drag" } : { onScrollBeginDrag: Keyboard.dismiss }

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
                                onRequestClose={()=>{}}
                            >
                                <Pressable onPress={ () => { Keyboard.dismiss() } }>
                                    <KeyboardAwareScrollView {...keyboardDismissProp} enableResetScrollToCoords={false} keyboardShouldPersistTaps="handled" style={s.backgroundColor}>
                                        <View style={s.verticalAlign}>
                                            <Text style={s.modalTitle}>{`Comment on ${machineName} at ${location.name}`}</Text>
                                            <TextInput
                                                multiline={true}
                                                numberOfLines={4}
                                                underlineColorAndroid='transparent'
                                                onChangeText={conditionText => this.setState({ conditionText })}
                                                value={this.state.conditionText}
                                                style={[{padding:5,height:100},s.textInput,s.radius10]}
                                                placeholder={'Enter machine condition...'}
                                                placeholderTextColor={theme.indigo4}
                                                textAlignVertical='top'
                                            />
                                            {location.operator_id ?
                                                operatorHasEmail ?
                                                        <Text style={s.modalSubText}>This operator has elected to be notified about machine comments. In your comment, please be descriptive about machine issues and also considerate of the time and effort needed to maintain machines!</Text> : null
                                                : null
                                            }
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
                                onRequestClose={()=>{}}
                            >
                                <Pressable onPress={ () => { Keyboard.dismiss() } }>
                                    <KeyboardAwareScrollView {...keyboardDismissProp} enableResetScrollToCoords={false} keyboardShouldPersistTaps="handled" style={s.backgroundColor}>
                                        <View style={s.verticalAlign}>
                                            <Text style={s.modalTitle}>{`Add your high score to ${machineName} at ${location.name}`}</Text>
                                            <TextInput
                                                style={[{height: 40,textAlign:'center'},s.textInput,s.radius10]}
                                                keyboardType='numeric'
                                                underlineColorAndroid='transparent'
                                                onChangeText={score => this.setState({ score })}
                                                value={formatInputNumWithCommas(this.state.score)}
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
                            {this.state.showRemoveMachineModal && <RemoveMachineModal closeModal={() => this.setState({showRemoveMachineModal: false})} />}
                            <ScrollView style={{marginBottom:20}}>
                                <View style={s.machineNameContainer}>
                                    <Text style={s.machineName}>{machineName}</Text>
                                    <Text style={s.locationName}>{location.name}</Text>
                                </View>
                                <Text style={s.addedText}>{`Added: ${moment(curLmx.created_at).format('MMM DD, YYYY')}`}</Text>
                                <View style={s.containerStyle}>
                                    <View style={s.locationNameContainer}>
                                        <Text style={s.sectionTitle}>Machine Comments</Text>
                                    </View>
                                    {mostRecentComments ?
                                        mostRecentComments.map(commentObj => {
                                            const { comment, created_at, username } = commentObj
                                            return <View
                                                style={[s.listContainerStyle,s.hr]}
                                                key={commentObj.id}>
                                                <Text style={[{marginRight:5},s.conditionText]}>
                                                    {`"${comment}"`}
                                                </Text>
                                                <Text style={[s.subtitleStyle,s.subtitleMargin]}>
                                                    {`${moment(created_at).format('MMM DD, YYYY')} ${username ? `by ${username}` : ''}`}
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
                                        operatorHasEmail ?
                                            <View style={[s.operatorEmail,s.operatorHasEmail]}>
                                                <Text style={{textAlign:'center',color:theme.text2}}>This operator receives machine comments!</Text>
                                            </View> :
                                            <View style={[s.operatorEmail,s.operatorNotEmail]}>
                                                <Text style={{textAlign:'center',color:theme.white}}>This operator does not receive machine comments</Text>
                                            </View>
                                    }
                                </View>
                                <View style={s.containerStyle}>
                                    <View style={s.locationNameContainer}>
                                        <Text style={s.sectionTitle}>Top Scores</Text>
                                    </View>
                                    {userHighScore ?
                                        <View>
                                            <Text style={s.userScoreTitle}>{`Your personal best on this machine is`}</Text>
                                            <Text style={s.userHighScore}>{formatNumWithCommas(userHighScore)}</Text>
                                        </View>
                                        : null
                                    }
                                    {scores.length > 0 ?
                                        scores.map(scoreObj => {
                                            const {id, score, created_at, username} = scoreObj

                                            return (
                                                <View
                                                    style={[s.listContainerStyle,s.hr]}
                                                    key={id}>
                                                    <Text style={s.scoreText}>
                                                        {formatNumWithCommas(score)}
                                                    </Text>
                                                    <Text style={s.subtitleStyle}>
                                                        {`${moment(created_at).format('MMM DD, YYYY')} by ${username}`}
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
                                {pintipsUrl ?
                                    <Button
                                        title={'View playing tips on PinTips'}
                                        type="outline"
                                        onPress={() => Linking.openURL(pintipsUrl)}
                                        buttonStyle={s.externalLink}
                                        titleStyle={s.externalLinkTitle}
                                        iconRight
                                        icon={<EvilIcons name='external-link' style={s.externalIcon} />}
                                        containerStyle={s.margin40}
                                    /> :
                                    null
                                }
                                <Button
                                    title={'View on IPDB'}
                                    type="outline"
                                    onPress={() => Linking.openURL(ipdb_link)}
                                    buttonStyle={s.externalLink}
                                    titleStyle={s.externalLinkTitle}
                                    iconRight
                                    icon={<EvilIcons name='external-link' style={s.externalIcon} />}
                                    containerStyle={s.margin40}
                                />
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
        fontFamily: 'boldFont',
        fontSize: 18,
        color: theme.pink1
    },
    locationName: {
        textAlign: 'center',
        fontSize: 16,
        color: theme.text3
    },
    machineNameContainer: {
        marginBottom: 5,
        marginHorizontal: 35,
        borderWidth: 0,
        paddingVertical: 5,
        textAlign:'center',
    },
    addedText: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 10,
        fontSize: 14,
        color: theme.text3,
        opacity: 0.9
    },
    externalLink: {
        borderRadius: 25,
        borderWidth: 2,
        borderColor: theme.text3,
        backgroundColor: theme.base3
    },
    externalIcon: {
        fontSize: 24,
        color: theme.text2
    },
    externalLinkTitle: {
        color: theme.text,
        fontSize: 16
    },
    margin40: {
        marginHorizontal: 40,
        marginVertical: 15,
    },
    conditionText: {
        color: theme.text2,
        fontSize: 14,
        marginTop: 5
    },
    scoreText: {
        color: theme.text2,
        fontSize: 16,
        marginTop: 5,
        fontFamily: 'boldFont',
    },
    noneYet: {
        textAlign: 'center',
        paddingHorizontal: 15,
        color: theme.text3,
        paddingVertical: 5,
    },
    textInput: {
        backgroundColor: theme.white,
        borderColor: theme.indigo4,
        color: theme.text,
        borderWidth: 1,
        marginBottom: 10,
        marginHorizontal: 30,
    },
    radius10: {
        borderRadius: 10
    },
    userScoreTitle: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 5,
        color: theme.text2
    },
    userHighScore: {
        textAlign: 'center',
        fontSize: 20,
        paddingBottom: 15,
        color: theme.text2
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
        fontSize: 18
    },
    modalSubText: {
        marginHorizontal: 40,
        fontSize: 14,
        textAlign: 'justify',
    },
    subtitleStyle: {
        paddingTop: 3,
        fontSize: 14,
        color: theme.text3
    },
    subtitleMargin: {
        marginTop: 5,
        marginHorizontal: 0,
        fontSize: 14
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
        backgroundColor: theme.pink2,
        marginBottom: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingVertical: 0,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'boldFont',
        textAlign: 'center',
        marginVertical: 10,
        color: theme.text2,
        opacity: 0.9
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
        backgroundColor: theme.indigo4,
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
