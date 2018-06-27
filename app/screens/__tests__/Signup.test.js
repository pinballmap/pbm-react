import React from 'react';
import Signup from '../Signup';

import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { postData } from '../../config/request';
jest.mock('../../config/request');

it('renders without crashing', () => {
  const rendered = renderer.create(<Signup />).toJSON();
  expect(rendered).toBeTruthy();
});

it('sets error states properly when clicking submit with no fields filled', () => {
  const wrapper = shallow(<Signup />)

  wrapper.find('Button').simulate('press')
  expect(wrapper.state().usernameError).toBe("EMPTY USERNAME")
  expect(wrapper.state().emailError).toBe("EMPTY EMAIL")
  expect(wrapper.state().passwordError).toBe("EMPTY PASSWORD")
  expect(wrapper.state().errors).toBe(true)
})

it('sets state properly when clicking submit and passwords do not match', () => {
  const wrapper = shallow(<Signup />)
  wrapper.setState({ 
    password: 'password', 
    confirm_password: 'no matchy!',
  })
  
  wrapper.find('Button').simulate('press')
  expect(wrapper.state().confirm_passwordError).toBe("DOESN'T MATCH PASSWORD")
  expect(wrapper.state().errors).toBe(true)
})

it('sets state properly when clicking submit and the password is too short', () => {
  const wrapper = shallow(<Signup />)
  wrapper.setState({ 
    password: 'short', 
  })
  
  wrapper.find('Button').simulate('press')
  expect(wrapper.state().passwordError).toBe("Password is too short (minimum is 6 characters)")
  expect(wrapper.state().errors).toBe(true)
})

it('sets state properly when username is too long', () => {
  const wrapper = shallow(<Signup />)
  wrapper.setState({ 
    username: 'looooooooooooooooooooooooooong', 
  })
  
  wrapper.find('Button').simulate('press')
  expect(wrapper.state().usernameError).toBe("Username is too long (maximum is 15 characters")
  expect(wrapper.state().errors).toBe(true)
})

it('sets state properly when username has invalid characters', () => {
  const wrapper = shallow(<Signup />)
  wrapper.setState({ 
    username: '&&*', 
  })
  
  wrapper.find('Button').simulate('press')
  expect(wrapper.state().usernameError).toBe("Username must be alphanumeric")
  expect(wrapper.state().errors).toBe(true)
})

it('sets state properly when clicking submit with an empty email', () => {
  const wrapper = shallow(<Signup />)
  wrapper.setState({ 
    email: '', 
  })
  
  wrapper.find('Button').simulate('press')
  expect(wrapper.state().emailError).toBe("EMPTY EMAIL")
  expect(wrapper.state().errors).toBe(true)
})

it('sets state properly when clicking submit with an invalid email', () => {
  const wrapper = shallow(<Signup />)
  wrapper.setState({ 
    email: 'bad', 
  })
  
  wrapper.find('Button').simulate('press')
  expect(wrapper.state().emailError).toBe("Email is invalid")
  expect(wrapper.state().errors).toBe(true)
})

it('sets state properly when clicking submit and passwords do not match', () => {
  const wrapper = shallow(<Signup />)
  wrapper.setState({ 
    username: 'PINBALL_CHICK',
    email: 'test@gmail.com',
    password: 'password', 
    confirm_password: 'not the password',
  })
  wrapper.find('Button').simulate('press')
  expect(wrapper.state().confirm_passwordError).toBe("DOESN'T MATCH PASSWORD")
  expect(wrapper.state().errors).toBe(true)
})


it('creates a new user when clicking submit with valid data', async () => {
  const data = {
    username: 'PINBALL_CHICK',
    email: 'test@gmail.com',
    password: 'password', 
    confirm_password: 'password',
  }

  postData.mockImplementationOnce(() => Promise.resolve({user: 'ME!'}))
  
  const wrapper = shallow(<Signup />);
  wrapper.setState(data)
  
  await wrapper.find('Button').simulate('press')
 
  expect(wrapper.state().successfulSubmission).toBe(true)
  expect(wrapper.state().user).toBe('ME!')
})

it('gracefully handles a generic error from the API', async () => {
  const data = {
    username: 'PINBALL_CHICK',
    email: 'test@gmail.com',
    password: 'password', 
    confirm_password: 'password',
  }

  postData.mockImplementationOnce(() => Promise.resolve({errors: 'gah!'}))
  
  const wrapper = shallow(<Signup />);
  wrapper.setState(data)
  
  await wrapper.find('Button').simulate('press')
  expect(wrapper.state().errors).toBe(true)
})

it('handles clicking submit and the API reports invalid username', async () => {
  const data = {
    username: 'PINBALL_CHICK',
    email: 'test@gmail.com',
    password: 'password', 
    confirm_password: 'password',
  }

  const usernameError = 'Username is invalid'
  postData.mockImplementationOnce(() => Promise.resolve({errors: usernameError}))
  
  const wrapper = shallow(<Signup />);
  wrapper.setState(data)
  
  await wrapper.find('Button').simulate('press')
  expect(wrapper.state().errors).toBe(true)
  expect(wrapper.state().usernameError).toBe(usernameError)
})

it('handles clicking submit and the API reports a duplicate username', async () => {
  const data = {
    username: 'PINBALL_CHICK',
    email: 'test@gmail.com',
    password: 'password', 
    confirm_password: 'password',
  }

  const usernameError = 'Username has already been taken'
  postData.mockImplementationOnce(() => Promise.resolve({errors: usernameError}))
  
  const wrapper = shallow(<Signup />);
  wrapper.setState(data)
  
  await wrapper.find('Button').simulate('press')
  expect(wrapper.state().errors).toBe(true)
  expect(wrapper.state().usernameError).toBe(usernameError)
})

it('handles clicking submit and the API reports an invalid email', async () => {
  const data = {
    username: 'PINBALL_CHICK',
    email: 'test@gmail.com',
    password: 'password', 
    confirm_password: 'password',
  }

  const emailError = 'Email is invalid'
  postData.mockImplementationOnce(() => Promise.resolve({errors: emailError}))
  
  const wrapper = shallow(<Signup />);
  wrapper.setState(data)
  
  await wrapper.find('Button').simulate('press')
  expect(wrapper.state().errors).toBe(true)
  expect(wrapper.state().emailError).toBe(emailError)
})

it('gracefully handles a status code from the API != 200', async () => {
  const data = {
    username: 'PINBALL_CHICK',
    email: 'test@gmail.com',
    password: 'password', 
    confirm_password: 'password',
  }

  const apiErrorMsg = 'API failed!'
  postData.mockImplementationOnce(() => Promise.resolve({message: apiErrorMsg}))
  
  const wrapper = shallow(<Signup />);
  wrapper.setState(data)
  
  await wrapper.find('Button').simulate('press')
  expect(wrapper.state().errors).toBe(true)
  expect(wrapper.state().apiErrorMsg).toBe(apiErrorMsg)
})






