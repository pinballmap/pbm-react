import React from 'react';
import Signup from '../Signup';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<Signup />).toJSON();
  expect(rendered).toBeTruthy();
});
