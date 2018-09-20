import React from 'react';
import Login from '../Login';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { getData } from '../../config/request';
jest.mock('../../config/request');

it('sets the login button to be disabled if no username is provided', () => {
  const wrapper = shallow(<Login />)
  wrapper.setState({ 
    password: 'password', 
  })

  wrapper.find('Button').simulate('press')
  expect(wrapper.find('Button').props().disabled).toBe(true)
})

it('sets the login button to be disabled if no password is provided', () => {
  const wrapper = shallow(<Login />)
  wrapper.setState({ 
    login: 'meeeeeeee',
  })

  wrapper.find('Button').simulate('press')
  expect(wrapper.find('Button').props().disabled).toBe(true)
})

it('sets the login button to be disabled if no username or password is provided', () => {
  const wrapper = shallow(<Login />)

  wrapper.find('Button').simulate('press')
  expect(wrapper.find('Button').props().disabled).toBe(true)
})

it('sets the login button to be enabled if a username and password are provided', () => {
  const wrapper = shallow(<Login />)
  wrapper.setState({ 
    login: 'meeeeeeee',
    password: 'password', 
  })

  wrapper.find('Button').simulate('press')
  expect(wrapper.find('Button').props().disabled).toBe(false)
})

it('returns user data when logging in with valid credentials', async () => {
  const data = {
    username: 'meeeeeeee',
    password: 'password', 
  }

  const user = {
      id: 123,
      username: 'meeeeeee',
      email: 'bap@gmail.com',
      authentication_token: 'abcxyz',
  }

  getData.mockImplementationOnce(() => Promise.resolve({ user: user }))
  
  const wrapper = shallow(<Login navigation={{navigate: jest.fn()}}/>);
  wrapper.setState(data)
  
  await wrapper.find('Button').simulate('press')
  expect(wrapper.instance().props.navigation.navigate).toHaveBeenCalled();
})

it('handles clicking login and the API reports an invalid username', async () => {
  const data = {
    username: 'meeeeeeee',
    password: 'password', 
  }

  const loginError = 'Unknown user'
  getData.mockImplementationOnce(() => Promise.resolve({errors: loginError}))
  
  const wrapper = shallow(<Login />);
  wrapper.setState(data)
  
  await wrapper.find('Button').simulate('press')
  expect(wrapper.state().errors).toBe(true)
  expect(wrapper.state().loginError).toBe(loginError)
})

it('handles clicking login and the API reports the wrong password', async () => {
  const data = {
    username: 'meeeeeeee',
    password: 'password', 
  }

  const passwordError = 'Incorrect password'
  getData.mockImplementationOnce(() => Promise.resolve({errors: passwordError}))
  
  const wrapper = shallow(<Login />);
  wrapper.setState(data)
  
  await wrapper.find('Button').simulate('press')
  expect(wrapper.state().errors).toBe(true)
  expect(wrapper.state().passwordError).toBe(passwordError)
})

it('gracefully handles a status code from the API != 200', async () => {
  const data = {
    username: 'meeeeeeee',
    password: 'password', 
  }

  const errorMsg = 'API response was not ok'
  getData.mockImplementationOnce(() => Promise.reject(errorMsg))

  const wrapper = shallow(<Login />)
  wrapper.setState(data)
  
  await wrapper.find('Button').simulate('press')
  process.nextTick(() => {
    wrapper.update()
    expect(wrapper.state().apiErrorMsg).toBe(errorMsg)
    expect(wrapper.state().errors).toBe(true)
  })   
})



