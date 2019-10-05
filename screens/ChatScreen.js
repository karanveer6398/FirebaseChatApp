import React from 'react';
import { SafeAreaView, View, Text,Image, TextInput,Dimensions, TouchableOpacity } from 'react-native';
import User from '../User';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ImagePicker from 'react-native-image-crop-picker'

import styles from '../constants/styles';
import { FlatList } from 'react-native-gesture-handler';

export default class ChatScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('name', null),
            headerStyle:{backgroundColor: '#89c9b5'},
            
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            person: {
                name: props.navigation.getParam('name'),
                phone: props.navigation.getParam('phone'),
            },
            textMessage: '',
            messageList:[]        }
    }

    componentWillMount(){
        firebase.database().ref('messages').child(User.phone).child(this.state.person.phone)
        .on('child_added', (value)=>{
            this.setState((prevState)=>{
                return{
                    messageList: [...prevState.messageList, value.val()]
                }
            })
        })
    }


    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    convertTime = (time) => {
        let d = new Date(time);
        let c = new Date();
        let result = (d.getHours()<10 ? '0': '')+ d.getHours() + ':';
        result +=(d.getMinutes()<10 ? '0': '') + d.getMinutes();
        if(c.getDay() !== d.getDay()){
            result =d.getDay() + '' + d.getMonth()+ ''+ result;
        }

        return result;
    }

    sendMessage = async () => {
        if (this.state.textMessage.length > 0) {
            let msgID = firebase.database().ref('messages').child(User.phone).child(this.state.person.phone).push().key;
            let updates = {};
            let message = {
                message: this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.phone
            }
            updates['messages/' + User.phone + '/' + this.state.person.phone + '/' + msgID] = message;
            updates['messages/' + this.state.person.phone + '/' + User.phone + '/' + msgID] = message;
            firebase.database().ref().update(updates);
            this.setState({ textMessage: '' });
        }

    }

    renderRow=({item})=>{
        return(
            <View style={{
                flexDirection:'row',
                width:'60%',
                alignSelf: item.from===User.phone ? 'flex-end': 'flex-start',
                backgroundColor: item.from===User.phone ? '#00897b' : '#7cb342',
                borderRadius:5,
                marginBottom:10,
            }}>
                {
                    item.message.substring(0,22) === "data:image/png;base64," ? 
                    <Image style={{width:50,height:50}} source={{uri:item.message}}/> :
                
                <Text style ={{color:'#fff', padding:7, fontSize:16}}> 
                {item.message} 

                </Text>
                }

                <Text style ={{color:'#eee', padding:3,fontSize:12}}>
                    {this.convertTime(item.time)}
                </Text>
                
                </View>
        )
    }
    OpenCamera = () =>{
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            includeBase64:true
          }).then(image => {
            this.state.textMessage=`data:image/png;base64,${image.data}`;
            this.sendMessage();
          });
    }
    OpenGallery = () =>{
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            includeBase64:true
          }).then(image => {
            this.state.textMessage=`data:image/png;base64,${image.data}`;
            this.sendMessage();
          });
    }
        
    
    render() {

        let{height,width}=Dimensions.get('window');
        return (
            <SafeAreaView>
                <FlatList
                style={{padding:10,height: height * 0.8}}
                data ={this.state.messageList}
                renderItem={this.renderRow}
                keyExtractor={(item,index)=>index.toString()}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal:5 }}>




                    <TextInput
                        style={styles.input}
                        value={this.state.textMessage}
                        placeholder="Type message..."
                        onChangeText={this.handleChange('textMessage')}
                    />
                    <View style={{flexDirection:"column",justifyContent:"space-around"}}>
                    <TouchableOpacity onPress={this.sendMessage} style={{paddingBottom:0,marginRight:3,marginBottom:10}}>
                  
                        <Text style={styles.btnText}>Send

                </Text>
                
                    </TouchableOpacity>
                    <View style={{flexDirection:"row"}}>
                    <TouchableOpacity onPress={()=>this.OpenCamera()}>
                        <Icon name={"camera"} size={25} color={"#000000"}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>this.OpenGallery()}>
                        <Icon name={"attachment"} size={25} color={"#000000"} />
                    </TouchableOpacity>
                    </View>
                    </View>
                    
                </View>
            </SafeAreaView>
        )
    }
}