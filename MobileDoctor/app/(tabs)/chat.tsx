import React from 'react';
import { SafeAreaView } from 'react-native';
import ChatBot from '@/components/chatBot';

const chat = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ChatBot />
        </SafeAreaView>
    );
};

export default chat;
