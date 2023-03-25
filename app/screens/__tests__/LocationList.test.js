//TODO: determine how to more usefully test this component.
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import renderer from "react-test-renderer";
import { LocationList } from "../LocationList";

const locations = [
  {
    id: 1636,
    name: "Metreon",
    street: "101 4th Street",
    city: "San Francisco",
    state: "CA",
    zip: "94103",
    phone: "1-415-369-6000",
    lat: "37.7844951",
    lon: "-122.4043117",
    website: "",
    created_at: null,
    updated_at: "2017-01-16T05:32:23.259Z",
    zone_id: 53,
    region_id: 8,
    location_type_id: null,
    description: "",
    operator_id: 12,
    date_last_updated: "2017-01-16",
    last_updated_by_user_id: 78,
    is_stern_army: null,
    country: null,
    distance: 0.147559812071013,
    bearing: "122.454988406905",
    machine_names: [
      "2001 (Gottlieb, 1971)",
      "Batman: The Dark Knight (Stern, 2008)",
      "Family Guy (Stern, 2006)",
      "Lord of the Rings (Stern, 2003)",
      "The Simpsons ball Party (Stern, 2003)",
      "Spider-Man (Stern, 2007)",
    ],
  },
  {
    id: 4768,
    name: "Golden Gate Tap Room",
    street: "525 Sutter Street #2",
    city: "San Francisco",
    state: "CA",
    zip: "94108",
    phone: "1-415-281-9000",
    lat: "37.788933",
    lon: "-122.4089565",
    website: "http://www.ggtaproom.com",
    created_at: "2014-06-15T20:28:27.140Z",
    updated_at: "2017-01-15T18:48:19.545Z",
    zone_id: 53,
    region_id: 8,
    description: "",
    operator_id: null,
    date_last_updated: "2017-01-15",
    last_updated_by_user_id: 78,
    is_stern_army: null,
    country: null,
    distance: 0.255099575480627,
    bearing: "320.666824811979",
    machine_names: [],
  },
];

describe("testing LocationList screen", () => {
  it("renders the locationList properly when there are no locations in the search area", () => {
    const wrapper = shallow(<LocationList locations={[]} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("renders the locationList properly when there are locations in the search area", () => {
    const wrapper = renderer.create(<LocationList />).root;
    const instance = wrapper.instance;
    instance.setState({ locations: locations });
    instance.setState({ buttonIndex: 1 });
    //console.log(instance.state)
  });
});
