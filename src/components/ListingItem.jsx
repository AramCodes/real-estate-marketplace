import { Link } from "react-router-dom";
import DeleteIcon from "../assets/svg/deleteIcon.svg";
import EditIcon from "../assets/svg/editIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";

const ListingItem = ({ listing, id, onDelete, onEdit }) => {
    return (
        <li className="categoryListing">
            <Link
                to={`/category/${listing.type}/${id}`}
                className="categoryListingLink"
            >
                <img
                    src={listing.imageUrls[0]}
                    alt={listing.name}
                    className="categoryListingImg"
                />
                <div className="categoryListingDetails">
                    <p className="categoryListingLocation">
                        {listing.location}
                    </p>
                    <p className="categoryListingName">{listing.name}</p>
                    <p className="categoryListingPrice">
                        $
                        {listing.offer
                            ? listing.discountedPrice
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : listing.regularPrice
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        {listing.type === "rent" && "/ Month"}
                    </p>
                    <div className="categoryListingInfoDiv">
                        <img src={bedIcon} alt="bedrooms" />
                        <p className="categoryListingInfoText">
                            {listing.bedrooms > 1
                                ? `${listing.bedrooms} Bedrooms`
                                : "1 Bedroom"}
                        </p>
                        <img src={bathtubIcon} alt="bathrooms" />
                        <p className="categoryListingInfoText">
                            {listing.bathrooms > 1
                                ? `${listing.bathrooms} Bathrooms`
                                : "1 Bathroom"}
                        </p>
                    </div>
                </div>
            </Link>

            {onDelete && (
                <img
                    src={DeleteIcon}
                    className="removeIcon"
                    alt="remove listing"
                    onClick={() => onDelete(listing.id, listing.name)}
                />
            )}

            {onEdit && (
                <img
                    src={EditIcon}
                    className="editIcon"
                    alt="edit icon"
                    onClick={() => onEdit(id)}
                />
            )}
        </li>
    );
};

export default ListingItem;
