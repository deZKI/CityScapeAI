import {SET_ACTIVE_AVAILABILITY, SetActiveAvailabilityAction} from "./activeAvailabilityActions";
import {EAvailability} from "../../types/enums/EAvailability.enum";
import {initialState} from "../reducer";

export type TActiveAvailabilityState = {
  activeAvailability: EAvailability;
}

type ActiveAvailabilityActions = SetActiveAvailabilityAction;

export const activeAvailabilityReducer = (state = initialState.activeAvailability, action: ActiveAvailabilityActions): TActiveAvailabilityState => {
  switch (action.type) {
    case SET_ACTIVE_AVAILABILITY:
      return {
        ...state,
        activeAvailability: action.activeAvailability
      }
    default:
      return state;
  }
}