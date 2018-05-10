import React from 'react';
import EnableLocationServices from '../EnableLocationServices';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<EnableLocationServices />).toJSON();
  expect(rendered).toBeTruthy();
});
