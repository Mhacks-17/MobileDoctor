import React, { useState } from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const ChatBot = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        if (input.trim() === '') return;

        // Add user's message to the chat
        const userMessage = { text: input, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {
            // Make a POST request to the FastAPI chat endpoint
            const response = await axios.post('http://127.0.0.1:8000/chat', { chat: input });
            const botMessage = { text: response.data.text, sender: 'bot' };

            // Add bot's response to the chat
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            // Handle the error gracefully here, e.g., show an alert
        }

        // Clear the input field
        setInput('');
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <Text style={item.sender === 'user' ? styles.userMessage : styles.botMessage}>
                        {item.text}
                    </Text>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <TextInput
                style={styles.input}
                placeholder="Type your message..."
                value={input}
                onChangeText={setInput}
                onSubmitEditing={sendMessage}
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#d1e7dd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#f8d7da',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
});

export default ChatBot;
