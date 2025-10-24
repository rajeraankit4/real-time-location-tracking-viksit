export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ padding: "8px 16px", margin: 4, cursor: "pointer" }}
    >
      {children}
    </button>
  );
}
