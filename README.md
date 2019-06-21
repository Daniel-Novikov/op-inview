# op-inview

Trigger function / add class when element is in & out of the viewport.

# Install

```sh
npm install op-inview
```

```sh
yarn add op-inview
```

# Usage

```js
import OpInview from 'op-inview';
```

To create a new inview instance:
```js
const config = {
    el: document.querySelector('.inview')
};

const inview = OpInview.create(config);
````

It accepts a config object. 

| Type    | Name            | Default Value   | Description                                                                                                                                                                         |
|-------- |---------------- |---------------- |----------------------------------------------------------------------------------------------------------- |
| Dom node  | `el` | `undefined` (required)             | Dom element to track |
| Float  | `start`     | `0.2`             | Start position of inview trigger range, when scrolling the page down. Using [opViewProgress](https://www.npmjs.com/package/op-view-progress) to track elements progress in the viewport |
| Float  | `end`        | `0.8`             | End position of inview trigger range, when scrolling the page down. |
| String  | `classEnter`    | `is-inview-enter`            | Class to apply when inview node entered the `trigger range`. If set to `null`, class wont be triggered. Has a dublicate class applied with `-top` or `-bottom` modifier, depending on element appearance position. |
| String | `classExit`    | `is-inview-exit`            | Same as above, but triggered on exit of range. |
| Boolean | `deactivate`    | `false`            | If set to `true` will deactivate inview, when exited, thus allowing reenter. If set to `false`, will enter once, and remove itself |
| Function | `onEnterCallback`    | `undefined`            | Function to be called on enter. Receives an object { value, direction }, where `value` is `progress.value` when function is called and `direction` = `top` or `bottom`, depending on element appearance position.  |
| Function | `onExitCallback`    | `undefined`            | Same as above, but called on exit |

### Enable inline
Enables inline html quick add. For when you just want to use basic add / remove inview class functionality.

```js
OpInview.inline();
```

Include in HTML. Use `op-inview` attribute, include JSON object with the config within. (No need to provide `el`)
```
<div op-inview='{"start": 0, "end": 1}'></div>
```


