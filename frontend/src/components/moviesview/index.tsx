import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectMovies, selectUserIsLoggedIn, selectUserName } from "../../services/selectors";
import { searchMovies_getMoviesBySearch } from "../../services/__generated__/searchMovies"
import FavButton from "../favButton";
import { Card, Title } from "react-native-paper";
import { StyleSheet, SafeAreaView, FlatList, View, Text } from "react-native";
import { useFonts } from "@expo-google-fonts/inter";
import AppLoading from 'expo-app-loading';
import MovieModal from "../moviedetail/MovieModal";
import { LogBox } from 'react-native';


/**
 * This is a component displaying all the movies. 
 * The movies are fetched form the database.
 */

/* Interface for object with movie */
interface IMovieObject {
  item: searchMovies_getMoviesBySearch;
}

interface MovieTableProps {
  fetchMore: () => void;
}

/* Interface for object with favorite information */
type favoritedMovie = {
  id:string;
  isFavorited:boolean;
}


const MovieTable: React.FC<MovieTableProps> = ({fetchMore}) => {
  const movies = useSelector(selectMovies);
  const isLoggedIn = useSelector(selectUserIsLoggedIn);
  const userName = useSelector(selectUserName)
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMovie, setModalMovie] = useState<searchMovies_getMoviesBySearch>();
  const [favoritedInSession, setFavoritedInSession] = useState<Array<favoritedMovie>>([]);

  const [fontsLoaded] = useFonts({
    'Quicksand-Regular': require('../../assets/fonts/Quicksand-Regular.ttf')
  })

  /* Returns true or false based on component state. If component state does not contain a value for the movie,
  the favorited value for the logged in user of the movie is returned */
  function isFavorited(movie: searchMovies_getMoviesBySearch): boolean {
    if (movie === null || !userName ) {
      return false;
    }
    let favoritedArray = favoritedInSession.filter(favoritedInSession => favoritedInSession.id === movie.id)
    if (favoritedArray.length > 0 ) {
      return favoritedArray[0].isFavorited;
    }
    return movie.favoritedByUser.includes(userName)
  }

  useEffect(() => {
    //Flatlist needs to be in ScrollView in our case.
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
}, [])


  /* Returns a reduced array with the favorited movie only occuring once, if it already exists, update with new value */
  function handleFavorize(newValue: boolean, id: string) {
    let alreadyInFavorites = favoritedInSession.filter(favoritedInSession => favoritedInSession.id === id)
    if (alreadyInFavorites.length > 0) {
      let newFav = alreadyInFavorites[0]
      newFav.isFavorited = newValue
    } else {
      setFavoritedInSession((state) => [...state, {id:id, isFavorited:newValue}])
    }


    
  }

  const Movie = ({item}: IMovieObject) => (
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
          ? <FavButton isFavorited={isFavorited(item)} userName={userName !== undefined ? userName : ""} id={item.id} onPressed = {(newValue: boolean, id: string) => handleFavorize(newValue, id)}/>
          : null
        }
        <Title style={styles.title}>{item?.title}</Title>
      </Card.Content>
    </Card>
  )

  const renderItem = ({item}: IMovieObject) => {
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
        <SafeAreaView style={styles.movieContainer}>
          <FlatList
            data={movies}
            renderItem={renderItem}
            keyExtractor={(movie: searchMovies_getMoviesBySearch) => movie.id}
            numColumns={2}
            contentContainerStyle={{
              paddingBottom:350,
            }}
            onEndReached={fetchMore}
          > 
          </FlatList>
          {modalMovie ? <MovieModal isModalVisible={modalVisible} setIsModalVisible={setModalVisible} movie={modalMovie}/> : null}
        </SafeAreaView>
    )
  }
}

export default MovieTable;

const styles = StyleSheet.create({
  movieContainer: {
    zIndex:0,
  },
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
    width:'100%',
    height:250,
  },
  contentContainer: {
    width:'100%',
    alignItems:'center',
  },
})
