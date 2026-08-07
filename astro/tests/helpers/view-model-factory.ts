import type { ImageMetadata } from "astro";

import type { Category } from "@domain/category";
import type { Post } from "@domain/post";
import {
  toMonthRowViewModels,
  toPostViewModel,
  toThemeRowViewModels,
  type MonthRowViewModel,
  type PostViewModel,
  type ThemeRowViewModel,
} from "@/ui/view-model/post-view-model";
import { aPost } from "./post-factory";

/**
 * Fabriques de **view models** pour les tests de présentation.
 *
 * ? Les composants ne consomment plus d'entités (action.md §3) : ces fabriques passent donc par
 * ? le vrai mapper `toPostViewModel`, plutôt que de fabriquer des view models à la main. Les
 * ? tests de rendu vérifient ainsi la chaîne réelle entité → view model → HTML.
 */
export function aPostVm(overrides: Partial<Post<ImageMetadata>> = {}): PostViewModel {
  return toPostViewModel(aPost<ImageMetadata>(overrides));
}

export function aThemeRowVm(category: Category, posts: readonly Post<ImageMetadata>[]): ThemeRowViewModel {
  return toThemeRowViewModels([{ category, posts }])[0];
}

export function aMonthRowVm(monthKey: string, posts: readonly Post<ImageMetadata>[]): MonthRowViewModel {
  return toMonthRowViewModels([{ monthKey, month: new Date(`${monthKey}-01T00:00:00.000Z`), posts }])[0];
}
