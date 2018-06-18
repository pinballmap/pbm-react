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

it('clicking submit with no fields filled out will set error states properly', () => {
  const wrapper = shallow(<Signup />)

  wrapper.find('Button').simulate('press')
  expect(wrapper.state().usernameError).toBe("EMPTY USERNAME")
  expect(wrapper.state().emailError).toBe("EMPTY EMAIL")
  expect(wrapper.state().passwordError).toBe("EMPTY PASSWORD")
  expect(wrapper.state().errors).toBe(true)
})

it('clicking submit where passwords do not match sets error states properly', () => {
  const wrapper = shallow(<Signup />)
  wrapper.setState({ 
    password: 'password', 
    confirm_password: 'no matchy!',
  })
  
  wrapper.find('Button').simulate('press')
  expect(wrapper.state().confirm_passwordError).toBe("DOESN'T MATCH PASSWORD")
  expect(wrapper.state().errors).toBe(true)
})

it('clicking submit when the password is too short sets error states properly', () => {
  const wrapper = shallow(<Signup />)
  wrapper.setState({ 
    password: 'short', 
  })
  
  wrapper.find('Button').simulate('press')
  expect(wrapper.state().passwordError).toBe("Password is too short (minimum is 6 characters)")
  expect(wrapper.state().errors).toBe(true)
})

it('clicking submit with an empty email properly sets error states', () => {
  const wrapper = shallow(<Signup />)
  wrapper.setState({ 
    email: '', 
  })
  
  wrapper.find('Button').simulate('press')
  expect(wrapper.state().emailError).toBe("EMPTY EMAIL")
  expect(wrapper.state().errors).toBe(true)
})

it('clicking submit with an invalid email properly sets error states', () => {
  const wrapper = shallow(<Signup />)
  wrapper.setState({ 
    email: 'bad', 
  })
  
  wrapper.find('Button').simulate('press')
  expect(wrapper.state().emailError).toBe("Email is invalid")
  expect(wrapper.state().errors).toBe(true)
})

it('clicking submit where passwords do not match sets error states properly', () => {
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


it('clicking submit with valid data successfully creates a new user', async () => {
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

it('a generic error from the API is handled properly', async () => {
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

it('clicking submit and the API reports invalid username is handled properly', async () => {
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

it('clicking submit and the API reports a duplicate username is handled properly', async () => {
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

it('clicking submit and the API reports an invalid email is handled properly', async () => {
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




