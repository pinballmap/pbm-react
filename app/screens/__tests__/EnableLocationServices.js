import React from 'react';
import EnableLocationServices from '../EnableLocationServices';
import { shallow } from 'enzyme';

import renderer from 'react-test-renderer';

describe('testing EnableLocationServices', () => {
  beforeEach(() => {
    fetch.resetMocks()

    global.navigator = {
      geolocation: {
        getCurrentPosition: jest.fn(),
        watchPosition: jest.fn()
      }
    }
  })

  it('renders without crashing', () => {
    const rendered = renderer.create(<EnableLocationServices />).toJSON();
    expect(rendered).toBeTruthy();
  });

  it('navigates to map if you elect to enable locations services later', () => {
    const navigation = { navigate: jest.fn() };
    const wrapper = shallow(<EnableLocationServices navigation={navigation} />);
    const rendered = wrapper.dive();

    rendered.find('Text').at(1).props().onPress();
    expect(rendered).toMatchSnapshot();
  });

  // TODO: actually test that location services are enabled
  it('#enableGeolocation - enables location services', () => {
    const wrapper = shallow(<EnableLocationServices />);
    const rendered = wrapper.dive();

    rendered.find('Button').at(0).props().onPress();
    expect(rendered).toBeTruthy();
  });
});
