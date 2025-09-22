# Bug Hunting Challenge - Questions

Please answer the following questions about the bugs you identified and fixed:

1. **Bug Overview**: List the bugs you found and fixed. For each bug, briefly describe:
   - What was the issue?
   - How did you identify it?
   - How did you fix it?

### apps/bug-hunting

1. `TodoForm` prop types are not defined.
   `Triage`: Opened `TodoForm` to see no defined types in destructured props.
   `Solution`: Properly define some prop types for `TodoForm`.
   `Note`: component prop interfaces are exported in case props ever need to be referenced in other components.

2. `Bug`: `TodoFilter` prop types are not defined.
   `Triage`: Opened `TodoFilter` to see no defined types in it's props either
   `Solution`: Properly define some prop types for `TodoFilter`. Kept in a separate file to allow referencing.
   `Note`: Same export reasoning as #1 applies here.

3. `TodoList` prop types are not defined.
   `Triage`: Opened todo list to see missing props definitions.
   Solution: Properly define some prop types for `TodoList`.
   `Note: same export reasoning as #1 and #2 applies here.

4. `todos` have no defined type.
   `Triage`: Noticed object shape of `todos` in code, but no type definitions.
   Solution: create defined type for `todos`. Kept in separate file under `types/` folder as these types are exported.
   `Note`: used `types` for entities, and `interfaces` for components, because props are often extended (wrapping components, HOCs, etc.), so the open/extendable nature of interfaces is handy. Types were chosen for entities as they are modeling a data structure.

5. `filters` have no defined type.
   `Triage`: Noticed specific magic strings in code for various filters, and corresponding buttons, but no type definitions.
   `Solution`: create a defined type for `filters` that's a string union to ensure we don't fall prey to incorrect spellings/typos.

6. `TodoForm` component is missing `onAdd` prop in `App.tsx`
   `Triage`: Once component prop interfaces were defined, LSP helped identify missing props.
   `Solution`: Add `onAdd` prop with correct call to onAdd function

7. Incorrectly inferred type for `todos` in `App.tsx`
   `Triage`: saw useState had no type, and default value as null in `App.tsx`.
   `Solution`: Either correctly type it using a union `Todo[] | null` or use an empty array as a default. Opted for the latter as it makes for a consistent state, and requires less optional chaining for empty state when we can guarantee the type is always an array.

8. Typos in references to `todos` in `TodoList` component
   `Triage`: noticed on first pass through codebase, but eventually adding types for todos let the LSP know of mismatches.
   `Solution`: Correctly reference Ids in `onDelete` and `onToggle` calls, fix typo in `.completed` property reference.

9. Incorrect invocation of function call for `onDelete`
   `Triage`: noticed direct function call of onDelete, which would be invoked immediately.
   `Solution`: wrap onDelete in arrow function so it's not immediately invoked.

10. Incorrect `active` class derivation in `TodoFilters.tsx`
    `Triage`: while LSP did not yell immediately, I saw an active class in the App.css file and assumed this was meant to be used to denote the active filter.
    `Solution`: abstract to a function to consolidate behaviour, use function on all button classnames to return a string.

11. Missing `onFilter` prop on `TodoFilter` in `App.tsx`
    `Triage`: Noticed once `TodoFilter` prop interface was defined thanks to LSP.
    `Solution`: Add `onFilter` prop to call `setFilter` directly. This works even though the function signatures don't match, as second arg for state setters is optional, and onFilter is correctly typed using the shared type from earlier.

12. Form submission in `TodoForm` was not preventing default form behaviour which could cause page reload.
    `Triage`: From experience really - noticed onSubmit and button type as submit, wanted to ensure there is no navigation happening so prevented the default form behaviour so we can handle it async.
    `Solution`: added `preventDefault` on form submit.

13. Form input handling in `TodoForm` was using raw value from event.target.value, potentially leading to incorrect controlled/uncontrolled input behaviour.
    `Triage`: Another experience/knowledge based triage, I knew that event.target.value can be `undefined`, and switching from a string type to a falsy type like undefined/null causes inputs to switch between/controlled/uncontrolled.
    `Solution`: Abstract input updates to separate function, use default fall back as empty string so component stays controlled.

14. local `todos` state is mutated directly, causing delayed state updates.
    `Triage`: Noticed when reading App.tsx on first pass. Direct state mutation is an antipattern in React.
    `Solution`: create new todos variable and then set state, spreading the previous iterable todos into a new array to create a copy rather than a reference to same memory location, instead of using `todos.push` and mutating state directly.

15. avoid mutating the todo being toggled
    `Triage`: noticed while doing a final pass.
    `Solution`: for mutated todo, return a new object instead of mutating the reference - should help react properly detect changes too.

16. missing `key` prop for todo list items in `TodoList`
    `Triage`: Console error once I got to testing - could lead to unnecessary render passes without unique ids, see below.
    `Solution`: add key prop and use unique todo ID as it's value.

17. No collision resistant ID implementation for `todos`
    `Triage`: Noticed references to ID, first thought to use index value instinctively but then realised array mutations would end up causing collisions, so opted to write a small utility function instead.
    `Solution`: User crypto browser API to generate a relatively collision resistant nano-id (appropriate for assessment) for each todo, as using index values or numbers adds unnecessary complexity. Would typically use a uuid or nanoid, but wanted to avoid adding new libraries.

18. Missing input validation in `TodoForm` allows empty todos
    `Triage`: Form submission accepts empty or whitespace-only input, creating useless todo items.
    `Solution`: Added validation in `handleSubmit` to check for empty/whitespace input using `trim()`. Added error state management and user feedback with error messages and visual styling.

19. Build configuration error preventing production builds
    `Triage`: TypeScript compilation failed with plugin type mismatch errors when running `npm run build`. Version incompatibility between Vite 6.x and `@vitejs/plugin-react` 4.x.
    `Solution`: Updated `@vitejs/plugin-react` from `^4.3.4` to `^5.0.0` to ensure compatibility with Vite 6.x. Verified build works with `npm run build` and `npm run preview`.

### Environment bugs

These may be specific to my setup on a newer M4 MacBook, or some artifacts in the lockfile that exclude the ARM arch.

1. Project wide, unable to build: `Cannot find module '@rollup/rollup-darwin-arm64'` - likely CPU arch specific to my M4 chipset. Showed up in a couple of apps in the workspace.
   `Triage`: Ran `npm install`, tried to build/run dev and process failed with error, unable to run the bug-hunting app.
   `Solution`: Had to delete `node_modules` for projects, delete `package-lock.json` and reinstall with `npm i`.
   `Note`: Side effect was version bumps in peer dependencies resolved critical npm audit vulnerabilities.

2. incorrect path and reference to potential old `fullstack` project in root `package.json`
   `Triage`: Tried to run the `prepare-apps` script and noticed folder name mismatch.
   `Solution`: Renamed ref from `apps/fullstack-challenge` to `apps/playwright-challenge` , renamed script to reference `playwright` as well.

3. Build configuration compatibility issues across apps
   `Triage`: Some apps had dependency version mismatches that prevented building on ARM64 architecture.
   `Solution`: Updated dependency versions to ensure cross-platform compatibility and resolve npm audit vulnerabilities.

1. **Technical Approach**: What debugging tools and techniques did you use to identify and fix the bugs?

- **LSP (Language Server Protocol)**: TypeScript language server for catching type errors and providing intellisense
- **Console**: Browser DevTools for runtime error detection and debugging
- **React Profiler**: To check for unnecessary render passes due to state mutations
- **Build tools**: Running `npm run build` to catch compilation and configuration errors
- **Static analysis**: Reading through code systematically to identify patterns and antipatterns
- **Version compatibility checking**: Investigating dependency version mismatches causing build failures

2. **Code Improvements**: Beyond fixing bugs, did you make any improvements to the code organization or structure? If so, what and why?

- See Environment Bugs above, but had to make a few changes repo-wide to get applications to build on my M4 MacBook.
- Packages version bumped to fix security issues identified by `npm audit`
- Memoized filtered todos to avoid recomputing arrays that may not change if parent component rerenders.
- Added root-level `.nvmrc` to pin latest node LTS version for use by version manager like `nvm` and `fnm`
- Added registry url to `.npmrc` to ensure we use the public npm registry.
- Added a `.prettierrc` and `.prettierignore` so we can autoformat nicely.
- Enhanced TodoForm with user feedback: added error state management, visual error styling, and real-time validation clearing when user starts typing.
- Improved CSS organization: added `.todo-form-container` wrapper, error styling with transitions, and better focus states for accessibility.

3. **Future Prevention**: How would you prevent similar bugs in future development? Consider both coding practices and testing strategies.

- Add a linter like eslint, and a defined config to help establish some shared code standards.
- Add some git hooks/scripts to lint/test/build pre-push (could do pre-commit but that makes WIP commits hard).
- Implement comprehensive TypeScript strict mode settings to catch type issues early.
- Add unit tests for components, especially form validation and state management logic.
- Set up automated dependency version checking to catch compatibility issues before they break builds.
- Use proper semantic versioning and lock file management to prevent version drift.
- Implement accessibility testing and ARIA compliance checks.
- Add input validation patterns and constraints as standard practice for all forms.

4. **Learning**: What was the most challenging or interesting aspect of this bug-hunting exercise?
   Hadn't worked with turborepo before so was treading lightly and ensuring I wasn't at fault during the issues with the environment setup, and rechecking every app within the workspace to ensure upgrades wouldn't break it.
