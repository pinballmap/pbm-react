import React from 'react';
import RecentMachines from '../RecentMachines';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<RecentMachines />).toJSON();
  expect(rendered).toBeTruthy();
});
