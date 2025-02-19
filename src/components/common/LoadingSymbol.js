import React from 'react';
import ReactLoading from 'react-loading';

const LoadingSymbol = ({ type, color }) => (
	<ReactLoading type={type} color={color} height={60} width={60} />
);

export default LoadingSymbol;
