global.fetch = require('jest-fetch-mock')
import * as enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
enzyme.configure({ adapter: new Adapter() });

jest.mock('react-native-autocomplete-input', () => 'Autocomplete');