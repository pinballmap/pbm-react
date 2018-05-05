import React from 'react';
import Map from '../Map';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const mockGeolocation = {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn()
  };
  global.navigator.geolocation = mockGeolocation;

  const rendered = renderer.create(<Map />).toJSON();
  expect(rendered).toBeTruthy();
});
