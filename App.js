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
