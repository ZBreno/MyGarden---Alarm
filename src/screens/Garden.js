import { Text, StyleSheet, View, SafeAreaView, TouchableOpacity, TextInput, Image, FlatList } from 'react-native';
import React, { useEffect, useCallback, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormPlant from './FormPlant';

function Garden() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [plants, setPlants] = useState([])
    const [plant, setPlant] = useState('')

    const save = async () => {
        try {
            const listOfPlants = [...plants]

            const json = {
                name: name,
                description: description,
            }

            listOfPlants.push(json)
            await AsyncStorage.setItem("@MyGarden", JSON.stringify(listOfPlants))
            setPlants(listOfPlants)
        } catch (err) {
            alert(err)
        }
    }

    const load = async () => {
        try {
            const response = await AsyncStorage.getItem("@MyGarden")

            if (response !== null) {
                const obj = JSON.parse(response)
                setPlants(obj)
            }
        } catch (err) {
            alert(err)
        }
    }


    useEffect(() => {
        load()
    }, [])

    const bottomSheetRef = useRef(null)

    const openSheet = (item) => {
        setPlant(item)
        bottomSheetRef.current.expand()
    }

    const closeSheet = () => {
        bottomSheetRef.current.close()
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerAddPlants}>
                <Image
                    source={require('../../static/add.png')}
                />
                <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#42464D', marginLeft: 5 }}>Adicionar uma nova planta</Text>
            </View>
            <View style={styles.form}>
                <View>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.inputName}
                        placeholder="Insira o nome"
                        onChangeText={(name) => setName(name)}
                    />
                    <Text style={styles.label}>Descrição</Text>
                    <TextInput
                        style={styles.inputName}
                        placeholder="Insira a descrição"
                        onChangeText={(description) => setDescription(description)}
                    />
                </View>
                <View style={styles.button}>
                    <TouchableOpacity onPress={save}>
                        <Text style={styles.textButton}>Adicionar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.containerMyPlants}>
                <Image
                    source={require('../../static/plantIcon.png')}
                />
                <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#42464D', marginLeft: 5 }}>Minhas plantas</Text>
            </View>

            <FlatList
                horizontal
                data={plants}
                keyExtractor={(key) => key.name}
                renderItem={({ item }) =>

                    <View style={styles.containerCard}>
                        <View style={styles.cardPlant}>
                            <Text style={{ fontWeight: 'bold', marginVertical: 10, fontSize: 24, color: '#42464D' }}>{item.name}</Text>
                            <Image
                                style={styles.image}
                                source={require('../../static/plant.png')}
                            />

                            <Text style={styles.description}>
                                {item.description}
                            </Text>
                            <View style={styles.water}>
                                <TouchableOpacity onPress={() => openSheet(item)}>

                                    <View style={styles.containerButton}>
                                        <Image
                                            style={styles.bell}
                                            source={require('../../static/bell.png')}
                                        />
                                        <Text style={styles.textWater}>Hora de Regar</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>


                    </View>

                }




            />
           
           <BottomSheet
                ref={bottomSheetRef}
                snapPoints={[1, '60%']}
                index={0}
                handleIndicatorStyle={{ backgroundColor: '#138A63' }}
                backgroundStyle={{ backgroundColor: '#fff' }}
            >
                <FormPlant item={plant} close={closeSheet}/>
            </BottomSheet>


        </SafeAreaView >
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 60,
    },
    containerAddPlants: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 20,
    },
    form: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    label: {
        fontWeight: '500',
        marginBottom: 5,

    },
    inputName: {
        borderWidth: 0.5,
        padding: 5,
        paddingLeft: 10,
        width: 240,
        borderRadius: 8,
        borderColor: '#42464D',
        color: '#42464D',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#138A63',
        width: 240,
        marginTop: 10,
        borderRadius: 4,
    },
    textButton: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        padding: 5,
        elevation: 5,
    },
    containerCard: {

        marginHorizontal: 10,
        marginTop: 10,
    },
    cardPlant: {
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 16,
        width: 160,
        height: 300,

    },
    image: {
        width: 80,
        height: 100,
    },
    description: {
        fontSize: 14,
        marginHorizontal: 5,
        marginTop: 10,
        textAlign: 'justify',
        fontWeight: '500',
        color: '#42464D',
        height: 85,
    },
    water: {
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: '#138A63',
        width: 160,
        marginTop: 'auto',
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
    },

    textWater: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,


    },
    containerButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
    },
    containerMyPlants: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 40,
        marginLeft: 20,
    }


})

export default gestureHandlerRootHOC(Garden)