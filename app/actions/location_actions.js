import {
  FETCHING_LOCATION,
  FETCHING_LOCATION_SUCCESS,
  LOCATION_DETAILS_CONFIRMED,
  SET_SELECTED_LMX,
  MACHINE_CONDITION_UPDATED,
  MACHINE_CONDITION_REMOVED,
  MACHINE_CONDITION_EDITED,
  MACHINE_SCORE_ADDED,
  MACHINE_SCORE_REMOVED,
  MACHINE_SCORE_EDITED,
  LOCATION_MACHINE_REMOVED,
  ADDING_MACHINE_TO_LOCATION,
  MACHINE_ADDED_TO_LOCATION,
  MACHINE_ADDED_TO_LOCATION_FAILURE,
  UPDATING_LOCATION_DETAILS,
  LOCATION_DETAILS_UPDATED,
  FAILED_LOCATION_DETAILS_UPDATE,
  ADD_MACHINE_TO_LIST,
  REMOVE_MACHINE_FROM_LIST,
  CLEAR_SELECTED_STATE,
  SUGGESTING_LOCATION,
  LOCATION_SUGGESTED,
  RESET_SUGGEST_LOCATION,
  SET_SELECTED_OPERATOR,
  SET_SELECTED_LOCATION_TYPE,
  IC_ENABLED_UPDATED,
} from "./types";

import { getData, postData, putData, deleteData } from "../config/request";
import { coordsToBounds } from "../utils/utilityFunctions";
import { triggerUpdateBounds } from "./locations_actions";

export const fetchLocation = (id) => (dispatch) => {
  dispatch({ type: FETCHING_LOCATION });

  return getData(`/locations/${id}.json`).then((data) =>
    dispatch(getLocationSuccess(data)),
  );
};

export const updateMap = (lat, lon) => async (dispatch) => {
  const bounds = coordsToBounds({ lat: parseFloat(lat), lon: parseFloat(lon) });
  dispatch(triggerUpdateBounds(bounds));
};

export const getLocationSuccess = (data) => {
  return {
    type: FETCHING_LOCATION_SUCCESS,
    location: data,
  };
};

export const confirmLocationIsUpToDate = (body, id, username) => (dispatch) => {
  return putData(`/locations/${id}/confirm.json`, body)
    .then(
      () => dispatch(locationDetailsConfirmed(username, id)),
      (err) => {
        throw err;
      },
    )
    .catch((err) => console.log(err));
};

const locationDetailsConfirmed = (username, id) => {
  return {
    type: LOCATION_DETAILS_CONFIRMED,
    username,
    id,
  };
};

export const setCurrentMachine = (id) => (dispatch, getState) => {
  const { location } = getState().location;
  const location_machine_xrefs = location.location_machine_xrefs
    ? location.location_machine_xrefs
    : [];
  const lmx = location_machine_xrefs.find((machine) => machine.id === id);

  // TODO: Error handling for if no lmx comes back
  return dispatch({ type: SET_SELECTED_LMX, lmx });
};

export const addMachineCondition = (condition, lmx) => (dispatch, getState) => {
  const { email, authentication_token, username } = getState().user;
  const body = {
    user_email: email,
    user_token: authentication_token,
    condition,
  };

  return putData(`/location_machine_xrefs/${lmx}.json`, body)
    .then((data) => dispatch(machineConditionUpdated(data, username)))
    .catch((err) => console.log(err));
};

export const machineConditionUpdated = (data, username) => {
  return {
    type: MACHINE_CONDITION_UPDATED,
    machine: data.location_machine,
    username,
  };
};

export const addMachineScore = (score, lmx) => (dispatch, getState) => {
  const { email, authentication_token } = getState().user;
  const body = {
    user_email: email,
    user_token: authentication_token,
    score,
    location_machine_xref_id: lmx,
  };

  return postData(`/machine_score_xrefs.json`, body)
    .then((data) => dispatch(machineScoreAdded(data)))
    .catch((err) => console.log(err));
};

export const machineScoreAdded = (data) => {
  return {
    type: MACHINE_SCORE_ADDED,
    score: data.machine_score_xref,
  };
};

export const updateIcEnabled = (id, ic_enabled) => (dispatch, getState) => {
  const { email, authentication_token, username } = getState().user;
  const body = {
    user_email: email,
    user_token: authentication_token,
    ...(ic_enabled !== undefined && { ic_enabled }),
  };
  return putData(`/location_machine_xrefs/${id}/ic_toggle.json`, body)
    .then((data) => dispatch(icEnabledUpdated(data, username)))
    .catch((err) => console.log(err));
};

export const icEnabledUpdated = (data, username) => {
  return {
    type: IC_ENABLED_UPDATED,
    machine: data.location_machine,
    username,
  };
};

export const removeMachineFromLocation =
  (curLmx, location_id) => (dispatch, getState) => {
    const { id: lmx, machine_id } = curLmx;
    const { email, authentication_token, username } = getState().user;
    const body = {
      user_email: email,
      user_token: authentication_token,
    };
    return deleteData(`/location_machine_xrefs/${lmx}.json `, body)
      .then(
        () =>
          dispatch(
            locationMachineRemoved(lmx, machine_id, location_id, username),
          ),
        (err) => {
          throw err;
        },
      )
      .catch((err) => console.log(err));
  };

export const locationMachineRemoved = (
  lmx,
  machine_id,
  location_id,
  username,
) => {
  return {
    type: LOCATION_MACHINE_REMOVED,
    lmx,
    machine_id,
    location_id,
    username,
  };
};

export const addMachineToLocation =
  (machine, condition, ic_enabled) => (dispatch, getState) => {
    dispatch({ type: ADDING_MACHINE_TO_LOCATION });

    const { id: machine_id } = machine;
    const { email, authentication_token } = getState().user;
    const { id: location_id } = getState().location.location;
    const body = {
      user_email: email,
      user_token: authentication_token,
      location_id,
      machine_id,
    };

    if (condition) body.condition = condition;

    return postData(`/location_machine_xrefs.json`, body)
      .then(
        ({ location_machine }) => {
          dispatch(machineAddedToLocation(location_id, machine_id));
          if (ic_enabled !== undefined) {
            dispatch(updateIcEnabled(location_machine.id, ic_enabled));
          }
        },
        (err) => {
          throw err;
        },
      )
      .catch((err) => dispatch(addMachineToLocationFailure(err)));
  };

const machineAddedToLocation = (location_id, machine_id) => (dispatch) => {
  dispatch({ type: MACHINE_ADDED_TO_LOCATION, location_id, machine_id });
  dispatch(fetchLocation(location_id));
};

export const addMachineToLocationFailure = () => (dispatch) => {
  dispatch({ type: MACHINE_ADDED_TO_LOCATION_FAILURE });
};

export const updateLocationDetails =
  (goBack, phone, website, description) => (dispatch, getState) => {
    dispatch({ type: UPDATING_LOCATION_DETAILS });

    const { email, authentication_token, username } = getState().user;
    const { locationType, operator, location } = getState().location;
    const location_type =
      locationType === -1
        ? ""
        : locationType
          ? locationType
          : location.location_type_id;
    const operator_id =
      operator === -1 ? "" : operator ? operator : location.operator_id;

    const { id } = location;
    const body = {
      user_email: email,
      user_token: authentication_token,
      phone,
      website,
      description,
      location_type,
      operator_id,
    };

    return putData(`/locations/${id}.json`, body)
      .then((data) => dispatch(locationDetailsUpdated(goBack, data, username)))
      .catch((err) => dispatch(updateLocationDetailsFailure(err)));
  };

export const locationDetailsUpdated =
  (goBack, data, username) => (dispatch) => {
    dispatch({ type: LOCATION_DETAILS_UPDATED, data, username });
    goBack();
  };

export const updateLocationDetailsFailure = () => (dispatch) => {
  dispatch({ type: FAILED_LOCATION_DETAILS_UPDATE });
};

export const addMachineToList = (machine) => ({
  type: ADD_MACHINE_TO_LIST,
  machine,
});
export const removeMachineFromList = (machine) => ({
  type: REMOVE_MACHINE_FROM_LIST,
  machine,
});
export const clearSelectedState = () => ({ type: CLEAR_SELECTED_STATE });

export const suggestLocation = (locationDetails) => (dispatch, getState) => {
  dispatch({ type: SUGGESTING_LOCATION });

  const {
    email,
    authentication_token,
    lat,
    lon,
    locationTrackingServicesEnabled,
  } = getState().user;
  const { machineList, operator, locationType } = getState().location;

  const {
    locationName: location_name,
    street: location_street,
    city: location_city,
    state: location_state,
    zip: location_zip,
    country: location_country,
    phone: location_phone,
    website: location_website,
    description: location_comments,
  } = locationDetails;

  const location_type = locationType > -1 ? locationType : null;
  const location_operator = operator > -1 ? operator : null;
  const location_machines = `${machineList
    .map((m) => m.nameManYear)
    .join(", ")},`;

  const body = {
    user_email: email,
    user_token: authentication_token,
    location_name,
    location_street,
    location_city,
    location_state,
    location_zip,
    location_country,
    location_phone,
    location_website,
    location_comments,
    location_type,
    location_operator,
    location_machines,
  };

  if (locationTrackingServicesEnabled) {
    body.lat = lat;
    body.lon = lon;
  }

  return postData(`/locations/suggest.json`, body)
    .then(
      (response) => {
        if (response.errors) {
          throw new Error(response.errors);
        }
        dispatch(locationSuggested());
      },
      (err) => {
        throw err;
      },
    )
    .catch((err) => dispatch(suggestLocationFailure(err)));
};

export const locationSuggested = () => (dispatch) => {
  dispatch({ type: LOCATION_SUGGESTED });
};

export const suggestLocationFailure = () => (dispatch) => {
  dispatch({ type: RESET_SUGGEST_LOCATION });
};

export const resetSuggestLocation = () => ({
  type: RESET_SUGGEST_LOCATION,
});

export const setSelectedOperator = (id) => {
  return {
    type: SET_SELECTED_OPERATOR,
    id,
  };
};

export const setSelectedLocationType = (id) => {
  return {
    type: SET_SELECTED_LOCATION_TYPE,
    id,
  };
};

export const deleteCondition = (conditionId, user) => (dispatch) => {
  const body = {
    user_email: user.email,
    user_token: user.authentication_token,
  };
  return deleteData(`/machine_conditions/${conditionId}.json`, body)
    .then(() => {
      dispatch({ type: MACHINE_CONDITION_REMOVED, conditionId });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const editCondition = (conditionId, comment, user) => (dispatch) => {
  const body = {
    user_email: user.email,
    user_token: user.authentication_token,
    comment,
  };

  return putData(`/machine_conditions/${conditionId}.json`, body)
    .then(() => {
      dispatch({ type: MACHINE_CONDITION_EDITED, conditionId, comment });
    })
    .catch((err) => console.log(err));
};

export const deleteScore = (scoreId, user) => (dispatch) => {
  const body = {
    user_email: user.email,
    user_token: user.authentication_token,
  };
  return deleteData(`/machine_score_xrefs/${scoreId}.json`, body)
    .then(() => {
      dispatch({ type: MACHINE_SCORE_REMOVED, scoreId });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const editScore = (scoreId, score, user) => (dispatch) => {
  const body = {
    user_email: user.email,
    user_token: user.authentication_token,
    score,
  };

  return putData(`/machine_score_xrefs/${scoreId}.json`, body)
    .then(() => {
      dispatch({ type: MACHINE_SCORE_EDITED, scoreId, score });
    })
    .catch((err) => console.log(err));
};
