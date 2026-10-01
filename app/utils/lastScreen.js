import { Linking } from "react-native";
import { retrieveItem, storeItem } from "../config/utils";

// When the OS kills the app in the background, the next launch is a cold
// start that would land on the map. We save a minimal snapshot of where the
// user was (location + machine, not the raw nav state) so the next cold
// start can rebuild that stack instead.
const KEY_LAST_SCREEN = "lastScreen";
const RESTORE_WINDOW_MS = 3 * 60 * 60 * 1000;

// Root stack (Drawer "Map" -> MapStack) holds LocationDetails / MachineDetails
const getRootStackRoutes = (rootState) =>
  rootState?.routes?.find((r) => r.name === "Map")?.state?.routes ?? [];

const snapshotFromNavState = (rootState) => {
  const routes = getRootStackRoutes(rootState);
  const locationIndex = routes.findLastIndex(
    (r) => r.name === "LocationDetails",
  );
  if (locationIndex === -1) return null;

  const locationId = routes[locationIndex].params?.id;
  if (!locationId) return null;

  const above = routes[locationIndex + 1];
  const machine =
    above?.name === "MachineDetails" && above.params?.lmxId
      ? { lmxId: above.params.lmxId, machineName: above.params.machineName }
      : null;

  return { locationId, machine };
};

export const saveLastScreen = (rootState) => {
  const snapshot = snapshotFromNavState(rootState);
  return storeItem(
    KEY_LAST_SCREEN,
    snapshot ? { ...snapshot, savedAt: Date.now() } : null,
  );
};

export const clearLastScreen = () => storeItem(KEY_LAST_SCREEN, null);

// Returns a partial nav state for NavigationContainer's initialState, or
// undefined to launch normally.
export const loadRestoreState = async () => {
  try {
    // A deep link is a fresh intent; Map's own URL handling takes over
    if (await Linking.getInitialURL()) return undefined;

    const saved = await retrieveItem(KEY_LAST_SCREEN);
    if (!saved?.locationId) return undefined;
    if (Date.now() - saved.savedAt > RESTORE_WINDOW_MS) return undefined;

    return {
      routes: [
        {
          name: "Map",
          state: {
            routes: [
              { name: "MapStack" },
              {
                name: "LocationDetails",
                params: {
                  id: saved.locationId,
                  refreshMap: true,
                  // MachineDetails depends on redux curLmx, which only exists
                  // once the location is fetched, so LocationDetails pushes it.
                  restoreMachine: saved.machine ?? undefined,
                },
              },
            ],
          },
        },
      ],
    };
  } catch (e) {
    return undefined;
  }
};
