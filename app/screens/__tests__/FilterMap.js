import React from 'react';
import FilterMap from '../FilterMap';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<FilterMap />).toJSON();
  expect(rendered).toBeTruthy();
});
