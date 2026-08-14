export const getDetailsStyle = (val) => ({
  overlay: {
    zIndex: 1500,
    background: "rgba(255,255,255,.9)",
  },
  content: {
    ...val,
    background: "transparent",
    border: "0",
    display: "flex",
    padding: 0,
    top: "50%",
    left: "50%",
    transform: "translate3d(-50%, -50%, 0)",
    overflow: "visible",
  },
});

export const anthemStyle = {
  overlay: {
    zIndex: 1000,
    background: "transparent",
    pointerEvents: "none",
  },
  content: {
    pointerEvents: "all",
    width: 240,
    height: 135,
    border: 0,
    padding: 0,
    right: 20,
    top: "auto",
    left: "auto",
    bottom: 20,
    overflow: "visible",
  },
};
