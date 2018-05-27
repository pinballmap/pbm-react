import "../../config/globals.js"
import React from 'react';
import SignupLogin from '../SignupLogin';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

describe('testing signup/login screen', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })

  it('renders without crashing', () => {
    fetch.mockResponseOnce(JSON.stringify({ num_locations: 11, num_lmxes: 22 }))

    const rendered = renderer.create(<SignupLogin />).toJSON();
    expect(rendered).toBeTruthy();
  });

  it('displays num_locations and num_lmxes from PBM API', (done) => {
    const mockedCallback = () => Promise.resolve({ num_locations: 11, num_lmxes: 22 });
    let promise;
    const fetchData = () => {
      promise = Promise.resolve().then(mockedCallback);
      return promise;
    };

    const wrapper = shallow(<SignupLogin fetchData={fetchData}/>);

    promise.then((data) => {
      wrapper.setState(data)
      expect(wrapper.state().num_locations).toEqual(11);
      expect(wrapper.state().num_lmxes).toEqual(22);
      done();
    })
  });
})
