import './style.css';

function Loading ({ loading = true }) {
  if (!loading) return null;
  return <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>;
}

export default Loading;
