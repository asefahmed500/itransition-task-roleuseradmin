import React from 'react';

const Banner = () => {
    return (
        <div>
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Manage Users with Ease</h1>
                        <p className="py-6">
                            Streamline user management, roles, permissions, and activity tracking with our powerful and
                            intuitive platform. Designed for teams of all sizes.
                        </p>
                        <button className="btn btn-primary">Get Started</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;