import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { SignupLogin }  from '../SignupLogin';

import { getData, getCurrentLocation } from '../../config/request';
jest.mock('../../config/request');

// Couldn't find a way to user mount, went with this approach, exporting component prior to connecting to redux state
//https://hackernoon.com/unit-testing-redux-connected-components-692fa3c4441c
describe('testing signup/login screen', () => {
  it('renders activity monitor when determining if location services is enabled', () => {
    const user = {
      isFetchingLocationTrackingEnabled: true
    }
    
    const wrapper = shallow(
      <SignupLogin 
        user={user} 
        getLocationTypes={() => {}} 
        getMachines={() => {}} 
        getCurrentLocation={() => {}} 
        getOperators={() => {}}
      />)
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders activity monitor while waiting for num_lmxes response from API', () => {
    const user = {
      isFetchingLocationTrackingEnabled: false
    }
    
    const wrapper = shallow(
      <SignupLogin 
        user={user} 
        getLocationTypes={() => {}} 
        getMachines={() => {}} 
        getCurrentLocation={() => {}} 
        getOperators={() => {}}
      />)
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders notice if location tracking enablement is not on', () => {
    const user = {
      isFetchingLocationTrackingEnabled: false,
      locationTrackingServicesEnabled: false,
    }

    const wrapper = shallow(
      <SignupLogin 
        user={user} 
        getLocationTypes={() => {}} 
        getMachines={() => {}} 
        getCurrentLocation={() => {}} 
        getOperators={() => {}}
      />)
    
    wrapper.setState({ num_lmxes: 25 })
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders signuplogin screen', () => {
    const user = {
      isFetchingLocationTrackingEnabled: false,
      locationTrackingServicesEnabled: true,
    }
    
    const wrapper = shallow(
      <SignupLogin 
        user={user} 
        getLocationTypes={() => {}} 
        getMachines={() => {}} 
        getCurrentLocation={() => {}} 
        getOperators={() => {}}
      />)
    
    wrapper.setState({ num_lmxes: 25 })
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('navigates to loginsignup after acknowledgement of location services', () => {
    const user = {
      isFetchingLocationTrackingEnabled: false,
      locationTrackingServicesEnabled: false,
    }
    
    const wrapper = shallow(
      <SignupLogin 
        user={user} 
        getLocationTypes={() => {}} 
        getMachines={() => {}} 
        getCurrentLocation={() => {}} 
        getOperators={() => {}}
      />)

      wrapper.setState({ num_lmxes: 25 })
      expect(wrapper.find('Button').at(0).props().title).toEqual('OK');
      expect(wrapper.state().showTurnOnLocationServices).toBeTruthy()
      wrapper.find('Button').at(0).props().onPress();
      expect(wrapper.state().showTurnOnLocationServices).toBeFalsy()
      wrapper.update();
      expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('retrieves num_locations and num_lmxes from PBM API', async () => {
    const user = {
      isFetchingLocationTrackingEnabled: false
    }

    const getLocationTypes = jest.fn()
    const getMachines = jest.fn()
    const getCurrentLocation = jest.fn()
    const getOperators = jest.fn()

    const wrapper = shallow(<SignupLogin user={user} getLocationTypes={getLocationTypes} getMachines={getMachines} getCurrentLocation={getCurrentLocation} getOperators={getOperators}/>);
    getData.mockImplementationOnce(() => Promise.resolve({ num_locations: 11, num_lmxes: 22 }));
   
    await wrapper.instance().componentDidMount();
    
    expect(wrapper.state().num_locations).toEqual(11);
    expect(wrapper.state().num_lmxes).toEqual(22);
  });

  it('triggers navigation function to login if you press login', () => {
    const user = {
      isFetchingLocationTrackingEnabled: false,
      locationTrackingServicesEnabled: true,
    }
    
    const wrapper = shallow(
      <SignupLogin 
        user={user} 
        getLocationTypes={() => {}} 
        getMachines={() => {}} 
        getCurrentLocation={() => {}} 
        getOperators={() => {}}
        navigation={{navigate: jest.fn()}}
      />)

      wrapper.setState({ num_lmxes: 25 })
      expect(wrapper.find('Button').at(0).props().title).toEqual('Current User? Log In')
      wrapper.find('Button').at(0).props().onPress();
      expect(wrapper.instance().props.navigation.navigate).toHaveBeenCalled();
  });

  it('triggers navigation function to signup if you press signup', () => {
    const user = {
      isFetchingLocationTrackingEnabled: false,
      locationTrackingServicesEnabled: true,
    }
    
    const wrapper = shallow(
      <SignupLogin 
        user={user} 
        getLocationTypes={() => {}} 
        getMachines={() => {}} 
        getCurrentLocation={() => {}} 
        getOperators={() => {}}
        navigation={{navigate: jest.fn()}}
      />)
      
      wrapper.setState({ num_lmxes: 25 })
      expect(wrapper.find('Button').at(1).props().title).toEqual('New User? Sign Up')
      wrapper.find('Button').at(0).props().onPress();
      expect(wrapper.instance().props.navigation.navigate).toHaveBeenCalled();
  });  
})
