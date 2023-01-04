import React from 'react'

const Error = ({ siteName, error, msg }) => {
    document.title = `Error | ${siteName}`;

    return (
        <>
            <div className="error-page">
                <div>
                    <h1>{error}</h1>
                    <p>{msg}</p>
                    <a href="/" className='btn-main mt-5'>Home</a>
                </div>
            </div>
        </>
    )
}

export default Error