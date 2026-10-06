import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css"

export const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-title">
                <h2 className={styles.Title}>Pokémon</h2>
            </div>
            <div className="navbar-manu">
                <NavLink 
                  to="/"
                  end
                  className={({ isActive }) => 
                    isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                    ListView
                </NavLink>

                <NavLink 
                  to="/gallery"
                  end
                  className={({ isActive }) => 
                    isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                    GalleryView
                </NavLink>
            </div>
        </nav>
    );
};