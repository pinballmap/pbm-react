import React from 'react';
import LocationList from '../LocationList';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const mockGeolocation = {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn()
  };
  global.navigator.geolocation = mockGeolocation;

  const rendered = renderer.create(<LocationList />).toJSON();
  expect(rendered).toBeTruthy();
});
