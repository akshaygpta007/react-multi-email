import * as React from 'react';
import { Segment, Label, Icon } from 'semantic-ui-react';
import * as isEmail from 'validator/lib/isEmail';
// import styled from 'styled-components';

interface IEmailAddressProps {
  emails?: string[];
  onChange?: Function;
  style?: object;
}

interface IEmailAddressState {
  focused?: boolean;
  emails?: string[];
  inputValue?: string;
}

class Index extends React.Component<IEmailAddressProps> {
  state = {
    focused: false,
    emails: [],
    inputValue: '',
  };

  static getDerivedStateFromProps(
    nextProps: IEmailAddressProps,
    prevState: IEmailAddressState,
  ) {
    if (prevState.emails !== nextProps.emails) {
      return { emails: nextProps.emails, inputValue: '', focused: false };
    }
    return null;
  }

  findEmailAddress = (value: string, isEnter?: boolean) => {
    let validEmails: string[] = [];
    let inputValue: string = '';
    const re = /[ ,;]/g;

    if (value !== '') {
      if (re.test(value)) {
        let arr = value.split(re).filter(n => {
          return n !== '' && n !== undefined && n !== null;
        });

        do {
          if (isEmail(arr[0])) {
            const newEmail: string = '' + arr.shift();
            if (
              !this.state.emails.find(s => {
                return s === newEmail;
              })
            ) {
              validEmails.push(newEmail);
            }
          } else {
            if (arr.length === 1) {
              /// 마지막 아이템이면 inputValue로 남겨두기
              inputValue = '' + arr.shift();
            } else {
              arr.shift();
            }
          }
        } while (arr.length);
      } else {
        if (isEnter) {
          if (isEmail(value)) {
            if (
              !this.state.emails.find(s => {
                return s === value;
              })
            ) {
              validEmails.push(value);
            }
          } else {
            inputValue = value;
          }
        } else {
          inputValue = value;
        }
      }
    }

    this.setState({
      emails: [...this.state.emails, ...validEmails],
      inputValue: inputValue,
    });

    if (validEmails.length && this.props.onChange) {
      this.props.onChange([...this.state.emails, ...validEmails]);
    }
  };

  onChangeInputValue = (value: string) => {
    this.findEmailAddress(value);
  };

  removeEmail = (index: number) => {
    this.state.emails.splice(index, 1);
    this.setState({
      emails: this.state.emails,
    });

    if (this.props.onChange) {
      this.props.onChange(this.state.emails);
    }
  };

  render() {
    const { focused, emails, inputValue } = this.state;
    const { style } = this.props;

    return (
      <div
        style={style}
        className={'email-address-input ' + (focused ? 'focused' : '')}
        onClick={(e: any) => {
          this.refs['emailInput']['focus']();
        }}
      >
        {emails.map((email: string, index: number) => (
          <Label key={index}>
            {email}
            <Icon name="delete" onClick={() => this.removeEmail(index)} />
          </Label>
        ))}
        <input
          ref="emailInput"
          type="text"
          value={inputValue}
          onFocus={(e: any) => this.setState({ focused: true })}
          onBlur={(e: any) => {
            this.setState({ focused: false });
            this.findEmailAddress(e.target.value, true);
          }}
          onChange={(e: any) => this.onChangeInputValue(e.target.value)}
          onKeyUp={(e: any) => {
            if (e.which === 13) {
              this.findEmailAddress(e.target.value, true);
            }
          }}
        />
      </div>
    );
  }
}

export default Index;