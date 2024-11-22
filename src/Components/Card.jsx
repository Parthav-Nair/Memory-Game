import React, { useEffect, useState  } from "react";
import axios from "axios";
import ScoreBoard from "./ScoreBoard";
import ShufflingCharacters from "./shuffle";
import { Tilt } from "react-tilt";



function Cards() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animeLogo, setAnimeLogo] = useState("");
  const [score, setScore] = useState(0);
  const [clickedCharacters, setClickedCharacters] = useState(new Set());
  const [congratMessage, setCongratMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const animeNames = [
   
    "Naruto 8",
    "Death Note",
    "One Piece",
    'frieren',
    'Fruits Basket',
    "Hunter x Hunter",
    'Kimetsu no Yaiba',
    'Attack on titan 3',
    'Jujutsu Kaisen',
    "Dragon Ball Z",
    "Blue Lock",
    'Haikyu! 3',
    'Vinland Saga',
    
  ];

  const congratMessages = [
    "Congratulaions!",
    "Amazing Job!",
    "Fantastic!",
    "Well Done!",
    "Awesome!",
    "Great!",
    "You nailed it!",
  ];

  

  const [currentAnime, setCurrentAnime] = useState(animeNames[Math.floor(Math.random() * animeNames.length)]);
  const [remainingAnimes, setRemainingAnimes] = useState(ShufflingCharacters([...animeNames]));

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.post("https://graphql.anilist.co", {
          query: `
            query {
              Media(search: "${currentAnime}") {
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                characters(page: 1, perPage: 16) {
                  nodes {
                    id
                    name {
                      full
                    }
                    image {
                      large
                    }
                  }
                }
                bannerImage
              }
            }
          `,
          
        });

        const charactersData = response.data.data.Media.characters.nodes;
        const logo = response.data.data.Media.bannerImage;

        console.log(response);
        

        setCharacters(charactersData);
        setAnimeLogo(logo);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [currentAnime]);

  const handleCardClick = (characterId) => {
    if (clickedCharacters.has(characterId)) {
      setScore(0);
      setClickedCharacters(new Set());
    } else {
      setScore((prevScore) => prevScore + 1);
      setClickedCharacters((prev) => new Set(prev).add(characterId));
      

      if (score + 1 === 16 ) {
        const randomMessage = congratMessages[Math.floor(Math.random() * congratMessages.length)];
        setCongratMessage(randomMessage);
        setShowMessage(true);

        setTimeout(() => setShowMessage(false), 3000);

        let updatedAnimes = remainingAnimes.filter(anime => anime !== currentAnime);

        if (updatedAnimes.length === 0) {
          updatedAnimes = ShufflingCharacters([...animeNames]);
        }

        const randomAnime = updatedAnimes[Math.floor(Math.random() * updatedAnimes.length)];
        setCurrentAnime(randomAnime);
        setRemainingAnimes(updatedAnimes);
        setScore(0);
        setClickedCharacters(new Set());
      }
    }

    const shuffledCharacters = ShufflingCharacters([...characters]);
    setCharacters(shuffledCharacters);
  };

  if (loading) 
      {
        return <div className="bg-black p-2 text-white">Loading... Please Wait</div>;
      }
  if (error)
      {
      return <p className="error">{error === 'Network Error' ? 'Too many requests, try again after a minute.' : error}</p>;
    }
  return (
    <div>
      
      <div>
        <ScoreBoard  score={score} logo={animeLogo} animeName={currentAnime} title={currentAnime} />
      </div>
      {showMessage && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-10"></div>
          <div className="bg-transparent opacity-100 animate-anime shadow-glow text-white text-center p-4 rounded-md mb-4 h-32 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-3/4 flex items-center justify-center">
            {congratMessage}
          </div>
        </>
      )}
      
      <div className="grid gap-16 grid-cols-2 sm:grid-cols-4  overflow-hidden object-cover w-full">
          {characters.map((character) => (
            <Tilt key={character.id} options={{ max: 25, scale: 1.05, speed: 300 }}>
           
            <div
            className= "shadow-lg transition-transform transform  center hover:shadow-glow cursor-pointer "
              key={character.id}
              onClick={() => handleCardClick(character.id)}
            >
               
              <img
                src={character.image.large}
                alt={character.name.full}
                className="w-full aspect-w-1 aspect-h-1 rounded-lg "
                draggable="false"
              />
              <h3>{character.name.full}</h3>
            </div>
         
          </ Tilt >
        ))}
      </div>
      {showMessage && (
        <div className="hidden">
          <p>{congratMessage}</p>
        </div>
      )}
    </div>
  );
}

export default Cards;