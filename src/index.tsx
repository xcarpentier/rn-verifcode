import React, { Component } from 'react'
import {
  StyleSheet,
  TextInputProps,
  InteractionManager,
  TextInput,
  Keyboard,
  AppState,
  Clipboard,
  View,
  Alert,
} from 'react-native'
import range from 'ramda/es/range'
import compose from 'ramda/es/compose'
import map from 'ramda/es/map'

const INPUTS_WIDTH = 300
const DEFAULT_LENGTH = 6

const styles = StyleSheet.create({
  input: {
    borderWidth: 0,
    borderBottomWidth: 1,
    width: 35,
    marginHorizontal: 8.5,
    paddingVertical: 5,
    paddingHorizontal: 0,
    textAlign: 'center',
    fontSize: 18,
  },
  inputContainer: {
    maxWidth: INPUTS_WIDTH,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
})

const OneDigitInput = React.forwardRef((props: TextInputProps, ref: any) => (
  <TextInput
    ref={ref}
    style={styles.input}
    keyboardType="number-pad"
    textContentType="none"
    returnKeyType="next"
    blurOnSubmit={false}
    autoCorrect={false}
    placeholder="0"
    underlineColorAndroid="transparent"
    autoCapitalize="none"
    selectTextOnFocus
    accessible
    {...props}
  />
))

interface Props extends TextInputProps {
  autofocus?: boolean
  numberOfDigits?: number
  onFulfill?(code: string): void
}

interface State {
  position?: number
  code: string[]
  appState: string
}

const resetCode = compose(
  map(() => ''),
  range(0),
)

export default class VerifCode extends Component<Props, State> {
  static defaultProps = {
    autofocus: false,
    numberOfDigits: DEFAULT_LENGTH,
  }

  state = {
    appState: 'active',
    position: undefined,
    code: resetCode(this.props.numberOfDigits || DEFAULT_LENGTH),
  }

  digitsRefs: TextInput[] = []

  mounted: boolean = false

  componentDidMount() {
    if (this.props.autofocus) {
      InteractionManager.runAfterInteractions(() => {
        const firstInput = this.digitsRefs[0]
        if (firstInput) {
          firstInput.focus()
        }
      })
    }
    this.mounted = true
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  matchCodeRegex = (code: string) =>
    code.match(new RegExp(`^[0-9]{${this.props.numberOfDigits}}$`))

  handleAppStateChange = async (nextAppState: string) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      const maybeCode = await Clipboard.getString()
      const cleanedCode = maybeCode.replace('.', '').trim()
      if (this.matchCodeRegex(cleanedCode)) {
        this.setState({ code: cleanedCode.split('') })
        Keyboard.dismiss()
        if (this.props.onFulfill) {
          this.props.onFulfill(cleanedCode)
        }

        // emptying clipboard
        await Clipboard.setString('')
      }
    }
    this.setState({ appState: nextAppState })
  }

  onFocus = (position: number) => () => this.setState({ position })

  fillCode = (text: string) => {
    const { code } = this.state
    for (let i = 0; i < text.length; i++) {
      code[i] = text.charAt(i)
    }
    this.setState({ code })
  }

  onChangeText = (text: string) => {
    const { code, position } = this.state
    if (this.mounted) {
      // Attempt to detect ios code suggestion selected
      if (text.length > 1) {
        this.fillCode(text)
        if (this.matchCodeRegex(text)) {
          Keyboard.dismiss()
          if (this.props.onFulfill) {
            this.props.onFulfill(this.state.code.join(''))
          }
        }
      } else {
        if (position !== undefined) {
          code[position] = text
          this.setState({ code })
          if (text && text.length > 0) {
            const nextInput = this.digitsRefs[position + 1]
            if (nextInput) {
              nextInput.focus()
            } else {
              if (this.props.onFulfill) {
                this.props.onFulfill(this.state.code.join(''))
              }
              Keyboard.dismiss()
              this.digitsRefs[position].blur()
            }
          }
        }
      }
    }
  }

  onKeyPress = ({ nativeEvent: { key } }: any) => {
    const { position } = this.state
    if (key === 'Backspace' && position !== undefined && position > 0) {
      this.digitsRefs[position - 1].focus()
    }
  }

  setDigitRef = (ref: TextInput) => this.digitsRefs.push(ref)

  reset = () => {
    this.digitsRefs[0].focus()
    this.setState({
      code: resetCode(this.props.numberOfDigits || DEFAULT_LENGTH),
      position: 0,
    })
  }

  render() {
    const { onChangeText, onKeyPress } = this
    const { code } = this.state
    const { numberOfDigits } = this.props
    const inputProps = {
      ...this.props,
      ref: this.setDigitRef,
      onChangeText,
      onKeyPress,
    }
    return (
      <View style={styles.inputContainer}>
        {code.map((_, i) => (
          <OneDigitInput
            key={`input-${i}`}
            {...inputProps}
            value={code[i]}
            onFocus={this.onFocus(i)}
            maxLength={numberOfDigits}
          />
        ))}
      </View>
    )
  }
}
