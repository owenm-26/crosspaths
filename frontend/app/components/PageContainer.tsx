import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

interface PageContainerProps {
children: ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
container: {
flex: 1,
padding: 20,
backgroundColor: '#fff',
},
});
