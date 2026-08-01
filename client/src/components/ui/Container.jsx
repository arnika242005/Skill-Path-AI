const Container = ({ children, size = 'lg', className = '' }) => {
  return <div className={`container container-${size} ${className}`}>{children}</div>;
};

export default Container;