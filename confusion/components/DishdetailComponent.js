import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList,Button, Modal, TextInput, StyleSheet} from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, fetchComments} from '../redux/ActionCreators';
import { BorderlessButton } from 'react-native-gesture-handler';
import { comments } from '../redux/comments';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites,
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    fetchComments: () => dispatch(fetchComments())
})


//renders 1 dish
function RenderDish(props) {
    const dish = props.dish;
    if (dish != null) {
        return (
            <Card
                featuredTitle={dish.name}
                image={{ uri: baseUrl + dish.image }}>
                <Text style={{ margin: 10 }}>
                    {dish.description}
                </Text>
                <View style={{ justifyContent: "center", alignContent: "center",flex:2,flexDirection:"row" }}>
                <Icon 
                    raised
                    reverse
                    name={props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite') : props.onPressHeart()}
                    />
                <Icon
                    raised
                    reverse
                    name='pencil'
                    type='font-awesome'
                    color='#551A8B'
                    onPress={() => props.onPressPencil()}
                    />
                </View>
            </Card>
            );
    }
    else {
        return(<View></View>)
    }
}

function RenderComments(props) {
    const comments = props.comments;
    const renderCommentItem = ({ item, index }) => {
        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Rating
                    type="star"
                    fractions={1}
                    startingValue={item.rating}
                    readonly
                    imageSize={10}
                    style={{ flex: 1, flexDirection: "row",margin:3}}
                />
                <Text style={{ fontSize: 12 }}>{'--' + item.author + ', ' + item.date}</Text>
            </View>
        );
    };

    return (
        <Card title='Comments'>
            <FlatList 
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
                />
        </Card>
        );
}


//function renders for each dish
class DishDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rating: 5,
            author: '',
            comment: '',
            showModal: false
        }
    }

    toggleModal() {
       this.setState({ showModal: !this.state.showModal });
    }

    writeComment() {
        console.log(JSON.stringify(this.state));
        this.toggleModal();
    }

    handleComment(dishId) {

        let collection = {}
        collection.dishId = dishId,
            collection.rating = this.state.rating,
            collection.author = this.state.author,
            collection.comment = this.state.comment,
            collection.date = new Date();
        console.log(collection);
        var url = baseUrl + 'comments';

        fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(collection), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => console.log('Success:', response));

        this.resetForm();
        this.toggleModal();
        this.props.fetchComments();
    }

    resetForm() {
        this.setState({
            rating: 1,
            author: '',
            comment: '',
            showModal: false
        });
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }
    static navigationOptions = {
        title: 'Dish Details' //status bar shows title as menu
    };
    
        render() {
            const dishId = this.props.navigation.getParam('dishId', '');

            return (
                <ScrollView>
                    <RenderDish dish={this.props.dishes.dishes[+dishId]}
                        favorite={this.props.favorites.some(el => el === dishId)}
                        onPressHeart={() => this.markFavorite(dishId)}
                        onPressPencil={() => this.writeComment()}
                    />
                    <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                    <Modal animationType={"slide"} transparent={false}
                        visible={this.state.showModal}
                        onDismiss={() => this.toggleModal()} //
                        onRequestClose={() => this.toggleModal()}>
                        <View>
                            <Rating
                                showRating
                                type="star"
                                startingValue={5}
                                imageSize={40}
                                onFinishRating={(text) => this.setState({ rating: text })} value={this.state.rating}
                                style={{ paddingVertical: 10 }}
                            />
                            <View style={{ margin: 10, marginBottom: 10 }}>
                                <Input style={styles.input}
                                    underlineColorAndroid="transparent"
                                    placeholder="Author"
                                    placeholderTextColor="#C0C0C0"
                                    autoCapitalize="words"
                                    leftIcon={
                                        <Icon
                                            name='user-o'
                                            type='font-awesome'
                                            color='#000000'
                                            size={20}
                                        />}
                                    onChangeText={(text) => this.setState({ author: text })} value={this.state.author}
                                />
                                <Input style={styles.input}
                                    underlineColorAndroid="transparent"
                                    placeholder="Comment"
                                    placeholderTextColor="#C0C0C0"
                                    autoCapitalize="sentences"
                                    leftIcon={
                                        <Icon
                                            name='comment-o'
                                            type='font-awesome'
                                            color='#000000'
                                            size={20}
                                        />}
                                    onChangeText={(text) => this.setState({ comment: text })} value={this.state.comment}
                                />
                            </View>

                            <View style={{ margin: 10, marginBottom: 10 }}>
                                <Button
                                    onPress={() => { this.handleComment(dishId); }}
                                    color="#512DA8"
                                    title="Submit"
                                />
                            </View>
                            <View style={{ margin: 10 }}>
                                <Button
                                    onPress={() => { this.toggleModal() }}
                                    color='#808080'
                                    title="Cancel"
                                />
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            );
        }
    
        
}

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);

const styles = StyleSheet.create(
    {
        input: {
            margin: 15,
            height: 40,
            borderWidth: 1,
            borderBottomColor: '#C0C0C0',
            borderTopColor: '#FFFFFF',
            borderLeftColor: '#FFFFFF',
            borderRightColor: '#FFFFFF'
        }
})