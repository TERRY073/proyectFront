import React from 'react';
import './SectionPage.css';

const SectionPage = ({ title, subtitle, note }) => {
  return (
    <section className="section-page">
      <div className="section-page__card">
        <h2>{title}</h2>
        {subtitle ? <p className="section-page__subtitle">{subtitle}</p> : null}
        {note ? <p className="section-page__note">{note}</p> : null}
      </div>
    </section>
  );
};

export default SectionPage;
