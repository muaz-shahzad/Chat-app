import React from 'react'

const NotFound = () => {
    return (
        <>
            <div className="min-h-screen flex flex-col justify-center items-center bg-white">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-2xl text-gray-600 mb-4">Page Not Found</p>
                <p className="text-center text-gray-500">The page you are looking for doesn't exist or has been moved.</p>
            </div>
        </>
    )
}

export default NotFound