import React, { useState, useEffect } from "react";

const initialMessagePark = {
  fullName: "Select a park on the map.",
  description: "",
  location: "",
  visitors: "",
  images: [],
  activities: [],
  amenities: [],
};

const InformationBox = ({ selectedPark }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [content, setContent] = useState(initialMessagePark);
  const [showImages, setShowImages] = useState(false);
  const [isActivitiesOpen, setIsActivitiesOpen] = useState(false);

  useEffect(() => {
    if (selectedPark) {
      setIsVisible(false);
      setShowImages(false);
      setTimeout(() => {
        setContent(selectedPark);
        setIsVisible(true);
        setShowImages(true);
      }, 800);
    }
  }, [selectedPark]);

  const toggleActivities = () => {
    setIsActivitiesOpen(!isActivitiesOpen);
  };

  useEffect(() => {
    if (selectedPark) {
      setIsVisible(false);
      setShowImages(false);
      setIsActivitiesOpen(false);
      setTimeout(() => {
        setContent(selectedPark);
        setIsVisible(true);
        setShowImages(true);
      }, 1000);
    }
  }, [selectedPark]);

  return (
    <div className={`information-box ${isVisible ? "selected" : ""}`}>
      <div className="information-box-content">
        <h2 className={`box-title ${isVisible ? "visible" : ""}`}>
          {content.fullName}
        </h2>
        <p className={`box-desc ${isVisible ? "visible" : ""}`}>
          {content.description}
        </p>
        <div className="accordion">
          {content !== initialMessagePark && (
            <button className="accordion-button" onClick={toggleActivities}>
              Activities
            </button>
          )}
          <div
            className={`accordion-content ${
              isActivitiesOpen ? "open" : "closed"
            }`}
          >
            <ul>
              {content.activities.map((activity) => (
                <li key={activity.id}>{activity.name}</li>
              ))}
            </ul>
          </div>
        </div>
        {content !== initialMessagePark && (
          <div className={`image-gallery ${showImages ? "visible" : ""}`}>
            {content.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText}
                className={`image ${showImages ? "visible" : ""}`}
                style={{
                  animation: showImages
                    ? `fadeInAnimation 1s ease-in-out ${index * 0.5}s forwards`
                    : "none",
                  transitionDelay: `${index * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InformationBox;
