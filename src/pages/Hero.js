import React from 'react'

export const Hero = () => {
    return (
        <div className="hero-container">
            <div className="hero-text">
                <div className="hero-head">
                    Keep Your Budget friendly, not Fiendly
                </div>
                <div className="hero-para">
                    Use BudTrack as your budget buddy and never forget to split between your buddies.
                </div>
                <div className="submit-btn join-btn">
                    <a href="/signup">Join Now !</a>
                </div>
            </div>
            <div className="hero-image">
                <img src="./assets/hero.png" alt="" />
            </div>
        </div>
    )
}
