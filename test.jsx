import React, { useState, useEffect } from 'react';

const initialMessagePark = {
    fullName: 'Select a park on the map to see more information.',
    description: '',
    location: '',
    visitors: '',
    images: []
};

const InformationBox = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [content, setContent] = useState(initialMessagePark);

    useEffect(() => {
        setIsVisible(false); // Start fade out animation
        setTimeout(() => {
            setContent(initialMessagePark); // Set new content (initial message)
            setIsVisible(true); // Start fade in animation
        }, 500); // Use 1000 milliseconds to match the transition duration
    }, []);

    return (
        <div className={`information-box ${isVisible ? 'selected' : ''}`}>
            <div className="information-box-content">
                <h2>{content.fullName}</h2>
                <p>{content.description}</p>
                <p>Location: {content.location}</p>
                <p>Visitors: {content.visitors}</p>
                {content.images && (
                    <div className="image-gallery">
                        {content.images.map((image, index) => (
                            <img key={index} src={image.url} alt={image.altText} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InformationBox;

