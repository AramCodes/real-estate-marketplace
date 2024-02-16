import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";

const ListingSlider = ({ listing }) => {
    return (
        <Carousel>
            {listing.imageUrls.map((imageUrl, index) => {
                return (
                    <Carousel.Item key={index}>
                        <img
                            style={{ height: "55vh" }}
                            className="d-block w-100"
                            src={imageUrl}
                            alt={`Slide #${index + 1} for ${listing.title}`}
                        />
                        <Carousel.Caption>
                            <h3>{`Slide # ${index + 1} of ${
                                listing.imageUrls.length
                            }`}</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                );
            })}
        </Carousel>
    );
};

export default ListingSlider;
