import { useNavigate } from 'react-router-dom';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import { Typography, Container, Divider, Box, Fab } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// TO BE developed & implemented
// import RoutingControl from '../utils/RoutingControl';

import TourCard from '../components/layout/TourCard';
import Logo from '../assets/BarFlyLogolight.png';

import useStore from '../stores/useStore';

const GeneratedTours = () => {
    const { toursArr } = useStore((state) => state);

    console.log(toursArr);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/selection');
    }

    const bars = [
        [{
            name: 'Hammond Bar',
            openingHours: 'Mo-So 18pm-3am',
            address: 'Taborstraße 33, 1010 Wien', // address dann zusammenbauen
            photo: Logo
        },
        {
            name: 'Josef Bar',
            openingHours: 'Mo-So 18pm-1am',
            address: 'Sterngasse 1, 1010 Wien',
            photo: Logo
        },
        {
            name: 'Hannelore Bar',
            openingHours: 'Mo-So 18pm-3am',
            address: 'Dorotheergasse 6-8, 1010 Wien',
            photo: Logo
        }],
        [{
            name: 'Hannelore Bar',
            openingHours: 'Mo-So 18pm-3am',
            address: 'Taborstraße 33, 1010 Wien',
            photo: Logo
        },
        {
            name: 'Hammond Bar',
            openingHours: 'Mo-So 18pm-3am',
            address: 'Taborstraße 33, 1010 Wien',
            photo: Logo
        },
        {
            name: 'Hammond Bar',
            openingHours: 'Mo-So 18pm-3am',
            address: 'Taborstraße 33, 1010 Wien',
            photo: Logo
        }],
        [{
            name: 'Josef Bar',
            openingHours: 'Mo-So 18pm-3am',
            address: 'Taborstraße 33, 1010 Wien',
            photo: Logo
        },
        {
            name: 'Hammond Bar',
            openingHours: 'Mo-So 18pm-3am',
            address: 'Taborstraße 33, 1010 Wien',
            photo: Logo
        },
        {
            name: 'Hammond Bar',
            openingHours: 'Mo-So 18pm-3am',
            address: 'Taborstraße 33, 1010 Wien',
            photo: Logo
        }]
    ];


    const markers = [
        {
            id: 1,
            geocode: [48.2184021, 16.3806289],
            popUp: "Hammond Bar"
        },
        {
            id: 2,
            geocode: [48.2116623, 16.3737121],
            popUp: "Josef Bar"
        },
        {
            id: 3,
            geocode: [48.2079195, 16.3697658],
            popUp: "Hannelore Bar"
        }
    ];


return (
    <Container size='xl' sx={{display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw', position: 'relative', mt: '8rem'}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', minWidth: '25vw'}}>
            <Typography variant='h3'>Selected tours</Typography>
            {bars.map((tour, index) => (
                <>
                <TourCard key={index} props={tour}/>
                <Divider />
                </>
            ))}
        </Box>
        {/* decimal coordinates for default center */}
        <MapContainer center={[48.208354, 16.372504]} zoom={13} style={{ height: '100vh', width: '100vw'}}>

            <TileLayer
             maxZoom={19}
             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
             url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
            />

            
            {markers.map(marker => (
                <Marker key={marker.id} position={marker.geocode}>
                     <Popup><h3>{marker.popUp}</h3></Popup>
                </Marker> 
            ))} 
           
            {/* <RoutingControl /> */}


        </MapContainer>
        <Fab color='primary' onClick={handleClick} sx={{position: 'fixed', bottom: '0', mb: '3rem', ml: '2rem'}}>
          <ArrowBackIcon />
        </Fab>
    </Container>
);
};

export default GeneratedTours;