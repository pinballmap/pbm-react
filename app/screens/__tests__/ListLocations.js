import React from 'react';
import ListLocations from '../ListLocations';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<ListLocations />).toJSON();
  expect(rendered).toBeTruthy();
});
