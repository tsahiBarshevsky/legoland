import React, { useEffect, useState, useContext } from 'react';
import MasonryList from '@react-native-seoul/masonry-list';
import { localhost } from '../../utils/utilities';
import { useNavigation } from '@react-navigation/native';
import { BallIndicator } from 'react-native-indicators';
import { ProductCard } from '../../components';
import { ThemeContext } from '../../utils/ThemeManager';
import { lightMode, darkMode } from '../../utils/themes';

// React Native Components
import {
    StyleSheet,
    Platform,
    StatusBar,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    TouchableOpacity
} from 'react-native';

const SearchScreen = ({ route }) => {
    const { term } = route.params;
    const { theme } = useContext(ThemeContext);
    const [found, setFound] = useState(false);
    const [results, setResults] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetch(`http://${localhost}/search-product-by-term?term=${term.trim()}`)
            .then((res) => res.json())
            .then((res) => setResults(res))
            .catch((error) => console.log(error.messase))
            .finally(() => setFound(true));
    }, []);

    return found ? (
        <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
            {results.length > 0 ?
                <ScrollView>
                    <Text style={[styles.title, styles[`text${theme}`]]}>
                        Search results for {term}
                    </Text>
                    <Text style={[styles.results, styles[`text${theme}`]]}>
                        {results.length} sets were found
                    </Text>
                    <MasonryList
                        data={results}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item, i }) => <ProductCard product={item} index={i} />}
                        contentContainerStyle={styles.contentContainerStyle}
                    />
                </ScrollView>
                :
                <View style={styles.noResult}>
                    <Image
                        source={require('../../../assets/Images/search.png')}
                        resizeMode='center'
                        style={styles.image}
                    />
                    <Text style={[styles.caption, styles[`text${theme}`]]}>
                        No results found for {term.trim()}. Please try to search again.
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.noResultButton}
                        activeOpacity={1}
                    >
                        <Text style={styles.noResultButtonCaption}>Back To Home</Text>
                    </TouchableOpacity>
                </View>
            }
        </SafeAreaView>
    ) : (
        <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
            <BallIndicator size={30} count={8} color={theme === 'Light' ? 'black' : 'white'} />
        </SafeAreaView>
    )
}

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    containerLight: {
        backgroundColor: lightMode.background
    },
    containerDark: {
        backgroundColor: darkMode.background
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        paddingHorizontal: 15
    },
    textLight: {
        color: lightMode.text
    },
    textDark: {
        color: darkMode.text
    },
    results: {
        fontSize: 17,
        marginBottom: 10,
        paddingHorizontal: 15
    },
    contentContainerStyle: {
        marginBottom: 5,
        paddingHorizontal: 15,
        alignSelf: 'stretch'
    },
    noResult: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25
    },
    noResultButton: {
        backgroundColor: lightMode.primary,
        borderRadius: 30,
        paddingHorizontal: 35,
        paddingVertical: 10,
        position: 'absolute',
        bottom: 30,
        elevation: 1
    },
    noResultButtonCaption: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1
    },
    caption: {
        fontSize: 20,
        textAlign: 'center'
    },
    image: {
        width: 130,
        height: 130,
        marginBottom: 30
    }
});