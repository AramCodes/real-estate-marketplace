import { useNavigate } from "react-router-dom";
import OfferIcon from "../assets/svg/localOfferIcon.svg";
import ExploreIcon from "../assets/svg/exploreIcon.svg";
import PersonOutlineIcon from "../assets/svg/personOutlineIcon.svg";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <footer className="navbar">
            <nav className="navbarNav">
                <ul className="navbarListItems">
                    <li
                        className="navbarListItem"
                        onClick={() => navigate("/")}
                    >
                        <img
                            src={ExploreIcon}
                            alt="explore nearby"
                            className="links"
                        />
                        <p className="navbarListItemName">Explore</p>
                    </li>
                    <li
                        className="navbarListItem"
                        onClick={() => navigate("/offers")}
                    >
                        <img
                            src={OfferIcon}
                            alt="view offers"
                            className="links"
                        />
                        <p className="navbarListItemName">Offers</p>
                    </li>
                    <li
                        className="navbarListItem"
                        onClick={() => navigate("/profile")}
                    >
                        <img
                            src={PersonOutlineIcon}
                            alt="profile"
                            className="links"
                        />
                        <p className="navbarListItemName">Profile</p>
                    </li>
                </ul>
            </nav>
        </footer>
    );
};

export default Navbar;
