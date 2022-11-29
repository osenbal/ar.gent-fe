import React from 'react';
import './NotFound.style.css';

const NotFound: React.FC = () => {
  return (
    <div className="container_notFound">
      <p className="text_notFound_404">404</p>
      <img
        className="img_notFound"
        src={
          process.env.PUBLIC_URL + '/assets/img/ilustrations/img_notFound.png'
        }
        alt="404"
      />
      <p className="text_notFound">Not Found</p>
    </div>
  );
};

export default NotFound;
