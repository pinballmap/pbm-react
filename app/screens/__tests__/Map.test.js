import React from 'react';
import Map from '../Map';
import { shallow } from 'enzyme';

import renderer from 'react-test-renderer';

describe('testing Map screen', () => {
  beforeEach(() => {
    global.navigator = {
      geolocation: {
        getCurrentPosition: jest.fn(),
        watchPosition: jest.fn()
      }
    }

    fetch.resetMocks()
  })

  it('renders without crashing', () => {
    const rendered = renderer.create(<Map />).toJSON();
    expect(rendered).toBeTruthy();
  });

  it('navigates to location list if you click on location list', () => {
    fetch.mockResponseOnce(JSON.stringify({ locations: [] }))

    const navigation = { navigate: jest.fn() };
    const wrapper = shallow(<Map navigation={navigation} />).setState({ isLoading: false })
    const rendered = wrapper.dive();

    rendered.find('Button').at(0).props().onPress();
    expect(rendered).toMatchSnapshot();
  });

  it('navigates to filters if you click on filters', () => {
    fetch.mockResponseOnce(JSON.stringify({ locations: [] }))

    const navigation = { navigate: jest.fn() };
    const wrapper = shallow(<Map navigation={navigation} />).setState({ isLoading: false })
    const rendered = wrapper.dive();

    rendered.find('Button').at(2).props().onPress();
    expect(rendered).toMatchSnapshot();
  });

  it('calls reload map if you click submit', () => {
    fetch.mockResponseOnce(JSON.stringify({ locations: [] }))
    const spy = jest.spyOn(Map.prototype, 'reloadMap');

    const navigation = { navigate: jest.fn() };
    const wrapper = shallow(<Map navigation={navigation} />).setState({ isLoading: false })
    const rendered = wrapper.dive();

    rendered.find('Button').at(1).props().onPress();
    expect(spy).toHaveBeenCalled();
    expect(rendered).toMatchSnapshot();
  });

  it('updates zip state when you enter text in the zip textbox', () => {
    fetch.mockResponseOnce(JSON.stringify({ locations: [] }))

    const navigation = { navigate: jest.fn() };
    const wrapper = shallow(<Map navigation={navigation} />).setState({ isLoading: false })
    const rendered = wrapper.dive();

    rendered.find('TextInput').at(0).props().onChangeText('97203');

    const inst = wrapper.instance();
    expect(inst.state.zip).toEqual('97203')
    expect(rendered).toMatchSnapshot();
  });

  //TODO: MAP THIS WORK
  /*
  it('creates map markers when locations are returned', () => {
    fetch.mockResponseOnce(JSON.stringify({ locations: [
      {
        "name": "Slim's Cocktail Bar & Restaurant",
        "lat": 45.5905028,
        "lon": -122.7549401,
      },
      {
        "name": "Over Easy Bar and Breakfast",
        "lat": 45.5930492,
        "lon": -122.7326202,
      }
    ]}));

    const navigation = { navigate: jest.fn() };
    const wrapper = shallow(<Map navigation={navigation} />).setState({ isLoading: false })

    const inst = wrapper.instance();
    inst.reloadMap().resolves.toEqual(2);
  });
  */
});
