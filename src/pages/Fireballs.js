import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_METEORS_QUERY } from '../queries/getMeteors.js';
import {Container} from 'react-bootstrap'

import SearchLocation from '../components/SearchLocation';
import LocationMap from '../components/LocationMap';
import SpeedComparison from '../components/SpeedComparison';
import Footer from '../components/Footer';
import distance from '../utils/mathEquation';

import './Fireballs.css';

export default function Fireballs() {
  const [onSubmit, setOnSubmit] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({
    lat: '',
    lng: '',
  });
  const [closestComet, setClosestComet] = useState(null);
  const [comets, setComets] = useState([]);
  const [averageVelocity, setAverageVelocity] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false)
  const { data, loading, error } = useQuery(GET_METEORS_QUERY);

  useEffect(() => {
    if (loading === false && data) {
      console.log(data.comets)
      for (let i = 0; i < data.comets.length; i++){
        if (!data.comets[i].lon && !data.comets[i].lat) {
          continue
        } else {
          data.comets[i].lat = data.comets[i].latDir === "N" ? +data.comets[i].lat : +data.comets[i].lat * -1
          data.comets[i].lon = data.comets[i].lonDir === "E" ? +data.comets[i].lon : +data.comets[i].lon * -1
        }
      }
      setComets((state) => [...comets, ...data.comets]);
      // console.log(data.comets);
    }
  }, [loading, data]);

  if (loading)
    return (
      <div className="comets__loading--image">
        <p className="comets__loading--text">Almost there...</p>
      </div>
    );

  if (error) return <p>{error.message}</p>;

  // const findClosestComet = () => {
  //   console.log('RUNNING!')
  //   let closest = {};
  //   let dist = Infinity;
  //   let totalVelocity = 0;
  //   let count = 0;
  //   console.log(comets)
  //   for (let i = 0; i < comets.length; i++) {
  //     if (comets[i].vel && comets[i].vel !== '-') {
  //       totalVelocity += Number(comets[i].vel);
  //       count++;
  //       // console.log(comets[i].vel)
  //     }
  //     if (!comets[i].lat || !comets[i].lon) continue;

  //     comets[i].lat = comets[i].latDir === "N" ? Number(comets[i].lat) : Number(comets[i].lat * -1)
  //     comets[i].lon = comets[i].lonDir === "E" ? Number(comets[i].lon) : Number(comets[i].lon * -1)
  //     console.log('lat:', comets[5].lat, comets[7].lat)
  //     let currDistance = distance(
  //       +currentLocation.lat,
  //       +currentLocation.lng,
  //       comets[i].lat,
  //       comets[i].lon,
  //     );
  //     if (currDistance < dist) {
  //       console.log(dist)
  //       dist = currDistance;
  //       closest = comets[i];
  //     }
  //     // console.log(final);
  //     // console.log(comets.length)
  //     // console.log(closest);
  //   }
  //   setClosestComet(closest)
  //   let final = totalVelocity / count;
  //   setAverageVelocity(final);
  // };

  return (
    <>
      <img
        src="./images/starry_sky_background.jpeg"
        id="background-image"
        alt="starry sky"
      ></img>
      <div className="fireballs-header">
        <img src={'./images/comet_crash.gif'} />
        <div class="head-text-container">
          <div class="head-text-background-color">
            <p className="comet__fireballs">Fireballs</p>
          </div>
        </div>
      </div>
      <Container className='search-location-container'>
      <SearchLocation
          setCurrentLocation={setCurrentLocation}
          currentLocation={currentLocation}
        onSubmit={onSubmit}
        setOnSubmit={setOnSubmit}
          // findClosestComet={findClosestComet}
          setAverageVelocity={setAverageVelocity}
          setClosestComet={setClosestComet}
          comets={comets}
          setIsLoaded={setIsLoaded}
      />
        <LocationMap
        closestComet={closestComet}
          averageVelocity={averageVelocity}
          isLoaded={isLoaded}
      />
      <SpeedComparison
        closestComet={closestComet}
        averageVelocity={averageVelocity}
        />
        </Container>
      <Footer />
    </>
  );
}
