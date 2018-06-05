import React from 'react';
import FilterMap from '../FilterMap';
import { shallow } from 'enzyme';

import renderer from 'react-test-renderer';

describe('testing filter map screen', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })

  it('renders without crashing', () => {
    const navigation = { setParams: jest.fn() };

    const wrapper = shallow(<FilterMap navigation={navigation} />);

    expect(wrapper).toBeTruthy();
  });
})
