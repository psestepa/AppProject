import React, { Component } from 'react';
import { ScrollView, View, Text, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { HISTORY } from '../shared/history';
import { Card } from 'react-native-elements';   
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';

const mapStateToProps = state => {
    return {
        leaders: state.leaders
    }
}

function RenderHistory(props) {
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
    else {
        return (<View></View>)
    }
}


class About extends Component {

    constructor(props) {
        super(props);
        this.state = {
            history: HISTORY
        }
    }

    static navigationOptions = {
        title:'About us'
    };

    render() {
        const historyId = this.props.navigation.getParam('historyId', '');
        const renderLeaders = ({ item, index }) => {

            return (
                <ListItem
                    key={index}
                    title={item.name}
                    subtitle={item.description}
                    hideChevron={true}
                    leftAvatar={{ source: { uri: baseUrl + item.image } }}
                />
            );
        };

        return (
            <ScrollView>
                <RenderHistory item={this.state.history[+historyId]} />
                <Card title = "Corporate Leadership">
                <FlatList
                    data={this.props.leaders.leaders}
                    renderItem={renderLeaders}
                    keyExtractor={item => item.id.toString()}
                    />
                </Card>
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps)(About);