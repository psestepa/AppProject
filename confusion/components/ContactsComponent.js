import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-elements';
import { CONTACTS } from '../shared/contacts';


function RenderItem(props) {
    const item = props.item;
    if (item != null) {
        return (
            <Card title={item.name}
            >
                <Text style={{ margin: 10 }}>
                    {item.description}
                </Text>
            </Card>
        );
    }
    else    {
        return (<View></View>)
    }
}


class Contact extends Component {

    constructor(props) {
        super(props);
        this.state = {
           contacts:CONTACTS
        }
    }

    render() {
        
        const contactId = this.props.navigation.getParam('contactId', '');

        return (<RenderItem item={this.state.contacts[+contactId]} />);
    }

}

export default Contact;