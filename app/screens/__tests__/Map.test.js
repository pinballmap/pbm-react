import React from 'react';
import Map from '../Map';
import { shallow } from 'enzyme';

import renderer from 'react-test-renderer';

describe('testing Map screen', () => {
  beforeEach(() => {
    global.navigator = {
      geolocation: {
        getCurrentPosition: jest.fn(),
        watchPosition: jest.fn()
      }
    }

    fetch.resetMocks()
  })

  it('renders without crashing', () => {
    const rendered = renderer.create(<Map />).toJSON();
    expect(rendered).toBeTruthy();
  });
});
