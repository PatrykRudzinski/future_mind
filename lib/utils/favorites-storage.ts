import {
  FAVORITES_STORAGE_KEY,
  favoritesStorageSchema,
  type FavoritesStorage,
} from "@/lib/schemas/favorites";
import { createLocalStorageAdapter } from "@/lib/utils/local-storage";

const favoritesStorageAdapter = createLocalStorageAdapter<FavoritesStorage>({
  key: FAVORITES_STORAGE_KEY,
  schema: favoritesStorageSchema,
  defaultValue: [],
});

export { favoritesStorageAdapter };
