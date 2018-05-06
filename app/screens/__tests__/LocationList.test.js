import "../../config/globals.js"
import LocationList from '../LocationList';
import React from 'react';
import renderer from 'react-test-renderer';

describe('testing LocationList screen', () => {
  beforeEach(() => {
    fetch.resetMocks()

    global.navigator = {
      geolocation: {
        getCurrentPosition: jest.fn(),
        watchPosition: jest.fn()
      }
    }
  })

  it('renders without crashing', () => {
    fetch.mockResponseOnce(JSON.stringify({ num_locations: 11, num_lmxes: 22 }))

    const rendered = renderer.create(<LocationList />).toJSON();
    expect(rendered).toBeTruthy();
  });

  it('reloadSections -- searches by lat/lon if you do not give an address', () => {
    fetch.mockResponseOnce({})

    let rendered = renderer.create(<LocationList />).getInstance()
    rendered.reloadSections()

    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual(global.api_url + '/locations/closest_by_lat_lon.json?lat=' + rendered.state.lat + ';lon=' + rendered.state.lon + ';send_all_within_distance=1;max_distance=5')
  })

  it('reloadSections -- searches by address when an address is input', () => {
    fetch.mockResponseOnce({})

    let rendered = renderer.create(<LocationList />).getInstance()
    rendered.state.address = '97203'
    rendered.reloadSections()

    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual(global.api_url + '/locations/closest_by_address.json?address=97203;send_all_within_distance=1;max_distance=5')
  });
})
