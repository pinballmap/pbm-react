import React from 'react';
import SignupLogin from '../SignupLogin';
import renderer from 'react-test-renderer';
import "../../config/globals.js"

describe('testing signup/login screen', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })

  it('renders without crashing', () => {
    fetch.mockResponseOnce(JSON.stringify({ num_locations: 11, num_lmxes: 22 }))

    const rendered = renderer.create(<SignupLogin />).toJSON();
    expect(rendered).toBeTruthy();
  });

  it('displays num_locations and num_lmxes from PBM API', () => {
    fetch.mockResponseOnce(JSON.stringify({ num_locations: 11, num_lmxes: 22 }))

    renderer.create(<SignupLogin />).toJSON();

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(global.api_url + '/regions/location_and_machine_counts.json');
  });
})
