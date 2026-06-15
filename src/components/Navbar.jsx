import PropTypes from 'prop-types';

function Navbar({ navOpen, onNavClick }) {
  const navItems = [
    { label: 'Home', link: '#home' },
    { label: 'About', link: '#about' },
    { label: 'Experience', link: '#experience' },
    { label: 'Work', link: '#work' },
    { label: 'Contact', link: '#contact' },
  ];

  return (
    <nav className={'navbar ' + (navOpen ? 'active' : '')}>
      {navItems.map(({ label, link }, key) => (
        <a
          href={link}
          key={key}
          className="nav-link"
          onClick={onNavClick}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

Navbar.propTypes = {
  navOpen: PropTypes.bool.isRequired,
  onNavClick: PropTypes.func,
};

export default Navbar;
