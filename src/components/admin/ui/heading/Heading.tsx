import React from 'react';

const Heading: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <h1 className="text-2xl font-bold">{children}</h1>;
};

export default Heading;
