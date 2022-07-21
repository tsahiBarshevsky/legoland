import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, StatusBar, Text, View, FlatList } from 'react-native';
import { localhost } from '../../utils/utilities';
import { ProductCard } from '../../components';

const SearchScreen = ({ route }) => {
    const { name } = route.params;
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetch(`http://${localhost}/search-product-by-name?name=${name}`)
            .then((res) => res.json())
            .then((res) => setResults(res));
    }, []);

    return (
        <View style={styles.container}>
            <Text>{results.length} Legos were found</Text>
            <FlatList
                data={results}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <ProductCard product={item} />}
                ItemSeparatorComponent={() => <View style={{ marginVertical: 5 }} />}
                contentContainerStyle={styles.contentContainerStyle}
            />
        </View>
    )
}

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#f5f5f5',
        // paddingHorizontal: 15
    },
    contentContainerStyle: {
        marginHorizontal: 15,
        marginBottom: 15
    }
});