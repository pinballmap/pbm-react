import React from 'react';
import RecentActivity from '../RecentActivity';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<RecentActivity />).toJSON();
  expect(rendered).toBeTruthy();
});
