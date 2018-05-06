import React from 'react';
import LocationList from '../LocationList';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  global.navigator = {
    geolocation: {
      getCurrentPosition: jest.fn(),
      watchPosition: jest.fn()
    }
  }

  const rendered = renderer.create(<LocationList />).toJSON();
  expect(rendered).toBeTruthy();
});
