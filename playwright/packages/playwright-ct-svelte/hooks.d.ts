/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { ComponentConstructorOptions, SvelteComponent } from 'svelte';

export declare function beforeMount<HooksConfig>(
  callback: (params: {
    hooksConfig?: HooksConfig,
    App: new (options: Partial<ComponentConstructorOptions>) => SvelteComponent
  }) => Promise<SvelteComponent | void>
): void;
export declare function afterMount<HooksConfig>(
  callback: (params: {
    hooksConfig?: HooksConfig;
    svelteComponent: SvelteComponent;
  }) => Promise<void>
): void;
