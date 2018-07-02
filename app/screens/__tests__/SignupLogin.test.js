import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import SignupLogin from '../SignupLogin';

import { getData, getCurrentLocation } from '../../config/request';
jest.mock('../../config/request');

describe('testing signup/login screen', () => {
  it('renders activity monitor when determining if location services is enabled', () => {
    const wrapper = shallow(<SignupLogin />)
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('resolves fetching location enabled status after attempting to get current location', async () => {
    const wrapper = shallow(<SignupLogin />);
    expect(wrapper.state().fetchingLocEnabledStatus).toBe(true)
 
    getCurrentLocation.mockImplementationOnce(() => Promise.resolve());
    await wrapper.instance().componentDidMount();
    expect(wrapper.state().fetchingLocEnabledStatus).toBe(false);
  });
  
  it('renders notice if location services are not enabled', async () => {
    const wrapper = shallow(<SignupLogin />)
    getCurrentLocation.mockImplementationOnce(() => Promise.reject('Location services are not enabled'));

    await wrapper.instance().componentDidMount();
    
    process.nextTick(() => {
      wrapper.update()
      expect(toJson(wrapper)).toMatchSnapshot();
    })
  });

  it('navigates to loginsignup after acknowledgement of location services', async () => {
    const wrapper = shallow(<SignupLogin navigation={{navigate: jest.fn()}}/>)
    getCurrentLocation.mockImplementationOnce(() => Promise.reject('Location services are not enabled'));

    await wrapper.instance().componentDidMount();

    process.nextTick(() => {
      wrapper.update();
      expect(wrapper.find('Button').at(0).props().title).toEqual('OK');
      wrapper.find('Button').at(0).props().onPress();
      wrapper.update();
      expect(toJson(wrapper)).toMatchSnapshot();
    })
  });

  it('renders login signup page if location services are enabled', async () => {
    const wrapper = shallow(<SignupLogin />)
    getCurrentLocation.mockImplementationOnce(() => Promise.resolve());

    await wrapper.instance().componentDidMount();
    
    process.nextTick(() => {
      wrapper.update()
      expect(toJson(wrapper)).toMatchSnapshot();
    })
  });

  it('retrieves num_locations and num_lmxes from PBM API', async () => {
    const wrapper = shallow(<SignupLogin />);
    expect(wrapper.state().fetchingLocEnabledStatus).toBe(true)
    getData.mockImplementationOnce(() => Promise.resolve({ num_locations: 11, num_lmxes: 22 }));
   
    await wrapper.instance().componentDidMount();
    
    expect(wrapper.state().num_locations).toEqual(11);
    expect(wrapper.state().num_lmxes).toEqual(22);
  });

  it('sets error state properly if location enablement is not on', async () => {
    const wrapper = shallow(<SignupLogin />);
    expect(wrapper.state().fetchingLocEnabledStatus).toBe(true)
    
    getData.mockImplementationOnce(() => Promise.resolve({ num_locations: 11, num_lmxes: 22 }));
    getCurrentLocation.mockImplementationOnce(() => Promise.reject('Location services are not enabled'))

    await wrapper.instance().componentDidMount();
    process.nextTick(() => {
      wrapper.update()
      expect(wrapper.state().locationError).toEqual('Location services are not enabled');
      expect(wrapper.state().fetchingLocEnabledStatus).toBe(false);
    })
  });

  it('does not set error state if location enablement is on', async () => {
    const wrapper = shallow(<SignupLogin />);
    expect(wrapper.state().fetchingLocEnabledStatus).toBe(true)
    
    getData.mockImplementationOnce(() => Promise.resolve({ num_locations: 11, num_lmxes: 22 }));
    getCurrentLocation.mockImplementationOnce(() => Promise.resolve())

    await wrapper.instance().componentDidMount();
    process.nextTick(() => {
      wrapper.update()
      expect(wrapper.state().locationError).toEqual('');
      expect(wrapper.state().fetchingLocEnabledStatus).toBe(false);
    })
  });

  it('triggers navigation function to login if you press login', async () => {
    const wrapper = shallow(<SignupLogin navigation={{navigate: jest.fn()}}/>)
    getCurrentLocation.mockImplementationOnce(() => Promise.resolve());

    await wrapper.instance().componentDidMount();
    
    process.nextTick(() => {
      wrapper.update()
      expect(wrapper.find('Button').at(0).props().title).toEqual('Current User? Log In')
      wrapper.find('Button').at(0).props().onPress();
      expect(wrapper.instance().props.navigation.navigate).toHaveBeenCalled();
    })
  });

  it('triggers navigation function to signup if you press signup', async () => {
    const wrapper = shallow(<SignupLogin navigation={{navigate: jest.fn()}}/>)
    getCurrentLocation.mockImplementationOnce(() => Promise.resolve());

    await wrapper.instance().componentDidMount();
    
    process.nextTick(() => {
      wrapper.update()
      expect(wrapper.find('Button').at(1).props().title).toEqual('New User? Sign Up')
      wrapper.find('Button').at(1).props().onPress();
      expect(wrapper.instance().props.navigation.navigate).toHaveBeenCalled();
    })
  });

  it('gracefully handles a status code from the API != 200', async () => {
    const wrapper = shallow(<SignupLogin />)
    const errorMsg = 'API response was not ok'
    getData.mockImplementationOnce(() => Promise.reject(errorMsg))
    
    await wrapper.instance().componentDidMount();
    process.nextTick(() => {
      wrapper.update()
      expect(wrapper.state().apiError).toBe(errorMsg)
    })   
  })
  
})
