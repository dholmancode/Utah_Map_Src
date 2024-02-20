import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { zoom } from 'd3-zoom'; // Import zoom from d3-zoom
import GeoJSONData from './GeoJSON.json'; // Import GeoJSON data
import './Styles/mapStyles.css';
import InformationBox from './ParkInformation/InformationBox';



// Import icon images
import ArchesIcon from './Assets/Utah Parks Icons/Arches.png';
import BryceIcon from './Assets/Utah Parks Icons/Bryce.png';
import CanyonlandsIcon from './Assets/Utah Parks Icons/Canyonlands.png';
import CapitolReefIcon from './Assets/Utah Parks Icons/Capitol Reef.png';
import CedarBreaksIcon from './Assets/Utah Parks Icons/Cedarbreaks.png';
import DinosaurIcon from './Assets/Utah Parks Icons/Dinosaur.png';
import GlenIcon from './Assets/Utah Parks Icons/Glen.png';
import HovenweepIcon from './Assets/Utah Parks Icons/Hovenweep.png';
import NaturalBridgeIcon from './Assets/Utah Parks Icons/Natural Bridges.png';
import TimpanogosIcon from './Assets/Utah Parks Icons/Timpanogos cave.png';
import RainbowIcon from './Assets/Utah Parks Icons/Rainbow.png';
import ZionIcon from './Assets/Utah Parks Icons/Zion.png';
import CenterIcon from './Assets/Utah Parks Icons/Center.png';


const InteractiveMap = () => {
    const svgRef = useRef();
    const mapGroupRef = useRef();
    const projectionRef = useRef();
    const [parksData, setParksData] = useState([]);
    const [selectedPark, setSelectedPark] = useState(null);
    

    useEffect(() => {
        projectionRef.current = d3.geoAlbers()
            .rotate([111, 0])
            .center([-2.3, 40.3])
            .scale(4000)
            .translate([160, 190]);
        fetchNationalParksData();
    }, []);

const fetchNationalParksData = async () => {
    try {
        const response = await fetch(`https://developer.nps.gov/api/v1/parks?stateCode=UT&api_key=1JhdpsWd0tSFh3X9qx6DhcZk6EefRIjUXlYJUDzY`);
        const data = await response.json();

        if (!data || !data.data || data.data.length === 0) {
            console.error('Error fetching national parks data: Data is null or empty');
            return;
        }

        const utahNationallyProtectedAreas = data.data.filter(park => park.states.includes('UT') && (park.designation.includes('National Park') || park.designation.includes('National Monument') || park.designation.includes('National Recreation Area') || park.designation.includes('National Historic Site') || park.designation.includes('National Historic Park') || park.designation.includes('National Scenic Trail')));
        console.log(utahNationallyProtectedAreas); // Log the park data to inspect it
        setParksData(utahNationallyProtectedAreas);
    } catch (error) {
        console.error('Error fetching national parks data:', error);
    }
};


    // Mapping of park names to icon images
    const parkIcons = {
        'Arches National Park': ArchesIcon,
        'Bryce Canyon National Park': BryceIcon,
        'Canyonlands National Park': CanyonlandsIcon,
        'Capitol Reef National Park': CapitolReefIcon,
        'Cedar Breaks National Monument': CedarBreaksIcon,
        'Dinosaur National Monument': DinosaurIcon,
        'Glen Canyon National Recreation Area': GlenIcon,
        'Hovenweep National Monument': HovenweepIcon,
        'Natural Bridges National Monument': NaturalBridgeIcon,
        'Timpanogos Cave National Monument': TimpanogosIcon,
        'Rainbow Bridge National Monument': RainbowIcon,
        'Zion National Park': ZionIcon
    };

    useEffect(() => {
        if (parksData.length === 0) return;

        const centerMapButton = d3.select(svgRef.current)
        .append('foreignObject')
        .attr('width', 120)
        .attr('height', 150)
        .append('xhtml:div')
        .attr('class', 'center-map-button-container')
        .append('button');
      
      centerMapButton.append('img')
        .attr('src', CenterIcon)
        .attr('alt', 'Center Map')
        .attr('width', 130)
        .attr('height', 130)
        .on('click', () => {
          // Re-center the map
          const zoomTransform = d3.zoomIdentity.translate(0, 0).scale(1);
          d3.select(svgRef.current)
            .transition()
            .duration(1050)
            .call(zoomBehavior.transform, zoomTransform);
        });
      
    
        const path = d3.geoPath().projection(projectionRef.current);
    
        if (!mapGroupRef.current) {
            mapGroupRef.current = d3.select(svgRef.current).append('g');
        }
    
        mapGroupRef.current.selectAll('.utah')
            .data([GeoJSONData])
            .join('path')
            .attr('class', 'utah')
            .attr('d', path)
            .style('stroke', 'white')
            .style('stroke-width', 5)
            .attr('fill', 'url(#utahGradient)') // Apply the gradient fill
            .attr('rx', 10) // Set horizontal radius for rounded corners
            .attr('ry', 10); // Set vertical radius for rounded corners
    
        mapGroupRef.current.selectAll('.park-paths')
            .data(GeoJSONData.features)
            .join('path')
            .attr('class', 'park-paths')
            .attr('d', path)
            .attr('fill', 'transparent')
            .attr('stroke', 'black')
            .attr('stroke-width', 0);
    
            parksData.forEach((park) => {
                const [x, y] = projectionRef.current([park.longitude, park.latitude]);
            
                const parkGroup = mapGroupRef.current.append('g');
            
                parkGroup.append('image')
                .attr('class', 'park-icon')
                .attr('x', x - 10)
                .attr('y', y - 15)
                .attr('xlink:href', parkIcons[park.fullName])
                .on('click', () => {
                    // Remove the 'selected' class from all park icons
                    d3.selectAll('.park-icon').classed('selected', false);
                    // Add the 'selected' class to the clicked park icon
                    d3.select(event.currentTarget).classed('selected', true);
                    // Set the selected park
                    setSelectedPark(park);
                });
            
            
            // Update the selectedPark state in response to user interaction
            
                const titleBackground = parkGroup.append('rect')
                .style('opacity', '0%') // Initially hide the background
                    .attr('class', 'park-title-background')
                    .attr('x', x + 35) // Adjust x position to place the background behind the text
                    .attr('y', y - 40) // Adjust y position to place the background behind the text
                    .attr('width', '300px') // Set width based on text length
                    .attr('height', 35) // Set height
                    .attr('rx', 10) // Set horizontal radius for rounded corners
                    .attr('ry', 10) // Set vertical radius for rounded corners
                    .style('visibility', 'hidden') // Initially hide the background
                    .style('opacity', '0%'); // Initially hide the background
                
                const titleText = parkGroup.append('text')
                    .attr('class', 'park-title')
                    .attr('x', x + 40)
                    .attr('y', y - 18)
                    .text(park.fullName)
                    .style('font-size', '15px')
                    .style('fill', 'black')
                    .style('opacity', '0') // Initially hide the text
                    .style('visibility', 'hidden'); // Initially hide the text
            
                parkGroup.on('mouseover', function() {
                    titleBackground.style('visibility', 'visible'); // Show the background rectangle
                    titleText.style('opacity', '0').style('visibility', 'visible'); // Show the text
                }).on('mouseout', function() {
                    titleBackground.style('visibility', 'hidden'); // Hide the background rectangle
                    titleText.style('opacity', '0').style('visibility', 'hidden'); // Hide the text
                });
            });
            
    
        const zoomBehavior = zoom()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                mapGroupRef.current.attr('transform', event.transform);
            });
    
        d3.select(svgRef.current).call(zoomBehavior);
    
    }, [parksData]);


    useEffect(() => {
        if (!selectedPark) return;

        const [x, y] = projectionRef.current([selectedPark.longitude, selectedPark.latitude]);
    
        const zoomBehavior = zoom()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                mapGroupRef.current.attr('transform', event.transform);
            });
    
            const zoomTransform = d3.zoomIdentity.translate(30 - x, 50 - y).scale(1.8);
        
        d3.select(svgRef.current)
            .transition()
            .duration(750) // Animation duration in milliseconds
            .call(zoomBehavior.transform, zoomTransform);
    
    }, [selectedPark]);
    
    


    return (
        <div className="map-container">
            <svg ref={svgRef} className="interactive-map">
                <defs>
                    <linearGradient id="utahGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="48%" stopColor="#333333" />
                        <stop offset="57%" stopColor="#333333" />
                        
                    </linearGradient>
                </defs>
                {/* Your map content */}
            </svg>
            <InformationBox selectedPark={selectedPark} /> {/* Pass the selectedPark to InformationBox */}
        </div>
    );    
};

export default InteractiveMap;
