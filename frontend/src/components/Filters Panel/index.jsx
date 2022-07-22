import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';

const FilterPanel = ({ filterPanelRef }) => {
    return (
        <Modalize
            ref={filterPanelRef}
            threshold={50}
            adjustToContentHeight
            handlePosition='inside'
            modalStyle={styles.modalStyle}
            handleStyle={styles.handleStyle}
            openAnimationConfig={{ timing: { duration: 200 } }}
            closeAnimationConfig={{ timing: { duration: 500 } }}
        >
            <View style={styles.bottomSheetContainer}>
                <Text>Apply filters</Text>
            </View>
        </Modalize>
    )
}

export default FilterPanel

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: '100%',
        paddingTop: 25,
        paddingBottom: 5,
        paddingHorizontal: 15
    }
});