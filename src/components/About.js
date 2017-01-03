import React from 'react';
import Helmet from 'react-helmet';

export default () => (
  <div>
    <Helmet
      title="About us"
      meta={[{ name: 'description', content: 'Helmet application' },
							{ property: 'og:type', content: 'article' }]}
    />
    About this page
  </div>
);
