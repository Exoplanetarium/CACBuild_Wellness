import { Button, StyleSheet, Text, View, Image } from 'react-native';

export default function MusicTab() {
    return (
        <View style={styles.container}>
        <Text style={styles.text}>Music def</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#131122',
    },
    text: {
        color: '#fff',
        fontSize: 20,
    },
});