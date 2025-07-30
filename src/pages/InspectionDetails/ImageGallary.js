import React, { useState, useEffect, useRef } from 'react';
import './ImageGallary.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const BoundingBoxOverlay = ({ boundingBoxes, imageRef, scale }) => {
  console.log("bounding box")
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0, top: 0, left: 0 });

  useEffect(() => {
    const updateImageDimensions = () => {
      if (imageRef.current) {
        const { width, height, top, left } = imageRef.current.getBoundingClientRect();
        setImageDimensions({ width, height, top, left });
        console.log(width,height,left,top);
      }
    };

    updateImageDimensions();

    window.addEventListener('resize', updateImageDimensions);

    return () => {
      window.removeEventListener('resize', updateImageDimensions);
    };
  }, [imageRef, scale]);

  if (!imageRef.current || !imageDimensions.width || !imageDimensions.height) return null;

  const { width: imageWidth, height: imageHeight, top: imageTop, left: imageLeft } = imageDimensions;

  return (
    <div className="bounding-box-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100 }}>
      {boundingBoxes?.map((box, idx) => {
        let [x1, y1, x2, y2] = box?.bbox;
        console.log(box.bbox)
        const nx = ( x1 * ((imageWidth) / ((process.env.REACT_APP_NORMALIZED_WIDTH) * scale))); // Position X relative to scaled image width
        const ny = ((y1 * ((imageHeight) / ((process.env.REACT_APP_NORMALIZED_HEIGHT) * scale)))); // Position Y relative to scaled image height
        const nw = ((x2 - x1) * ((imageWidth) / ((process.env.REACT_APP_NORMALIZED_WIDTH) * scale))); // Width relative to scaled image width
        const nh = ((y2 - y1) * ((imageHeight) / ((process.env.REACT_APP_NORMALIZED_HEIGHT) * scale))); // Height relative to scaled image height

        const { label, color } = box.final_details;
        console.log("nx" + nx);
        // Convert color array to CSS color format (rgb or hex)
        const cssColor = `rgb(${color[2]}, ${color[1]}, ${color[0]})`;

        return (
          <div
            key={idx}
            className="bounding-box"
            style={{
              position: 'absolute',
              left: `${nx}px`,
              top: `${ny}px`,
              width: `${nw}px`,
              height: `${nh}px`,
              borderColor: cssColor,
              borderWidth: '1px',
              borderStyle: 'solid',
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                position: 'absolute',
                backgroundColor: cssColor,
                color: '#000',
                padding: '2px',
                top:'-12px',
                fontSize: `6px`, // Adjust font size based on scale
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const ImageGallary = ({ ModelDetails, metaData }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);
  const [forceUpdate, setForceUpdate] = useState(false); // State to force update BoundingBoxOverlay

  const imageTypes = ['top', 'bottom', 'up'];
  const images = [];

  imageTypes.forEach(type => {
    for (let i = 0; i < ModelDetails.ImageCount; i++) {
      const datetime = (ModelDetails?.datetime);
      const updateddate = (datetime)?.replace('T',' ');
      const dateFilter = `${((updateddate)?.split(' ')[0]).split('-')[0]}${((updateddate)?.split(' ')[0]).split('-')[1]}${((updateddate)?.split(' ')[0]).split('-')[2]}`;
      images.push({
        url: `http://${process.env.REACT_APP_IP_ADDRESS}:5000/modelLevel/${dateFilter}/${ModelDetails?.Model}/${type}/${ModelDetails?.ChassisNumber}_${ModelDetails?.Model}_${type}_${i + 1}.jpg`,
        // url: `http://${process.env.REACT_APP_IP_ADDRESS}:5000/modelLevel/${ModelDetails?.ChassisNumber}_${ModelDetails?.Model}_${type}_${i + 1}.jpg`,
        type,
        index: i+1,
      });
      // console.log(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/modelLevel/${((ModelDetails?.datetime)?.split('T')[0]).split('-')[0]}${((ModelDetails?.datetime)?.split('T')[0]).split('-')[1]}${((ModelDetails?.datetime)?.split('T')[0]).split('-')[2]}/${ModelDetails?.Model}/${type}/${ModelDetails?.ChassisNumber}_${ModelDetails?.Model}_${type}_${i + 1}.jpg`)
    }
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (previewImage) {
        if (event.key === 'ArrowRight') {
          nextImage();
        } else if (event.key === 'ArrowLeft') {
          prevImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [previewImage, currentIndex]);

  const handleImageClick = (image, idx) => {
    setPreviewImage(image.url);
    setCurrentIndex(idx);
    setScale(1); // Reset scale on new image
    setRotate(0); // Reset rotation on new image
    setImageLoaded(false); // Reset image loaded state
    setForceUpdate(prev => !prev); // Toggle force update to trigger BoundingBoxOverlay update
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const zoomIn = () => {
    setScale(prevScale => prevScale + 0.1);
  };

  const zoomOut = () => {
    setScale(prevScale => (prevScale > 0.1 ? prevScale - 0.1 : prevScale));
  };

  const rotateImage = () => {
    setRotate(prevRotate => prevRotate + 90);
  };

  const nextImage = () => {
    const nextIndex = currentIndex + 1;
    console.log(nextIndex,images);
    if (nextIndex < images.length) {
      console.log("ni"+nextIndex);
      handleImageClick(images[nextIndex], nextIndex);
      
    }
  };

  const prevImage = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      handleImageClick(images[prevIndex], prevIndex);
    }
  };

  return (
    <div className="factory-inspection-details" style={{ width: '100%' }}>
      <div className="content" style={{ width: '100%' }}>
        <div className="image-section" style={{ width: '100%' }}>
          <div className="image-container" style={{ width: '100%', borderRadius: '5px', position: 'relative' }}>
            {images.map((image, idx) => (
              <React.Fragment key={`${image.type}_${idx}`} onClick={() => handleImageClick(image, idx)}>
                <div className='container' onClick={() => handleImageClick(image, idx)}>
                  <img src={image.url} style={{ width: '100px', height: '80px', borderRadius: '5px' }} />
                  <div className='image_1'>
                    <div className='middle'>
                      <RemoveRedEyeIcon />
                      <p style={{ fontSize: '12px' }}>PREVIEW</p>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="data-section">
          {/* Defect information (same as before) */}
        </div>
      </div>
  
      {previewImage && (
        <div className="image-preview">
          <button onClick={closePreview} style={{ borderRadius: '50%', padding: '10px', position: 'absolute', top: '10%', right: '10px' }}>
            <CloseIcon />
          </button>
          <div style={{ position: 'relative', display: 'inline-block', marginTop: '5%',width:'max-content',height:'max-content',transform: `scale(${scale}) rotate(${rotate}deg)` }}>
            <img
              ref={imageRef}
              src={previewImage}
              alt="Full Inspection Image"
              style={{  cursor: 'grab' }}
              onLoad={() => setImageLoaded(true)} // Update image loaded state
            />
            {imageLoaded && metaData && (
              <BoundingBoxOverlay
                key={forceUpdate} // Use key to force update BoundingBoxOverlay
                boundingBoxes={metaData[`${ModelDetails?.ChassisNumber}_${ModelDetails?.Model}_${images[currentIndex].type}_${(images[currentIndex].index)}`]}
                imageRef={imageRef}
                scale={scale}
              />
            )}
          </div>
          <div className="image-controls" style={{ zIndex: 1111 }}>
            {currentIndex > 0 && (
              <button onClick={prevImage}>
                <ArrowBackIcon />
              </button>
            )}
            <button onClick={zoomIn}>
              <ZoomInIcon />
            </button>
            <button onClick={zoomOut}>
              <ZoomOutIcon />
            </button>
            <button onClick={rotateImage}>
              <RotateRightIcon />
            </button>
            {currentIndex < images.length - 1 && (
              <button onClick={nextImage}>
                <ArrowForwardIcon />
              </button>
            )}
          </div>
          <div className="image-index" style={{ zIndex: 13 }}>
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};



export default ImageGallary;
