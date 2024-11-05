import {ActionCreator} from "redux";
import {EAvailability} from "../../types/enums/EAvailability.enum";

export const SET_ACTIVE_AVAILABILITY = 'SET_ACTIVE_AVAILABILITY';

export type SetActiveAvailabilityAction = {
  type: typeof SET_ACTIVE_AVAILABILITY;
  activeAvailability: EAvailability;
}

export const setActiveAvailability: ActionCreator<SetActiveAvailabilityAction> = (activeAvailability) => ({
  type: SET_ACTIVE_AVAILABILITY,
  activeAvailability
})