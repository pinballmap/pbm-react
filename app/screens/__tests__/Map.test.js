import React from 'react';
import Map from '../Map';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  global.navigator = {
    geolocation: {
      getCurrentPosition: jest.fn(),
      watchPosition: jest.fn()
    }
  }

  const rendered = renderer.create(<Map />).toJSON();
  expect(rendered).toBeTruthy();
});
