const Container = ({
  children,
  size = "lg",
  className = "",
  style = {},
}) => {
  return (
    <div
      className={`container container-${size} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Container;