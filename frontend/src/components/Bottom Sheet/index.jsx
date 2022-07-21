import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useNavigation } from '@react-navigation/native';
import { authentication } from '../../utils/firebase';
import { signOut } from 'firebase/auth';

const BottomSheet = ({ bottomSheetRef }) => {
    const navigation = useNavigation();

    const onSignOut = () => {
        bottomSheetRef.current?.close();
        // setTimeout(() => {
        //     signOut(authentication);
        //     navigation.replace('Login');
        // }, 500);
    }

    return (
        <Modalize
            ref={bottomSheetRef}
            threshold={50}
            adjustToContentHeight
            handlePosition='inside'
            modalStyle={styles.modalStyle}
            handleStyle={styles.handleStyle}
            openAnimationConfig={{ timing: { duration: 200 } }}
            closeAnimationConfig={{ timing: { duration: 500 } }}
        >
            <View style={styles.bottomSheetContainer}>
                <TouchableOpacity>
                    <Text>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>Wishlist</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSignOut}>
                    <Text>Sign out</Text>
                </TouchableOpacity>
            </View>
        </Modalize>
    )
}

export default BottomSheet;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: '100%',
        paddingTop: 25,
        paddingBottom: 5,
        paddingHorizontal: 15
    }
});