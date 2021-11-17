import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectMovies, selectUserIsLoggedIn, selectUserName } from "../../services/selectors";
import { searchMovies_getMoviesBySearch } from "../../services/__generated__/searchMovies"
import FavButton from "../favButton";
import { Card, Title } from "react-native-paper";
import { StyleSheet, SafeAreaView, FlatList, View } from "react-native";
import { useFonts } from "@expo-google-fonts/inter";
import AppLoading from 'expo-app-loading';
import MovieModal from "../moviedetail/MovieModal";


/**
 * This is a component displaying all the movies. 
 * We are using MUI Card components and rendering 
 * them based on movies fetched form the database.
 */


const MovieTable: React.FC = () => {
  const movies = useSelector(selectMovies);
  const isLoggedIn = useSelector(selectUserIsLoggedIn);
  const userName = useSelector(selectUserName)
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMovie, setModalMovie] = useState('');

  const [fontsLoaded] = useFonts({
    'Quicksand-Regular': require('../../assets/fonts/Quicksand-Regular.ttf')
  })

  function isFavorited(movie: searchMovies_getMoviesBySearch): boolean {
    if (movie === null || !userName ) {
      return false;
    }
    return movie.favoritedByUser.includes(userName)
  }

  const Movie = ({item}) => (
    <Card 
      style={styles.cardContainer} 
      onPress={
        () => {
          setModalVisible(true);
          setModalMovie(item);
        }
      }
      >
      <View>
        <Card.Cover source={{uri: item?.poster}} style={styles.cover}/>
      </View>
      <Card.Content style={styles.contentContainer}>
        { isLoggedIn
          ? <FavButton isFavorited={isFavorited(item)} userName={userName !== undefined ? userName : ""} id={item.id}/>
          : null
        }
        <Title style={styles.title}>{item?.title}</Title>
      </Card.Content>
    </Card>
  )

  const renderItem = ({item}) => {
    return(
      <Movie
        item={item}
      />
    );
  };

  if (!fontsLoaded) {
    return <AppLoading />
  } else {
    return (
        <SafeAreaView>
          <FlatList
            data={movies}
            renderItem={renderItem}
            keyExtractor={(movie) => movie.id}
            numColumns={2}
          />
          <MovieModal isModalVisible={modalVisible} setIsModalVisible={setModalVisible} movie={modalMovie}/>
        </SafeAreaView>
    )
  }
}

export default MovieTable;

const styles = StyleSheet.create({
  cardContainer: {
    margin:10,
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontFamily:'Quicksand-Regular',
    fontSize:20,
  },
  cover: {
    maxHeight:'100%',
    maxWidth:'100%',
  },
  contentContainer: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },
})
