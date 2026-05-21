'use client';

export default function StillPoster({ project }) {
  const words = project.title.split(' ');
  return (
    <div className="still-poster">
      <div className="frame" />
      <div className="corners" />
      <div className="num">{(project.cat || '').toUpperCase()} · {project.year}</div>
      <div className="name">
        {words.map((w, i) => (
          <span key={i}>
            <span className={i % 2 === 1 ? 'it' : ''}>{w}</span>
            {i < words.length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  );
}
