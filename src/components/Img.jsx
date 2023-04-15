import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Img = ({ src, alt, className }) => (
  <div>
    <LazyLoadImage
      alt={alt || ""}
      src={src || ""} // use normal <img> attributes as props
      effect="blur"
      className={className || ""}
    />
  </div>
);

export default Img;
