<p align="center" >
   <a href="https://reactnative.gallery/xcarpentier/rn-verifcode">
    <img alt="react-native-suggester" src="https://thumbs.gfycat.com/FittingAromaticChimpanzee-size_restricted.gif" width="260" height="510" />
 </a>

</p>

<p align="center">
  <a href="https://www.npmjs.com/package/rn-verifcode">
  <img alt="npm downloads" src="https://img.shields.io/npm/dm/rn-verifcode.svg"/></a>
  <a href="https://www.npmjs.com/package/rn-verifcode"><img alt="npm version" src="https://badge.fury.io/js/rn-verifcode.svg"/></a>

</p>

# rn-verifcode

> React-Native component to input confirmation code for both Android and IOS

- customizable
- fast paste **SMS-code**
- **copy from clipboard**
- reset code

## How to use it ?

```jsx
import * as React from 'react'
import { View, Button } from 'react-native'
import VerifCode from './src'

export default class App extends React.Component {
  state = {}
  ref = React.createRef()
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <VerifCode ref={this.ref} onFulfill={code => alert(code)} />
        <Button title="reset" onPress={() => this.ref.current.reset()} />
      </View>
    )
  }
}
```

## Props

```ts
interface Props extends TextInputProps {
  autofocus?: boolean
  numberOfDigits?: number
  onFulfill?(code: string): void
}
```

## Hire an expert!
Looking for a ReactNative freelance expert with more than 12 years experience? Contact me from my [website](https://xaviercarpentier.com)!
