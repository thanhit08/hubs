import { MediaLoaderParams } from "../inflators/media-loader";
import { CameraPrefab, CubeMediaFramePrefab } from "../prefabs/camera-tool";
import { MediaPrefab } from "../prefabs/media";
import { EntityDef } from "../utils/jsx-entity";
import { DuckPrefab } from "./duck";
import { TFCNetworkedContentDataParams, TFCNetworkedContentDataPrefab } from "./tfc-networked-content-data";


type CameraPrefabT = () => EntityDef;
type CubeMediaPrefabT = () => EntityDef;
type MediaPrefabT = (params: MediaLoaderParams) => EntityDef;
type TFCNetworkedContentDataPrefab = (params: TFCNetworkedContentDataParams) => EntityDef;

type Permission =
  | "spawn_camera"
  | "spawn_and_move_media"
  | "update_hub"
  | "pin_objects"
  | "spawn_emoji"
  | "amplify_audio"
  | "fly"
  | "voice_chat"
  | "spawn_drawing"
  | "tweet"
  | "kick_users"
  | "mute_users";

export type PrefabDefinition = {
  permission: Permission;
  template: CameraPrefabT | CubeMediaPrefabT | MediaPrefabT | TFCNetworkedContentDataPrefab;
};

export type PrefabName = "camera" | "cube" | "media" | "duck" | "tfc-networked-content-data";

export const prefabs = new Map<PrefabName, PrefabDefinition>();
prefabs.set("camera", { permission: "spawn_camera", template: CameraPrefab });
prefabs.set("cube", { permission: "spawn_and_move_media", template: CubeMediaFramePrefab });
prefabs.set("media", { permission: "spawn_and_move_media", template: MediaPrefab });
prefabs.set("duck", { permission: "spawn_and_move_media", template: DuckPrefab });
prefabs.set("tfc-networked-content-data", { permission: "spawn_and_move_media", template: TFCNetworkedContentDataPrefab });
