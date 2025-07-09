import React from 'react';
import './Header.scss';

interface HeaderProps {
  title: string;
}

function Header({ title }: HeaderProps): React.JSX.Element {
  return (
    <header className="header">
      <h1 className="header__title">{title}</h1>
    </header>
  );
}

export default Header;
