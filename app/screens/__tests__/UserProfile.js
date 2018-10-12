import React from 'react'
import UserProfile from '../UserProfile'

import renderer from 'react-test-renderer'

it('renders without crashing', () => {
    const rendered = renderer.create(<UserProfile />).toJSON()
    expect(rendered).toBeTruthy()
})
