import { Text, StyleSheet, View, SafeAreaView, Platform, Button, Alert, Image, TouchableOpacity } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function FormPlant(props) {
    const [date, setDate] = useState(new Date())
    const [show, setShow] = useState(false)
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const navigation = useNavigation();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);


    const showDateTimePicker = () => {
        setShow(true);
    }

    const hideDateTimePicker = () => {
        setShow(false);
    }

    const handleDateTimePicker = (event, datetime) => {

       
        if (event.type === "dismissed") {
            hideDateTimePicker()
            return
        }

        var currentTime = Date.now();

        if (datetime.getTime() < currentTime) {
            Alert.alert("Por favor, escolha uma hora futura")
            hideDateTimePicker()

            return
        }
       

        const seconds = ((datetime.getTime() - currentTime) / 1000)
        schedulePushNotification(seconds, props.item.name)
        hideDateTimePicker()
        Alert.alert("Alarme marcado com sucesso!")

    }

   

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerText}>

            <Image
                style={{width: 80, height: 100}}
                source = {require('../../static/plant.png')}
            />

            <Text
                style={{ fontWeight: 'bold', marginVertical: 15, fontSize: 20,}}
            >
                {props.item.name}
            </Text>

            <Text
                style={{ textAlign: 'justify'}}
            >
                {props.item.description}
            </Text>




            </View>
            <View style={styles.containerForm}>

                <TouchableOpacity onPress={() => showDateTimePicker()} style={styles.button}>
                {/* <Button
                        title="Press to schedule a notification"
                        onPress={async () => {
                            await schedulePushNotification();
                        }}
                    /> */}
                    <Text
                        style={{color: 'white', fontWeight: 'bold', fontSize: 16}}
                    >Definir Lembrete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={props.close} style={styles.buttonBack}>
                {/* <Button
                        title="Press to schedule a notification"
                        onPress={async () => {
                            await schedulePushNotification();
                        }}
                    /> */}
                    <Text
                        style={{fontWeight: 'bold', fontSize: 16, marginBottom: 10,}}
                    >Voltar</Text>
                </TouchableOpacity>
            </View>
            {show && (
                <DateTimePicker
                    mode={'time'}
                    isVisible={show}
                    onChange={handleDateTimePicker}
                    value={date}

                />
            )}


        </SafeAreaView>
    )

}
async function schedulePushNotification(seconds, name) {
    
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Hora de Regar",
            body: `${name} precisa de agua`,
            data: { data: 'goes here' },
        },
        trigger: {

            seconds: seconds,

        },
    });
}

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    containerText: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        
        borderColor: '#138A63',
        borderRadius: 16,
        margin: 10,
        marginHorizontal: 40,

    },
    button:{
        paddingVertical: 20,
        backgroundColor: '#138A63',
        paddingHorizontal: 90,
        borderRadius: 15,
    },

    buttonBack: {
        marginTop: 20,
        
    },

    title: {
        width: 200,
        fontSize: 18,
        paddingVertical: 15,
        fontWeight: '500',
        textAlign: 'justify',


    },
    containerForm: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '40%',
    },
    inputName: {
        borderWidth: 0.5,
        padding: 5,
        width: '80%',

    },
})

