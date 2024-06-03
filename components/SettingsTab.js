import { Button, StyleSheet, Text, View, Image } from 'react-native';

export default function SettingsTab() {
    return (
        <View style={styles.container}>
        <Text style={styles.text}>Settings def</Text>
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