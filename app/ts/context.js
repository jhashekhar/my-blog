'use client';

import React from 'react';

export const AuthContext = React.createContext({ isLoggedIn: false });

export default function AuthProvider({ children }) {
	const [isLoggedIn, setIsLoggedIn] = React.useState(false);

	return (
		<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
			{children}
		</AuthContext.Provider>
	);
}
